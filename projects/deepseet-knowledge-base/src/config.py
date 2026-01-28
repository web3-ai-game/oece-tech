import os
from dotenv import load_dotenv
import logging

# 加載 .env 文件（如果存在）
load_dotenv()

logger = logging.getLogger(__name__)

class Config:
    # API Keys
    # 優先從環境變量獲取
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    if not GEMINI_API_KEY:
        # Fallback to hardcoded keys from documentation if env var is missing
        # GEMINI_PRO_30
        GEMINI_API_KEY = "AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4"
    
    # Log key status (masked)
    if GEMINI_API_KEY:
        masked_key = GEMINI_API_KEY[:4] + "..." + GEMINI_API_KEY[-4:]
        print(f"Loaded API Key: {masked_key}")
    else:
        print("Warning: No API Key found!")

    # Models
    # 用於快速處理、提取內容
    MODEL_FAST = "gemini-2.0-flash-exp" 
    # 用於高質量生成、擴寫、架構設計
    MODEL_SMART = "gemini-1.5-pro" 
    
    # Paths
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    OUTPUT_DIR = os.path.join(BASE_DIR, "output")
    URLS_FILE = os.path.join(BASE_DIR, "urls.txt")
    
    # Settings
    MAX_CONCURRENT_REQUESTS = 5
    TIMEOUT = 30
    
    # Prompts
    EXPAND_URL_PROMPT = """
    你是一個專業的網絡資源研究員。我會給你一組種子 URL。
    請分析這些 URL 的主題和內容類型，然後生成一個包含 5-10 個相關的高質量 URL 的列表。
    這些 URL 應該是關於同一主題的權威文章、文檔、博客或資源集合。
    
    種子 URL:
    {seed_urls}
    
    請只返回 URL 列表，每行一個，不要有任何其他文字或編號。
    """
    
    SUMMARIZE_PROMPT = """
    你是一個專業的技術文檔工程師。請將以下網頁內容轉換為結構清晰的 Markdown 知識庫文檔。
    
    原文內容:
    {content}
    
    要求:
    1. 標題: 使用一級標題 (#) 重寫一個吸引人的標題。
    2. 摘要: 在開頭寫一段 100-200 字的高質量摘要，概括核心價值。
    3. 結構: 使用適當的標題層級 (##, ###) 組織內容。
    4. 提煉: 去除廣告、導航欄等無關內容，保留核心知識點。
    5. 擴寫: 對於關鍵概念，如果原文解釋不足，請利用你的知識庫進行適當的補充說明 (用 *註: ...* 標註)。
    6. 標籤: 在文檔末尾添加 Tags: [tag1, tag2, ...]
    
    請直接輸出 Markdown 內容。
    """

    @staticmethod
    def ensure_dirs():
        os.makedirs(Config.OUTPUT_DIR, exist_ok=True)
        os.makedirs(os.path.join(Config.OUTPUT_DIR, "raw"), exist_ok=True)
        os.makedirs(os.path.join(Config.OUTPUT_DIR, "processed"), exist_ok=True)
