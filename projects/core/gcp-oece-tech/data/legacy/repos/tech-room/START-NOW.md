# 🚀 GeekSEA 立即開始

## 一鍵啟動（最簡單）

```bash
cd /Users/svs.loline/Documents/xiangmu/tech-room
./启动GeekSEA.sh
```

腳本會自動完成所有設置！

## 手動啟動（三步驟）

### 步驟 1: 安裝依賴

```bash
npm install
```

### 步驟 2: 初始化數據庫並填充數據

```bash
npm run db:init
npm run db:seed
```

### 步驟 3: 啟動服務器

```bash
npm run dev
```

## 📱 立即體驗

打開瀏覽器訪問：

### 🏠 首頁
http://localhost:3000

### 📚 教程列表
http://localhost:3000/tutorials

### 🔐 登錄（測試帳號）
http://localhost:3000/auth/login
- 郵箱: `web3@geeksea.com`
- 密碼: `Password123`

### ✍️ 註冊新帳號
http://localhost:3000/auth/register

## ✨ 當前可用功能

### ✅ 完整認證系統
- 用戶註冊（帶密碼強度檢測）
- 用戶登錄
- JWT Token 管理
- 自動登錄狀態維護

### ✅ 教程系統
- 6個示例教程
- 搜索和篩選功能
- Markdown 內容渲染
- 代碼語法高亮
- 一鍵複製代碼
- 點贊和收藏功能
- 分享功能

### ✅ 像素化 UI
- 復古像素藝術風格
- Web3 螢光配色
- CRT 顯示器效果
- 響應式設計（桌面/平板/手機）

## 🎯 快速測試流程

1. **註冊帳號** → 訪問 `/auth/register`
2. **瀏覽教程** → 訪問 `/tutorials`
3. **搜索教程** → 嘗試搜索 "Solidity"
4. **查看教程** → 點擊任意教程卡片
5. **測試移動端** → F12 打開開發者工具，切換設備視圖

## 📱 移動端測試

1. 打開 Chrome DevTools (F12)
2. 點擊 "Toggle device toolbar" (Ctrl+Shift+M)
3. 選擇設備:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)

## 🎨 設計特色

- **像素化按鈕** - 懸停時有陰影動畫
- **螢光文字** - 霓虹燈效果
- **CRT 效果** - 掃描線和暈影
- **代碼高亮** - 30+ 語言支持

## 📊 項目數據

```
總代碼行數:    ~7000+
組件數量:      15+
頁面數量:      5
API 端點:      5
數據表:        6
示例教程:      6
支持語言:      30+
```

## 🔧 開發命令

```bash
npm run dev          # 啟動開發服務器
npm run build        # 構建生產版本
npm run start        # 啟動生產服務器
npm run db:init      # 初始化數據庫
npm run db:seed      # 填充示例數據
```

## 📁 重要文件

- `README.md` - 完整項目文檔
- `QUICKSTART.md` - 快速開始指南
- `PROJECT-STATUS.md` - 開發進度
- `PHASE2-COMPLETE.md` - Phase 2 總結
- `DELIVERY-SUMMARY.md` - 交付總結

## 💡 提示

- 首次運行會自動安裝依賴
- 數據庫文件在 `database/geeksea.db`
- 環境變量在 `.env`（複製自 `.env.example`）
- 修改代碼會自動熱重載

## 🐛 遇到問題？

### 端口被佔用
```bash
lsof -ti:3000 | xargs kill -9
```

### 數據庫錯誤
```bash
rm database/geeksea.db
npm run db:init
npm run db:seed
```

### 依賴問題
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎉 開始探索吧！

你的專業教程站已經準備就緒！

**現在就運行:**
```bash
./启动GeekSEA.sh
```

**然後訪問:** http://localhost:3000

祝你使用愉快！🎮✨
