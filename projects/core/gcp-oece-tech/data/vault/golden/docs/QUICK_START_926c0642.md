# 🎯 DeepWeay SMS - 快速操作手冊

> **最後更新**: 2025-11-26  
> **項目狀態**: ✅ 準備開發階段完成，進入 Notion 數據清洗階段

---

## 📋 目錄

1. [項目概覽](#項目概覽)
2. [快速開始](#快速開始)
3. [API Key 管理](#api-key-管理)
4. [Notion 數據處理](#notion-數據處理)
5. [開發工作流](#開發工作流)
6. [部署指南](#部署指南)
7. [故障排查](#故障排查)

---

## 🎯 項目概覽

**DeepWeay SMS** 是一個基於 Notion 知識庫的"地球 Online 神算子功德系統"，使用 Gemini 免費層 + 諸葛亮軍團架構實現低成本 AI 應用。

### 核心特性

- 🧠 **Notion 驅動**: 所有文檔和知識從 Notion 自動同步
- ⚡ **Gemini 諸葛亮軍團**: 多輪對話蒸餾，極限榨取免費 API
- 🌍 **記憶向量宇宙**: Context7 + Upstash Redis 長期記憶
- 🔄 **三溫處理流程**: 低溫提取 → 高溫擴展 → 精準裁切
- 🚀 **異步任務系統**: 並發控制 + 自動重試 + 進度追蹤

### 技術棧

```yaml
運行環境: GCP VM (asia-southeast1-b)
操作系統: Linux (Ubuntu)
Runtime: Node.js v22.21.0
包管理器: npm 10.9.4

核心服務:
  - Notion API (知識庫)
  - Gemini API (AI 處理)
  - OpenRouter (備用 AI)
  - Supabase (數據存儲)
  - MongoDB (文檔數據庫)
  - Redis (緩存 + 向量)
  
開發工具:
  - GitHub Copilot CLI Agent (Claude Sonnet 4.5)
  - Doppler (密鑰管理)
  - MCP (Model Context Protocol)
```

---

## 🚀 快速開始

### 1. SSH 連接到 VPS

```bash
# 從本地連接
ssh svs-main-key@<GCP_EXTERNAL_IP>

# 或使用 gcloud CLI
gcloud compute ssh instance-20251123-140442 --zone=asia-southeast1-b
```

### 2. 切換到項目目錄

```bash
# 使用快捷命令
dw

# 或完整路徑
cd /home/svs-main-key/deepweay-sms
```

### 3. 檢查環境狀態

```bash
# 查看環境變量狀態
env_status

# 查看 Git 狀態
gs

# 查看 MCP 配置
cat ~/check_mcp.sh && bash ~/check_mcp.sh
```

### 4. 拉取最新代碼

```bash
# 使用快捷命令
gp

# 或完整命令
git pull origin main
```

---

## 🔐 API Key 管理

### 查看所有密鑰

```bash
# 驗證所有 API Key
bash ~/verify_all_keys.sh

# 查看簡短報告
cat ~/key_report_summary.txt
```

### 更新密鑰（使用 Doppler）

```bash
# 切換到 sms-key 項目
cdkey

# 更新單個密鑰
doppler secrets set KEY_NAME="new_value" --project sms --config prod

# 批量更新
doppler secrets set \
  NOTION_TOKEN="ntn_xxx" \
  GEMINI_API_KEY="AIzaSy_xxx" \
  --project sms --config prod

# 拉取最新密鑰到本地
doppler secrets download --no-file --format env > .env.doppler
```

### 獲取新 Token

參考完整手冊：

- **Notion Token**: [`docs/zh/獲取Notion-Token手冊.md`](./docs/zh/獲取Notion-Token手冊.md)
- **Slack Token**: [`docs/zh/獲取Slack-Token手冊.md`](./docs/zh/獲取Slack-Token手冊.md)

---

## 📚 Notion 數據處理

### 異步全量下載

```bash
# 基礎下載（並發5，跳過緩存）
node scripts/async_notion_harvester.js

# 高並發下載（推薦）
node scripts/async_notion_harvester.js --concurrency=8 --retry=3

# 完整模式（包括子頁面）
node scripts/async_notion_harvester.js --full

# 強制重新下載（忽略緩存）
node scripts/async_notion_harvester.js --skip-cache
```

**下載結果**：

```
notion_export/
  ├── page_list.json           # 頁面列表（30個）
  ├── harvest_report.json      # 下載報告
  └── pages/                   # 所有頁面內容
      ├── 2b791acc-xxx.json   # 地球Online架構
      ├── 187576b9-xxx.json   # Gemini榨取策略
      └── ...                  # 其他28個頁面
```

### 轉換為 Markdown

```bash
# 將 JSON 轉換為 Markdown 文檔
node scripts/convert_notion_to_md.js

# 查看生成的文檔
ls -lh docs/zh/
ls -lh docs/en/
```

**生成文檔**：

```
docs/
  ├── zh/                      # 中文文檔（人類閱讀）
  │   ├── 01-架構設計.md
  │   ├── 02-戰鬥包配置.md
  │   ├── 03-Gemini榨取策略.md
  │   └── ...
  └── en/                      # 英文文檔（AI 閱讀）
      ├── 01-architecture.md
      ├── 02-battle-pack.md
      └── ...
```

---

## 🛠️ 開發工作流

### 三溫處理流程

#### 🌡️ 階段一：低溫思考（Temperature 0.2-0.3）

**目標**: 精確提取核心內容，去除噪音

```bash
# 使用 Gemini Flash 低溫模式
export GEMINI_TEMPERATURE=0.3

# 運行清洗腳本（待創建）
node scripts/clean_notion_data.js --mode=cold
```

**輸出**：
- 結構化的核心概念
- 技術要點列表
- 關鍵配置參數

#### 🔥 階段二：高溫想像（Temperature 0.8-0.9）

**目標**: 創意擴展，補充實戰案例

```bash
# 使用 Gemini Pro 高溫模式
export GEMINI_TEMPERATURE=0.9

# 運行擴展腳本（待創建）
node scripts/expand_content.js --mode=hot
```

**輸出**：
- 實戰案例
- 最佳實踐
- 架構圖
- 代碼示例

#### ❄️ 階段三：精準裁切（Temperature 0.1-0.2）

**目標**: 去除飄移，確保技術準確性

```bash
# 使用 Claude Sonnet 精準模式
export CLAUDE_TEMPERATURE=0.1

# 運行修正腳本（待創建）
node scripts/finalize_docs.js --mode=precise
```

**輸出**：
- 最終 Markdown 文檔
- API 文檔
- 開發指南

### 日常開發循環

```bash
# 1. 更新 Notion 內容（在 Notion 網頁端）

# 2. 同步到本地
node scripts/async_notion_harvester.js --concurrency=8

# 3. 轉換為文檔
node scripts/convert_notion_to_md.js

# 4. 運行三溫處理
node scripts/process_pipeline.js  # 待創建

# 5. 查看結果
cat docs/zh/01-架構設計.md

# 6. 提交更新
git add docs/
git commit -m "docs: 更新架構文檔 - $(date +%Y-%m-%d)"
git push origin main
```

---

## 🚀 部署指南

### 本地測試

```bash
# 安裝依賴（如果有 package.json）
npm install

# 運行測試
npm test

# 本地啟動（如果有服務）
npm start
```

### 部署到 GCP

```bash
# 使用 sms-key 項目的部署腳本
cdkey
bash deploy_to_gcp.sh

# 或使用 GitHub Actions（自動部署）
git push origin main  # 觸發 CI/CD
```

### Docker 部署（未來）

```bash
# 構建鏡像
docker build -t deepweay-sms:latest .

# 運行容器
docker run -d \
  --name deepweay-sms \
  --env-file .env.vps \
  -p 3000:3000 \
  deepweay-sms:latest
```

---

## ⚙️ VSCode 配置

### 推薦插件

已在 `.vscode/extensions.json` 中配置，打開項目時會自動提示安裝：

- **Remote-SSH**: 遠程開發必備
- **GitLens**: Git 增強
- **Markdown All in One**: Markdown 支持
- **Docker**: 容器管理
- **Notion**: Notion 集成
- **Thunder Client**: API 測試

### 快捷鍵

```
Ctrl+Shift+P    # 命令面板
Ctrl+`          # 打開終端
Ctrl+B          # 切換側邊欄
Ctrl+P          # 快速打開文件
Ctrl+Shift+F    # 全局搜索
```

---

## 🔧 故障排查

### Notion API 問題

#### 錯誤：`invalid_auth`

```bash
# 檢查 Token 格式
echo $NOTION_TOKEN | grep '^ntn_'

# 重新獲取 Token
# 參考：docs/zh/獲取Notion-Token手冊.md

# 更新 Token
doppler secrets set NOTION_TOKEN="ntn_xxx" --project sms --config prod
source ~/.env.vps
```

#### 錯誤：`object_not_found`

```bash
# 檢查頁面是否授權給 Integration
# 1. 打開 Notion 頁面
# 2. 點擊右上角 "···"
# 3. 查看 Connections → 添加你的 integration
```

### Git 問題

#### 推送失敗

```bash
# 檢查遠程連接
git remote -v

# 拉取最新代碼
git pull --rebase origin main

# 解決衝突後推送
git push origin main
```

#### 合併衝突

```bash
# 查看衝突文件
git status

# 編輯衝突文件，移除衝突標記
nano <conflict-file>

# 標記為已解決
git add <conflict-file>
git commit -m "fix: resolve merge conflict"
```

### 環境變量問題

```bash
# 重新加載環境
source ~/.bashrc
source ~/.env.vps

# 驗證加載
env | grep NOTION
env | grep GEMINI

# 如果沒有，手動從 Doppler 拉取
cd ~/sms-key
doppler run -- env
```

---

## 📞 常用命令速查

```bash
# === 目錄切換 ===
dw          # 切換到 deepweay-sms
cdkey       # 切換到 sms-key
sms         # 等同於 cdkey

# === Git 操作 ===
gs          # git status
gp          # git pull
gl          # git log --oneline -10

# === 環境管理 ===
env_status  # 查看環境變量狀態
source ~/.env.vps  # 重新加載環境

# === Notion 操作 ===
node scripts/async_notion_harvester.js --concurrency=8  # 下載
node scripts/convert_notion_to_md.js  # 轉換

# === 驗證 ===
bash ~/verify_all_keys.sh  # 驗證所有密鑰
bash ~/check_mcp.sh  # 檢查 MCP 配置
```

---

## 📚 相關文檔

- [Notion Token 獲取手冊](./docs/zh/獲取Notion-Token手冊.md)
- [Slack Token 獲取手冊](./docs/zh/獲取Slack-Token手冊.md)
- [架構設計文檔](./docs/zh/01-架構設計.md)
- [Gemini 榨取策略](./docs/zh/03-Gemini榨取策略.md)
- [諸葛亮軍團系統](./docs/zh/04-諸葛亮軍團.md)

---

## 🎓 學習資源

### 官方文檔

- [Notion API](https://developers.notion.com/)
- [Gemini API](https://ai.google.dev/docs)
- [OpenRouter](https://openrouter.ai/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### 項目特定

- [sms-key README](../sms-key/README.md)
- [MCP 配置指南](../MCP_SETUP_COMPLETE.md)
- [環境配置腳本](../setup_projects.sh)

---

## 💡 最佳實踐

### 1. 定期同步 Notion

```bash
# 每天運行一次
0 9 * * * cd ~/deepweay-sms && node scripts/async_notion_harvester.js
```

### 2. 版本控制

```bash
# 提交前先拉取
git pull origin main

# 寫清楚 commit message
git commit -m "feat: 新增功能描述"
git commit -m "fix: 修復問題描述"
git commit -m "docs: 更新文檔"
```

### 3. 密鑰安全

```bash
# 永遠不要提交密鑰到 Git
git rm --cached .env
echo ".env*" >> .gitignore

# 使用 Doppler 管理
doppler secrets set KEY="value"
```

### 4. GCP 成本優化

```bash
# 不用時關閉機器
gcloud compute instances stop instance-20251123-140442 --zone=asia-southeast1-b

# 啟動機器
gcloud compute instances start instance-20251123-140442 --zone=asia-southeast1-b
```

---

**維護者**: DeepWeay SMS Team  
**最後更新**: 2025-11-26  
**版本**: v2.0

