#!/usr/bin/env python3
"""
知識庫處理器 - 從簡單到複雜，系統化處理整個知識庫
1. 優先處理簡單格式 (EPUB, MOBI, DOCX)
2. 然後處理文字版 PDF
3. 跳過已處理文件
4. 質量驗證和回查機制
5. 整理到 VPS 和 S3
"""
import os
import sys
import hashlib
import logging
import json
from pathlib import Path
from typing import List, Dict, Optional, Tuple, Generator
from datetime import datetime
from multi_cloud_downloader import MultiCloudDownloader
from main import EbookConverterPipeline
from mongodb_handler import MongoDBHandler
from s3_uploader import S3Uploader
from config import MD_OUTPUT_DIR
import fitz  # PyMuPDF

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class KnowledgeBaseProcessor:
    """知識庫處理器 - 從簡單到複雜"""
    
    # 處理優先級 (數字越小越優先)
    FORMAT_PRIORITY = {
        # 最簡單 - 純文字格式
        '.epub': 1,
        '.mobi': 2,
        '.azw': 2,
        '.azw3': 2,
        # 中等 - Office 文檔
        '.docx': 3,
        '.doc': 4,
        '.rtf': 5,
        # 較難 - 需要分析的 PDF
        '.pdf': 10,
        # 最難 - 純文本 (百度網盤上常損壞)
        '.txt': 20,
    }
    
    # 跳過 OCR 的關鍵詞 (圖片版古籍)
    SKIP_OCR_KEYWORDS = [
        '县志', '縣志', '方志', '府志', '州志', '省志',
        '古籍', '善本', '影印', '手抄', '毛筆', '書法',
        '碑帖', '拓片', '線裝', '刻本', '抄本',
        '天一阁', '四庫', '永樂大典', '古今圖書集成'
    ]
    
    def __init__(self):
        self.downloader = MultiCloudDownloader()
        self.pipeline = EbookConverterPipeline()
        self.mongo = MongoDBHandler()
        self.s3 = S3Uploader()
        self.md_output_dir = Path(MD_OUTPUT_DIR)
        self.md_output_dir.mkdir(parents=True, exist_ok=True)
        
        # 統計
        self.stats = {
            'scanned': 0,
            'skipped_duplicate': 0,
            'skipped_image_pdf': 0,
            'skipped_format': 0,
            'processed': 0,
            'failed': 0,
            'quality_issues': 0,
            'quality_passed': 0
        }
        
        # 載入已處理文件列表
        self.processed_files = self._load_processed_files()
        
        # 處理日誌
        self.process_log = []
        
    def _load_processed_files(self) -> set:
        """從 MongoDB 和本地目錄載入已處理文件"""
        processed = set()
        
        # 從 MongoDB 獲取
        try:
            docs = self.mongo.get_all_documents()
            for doc in docs:
                if 'filename' in doc:
                    base_name = Path(doc['filename']).stem
                    processed.add(base_name.lower())
                    # 也添加原始文件名
                    processed.add(doc['filename'].lower())
        except Exception as e:
            logger.warning(f"無法從 MongoDB 載入已處理列表: {e}")
        
        # 從本地 Markdown 目錄獲取
        for md_file in self.md_output_dir.glob("*.md"):
            base_name = md_file.stem
            processed.add(base_name.lower())
            
        logger.info(f"已載入 {len(processed)} 個已處理文件記錄")
        return processed
    
    def _is_duplicate(self, filename: str) -> bool:
        """檢查是否已處理過"""
        base_name = Path(filename).stem.lower()
        return base_name in self.processed_files or filename.lower() in self.processed_files
    
    def _get_format_priority(self, filename: str) -> int:
        """獲取文件格式優先級"""
        ext = Path(filename).suffix.lower()
        return self.FORMAT_PRIORITY.get(ext, 100)
    
    def _classify_pdf(self, local_path: str, filename: str) -> Tuple[str, str]:
        """智能分類 PDF"""
        filename_lower = filename.lower()
        
        # 檢查是否應該跳過 (古籍/縣志)
        for kw in self.SKIP_OCR_KEYWORDS:
            if kw in filename_lower:
                return ('skip', f'文件名包含古籍關鍵詞: {kw}')
        
        try:
            doc = fitz.open(local_path)
            total_pages = len(doc)
            
            if total_pages == 0:
                doc.close()
                return ('skip', 'PDF 無頁面')
            
            # 抽樣檢查前 5 頁
            sample_pages = min(5, total_pages)
            text_chars = 0
            image_count = 0
            
            for i in range(sample_pages):
                page = doc[i]
                text = page.get_text()
                text_chars += len(text.strip())
                image_count += len(page.get_images())
            
            doc.close()
            
            avg_chars_per_page = text_chars / sample_pages
            avg_images_per_page = image_count / sample_pages
            
            # 如果平均每頁文字 > 100 字符，認為是文字版
            if avg_chars_per_page > 100:
                return ('text', f'文字版 PDF (平均 {avg_chars_per_page:.0f} 字符/頁)')
            
            # 如果圖片多且文字少，認為是掃描版
            if avg_images_per_page > 0.5 and avg_chars_per_page < 50:
                return ('image', f'掃描版 PDF (平均 {avg_images_per_page:.1f} 圖片/頁, {avg_chars_per_page:.0f} 字符/頁)')
            
            return ('skip', f'無法確定類型 (平均 {avg_chars_per_page:.0f} 字符/頁)')
            
        except Exception as e:
            logger.error(f"PDF 分析失敗 {filename}: {e}")
            return ('skip', f'分析失敗: {e}')
    
    def _validate_markdown(self, md_path: str, original_filename: str) -> Tuple[bool, List[str]]:
        """驗證 Markdown 質量 - 增強版"""
        issues = []
        
        try:
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 檢查 1: 文件不能太小
            if len(content) < 500:
                issues.append(f'內容過短 ({len(content)} 字符)')
            
            # 檢查 2: 不能有大量亂碼 (mojibake)
            mojibake_patterns = ['ã', 'â', 'Ã', 'Â', 'ï¿½', '锟斤拷', '烫烫烫', '屯屯屯']
            mojibake_count = sum(content.count(p) for p in mojibake_patterns)
            if mojibake_count > 10:
                issues.append(f'檢測到亂碼 ({mojibake_count} 處)')
            
            # 檢查 3: 應該有一些結構 (標題)
            header_count = content.count('\n#')
            if header_count == 0 and len(content) > 5000:
                issues.append('缺少標題結構')
            
            # 檢查 4: 不能全是空行或重複內容
            lines = [l.strip() for l in content.split('\n') if l.strip()]
            if len(lines) < 10:
                issues.append(f'有效行數過少 ({len(lines)} 行)')
            
            # 檢查 5: 重複行比例
            unique_lines = set(lines)
            if len(lines) > 0:
                unique_ratio = len(unique_lines) / len(lines)
                if unique_ratio < 0.3:
                    issues.append(f'重複內容過多 (唯一行比例: {unique_ratio:.1%})')
            
            # 檢查 6: 檢查是否有實際中文內容 (針對中文文檔)
            chinese_chars = sum(1 for c in content if '\u4e00' <= c <= '\u9fff')
            if chinese_chars < 100 and len(content) > 1000:
                # 可能是英文文檔，檢查英文單詞
                english_words = len(content.split())
                if english_words < 50:
                    issues.append(f'內容稀疏 (中文字符: {chinese_chars}, 英文單詞: {english_words})')
            
            return (len(issues) == 0, issues)
            
        except Exception as e:
            return (False, [f'讀取失敗: {e}'])
    
    def scan_folder(self, folder_path: str) -> Generator[Dict, None, None]:
        """掃描文件夾，按優先級排序返回文件"""
        logger.info(f"開始掃描文件夾: {folder_path}")
        
        files_by_priority = {}
        
        for file_info in self.downloader.yield_baidu_files(f"/apps/bypy/{folder_path}"):
            self.stats['scanned'] += 1
            filename = file_info['name']
            
            # 檢查重複
            if self._is_duplicate(filename):
                self.stats['skipped_duplicate'] += 1
                continue
            
            # 獲取優先級
            priority = self._get_format_priority(filename)
            
            # 跳過不支持的格式
            if priority >= 100:
                self.stats['skipped_format'] += 1
                continue
            
            file_info['priority'] = priority
            
            if priority not in files_by_priority:
                files_by_priority[priority] = []
            files_by_priority[priority].append(file_info)
        
        # 按優先級排序輸出
        for priority in sorted(files_by_priority.keys()):
            for file_info in files_by_priority[priority]:
                yield file_info
        
        logger.info(f"掃描完成: 共 {self.stats['scanned']} 個文件")
    
    def process_file(self, file_info: Dict) -> bool:
        """處理單個文件"""
        filename = file_info['name']
        ext = Path(filename).suffix.lower()
        
        logger.info(f"\n{'='*60}")
        logger.info(f"處理: {filename}")
        logger.info(f"優先級: {file_info.get('priority')} | 格式: {ext}")
        logger.info(f"{'='*60}")
        
        # 下載文件
        local_path = self.downloader.download_file(file_info)
        if not local_path or not os.path.exists(local_path):
            logger.error(f"下載失敗: {filename}")
            self.stats['failed'] += 1
            self.process_log.append({
                'filename': filename,
                'status': 'download_failed',
                'time': datetime.now().isoformat()
            })
            return False
        
        # 如果是 PDF，先分類
        if ext == '.pdf':
            pdf_type, reason = self._classify_pdf(local_path, filename)
            logger.info(f"PDF 分類結果: {pdf_type} - {reason}")
            
            if pdf_type == 'skip' or pdf_type == 'image':
                self.stats['skipped_image_pdf'] += 1
                logger.info(f"跳過圖片版 PDF: {filename}")
                self.process_log.append({
                    'filename': filename,
                    'status': 'skipped_image_pdf',
                    'reason': reason,
                    'time': datetime.now().isoformat()
                })
                try:
                    os.remove(local_path)
                except:
                    pass
                return True
        
        # 執行轉換
        try:
            result = self.pipeline.process_single_file(local_path)
            
            if not result.get('success'):
                logger.error(f"轉換失敗: {filename} - {result.get('error')}")
                self.stats['failed'] += 1
                self.process_log.append({
                    'filename': filename,
                    'status': 'conversion_failed',
                    'error': result.get('error'),
                    'time': datetime.now().isoformat()
                })
                return False
            
            md_path = result.get('markdown_path')
            
            # 質量驗證
            if md_path and os.path.exists(md_path):
                is_valid, issues = self._validate_markdown(md_path, filename)
                
                if not is_valid:
                    logger.warning(f"質量問題: {filename}")
                    for issue in issues:
                        logger.warning(f"  - {issue}")
                    self.stats['quality_issues'] += 1
                    self.process_log.append({
                        'filename': filename,
                        'status': 'quality_issues',
                        'issues': issues,
                        'md_path': md_path,
                        'time': datetime.now().isoformat()
                    })
                else:
                    logger.info(f"✓ 質量驗證通過: {filename}")
                    self.stats['quality_passed'] += 1
                    self.process_log.append({
                        'filename': filename,
                        'status': 'success',
                        'md_path': md_path,
                        'time': datetime.now().isoformat()
                    })
            
            # 更新已處理列表
            base_name = Path(filename).stem.lower()
            self.processed_files.add(base_name)
            self.processed_files.add(filename.lower())
            
            self.stats['processed'] += 1
            logger.info(f"✓ 處理成功: {filename}")
            return True
            
        except Exception as e:
            logger.error(f"處理異常: {filename} - {e}")
            self.stats['failed'] += 1
            self.process_log.append({
                'filename': filename,
                'status': 'exception',
                'error': str(e),
                'time': datetime.now().isoformat()
            })
            return False
        finally:
            # 清理緩存
            try:
                if local_path and os.path.exists(local_path):
                    os.remove(local_path)
            except:
                pass
    
    def run(self, folder_path: str = "知識庫", max_files: int = None, 
            skip_pdf: bool = False, only_simple: bool = False):
        """運行處理流程"""
        logger.info("="*60)
        logger.info("知識庫處理器啟動")
        logger.info(f"目標文件夾: {folder_path}")
        logger.info(f"最大處理數: {max_files or '無限制'}")
        logger.info(f"跳過 PDF: {skip_pdf}")
        logger.info(f"僅簡單格式: {only_simple}")
        logger.info("="*60)
        
        processed_count = 0
        
        for file_info in self.scan_folder(folder_path):
            if max_files and processed_count >= max_files:
                logger.info(f"已達到處理上限 ({max_files})")
                break
            
            # 跳過 PDF
            if skip_pdf and Path(file_info['name']).suffix.lower() == '.pdf':
                continue
            
            # 僅簡單格式 (優先級 <= 5)
            if only_simple and file_info.get('priority', 100) > 5:
                continue
            
            success = self.process_file(file_info)
            if success:
                processed_count += 1
        
        # 輸出統計
        self._print_stats()
        
        # 保存處理日誌
        self._save_process_log()
    
    def _print_stats(self):
        """輸出統計信息"""
        logger.info("\n" + "="*60)
        logger.info("處理統計")
        logger.info("="*60)
        logger.info(f"掃描總數: {self.stats['scanned']}")
        logger.info(f"跳過重複: {self.stats['skipped_duplicate']}")
        logger.info(f"跳過格式: {self.stats['skipped_format']}")
        logger.info(f"跳過圖片PDF: {self.stats['skipped_image_pdf']}")
        logger.info(f"成功處理: {self.stats['processed']}")
        logger.info(f"  - 質量通過: {self.stats['quality_passed']}")
        logger.info(f"  - 質量問題: {self.stats['quality_issues']}")
        logger.info(f"失敗: {self.stats['failed']}")
        logger.info("="*60)
    
    def _save_process_log(self):
        """保存處理日誌"""
        log_path = Path(MD_OUTPUT_DIR) / 'process_log.json'
        try:
            # 讀取現有日誌
            existing_log = []
            if log_path.exists():
                with open(log_path, 'r', encoding='utf-8') as f:
                    existing_log = json.load(f)
            
            # 合併新日誌
            existing_log.extend(self.process_log)
            
            # 保存
            with open(log_path, 'w', encoding='utf-8') as f:
                json.dump(existing_log, f, ensure_ascii=False, indent=2)
            
            logger.info(f"處理日誌已保存: {log_path}")
        except Exception as e:
            logger.error(f"保存處理日誌失敗: {e}")
    
    def generate_catalog(self):
        """生成目錄索引"""
        logger.info("生成目錄索引...")
        
        catalog = {
            'generated_at': datetime.now().isoformat(),
            'total_files': 0,
            'categories': {}
        }
        
        # 掃描 Markdown 目錄
        for md_file in sorted(self.md_output_dir.glob("*.md")):
            catalog['total_files'] += 1
            
            # 嘗試分類
            filename = md_file.stem
            category = self._categorize_file(filename)
            
            if category not in catalog['categories']:
                catalog['categories'][category] = []
            
            catalog['categories'][category].append({
                'name': filename,
                'path': str(md_file),
                'size': md_file.stat().st_size
            })
        
        # 保存目錄
        catalog_path = self.md_output_dir / 'CATALOG.json'
        with open(catalog_path, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, ensure_ascii=False, indent=2)
        
        # 生成 Markdown 版本
        md_catalog = f"# 知識庫目錄\n\n"
        md_catalog += f"生成時間: {catalog['generated_at']}\n"
        md_catalog += f"總文件數: {catalog['total_files']}\n\n"
        
        for category, files in sorted(catalog['categories'].items()):
            md_catalog += f"## {category} ({len(files)} 個文件)\n\n"
            for f in files:
                md_catalog += f"- [{f['name']}]({f['path']})\n"
            md_catalog += "\n"
        
        md_catalog_path = self.md_output_dir / 'CATALOG.md'
        with open(md_catalog_path, 'w', encoding='utf-8') as f:
            f.write(md_catalog)
        
        logger.info(f"目錄已生成: {md_catalog_path}")
        return catalog
    
    def _categorize_file(self, filename: str) -> str:
        """根據文件名分類"""
        filename_lower = filename.lower()
        
        # 文學類
        if any(kw in filename_lower for kw in ['小说', '小說', '文学', '文學', '散文', '诗歌', '詩歌', '推理']):
            return '文學'
        
        # 歷史類
        if any(kw in filename_lower for kw in ['史记', '史記', '历史', '歷史', '通鉴', '通鑑', '二十四史']):
            return '歷史'
        
        # 哲學類
        if any(kw in filename_lower for kw in ['哲学', '哲學', '论语', '論語', '道德经', '道德經', '庄子', '莊子']):
            return '哲學'
        
        # 技術類
        if any(kw in filename_lower for kw in ['编程', '編程', 'python', 'java', '技术', '技術', '计算机', '計算機']):
            return '技術'
        
        return '其他'


def main():
    import argparse
    parser = argparse.ArgumentParser(description='知識庫處理器')
    parser.add_argument('--folder', default='知識庫', help='掃描的文件夾路徑')
    parser.add_argument('--limit', type=int, default=None, help='最大處理數量')
    parser.add_argument('--skip-pdf', action='store_true', help='跳過 PDF 文件')
    parser.add_argument('--only-simple', action='store_true', help='僅處理簡單格式 (EPUB, MOBI, DOCX)')
    parser.add_argument('--scan-only', action='store_true', help='僅掃描不處理')
    parser.add_argument('--generate-catalog', action='store_true', help='生成目錄索引')
    args = parser.parse_args()
    
    processor = KnowledgeBaseProcessor()
    
    if args.generate_catalog:
        processor.generate_catalog()
    elif args.scan_only:
        files = list(processor.scan_folder(args.folder))
        print(f"\n待處理文件列表 ({len(files)} 個):")
        for i, f in enumerate(files[:100], 1):
            ext = Path(f['name']).suffix.lower()
            print(f"{i}. [優先級 {f.get('priority')}] [{ext}] {f['name']}")
        if len(files) > 100:
            print(f"... 還有 {len(files) - 100} 個文件")
    else:
        processor.run(args.folder, args.limit, args.skip_pdf, args.only_simple)


if __name__ == "__main__":
    main()
