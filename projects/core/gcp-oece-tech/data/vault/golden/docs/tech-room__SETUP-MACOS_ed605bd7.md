# 🍎 macOS 本地開發設置指南

## ⚠️ Node.js 版本問題

你當前使用 **Node.js v24**，但 better-sqlite3 還不支持這麼新的版本。

## 🔧 解決方案

### 方案 1: 使用 nvm 切換到 Node.js 18 LTS（推薦）

```bash
# 1. 安裝 nvm（如果沒有）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. 重新加載 shell
source ~/.zshrc  # 或 ~/.bashrc

# 3. 安裝 Node.js 18 LTS
nvm install 18

# 4. 使用 Node.js 18
nvm use 18

# 5. 設為默認
nvm alias default 18

# 6. 確認版本
node --version  # 應該顯示 v18.x.x
```

### 方案 2: 使用預編譯的 better-sqlite3

修改 `package.json`:

```json
{
  "dependencies": {
    "better-sqlite3": "^11.0.0"
  }
}
```

---

## 📝 完整設置步驟

### 步驟 1: 切換 Node.js 版本

```bash
# 切換到項目目錄
cd /Users/svs.loline/Documents/xiangmu/tech-room

# 使用 Node.js 18
nvm use 18
```

### 步驟 2: 清理並重新安裝

```bash
# 刪除舊的 node_modules
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

### 步驟 3: 初始化數據庫

```bash
npm run db:init
npm run db:seed
```

### 步驟 4: 啟動開發服務器

```bash
npm run dev
```

### 步驟 5: 訪問應用

打開瀏覽器：http://localhost:3000

---

## 🔄 熱更新已啟用

Next.js 自動支持熱更新！

修改任何文件後，瀏覽器會自動刷新。

### 測試熱更新：

1. 打開 `app/page.tsx`
2. 修改任何文字
3. 保存文件
4. 瀏覽器自動刷新！✨

---

## 🐛 常見問題

### Q: 端口 3000 被佔用？

```bash
# 查找佔用進程
lsof -ti:3000

# 殺死進程
lsof -ti:3000 | xargs kill -9

# 或使用其他端口
PORT=3001 npm run dev
```

### Q: 數據庫錯誤？

```bash
# 重新初始化
rm database/geeksea.db
npm run db:init
npm run db:seed
```

### Q: 依賴安裝失敗？

```bash
# 完全清理
rm -rf node_modules package-lock.json ~/.npm

# 重新安裝
npm install
```

---

## 🚀 開發工作流

### 1. 每天開始

```bash
cd /Users/svs.loline/Documents/xiangmu/tech-room
nvm use 18
npm run dev
```

### 2. 修改代碼

- 編輯任何 `.tsx`, `.ts`, `.css` 文件
- 自動熱更新
- 查看效果

### 3. 提交代碼

```bash
git add .
git commit -m "✨ Add new feature"
git push
```

---

## 📱 移動端測試

### Chrome DevTools

1. 按 `F12` 打開開發者工具
2. 按 `Cmd+Shift+M` 切換設備模擬
3. 選擇設備：
   - iPhone SE
   - iPhone 12 Pro
   - iPad

### 實際設備測試

1. 確保電腦和手機在同一 WiFi
2. 獲取電腦 IP：
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. 在手機訪問：`http://YOUR_IP:3000`

---

## 💡 開發提示

### VS Code 擴展推薦

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

### 快捷鍵

```bash
npm run dev       # 啟動開發服務器
npm run build     # 構建生產版本
npm run start     # 啟動生產服務器
npm run lint      # 代碼檢查
npm run db:init   # 初始化數據庫
npm run db:seed   # 填充示例數據
```

---

## 🎉 準備好了！

現在你可以：

1. ✅ 本地開發
2. ✅ 熱更新
3. ✅ 移動端測試
4. ✅ Git 版本控制
5. ✅ 隨時部署到生產環境

**開始開發吧！** 🚀✨
