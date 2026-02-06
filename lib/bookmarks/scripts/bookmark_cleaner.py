#!/usr/bin/env python3
"""
书签清洗和分类工具
输入: Raindrop.io CSV导出
输出: 清洗后的JSON，准备送Grok API
"""

import csv
import json
from urllib.parse import urlparse
from datetime import datetime
from collections import defaultdict

class BookmarkCleaner:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.bookmarks = []
        self.stats = defaultdict(int)
        
    def load_csv(self):
        """加载CSV书签"""
        with open(self.csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                self.bookmarks.append(row)
        print(f"✓ 加载 {len(self.bookmarks)} 条书签")
        
    def categorize_by_domain(self, url):
        """根据域名自动分类"""
        domain = urlparse(url).netloc.lower()
        
        # 开发工具和服务
        if any(k in domain for k in ['github', 'gitlab', 'stackoverflow', 'npm']):
            return 'dev-tools'
        if any(k in domain for k in ['vercel', 'netlify', 'railway', 'render', 'fly.io']):
            return 'hosting'
        if any(k in domain for k in ['aws', 'gcp', 'azure', 'digitalocean', 'cloud']):
            return 'cloud'
        if any(k in domain for k in ['supabase', 'firebase', 'appwrite', 'mongodb']):
            return 'backend'
        if any(k in domain for k in ['stripe', 'paypal', 'coinbase']):
            return 'payment'
            
        # AI相关
        if any(k in domain for k in ['anthropic', 'openai', 'google.ai', 'openrouter']):
            return 'ai-apis'
        if any(k in domain for k in ['bolt.new', 'v0.dev', 'cursor']):
            return 'ai-tools'
            
        # 学习资源
        if any(k in domain for k in ['youtube', 'udemy', 'coursera', 'frontendmasters']):
            return 'learning'
        if any(k in domain for k in ['medium', 'dev.to', 'hashnode', 'blog']):
            return 'articles'
            
        # 设计资源
        if any(k in domain for k in ['figma', 'icons8', 'iconscout', 'unsplash']):
            return 'design'
            
        # 其他
        return 'misc'
    
    def clean_and_categorize(self):
        """清洗和分类"""
        cleaned = []
        seen_urls = set()
        
        for bm in self.bookmarks:
            url = bm['url'].strip()
            
            # 去重
            if url in seen_urls:
                self.stats['duplicates'] += 1
                continue
            seen_urls.add(url)
            
            # 跳过无效/敏感内容
            if not url.startswith('http'):
                self.stats['invalid_urls'] += 1
                continue
            if any(k in url.lower() for k in ['xvideos', 'pornhub', 'xxx']):
                self.stats['filtered'] += 1
                continue
                
            # 提取核心信息
            category = self.categorize_by_domain(url)
            self.stats[f'cat_{category}'] += 1
            
            item = {
                'url': url,
                'title': bm['title'].strip(),
                'excerpt': bm.get('excerpt', '').strip(),
                'category': category,
                'created': bm.get('created', ''),
                'domain': urlparse(url).netloc
            }
            cleaned.append(item)
        
        self.stats['total_cleaned'] = len(cleaned)
        print(f"\n✓ 清洗完成:")
        print(f"  - 有效书签: {len(cleaned)}")
        print(f"  - 去重: {self.stats['duplicates']}")
        print(f"  - 过滤: {self.stats['filtered']}")
        
        return cleaned
    
    def split_for_api(self, cleaned, batch_size=50):
        """分批准备API调用（每批50条避免token超限）"""
        batches = []
        for i in range(0, len(cleaned), batch_size):
            batch = cleaned[i:i+batch_size]
            batches.append(batch)
        print(f"\n✓ 分成 {len(batches)} 批，每批 ~{batch_size} 条")
        return batches
    
    def export_stats(self):
        """导出统计报告"""
        categories = {k.replace('cat_', ''): v 
                     for k, v in self.stats.items() 
                     if k.startswith('cat_')}
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_processed': len(self.bookmarks),
            'total_cleaned': self.stats['total_cleaned'],
            'duplicates_removed': self.stats['duplicates'],
            'filtered': self.stats['filtered'],
            'categories': categories
        }
        
        with open('bookmark_stats.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"\n✓ 统计报告已保存: bookmark_stats.json")
        return report

def main():
    # 处理CSV
    cleaner = BookmarkCleaner('/mnt/user-data/uploads/export.csv')
    cleaner.load_csv()
    
    # 清洗和分类
    cleaned = cleaner.clean_and_categorize()
    
    # 分批
    batches = cleaner.split_for_api(cleaned, batch_size=50)
    
    # 保存清洗后的数据
    with open('cleaned_bookmarks.json', 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)
    print(f"✓ 清洗数据已保存: cleaned_bookmarks.json")
    
    # 保存分批数据（准备送Grok）
    with open('batches_for_grok.json', 'w', encoding='utf-8') as f:
        json.dump(batches, f, indent=2, ensure_ascii=False)
    print(f"✓ 分批数据已保存: batches_for_grok.json")
    
    # 统计报告
    cleaner.export_stats()

if __name__ == '__main__':
    main()
