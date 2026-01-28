#!/usr/bin/env python3
import os
import sys
from pathlib import Path
from multi_cloud_downloader import MultiCloudDownloader
from main import EbookConverterPipeline
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_novel_pipeline():
    logger.info("🧪 Starting Novel Pipeline Verification...")
    
    # 1. Download sample novel
    downloader = MultiCloudDownloader()
    
    # Specific path to a known novel
    remote_dir = "知識庫/文学/中国：近现代文学及畅销书小说大合集/赠送：各类小说上千本/12、知名大神小说合集150本/唐家三少小说作品-9本"
    filename = "斗罗大陆_唐家三少_TXT小说天堂.txt"
    
    logger.info(f"📥 Downloading sample: {filename}")
    local_path = downloader.download_from_baidu(remote_dir, filename)
    
    if not local_path or not os.path.exists(local_path):
        logger.error("❌ Download failed. Cannot proceed.")
        return
    
    logger.info(f"✅ Downloaded to: {local_path}")
    
    # 2. Process with Main Pipeline (Conversion + Beautification)
    logger.info("⚙️  Running Main Pipeline (Conversion + Beautification)...")
    pipeline = EbookConverterPipeline()
    result = pipeline.process_single_file(local_path)
    
    if result['success']:
        logger.info("✅ Pipeline processing successful!")
        logger.info(f"📝 Markdown Path: {result.get('markdown_path')}")
        
        # 3. Verify Output
        md_path = result.get('markdown_path')
        if md_path and os.path.exists(md_path):
            with open(md_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Basic checks for beautification
            logger.info("🔍 Verifying output content...")
            header_count = content.count("# ")
            dialogue_chars = ["「", "」", "“", "”"]
            has_dialogue = any(c in content for c in dialogue_chars)
            
            logger.info(f"   - Header Count: {header_count}")
            logger.info(f"   - Has Dialogue Quotes: {has_dialogue}")
            
            print("\n" + "="*40)
            print("SAMPLE CONTENT PREVIEW (First 500 chars):")
            print("="*40)
            print(content[:500])
            print("="*40 + "\n")
            
        else:
            logger.error("❌ Markdown file missing after success report.")
    else:
        logger.error(f"❌ Pipeline processing failed: {result.get('error')}")

if __name__ == "__main__":
    test_novel_pipeline()
