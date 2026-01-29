# DigitalOcean App Platform 部署指南

## 從 GitHub 部署 OECE.TECH (Next.js 16)

---

## 📌 第一步：選擇倉庫和分支

### 倉庫選擇
- **選擇**: `web3-ai-game/oece-tech`

### 分支選擇（重要！）

你截圖裡看到 4 個分支：

| 分支名 | 說明 | 選不選？ |
|--------|------|----------|
| **`main`** | 主分支，穩定版本 | ✅ **選這個** |
| `claude/fix-header-language-switch-VX0AO` | AI 自動創建的修復分支 | ❌ 不選 |
| `claude/generate-backend-modules-01Prj...` | AI 自動創建的後端分支 | ❌ 不選 |
| `dependabot/npm_and_yarn/npm_and_yarn-...` | 依賴自動更新分支 | ❌ 不選 |

**結論：選 `main` 分支**

其他分支是 GitHub 的自動化工具（Dependabot）或 AI 助手（Claude）創建的臨時分支，不是正式發布版本。

---

## 📌 第二步：配置 App 設置

### 2.1 選擇 App 類型
- **Type**: `Web Service`（不是 Static Site，因為 Next.js 需要 Node.js 運行時）

### 2.2 配置構建設置

| 設置項 | 值 |
|--------|-----|
| **Source Directory** | `/`（根目錄） |
| **Build Command** | `npm run build` |
| **Run Command** | `npm run start` |
| **HTTP Port** | `3000` |

### 2.3 選擇資源規格

| 規格 | 價格 | 建議 |
|------|------|------|
| Basic (512 MB) | $5/月 | 測試用 |
| Basic (1 GB) | $10/月 | ✅ 推薦 |
| Professional | $12+/月 | 生產環境 |

---

## 📌 第三步：環境變量

在 **Environment Variables** 區域添加：

```
NODE_ENV=production
```

如果你有 API Keys，也在這裡添加（不要提交到 GitHub）：
```
GOOGLE_AI_API_KEY=你的key
NEXT_PUBLIC_AI_CHAT_API_URL=你的API地址
```

---

## 📌 第四步：部署

點擊 **Create Resources** 或 **Deploy** 按鈕。

等待 3-5 分鐘，DigitalOcean 會：
1. 從 GitHub 拉取代碼
2. 運行 `npm install`
3. 運行 `npm run build`
4. 啟動 `npm run start`

---

## 📌 第五步：自定義域名（DNS 設置）

部署成功後，你會得到一個類似這樣的 URL：
```
https://oece-tech-xxxxx.ondigitalocean.app
```

### 如果要綁定自己的域名（如 `oece.tech`）：

#### 5.1 在 DigitalOcean 添加域名
1. 進入 App → Settings → Domains
2. 點擊 **Add Domain**
3. 輸入你的域名：`oece.tech` 或 `www.oece.tech`

#### 5.2 DNS 記錄設置

去你的域名 DNS 管理面板（如 Cloudflare、GoDaddy、Namecheap），添加以下記錄：

| 記錄類型 | 名稱 | 值 | 說明 |
|----------|------|-----|------|
| **A 記錄** | `@` | DigitalOcean 提供的 IP | 根域名指向 |
| **CNAME 記錄** | `www` | `oece-tech-xxxxx.ondigitalocean.app` | www 子域名 |
| **TXT 記錄** | `_dnslink` 或 DigitalOcean 指定的名稱 | DigitalOcean 提供的驗證值 | 域名驗證用 |

### DNS 記錄類型說明

| 類型 | 用途 | 值的格式 |
|------|------|----------|
| **A 記錄** | 將域名指向 IP 地址 | `143.198.xxx.xxx`（IP 地址） |
| **CNAME 記錄** | 將子域名指向另一個域名 | `xxx.ondigitalocean.app`（域名） |
| **TXT 記錄** | 驗證域名所有權 | 一串隨機字符串 |

---

## 📌 常見問題

### Q: 構建失敗怎麼辦？
1. 檢查 Build Logs
2. 確保 `package.json` 中有 `build` 和 `start` 腳本
3. 確保 Node.js 版本兼容（Next.js 16 需要 Node 18+）

### Q: 如何設置 Node.js 版本？
在 App Settings 中添加環境變量：
```
NODE_VERSION=20
```

### Q: 如何開啟自動部署？
默認已開啟。每次 push 到 `main` 分支，DigitalOcean 會自動重新部署。

---

## 📌 快速檢查清單

- [x] 選擇 `web3-ai-game/oece-tech` 倉庫
- [x] 選擇 `main` 分支
- [x] 設置 Build Command: `npm run build`
- [x] 設置 Run Command: `npm run start`
- [x] 設置 HTTP Port: `3000`
- [x] 添加環境變量
- [x] 點擊部署
- [x] 等待構建完成
- [x] 測試訪問
- [x] （可選）綁定自定義域名

---

## 📞 需要幫助？

如果遇到問題，檢查 DigitalOcean 的 **Build Logs** 和 **Runtime Logs**，通常會有詳細的錯誤信息。
