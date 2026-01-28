#!/usr/bin/env python3
"""統一的電子書處理管道 - 支援多雲盤"""
import os
import sys
from pathlib import Path
from multi_cloud_downloader import MultiCloudDownloader
from main import EbookConverterPipeline
from fast_track_runner import FastTrackRunner
from config import MD_OUTPUT_DIR
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class UnifiedEbookPipeline:
    """統一的電子書處理管道"""
    
    def __init__(self):
        self.downloader = MultiCloudDownloader()
        self.converter = EbookConverterPipeline()
        self.fast_track = FastTrackRunner()
        self.max_disk_usage_gb = 200  # 最大磁盤使用量
    
    def check_disk_space(self) -> float:
        """檢查可用磁盤空間（GB）"""
        stat = os.statvfs('/home/sms')
        free_gb = (stat.f_bavail * stat.f_frsize) / (1024**3)
        return free_gb
    
    def process_cloud_ebooks(self, max_files: int = None, sources: list = None):
        """處理雲盤電子書 (Stream processing)"""
        logger.info("=" * 60)
        logger.info("統一電子書處理管道")
        logger.info("=" * 60)
        
        # 檢查磁盤空間
        free_space = self.check_disk_space()
        logger.info(f"可用磁盤空間: {free_space:.1f} GB")
        
        if free_space < 10:
            logger.error("磁盤空間不足 10GB，請清理後再試")
            return
        
        # 使用生成器掃描
        logger.info("\n開始掃描並處理雲盤文件 (流式處理)...")
        ebook_generator = self.downloader.yield_all_ebooks()
        
        # 處理每個文件
        processed = 0
        failed = 0
        skipped = 0
        scanned_count = 0
        
        for file_info in ebook_generator:
            scanned_count += 1
            
            # 過濾來源
            if sources and file_info['source'] not in sources:
                continue
                
            # 限制數量 (Check before processing)
            if max_files and processed >= max_files:
                logger.info(f"\n已達到處理數量限制 ({max_files})，停止處理。")
                break
            
            logger.info(f"\n{'='*60}")
            logger.info(f"掃描到第 {scanned_count} 個文件: {file_info['name']}")
            logger.info(f"來源: {file_info['source'].upper()}")
            logger.info(f"{'='*60}")
            
            # 0. 檢查是否為古籍/縣志 (Fast Track)
            is_ancient = any(k in file_info.get('path', '') for k in ['古籍', '县志', '方志', '四库', '大藏经', '地方志'])
            if is_ancient:
                logger.info("📜 檢測到古籍/縣志，使用 Fast Track 通道 (跳過 OCR/轉換)...")
                try:
                    result = self.fast_track.process_single_file(file_info)
                    if result == 'success':
                        processed += 1
                        logger.info(f"✓ 古籍歸檔成功: {file_info['name']}")
                    elif result == 'skipped':
                        skipped += 1
                        logger.info(f"⏭️ 跳過: {file_info['name']}")
                    else:
                        failed += 1
                        logger.error(f"古籍處理失敗: {file_info['name']}")
                except Exception as e:
                    logger.error(f"Fast Track 執行失敗: {e}")
                    failed += 1
                
                # Fast Track handles its own cleanup
                continue

            try:
                # 1. 下載文件
                logger.info("步驟 1/4: 下載文件...")
                local_path = self.downloader.download_file(file_info)
                
                if not local_path or not os.path.exists(local_path):
                    logger.error("下載失敗，跳過")
                    failed += 1
                    continue
                
                # 2. 轉換為 Markdown
                logger.info("步驟 2/4: 轉換為 Markdown...")
                success = self.converter.process_single_file(local_path)
                
                # Handle dictionary response from process_single_file
                if isinstance(success, dict):
                    if success.get('success'):
                        if success.get('skipped'):
                            logger.info(f"⏭️ 跳過 (已存在): {file_info['name']}")
                            skipped += 1
                        else:
                            logger.info(f"✓ 成功處理: {file_info['name']}")
                            processed += 1
                    else:
                        logger.error(f"轉換失敗: {success.get('error')}")
                        failed += 1
                elif success: # Boolean fallback
                    processed += 1
                    logger.info(f"✓ 成功處理: {file_info['name']}")
                else:
                    logger.error("轉換失敗")
                    failed += 1
                
                # 3. 清理本地文件（節省空間）
                logger.info("步驟 3/4: 清理緩存...")
                try:
                    if local_path and os.path.exists(local_path):
                        os.remove(local_path)
                        logger.info(f"已刪除緩存: {local_path}")
                except Exception as e:
                    logger.warning(f"清理失敗: {e}")
                
                # 4. 檢查磁盤空間
                free_space = self.check_disk_space()
                
                if free_space < 5:
                    logger.warning(f"磁盤空間不足 ({free_space:.1f} GB)，執行額外清理...")
                    self.downloader.cleanup_cache(keep_files=0)
                
            except Exception as e:
                logger.error(f"處理失敗: {e}")
                failed += 1
                continue
        
        # 總結
        logger.info("\n" + "=" * 60)
        logger.info("處理完成！")
        logger.info("=" * 60)
        logger.info(f"掃描總數: {scanned_count}")
        logger.info(f"處理成功: {processed}")
        logger.info(f"已跳過: {skipped}")
        logger.info(f"失敗: {failed}")
        logger.info("=" * 60)
        
        # 5. 生成總目錄
        logger.info("步驟 5/5: 更新總目錄 (CATALOG.md)...")
        try:
            from generate_master_catalog import CatalogGenerator
            generator = CatalogGenerator(MD_OUTPUT_DIR)
            generator.generate()
            logger.info("目錄更新完成")
        except Exception as e:
            logger.error(f"目錄生成失敗: {e}")

        # 查看輸出
        logger.info("\nMarkdown 輸出目錄:")
        logger.info(f"  {MD_OUTPUT_DIR}")
        logger.info("\n維根斯坦索引:")
        logger.info("  /home/sms/ebook-converter/data/wittgenstein-index/")


def main():
    """主程序"""
    import argparse
    
    parser = argparse.ArgumentParser(description="統一電子書處理管道")
    parser.add_argument("--auto", action="store_true", help="處理所有雲盤的電子書（自動模式）")
    parser.add_argument("--baidu", action="store_true", help="只處理百度網盤")
    parser.add_argument("--gdrive", action="store_true", help="只處理 Google Drive")
    parser.add_argument("--limit", type=int, help="處理指定數量的文件")
    
    args = parser.parse_args()
    
    pipeline = UnifiedEbookPipeline()
    
    # CLI Mode
    if args.auto or args.baidu or args.gdrive or args.limit:
        sources = []
        if args.baidu: sources.append('baidu')
        if args.gdrive: sources.append('gdrive')
        
        # Default to all if not specified but auto/limit is present
        if not sources and (args.auto or args.limit):
            sources = None 
            
        pipeline.process_cloud_ebooks(max_files=args.limit, sources=sources)
        return

    # Interactive Mode
    print("\n" + "=" * 60)
    print("統一電子書處理管道")
    print("支援：百度網盤、Google Drive")
    print("=" * 60)
    
    print("\n選項：")
    print("1. 處理所有雲盤的電子書（自動模式）")
    print("2. 只處理百度網盤")
    print("3. 只處理 Google Drive")
    print("4. 處理指定數量的文件（測試）")
    
    choice = input("\n請選擇 (1-4): ").strip()
    
    if choice == '1':
        pipeline.process_cloud_ebooks()
    
    elif choice == '2':
        pipeline.process_cloud_ebooks(sources=['baidu'])
    
    elif choice == '3':
        pipeline.process_cloud_ebooks(sources=['gdrive'])
    
    elif choice == '4':
        try:
            num = int(input("處理多少個文件？ "))
            pipeline.process_cloud_ebooks(max_files=num)
        except ValueError:
            print("無效的數字")
    
    else:
        print("無效的選擇")


if __name__ == "__main__":
    main()
