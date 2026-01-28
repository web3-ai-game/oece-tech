#!/usr/bin/env python3
"""多源並發處理器 - 同時處理百度網盤、Google Drive、書籤"""
import os
import sys
import threading
import time
from pathlib import Path
from multi_cloud_downloader import MultiCloudDownloader
from main import EbookConverterPipeline
from bookmark_converter import BookmarkConverter
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(threadName)s] - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/multi-processor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class MultiSourceProcessor:
    """多源並發處理器"""
    
    def __init__(self):
        self.stats = {
            'baidu': {'processed': 0, 'failed': 0, 'status': 'pending'},
            'gdrive': {'processed': 0, 'failed': 0, 'status': 'pending'},
            'bookmarks': {'processed': 0, 'failed': 0, 'status': 'pending'}
        }
        self.stats_lock = threading.Lock()
    
    def process_baidu(self, max_files=None):
        """處理百度網盤 - 使用 Gemini 2.5 Flash"""
        logger.info("=" * 60)
        logger.info("任務 1: 百度網盤 (Gemini 2.5 Flash)")
        logger.info("=" * 60)
        
        with self.stats_lock:
            self.stats['baidu']['status'] = 'running'
        
        try:
            # 修改配置使用 Gemini 2.5 Flash
            import config
            original_model = config.GEMINI_MODELS['default']
            config.GEMINI_MODELS['default'] = 'gemini-2.5-flash'
            
            downloader = MultiCloudDownloader()
            
            # 列出百度網盤文件
            files = downloader.list_baidu_files("/apps/bypy")
            
            if not files:
                logger.warning("百度網盤未找到文件")
                with self.stats_lock:
                    self.stats['baidu']['status'] = 'completed'
                return
            
            if max_files:
                files = files[:max_files]
            
            logger.info(f"找到 {len(files)} 個百度網盤文件")
            
            # 處理文件
            converter = EbookConverterPipeline()
            
            for i, file_info in enumerate(files, 1):
                logger.info(f"處理 {i}/{len(files)}: {file_info['name']}")
                
                try:
                    local_path = downloader.download_file(file_info)
                    if local_path:
                        success = converter.process_single_file(local_path)
                        
                        with self.stats_lock:
                            if success:
                                self.stats['baidu']['processed'] += 1
                            else:
                                self.stats['baidu']['failed'] += 1
                        
                        # 清理
                        try:
                            os.remove(local_path)
                        except:
                            pass
                except Exception as e:
                    logger.error(f"處理失敗: {e}")
                    with self.stats_lock:
                        self.stats['baidu']['failed'] += 1
            
            # 恢復配置
            config.GEMINI_MODELS['default'] = original_model
            
            with self.stats_lock:
                self.stats['baidu']['status'] = 'completed'
            
            logger.info("✓ 百度網盤處理完成")
            
        except Exception as e:
            logger.error(f"百度網盤處理異常: {e}")
            with self.stats_lock:
                self.stats['baidu']['status'] = 'failed'
    
    def process_gdrive(self, max_files=None):
        """處理 Google Drive - 使用 Gemini 2.5 Flash-lite"""
        logger.info("=" * 60)
        logger.info("任務 2: Google Drive (Gemini 2.5 Flash-lite)")
        logger.info("=" * 60)
        
        with self.stats_lock:
            self.stats['gdrive']['status'] = 'running'
        
        try:
            downloader = MultiCloudDownloader()
            
            # 列出 Google Drive 文件
            files = downloader.list_gdrive_files("")
            
            if not files:
                logger.warning("Google Drive 未找到文件")
                with self.stats_lock:
                    self.stats['gdrive']['status'] = 'completed'
                return
            
            if max_files:
                files = files[:max_files]
            
            logger.info(f"找到 {len(files)} 個 Google Drive 文件")
            
            # 處理文件
            converter = EbookConverterPipeline()
            
            for i, file_info in enumerate(files, 1):
                logger.info(f"處理 {i}/{len(files)}: {file_info['name']}")
                
                try:
                    local_path = downloader.download_file(file_info)
                    if local_path:
                        success = converter.process_single_file(local_path)
                        
                        with self.stats_lock:
                            if success:
                                self.stats['gdrive']['processed'] += 1
                            else:
                                self.stats['gdrive']['failed'] += 1
                        
                        # 清理
                        try:
                            os.remove(local_path)
                        except:
                            pass
                except Exception as e:
                    logger.error(f"處理失敗: {e}")
                    with self.stats_lock:
                        self.stats['gdrive']['failed'] += 1
            
            with self.stats_lock:
                self.stats['gdrive']['status'] = 'completed'
            
            logger.info("✓ Google Drive 處理完成")
            
        except Exception as e:
            logger.error(f"Google Drive 處理異常: {e}")
            with self.stats_lock:
                self.stats['gdrive']['status'] = 'failed'
    
    def process_bookmarks(self, html_file):
        """處理書籤 - 使用 Gemini 2.0 Flash"""
        logger.info("=" * 60)
        logger.info("任務 3: 書籤轉換 (Gemini 2.0 Flash)")
        logger.info("=" * 60)
        
        with self.stats_lock:
            self.stats['bookmarks']['status'] = 'running'
        
        try:
            converter = BookmarkConverter()
            converter.convert_bookmarks(html_file)
            
            with self.stats_lock:
                self.stats['bookmarks']['processed'] = 1
                self.stats['bookmarks']['status'] = 'completed'
            
            logger.info("✓ 書籤轉換完成")
            
        except Exception as e:
            logger.error(f"書籤轉換異常: {e}")
            with self.stats_lock:
                self.stats['bookmarks']['failed'] = 1
                self.stats['bookmarks']['status'] = 'failed'
    
    def run_all(self, baidu_max=10, gdrive_max=10, bookmark_html=None):
        """並發運行所有任務"""
        logger.info("\n" + "=" * 60)
        logger.info("🚀 多源並發處理器啟動")
        logger.info("=" * 60)
        logger.info("任務 1: 百度網盤 → Gemini 2.5 Flash")
        logger.info("任務 2: Google Drive → Gemini 2.5 Flash-lite")
        logger.info("任務 3: 書籤轉換 → Gemini 2.0 Flash")
        logger.info("=" * 60)
        
        threads = []
        
        # 任務 1: 百度網盤
        t1 = threading.Thread(
            target=self.process_baidu,
            args=(baidu_max,),
            name="Baidu-Thread"
        )
        threads.append(t1)
        
        # 任務 2: Google Drive
        t2 = threading.Thread(
            target=self.process_gdrive,
            args=(gdrive_max,),
            name="GDrive-Thread"
        )
        threads.append(t2)
        
        # 任務 3: 書籤
        if bookmark_html:
            t3 = threading.Thread(
                target=self.process_bookmarks,
                args=(bookmark_html,),
                name="Bookmark-Thread"
            )
            threads.append(t3)
        
        # 啟動所有線程
        for t in threads:
            t.start()
            time.sleep(1)  # 錯開啟動時間
        
        # 等待所有線程完成
        for t in threads:
            t.join()
        
        # 打印總結
        self.print_summary()
    
    def print_summary(self):
        """打印處理總結"""
        logger.info("\n" + "=" * 60)
        logger.info("📊 處理總結")
        logger.info("=" * 60)
        
        with self.stats_lock:
            for source, stats in self.stats.items():
                status_icon = "✓" if stats['status'] == 'completed' else "✗"
                logger.info(f"\n{source.upper()}:")
                logger.info(f"  狀態: {status_icon} {stats['status']}")
                logger.info(f"  成功: {stats['processed']}")
                logger.info(f"  失敗: {stats['failed']}")
        
        logger.info("\n" + "=" * 60)
        logger.info("查看結果:")
        logger.info("  電子書 Markdown: /home/sms/ebook-converter/data/markdown-output/")
        logger.info("  書籤 Markdown: /home/sms/ebook-converter/data/bookmarks-output/")
        logger.info("  索引: /home/sms/ebook-converter/data/wittgenstein-index/")
        logger.info("=" * 60)


def main():
    """主程序"""
    processor = MultiSourceProcessor()
    
    # 運行所有任務
    processor.run_all(
        baidu_max=10,  # 百度網盤處理 10 個文件
        gdrive_max=10,  # Google Drive 處理 10 個文件
        bookmark_html="/home/sms/3ba5535a-aa16-4bf5-a3cb-c9901235153f.html"
    )


if __name__ == "__main__":
    main()
