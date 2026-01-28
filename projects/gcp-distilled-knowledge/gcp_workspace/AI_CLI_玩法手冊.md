# 🎮 AI CLI 玩法手冊 - 駕駛艙完全指南

> **更新時間**: 2025-11-26  
> **目標**: 左側面板最大化利用，多 AI CLI 並發協作

---

## 📊 當前可用的 AI CLI 工具

### 1️⃣ **Kilo Code CLI** - 多模型編排大師

```bash
# 安裝
npm install -g @kilocode/cli

# 啟動（自動讀取環境變量）
export TELEGRAM_BOT_SVSKILO_TOKEN="8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg"
kilocode

# 啟動指定模式
kilocode --mode architect      # 架構模式
kilocode --mode debug          # 調試模式
kilocode --mode orchestrator   # 編排模式

# 自動模式（非交互）
kilocode --auto "修復所有 TypeScript 錯誤"
echo "優化這個文件" | kilocode --auto

# 並發模式（多個實例同時工作）
kilocode --parallel "改進 xyz 功能"
kilocode --parallel --auto "改進 abc 功能"
```

**核心命令**:
- `/mode` - 切換模式（architect, code, debug, ask, orchestrator）
- `/model` - 切換模型
- `/model list` - 列出所有可用模型
- `/new` - 新建任務
- `/config` - 配置編輯器
- `/exit` - 退出

---

### 2️⃣ **GitHub Copilot CLI** - 已配置

```bash
# 當前已激活，使用 Claude Sonnet 4.5
# MCP 服務器：9個（Notion, Context7, Git, etc.）

# 快速使用
# 在 VS Code 中已自動激活
```

---

### 3️⃣ **Claude Code** - 直接調用

```bash
# 通過 API 調用（需要設置）
export ANTHROPIC_API_KEY="從 Doppler 獲取"
# 或使用 OpenRouter
export OPENROUTER_API_KEY="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"
```

---

### 4️⃣ **Gemini CLI** - 免費層終極榨取

```bash
# Gemini API Key
export GEMINI_API_KEY="AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ"

# 使用 curl 直接調用
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "你的提示詞"
      }]
    }],
    "generationConfig": {
      "temperature": 0.3
    }
  }'
```

---

## 🎯 左側面板高效利用方案

### 佈局策略：三屏並發

```
┌────────────────────────────────────────────────────────────┐
│ 頂部：GitHub Copilot Chat (主駕駛)                         │
├──────────────────┬──────────────────┬──────────────────────┤
│ 左上：Kilo Code  │ 中間：編輯器      │ 右側：文檔/預覽       │
│ (架構師模式)      │ (實時編輯)        │ (Markdown/瀏覽器)    │
├──────────────────┼──────────────────┼──────────────────────┤
│ 左下：Gemini CLI │ 底部：終端組      │                      │
│ (快速驗證)        │ (3個終端並發)     │                      │
└──────────────────┴──────────────────┴──────────────────────┘
```

### 實戰工作流

#### 📝 **場景 1：文檔生成三溫流程**

```bash
# 終端 1：低溫提取（Gemini Flash 0.3）
export GEMINI_TEMPERATURE=0.3
kilocode --mode ask --auto "從 notion_export/ 提取核心架構，只保留關鍵技術點"

# 終端 2：高溫擴展（Kilo Architect 0.9）
kilocode --mode architect --parallel "基於核心架構，補充實戰案例和最佳實踐"

# 終端 3：精準修正（Claude via Copilot 0.2）
# 在 Copilot Chat 中執行最終修正
```

#### 🐛 **場景 2：調試並發攻擊**

```bash
# 終端 1：Kilo Debug 模式
kilocode --mode debug "找出所有 TypeScript 錯誤"

# 終端 2：Gemini 快速驗證
curl "https://generativelanguage.googleapis.com/..." # 驗證修復邏輯

# 終端 3：運行測試
npm test -- --watch
```

#### 🏗️ **場景 3：架構設計並發**

```bash
# 終端 1：Kilo Orchestrator（總指揮）
kilocode --mode orchestrator --parallel "設計地球 Online 神算子系統架構"

# 終端 2：Gemini 諸葛亮軍團（多輪對話蒸餾）
# 使用低成本快速迭代驗證想法

# 終端 3：實時提交
git add -A && git commit -m "feat: 架構設計迭代" && git push
```

---

## 🔧 Kilo Code 配置最佳實踐

### 配置文件位置

```bash
~/.config/kilocode/config.json
```

### 推薦配置（自動審批）

```json
{
  "autoApproval": {
    "enabled": true,
    "read": {
      "enabled": true,
      "outside": true
    },
    "write": {
      "enabled": true,
      "outside": false,
      "protected": false
    },
    "execute": {
      "enabled": true,
      "allowed": [
        "npm",
        "git",
        "node",
        "doppler",
        "bash",
        "cat",
        "ls",
        "cd"
      ],
      "denied": [
        "rm -rf",
        "sudo rm",
        "dd"
      ]
    },
    "mcp": {
      "enabled": true
    },
    "mode": {
      "enabled": true
    },
    "subtasks": {
      "enabled": true
    }
  }
}
```

### 運行配置

```bash
# 打開配置編輯器
kilocode config

# 或直接編輯
nano ~/.config/kilocode/config.json
```

---

## 🚀 高級玩法

### 1. **並發模式 - 多任務同時進行**

```bash
# 開 4 個終端
# Terminal 1
kilocode --parallel --auto "優化 Notion 下載腳本性能"

# Terminal 2  
kilocode --parallel --auto "生成所有 API 文檔"

# Terminal 3
kilocode --parallel --auto "重構 async_notion_harvester.js"

# Terminal 4
git status  # 實時監控變更
```

### 2. **管道模式 - 批量處理**

```bash
# 批量處理所有 Markdown 文件
find docs/zh -name "*.md" | while read file; do
  echo "優化 $file 的格式和內容" | kilocode --auto
done
```

### 3. **CI/CD 集成 - GitHub Actions**

```yaml
# .github/workflows/kilo-review.yml
name: Kilo Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install -g @kilocode/cli
      - run: |
          echo "Review this PR and suggest improvements" | kilocode --auto --timeout 300
```

---

## 📊 模型選擇策略

### Kilo Code 支持的模型類型

```bash
# 查看所有可用模型
klocode
> /model list

# 選擇模型
> /model select

# 獲取模型信息
> /model info claude-sonnet-4
```

### 成本優化策略

| 任務類型 | 推薦模型 | 溫度 | 原因 |
|---------|---------|------|------|
| 提取核心內容 | Gemini Flash | 0.2-0.3 | 免費 + 精準 |
| 創意擴展 | Claude Sonnet | 0.8-0.9 | 創意強 |
| 代碼生成 | Kilo (default) | 0.5 | 平衡 |
| 調試 | Gemini Pro | 0.3 | 快速便宜 |
| 架構設計 | Claude Opus | 0.7 | 深度思考 |

---

## 🎨 VS Code 左側面板優化

### 插件配置（已添加到 .vscode/extensions.json）

```json
{
  "recommendations": [
    "kilocode.kilo-code",           // Kilo Code 插件
    "github.copilot",               // GitHub Copilot
    "github.copilot-chat",          // Copilot Chat
    "ms-vscode-remote.remote-ssh",  // 遠程 SSH
    "eamodio.gitlens"               // Git 增強
  ]
}
```

### 快捷鍵設置

```json
// .vscode/keybindings.json
[
  {
    "key": "ctrl+shift+k",
    "command": "kilocode.startSession",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+g",
    "command": "github.copilot.generate",
    "when": "editorTextFocus"
  }
]
```

---

## 🔐 環境變量配置

### 創建 CLI 專用環境文件

```bash
# ~/.cli-env
export TELEGRAM_BOT_SVSKILO_TOKEN="8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg"
export GEMINI_API_KEY="AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ"
export OPENROUTER_API_KEY="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"
export NOTION_TOKEN="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"
```

### 自動加載

```bash
# 添加到 ~/.bashrc
if [ -f ~/.cli-env ]; then
    source ~/.cli-env
fi
```

---

## 📝 實戰案例

### 案例 1：Notion 數據清洗流水線

```bash
# 1. 提取（低溫 0.3）
kilocode --mode ask --auto "分析 notion_export/pages/*.json，提取核心架構概念，輸出到 extracted_concepts.json"

# 2. 擴展（高溫 0.9）
kilocode --mode architect --auto "基於 extracted_concepts.json，生成完整的架構文檔，包含實戰案例"

# 3. 修正（低溫 0.2）
kilocode --mode code --auto "檢查並修正所有技術細節，確保準確性"
```

### 案例 2：多語言文檔生成

```bash
# 中文文檔
kilocode --auto "將 docs/zh/*.md 翻譯為英文，保存到 docs/en/"

# 同時生成 API 文檔
kilocode --parallel --auto "基於 scripts/*.js 生成 API 文檔到 docs/api/"
```

---

## 🎯 任務列表集成

### 通過 Kilo 自動管理 TODO

```bash
# Kilo 會自動創建和更新任務列表
kilocode --auto "完成以下任務：
1. 清洗 Notion 數據
2. 生成 Markdown 文檔
3. 提交到 Git"

# 查看任務狀態（在 Kilo 交互模式中）
> /todo
```

---

## 🔍 故障排查

### Kilo 無法啟動

```bash
# 檢查安裝
which kilocode

# 重新安裝
npm uninstall -g @kilocode/cli
npm install -g @kilocode/cli

# 檢查配置
kilocode config
```

### 認證失敗

```bash
# 檢查環境變量
echo $TELEGRAM_BOT_SVSKILO_TOKEN

# 重新加載
source ~/.bashrc
source ~/.cli-env
```

### 模型不可用

```bash
# 在 Kilo 中切換模型
> /model select

# 查看可用模型
> /model list
```

---

## 📚 參考資源

- **Kilo AI 官方文檔**: https://kilo.ai/docs/cli
- **GitHub**: https://github.com/Kilo-Org/kilocode
- **Provider 配置**: https://github.com/Kilo-Org/kilocode/blob/main/cli/docs/PROVIDER_CONFIGURATION.md

---

**最後更新**: 2025-11-26  
**維護者**: DeepWeay SMS Team  
**版本**: v1.0
