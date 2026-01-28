import os
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import datetime

# --- 配置區 ---
INPUT_FILE = '/Users/deepweay/Documents/github/deepseet/3ba5535a-aa16-4bf5-a3cb-c9901235153f.html'  # 你的文件名
OUTPUT_FILE = '/Users/deepweay/Documents/github/deepseet/Knowledge_Base_Import.md'

# --- 智能分類邏輯 ---
def get_category_and_type(url, title):
    url = url.lower()
    title = title.lower()
    
    # 1. 視頻流 (Videos)
    if any(x in url for x in ['youtube', 'youtu.be', 'bilibili', 'vimeo', 'xnxx', 'xvideos', 'pornhub']):
        return "🎥 視頻媒體 (Videos)", "Video"
    
    # 2. 圖片/設計 (Images/Design)
    if any(x in url for x in ['pinterest', 'huaban', 'behance', 'artstation', 'pixabay', 'istock', 'imgur']) or \
       url.endswith(('.jpg', '.png', '.gif', '.jpeg')):
        return "🖼️ 視覺靈感 (Images)", "Image"
        
    # 3. 技術/代碼/雲服務 (Tech stack)
    if any(x in url for x in ['github', 'stackoverflow', 'csdn', 'google.com/cloud', 'console.cloud', 'aliyun', 'digitalocean', 'vps', 'cloudflare', 'python', 'api']):
        return "💻 技術軍火庫 (Tech Stack)", "Tech"
        
    # 4. 數字遊民/工具 (Nomad Tools)
    if any(x in url for x in ['visa', 'ticket', 'flight', 'airbnb', 'map', 'sms', 'receive', 'wallet', 'crypto', 'binance', 'pay']):
        return "🌍 數字遊民 (Nomad Life)", "Tool"

    # 5. 科學/研究 (Research/Bio) - 針對你的藥理學/化學內容
    if any(x in url for x in ['erowid', 'psychonautwiki', 'chemical', 'science', 'nature.com', 'ncbi', 'wiki']):
        return "🧪 邊緣科學 (Research)", "Study"
    
    # 6. 默認歸類
    return "📂 綜合歸檔 (General)", "Web"

def parse_bookmarks(file_path):
    print("正在加載書籤數據...")
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    links = soup.find_all('a')
    structured_data = {}

    for link in links:
        url = link.get('href')
        title = link.get_text().strip()
        add_date = link.get('add_date')
        
        # 轉換時間戳
        try:
            date_str = datetime.datetime.fromtimestamp(int(add_date)).strftime('%Y-%m-%d')
        except:
            date_str = "Unknown"

        category, content_type = get_category_and_type(url, title)

        if category not in structured_data:
            structured_data[category] = []
        
        structured_data[category].append({
            'title': title,
            'url': url,
            'date': date_str,
            'type': content_type
        })
    
    return structured_data

def generate_markdown(data, output_path):
    print(f"正在生成知識庫文件: {output_path} ...")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# 🧠 Digital Brain Knowledge Base\n\n")
        f.write("> 由自動化腳本生成，已按屬性分類。可以直接導入 Notion。\n\n")

        # 按分類寫入
        for category, items in data.items():
            f.write(f"## {category}\n\n")
            # 創建 Markdown 表格，方便 Notion 識別為 Database
            f.write("| Title | URL | Date | Type |\n")
            f.write("| --- | --- | --- | --- |\n")
            
            for item in items:
                # 處理標題中的豎線，防止破壞表格
                clean_title = item['title'].replace('|', '-')
                f.write(f"| [{clean_title}]({item['url']}) | {item['url']} | {item['date']} | {item['type']} |\n")
            
            f.write("\n---\n\n")

# --- 執行 ---
if __name__ == "__main__":
    data = parse_bookmarks(INPUT_FILE)
    generate_markdown(data, OUTPUT_FILE)