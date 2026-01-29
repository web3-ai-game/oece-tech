# 🔧 修正並部署 OECE Tech（完整步驟）

**問題**: Node.js v18 不支持 Next.js 16 + Firebase Hosting  
**解決**: 升級到 Node.js v20

---

## ✅ 已完成的工作

1. ✅ Firebase 已登錄（sms.pve@gmail.com）
2. ✅ Firebase Service Account 已自動上傳到 GitHub Secrets
3. ✅ Gemini Keys 已注入 Doppler（3個收費 + 1個免費）
4. ✅ 世界級 UI 已生成（賽博朋克風格）
5. ✅ firebase.json 已修正為 Next.js 模式

---

## ⚠️ 當前問題

**錯誤**: `You are using Node.js 18.20.8. For Next.js, Node.js version ">=20.9.0" is required.`

**原因**: Firebase Hosting 部署 Next.js 16 需要 Node.js v20+

---

## 🚀 解決方案（3選1）

### 方案 1: 使用 GitHub Actions 部署（推薦）⭐

GitHub Actions 使用 Node.js 20，不受本地環境影響。

**步驟**:
1. 確保 GitHub Secrets 已配置（Firebase 已自動配置好了）
2. 推送代碼觸發自動部署：
   ```bash
   cd /Users/deepweay/Documents/github/oece-tech
   git add . && git commit -m "🚀 Deploy via GitHub Actions" && git push origin main
   ```
3. 查看部署進度：https://github.com/web3-ai-game/oece-tech/actions
4. 等待 2-3 分鐘，訪問：https://oece-tech-9aa8d.web.app

**優點**: 不需要升級本地 Node.js，自動化部署

---

### 方案 2: 升級本地 Node.js 到 v20

**步驟 1**: 安裝 NVM（Node Version Manager）
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**步驟 2**: 重啟終端或執行
```bash
source ~/.zshrc
```

**步驟 3**: 安裝並使用 Node.js 20
```bash
nvm install 20
nvm use 20
nvm alias default 20
node -v  # 應該顯示 v20.x.x
```

**步驟 4**: 重新部署
```bash
cd /Users/deepweay/Documents/github/oece-tech
source /Users/deepweay/Documents/github/sms-key/FINAL-KEYS-CONFIG.env
firebase deploy
```

---

### 方案 3: 修復 Homebrew 權限並升級

```bash
# 修復權限
sudo chown -R deepweay /opt/homebrew

# 重新 link Node 20
brew link node@20 --force --overwrite

# 驗證版本
node -v  # 應該顯示 v20.19.5

# 部署
cd /Users/deepweay/Documents/github/oece-tech
source /Users/deepweay/Documents/github/sms-key/FINAL-KEYS-CONFIG.env
firebase deploy
```

---

## 🎯 推薦執行（方案 1）

直接用 GitHub Actions 部署，最簡單：

```bash
cd /Users/deepweay/Documents/github/oece-tech
git add . && git commit -m "🚀 Deploy Next.js app via GitHub Actions" && git push origin main
```

然後訪問：
- **GitHub Actions**: https://github.com/web3-ai-game/oece-tech/actions
- **部署後訪問**: https://oece-tech-9aa8d.web.app

---

## 📊 當前狀態

| 項目 | GitHub | Doppler | Firebase | UI |
|------|--------|---------|----------|-----|
| **oece-tech** | ✅ 已推送 | ✅ 15個變量 | ✅ Service Account | ✅ 賽博朋克 |
| **deepweay-me** | ✅ 已推送 | ✅ 15個變量 | ⏳ 待配置 | ⏳ 待開發 |

---

## 🔥 下一步

### 立即執行（推薦）
```bash
cd /Users/deepweay/Documents/github/oece-tech
git add . && git commit -m "🚀 Ready for deployment" && git push origin main
```

### 或者升級 Node.js 後手動部署
```bash
# 安裝 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 20
nvm use 20

# 部署
cd /Users/deepweay/Documents/github/oece-tech
firebase deploy
```

---

## 📝 完成後刪除

```bash
rm /Users/deepweay/Documents/github/oece-tech/FIX-AND-DEPLOY.md
rm /Users/deepweay/Documents/github/oece-tech/SETUP-FIREBASE.md
rm /Users/deepweay/Documents/github/deepweay-me/SETUP-GITHUB-SECRETS.md
rm /Users/deepweay/Documents/github/deepweay-me/SETUP-FIREBASE.md
```

---

**創建時間**: 2025-11-28  
**狀態**: 🔧 修正配置，準備部署  
**推薦**: 使用 GitHub Actions 自動部署（方案 1）
