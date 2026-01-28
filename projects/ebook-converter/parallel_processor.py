#!/usr/bin/env python3
"""並發處理器 - 充分利用 4vCPU 16GB RAM"""
import os
import sys
import time
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from multi_cloud_downloader import MultiCloudDownloader
from main import EbookConverterPipeline
import logging
import threading

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/ebook-processor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class ParallelProcessor:
    """並發處理器"""
    
    def __init__(self, max_workers=3):
        """
        初始化並發處理器
        max_workers: 並發數量（建議 2-3 個，因為 Gemini API 有限制）
        """
        self.downloader = MultiCloudDownloader()
        self.max_workers = max_workers
        self.stats_lock = threading.Lock()
        self.stats = {
            'processed': 0,
            'failed': 0,
            'total_size': 0,
            'start_time': time.time()
        }
        self.stats_file = Path("/home/sms/ebook-converter/data/processing_stats.json")
    
    def save_stats(self):
        """保存統計數據"""
        with self.stats_lock:
            self.stats['elapsed'] = time.time() - self.stats['start_time']
            with open(self.stats_file, 'w') as f:
                json.dump(self.stats, f, indent=2)
    
    def process_single_file(self, file_info):
        """處理單個文件"""
        converter = EbookConverterPipeline()
        filename = file_info['name']
        
        try:
            logger.info(f"[{threading.current_thread().name}] 開始處理: {filename}")
            
            # 1. 下載
            local_path = self.downloader.download_file(file_info)
            if not local_path or not os.path.exists(local_path):
                logger.error(f"下載失敗: {filename}")
                return {'success': False, 'filename': filename, 'error': 'download_failed'}
            
            file_size = os.path.getsize(local_path)
            
            # 2. 轉換
            success = converter.process_single_file(local_path)
            
            # 3. 清理
            try:
                os.remove(local_path)
            except:
                pass
            
            # 4. 更新統計
            with self.stats_lock:
                if success:
                    self.stats['processed'] += 1
                    self.stats['total_size'] += file_size
                else:
                    self.stats['failed'] += 1
            
            self.save_stats()
            
            if success:
                logger.info(f"✓ 完成: {filename} ({file_size/1024/1024:.1f} MB)")
                return {'success': True, 'filename': filename, 'size': file_size}
            else:
                logger.error(f"✗ 轉換失敗: {filename}")
                return {'success': False, 'filename': filename, 'error': 'conversion_failed'}
                
        except Exception as e:
            logger.error(f"處理失敗 {filename}: {e}")
            with self.stats_lock:
                self.stats['failed'] += 1
            self.save_stats()
            return {'success': False, 'filename': filename, 'error': str(e)}
    
    def process_baidu_ebooks(self, max_files=None):
        """並發處理電子書（百度網盤 + Google Drive）"""
        logger.info("=" * 60)
        logger.info(f"並發處理器啟動 (Workers: {self.max_workers})")
        logger.info("=" * 60)
        
        # 列出所有雲盤文件
        logger.info("掃描所有雲盤...")
        files = self.downloader.list_all_ebooks()
        
        if not files:
            logger.warning("未找到電子書文件")
            return
        
        if max_files:
            files = files[:max_files]
        
        logger.info(f"找到 {len(files)} 個電子書，開始處理...")
        logger.info(f"並發數: {self.max_workers} 個線程")
        logger.info("")
        
        # 並發處理
        results = []
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {
                executor.submit(self.process_single_file, file_info): file_info
                for file_info in files
            }
            
            for future in as_completed(futures):
                file_info = futures[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    logger.error(f"任務異常: {e}")
                    results.append({
                        'success': False,
                        'filename': file_info['name'],
                        'error': str(e)
                    })
        
        # 總結
        logger.info("")
        logger.info("=" * 60)
        logger.info("處理完成！")
        logger.info("=" * 60)
        
        with self.stats_lock:
            elapsed = time.time() - self.stats['start_time']
            speed = self.stats['processed'] / (elapsed / 60) if elapsed > 0 else 0
            
            logger.info(f"成功: {self.stats['processed']} 個")
            logger.info(f"失敗: {self.stats['failed']} 個")
            logger.info(f"總大小: {self.stats['total_size']/1024/1024:.1f} MB")
            logger.info(f"耗時: {elapsed/60:.1f} 分鐘")
            logger.info(f"速度: {speed:.2f} 文件/分鐘")
        
        logger.info("=" * 60)
        
        return results


def main():
    """主程序"""
    import argparse
    
    parser = argparse.ArgumentParser(description='並發電子書處理器')
    parser.add_argument('-w', '--workers', type=int, default=3,
                        help='並發線程數 (默認: 3)')
    parser.add_argument('-n', '--num-files', type=int, default=None,
                        help='處理文件數量 (默認: 全部)')
    
    args = parser.parse_args()
    
    processor = ParallelProcessor(max_workers=args.workers)
    processor.process_baidu_ebooks(max_files=args.num_files)


if __name__ == "__main__":
    main()
