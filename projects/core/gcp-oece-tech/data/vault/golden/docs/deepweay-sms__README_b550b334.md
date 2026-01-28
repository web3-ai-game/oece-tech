# 🌍 地球 Online - 神算子功德系統 | Earth Online - Merit Oracle System

> **一個基於 Notion 知識庫、Gemini 諸葛亮軍團和 AI 蒸餾技術的虛擬功德計算平台**  
> A Virtual Merit Calculation Platform based on Notion Knowledge Base, Gemini Zhuge Legion, and AI Distillation Technology

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/web3-ai-game/deepweay-sms)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Notion](https://img.shields.io/badge/Notion-Integration-black.svg)](https://www.notion.so)
[![Gemini](https://img.shields.io/badge/Gemini-Powered-orange.svg)](https://ai.google.dev)

---

## 📖 項目簡介 | Project Overview

### 🇨🇳 中文簡介

**地球 Online** 是一個創新的功德計算與知識蒸餾系統，融合了：

- 🧠 **諸葛亮軍團** - 基於 Gemini 免費層的 AI 智能體集群
- 📝 **Notion 知識庫** - 結構化的智慧數據存儲
- ⚡ **低成本 AI 蒸餾** - Windsurf + Gemini 混合架構
- 🎯 **功德積分系統** - 佛法無量收費機制（玄學版）
- 🌐 **Google Cloud Run** - 零成本部署方案

**核心理念**：用最少的錢，榨乾最多的 AI 算力，構建一個能自我進化的知識宇宙。

### 🌍 English Overview

**Earth Online** is an innovative merit calculation and knowledge distillation system that combines:

- 🧠 **Zhuge Legion** - AI agent cluster based on Gemini free tier
- 📝 **Notion Knowledge Base** - Structured wisdom data storage
- ⚡ **Low-Cost AI Distillation** - Windsurf + Gemini hybrid architecture
- 🎯 **Merit Points System** - Buddhist-inspired payment mechanism
- 🌐 **Google Cloud Run** - Zero-cost deployment solution

**Core Philosophy**: Maximize AI computational power with minimal cost, building a self-evolving knowledge universe.

---

## 🚀 快速開始 | Quick Start

### 前置需求 | Prerequisites

```bash
# 必需工具 | Required Tools
- Node.js >= 18
- npm >= 9
- Git
- VS Code (推薦 | Recommended)

# 推薦工具 | Recommended Tools
- Windsurf IDE
- GitHub Copilot
- Notion Desktop App
```

### 安裝步驟 | Installation Steps

```bash
# 1. 克隆倉庫 | Clone Repository
git clone https://github.com/web3-ai-game/deepweay-sms.git
cd deepweay-sms

# 2. 載入環境變量 | Load Environment Variables
source ~/.env.vps

# 3. 安裝依賴 | Install Dependencies
npm install

# 4. 驗證配置 | Verify Configuration
./scripts/verify_setup.sh

# 5. 啟動開發服務器 | Start Development Server
npm run dev
```

---

## 📚 文檔結構 | Documentation Structure

### 中文文檔 (給人看) | Chinese Docs (For Humans)

- [📋 項目介紹](./項目介紹.md) - 完整的項目說明
- [🏗️ 架構設計](./docs/zh/架構設計.md) - 系統架構詳解
- [🧠 諸葛亮軍團系統](./docs/zh/諸葛亮軍團系統.md) - AI 集群設計
- [⚡ Gemini 免費層榨取策略](./docs/zh/Gemini免費層榨取策略.md) - 成本優化方案
- [🎯 功德系統設計](./docs/zh/功德系統設計.md) - 玄學計費機制
- [👨‍💻 開發指南](./docs/zh/開發指南.md) - 開發者手冊

### English Docs (For AI) | 英文文檔 (給 AI 看)

- [📋 PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Complete project description
- [🏗️ ARCHITECTURE.md](./docs/en/ARCHITECTURE.md) - System architecture details
- [🧠 ZHUGE_LEGION_SYSTEM.md](./docs/en/ZHUGE_LEGION_SYSTEM.md) - AI cluster design
- [⚡ GEMINI_STRATEGY.md](./docs/en/GEMINI_STRATEGY.md) - Cost optimization strategy
- [🎯 MERIT_SYSTEM.md](./docs/en/MERIT_SYSTEM.md) - Merit calculation mechanism
- [👨‍💻 DEV_GUIDE.md](./docs/en/DEV_GUIDE.md) - Developer manual

---

## 🛠️ 核心技術棧 | Tech Stack

### 前端 | Frontend
- **框架**: Next.js 14 + React 18
- **UI**: Tailwind CSS + shadcn/ui
- **狀態管理**: Zustand + React Query

### 後端 | Backend
- **運行時**: Node.js 22
- **部署**: Google Cloud Run
- **數據庫**: 
  - Supabase (PostgreSQL)
  - Upstash Redis
  - MongoDB Atlas

### AI & 知識管理 | AI & Knowledge Management
- **主 AI**: Gemini 2.0 Flash (免費層)
- **備用 AI**: OpenRouter (Claude, GPT-4)
- **知識庫**: Notion API
- **向量存儲**: Context7 (Upstash)

### 開發工具 | Development Tools
- **IDE**: Windsurf + VS Code
- **AI 助手**: GitHub Copilot + MCP
- **版本控制**: Git + GitHub
- **環境管理**: Doppler

---

## 🎯 核心功能 | Core Features

### 1. 諸葛亮軍團 (Zhuge Legion)

基於 Gemini 免費 API 的多智能體系統：

```typescript
interface ZhugeLegion {
  // 免費配額管理
  quotaManager: QuotaManager;
  
  // 智能體角色
  agents: {
    strategist: Agent;  // 策略師
    analyzer: Agent;    // 分析師
    writer: Agent;      // 寫作者
    reviewer: Agent;    // 審核者
  };
  
  // 任務調度
  taskScheduler: Scheduler;
}
```

### 2. 功德積分系統 (Merit System)

玄學化的成本計算機制：

- **功德獲取**: 通過貢獻知識、完成任務獲得
- **功德消耗**: 調用 AI、使用資源扣除
- **功德轉換**: 與實際貨幣掛鉤的匯率系統

### 3. 知識蒸餾引擎 (Knowledge Distillation)

將大模型知識壓縮到小模型：

```bash
# 蒸餾流程
1. 使用 Gemini 生成高質量內容
2. 通過 Windsurf 本地編輯優化
3. 存儲到 Notion 知識庫
4. Context7 向量化索引
5. 下次直接從緩存調用
```

---

## 💰 成本分析 | Cost Analysis

### 月度成本估算 | Monthly Cost Estimate

| 服務 | 免費額度 | 超額成本 | 預估使用 |
|------|---------|---------|---------|
| Gemini API | 1500 req/day | $0 | 100% 免費層 |
| Google Cloud Run | 2M req/month | $0.40/M | $0 (免費內) |
| Supabase | 500MB 數據庫 | $25/month | $0 (免費內) |
| Upstash Redis | 10K命令/天 | $0.20/100K | $0 (免費內) |
| MongoDB Atlas | 512MB | $0 | $0 (免費內) |
| Notion API | 無限制 | $0 | $0 |
| **總計** | - | - | **$0/月** ✨ |

---

## 📊 項目狀態 | Project Status

- ✅ 環境配置完成 (2025-11-26)
- ✅ MCP 服務器部署
- ✅ Notion 數據提取 (129個頁面)
- ✅ 密鑰驗證系統
- 🚧 文檔體系構建中
- 📋 核心功能開發計劃中

---

## 🤝 貢獻指南 | Contributing

歡迎貢獻代碼、文檔或創意！

```bash
# 1. Fork 項目
# 2. 創建特性分支
git checkout -b feature/amazing-feature

# 3. 提交更改
git commit -m "Add amazing feature"

# 4. 推送到分支
git push origin feature/amazing-feature

# 5. 創建 Pull Request
```

---

## 📜 許可證 | License

MIT License - 詳見 [LICENSE](LICENSE) 文件

---

## 🙏 致謝 | Acknowledgments

- **Google Gemini** - 提供免費的 AI 算力
- **Notion** - 優秀的知識管理平台
- **Upstash** - 免費的 Redis 服務
- **Supabase** - 開源的後端即服務
- **所有開源貢獻者** - 感謝你們的無私奉獻

---

## 📞 聯繫方式 | Contact

- **項目主頁**: [GitHub](https://github.com/web3-ai-game/deepweay-sms)
- **文檔站點**: [Notion](https://www.notion.so/deepweay)
- **問題反饋**: [Issues](https://github.com/web3-ai-game/deepweay-sms/issues)

---

<div align="center">

**🌍 地球 Online - 讓 AI 為功德服務**

Made with ❤️ by DeepWeay Team

[![Star](https://img.shields.io/github/stars/web3-ai-game/deepweay-sms?style=social)](https://github.com/web3-ai-game/deepweay-sms)
[![Follow](https://img.shields.io/github/followers/web3-ai-game?style=social)](https://github.com/web3-ai-game)

</div>
