#!/usr/bin/env python3
"""去重處理器 - 避免重複處理已存在的文件"""
import os
import hashlib
from pathlib import Path
from typing import Set, Dict, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


from mongodb_handler import MongoDBHandler

class DedupProcessor:
    """去重處理器"""
    
    def __init__(self, output_dir="/home/sms/ebook-converter/data/markdown-output"):
        self.output_dir = Path(output_dir)
        self.processed_files = self._load_processed_files()
        self.mongo = MongoDBHandler()
        
        logger.info(f"已載入 {len(self.processed_files)} 個已處理文件的指紋 (本地)")
    
    def _load_processed_files(self) -> Set[str]:
        """載入已處理文件的指紋"""
        processed = set()
        
        if not self.output_dir.exists():
            return processed
        
        for md_file in self.output_dir.glob("*.md"):
            # 從文件名提取原始文件名（去除 .md 後綴）
            original_name = md_file.stem
            
            # 創建多種指紋格式以提高匹配率
            fingerprints = [
                original_name,  # 完整文件名
                original_name.lower(),  # 小寫
                self._normalize_filename(original_name),  # 標準化
            ]
            
            processed.update(fingerprints)
        
        return processed
    
    def _normalize_filename(self, filename: str) -> str:
        """標準化文件名（去除特殊字符、空格等）"""
        # 移除副檔名
        name = os.path.splitext(filename)[0]
        
        # 移除特殊字符
        name = ''.join(c for c in name if c.isalnum() or c in ' -_')
        
        # 標準化空格
        name = ' '.join(name.split())
        
        return name.lower()
    
    def get_file_fingerprint(self, file_info: Dict) -> str:
        """獲取文件指紋（用於去重）"""
        filename = file_info.get('name', '')
        size = file_info.get('size', 0)
        
        # 使用文件名和大小創建指紋
        content = f"{self._normalize_filename(filename)}_{size}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def is_processed(self, file_info: Dict) -> bool:
        """檢查文件是否已處理 (本地 + MongoDB)"""
        filename = file_info.get('name', '')
        
        # 1. Check Local Cache
        checks = [
            filename in self.processed_files,
            filename.lower() in self.processed_files,
            self._normalize_filename(filename) in self.processed_files,
            os.path.splitext(filename)[0] in self.processed_files,
        ]
        
        if any(checks):
            return True

        # 2. Check MongoDB
        if self.mongo.document_exists(filename):
            return True
            
        return False
    
    def filter_new_files(self, files: List[Dict]) -> List[Dict]:
        """過濾出未處理的文件"""
        new_files = []
        duplicate_count = 0
        
        for file_info in files:
            if not self.is_processed(file_info):
                new_files.append(file_info)
            else:
                duplicate_count += 1
                logger.debug(f"跳過已處理文件: {file_info['name']}")
        
        logger.info(f"過濾結果: {len(new_files)} 個新文件, {duplicate_count} 個重複文件")
        
        return new_files
    
    def get_stats(self) -> Dict:
        """獲取統計信息"""
        return {
            'processed_count': len(self.processed_files),
            'output_dir': str(self.output_dir),
            'md_files': len(list(self.output_dir.glob("*.md")))
        }


def main():
    """測試程序"""
    dedup = DedupProcessor()
    
    stats = dedup.get_stats()
    print("=" * 70)
    print("去重處理器統計")
    print("=" * 70)
    print(f"已處理文件數: {stats['processed_count']}")
    print(f"Markdown 文件數: {stats['md_files']}")
    print(f"輸出目錄: {stats['output_dir']}")
    print("=" * 70)
    
    # 測試文件
    test_files = [
        {'name': '測試文件.pdf', 'size': 1024},
        {'name': 'test.docx', 'size': 2048},
    ]
    
    print("\n測試去重:")
    for f in test_files:
        is_dup = dedup.is_processed(f)
        print(f"  {f['name']}: {'已處理' if is_dup else '新文件'}")


if __name__ == "__main__":
    main()
