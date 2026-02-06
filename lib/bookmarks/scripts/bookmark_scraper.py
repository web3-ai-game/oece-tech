#!/usr/bin/env python3
"""
书签智能爬虫 v2.0
功能：深度2-3层抓取页面全文
输入：cleaned_bookmarks.json
输出：scraped_content.json
"""

import json
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import List, Dict, Set
import re
from datetime import datetime

class BookmarkScraper:
    def __init__(self, max_depth=3, max_pages_per_site=10):
        self.max_depth = max_depth
        self.max_pages_per_site = max_pages_per_site
        self.visited = set()
        self.session = None
        
    async def init_session(self):
        """初始化HTTP会话"""
        timeout = aiohttp.ClientTimeout(total=30)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        self.session = aiohttp.ClientSession(timeout=timeout, headers=headers)
    
    async def close_session(self):
        """关闭会话"""
        if self.session:
            await self.session.close()
    
    def extract_text(self, html: str) -> str:
        """提取页面主要文本（去除导航、广告等噪音）"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # 删除无用标签
        for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe']):
            tag.decompose()
        
        # 提取主要内容区域
        main_content = soup.find(['main', 'article', 'div[role="main"]']) or soup.body
        if not main_content:
            return ""
        
        # 提取文本
        text = main_content.get_text(separator='\n', strip=True)
        
        # 清理多余空白
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = re.sub(r' +', ' ', text)
        
        # 限制长度（避免超大页面）
        return text[:50000]  # 最多50k字符
    
    def extract_links(self, html: str, base_url: str) -> List[str]:
        """提取页面内链接"""
        soup = BeautifulSoup(html, 'html.parser')
        base_domain = urlparse(base_url).netloc
        
        links = []
        for a in soup.find_all('a', href=True):
            href = a['href']
            
            # 跳过锚点和邮件链接
            if href.startswith('#') or href.startswith('mailto:'):
                continue
            
            # 转绝对路径
            abs_url = urljoin(base_url, href)
            
            # 只保留同域名链接
            if urlparse(abs_url).netloc == base_domain:
                # 跳过PDF、图片等
                if not re.search(r'\.(pdf|jpg|png|gif|zip|mp4)$', abs_url, re.I):
                    links.append(abs_url)
        
        return list(set(links))[:self.max_pages_per_site]
    
    async def fetch_page(self, url: str) -> tuple[str, str]:
        """抓取单个页面"""
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    html = await response.text()
                    return html, None
                else:
                    return None, f"HTTP {response.status}"
        except asyncio.TimeoutError:
            return None, "Timeout"
        except Exception as e:
            return None, str(e)
    
    async def scrape_recursive(self, url: str, depth: int = 0) -> Dict:
        """递归抓取（深度优先）"""
        if depth > self.max_depth or url in self.visited:
            return None
        
        self.visited.add(url)
        print(f"  {'  ' * depth}[深度{depth}] 抓取: {url}")
        
        # 抓取当前页
        html, error = await self.fetch_page(url)
        if error:
            print(f"  {'  ' * depth}✗ 失败: {error}")
            return None
        
        # 提取文本
        text = self.extract_text(html)
        
        result = {
            'url': url,
            'depth': depth,
            'text': text,
            'text_length': len(text),
            'children': []
        }
        
        # 如果未达最大深度，继续抓取子页面
        if depth < self.max_depth:
            links = self.extract_links(html, url)
            print(f"  {'  ' * depth}├─ 发现 {len(links)} 个子链接")
            
            # 并发抓取子页面（限制并发数）
            tasks = [self.scrape_recursive(link, depth + 1) for link in links[:5]]
            children = await asyncio.gather(*tasks)
            result['children'] = [c for c in children if c]
        
        print(f"  {'  ' * depth}✓ 完成: {len(text)} 字符")
        return result
    
    async def scrape_bookmark(self, bookmark: Dict) -> Dict:
        """抓取单个书签的内容"""
        url = bookmark['url']
        print(f"\n📄 处理: {bookmark['title']}")
        
        try:
            content = await self.scrape_recursive(url, depth=0)
            
            if content:
                # 统计总字符数
                total_chars = self._count_chars(content)
                print(f"✓ 完成: 总计 {total_chars} 字符")
                
                return {
                    **bookmark,
                    'scraped_at': datetime.utcnow().isoformat(),
                    'content': content,
                    'total_chars': total_chars
                }
            else:
                print(f"✗ 抓取失败")
                return {
                    **bookmark,
                    'scraped_at': datetime.utcnow().isoformat(),
                    'content': None,
                    'error': 'Failed to scrape'
                }
        
        except Exception as e:
            print(f"✗ 错误: {e}")
            return {
                **bookmark,
                'scraped_at': datetime.utcnow().isoformat(),
                'content': None,
                'error': str(e)
            }
    
    def _count_chars(self, node: Dict) -> int:
        """递归统计字符数"""
        if not node:
            return 0
        total = node.get('text_length', 0)
        for child in node.get('children', []):
            total += self._count_chars(child)
        return total
    
    async def scrape_all(self, bookmarks: List[Dict], limit: int = None):
        """批量抓取所有书签"""
        if limit:
            bookmarks = bookmarks[:limit]
        
        print(f"🚀 开始抓取 {len(bookmarks)} 个书签...")
        print(f"   最大深度: {self.max_depth}")
        print(f"   每站最多: {self.max_pages_per_site} 页\n")
        
        await self.init_session()
        
        results = []
        for i, bm in enumerate(bookmarks, 1):
            print(f"\n[{i}/{len(bookmarks)}] ", end="")
            result = await self.scrape_bookmark(bm)
            results.append(result)
            
            # 礼貌延迟
            await asyncio.sleep(1)
        
        await self.close_session()
        
        # 统计
        success = sum(1 for r in results if r.get('content'))
        total_chars = sum(r.get('total_chars', 0) for r in results)
        
        print(f"\n\n✅ 抓取完成:")
        print(f"   成功: {success}/{len(results)}")
        print(f"   总字符: {total_chars:,}")
        print(f"   平均: {total_chars//len(results):,} 字符/站")
        
        return results


async def main():
    # 加载清洗后的书签
    with open('cleaned_bookmarks.json', 'r', encoding='utf-8') as f:
        bookmarks = json.load(f)
    
    print(f"📚 加载 {len(bookmarks)} 条书签")
    
    # 只抓取5星和4星资源（节省时间）
    high_value = [
        bm for bm in bookmarks 
        if bm.get('importance', 0) >= 4
    ]
    
    print(f"🎯 筛选出 {len(high_value)} 条高价值书签（4-5星）\n")
    
    # 开始抓取（可选：限制数量测试）
    scraper = BookmarkScraper(max_depth=2, max_pages_per_site=5)
    
    # 测试模式：只抓5个
    # results = await scraper.scrape_all(high_value[:5])
    
    # 完整模式
    results = await scraper.scrape_all(high_value)
    
    # 保存结果
    output_file = 'scraped_content.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 已保存到: {output_file}")
    
    # 生成统计报告
    stats = {
        'total_bookmarks': len(bookmarks),
        'high_value_bookmarks': len(high_value),
        'scraped_successfully': sum(1 for r in results if r.get('content')),
        'total_characters': sum(r.get('total_chars', 0) for r in results),
        'average_chars_per_site': sum(r.get('total_chars', 0) for r in results) // len(results),
        'timestamp': datetime.utcnow().isoformat()
    }
    
    with open('scraping_stats.json', 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    
    print(f"📊 统计报告: scraping_stats.json")


if __name__ == '__main__':
    asyncio.run(main())
