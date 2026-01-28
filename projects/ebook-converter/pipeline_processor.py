#!/usr/bin/env python3
"""
流式處理管道 - 為推演種子庫設計
下載 → 清洗 → 轉換 → 上傳 S3 → 寫入 MongoDB → 清理本地
"""
import os
import json
import subprocess
import hashlib
import time
import random
from pathlib import Path
from typing import List, Dict, Optional, Iterable
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

from dedup_processor import DedupProcessor
from main import EbookConverterPipeline
from multi_cloud_downloader import MultiCloudDownloader

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class PipelineProcessor:
    """流式處理管道 - 煉金術士模型"""
    
    def __init__(self, 
                 cache_dir="/home/sms/ebook-converter/data/pipeline-cache",
                 batch_size=50,
                 max_cache_gb=80):
        """
        初始化處理管道
        
        Args:
            cache_dir: 本地緩存目錄（SSD）
            batch_size: 每批處理文件數
            max_cache_gb: 最大緩存大小（GB），防止撐爆 SSD
        """
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.batch_size = batch_size
        self.max_cache_bytes = max_cache_gb * 1024 * 1024 * 1024
        
        # 加載分析結果
        self.analysis_dir = Path("/home/sms/ebook-converter/data/baidu-analysis")
        self.categories_file = self.analysis_dir / "file_categories.json"
        
        # 處理器
        self.dedup = DedupProcessor()
        self.converter = EbookConverterPipeline()
        self.downloader = MultiCloudDownloader(cache_dir=str(self.cache_dir))
        
        # MongoDB 連接（可選）
        self.mongo_enabled = True
        self.mongo_backup = Path("/home/sms/ebook-converter/data/mongodb-backup.jsonl")
        
        # S3 上傳（可選）
        self.s3_enabled = True
        
        # 統計
        self.stats = {
            'total': 0,
            'processed': 0,
            'success': 0,
            'failed': 0,
            'skipped': 0,
            'uploaded_s3': 0,
            'saved_mongo': 0
        }
    
    def load_txt_files(self) -> List[Dict]:
        """加載 TXT 文件列表"""
        logger.info("📂 加載 TXT 文件列表...")
        
        with open(self.categories_file, 'r', encoding='utf-8') as f:
            categories = json.load(f)
        
        txt_files = categories.get('txt_files', [])
        logger.info(f"✓ 找到 {len(txt_files)} 個 TXT 文件")
        
        return txt_files
    
    def read_file_safe(self, file_path: str) -> str:
        """智能讀取文件，自動處理 GBK/GB18030/UTF-8 編碼問題"""
        # 1. 使用 chardet 檢測編碼
        detected_encoding = None
        try:
            with open(file_path, 'rb') as f:
                raw_data = f.read(50000)  # 讀取前 50KB 進行檢測
                result = chardet.detect(raw_data)
                if result['confidence'] > 0.8:
                    detected_encoding = result['encoding']
        except Exception as e:
            logger.warning(f"Chardet 檢測失敗: {e}")

        # 構建嘗試列表
        encodings = []
        if detected_encoding:
            encodings.append(detected_encoding)
        
        # 常用中文編碼補充
        encodings.extend(['utf-8', 'gb18030', 'gbk', 'gb2312', 'big5', 'utf-16', 'latin1'])
        
        # 去重保持順序
        seen = set()
        unique_encodings = []
        for enc in encodings:
            if not enc: continue
            # 統一轉小寫比較
            enc_lower = enc.lower()
            if enc_lower == 'gb2312': enc_lower = 'gb18030' # GB18030 兼容 GB2312，優先使用
            
            if enc_lower not in seen:
                unique_encodings.append(enc)
                seen.add(enc_lower)

        for enc in unique_encodings:
            try:
                with open(file_path, 'r', encoding=enc) as f:
                    return f.read()
            except (UnicodeDecodeError, LookupError):
                continue
        
        # 最後嘗試：忽略錯誤
        logger.warning(f"⚠️ 無法識別編碼，使用 UTF-8 忽略錯誤: {file_path}")
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    
    def calculate_file_hash(self, file_path: str) -> str:
        """計算文件 hash（用作唯一 ID）"""
        hasher = hashlib.md5()
        try:
            with open(file_path, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hasher.update(chunk)
            return hasher.hexdigest()
        except:
            return hashlib.md5(file_path.encode()).hexdigest()
    
    def get_cache_size(self) -> int:
        """獲取當前緩存大小"""
        total_size = 0
        for file in self.cache_dir.rglob('*'):
            if file.is_file():
                total_size += file.stat().st_size
        return total_size
    
    def clean_cache(self):
        """清理緩存目錄"""
        logger.info("🧹 清理本地緩存...")
        for file in self.cache_dir.rglob('*'):
            if file.is_file():
                try:
                    file.unlink()
                except Exception as e:
                    logger.warning(f"無法刪除 {file}: {e}")
        logger.info("✓ 緩存已清理")
    
    def download_file(self, file_info: Dict) -> Optional[str]:
        """
        從雲盤下載文件到本地緩存
        
        Returns:
            本地文件路徑，失敗返回 None
        """
        # 檢查緩存大小
        if self.get_cache_size() > self.max_cache_bytes:
            logger.warning(f"⚠️ 緩存已滿，清理中...")
            self.clean_cache()
            
        # 確保有 source 字段 (兼容舊數據)
        if 'source' not in file_info:
            file_info['source'] = 'baidu'
            
        # 使用統一下載器
        return self.downloader.download_file(file_info)
    
    def process_single_file_safe(self, file_info: Dict) -> Dict:
        """
        安全處理單個文件（帶重試機制）
        
        Returns:
            處理結果字典
        """
        filename = file_info['name']
        max_retries = 3
        base_wait = 2
        
        result = {
            'filename': filename,
            'status': 'pending',
            'local_path': None,
            'markdown_path': None,
            'doc_id': None,
            'mongo_id': None,
            'error': None
        }
        
        for attempt in range(max_retries):
            try:
                # 1. 下載文件
                local_path = self.download_file(file_info)
                if not local_path:
                    result['status'] = 'download_failed'
                    result['error'] = '下載失敗'
                    return result
                
                result['local_path'] = local_path
                
                # 2. 調用轉換管道 (包含 轉換 -> 索引 -> S3 -> Mongo)
                logger.info(f"🔄 處理: {filename}")
                pipeline_result = self.converter.process_single_file(local_path)
                
                # 3. 處理結果
                if pipeline_result.get('skipped'):
                    result['status'] = 'skipped'
                    self.stats['skipped'] += 1
                    logger.info(f"⏭️ 跳過: {filename} ({pipeline_result.get('reason')})")
                    # 清理本地文件
                    try:
                         if os.path.exists(local_path):
                            os.remove(local_path)
                    except:
                        pass
                    return result

                if not pipeline_result.get('success'):
                    raise Exception(pipeline_result.get('error', '未知轉換錯誤'))
                
                # 成功
                result['status'] = 'success'
                result['markdown_path'] = pipeline_result.get('markdown_path')
                result['doc_id'] = pipeline_result.get('doc_id')
                result['mongo_id'] = pipeline_result.get('mongo_id')
                
                self.stats['success'] += 1
                self.stats['uploaded_s3'] += 1 # main.py handles this
                if result['mongo_id']:
                    self.stats['saved_mongo'] += 1

                # 4. 備份日誌
                self.backup_to_jsonl(file_info, result)
                
                # 5. 清理本地文件
                try:
                    if os.path.exists(local_path):
                        os.remove(local_path)
                except:
                    pass
                
                logger.info(f"✅ 完成: {filename}")
                return result
                
            except Exception as e:
                error_msg = str(e)
                
                # API 錯誤重試
                if "500" in error_msg or "429" in error_msg or "Internal" in error_msg:
                    wait_time = base_wait * (attempt + 1) + random.uniform(0, 1)
                    logger.warning(f"🔄 API 錯誤，等待 {wait_time:.1f}s 重試 ({attempt+1}/{max_retries})...")
                    time.sleep(wait_time)
                else:
                    result['status'] = 'failed'
                    result['error'] = error_msg
                    self.stats['failed'] += 1
                    logger.error(f"❌ 失敗: {filename} - {error_msg}")
                    return result
        
        result['status'] = 'failed'
        result['error'] = f'重試 {max_retries} 次失敗'
        self.stats['failed'] += 1
        logger.error(f"💀 放棄: {filename}")
        return result
    
    def backup_to_jsonl(self, file_info: Dict, result: Dict):
        """備份到 JSONL 文件"""
        record = {
            'filename': file_info['name'],
            'original_path': file_info['full_path'],
            'size': file_info['size'],
            'doc_id': result.get('doc_id'),
            'mongo_id': result.get('mongo_id'),
            'status': result['status'],
            'processed_at': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        with open(self.mongo_backup, 'a', encoding='utf-8') as f:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    
    def process_batch(self, files: List[Dict], max_workers: int = 8):
        """
        批量處理文件（並發）
        
        Args:
            files: 文件列表
            max_workers: 最大並發數
        """
        logger.info(f"\n{'='*80}")
        logger.info(f"🔥 開始批量處理: {len(files)} 個文件")
        logger.info(f"並發數: {max_workers}")
        logger.info(f"{'='*80}\n")
        
        start_time = time.time()
        results = []
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {
                executor.submit(self.process_single_file_safe, f): f['name']
                for f in files
            }
            
            for i, future in enumerate(as_completed(future_to_file), 1):
                filename = future_to_file[future]
                try:
                    result = future.result()
                    results.append(result)
                    
                    # 進度顯示
                    elapsed = time.time() - start_time
                    avg_time = elapsed / i
                    remaining = (len(files) - i) * avg_time
                    
                    logger.info(f"[{i}/{len(files)}] {result['status']} | "
                              f"預計剩餘: {remaining/60:.1f}分")
                    
                except Exception as exc:
                    logger.error(f"💥 線程崩潰: {filename} - {exc}")
        
        elapsed = time.time() - start_time
        logger.info(f"\n{'='*80}")
        logger.info(f"📊 批次處理完成！耗時: {elapsed/60:.1f} 分鐘")
        logger.info(f"{'='*80}\n")
        
        return results

    def run(self, files: Iterable[Dict] = None, max_files: Optional[int] = None, max_workers: int = 50):
        """
        運行完整處理流程 (支援流式輸入)
        
        Args:
            files: 要處理的文件迭代器 (List or Generator)
            max_files: 最大處理文件數（None = 全部）
            max_workers: 並發數
        """
        logger.info("="*80)
        logger.info("🚀 流式處理管道啟動 - 煉金術士版 (X.AI + MongoDB) [Streaming Mode]")
        logger.info("="*80)
        
        if files is None:
            # Fallback to local list
            try:
                files = self.load_txt_files()
            except Exception as e:
                logger.warning(f"無法加載本地文件列表: {e}")
                files = []
            
        # Stream processing with batching
        batch = []
        processed_count = 0
        skipped_count = 0
        
        logger.info("\n步驟 1: 開始流式處理 (即時去重 -> 分批 -> 執行)...")
        
        try:
            for file_info in files:
                # 1. Dedup on the fly
                if self.dedup.is_processed(file_info):
                    skipped_count += 1
                    if skipped_count % 100 == 0:
                        logger.info(f"已跳過 {skipped_count} 個重複文件...")
                    continue
                
                batch.append(file_info)
                
                # 2. Check batch size
                if len(batch) >= self.batch_size:
                    batch_num = processed_count // self.batch_size + 1
                    logger.info(f"\n{'='*80}")
                    logger.info(f"📦 批次 {batch_num}: 處理 {len(batch)} 個文件")
                    logger.info(f"{'='*80}")
                    
                    self.process_batch(batch, max_workers)
                    processed_count += len(batch)
                    batch = []
                    
                    # Clean cache
                    if self.get_cache_size() > self.max_cache_bytes * 0.8:
                        self.clean_cache()
                
                # 3. Check max limit
                if max_files and processed_count >= max_files:
                    logger.info(f"達到最大處理數量限制: {max_files}")
                    break
            
            # Process remaining batch
            if batch and (not max_files or processed_count < max_files):
                batch_num = processed_count // self.batch_size + 1
                logger.info(f"\n{'='*80}")
                logger.info(f"📦 批次 {batch_num} (尾部): 處理 {len(batch)} 個文件")
                logger.info(f"{'='*80}")
                self.process_batch(batch, max_workers)
                processed_count += len(batch)
                
        except KeyboardInterrupt:
            logger.warning("\n⚠️ 用戶中斷處理 stream")
            # Don't raise, let summary print
        except Exception as e:
            logger.error(f"Stream 處理異常: {e}", exc_info=True)
            
        self.stats['total'] = processed_count + skipped_count 
        self.stats['skipped'] = skipped_count
        
        # 5. 最終統計
        self.print_summary()
    
    def print_summary(self):
        """打印處理總結"""
        logger.info("\n" + "="*80)
        logger.info("📊 處理總結")
        logger.info("="*80)
        logger.info(f"總文件數: {self.stats['total']}")
        logger.info(f"✅ 成功: {self.stats['success']}")
        logger.info(f"❌ 失敗: {self.stats['failed']}")
        logger.info(f"⏭️ 跳過: {self.stats['skipped']}")
        
        if self.s3_enabled:
            logger.info(f"☁️ 上傳 S3: {self.stats['uploaded_s3']}")
        
        if self.mongo_enabled:
            logger.info(f"🗄️ 寫入 MongoDB: {self.stats['saved_mongo']}")
        else:
            logger.info(f"💾 備份到: {self.mongo_backup}")
        
        logger.info(f"📁 Markdown 輸出: /home/sms/ebook-converter/data/markdown-output/")
        logger.info("="*80)


def main():
    """主程序"""
    import argparse
    
    parser = argparse.ArgumentParser(description='流式處理管道 - 煉金術士模型')
    parser.add_argument('-n', '--num', type=int, default=None, 
                       help='處理文件數量（默認全部）')
    parser.add_argument('-w', '--workers', type=int, default=100,
                       help='並發數（默認 100 - 極限狂暴模式）')
    parser.add_argument('-b', '--batch', type=int, default=100,
                       help='每批處理數量（默認 100）')
    parser.add_argument('--cache-gb', type=int, default=80,
                       help='最大緩存大小 GB（默認 80）')
    
    args = parser.parse_args()
    
    processor = PipelineProcessor(
        batch_size=args.batch,
        max_cache_gb=args.cache_gb
    )
    
    processor.run(max_files=args.num, max_workers=args.workers)


if __name__ == "__main__":
    main()
