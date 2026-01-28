# DEEPWEAY-SMS Project Manifest

## Project Overview
- **Name**: Deepweay-SMS (深途系統)
- **Type**: 數字遊民社群平台
- **Tech Stack**: Next.js 14 + Go + Supabase + Gemini AI
- **Status**: Pre-Alpha / MVP Development

## Architecture
### Frontend
- Framework: Next.js 14 (App Router)
- UI: TailwindCSS + Shadcn/UI
- Deployment: Vercel / Cloud Run

### Backend
- Language: Go 1.23+
- Framework: Gin / Fiber
- Deployment: Cloud Run (Serverless)

### Database
- Primary: Supabase (PostgreSQL)
- Secondary: MongoDB Atlas (論壇內容)
- Cache: Upstash Redis

### AI Integration
- Primary: Google Gemini 2.0 Flash (免費)
- Fallback: OpenRouter (Claude/GPT-4)
- Budget: $1000 Gemini 額度 + $1111 OpenRouter

## Current Sprint (Week 1)
### Priority P0 (Must Have)
1. [ ] 設置 Cline 擴展 + Gemini 配置
2. [ ] 創建前端框架 (Next.js + Shadcn)
3. [ ] 實現 Supabase 認證
4. [ ] 部署到 Cloud Run (測試)

### Priority P1 (Should Have)
1. [ ] BBS 論壇基礎功能
2. [ ] 20Q 心理測試遊戲
3. [ ] Telegram Bot 基礎版
