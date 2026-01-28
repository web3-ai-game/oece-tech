import asyncio
import aiohttp
import json
import datetime
import os
from bs4 import BeautifulSoup
import google.generativeai as genai

# --- Gemini AI Configuration ---
try:
    gemini_api_key = os.environ["GEMINI_API_KEY_1"]
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
except KeyError:
    print("錯誤：找不到環境變數 GEMINI_API_KEY_1。請確保在執行 Docker 時設定了該變數。")
    exit(1)

# --- Helper Functions ---

async def get_text_from_html(html_content):
    """從 HTML 中提取純文字"""
    soup = BeautifulSoup(html_content, 'html.parser')
    for script_or_style in soup(["script", "style"]):
        script_or_style.decompose()
    text = soup.get_text(separator='\n', strip=True)
    return text

async def get_ai_analysis(text_content, url):
    """使用 Gemini 清洗和分析文字"""
    prompt = f"""
    你是一個專業的數據分析師。請分析以下從 URL ({url}) 抓取的文字內容。
    你的任務是：
    1.  生成一個簡潔、吸引人的新標題 (new_title)。
    2.  撰寫一段約 100 字的摘要 (summary)。
    3.  提取 3-5 個相關的關鍵字標籤 (tags)，以陣列形式呈現。

    請嚴格按照以下 JSON 格式回傳，不要有任何額外的解釋：
    {{
      "new_title": "...",
      "summary": "...",
      "tags": ["...", "..."]
    }}

    文字內容如下：
    ---
    {text_content[:4000]}
    ---
    """
    try:
        response = await model.generate_content_async(prompt)
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '')
        return json.loads(cleaned_response)
    except Exception as e:
        print(f"處理 URL {url} 時 Gemini API 發生錯誤: {e}")
        return {
            "new_title": "分析失敗",
            "summary": str(e),
            "tags": []
        }

# --- Core Logic ---

async def process_url(session, url):
    """抓取、處理單一 URL 並返回結構化數據"""
    try:
        async with session.get(url, timeout=30) as response:
            if response.status != 200:
                print(f"錯誤：抓取 {url} 失敗，狀態碼：{response.status}")
                return None, "fetch_failed"
            
            html_content = await response.text()
            text_content = await get_text_from_html(html_content)
            
            if not text_content:
                return None, "no_content"

            ai_data = await get_ai_analysis(text_content, url)

            vector_record = {
                "url": url,
                "title": ai_data.get('new_title', 'N/A'),
                "summary": ai_data.get('summary', 'N/A'),
                "content": text_content, # 全文
                "tags": ai_data.get('tags', []),
                "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "embedding_ready": f"{ai_data.get('new_title', '')}: {ai_data.get('summary', '')}" # 專門留給向量化的字段
            }
            
            return vector_record, "success"
            
    except Exception as e:
        print(f"處理 URL {url} 時發生未知錯誤: {e}")
        return None, str(e)

# --- Main Execution ---

async def main():
    """主執行函數"""
    urls_file = 'urls.txt'
    output_dir = '/app/output'
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, 'vector_data.jsonl')

    try:
        with open(urls_file, 'r') as f:
            urls = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"錯誤：找不到 {urls_file} 檔案。")
        return

    print(f"找到 {len(urls)} 個 URL。開始處理...")

    async with aiohttp.ClientSession() as session:
        tasks = [process_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)

    successful_records = 0
    with open(output_file, 'w', encoding='utf-8') as f:
        for record, status in results:
            if record and status == "success":
                f.write(json.dumps(record, ensure_ascii=False) + '\n')
                successful_records += 1
    
    print(f"--- 任務完成 ---")
    print(f"成功處理 {successful_records} / {len(urls)} 個 URL。")
    print(f"結果已儲存至 {output_file}")

if __name__ == "__main__":
    asyncio.run(main())
