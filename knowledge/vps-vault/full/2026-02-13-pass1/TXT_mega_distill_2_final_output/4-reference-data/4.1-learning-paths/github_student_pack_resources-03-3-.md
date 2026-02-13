---
distilled_by: grok-4-0709
mode: B
---
part: 3
---

## 3. 代碼範例

### 3.1 使用 Puppeteer 下載 Icons8 資產
```javascript
// 示例1: Puppeteer 腳本自動下載 SVG icons
const puppeteer = require('puppeteer');

async function downloadIcons() {
  const browser = await puppeteer.launch(); // 啟動瀏覽器
  const page = await browser.newPage();
  await page.goto('https://icons8.com/icons'); // 導航到頁面
  await page.click('.download-button'); // 模擬點擊下載
  await browser.close(); // 關閉瀏覽器
}
downloadIcons(); // 執行下載
```

### 3.2 Scrapy 抓取 Educative 課程
```python
# 示例2: Scrapy spider 提取課程內容
import scrapy

class EducativeSpider(scrapy.Spider):
    name = 'educative'
    start_urls = ['https://www.educative.io/courses']  # 起始 URL

    def parse(self, response):
        for course in response.css('.course-item'):  # 解析課程項目
            yield {'title': course.css('h2::text').get()}  # 提取標題
```

### 3.3 yt-dlp 下載 FrontendMasters 視頻
```bash
# 示例3: yt-dlp 命令下載課程視頻
yt-dlp -f best -o "%(title)s.%(ext)s" https://frontendmasters.com/courses/react/  # 下載 React 課程
```

### 3.4 wget 批量下載 GitHub Documentation
```bash
# 示例4: wget 遞迴下載文檔
wget -r -np -k https://docs.github.com/  # 遞迴下載 GitHub docs
```

### 3.5 Curl 提取 Stripe API 示例
```bash
# 示例5: curl 獲取 API 文檔
curl -o stripe_docs.json https://stripe.com/docs/api  # 下載 JSON 格式文檔
```

### 3.6 Git Clone Octicons Repo
```bash
# 示例6: git clone 下載圖標庫
git clone https://github.com/primer/octicons.git  # clone 官方 repo
```

### 3.7 Node.js 腳本處理 Notion Templates
```javascript
// 示例7: Node.js 腳本導出模板
const fs = require('fs');
fs.writeFile('template.json', JSON.stringify(templateData), (err) => {  // 寫入 JSON 文件
  if (err) throw err;
});
```

### 3.8 Python 腳本分析 Copilot 片段
```python
# 示例8: Python 分析代碼片段
def analyze_snippet(code):
    # 簡單註釋: 計算行數
    lines = code.split('\n')
    return len(lines)  # 返回行數
```
