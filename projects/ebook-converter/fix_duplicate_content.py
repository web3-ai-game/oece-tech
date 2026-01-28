#!/usr/bin/env python3
"""
Fix duplicate content in Markdown files
修復 Markdown 文件中的重複內容問題
"""
import re
import sys
from pathlib import Path
from collections import OrderedDict
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)


def remove_duplicate_sections(content: str) -> str:
    """Remove duplicate sections while preserving order"""
    
    # Split by headers (## or ###)
    # Keep the header with its content as a unit
    pattern = r'(^#{1,4}\s+.+?)(?=^#{1,4}\s+|\Z)'
    sections = re.findall(pattern, content, re.MULTILINE | re.DOTALL)
    
    if not sections:
        return content
    
    # Use OrderedDict to remove duplicates while preserving order
    seen_content = OrderedDict()
    
    for section in sections:
        # Normalize the section for comparison (strip whitespace)
        normalized = section.strip()
        
        # Extract header and first 200 chars of content for comparison
        lines = normalized.split('\n')
        header = lines[0] if lines else ''
        content_preview = '\n'.join(lines[1:])[:500].strip()
        
        # Create a key for deduplication
        key = (header, content_preview)
        
        if key not in seen_content:
            seen_content[key] = section
    
    # Reconstruct the content
    result_sections = list(seen_content.values())
    
    # Find the metadata header (before first section)
    first_section_start = content.find(sections[0]) if sections else len(content)
    metadata = content[:first_section_start]
    
    return metadata + '\n\n'.join(result_sections)


def remove_duplicate_paragraphs(content: str) -> str:
    """Remove duplicate paragraphs"""
    
    # Split by double newlines (paragraphs)
    paragraphs = re.split(r'\n\n+', content)
    
    seen = OrderedDict()
    for para in paragraphs:
        para_stripped = para.strip()
        if para_stripped:
            # Use first 300 chars as key to catch near-duplicates
            key = para_stripped[:300]
            if key not in seen:
                seen[key] = para
    
    return '\n\n'.join(seen.values())


def fix_markdown_file(filepath: Path, dry_run: bool = False) -> dict:
    """Fix a single Markdown file"""
    result = {
        'file': filepath.name,
        'original_size': 0,
        'new_size': 0,
        'reduction': 0,
        'fixed': False
    }
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        logger.error(f"無法讀取 {filepath}: {e}")
        return result
    
    result['original_size'] = len(content)
    
    # Check for duplicate content
    lines = content.split('\n')
    non_empty_lines = [l.strip() for l in lines if l.strip() and len(l.strip()) > 20]
    
    if len(non_empty_lines) < 10:
        return result
    
    unique_lines = set(non_empty_lines)
    duplicate_ratio = 1 - (len(unique_lines) / len(non_empty_lines))
    
    if duplicate_ratio < 0.3:
        # Not enough duplicates to fix
        return result
    
    logger.info(f"📄 {filepath.name}: 重複率 {duplicate_ratio:.0%}")
    
    # Apply fixes
    new_content = remove_duplicate_sections(content)
    new_content = remove_duplicate_paragraphs(new_content)
    
    result['new_size'] = len(new_content)
    result['reduction'] = (result['original_size'] - result['new_size']) / result['original_size']
    
    if result['reduction'] > 0.1:  # Only save if significant reduction
        if not dry_run:
            # Backup original
            backup_path = filepath.with_suffix('.md.bak')
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Write fixed content
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            result['fixed'] = True
            logger.info(f"   ✅ 已修復: 減少 {result['reduction']:.0%} ({result['original_size']} -> {result['new_size']} 字符)")
        else:
            logger.info(f"   🔍 預覽: 可減少 {result['reduction']:.0%}")
    
    return result


def main():
    output_dir = Path("/home/sms/ebook-converter/data/markdown-output")
    
    # Files with known issues
    problem_files = [
        "历史的天空-徐贵祥.md",
        "无字-张洁.md",
        "斗罗大陆_唐家三少_TXT小说天堂.md",
    ]
    
    dry_run = '--dry-run' in sys.argv
    fix_all = '--all' in sys.argv
    
    if dry_run:
        logger.info("🔍 預覽模式 (不會修改文件)")
    
    logger.info("=" * 60)
    logger.info("修復 Markdown 重複內容")
    logger.info("=" * 60)
    
    if fix_all:
        # Fix all files with high duplicate ratio
        md_files = list(output_dir.glob("*.md"))
        logger.info(f"掃描 {len(md_files)} 個文件...")
    else:
        md_files = [output_dir / f for f in problem_files if (output_dir / f).exists()]
        logger.info(f"修復 {len(md_files)} 個已知問題文件...")
    
    fixed_count = 0
    for filepath in md_files:
        result = fix_markdown_file(filepath, dry_run=dry_run)
        if result['fixed']:
            fixed_count += 1
    
    logger.info("\n" + "=" * 60)
    logger.info(f"完成: 修復了 {fixed_count} 個文件")


if __name__ == "__main__":
    main()
