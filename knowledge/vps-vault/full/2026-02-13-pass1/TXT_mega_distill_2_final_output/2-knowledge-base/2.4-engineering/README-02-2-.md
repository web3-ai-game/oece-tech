---
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. 系統架構與組件

### 2.1 MD語料庫的詳細結構
MD目錄包含books子目錄（完整小說文本）、data/structures（每個書籍的proposition/structure JSON）、以及metadata.json（類別和書籍元數據）。背景是為了高效檢索，JSON檔案提供高層摘要，避免直接處理龐大文本。原理是基於圖知識表示（graph knowledge representation），將故事元素轉為節點和邊緣。

實例：對於一本浪漫小說，JSON可能包括{"characters": ["Alice", "Bob"], "relations": {"Alice-Bob": "lovers"}, "rules": ["no betrayal"] }。這允許AI快速構建模擬而不需全文。

代碼範例1：讀取metadata.json（JavaScript）
```javascript
// 載入metadata.json並解析書籍類別
const fs = require('fs');
const metadata = JSON.parse(fs.readFileSync('MD/metadata.json', 'utf8'));
// 範例：過濾特定類別的書籍
const romanceBooks = metadata.books.filter(book => book.genre === 'romance');
console.log('浪漫類書籍：', romanceBooks);
```

### 2.2 現有Web Reader應用
Web reader位於MD目錄下，透過npm install和npm start啟動，訪問http://localhost:3000。背景是作為閱讀介面，允許瀏覽語料庫。原理基於React框架，提供動態渲染。實例：用戶可以搜尋特定章節，類似Kindle web版。

代碼範例2：啟動Web Reader（Bash腳本）
```bash
# 安裝依賴並啟動伺服器
cd MD
npm install  # 安裝必要套件
npm start    # 啟動本地伺服器
# 瀏覽器中訪問 http://localhost:3000 以閱讀小說
```

### 2.3 xAI API整合與配置
一鍵配置透過.env檔案設定XAI_API_KEY。背景是為了安全存取API，避免硬編碼。原理基於環境變數管理，符合DevOps最佳實踐。實例：在模擬中，API用於生成story bible。

代碼範例3：設定.env並調用API（Node.js）
```javascript
// 載入dotenv以讀取.env
require('dotenv').config();
const xaiApiKey = process.env.XAI_API_KEY;
// 範例：簡單API調用（假設有xai-client庫）
const xai = require('xai-client')(xaiApiKey);
xai.generateStoryBible({ book: 'example.json' }).then(response => console.log(response));
```
