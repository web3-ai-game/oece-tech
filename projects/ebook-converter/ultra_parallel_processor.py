#!/usr/bin/env python3
"""超高並發處理器 - 雙 API Key 負載均衡 + 最大並發"""
import os
import sys
import time
import random
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from multi_cloud_downloader import MultiCloudDownloader
from main import EbookConverterPipeline
import logging
import threading
from queue import Queue

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(threadName)-10s] - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/tmp/ultra-processor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class APIKeyBalancer:
    """API Key 負載均衡器"""
    
    def __init__(self, api_keys):
        self.api_keys = api_keys
        self.current_index = 0
        self.lock = threading.Lock()
        self.usage_count = {key: 0 for key in api_keys}
    
    def get_key(self):
        """輪詢獲取 API Key"""
        with self.lock:
            key = self.api_keys[self.current_index]
            self.usage_count[key] += 1
            self.current_index = (self.current_index + 1) % len(self.api_keys)
            return key
    
    def get_stats(self):
        """獲取使用統計"""
        with self.lock:
            return dict(self.usage_count)


class UltraParallelProcessor:
    """超高並發處理器"""
    
    def __init__(self, api_keys, max_workers=20):
        """
        初始化超高並發處理器
        
        api_keys: API Key 列表
        max_workers: 最大並發數（建議 15-30）
        """
        self.api_keys = api_keys
        self.key_balancer = APIKeyBalancer(api_keys)
        self.downloader = MultiCloudDownloader()
        self.max_workers = max_workers
        
        self.stats_lock = threading.Lock()
        self.stats = {
            'processed': 0,
            'failed': 0,
            'total_size': 0,
            'start_time': time.time()
        }
        
        logger.info(f"超高並發處理器初始化完成")
        logger.info(f"API Keys: {len(api_keys)} 個")
        logger.info(f"並發數: {max_workers} 個線程")
        logger.info(f"預計處理速度: {max_workers * 2} 文件/分鐘")
    
    def process_single_file(self, file_info):
        """處理單個文件（使用負載均衡的 API Key）"""
        filename = file_info['name']
        thread_name = threading.current_thread().name
        
        try:
            # 獲取 API Key
            api_key = self.key_balancer.get_key()
            
            logger.info(f"[{thread_name}] 開始處理: {filename[:50]}...")
            
            # 1. 下載
            local_path = self.downloader.download_file(file_info)
            if not local_path or not os.path.exists(local_path):
                logger.error(f"[{thread_name}] 下載失敗: {filename}")
                return {'success': False, 'filename': filename, 'error': 'download_failed'}
            
            file_size = os.path.getsize(local_path)
            
            # 2. 轉換（使用指定的 API Key）
            import config
            original_key = config.GEMINI_API_KEY
            config.GEMINI_API_KEY = api_key
            
            converter = EbookConverterPipeline()
            success = converter.process_single_file(local_path)
            
            # 恢復原始 Key
            config.GEMINI_API_KEY = original_key
            
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
            
            if success:
                logger.info(f"[{thread_name}] ✓ 完成: {filename[:50]} ({file_size/1024:.1f} KB)")
                return {'success': True, 'filename': filename, 'size': file_size}
            else:
                logger.error(f"[{thread_name}] ✗ 轉換失敗: {filename}")
                return {'success': False, 'filename': filename, 'error': 'conversion_failed'}
                
        except Exception as e:
            logger.error(f"[{thread_name}] 處理失敗 {filename}: {e}")
            with self.stats_lock:
                self.stats['failed'] += 1
            return {'success': False, 'filename': filename, 'error': str(e)}
    
    def process_all_ebooks(self, max_files=None, sources=['gdrive', 'baidu']):
        """超高並發處理所有電子書"""
        logger.info("=" * 80)
        logger.info("🚀 超高並發處理器啟動")
        logger.info("=" * 80)
        logger.info(f"API Keys: {len(self.api_keys)} 個")
        logger.info(f"並發線程: {self.max_workers} 個")
        logger.info(f"處理來源: {', '.join(sources)}")
        logger.info("=" * 80)
        
        # 列出所有文件
        logger.info("\n掃描雲盤...")
        all_files = []
        
        if 'baidu' in sources:
            baidu_files = self.downloader.list_baidu_files("/apps/bypy")
            all_files.extend(baidu_files)
            logger.info(f"百度網盤: {len(baidu_files)} 個文件")
        
        if 'gdrive' in sources:
            gdrive_files = self.downloader.list_gdrive_files("")
            all_files.extend(gdrive_files)
            logger.info(f"Google Drive: {len(gdrive_files)} 個文件")
        
        if not all_files:
            logger.warning("未找到電子書文件")
            return
        
        if max_files:
            all_files = all_files[:max_files]
        
        logger.info(f"\n準備處理 {len(all_files)} 個電子書")
        logger.info(f"預計耗時: {len(all_files) / (self.max_workers * 2):.1f} 分鐘")
        logger.info("")
        
        # 超高並發處理
        results = []
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {
                executor.submit(self.process_single_file, file_info): file_info
                for file_info in all_files
            }
            
            completed = 0
            for future in as_completed(futures):
                completed += 1
                file_info = futures[future]
                
                try:
                    result = future.result()
                    results.append(result)
                    
                    # 每 10 個文件顯示進度
                    if completed % 10 == 0:
                        with self.stats_lock:
                            elapsed = time.time() - self.stats['start_time']
                            speed = self.stats['processed'] / (elapsed / 60) if elapsed > 0 else 0
                            logger.info(f"\n進度: {completed}/{len(all_files)} | "
                                      f"成功: {self.stats['processed']} | "
                                      f"失敗: {self.stats['failed']} | "
                                      f"速度: {speed:.1f} 文件/分鐘\n")
                
                except Exception as e:
                    logger.error(f"任務異常: {e}")
                    results.append({
                        'success': False,
                        'filename': file_info['name'],
                        'error': str(e)
                    })
        
        # 總結
        self.print_summary(results)
        return results
    
    def print_summary(self, results):
        """打印處理總結"""
        logger.info("\n" + "=" * 80)
        logger.info("📊 處理總結")
        logger.info("=" * 80)
        
        with self.stats_lock:
            elapsed = time.time() - self.stats['start_time']
            speed = self.stats['processed'] / (elapsed / 60) if elapsed > 0 else 0
            
            logger.info(f"\n✅ 成功: {self.stats['processed']} 個")
            logger.info(f"❌ 失敗: {self.stats['failed']} 個")
            logger.info(f"📦 總大小: {self.stats['total_size']/1024/1024:.1f} MB")
            logger.info(f"⏱️  耗時: {elapsed/60:.1f} 分鐘")
            logger.info(f"⚡ 速度: {speed:.1f} 文件/分鐘")
        
        # API Key 使用統計
        logger.info(f"\n📈 API Key 使用統計:")
        stats = self.key_balancer.get_stats()
        for i, (key, count) in enumerate(stats.items(), 1):
            logger.info(f"  Key {i}: {count} 次請求")
        
        logger.info("\n" + "=" * 80)
        logger.info("查看結果:")
        logger.info("  Markdown: /home/sms/ebook-converter/data/markdown-output/")
        logger.info("  索引: /home/sms/ebook-converter/data/wittgenstein-index/")
        logger.info("=" * 80)


def main():
    """主程序"""
    import argparse
    
    parser = argparse.ArgumentParser(description='超高並發電子書處理器')
    parser.add_argument('-w', '--workers', type=int, default=20,
                        help='並發線程數 (默認: 20)')
    parser.add_argument('-n', '--num-files', type=int, default=None,
                        help='處理文件數量 (默認: 全部)')
    parser.add_argument('-s', '--sources', nargs='+', 
                        default=['gdrive', 'baidu'],
                        help='處理來源 (默認: gdrive baidu)')
    
    args = parser.parse_args()
    
    # 雙 API Key
    api_keys = [
        "AIzaSyCG459HOLhXkbDQgw8rSYAvuqyM3RdMQHQ",
        "AIzaSyAuJRsStdO7WAIM5I9NtyUgumUzWPiz43o"
    ]
    
    processor = UltraParallelProcessor(
        api_keys=api_keys,
        max_workers=args.workers
    )
    
    processor.process_all_ebooks(
        max_files=args.num_files,
        sources=args.sources
    )


if __name__ == "__main__":
    main()
