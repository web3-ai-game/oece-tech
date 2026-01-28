#!/usr/bin/env python3
"""百度網盤處理器 - 使用 bypy + 去重功能"""
import os
import subprocess
import re
from pathlib import Path
from typing import List, Dict
import logging
from dedup_processor import DedupProcessor
from main import EbookConverterPipeline
from multi_cloud_downloader import MultiCloudDownloader

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class BaiduBypyProcessor:
    """百度網盤處理器（使用 bypy）"""
    
    def __init__(self, cache_dir="/home/sms/ebook-converter/data/baidu-cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.dedup = DedupProcessor()
        self.converter = EbookConverterPipeline()
        self.downloader = MultiCloudDownloader(cache_dir=str(self.cache_dir))
        
        # 支援的電子書格式
        self.ebook_formats = [
            '.pdf', '.epub', '.mobi', '.azw', '.azw3',
            '.doc', '.docx', '.txt', '.rtf', '.odt',
            '.djvu', '.fb2', '.html', '.htm', '.md'
        ]
    
    def list_files(self, remote_path="/") -> List[Dict]:
        """列出百度網盤文件（遞歸）"""
        logger.info(f"掃描百度網盤目錄: {remote_path}")
        
        all_files = []
        
        # 先列出當前目錄
        try:
            result = subprocess.run(
                ["bypy", "list", remote_path],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            subdirs = []
            lines = result.stdout.strip().split('\n')
            
            for line in lines:
                line = line.strip()
                if not line or line.startswith('/apps/bypy') or '($t $f $s $m $d)' in line:
                    continue
                
                parts = line.split()
                if len(parts) < 2:
                    continue
                
                file_type = parts[0]
                filename = parts[1]
                
                # 如果是目錄，記錄下來稍後遞歸
                if file_type == 'D':
                    subdir_path = f"{remote_path}/{filename}".replace('//', '/')
                    subdirs.append(subdir_path)
                    continue
                
                # 如果是文件，檢查是否為電子書
                if file_type == 'F':
                    ext = os.path.splitext(filename)[1].lower()
                    if ext in self.ebook_formats:
                        size = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0
                        all_files.append({
                            'source': 'baidu',
                            'path': remote_path,
                            'name': filename,
                            'full_path': f"{remote_path}/{filename}".replace('//', '/'),
                            'size': size,
                            'ext': ext
                        })
            
            # 遞歸掃描子目錄
            for subdir in subdirs:
                try:
                    subfiles = self.list_files(subdir)
                    all_files.extend(subfiles)
                except Exception as e:
                    logger.warning(f"無法掃描子目錄 {subdir}: {e}")
            
            logger.info(f"在 {remote_path} 找到 {len(all_files)} 個電子書文件")
            return all_files
            
        except subprocess.TimeoutExpired:
            logger.error(f"掃描超時: {remote_path}")
            return []
        except Exception as e:
            logger.error(f"掃描失敗 {remote_path}: {e}")
            return []
    
    def download_file(self, file_info: Dict) -> str:
        """下載文件到本地緩存"""
        # 確保有 source 字段
        if 'source' not in file_info:
            file_info['source'] = 'baidu'
            
        return self.downloader.download_file(file_info)
    
    def process_all(self, remote_path="/", max_files=None):
        """處理所有百度網盤文件（帶去重）"""
        logger.info("=" * 80)
        logger.info("🚀 百度網盤處理器啟動（帶去重功能）")
        logger.info("=" * 80)
        
        # 1. 掃描文件
        logger.info("\n步驟 1: 掃描百度網盤文件...")
        all_files = self.list_files(remote_path)
        
        if not all_files:
            logger.warning("未找到電子書文件")
            return
        
        logger.info(f"找到 {len(all_files)} 個電子書文件")
        
        # 2. 去重
        logger.info("\n步驟 2: 過濾已處理的文件...")
        new_files = self.dedup.filter_new_files(all_files)
        
        if not new_files:
            logger.info("所有文件都已處理過！")
            return
        
        logger.info(f"需要處理 {len(new_files)} 個新文件")
        
        # 限制處理數量
        if max_files:
            new_files = new_files[:max_files]
            logger.info(f"限制處理數量: {len(new_files)} 個文件")
        
        # 3. 處理文件
        logger.info("\n步驟 3: 下載並轉換為 Markdown...")
        
        stats = {'success': 0, 'failed': 0}
        
        for i, file_info in enumerate(new_files, 1):
            logger.info(f"\n處理 {i}/{len(new_files)}: {file_info['name']}")
            
            try:
                # 下載
                local_path = self.download_file(file_info)
                if not local_path:
                    stats['failed'] += 1
                    continue
                
                # 轉換
                success = self.converter.process_single_file(local_path)
                
                if success:
                    stats['success'] += 1
                    logger.info(f"✓ 成功: {file_info['name']}")
                else:
                    stats['failed'] += 1
                    logger.error(f"✗ 失敗: {file_info['name']}")
                
                # 清理緩存
                try:
                    os.remove(local_path)
                except:
                    pass
                    
            except Exception as e:
                logger.error(f"處理異常 {file_info['name']}: {e}")
                stats['failed'] += 1
        
        # 4. 總結
        logger.info("\n" + "=" * 80)
        logger.info("📊 處理總結")
        logger.info("=" * 80)
        logger.info(f"✅ 成功: {stats['success']} 個")
        logger.info(f"❌ 失敗: {stats['failed']} 個")
        logger.info(f"📁 輸出目錄: /home/sms/ebook-converter/data/markdown-output/")
        logger.info("=" * 80)


def main():
    """主程序"""
    import argparse
    
    parser = argparse.ArgumentParser(description='百度網盤電子書處理器（帶去重）')
    parser.add_argument('-p', '--path', default='/', help='百度網盤路徑（默認: /）')
    parser.add_argument('-n', '--num', type=int, default=None, help='處理文件數量（默認: 全部）')
    
    args = parser.parse_args()
    
    processor = BaiduBypyProcessor()
    processor.process_all(remote_path=args.path, max_files=args.num)


if __name__ == "__main__":
    main()
