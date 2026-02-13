---
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 工具優先級與配置指南

### 4.1 優先級規則
優先級：Memory > Sequential Thinking > Notion。背景：確保 AI 先處理記憶與推理，再查詢外部。原理：層級決策樹減少無效呼叫。實例：在查詢任務中，先檢查記憶，若無則推理，最後查 Notion。

| 優先級 | 工具 | 觸發條件 | 示例場景 |
|--------|------|----------|----------|
| 1 | Memory MCP | 上下文相關 | 回顧先前對話 |
| 2 | Sequential Thinking | 複雜推理 | 解決邏輯問題 |
| 3 | Notion MCP | 知識檢索 | 查詢外部資料 |

### 4.2 配置步驟
Windsurf UI 中的具體配置。背景：UI 提供圖形介面簡化設置。原理：步驟式指南確保一致性。實例：步驟1：登入 UI；步驟2：注入 Token；步驟3：測試工具。

#### 4.21 代碼範例：配置腳本
```bash
# 範例5: Bash 腳本配置 Windsurf UI
echo "Setting up Notion MCP..."
export NOTION_API_KEY=$(doppler secrets get NOTION_API_KEY)
node setup.js  # 運行配置
# 註釋: 使用 Doppler 注入 Token，自動化 UI 配置。
```

```yaml
# 範例6: YAML 配置檔案
services:
  notion:
    key: ${NOTION_API_KEY}
    priority: 3
# 註釋: YAML 格式確保配置可讀性與可移植性。
```

### 4.3 Doppler 在配置中的應用
推薦 Doppler 管理變量。背景：Doppler 為雲端密鑰管理工具。原理：跨環境同步，確保一致。實例：在多團隊項目中，Doppler 簡化共享配置。
