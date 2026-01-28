#!/usr/bin/env python3
"""
智能文學處理器 - 專注於文學類內容的高質量轉換
1. 掃描百度網盤 '文学' 文件夾
2. 過濾已處理文件 (去重)
3. 智能 PDF 分類: 文字版 vs 圖片版
4. 質量驗證確保輸出正確
"""
import os
import sys
import hashlib
import logging
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from multi_cloud_downloader import MultiCloudDownloader
from main import EbookConverterPipeline
from mongodb_handler import MongoDBHandler
from config import MD_OUTPUT_DIR
import fitz  # PyMuPDF for PDF analysis

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class SmartLiteratureProcessor:
    """智能文學處理器"""
    
    # 文學類優先處理的格式 (成本低)
    # 注意: 排除 .txt 因為百度網盤上很多 TXT 文件是空的或損壞的
    TEXT_FORMATS = ['.epub', '.mobi', '.azw', '.azw3', '.doc', '.docx']
    
    # PDF 需要智能分類
    PDF_FORMAT = '.pdf'
    
    # 跳過 OCR 的關鍵詞 (圖片版古籍)
    SKIP_OCR_KEYWORDS = [
        '县志', '縣志', '方志', '府志', '州志', '省志',
        '古籍', '善本', '影印', '手抄', '毛筆', '書法',
        '碑帖', '拓片', '線裝', '刻本', '抄本',
        '天一阁', '四庫', '永樂大典', '古今圖書集成'
    ]
    
    # 可處理的文字版 PDF 關鍵詞
    TEXT_PDF_KEYWORDS = [
        '小说', '小說', '文学', '文學', '散文', '诗歌', '詩歌',
        '史记', '史記', '资治通鉴', '資治通鑑', '二十四史',
        '红楼梦', '紅樓夢', '三国演义', '三國演義', '水浒传', '水滸傳',
        '西游记', '西遊記', '金瓶梅', '聊斋', '聊齋',
        '鲁迅', '魯迅', '茅盾', '巴金', '老舍', '沈从文', '沈從文',
        '张爱玲', '張愛玲', '钱钟书', '錢鍾書', '王小波',
        '金庸', '古龙', '古龍', '梁羽生', '琼瑶', '瓊瑤',
        '唐家三少', '天蚕土豆', '我吃西红柿', '辰东', '耳根'
    ]
    
    def __init__(self):
        self.downloader = MultiCloudDownloader()
        self.pipeline = EbookConverterPipeline()
        self.mongo = MongoDBHandler()
        self.md_output_dir = Path(MD_OUTPUT_DIR)
        self.md_output_dir.mkdir(parents=True, exist_ok=True)
        
        # 統計
        self.stats = {
            'scanned': 0,
            'skipped_duplicate': 0,
            'skipped_image_pdf': 0,
            'processed': 0,
            'failed': 0,
            'quality_issues': 0
        }
        
        # 載入已處理文件列表
        self.processed_files = self._load_processed_files()
        
    def _load_processed_files(self) -> set:
        """從 MongoDB 和本地目錄載入已處理文件"""
        processed = set()
        
        # 從 MongoDB 獲取
        try:
            docs = self.mongo.get_all_documents()
            for doc in docs:
                if 'filename' in doc:
                    # 標準化文件名 (去掉擴展名)
                    base_name = Path(doc['filename']).stem
                    processed.add(base_name.lower())
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
        return base_name in self.processed_files
    
    def _classify_pdf(self, local_path: str, filename: str) -> Tuple[str, str]:
        """
        智能分類 PDF: 'text' (可提取文字) 或 'image' (需要 OCR)
        返回: (類型, 原因)
        """
        # 先檢查文件名關鍵詞
        filename_lower = filename.lower()
        
        # 檢查是否應該跳過 (古籍/縣志)
        for kw in self.SKIP_OCR_KEYWORDS:
            if kw in filename_lower:
                return ('skip', f'文件名包含古籍關鍵詞: {kw}')
        
        # 嘗試分析 PDF 內容
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
            
            # 判斷邏輯
            avg_chars_per_page = text_chars / sample_pages
            avg_images_per_page = image_count / sample_pages
            
            # 如果平均每頁文字 > 100 字符，認為是文字版
            if avg_chars_per_page > 100:
                return ('text', f'文字版 PDF (平均 {avg_chars_per_page:.0f} 字符/頁)')
            
            # 如果圖片多且文字少，認為是掃描版
            if avg_images_per_page > 0.5 and avg_chars_per_page < 50:
                return ('image', f'掃描版 PDF (平均 {avg_images_per_page:.1f} 圖片/頁, {avg_chars_per_page:.0f} 字符/頁)')
            
            # 檢查文件名是否包含可處理關鍵詞
            for kw in self.TEXT_PDF_KEYWORDS:
                if kw in filename_lower:
                    return ('text', f'文件名包含文學關鍵詞: {kw}')
            
            # 默認跳過不確定的 PDF
            return ('skip', f'無法確定類型 (平均 {avg_chars_per_page:.0f} 字符/頁)')
            
        except Exception as e:
            logger.error(f"PDF 分析失敗 {filename}: {e}")
            return ('skip', f'分析失敗: {e}')
    
    def _validate_markdown(self, md_path: str) -> Tuple[bool, List[str]]:
        """
        驗證 Markdown 質量
        返回: (是否通過, 問題列表)
        """
        issues = []
        
        try:
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 檢查 1: 文件不能太小
            if len(content) < 500:
                issues.append(f'內容過短 ({len(content)} 字符)')
            
            # 檢查 2: 不能有大量亂碼 (mojibake)
            mojibake_patterns = ['ã', 'â', 'Ã', 'Â', 'ï¿½', '锟斤拷', '烫烫烫']
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
            
            return (len(issues) == 0, issues)
            
        except Exception as e:
            return (False, [f'讀取失敗: {e}'])
    
    def scan_literature_folder(self, folder_path: str = "知識庫/文学") -> List[Dict]:
        """掃描文學文件夾，返回待處理文件列表"""
        logger.info(f"開始掃描文學文件夾: {folder_path}")
        
        files_to_process = []
        
        for file_info in self.downloader.yield_baidu_files(f"/apps/bypy/{folder_path}"):
            self.stats['scanned'] += 1
            filename = file_info['name']
            
            # 檢查重複
            if self._is_duplicate(filename):
                self.stats['skipped_duplicate'] += 1
                logger.debug(f"跳過重複: {filename}")
                continue
            
            # 獲取文件擴展名
            ext = Path(filename).suffix.lower()
            
            # 文字格式直接加入
            if ext in self.TEXT_FORMATS:
                file_info['process_type'] = 'text'
                file_info['process_reason'] = f'文字格式: {ext}'
                files_to_process.append(file_info)
                continue
            
            # PDF 需要進一步分類 (下載後分析)
            if ext == self.PDF_FORMAT:
                file_info['process_type'] = 'pdf_pending'
                file_info['process_reason'] = '待分析 PDF'
                files_to_process.append(file_info)
                continue
        
        logger.info(f"掃描完成: 共 {self.stats['scanned']} 個文件, {len(files_to_process)} 個待處理")
        return files_to_process
    
    def process_file(self, file_info: Dict) -> bool:
        """處理單個文件"""
        filename = file_info['name']
        logger.info(f"\n{'='*60}")
        logger.info(f"處理: {filename}")
        logger.info(f"類型: {file_info.get('process_type')} - {file_info.get('process_reason')}")
        logger.info(f"{'='*60}")
        
        # 下載文件
        local_path = self.downloader.download_file(file_info)
        if not local_path or not os.path.exists(local_path):
            logger.error(f"下載失敗: {filename}")
            self.stats['failed'] += 1
            return False
        
        # 如果是 PDF，先分類
        if file_info.get('process_type') == 'pdf_pending':
            pdf_type, reason = self._classify_pdf(local_path, filename)
            logger.info(f"PDF 分類結果: {pdf_type} - {reason}")
            
            if pdf_type == 'skip' or pdf_type == 'image':
                self.stats['skipped_image_pdf'] += 1
                logger.info(f"跳過圖片版 PDF: {filename}")
                # 清理下載的文件
                try:
                    os.remove(local_path)
                except:
                    pass
                return True  # 不算失敗
            
            file_info['process_type'] = 'text_pdf'
            file_info['process_reason'] = reason
        
        # 執行轉換
        try:
            result = self.pipeline.process_single_file(local_path)
            
            if not result.get('success'):
                logger.error(f"轉換失敗: {filename} - {result.get('error')}")
                self.stats['failed'] += 1
                return False
            
            md_path = result.get('markdown_path')
            
            # 質量驗證
            if md_path and os.path.exists(md_path):
                is_valid, issues = self._validate_markdown(md_path)
                
                if not is_valid:
                    logger.warning(f"質量問題: {filename}")
                    for issue in issues:
                        logger.warning(f"  - {issue}")
                    self.stats['quality_issues'] += 1
                    # 不刪除，但標記有問題
                else:
                    logger.info(f"✓ 質量驗證通過: {filename}")
            
            # 更新已處理列表
            base_name = Path(filename).stem.lower()
            self.processed_files.add(base_name)
            
            self.stats['processed'] += 1
            logger.info(f"✓ 處理成功: {filename}")
            return True
            
        except Exception as e:
            logger.error(f"處理異常: {filename} - {e}")
            self.stats['failed'] += 1
            return False
        finally:
            # 清理緩存
            try:
                if local_path and os.path.exists(local_path):
                    os.remove(local_path)
            except:
                pass
    
    def run(self, folder_path: str = "知識庫/文学", max_files: int = None):
        """運行處理流程"""
        logger.info("="*60)
        logger.info("智能文學處理器啟動")
        logger.info("="*60)
        
        # 掃描文件
        files = self.scan_literature_folder(folder_path)
        
        if not files:
            logger.info("沒有找到待處理文件")
            return
        
        # 處理文件
        processed_count = 0
        for file_info in files:
            if max_files and processed_count >= max_files:
                logger.info(f"已達到處理上限 ({max_files})")
                break
            
            success = self.process_file(file_info)
            if success and file_info.get('process_type') != 'pdf_pending':
                processed_count += 1
        
        # 輸出統計
        logger.info("\n" + "="*60)
        logger.info("處理統計")
        logger.info("="*60)
        logger.info(f"掃描總數: {self.stats['scanned']}")
        logger.info(f"跳過重複: {self.stats['skipped_duplicate']}")
        logger.info(f"跳過圖片PDF: {self.stats['skipped_image_pdf']}")
        logger.info(f"成功處理: {self.stats['processed']}")
        logger.info(f"質量問題: {self.stats['quality_issues']}")
        logger.info(f"失敗: {self.stats['failed']}")
        logger.info("="*60)


def main():
    import argparse
    parser = argparse.ArgumentParser(description='智能文學處理器')
    parser.add_argument('--folder', default='知識庫/文学', help='掃描的文件夾路徑')
    parser.add_argument('--limit', type=int, default=None, help='最大處理數量')
    parser.add_argument('--scan-only', action='store_true', help='僅掃描不處理')
    args = parser.parse_args()
    
    processor = SmartLiteratureProcessor()
    
    if args.scan_only:
        files = processor.scan_literature_folder(args.folder)
        print(f"\n待處理文件列表 ({len(files)} 個):")
        for i, f in enumerate(files[:50], 1):
            print(f"{i}. [{f.get('process_type')}] {f['name']}")
        if len(files) > 50:
            print(f"... 還有 {len(files) - 50} 個文件")
    else:
        processor.run(args.folder, args.limit)


if __name__ == "__main__":
    main()
