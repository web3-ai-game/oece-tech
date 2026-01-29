# 🔐 OECE.TECH 安全配置指南

**重要**: 請勿將 API Keys 提交到 GitHub！

---

## ✅ 已完成的安全修復

1. ✅ 從 GitHub 移除 `env.local` 文件
2. ✅ 更新 `.gitignore` 防止敏感文件被提交
3. ✅ 修復 npm 依賴漏洞（Next.js 16.1.6）
4. ✅ Claude API Key 已被 Anthropic 自動撤銷

---

## 📝 正確的環境變量配置方式

### 方法 1: 本地 .env.local（推薦）

```bash
# 1. 複製模板
cp env.example .env.local

# 2. 編輯 .env.local（此文件已在 .gitignore 中）
# 填入你的 API Keys

# 3. .env.local 只存在於本地，永遠不會被提交到 Git
```

### 方法 2: GitHub Secrets（用於 CI/CD）

如果需要在 GitHub Actions 中使用：

1. 前往 GitHub 倉庫設置
2. Settings → Secrets and variables → Actions
3. 點擊 "New repository secret"
4. 添加以下 secrets：
   - `GROK_API_KEY`
   - `GEMINI_API_KEY`
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🚫 絕對不要做的事

❌ **不要**將 API Keys 寫在代碼中  
❌ **不要**提交 `.env.local` 到 Git  
❌ **不要**在 README 或文檔中暴露 Keys  
❌ **不要**在截圖中包含 Keys  
❌ **不要**在公開的 Issue 或 PR 中貼 Keys

---

## ✅ 應該做的事

✅ 使用 `.env.local` 存儲本地開發的 Keys  
✅ 使用 GitHub Secrets 存儲 CI/CD 的 Keys  
✅ 定期輪換 API Keys  
✅ 為不同環境使用不同的 Keys  
✅ 監控 API 使用量和異常活動

---

## 🔄 如果 API Key 洩露了怎麼辦

1. **立即撤銷舊 Key**
   - Claude: https://console.anthropic.com/settings/keys
   - Grok: https://console.x.ai/
   - Gemini: https://aistudio.google.com/app/apikey
   - OpenRouter: https://openrouter.ai/keys

2. **生成新 Key**
   - 創建新的 API Key
   - 更新本地 `.env.local`
   - 更新 GitHub Secrets（如果有）

3. **檢查使用記錄**
   - 查看是否有異常調用
   - 確認沒有產生意外費用

4. **清理 Git 歷史**（如果已提交）
   ```bash
   # 使用 BFG Repo-Cleaner 或 git filter-repo
   # 不建議使用 git filter-branch（已過時）
   ```

---

## 📋 當前 .gitignore 配置

已添加以下規則防止敏感文件被提交：

```gitignore
# 環境變量
.env
.env.local
.env*.local
env.local

# API Keys 和密鑰
*.key
*.pem
secrets/
.secrets/

# 配置文件
config.local.js
config.local.json
```

---

## 🎯 下一步

1. **生成新的 API Keys**
   - 前往各服務商平台生成新 Key
   - 使用低額度的測試 Key（如 $2-5）

2. **配置本地環境**
   ```bash
   # 創建 .env.local
   cat > .env.local << 'EOF'
   GROK_API_KEY=your_new_grok_key
   GEMINI_API_KEY=your_new_gemini_key
   OPENROUTER_API_KEY=your_new_openrouter_key
   EOF
   ```

3. **測試功能**
   ```bash
   npm run dev
   # 訪問 http://localhost:3000
   # 測試 AI 伴侶等功能
   ```

---

## 💡 最佳實踐

### 開發環境
- 使用 `.env.local` 存儲 Keys
- 設置低額度限制（$2-10）
- 使用測試專用的 Keys

### 生產環境
- 使用環境變量或密鑰管理服務
- 設置 IP 白名單
- 啟用使用量警報
- 定期輪換 Keys

### 團隊協作
- 每個開發者使用自己的 Keys
- 不要共享 Keys
- 使用 GitHub Secrets 管理共享環境

---

**記住**: 安全第一！寧可麻煩一點，也不要洩露 API Keys。

---

**更新時間**: 2026-01-28  
**狀態**: ✅ 安全配置已完成
