#!/usr/bin/env python3
"""多雲盤下載器 - 支援百度網盤、Google Drive、OneDrive"""
import os
import subprocess
import json
from pathlib import Path
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MultiCloudDownloader:
    """統一的多雲盤下載器"""
    
    def __init__(self, cache_dir="/home/sms/ebook-converter/data/baidu-cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        # 支援的電子書格式
        self.ebook_formats = [
            '.pdf', '.epub', '.mobi', '.azw', '.azw3',
            '.doc', '.docx', '.txt', '.rtf', '.odt',
            '.djvu', '.fb2', '.html', '.htm'
        ]
    
    def yield_baidu_files(self, remote_path="/apps/bypy", recursive=True):
        """生成器：逐步列出百度網盤文件 (支援遞歸)"""
        logger.info(f"開始掃描百度網盤文件: {remote_path}")
        
        normalized_path = remote_path
        if normalized_path.startswith("/apps/bypy"):
            normalized_path = normalized_path[len("/apps/bypy"):]
        
        if not normalized_path or normalized_path == "/":
            normalized_path = "/"
        else:
            normalized_path = normalized_path.lstrip("/")

        dirs_to_visit = [normalized_path]
        visited_dirs = set()
        
        while dirs_to_visit:
            current_path = dirs_to_visit.pop(0)
            if current_path in visited_dirs:
                continue
            visited_dirs.add(current_path)
            
            if current_path != "/":
                logger.info(f"  掃描目錄: {current_path}")
            
            try:
                cmd = ["bypy", "list"]
                if current_path != "/":
                    cmd.append(current_path)
                
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    check=False
                )
                
                if result.returncode != 0:
                    logger.warning(f"列出目錄失敗 {current_path}: {result.stderr}")
                    continue
                
                # Check for bypy specific error output in stdout even if returncode is 0
                if "Error" in result.stdout and "Error 0" not in result.stdout:
                     logger.warning(f"bypy 錯誤輸出: {result.stdout[:100]}...")
                
                for line in result.stdout.split('\n'):
                    line = line.strip()
                    if not line or line.startswith('/apps/bypy') or '($t $f $s $m $d)' in line:
                        continue
                    if line.startswith('<E>'): # Error line
                        continue
                        
                    parts = line.split()
                    if len(parts) < 2:
                        continue
                        
                    file_type = parts[0]
                    filename = parts[1]
                    
                    if current_path == "/":
                        full_rel_path = filename
                    else:
                        full_rel_path = f"{current_path}/{filename}"
                        
                    if file_type == 'D':
                        if recursive:
                            dirs_to_visit.append(full_rel_path)
                    
                    elif file_type == 'F':
                        if any(ext in filename.lower() for ext in self.ebook_formats):
                            size = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 0
                            yield {
                                'source': 'baidu',
                                'path': current_path,
                                'name': filename,
                                'full_path': full_rel_path,
                                'size': size
                            }
            
            except Exception as e:
                logger.error(f"掃描目錄異常 {current_path}: {e}")

    def list_baidu_files(self, remote_path="/apps/bypy", recursive=True) -> List[Dict]:
        """列出百度網盤文件 (兼容舊接口)"""
        return list(self.yield_baidu_files(remote_path, recursive))

    def list_gdrive_files(self, remote_path: str = "") -> List[Dict]:
        """列出 Google Drive 文件"""
        logger.info(f"掃描 Google Drive: {remote_path}")
        files = []
        try:
            # Use rclone lsjson for easier parsing
            # Assuming 'gdrive:' is the remote name configured in rclone
            cmd = ["rclone", "lsjson", f"gdrive:{remote_path}", "--recursive"]
            result = subprocess.run(cmd, capture_output=True, text=True, check=False)
            
            if result.returncode != 0:
                # If rclone is not configured or fails, just log warning and return empty
                logger.warning(f"Google Drive 掃描失敗 (可能未配置 rclone): {result.stderr}")
                return []
                
            items = json.loads(result.stdout)
            for item in items:
                if not item.get('IsDir', False):
                    filename = item.get('Name', 'unknown')
                    if any(ext in filename.lower() for ext in self.ebook_formats):
                        files.append({
                            'source': 'gdrive',
                            'path': item.get('Path', filename), 
                            'name': filename,
                            'full_path': item.get('Path', filename),
                            'size': item.get('Size', 0)
                        })
        except FileNotFoundError:
             logger.warning("未找到 rclone 命令，跳過 Google Drive 掃描")
        except Exception as e:
            logger.error(f"Google Drive 掃描異常: {e}")
            
        return files

    def download_from_baidu(self, remote_path: str, filename: str, timeout: int = 120) -> str:
        """從百度網盤下載文件 (帶超時)"""
        logger.info(f"從百度網盤下載: {filename}")
        
        local_path = self.cache_dir / filename
        
        try:
            # remote_path passed here is usually the folder path relative to /apps/bypy
            # We need to construct the full path for bypy downfile
            if remote_path == "/" or not remote_path:
                full_remote = filename
            else:
                full_remote = f"{remote_path}/{filename}"
            
            result = subprocess.run(
                ["bypy", "downfile", full_remote, str(local_path)],
                capture_output=True,
                timeout=timeout  # 添加超時
            )
            
            if local_path.exists() and local_path.stat().st_size > 0:
                logger.info(f"✓ 下載成功: {local_path}")
                return str(local_path)
            else:
                logger.error(f"下載失敗 (文件為空或不存在): {local_path}")
                return None
        
        except subprocess.TimeoutExpired:
            logger.error(f"下載超時 ({timeout}s): {filename}")
            return None
        except Exception as e:
            logger.error(f"下載失敗: {e}")
            return None
    
    def download_from_gdrive(self, remote_path: str) -> str:
        """從 Google Drive 下載文件"""
        filename = os.path.basename(remote_path)
        logger.info(f"從 Google Drive 下載: {filename}")
        
        local_path = self.cache_dir / filename
        
        try:
            subprocess.run(
                ["rclone", "copy", f"gdrive:{remote_path}", str(self.cache_dir)],
                check=True,
                capture_output=True
            )
            
            logger.info(f"✓ 下載成功: {local_path}")
            return str(local_path)
            
        except Exception as e:
            logger.error(f"下載失敗: {e}")
            return None
    
    def download_file(self, file_info: Dict) -> str:
        """統一下載接口"""
        source = file_info['source']
        
        if source == 'baidu':
            return self.download_from_baidu(
                file_info['path'],
                file_info['name']
            )
        elif source == 'gdrive':
            return self.download_from_gdrive(file_info['path'])
        else:
            logger.error(f"不支援的來源: {source}")
            return None
    
    def list_all_ebooks(self) -> List[Dict]:
        """列出所有雲盤的電子書 (Legacy: Returns full list)"""
        return list(self.yield_all_ebooks())

    def yield_all_ebooks(self):
        """Yields ebook files from all configured cloud sources."""
        # 百度網盤
        for f in self.yield_baidu_files("/apps/bypy"):
            yield f
        
        # Google Drive (Assuming we implement yield_gdrive_files later or wrap existing)
        # For now, gdrive is still list-based in the original code, but let's wrap it
        if hasattr(self, 'list_gdrive_files'): # Check if exists (it was called in original list_all_ebooks)
             for f in self.list_gdrive_files(""):
                 yield f
    
    def cleanup_cache(self, keep_files: int = 0):
        """清理緩存，只保留最新的 N 個文件"""
        files = sorted(
            self.cache_dir.glob("*"),
            key=lambda x: x.stat().st_mtime,
            reverse=True
        )
        
        for f in files[keep_files:]:
            try:
                f.unlink()
                logger.info(f"清理緩存: {f.name}")
            except Exception as e:
                logger.error(f"清理失敗: {e}")


def main():
    """測試多雲盤下載器"""
    downloader = MultiCloudDownloader()
    
    print("=" * 60)
    print("多雲盤電子書下載器")
    print("=" * 60)
    
    # 列出所有電子書
    print("\n正在掃描所有雲盤...")
    all_files = downloader.list_all_ebooks()
    
    if not all_files:
        print("未找到電子書文件")
        return
    
    # 顯示前 10 個
    print(f"\n找到 {len(all_files)} 個電子書，顯示前 10 個：")
    print("-" * 60)
    
    for i, file_info in enumerate(all_files[:10], 1):
        source = file_info['source']
        name = file_info['name']
        size_mb = file_info.get('size', 0) / (1024 * 1024)
        
        print(f"{i}. [{source.upper()}] {name} ({size_mb:.1f} MB)")
    
    # 詢問是否下載
    print("\n" + "=" * 60)
    choice = input("是否下載第一個文件進行測試？(y/n): ")
    
    if choice.lower() == 'y' and all_files:
        print("\n下載測試文件...")
        local_path = downloader.download_file(all_files[0])
        
        if local_path:
            print(f"\n✓ 測試成功！文件已下載到: {local_path}")
        else:
            print("\n✗ 下載失敗")


if __name__ == "__main__":
    main()
