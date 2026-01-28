#!/usr/bin/env python3
"""
Markdown Quality Validator
檢查轉換後的 Markdown 文件質量，確保格式正確再保存
"""
import os
import re
import sys
from pathlib import Path
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

class MarkdownQualityValidator:
    def __init__(self, output_dir: str = "/home/sms/ebook-converter/data/markdown-output"):
        self.output_dir = Path(output_dir)
        self.issues = []
        self.passed = []
        
    def validate_file(self, filepath: Path) -> dict:
        """Validate a single Markdown file"""
        result = {
            'file': filepath.name,
            'path': str(filepath),
            'size': filepath.stat().st_size,
            'issues': [],
            'passed': True
        }
        
        try:
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
        except Exception as e:
            result['issues'].append(f"無法讀取文件: {e}")
            result['passed'] = False
            return result
        
        # 1. 檢查文件大小
        if len(content) < 500:
            result['issues'].append(f"內容過短 ({len(content)} 字符)")
            result['passed'] = False
        
        # 2. 檢查是否有標題結構
        has_h1 = bool(re.search(r'^# .+', content, re.MULTILINE))
        has_h2 = bool(re.search(r'^## .+', content, re.MULTILINE))
        has_h3 = bool(re.search(r'^### .+', content, re.MULTILINE))
        
        if not has_h1 and not has_h2:
            result['issues'].append("缺少標題結構 (無 # 或 ## 標記)")
            result['passed'] = False
        
        # 3. 檢查亂碼 (mojibake)
        replacement_chars = content.count('\ufffd')
        if replacement_chars > 50:
            result['issues'].append(f"發現亂碼字符 ({replacement_chars} 個)")
            result['passed'] = False
        
        # 4. 檢查重複內容
        lines = content.split('\n')
        non_empty_lines = [l.strip() for l in lines if l.strip() and len(l.strip()) > 20]
        if len(non_empty_lines) > 10:
            unique_lines = set(non_empty_lines)
            duplicate_ratio = 1 - (len(unique_lines) / len(non_empty_lines))
            if duplicate_ratio > 0.5:
                result['issues'].append(f"重複內容過多 ({duplicate_ratio:.0%})")
                result['passed'] = False
        
        # 5. 檢查段落格式
        paragraphs = re.split(r'\n\n+', content)
        very_long_paragraphs = [p for p in paragraphs if len(p) > 5000]
        if len(very_long_paragraphs) > 3:
            result['issues'].append(f"段落過長 ({len(very_long_paragraphs)} 個超長段落)")
        
        # 6. 檢查元數據頭
        has_metadata = content.startswith('# ') and '**原始格式**' in content[:500]
        if not has_metadata:
            result['issues'].append("缺少標準元數據頭")
        
        # 7. 檢查章節結構 (對於小說類)
        chapter_patterns = [
            r'第[一二三四五六七八九十百千\d]+[章节回卷]',
            r'Chapter\s+\d+',
        ]
        has_chapters = any(re.search(p, content) for p in chapter_patterns)
        chapter_headers = len(re.findall(r'^##+ .*(第[一二三四五六七八九十百千\d]+[章节回卷]|Chapter)', content, re.MULTILINE))
        
        if has_chapters and chapter_headers == 0:
            result['issues'].append("章節未正確格式化為標題")
        
        return result
    
    def validate_recent_files(self, hours: int = 24):
        """Validate files modified in the last N hours"""
        cutoff = datetime.now() - timedelta(hours=hours)
        
        logger.info(f"🔍 檢查最近 {hours} 小時內修改的 Markdown 文件...")
        
        md_files = list(self.output_dir.glob("*.md"))
        recent_files = []
        
        for f in md_files:
            mtime = datetime.fromtimestamp(f.stat().st_mtime)
            if mtime > cutoff:
                recent_files.append(f)
        
        logger.info(f"找到 {len(recent_files)} 個最近修改的文件")
        
        for filepath in recent_files:
            result = self.validate_file(filepath)
            if result['passed']:
                self.passed.append(result)
            else:
                self.issues.append(result)
        
        return self.generate_report()
    
    def validate_all_files(self, limit: int = None):
        """Validate all Markdown files"""
        md_files = list(self.output_dir.glob("*.md"))
        if limit:
            md_files = md_files[:limit]
        
        logger.info(f"🔍 檢查 {len(md_files)} 個 Markdown 文件...")
        
        for filepath in md_files:
            result = self.validate_file(filepath)
            if result['passed']:
                self.passed.append(result)
            else:
                self.issues.append(result)
        
        return self.generate_report()
    
    def generate_report(self) -> dict:
        """Generate validation report"""
        report = {
            'total_checked': len(self.passed) + len(self.issues),
            'passed': len(self.passed),
            'failed': len(self.issues),
            'pass_rate': len(self.passed) / max(1, len(self.passed) + len(self.issues)),
            'issues': self.issues
        }
        
        logger.info("\n" + "=" * 60)
        logger.info("📊 Markdown 質量驗證報告")
        logger.info("=" * 60)
        logger.info(f"總檢查文件: {report['total_checked']}")
        logger.info(f"✅ 通過: {report['passed']}")
        logger.info(f"❌ 問題: {report['failed']}")
        logger.info(f"通過率: {report['pass_rate']:.1%}")
        
        if self.issues:
            logger.info("\n⚠️ 問題文件詳情:")
            logger.info("-" * 60)
            for item in self.issues[:20]:
                logger.info(f"\n📄 {item['file']}")
                for issue in item['issues']:
                    logger.info(f"   ❌ {issue}")
            
            if len(self.issues) > 20:
                logger.info(f"\n... 還有 {len(self.issues) - 20} 個問題文件")
        
        return report


def fix_markdown_structure(filepath: Path) -> bool:
    """嘗試修復 Markdown 結構問題"""
    import re
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False
    
    original_content = content
    
    # 檢查是否已有標題
    has_h1 = bool(re.search(r'^# .+', content, re.MULTILINE))
    has_h2 = bool(re.search(r'^## .+', content, re.MULTILINE))
    
    if has_h1 or has_h2:
        return False  # 已有標題結構，不需修復
    
    lines = content.split('\n')
    new_lines = []
    
    # 章節模式
    chapter_patterns = [
        (r'^(第[一二三四五六七八九十百千\d]+[章卷部])', '## '),
        (r'^(第[一二三四五六七八九十百千\d]+[节回篇])', '### '),
        (r'^([一二三四五六七八九十]+[、\.])', '## '),
        (r'^(\d+[、\.])', '### '),
        (r'^(序|序言|前言|后记|跋|引言|简介|作者简介)$', '## '),
    ]
    
    # 找到第一個非空行作為標題
    title_added = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # 跳過元數據頭
        if stripped.startswith('# ') and '**原始格式**' in '\n'.join(lines[i:i+5]):
            new_lines.append(line)
            continue
        
        # 添加書名標題
        if not title_added and stripped and len(stripped) < 30:
            if not any(c in stripped for c in '。，、；：'):
                if not stripped.startswith('#'):
                    new_lines.append(f"# {stripped}")
                    title_added = True
                    continue
        
        # 檢查章節標題
        matched = False
        for pattern, prefix in chapter_patterns:
            if re.match(pattern, stripped):
                if not stripped.startswith('#'):
                    new_lines.append(f"{prefix}{stripped}")
                    matched = True
                    break
        
        if not matched:
            new_lines.append(line)
    
    new_content = '\n'.join(new_lines)
    
    if new_content != original_content:
        # 備份原文件
        backup_path = filepath.with_suffix('.md.bak')
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)
        
        # 寫入修復後的內容
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        logger.info(f"✅ 已修復: {filepath.name}")
        return True
    
    return False


if __name__ == "__main__":
    validator = MarkdownQualityValidator()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--recent':
            hours = int(sys.argv[2]) if len(sys.argv) > 2 else 24
            report = validator.validate_recent_files(hours=hours)
        elif sys.argv[1] == '--fix':
            # 修復模式
            logger.info("🔧 修復模式: 嘗試修復缺少標題結構的文件...")
            report = validator.validate_recent_files(hours=48)
            fixed_count = 0
            for item in validator.issues:
                if '缺少標題結構' in str(item['issues']):
                    if fix_markdown_structure(Path(item['path'])):
                        fixed_count += 1
            logger.info(f"\n✅ 已修復 {fixed_count} 個文件")
        else:
            report = validator.validate_all_files(limit=100)
    else:
        report = validator.validate_recent_files(hours=24)
