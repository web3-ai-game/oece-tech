# BongBong & Avatar - Dual AI Companion System

> An AI-powered dual-bot system designed for elderly care and family communication
> 專為長者照護與家庭溝通設計的 AI 雙機器人系統

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Telegram](https://img.shields.io/badge/telegram-bot-blue.svg)](https://core.telegram.org/bots)
[![AI](https://img.shields.io/badge/AI-Gemini%20%2B%20Grok-purple.svg)](#tech-stack)
[![Notion Sync](https://img.shields.io/badge/Notion-Sync-black.svg)](#notion-integration)

---

## 🎯 Project Vision | 項目願景

This project explores the intersection of **AI companionship** and **elderly care**:

- 🧠 **Cognitive Support** | 認知支持 - Assist elderly users with memory and daily tasks
- 💬 **Natural Interaction** | 自然互動 - Voice, image, and text multimodal communication
- 🤖 **Dual Personality** | 雙重人格 - Professional AI + Humorous Avatar
- 📊 **Memory System** | 記憶系統 - Cross-conversation context and shared group memory

---

## ✨ Core Features | 核心特性

### 🤖 Dual Bot Architecture | 雙機器人架構

| Bot | Role | Style |
|-----|------|-------|
| **BongBong** | Professional AI Assistant | Knowledgeable, helpful |
| **Avatar** | Digital Persona 數字分身 | Humorous, meme-throwing |

### 🔮 Eye of Truth | 真實之眼

Multi-model cross-verification system:

```text
Question → Gemini Pro (Low Temp 0.3, Rigorous Analysis)
        → Grok Mini (High Temp 1.35, Devil's Advocate)
        → Gemini Flash (Synthesis & Summary)
        → Confidence Score Output
```

### 🎤 Voice Processing | 語音處理

- **Dual Response**: Both bots respond to voice messages
- **Professional + Funny**: BongBong serious, Avatar humorous
- **Transcription Display**: Shows original speech text

### 📸 Image Analysis | 圖片分析

- **Multimodal Recognition**: Gemini 2.5 Flash vision
- **Comprehensive Analysis**: Objects, scenes, text, emotions
- **Meme Detection**: Explains internet memes

### 💾 Smart Memory System | 智能記憶系統

- **Group Shared Memory**: Cross-user context
- **Vector Search**: MongoDB Atlas vector search
- **Auto Memory**: AI-driven content analysis
- **Multi-User Notebooks**: Separate notebooks for each user

### 📔 Notion Integration | Notion 集成

| Feature | Description |
|---------|-------------|
| **30-Message Trigger** | Sync every 30 messages |
| **100-Message Compress** | AI summarize & compress |
| **Full User Messages** | Copy user input verbatim |
| **AI Summary** | Gemini 2.5 Pro summarization |

---

## 🛠️ Tech Stack | 技術棧

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js 20+ |
| **Bot Framework** | node-telegram-bot-api |
| **AI Models** | Gemini 2.5 (Pro/Flash/Lite), Grok 3 Mini |
| **Database** | MongoDB (Vector Search) |
| **Process Manager** | PM2 |
| **Secrets** | Doppler |

---

## 🚀 Quick Start | 快速開始

```bash
# Clone repository
git clone https://github.com/web3-ai-game/sms-agentic-tg-bot.git
cd sms-agentic-tg-bot

# Install dependencies
npm install

# Run with Doppler (recommended)
doppler run -- pm2 start ecosystem.config.cjs
```

### Required Secrets | 必需密鑰

| Secret | Description |
|--------|-------------|
| `TELEGRAM_BOT_TOKEN` | Main bot token |
| `TELEGRAM_BOT_TOKEN_AVATAR` | Avatar bot token |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GROK_API_KEY` | xAI Grok API key |
| `MONGODB_URI` | MongoDB connection string |
| `NOTION_API_KEY` | Notion integration token |

---

## 📁 Project Structure | 項目結構

```text
├── config/
│   ├── index.js          # Main configuration
│   ├── avatar.js         # Avatar persona
│   └── bongbong.js       # BongBong persona
├── src/
│   ├── index.js          # Entry point
│   ├── services/
│   │   ├── dualBotService.js     # Dual bot coordinator
│   │   ├── bongbongService.js    # BongBong AI
│   │   ├── avatarService.js      # Avatar bot
│   │   ├── eyeOfTruthService.js  # Multi-model verification
│   │   ├── notionSyncService.js  # Notion sync
│   │   └── smartRouter.js        # Model routing
│   └── handlers/
│       └── voiceHandlerV2.js     # Voice processing
├── ecosystem.config.cjs  # PM2 configuration
└── package.json
```

---

## 📄 License | 許可證

MIT License - See [LICENSE](LICENSE) for details.

---

## ⚠️ Disclaimer | 免責聲明

This project is for research and educational purposes only.

本項目僅供研究和教育目的。

---

Built with ❤️ for family care and AI research
