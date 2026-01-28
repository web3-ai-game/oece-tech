#!/usr/bin/env python3
"""書籤轉 Markdown 轉換器 - 使用 Gemini 2.0 Flash"""
import os
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup
import google.generativeai as genai
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BookmarkConverter:
    """書籤轉 Markdown 轉換器"""
    
    def __init__(self, api_key="AIzaSyCG459HOLhXkbDQgw8rSYAvuqyM3RdMQHQ"):
        self.api_key = api_key
        genai.configure(api_key=api_key)
        
        # 使用 Gemini 2.0 Flash - 最快速度
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        self.output_dir = Path("/home/sms/ebook-converter/data/bookmarks-output")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info("書籤轉換器初始化完成，使用模型: gemini-2.0-flash-exp")
    
    def parse_html_bookmarks(self, html_file):
        """解析 HTML 書籤文件"""
        logger.info(f"解析書籤文件: {html_file}")
        
        with open(html_file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        
        bookmarks = {}
        
        # 查找所有書籤文件夾
        for h3 in soup.find_all('h3'):
            folder_name = h3.get_text().strip()
            if not folder_name:
                folder_name = "Unsorted"
            
            # 查找該文件夾下的所有鏈接
            dl = h3.find_next_sibling('dl')
            if dl:
                links = []
                for a in dl.find_all('a', href=True):
                    link_data = {
                        'title': a.get_text().strip(),
                        'url': a.get('href', ''),
                        'description': a.get('description', ''),
                        'tags': a.get('tags', ''),
                        'cover': a.get('data-cover', ''),
                        'add_date': a.get('add_date', ''),
                        'important': a.get('data-important', 'false') == 'true'
                    }
                    links.append(link_data)
                
                if links:
                    if folder_name not in bookmarks:
                        bookmarks[folder_name] = []
                    bookmarks[folder_name].extend(links)
        
        logger.info(f"找到 {len(bookmarks)} 個文件夾，共 {sum(len(v) for v in bookmarks.values())} 個書籤")
        return bookmarks
    
    def convert_folder_to_markdown(self, folder_name, links):
        """使用 Gemini 2.0 Flash 將文件夾轉換為精美的 Markdown"""
        logger.info(f"轉換文件夾: {folder_name} ({len(links)} 個書籤)")
        
        # 構建提示詞
        links_text = "\n\n".join([
            f"標題: {link['title']}\n"
            f"URL: {link['url']}\n"
            f"描述: {link['description']}\n"
            f"標籤: {link['tags']}\n"
            f"重要: {'⭐' if link['important'] else ''})"
            for link in links
        ])
        
        prompt = f"""請將以下書籤列表轉換為精美、詳細、專業的 Markdown 格式文檔。

要求：
1. 創建一個漂亮的標題和描述
2. 按類別或主題對書籤進行分組（如果適用）
3. 每個書籤包含：
   - 標題（作為鏈接）
   - 簡短描述（如果有）
   - 標籤（如果有）
   - 重要標記（如果有）
4. 使用表情符號增加可讀性
5. 添加目錄（如果書籤較多）
6. 格式整潔、專業、易讀

文件夾名稱: {folder_name}

書籤列表:
{links_text}

請生成完整的 Markdown 文檔："""

        try:
            response = self.model.generate_content(prompt)
            markdown = response.text
            
            # 清理 markdown
            if markdown.startswith('```markdown'):
                markdown = markdown[11:]
            if markdown.endswith('```'):
                markdown = markdown[:-3]
            markdown = markdown.strip()
            
            logger.info(f"✓ 成功轉換文件夾: {folder_name}")
            return markdown
            
        except Exception as e:
            logger.error(f"轉換失敗: {e}")
            # 降級為簡單格式
            return self.create_simple_markdown(folder_name, links)
    
    def create_simple_markdown(self, folder_name, links):
        """創建簡單的 Markdown 格式（降級方案）"""
        md = f"# {folder_name}\n\n"
        md += f"共 {len(links)} 個書籤\n\n"
        md += "---\n\n"
        
        for i, link in enumerate(links, 1):
            md += f"## {i}. [{link['title']}]({link['url']})\n\n"
            
            if link['description']:
                md += f"**描述**: {link['description']}\n\n"
            
            if link['tags']:
                md += f"**標籤**: {link['tags']}\n\n"
            
            if link['important']:
                md += "⭐ **重要**\n\n"
            
            md += "---\n\n"
        
        return md
    
    def convert_bookmarks(self, html_file):
        """轉換所有書籤"""
        logger.info("=" * 60)
        logger.info("開始轉換書籤")
        logger.info("=" * 60)
        
        # 解析 HTML
        bookmarks = self.parse_html_bookmarks(html_file)
        
        if not bookmarks:
            logger.warning("未找到書籤")
            return
        
        # 為每個文件夾創建 Markdown
        total = len(bookmarks)
        for i, (folder_name, links) in enumerate(bookmarks.items(), 1):
            logger.info(f"\n處理 {i}/{total}: {folder_name}")
            
            # 轉換為 Markdown
            markdown = self.convert_folder_to_markdown(folder_name, links)
            
            # 保存文件
            safe_name = re.sub(r'[^\w\s-]', '', folder_name).strip().replace(' ', '_')
            output_file = self.output_dir / f"{safe_name}.md"
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(markdown)
            
            logger.info(f"✓ 已保存: {output_file}")
        
        # 創建索引文件
        self.create_index(bookmarks)
        
        logger.info("\n" + "=" * 60)
        logger.info("轉換完成！")
        logger.info("=" * 60)
        logger.info(f"輸出目錄: {self.output_dir}")
        logger.info(f"共處理 {total} 個文件夾")
        logger.info("=" * 60)
    
    def create_index(self, bookmarks):
        """創建索引文件"""
        index_md = "# 📚 書籤索引\n\n"
        index_md += f"生成時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        index_md += "---\n\n"
        index_md += "## 📂 文件夾列表\n\n"
        
        for folder_name, links in bookmarks.items():
            safe_name = re.sub(r'[^\w\s-]', '', folder_name).strip().replace(' ', '_')
            index_md += f"- [{folder_name}](./{safe_name}.md) ({len(links)} 個書籤)\n"
        
        index_md += "\n---\n\n"
        index_md += f"**總計**: {len(bookmarks)} 個文件夾，{sum(len(v) for v in bookmarks.values())} 個書籤\n"
        
        index_file = self.output_dir / "INDEX.md"
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(index_md)
        
        logger.info(f"✓ 已創建索引: {index_file}")


def main():
    """主程序"""
    converter = BookmarkConverter()
    
    # 轉換書籤
    html_file = "/home/sms/3ba5535a-aa16-4bf5-a3cb-c9901235153f.html"
    converter.convert_bookmarks(html_file)


if __name__ == "__main__":
    main()
