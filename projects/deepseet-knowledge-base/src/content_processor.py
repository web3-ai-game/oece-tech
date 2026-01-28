import aiohttp
import asyncio
from bs4 import BeautifulSoup
import markdownify
import google.generativeai as genai
from config import Config
import logging
import os
import hashlib
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ContentProcessor:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(Config.MODEL_SMART)

    async def fetch_url(self, session, url):
        """抓取 URL 內容"""
        try:
            async with session.get(url, timeout=Config.TIMEOUT) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    logger.warning(f"抓取失敗 {url}: {response.status}")
                    return None
        except Exception as e:
            logger.error(f"抓取錯誤 {url}: {e}")
            return None

    def clean_html(self, html_content):
        """清洗 HTML，移除無關元素"""
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # 移除腳本、樣式、導航、頁腳等
        for tag in soup(['script', 'style', 'nav', 'footer', 'iframe', 'noscript']):
            tag.decompose()
            
        return str(soup)

    async def process_content(self, url, html_content):
        """使用 AI 處理內容並轉換為 Markdown"""
        # 1. 提取純文本 (用於減少 token 消耗)
        soup = BeautifulSoup(html_content, 'html.parser')
        text_content = soup.get_text(separator='\n', strip=True)[:10000] # 限制長度
        
        # 2. 構建 Prompt
        prompt = Config.SUMMARIZE_PROMPT.format(content=text_content)
        
        try:
            # 3. AI 生成 Markdown
            response = await self.model.generate_content_async(prompt)
            markdown_content = response.text
            
            # 4. 添加元數據
            metadata = f"""---
url: {url}
date: {asyncio.get_event_loop().time()}
---

"""
            return metadata + markdown_content
            
        except Exception as e:
            logger.error(f"AI 處理失敗 {url}: {e}")
            # 降級方案：直接轉換
            return markdownify.markdownify(html_content)

    def save_markdown(self, url, content):
        """保存 Markdown 文件"""
        # 使用 URL 的哈希作為文件名
        url_hash = hashlib.md5(url.encode()).hexdigest()
        filename = f"{url_hash}.md"
        filepath = os.path.join(Config.OUTPUT_DIR, "processed", filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"已保存: {filepath}")
            return filepath
        except Exception as e:
            logger.error(f"保存文件失敗: {e}")
            return None