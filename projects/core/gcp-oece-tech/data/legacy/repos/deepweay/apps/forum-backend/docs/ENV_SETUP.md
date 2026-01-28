# 環境變量配置指南

## 快速設置

複製 `.env.example` 為 `.env.local`：

```bash
cp .env.example .env.local
```

然後編輯 `.env.local` 填入以下值：

## Supabase 配置

```env
NEXT_PUBLIC_SUPABASE_URL=https://dryaygjhohukvpipmkea.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_uDJOb1yvob-M358jBFn_Mw_XIgjS9Io
```

**注意：** 測試 key 24小時後會失效，請在 Supabase 控制台獲取新的 key

## Gemini AI 配置

```env
GEMINI_API_KEY=AIzaSyBiIRqkccrlnE9fMNlhG4LsxHd4e0QCkJY
```

## 完整 .env.local 示例

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dryaygjhohukvpipmkea.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_uDJOb1yvob-M358jBFn_Mw_XIgjS9Io

# Gemini AI
GEMINI_API_KEY=AIzaSyBiIRqkccrlnE9fMNlhG4LsxHd4e0QCkJY

# Database (if needed)
DATABASE_URL=postgresql://user:password@localhost:5432/cyberpunk_db

# Authentication (if needed)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## 獲取新的 API Keys

### Supabase
1. 登錄 https://supabase.com
2. 選擇你的項目
3. 進入 Settings > API
4. 複製 URL 和 anon/public key

### Gemini AI
1. 訪問 https://makersuite.google.com/app/apikey
2. 創建新的 API key
3. 複製 key 到環境變量

## 安全提示

- ⚠️ **永遠不要** 將 `.env.local` 提交到 Git
- ⚠️ 在生產環境中使用環境變量管理工具
- ⚠️ 定期輪換 API keys
- ⚠️ 使用不同的 keys 用於開發和生產環境
