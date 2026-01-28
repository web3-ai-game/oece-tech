#!/usr/bin/env python3
import os
import hashlib
import shutil
from pathlib import Path
from collections import defaultdict

# 定义要提取的文件类型
DOC_EXTENSIONS = {'.md', '.txt', '.pdf', '.doc', '.docx', '.rst', '.adoc'}
CODE_DOCS = {'README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE', 'TODO.md', 'ROADMAP.md'}

def get_file_hash(filepath):
    """计算文件的 MD5 哈希值"""
    hasher = hashlib.md5()
    try:
        with open(filepath, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b''):
                hasher.update(chunk)
        return hasher.hexdigest()
    except:
        return None

def organize_documents(base_dir):
    """组织和去重文档"""
    base_path = Path(base_dir)
    organized_dir = base_path / 'organized_docs'
    organized_dir.mkdir(exist_ok=True)
    
    # 创建分类目录
    categories = {
        'readmes': organized_dir / '01_readmes',
        'docs': organized_dir / '02_documentation',
        'notes': organized_dir / '03_notes_and_misc',
        'licenses': organized_dir / '04_licenses',
    }
    
    for cat_dir in categories.values():
        cat_dir.mkdir(exist_ok=True)
    
    # 用于去重
    hash_to_file = {}
    duplicates = []
    stats = defaultdict(int)
    
    # 遍历所有仓库
    for repo_dir in base_path.iterdir():
        if not repo_dir.is_dir() or repo_dir.name.startswith('.') or repo_dir.name == 'organized_docs':
            continue
            
        repo_name = repo_dir.name
        stats['repos_scanned'] += 1
        
        # 遍历仓库中的所有文件
        for file_path in repo_dir.rglob('*'):
            if not file_path.is_file():
                continue
                
            # 跳过 node_modules, .git 等目录
            if any(part.startswith('.') or part in ['node_modules', 'dist', 'build', '__pycache__'] 
                   for part in file_path.parts):
                continue
            
            file_ext = file_path.suffix.lower()
            file_name = file_path.name
            
            # 检查是否是我们要的文件类型
            if file_ext not in DOC_EXTENSIONS and file_name not in CODE_DOCS:
                continue
            
            stats['files_found'] += 1
            
            # 计算哈希值去重
            file_hash = get_file_hash(file_path)
            if not file_hash:
                continue
            
            if file_hash in hash_to_file:
                duplicates.append((file_path, hash_to_file[file_hash]))
                stats['duplicates'] += 1
                continue
            
            hash_to_file[file_hash] = file_path
            
            # 分类文件
            if file_name.upper().startswith('README'):
                dest_dir = categories['readmes']
                dest_name = f"{repo_name}__README{file_ext}"
            elif file_name.upper() in ['LICENSE', 'LICENSE.md', 'LICENSE.txt']:
                dest_dir = categories['licenses']
                dest_name = f"{repo_name}__LICENSE{file_ext}"
            elif file_ext in ['.md', '.rst', '.adoc']:
                dest_dir = categories['docs']
                dest_name = f"{repo_name}__{file_name}"
            else:
                dest_dir = categories['notes']
                dest_name = f"{repo_name}__{file_name}"
            
            # 复制文件
            dest_path = dest_dir / dest_name
            counter = 1
            while dest_path.exists():
                dest_name_parts = dest_name.rsplit('.', 1)
                if len(dest_name_parts) == 2:
                    dest_name = f"{dest_name_parts[0]}_{counter}.{dest_name_parts[1]}"
                else:
                    dest_name = f"{dest_name}_{counter}"
                dest_path = dest_dir / dest_name
                counter += 1
            
            try:
                shutil.copy2(file_path, dest_path)
                stats['files_copied'] += 1
            except Exception as e:
                print(f"Error copying {file_path}: {e}")
    
    # 输出统计信息
    print(f"\n=== 文档整理完成 ===")
    print(f"扫描仓库数: {stats['repos_scanned']}")
    print(f"找到文档数: {stats['files_found']}")
    print(f"去重后复制: {stats['files_copied']}")
    print(f"重复文件数: {stats['duplicates']}")
    print(f"\n文档已组织到: {organized_dir}")
    
    return organized_dir, stats

if __name__ == '__main__':
    base_dir = '/mnt/sms/kill-old'
    organized_dir, stats = organize_documents(base_dir)
