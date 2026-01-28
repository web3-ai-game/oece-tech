#!/usr/bin/env python3
"""智能百度網盤處理器 - 分層處理策略"""
import os
import subprocess
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


class SmartBaiduProcessor:
    """智能百度網盤處理器 - 分層處理"""
    
    def __init__(self, cache_dir="/home/sms/ebook-converter/data/baidu-cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.dedup = DedupProcessor()
        self.converter = EbookConverterPipeline()
        self.downloader = MultiCloudDownloader(cache_dir=str(self.cache_dir))
        
        # Level 1: 優先處理格式（爽文/小說）- 快速處理
        self.priority_formats = ['.txt', '.epub', '.mobi', '.azw', '.azw3']
        
        # Level 2: 標準文檔格式
        self.standard_formats = ['.doc', '.docx', '.rtf', '.odt', '.md', '.html', '.htm']
        
        # Level 3: 古籍格式（僅建立元數據索引，不全文處理）
        self.archive_formats = ['.pdf', '.djvu', '.fb2', '.pdg']
    
    def list_files_by_level(self, remote_path="/", level=1, _depth=0) -> List[Dict]:
        """按層級列出文件（深度遞歸掃描）"""
        indent = "  " * _depth
        logger.info(f"{indent}📂 掃描: {remote_path}")
        
        # 選擇格式（只在根層級顯示）
        if _depth == 0:
            if level == 1:
                formats = self.priority_formats
                logger.info(f"Level 1 格式: {formats} (優先處理)")
            elif level == 2:
                formats = self.standard_formats
                logger.info(f"Level 2 格式: {formats} (標準處理)")
            else:
                formats = self.archive_formats
                logger.info(f"Level 3 格式: {formats} (元數據索引)")
        else:
            if level == 1:
                formats = self.priority_formats
            elif level == 2:
                formats = self.standard_formats
            else:
                formats = self.archive_formats
        
        all_files = []
        
        try:
            result = subprocess.run(
                ["bypy", "list", remote_path],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            subdirs = []
            current_files = []
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
                
                # 目錄：記錄待遞歸
                if file_type == 'D':
                    subdir_path = f"{remote_path}/{filename}".replace('//', '/')
                    subdirs.append((filename, subdir_path))
                    continue
                
                # 文件：檢查格式
                if file_type == 'F':
                    ext = os.path.splitext(filename)[1].lower()
                    if ext in formats:
                        size = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0
                        current_files.append({
                            'source': 'baidu',
                            'path': remote_path,
                            'name': filename,
                            'full_path': f"{remote_path}/{filename}".replace('//', '/'),
                            'size': size,
                            'ext': ext,
                            'level': level
                        })
            
            # 顯示當前層級結果
            if current_files:
                logger.info(f"{indent}  ✓ 找到 {len(current_files)} 個文件")
                all_files.extend(current_files)
            
            if subdirs:
                logger.info(f"{indent}  📁 發現 {len(subdirs)} 個子目錄，開始遞歸...")
            
            # 關鍵：遞歸掃描所有子目錄
            for subdir_name, subdir_path in subdirs:
                logger.info(f"{indent}  ⤷ 進入: {subdir_name}")
                try:
                    subfiles = self.list_files_by_level(subdir_path, level, _depth + 1)
                    all_files.extend(subfiles)
                except Exception as e:
                    logger.warning(f"{indent}  ✗ 無法掃描 {subdir_name}: {e}")
            
            # 總結當前層級
            if _depth == 0 and all_files:
                logger.info(f"\n{'='*80}")
                logger.info(f"📊 掃描完成: 共找到 {len(all_files)} 個 Level {level} 文件")
                logger.info(f"{'='*80}\n")
            
            return all_files
            
        except subprocess.TimeoutExpired:
            logger.error(f"{indent}✗ 掃描超時: {remote_path}")
            return []
        except Exception as e:
            logger.error(f"{indent}✗ 掃描失敗 {remote_path}: {e}")
            return []
    
    def download_file(self, file_info: Dict) -> str:
        """下載文件到本地緩存"""
        # 確保有 source 字段
        if 'source' not in file_info:
            file_info['source'] = 'baidu'
            
        return self.downloader.download_file(file_info)
    
    def create_metadata_index(self, files: List[Dict]) -> str:
        """為 Level 3 文件創建元數據索引"""
        logger.info(f"創建元數據索引: {len(files)} 個文件")
        
        index_file = Path("/home/sms/ebook-converter/data/baidu-metadata-index.md")
        
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write("# 百度網盤古籍方志元數據索引\n\n")
            f.write(f"生成時間: {os.popen('date').read().strip()}\n\n")
            f.write(f"總文件數: {len(files)}\n\n")
            f.write("---\n\n")
            
            # 按路徑分組
            by_path = {}
            for file_info in files:
                path = file_info['path']
                if path not in by_path:
                    by_path[path] = []
                by_path[path].append(file_info)
            
            # 寫入索引
            for path in sorted(by_path.keys()):
                f.write(f"## {path}\n\n")
                for file_info in by_path[path]:
                    size_mb = file_info['size'] / 1024 / 1024
                    f.write(f"- **{file_info['name']}** ({size_mb:.1f} MB)\n")
                    f.write(f"  - 路徑: `{file_info['full_path']}`\n")
                    f.write(f"  - 格式: {file_info['ext']}\n\n")
        
        logger.info(f"元數據索引已保存: {index_file}")
        return str(index_file)
    
    def process_level(self, remote_path="/", level=1, max_files=None):
        """處理指定層級的文件"""
        logger.info("=" * 80)
        logger.info(f"🚀 智能處理器啟動 - Level {level}")
        logger.info("=" * 80)
        
        # 1. 掃描文件
        logger.info(f"\n步驟 1: 掃描 Level {level} 文件...")
        all_files = self.list_files_by_level(remote_path, level)
        
        if not all_files:
            logger.warning(f"未找到 Level {level} 文件")
            return
        
        logger.info(f"找到 {len(all_files)} 個 Level {level} 文件")
        
        # 2. Level 3 特殊處理：只建立元數據索引
        if level == 3:
            logger.info("\n步驟 2: Level 3 文件 - 創建元數據索引...")
            index_file = self.create_metadata_index(all_files)
            logger.info(f"✓ 元數據索引已創建: {index_file}")
            return
        
        # 3. Level 1/2: 去重
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
        
        # 4. 下載並轉換
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
        
        # 5. 總結
        logger.info("\n" + "=" * 80)
        logger.info(f"📊 Level {level} 處理總結")
        logger.info("=" * 80)
        logger.info(f"✅ 成功: {stats['success']} 個")
        logger.info(f"❌ 失敗: {stats['failed']} 個")
        logger.info(f"📁 輸出目錄: /home/sms/ebook-converter/data/markdown-output/")
        logger.info("=" * 80)


def main():
    """主程序"""
    import argparse
    
    parser = argparse.ArgumentParser(description='智能百度網盤處理器（分層處理）')
    parser.add_argument('-p', '--path', default='/', help='百度網盤路徑')
    parser.add_argument('-l', '--level', type=int, default=1, choices=[1, 2, 3],
                        help='處理層級: 1=優先(TXT/EPUB), 2=標準(DOC/HTML), 3=古籍(PDF/DJVU,僅索引)')
    parser.add_argument('-n', '--num', type=int, default=None, help='處理文件數量')
    
    args = parser.parse_args()
    
    processor = SmartBaiduProcessor()
    processor.process_level(remote_path=args.path, level=args.level, max_files=args.num)


if __name__ == "__main__":
    main()
