import google.generativeai as genai
from config import Config
import logging
import asyncio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UrlExpander:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(Config.MODEL_SMART)

    async def expand_urls(self, seed_urls):
        """
        根據種子 URL 列表擴展生成更多相關 URL
        """
        if not seed_urls:
            logger.warning("沒有提供種子 URL")
            return []

        logger.info(f"正在根據 {len(seed_urls)} 個種子 URL 進行擴寫...")
        
        # 將 URL 列表轉換為字符串
        urls_str = "\n".join(seed_urls)
        
        prompt = Config.EXPAND_URL_PROMPT.format(seed_urls=urls_str)
        
        try:
            # 使用異步調用
            response = await self.model.generate_content_async(prompt)
            text = response.text
            
            # 解析返回的文本，提取 URL
            expanded_urls = []
            for line in text.split('\n'):
                line = line.strip()
                # 簡單的 URL 驗證
                if line.startswith('http'):
                    expanded_urls.append(line)
            
            logger.info(f"成功擴展生成了 {len(expanded_urls)} 個新 URL")
            return expanded_urls
            
        except Exception as e:
            logger.error(f"URL 擴寫失敗: {e}")
            return []

    def save_urls(self, urls, filepath):
        """保存 URL 到文件"""
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                for url in urls:
                    f.write(f"{url}\n")
            logger.info(f"URL 已保存到 {filepath}")
        except Exception as e:
            logger.error(f"保存 URL 失敗: {e}")