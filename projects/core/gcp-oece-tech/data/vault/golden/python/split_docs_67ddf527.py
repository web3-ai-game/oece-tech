#!/usr/bin/env python3
"""
文檔分配器 - 將所有文檔平均分成3波
"""

import shutil
from pathlib import Path
import sys

def split_documents(source_dir, output_base):
    """將文檔分成3波"""
    source = Path(source_dir)
    
    # 獲取所有md文檔
    all_docs = list(source.glob('**/*.md'))
    total = len(all_docs)
    
    if total == 0:
        print("❌ 未找到任何文檔！")
        sys.exit(1)
    
    print(f"📚 總共找到 {total} 個文檔")
    
    # 計算每波的數量
    per_wave = total // 3
    remainder = total % 3
    
    waves = {
        1: all_docs[:per_wave + (1 if remainder > 0 else 0)],
        2: all_docs[per_wave + (1 if remainder > 0 else 0):2*per_wave + (2 if remainder > 1 else 1 if remainder > 0 else 0)],
        3: all_docs[2*per_wave + (2 if remainder > 1 else 1 if remainder > 0 else 0):]
    }
    
    # 分配文檔
    for wave_id, docs in waves.items():
        wave_dir = Path(output_base) / f'wave{wave_id}'
        wave_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\n📦 Wave {wave_id}: {len(docs)} 個文檔")
        
        for doc in docs:
            dest = wave_dir / doc.name
            shutil.copy2(doc, dest)
        
        print(f"✅ Wave {wave_id} 準備完成：{wave_dir}")
    
    print(f"\n🎯 分配完成！")
    print(f"   Wave 1: {len(waves[1])} 文檔")
    print(f"   Wave 2: {len(waves[2])} 文檔")
    print(f"   Wave 3: {len(waves[3])} 文檔")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("用法: python split_docs.py <source_dir> <output_base>")
        print("示例: python split_docs.py ../organized_docs/02_documentation ../input")
        sys.exit(1)
    
    split_documents(sys.argv[1], sys.argv[2])
