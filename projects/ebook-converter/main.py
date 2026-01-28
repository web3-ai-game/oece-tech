#!/usr/bin/env python3
import os
import sys
import shutil
import logging
from pathlib import Path
from typing import List, Dict
from tqdm import tqdm
from datetime import datetime

from config import *
from llm_converter import LLMConverter
from ebook_extractor import EbookExtractor
from wittgenstein_indexer import WittgensteinIndexer
from s3_uploader import S3Uploader
from mongodb_handler import MongoDBHandler
from markdown_beautifier import MarkdownBeautifier

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class EbookConverterPipeline:
    def __init__(self):
        # Use new LLM Converter (X.AI -> Gemini fallback)
        self.llm = LLMConverter('fast')
        self.extractor = EbookExtractor()
        self.indexer = WittgensteinIndexer(INDEX_DIR)
        self.s3 = S3Uploader()
        self.mongo = MongoDBHandler()
        self.beautifier = MarkdownBeautifier()
        
        os.makedirs(BAIDU_CACHE_DIR, exist_ok=True)
        os.makedirs(MD_OUTPUT_DIR, exist_ok=True)
        os.makedirs(INDEX_DIR, exist_ok=True)
        
        logger.info("電子書轉換管道初始化完成 (X.AI + MongoDB + Beautifier Enabled)")
    
    def process_single_file(self, file_path: str) -> Dict:
        """處理單個文件"""
        filename = Path(file_path).name
        logger.info(f"開始處理: {filename}")
        
        # Check MongoDB first to avoid reprocessing
        if self.mongo.document_exists(filename):
             logger.info(f"文件已存在於 MongoDB，跳過: {filename}")
             # We can optionally fetch the doc_id if needed, but for now just return success
             return {'success': True, 'skipped': True, 'reason': 'exists_in_mongo'}

        try:
            logger.info("步驟 1/5: 提取文本內容")
            extracted = self.extractor.extract(file_path)
            
            if not extracted['text']:
                logger.warning(f"無法提取內容: {filename}")
                return {'success': False, 'error': 'no_text'}
            
            logger.info(f"提取完成: {len(extracted['text'])} 字符")
            
            logger.info("步驟 2/5: 使用 AI (X.AI/Gemini) 轉換為 Markdown")
            # For simplicity in this version, we process the whole text or chunks.
            # LLMConverter handles chunks internally if we used batch_convert, 
            # but current LLMConverter.convert_text_to_markdown takes full text or we handle chunks here.
            # Let's chunk it here to be safe with context limits.
            
            text_chunks = self._split_text(extracted['text'], CHUNK_SIZE)
            markdown_parts = []
            
            metadata = {
                'filename': filename,
                'type': Path(file_path).suffix,
                **extracted['metadata']
            }
            
            for i, chunk in enumerate(text_chunks):
                logger.info(f"  - 處理塊 {i+1}/{len(text_chunks)}")
                chunk_md = self.llm.convert_text_to_markdown(chunk, metadata)
                markdown_parts.append(chunk_md)
            
            markdown_text = "\n\n".join(markdown_parts)
            
            # Beautify Markdown
            logger.info("步驟 2.5/5: 美化 Markdown 排版")
            try:
                markdown_text = self.beautifier.beautify_novel(markdown_text, filename)
            except Exception as e:
                logger.warning(f"美化失敗，使用原始文本: {e}")

            md_filename = Path(filename).stem + '.md'
            md_path = os.path.join(MD_OUTPUT_DIR, md_filename)
            
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(f"# {filename}\n\n")
                f.write(f"**原始格式**: {metadata['type']}\n\n")
                f.write(f"**處理時間**: {datetime.now().isoformat()}\n\n")
                f.write("---\n\n")
                f.write(markdown_text)
            
            logger.info(f"Markdown 已保存: {md_path}")
            
            logger.info("步驟 3/5: 提取維根斯坦結構")
            structure = self.llm.extract_structure(markdown_text, filename)
            
            logger.info("步驟 4/5: 創建索引 & 存入 MongoDB")
            
            # Generate doc_id based on file path hash (consistent ID)
            import hashlib
            doc_id = hashlib.sha256(file_path.encode()).hexdigest()[:16]
            
            # Legacy local indexer (Optional)
            if ENABLE_LOCAL_INDEX:
                try:
                    self.indexer.add_document(file_path, md_path, structure)
                    self.indexer.save_index()
                except Exception as e:
                    logger.warning(f"Local indexing failed (ignoring): {e}")
            
            # MongoDB Storage
            mongo_doc_id = self.mongo.save_document(filename, markdown_text, metadata)
            if mongo_doc_id:
                self.mongo.save_structure(mongo_doc_id, structure)
            
            logger.info("步驟 5/5: 上傳到 S3")
            self.s3.upload_markdown(md_path, doc_id)
            self.s3.upload_structure(doc_id, structure)
            
            logger.info(f"✓ 處理完成: {filename}")
            
            return {
                'success': True,
                'doc_id': doc_id,
                'mongo_id': mongo_doc_id,
                'markdown_path': md_path,
                'propositions': len(structure.get('propositions', [])),
                'concepts': len(structure.get('concepts', []))
            }
            
        except Exception as e:
            logger.error(f"處理失敗 {filename}: {e}")
            return {'success': False, 'error': str(e)}
    
    def _split_text(self, text: str, chunk_size: int) -> List[str]:
        """分割文本為塊"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
        
        return chunks
    
    def process_directory(self, directory: str):
        """處理目錄中的所有文件"""
        files = []
        for ext in SUPPORTED_FORMATS:
            files.extend(Path(directory).glob(f"**/*{ext}"))
        
        logger.info(f"找到 {len(files)} 個文件")
        
        results = []
        for file_path in tqdm(files, desc="處理文件"):
            result = self.process_single_file(str(file_path))
            results.append(result)
            
            if len(results) % BATCH_SIZE == 0:
                self._cleanup_cache()
        
        self._finalize()
        
        success_count = sum(1 for r in results if r['success'])
        logger.info(f"處理完成: {success_count}/{len(results)} 成功")
    
    def _cleanup_cache(self):
        """清理緩存"""
        logger.info("清理緩存...")
        for item in os.listdir(BAIDU_CACHE_DIR):
            item_path = os.path.join(BAIDU_CACHE_DIR, item)
            try:
                if os.path.isfile(item_path):
                    os.remove(item_path)
            except Exception as e:
                logger.error(f"清理失敗 {item}: {e}")
    
    def _finalize(self):
        """完成處理"""
        if not ENABLE_LOCAL_INDEX:
            logger.info("Local indexing disabled, skipping final index upload")
            return

        logger.info("上傳最終索引...")
        
        index_export = self.indexer.export_for_s3()
        self.s3.upload_index(index_export['master_index'], 'master')
        self.s3.upload_index(index_export['propositions'], 'propositions')
        self.s3.upload_index(index_export['concepts'], 'concepts')
        self.s3.upload_index(index_export['relations'], 'relations')
        
        stats = self.indexer.get_stats()
        logger.info("=" * 60)
        logger.info("處理完成統計:")
        logger.info(f"  文檔數: {stats['total_documents']}")
        logger.info(f"  命題數: {stats['total_propositions']}")
        logger.info(f"  概念數: {stats['total_concepts']}")
        logger.info(f"  關係數: {stats['total_relations']}")
        logger.info("=" * 60)

if __name__ == "__main__":
    pipeline = EbookConverterPipeline()
    
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if os.path.isfile(target):
            pipeline.process_single_file(target)
        elif os.path.isdir(target):
            pipeline.process_directory(target)
        else:
            logger.error(f"無效的路徑: {target}")
    else:
        logger.info("使用方法: python main.py <文件或目錄路徑>")
        logger.info("或者從百度網盤下載後處理")
