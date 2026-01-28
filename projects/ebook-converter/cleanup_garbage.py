#!/usr/bin/env python3
"""
清理轉換垃圾文件 - 不需要 API
識別並移動：亂碼文件、LLM幻覺文件、重複文件
"""

import os
import re
import shutil
from pathlib import Path
from collections import defaultdict

MD_DIR = Path('./data/markdown-output')
GARBAGE_DIR = Path('./data/garbage')
GARBAGE_DIR.mkdir(exist_ok=True)

# 亂碼特徵模式
GARBLED_PATTERNS = [
    r'[ĵƽ̨áԸȨŮ]{3,}',  # 常見亂碼字符
    r'[Ŀǰûˣ]{3,}',
    r'[\x00-\x08\x0b\x0c\x0e-\x1f]{2,}',  # 控制字符
    r'(?:[^\x00-\x7f\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]){10,}',  # 非中英文連續字符
]

# LLM 幻覺特徵
HALLUCINATION_PATTERNS = [
    r'^## 第[一二三四五六七八九十]+章\s+\S{1,4}\s*$',  # 假章節標題
    r'^## 楔子\s*$',
    r'^## 參考文獻\s*$',
    r'^## 附录\s*$',
    r'^# 附录\s*$',
    r'姽姽像个小精灵一样',  # 特定幻覺內容
    r'她叫姽姽，是丞相府嫡出',
]

def check_garbled(content):
    """檢查是否包含亂碼"""
    for pattern in GARBLED_PATTERNS:
        if re.search(pattern, content):
            return True
    return False

def check_hallucination(content):
    """檢查是否包含 LLM 幻覺"""
    lines = content.split('\n')
    hallucination_count = 0
    
    for line in lines[:100]:  # 只檢查前100行
        for pattern in HALLUCINATION_PATTERNS:
            if re.search(pattern, line):
                hallucination_count += 1
    
    # 如果有多個幻覺特徵，認為是垃圾
    return hallucination_count >= 2

def check_too_short(content, filepath):
    """檢查內容是否過短（相對於文件大小）"""
    # 去除元數據後的實際內容
    lines = [l for l in content.split('\n') if l.strip() and not l.startswith('#') and not l.startswith('**')]
    actual_content = '\n'.join(lines)
    
    # 如果實際中文內容少於 500 字符，可能是垃圾
    chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', actual_content))
    return chinese_chars < 500

def get_content_hash(content):
    """獲取內容的簡單哈希（用於檢測重複）"""
    # 提取前1000個中文字符作為指紋
    chinese = re.findall(r'[\u4e00-\u9fff]', content)
    return ''.join(chinese[:1000])

def main():
    stats = {
        'total': 0,
        'garbled': 0,
        'hallucination': 0,
        'duplicate': 0,
        'too_short': 0,
        'good': 0,
    }
    
    content_hashes = defaultdict(list)
    garbage_files = []
    
    print("掃描文件...")
    md_files = list(MD_DIR.rglob('*.md'))
    stats['total'] = len(md_files)
    
    for i, filepath in enumerate(md_files):
        if i % 500 == 0:
            print(f"  處理中: {i}/{stats['total']}")
        
        try:
            content = filepath.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            print(f"  讀取失敗: {filepath} - {e}")
            continue
        
        reason = None
        
        # 檢查亂碼
        if check_garbled(content):
            reason = 'garbled'
            stats['garbled'] += 1
        # 檢查幻覺
        elif check_hallucination(content):
            reason = 'hallucination'
            stats['hallucination'] += 1
        # 檢查過短
        elif check_too_short(content, filepath):
            reason = 'too_short'
            stats['too_short'] += 1
        else:
            # 檢查重複
            content_hash = get_content_hash(content)
            if content_hash and len(content_hash) > 100:
                if content_hash in content_hashes:
                    reason = 'duplicate'
                    stats['duplicate'] += 1
                else:
                    content_hashes[content_hash] = filepath
                    stats['good'] += 1
            else:
                stats['good'] += 1
        
        if reason:
            garbage_files.append((filepath, reason))
    
    print("\n" + "="*50)
    print("統計結果:")
    print(f"  總文件數: {stats['total']}")
    print(f"  亂碼文件: {stats['garbled']}")
    print(f"  LLM幻覺: {stats['hallucination']}")
    print(f"  重複文件: {stats['duplicate']}")
    print(f"  過短文件: {stats['too_short']}")
    print(f"  正常文件: {stats['good']}")
    print("="*50)
    
    if garbage_files:
        print(f"\n發現 {len(garbage_files)} 個垃圾文件")
        print("自動移動到 garbage 目錄...")
        for filepath, reason in garbage_files:
            dest_dir = GARBAGE_DIR / reason
            dest_dir.mkdir(exist_ok=True)
            dest = dest_dir / filepath.name
            
            # 處理重名
            counter = 1
            while dest.exists():
                dest = dest_dir / f"{filepath.stem}_{counter}{filepath.suffix}"
                counter += 1
            
            shutil.move(str(filepath), str(dest))
        
        print(f"已移動 {len(garbage_files)} 個文件到 {GARBAGE_DIR}")
    else:
        print("\n沒有發現垃圾文件")

if __name__ == '__main__':
    main()
