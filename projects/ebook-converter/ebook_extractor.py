#!/usr/bin/env python3
import os
import logging
from pathlib import Path
from typing import List, Dict, Optional
import PyPDF2
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
from docx import Document
import fitz
from pdf2image import convert_from_path
import pytesseract
from gemini_converter import GeminiConverter
from PIL import Image
import io

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EbookExtractor:
    def __init__(self):
        self.supported_formats = {
            '.pdf': self.extract_pdf,
            '.epub': self.extract_epub,
            '.mobi': self.extract_epub,
            '.docx': self.extract_docx,
            '.doc': self.extract_doc,
            '.txt': self.extract_txt,
            '.html': self.extract_html,
            '.htm': self.extract_html
        }
        try:
            self.gemini = GeminiConverter(model_type='fast')
            self.use_gemini_ocr = True
        except Exception as e:
            logger.warning(f"Gemini 初始化失敗，將使用本地 OCR: {e}")
            self.use_gemini_ocr = False
    
    def extract(self, file_path: str) -> Dict:
        """提取電子書內容"""
        ext = Path(file_path).suffix.lower()
        
        if ext not in self.supported_formats:
            logger.warning(f"不支援的格式: {ext}")
            return {'text': '', 'metadata': {}, 'chunks': []}
        
        try:
            return self.supported_formats[ext](file_path)
        except Exception as e:
            logger.error(f"提取失敗 {file_path}: {e}")
            return {'text': '', 'metadata': {'error': str(e)}, 'chunks': []}
    
    def extract_pdf(self, file_path: str) -> Dict:
        """提取 PDF 內容（支援 OCR 和 Gemini 視覺分析，優先處理文字）"""
        text_chunks = []
        metadata = {'pages': 0, 'method': 'text'}
        image_pages = []
        
        # 更新狀態
        self._update_status(file_path, 0, 0, "Scanning Structure")
        
        try:
            doc = fitz.open(file_path)
            total_pages = len(doc)
            metadata['pages'] = total_pages
            
            # 第一階段：提取文字和識別圖片頁面
            for page_num, page in enumerate(doc):
                self._update_status(file_path, page_num + 1, total_pages, "Extracting Text")
                
                text = page.get_text()
                
                if not text.strip():
                    # 標記為圖片頁面，稍後處理
                    image_pages.append(page_num)
                    logger.info(f"頁面 {page_num+1} 標記為圖片頁面，稍後處理")
                else:
                    text_chunks.append({
                        'page': page_num + 1,
                        'text': text.strip()
                    })
            
            # 第二階段：處理圖片頁面 (如果有的話)
            if image_pages:
                logger.info(f"開始處理 {len(image_pages)} 個圖片頁面")
                for i, page_num in enumerate(image_pages):
                    self._update_status(file_path, page_num + 1, total_pages, f"Processing Images ({i+1}/{len(image_pages)})")
                    
                    page = doc[page_num]
                    try:
                        pix = page.get_pixmap()
                        img_data = pix.tobytes("png")
                        img = Image.open(io.BytesIO(img_data))
                        
                        if self.use_gemini_ocr:
                            prompt = "請提取這張圖片中的所有文字，保持原有段落結構。如果包含圖表，請簡要描述。"
                            text = self.gemini.analyze_image(img, prompt)
                            metadata['method'] = 'gemini_vision'
                        else:
                            text = pytesseract.image_to_string(img, lang='chi_sim+chi_tra+eng')
                            metadata['method'] = 'local_ocr'
                            
                        if text.strip():
                            text_chunks.append({
                                'page': page_num + 1,
                                'text': text.strip()
                            })
                            
                    except Exception as e:
                        logger.error(f"OCR/視覺分析失敗 (Page {page_num+1}): {e}")
            
            doc.close()
            
            # 按頁碼排序
            text_chunks.sort(key=lambda x: x['page'])
            
        except Exception as e:
            logger.error(f"PDF 提取失敗: {e}")
        
        full_text = '\n\n'.join([c['text'] for c in text_chunks])
        return {
            'text': full_text,
            'metadata': metadata,
            'chunks': text_chunks
        }

    def _update_status(self, filepath, current, total, stage):
        """更新處理狀態文件"""
        import json
        try:
            status = {
                'current_file': os.path.basename(filepath),
                'processed_pages': current,
                'total_pages': total,
                'stage': stage,
                'timestamp': time.time()
            }
            with open("/tmp/pdf_processing_status.json", "w") as f:
                json.dump(status, f)
        except: pass
    
    def extract_epub(self, file_path: str) -> Dict:
        """提取 EPUB 內容"""
        text_chunks = []
        metadata = {'chapters': 0}
        
        try:
            book = epub.read_epub(file_path)
            
            metadata['title'] = book.get_metadata('DC', 'title')
            metadata['author'] = book.get_metadata('DC', 'creator')
            
            chapter_num = 0
            for item in book.get_items():
                if item.get_type() == ebooklib.ITEM_DOCUMENT:
                    chapter_num += 1
                    soup = BeautifulSoup(item.get_content(), 'html.parser')
                    text = soup.get_text()
                    
                    if text.strip():
                        text_chunks.append({
                            'chapter': chapter_num,
                            'text': text.strip()
                        })
            
            metadata['chapters'] = chapter_num
            
        except Exception as e:
            logger.error(f"EPUB 提取失敗: {e}")
        
        full_text = '\n\n'.join([c['text'] for c in text_chunks])
        return {
            'text': full_text,
            'metadata': metadata,
            'chunks': text_chunks
        }
    
    def extract_docx(self, file_path: str) -> Dict:
        """提取 DOCX 內容"""
        text_chunks = []
        
        try:
            doc = Document(file_path)
            
            for i, para in enumerate(doc.paragraphs):
                if para.text.strip():
                    text_chunks.append({
                        'paragraph': i + 1,
                        'text': para.text.strip()
                    })
            
        except Exception as e:
            logger.error(f"DOCX 提取失敗: {e}")
        
        full_text = '\n\n'.join([c['text'] for c in text_chunks])
        return {
            'text': full_text,
            'metadata': {'paragraphs': len(text_chunks)},
            'chunks': text_chunks
        }
    
    def extract_doc(self, file_path: str) -> Dict:
        """提取 DOC 內容（使用 LibreOffice 轉換）"""
        try:
            import subprocess
            output_path = file_path.replace('.doc', '.txt')
            subprocess.run(['libreoffice', '--headless', '--convert-to', 'txt', file_path], 
                          capture_output=True, timeout=30)
            
            if os.path.exists(output_path):
                return self.extract_txt(output_path)
        except Exception as e:
            logger.error(f"DOC 轉換失敗: {e}")
        
        return {'text': '', 'metadata': {}, 'chunks': []}
    
    def _detect_encoding(self, file_path: str) -> str:
        """檢測文件編碼"""
        import chardet
        
        # 讀取文件前 10KB 來檢測編碼
        with open(file_path, 'rb') as f:
            raw_data = f.read(10240)
        
        # 使用 chardet 檢測
        result = chardet.detect(raw_data)
        detected = result.get('encoding', 'utf-8')
        confidence = result.get('confidence', 0)
        
        logger.info(f"編碼檢測: {detected} (置信度: {confidence:.2f})")
        
        # 常見中文編碼映射
        encoding_map = {
            'gb2312': 'gbk',
            'gb18030': 'gbk',
            'ascii': 'utf-8',
            None: 'utf-8',
        }
        
        final_encoding = encoding_map.get(detected.lower() if detected else None, detected)
        
        # 如果置信度太低，嘗試常見編碼
        if confidence < 0.7:
            for enc in ['utf-8', 'gbk', 'big5', 'utf-16']:
                try:
                    with open(file_path, 'r', encoding=enc) as f:
                        content = f.read(1000)
                        # 檢查是否有大量中文字符
                        chinese_count = len([c for c in content if '\u4e00' <= c <= '\u9fff'])
                        if chinese_count > 50:
                            logger.info(f"低置信度，嘗試 {enc} 成功")
                            return enc
                except:
                    continue
        
        return final_encoding or 'utf-8'
    
    def extract_txt(self, file_path: str) -> Dict:
        """提取 TXT 內容（自動檢測編碼）"""
        text_chunks = []
        detected_encoding = 'utf-8'
        
        try:
            # 自動檢測編碼
            detected_encoding = self._detect_encoding(file_path)
            
            # 嘗試用檢測到的編碼讀取
            try:
                with open(file_path, 'r', encoding=detected_encoding) as f:
                    content = f.read()
            except UnicodeDecodeError:
                # 回退到 GBK
                logger.warning(f"編碼 {detected_encoding} 失敗，嘗試 GBK")
                try:
                    with open(file_path, 'r', encoding='gbk') as f:
                        content = f.read()
                    detected_encoding = 'gbk'
                except UnicodeDecodeError:
                    # 最後回退到 UTF-8 忽略錯誤
                    logger.warning("GBK 也失敗，使用 UTF-8 忽略錯誤")
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    detected_encoding = 'utf-8-fallback'
            
            # 檢查是否有亂碼特徵
            garbled_chars = len([c for c in content[:1000] if ord(c) > 0x10000 or (0x80 <= ord(c) < 0x100)])
            if garbled_chars > 50:
                logger.warning(f"檢測到可能的亂碼 ({garbled_chars} 個異常字符)")
            
            paragraphs = content.split('\n\n')
            for i, para in enumerate(paragraphs):
                if para.strip():
                    text_chunks.append({
                        'paragraph': i + 1,
                        'text': para.strip()
                    })
            
        except Exception as e:
            logger.error(f"TXT 提取失敗: {e}")
        
        full_text = '\n\n'.join([c['text'] for c in text_chunks])
        return {
            'text': full_text,
            'metadata': {'encoding': detected_encoding},
            'chunks': text_chunks
        }
    
    def extract_html(self, file_path: str) -> Dict:
        """提取 HTML 內容（自動檢測編碼）"""
        text_chunks = []
        
        try:
            # 自動檢測編碼
            detected_encoding = self._detect_encoding(file_path)
            
            try:
                with open(file_path, 'r', encoding=detected_encoding) as f:
                    soup = BeautifulSoup(f.read(), 'html.parser')
            except UnicodeDecodeError:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    soup = BeautifulSoup(f.read(), 'html.parser')
            
            for tag in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                if tag.text.strip():
                    text_chunks.append({
                        'tag': tag.name,
                        'text': tag.text.strip()
                    })
            
        except Exception as e:
            logger.error(f"HTML 提取失敗: {e}")
        
        full_text = '\n\n'.join([c['text'] for c in text_chunks])
        return {
            'text': full_text,
            'metadata': {'format': 'html'},
            'chunks': text_chunks
        }

if __name__ == "__main__":
    extractor = EbookExtractor()
    print("電子書提取器初始化完成")
    print(f"支援格式: {list(extractor.supported_formats.keys())}")
