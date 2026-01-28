# 📁 GCP 項目根目錄結構優化方案

## 🎯 當前狀態分析
根目錄混亂，包含多個子項目、文檔、腳本，不利於 Windsurf 接手開發。

## 🔧 優化後的目錄結構

```
/home/svs-main-key/GCP/
├── 📂 core/                          # 核心服務
│   ├── server.js                     # 主API服務器
│   ├── dual-chat-jet-system.js      # 雙群聊噴射系統
│   ├── vector-jet-engine.js         # 向量噴射引擎
│   └── config/
│       ├── ecosystem.dual-jet.json  # PM2配置
│       └── env.template              # 環境變量模板
│
├── 📂 scripts/                       # 自動化腳本
│   ├── setup/
│   │   ├── setup_projects.sh
│   │   ├── deploy-env.sh
│   │   └── startup.sh
│   ├── monitoring/
│   │   ├── monitor.sh
│   │   ├── status.sh
│   │   └── check_mcp.sh
│   ├── keys/
│   │   ├── verify_all_keys.sh
│   │   └── test_all_gemini_keys.js
│   └── utils/
│       ├── aliases.sh
│       └── extract_notion_data.sh
│
├── 📂 docs/                          # 文檔中心
│   ├── README.md                     # 主文檔
│   ├── guides/
│   │   ├── AI_CLI_玩法手冊.md
│   │   ├── Windsurf快速启动指南.md
│   │   ├── WINDSURF_COMMAND_BLOCKS.md
│   │   └── 多普勒密钥管理手册.md
│   ├── reports/
│   │   ├── DEPLOYMENT_SUMMARY.md
│   │   ├── GEMINI_TEST_REPORT.md
│   │   ├── key_verification_report.txt
│   │   └── compare_tiers.md
│   ├── architecture/
│   │   ├── Go并发向量调用架构.md
│   │   └── KEY_調用策略_速率優先版.md
│   └── status/
│       ├── DEPLOYMENT_COMPLETE.md
│       ├── MCP_SETUP_COMPLETE.md
│       └── CRITICAL_FIXES.md
│
├── 📂 projects/                      # 子項目集合
│   ├── deepweay-sms/
│   ├── deepweay-digital-gold-vault/
│   ├── notion-sms/
│   ├── sms-digital-assets-ultra/
│   ├── sms-key/
│   ├── gcp-sms-deployment/
│   ├── tg-trash-bot/
│   └── web/
│
├── 📂 logs/                          # 日誌目錄
│   ├── dual-jet-out.log
│   ├── dual-jet-error.log
│   ├── api-out.log
│   ├── cron-dual-jet.log
│   └── monitor.log
│
├── 📂 config/                        # 配置文件
│   ├── .env.vector-jet
│   ├── .cli-env
│   ├── ecosystem.config.json
│   └── crontab-dual-jet.txt
│
├── 📂 tools/                         # 工具腳本
│   ├── 全能人格生成器.js
│   └── monitor-panel.js
│
├── 📄 package.json                   # Node依賴
├── 📄 Dockerfile                     # Docker配置
├── 📄 .gitignore                     # Git忽略
└── 📄 README.md                      # 項目總覽

## 🚀 遷移步驟

### 步驟1: 創建新目錄結構
```bash
mkdir -p core/config
mkdir -p scripts/{setup,monitoring,keys,utils}
mkdir -p docs/{guides,reports,architecture,status}
mkdir -p projects
mkdir -p config
mkdir -p tools
```

### 步驟2: 移動核心文件
```bash
# 核心服務
mv server.js core/
mv dual-chat-jet-system.js core/
mv ecosystem.dual-jet.json core/config/

# 配置文件
mv .env.vector-jet config/
mv .cli-env config/
mv ecosystem.config.json config/
mv crontab-dual-jet.txt config/
```

### 步驟3: 整理腳本
```bash
# 設置腳本
mv setup_projects.sh scripts/setup/
mv deploy-env.sh scripts/setup/
mv startup.sh scripts/setup/
mv shutdown.sh scripts/setup/
mv start-dev.sh scripts/setup/
mv stop-dev.sh scripts/setup/

# 監控腳本
mv monitor.sh scripts/monitoring/
mv status.sh scripts/monitoring/
mv check_mcp.sh scripts/monitoring/

# Key管理
mv verify_all_keys.sh scripts/keys/
mv test_all_gemini_keys.js scripts/keys/

# 工具
mv aliases.sh scripts/utils/
mv extract_notion_data.sh scripts/utils/
```

### 步驟4: 整理文檔
```bash
# 指南
mv AI_CLI_玩法手冊.md docs/guides/
mv Windsurf快速启动指南.md docs/guides/
mv WINDSURF_COMMAND_BLOCKS.md docs/guides/
mv 多普勒密钥管理手册.md docs/guides/

# 報告
mv DEPLOYMENT_SUMMARY.md docs/reports/
mv GEMINI_TEST_REPORT.md docs/reports/
mv key_verification_report.txt docs/reports/
mv key_report_summary.txt docs/reports/
mv compare_tiers.md docs/reports/

# 架構
mv Go并发向量调用架构.md docs/architecture/
mv KEY_調用策略_速率優先版.md docs/architecture/

# 狀態
mv DEPLOYMENT_COMPLETE.md docs/status/
mv MCP_SETUP_COMPLETE.md docs/status/
mv CRITICAL_FIXES.md docs/status/
```

### 步驟5: 移動子項目
```bash
# 子項目（如果不在projects目錄）
for proj in deepweay-sms deepweay-digital-gold-vault notion-sms \
            sms-digital-assets-ultra sms-key gcp-sms-deployment \
            tg-trash-bot web; do
  [ -d "$proj" ] && [ ! -d "projects/$proj" ] && mv "$proj" projects/
done
```

### 步驟6: 移動工具
```bash
mv 全能人格生成器.js tools/
mv monitor-panel.js tools/
```

## 📝 Windsurf 工作區配置

創建 `.vscode/settings.json`:
```json
{
  "files.exclude": {
    "**/node_modules": true,
    "**/logs/*.log": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/logs": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/logs/**": true
  }
}
```

## 🎯 優化效果

1. **清晰的目錄結構**: 功能分類明確
2. **易於維護**: 文件歸類整齊
3. **Windsurf友好**: 減少雜訊，提高開發效率
4. **擴展性強**: 新功能容易添加
5. **文檔集中**: 方便查閱和維護

## 🔄 更新後續步驟

1. 更新所有腳本中的路徑引用
2. 更新 PM2 配置文件中的路徑
3. 更新文檔中的路徑說明
4. 測試所有服務是否正常運行
5. 更新 Git 倉庫 README

## ⚠️ 注意事項

- 移動前先備份
- 逐步移動並測試
- 更新環境變量路徑
- 檢查符號鏈接
- 驗證所有服務能正常啟動
