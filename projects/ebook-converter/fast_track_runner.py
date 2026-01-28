#!/usr/bin/env python3
"""
Fast Track Pipeline - S3 Archiving for Ancient Books/Gazetteers
Skips OCR/Conversion. Downloads files and uploads them directly to S3 for indexing/reference.
"""
import os
import json
import time
import logging
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict

from multi_cloud_downloader import MultiCloudDownloader
from s3_uploader import S3Uploader
from mongodb_handler import MongoDBHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("fast_track_pipeline.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("FastTrack")

class FastTrackRunner:
    def __init__(self, 
                 workers=20, 
                 cache_dir="/home/sms/ebook-converter/data/ancient-book-cache"):
        self.workers = workers
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.downloader = MultiCloudDownloader(cache_dir=str(self.cache_dir))
        self.s3 = S3Uploader()
        self.mongo = MongoDBHandler()
        
        self.analysis_file = Path("/home/sms/ebook-converter/data/baidu-analysis/file_categories.json")
        
        self.stats = {
            'total': 0,
            'success': 0,
            'failed': 0,
            'skipped': 0
        }

    def load_files(self) -> List[Dict]:
        if not self.analysis_file.exists():
            logger.error(f"Analysis file not found: {self.analysis_file}")
            return []
            
        try:
            with open(self.analysis_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('ancient_books', [])
        except Exception as e:
            logger.error(f"Failed to load analysis file: {e}")
            return []

    def process_single_file(self, file_info: Dict):
        filename = file_info['name']
        
        # 1. Dedup Check (MongoDB)
        if self.mongo.document_exists(filename):
            logger.info(f"⏭️  Already indexed: {filename}")
            return 'skipped'
            
        try:
            logger.info(f"📥 Downloading: {filename}")
            
            # Ensure source is set
            if 'source' not in file_info:
                file_info['source'] = 'baidu'
                
            # 2. Download
            local_path = self.downloader.download_file(file_info)
            if not local_path:
                logger.error(f"❌ Download failed: {filename}")
                return 'failed'
            
            file_size = os.path.getsize(local_path)
            
            # 3. Upload to S3 (Raw Archive)
            # Use original relative path for S3 key if possible, or organize by category
            rel_path = file_info.get('path', '').strip('/')
            if rel_path.startswith('/'): rel_path = rel_path[1:]
            
            s3_key = f"archives/ancient_books/{rel_path}/{filename}"
            # Sanitize key
            s3_key = s3_key.replace('//', '/')
            
            metadata = {
                'original_path': file_info.get('full_path', ''),
                'category': 'ancient_book',
                'archived_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            if self.s3.upload_file(local_path, s3_key, metadata):
                # 4. Save Index to MongoDB
                doc_metadata = {
                    'filename': filename,
                    's3_key': s3_key,
                    's3_bucket': self.s3.bucket_name,
                    'size': file_size,
                    'category': 'ancient_book',
                    'is_archived': True,
                    'original_path': file_info.get('full_path'),
                    'description': "Scanned ancient book/gazetteer (Raw PDF)"
                }
                
                # Save metadata only (no content)
                self.mongo.save_document(filename, "", doc_metadata)
                logger.info(f"✅ Archived & Indexed: {filename}")
                return 'success'
            else:
                logger.error(f"❌ S3 Upload failed: {filename}")
                return 'failed'

        except Exception as e:
            logger.error(f"❌ Processing error {filename}: {e}")
            return 'failed'
            
        finally:
            # 5. Cleanup
            if 'local_path' in locals() and local_path and os.path.exists(local_path):
                try:
                    os.remove(local_path)
                except:
                    pass

    def run(self):
        files = self.load_files()
        self.stats['total'] = len(files)
        logger.info(f"🚀 Starting Fast Track Pipeline for {len(files)} Ancient Books")
        logger.info(f"⚡ Workers: {self.workers}")
        
        with ThreadPoolExecutor(max_workers=self.workers) as executor:
            future_to_file = {
                executor.submit(self.process_single_file, f): f 
                for f in files
            }
            
            for future in as_completed(future_to_file):
                try:
                    result = future.result()
                    self.stats[result] += 1
                except Exception as e:
                    logger.error(f"Worker exception: {e}")
                    self.stats['failed'] += 1
                    
                processed = self.stats['success'] + self.stats['failed'] + self.stats['skipped']
                if processed % 10 == 0:
                    logger.info(f"📊 Progress: {processed}/{len(files)} (S:{self.stats['success']} F:{self.stats['failed']} Sk:{self.stats['skipped']})")
        
        logger.info("="*60)
        logger.info("🏁 Pipeline Completed")
        logger.info(f"Total: {self.stats['total']}")
        logger.info(f"✅ Success: {self.stats['success']}")
        logger.info(f"⏭️ Skipped: {self.stats['skipped']}")
        logger.info(f"❌ Failed: {self.stats['failed']}")
        logger.info("="*60)

if __name__ == "__main__":
    runner = FastTrackRunner()
    runner.run()
