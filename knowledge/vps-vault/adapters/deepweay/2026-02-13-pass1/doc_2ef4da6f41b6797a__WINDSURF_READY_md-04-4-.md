---
title: Windsurf 開發環境就緒指南：從部署到 AI 實驗頁面開發
category: 2-knowledge-base/2.1-ai-strategy
source: gcp-distilled/WINDSURF_READY.md.distilled
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 配置、故障排除與指南

文檔提供詳細的環境變量、Caddy/PM2 配置和故障排除。

### 4.1 環境變量管理

背景是，環境變量用於安全儲存 API 金鑰。原理上，使用 .env 檔案載入變量。

實例：設定 SUPABASE_URL 和 GEMINI_API_KEY。

代碼範例6：.env 檔案範例

```
# .env 檔案
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key

# 註釋：這些變量在 Node.js 中透過 process.env 訪問，避免 Git 提交敏感資料。
```

### 4.11 故障排除指南

常見問題如 PM2 崩潰或 Caddy 配置錯誤。背景是，部署環境的異質性導致潛在問題。

原理上，透過日誌檢查和重啟解決。實例：使用 `pm2 logs` 查看錯誤。

代碼範例7：PM2 常用命令

```bash
# PM2 啟動應用
pm2 start app.js --name windsurf

# 查看日誌
pm2 logs windsurf

# 重啟
pm2 restart windsurf

# 註釋：這些命令幫助監控和管理進程，確保應用穩定運行。
```

代碼範例8：Caddy 配置檔案

```
# Caddyfile
deepweay.me {
  reverse_proxy localhost:3000
}

# 註釋：此配置將域名請求代理到本地 3000 端口的 Node.js 應用。
```
