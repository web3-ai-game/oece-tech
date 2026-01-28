import asyncio
import aiohttp
import os
from config import Config
from url_expander import UrlExpander
from content_processor import ContentProcessor
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def main():
    Config.ensure_dirs()
    
    # 1. 初始化組件
    expander = UrlExpander()
    processor = ContentProcessor()
    
    # 2. 讀取種子 URL
    seed_urls = []
    if os.path.exists(Config.URLS_FILE):
        with open(Config.URLS_FILE, 'r') as f:
            seed_urls = [line.strip() for line in f if line.strip()]
    
    if not seed_urls:
        logger.error("未找到種子 URL，請檢查 urls.txt")
        return

    # 3. 擴寫 URL
    logger.info("開始擴寫 URL...")
    expanded_urls = await expander.expand_urls(seed_urls)
    
    # 合併並去重
    all_urls = list(set(seed_urls + expanded_urls))
    logger.info(f"總共待處理 URL: {len(all_urls)}")
    
    # 保存擴展後的 URL 列表
    expander.save_urls(all_urls, os.path.join(Config.OUTPUT_DIR, "all_urls.txt"))

    # 4. 處理內容
    logger.info("開始抓取和處理內容...")
    async with aiohttp.ClientSession() as session:
        tasks = []
        for url in all_urls:
            tasks.append(process_single_url(session, processor, url))
        
        # 控制並發
        semaphore = asyncio.Semaphore(Config.MAX_CONCURRENT_REQUESTS)
        
        async def sem_task(task):
            async with semaphore:
                return await task
        
        results = await asyncio.gather(*[sem_task(t) for t in tasks])
        
    logger.info("任務完成！")

async def process_single_url(session, processor, url):
    logger.info(f"正在處理: {url}")
    html = await processor.fetch_url(session, url)
    if html:
        cleaned_html = processor.clean_html(html)
        markdown = await processor.process_content(url, cleaned_html)
        if markdown:
            processor.save_markdown(url, markdown)

if __name__ == "__main__":
    asyncio.run(main())