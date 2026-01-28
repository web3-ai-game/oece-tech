# 🚀 GitHub + DigitalOcean 快速部署

## 📋 準備清單

- ✅ GitHub 帳號
- ✅ DigitalOcean 帳號
- ✅ 域名（可選）

---

## 步驟 1: 推送到 GitHub

### 1.1 初始化 Git

```bash
cd /Users/svs.loline/Documents/xiangmu/tech-room

# 初始化（如果還沒有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "🎉 Initial commit: GeekSEA Tutorial Platform"
```

### 1.2 創建 GitHub 倉庫

1. 訪問 https://github.com/new
2. 倉庫名稱: `geeksea`
3. 設為 Public 或 Private
4. **不要**勾選 README, .gitignore, license

### 1.3 推送代碼

```bash
# 添加遠程倉庫
git remote add origin https://github.com/YOUR_USERNAME/geeksea.git

# 推送
git branch -M main
git push -u origin main
```

---

## 步驟 2: 部署到 DigitalOcean

### 2.1 訪問 App Platform

https://cloud.digitalocean.com/apps/new

### 2.2 選擇倉庫

1. 點擊 "GitHub"
2. 授權 DigitalOcean 訪問
3. 選擇 `geeksea` 倉庫
4. 選擇 `main` 分支

### 2.3 配置應用

**應用名稱**: `geeksea`

**區域**: 選擇最近的（如 Singapore）

**環境變量**:
```
JWT_SECRET=your-production-secret-here-change-this
NODE_ENV=production
DATABASE_URL=/data/geeksea.db
NEXT_PUBLIC_SITE_URL=https://your-app.ondigitalocean.app
```

**構建命令**:
```bash
npm run build
```

**運行命令**:
```bash
npm run start
```

### 2.4 選擇計劃

✅ **Basic - $5/月**
- 1 GB RAM
- 完美適合早期階段

### 2.5 部署！

點擊 "Create Resources"

等待 5-10 分鐘...

---

## 步驟 3: 訪問應用

你的應用會部署到:
```
https://geeksea-xxxxx.ondigitalocean.app
```

---

## 📝 後續步驟

### 初始化數據庫

App Platform 首次部署後需要初始化數據庫：

1. 打開 Console（在 App Platform 界面）
2. 運行：
```bash
npm run db:init
npm run db:seed
```

### 綁定自定義域名（可選）

1. 在 App Platform 點擊 "Settings"
2. 點擊 "Domains"
3. 添加你的域名
4. 更新 DNS 記錄

---

## 🔄 持續部署

每次推送到 `main` 分支，自動部署！

```bash
# 修改代碼後
git add .
git commit -m "✨ Add new feature"
git push

# DigitalOcean 會自動部署！
```

---

## 💰 成本

- **App Platform**: $5/月
- **總計**: **$60/年**

---

## 🎉 完成！

你的專業教程站已經上線了！

**下一步**: 添加內容、推廣、成長！
