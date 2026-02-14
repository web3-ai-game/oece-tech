---
source: knowledge-mixer_repos_infinity_example_README.md
distilled_at: 2026-02-14T09:31:52.161Z
model: grok-4-1-fast-non-reasoning
---

# Infinity SDK 使用指南

## 介紹

Infinity 是一個高效的向量資料庫，提供 Python SDK 和 HTTP API 兩種主要存取方式。本文檔基於提供的示例腳本，詳細說明如何快速上手使用 Infinity SDK 和 HTTP 接口。當前目錄包含完整的 Python SDK 示例和 HTTP SHELL 腳本，讓開發者能夠快速驗證和開發應用程式。

## 先決條件

在使用示例之前，請確保滿足以下條件：

### Python SDK 示例
- 已安裝 Python 3.8 或更高版本
- 安裝正確版本的 Infinity SDK：
  ```bash
  # Infinity 伺服器版本 SDK（適用於遠端伺服器）
  pip install infinity-sdk==0.7.0.dev2
  
  # Infinity 本地嵌入式 SDK（適用於本地部署）
  pip install infinity-embedded-sdk==0.7.0.dev2
  ```

### HTTP 示例
- 安裝 `curl` 工具：
  ```bash
  # Debian/Ubuntu
  sudo apt install curl
  ```
- **Infinity 伺服器必須正常運行**（HTTP API 僅支援伺服器版本，不適用於嵌入式版本）

## Python SDK 示例

當前目錄提供完整的 Python SDK API 示例腳本，展示 Infinity 的核心功能，包括資料庫建立、索引創建、向量搜尋等。

### 安裝步驟
```bash
# 選擇適合的 SDK 版本
pip install infinity-sdk==0.7.0.dev2        # 伺服器版本
# 或
pip install infinity-embedded-sdk==0.7.0.dev2  # 嵌入式版本
```

### 運行示例
```bash
# 執行簡單示例，驗證 SDK 連接和基本功能
python simple_example.py
```

**注意**：確保指定版本 `0.7.0.dev2`，以避免 API 相容性問題。示例腳本會自動演示連接 Infinity、創建表、插入資料和執行搜尋等完整流程。

## HTTP API 示例

`/example/http` 目錄提供多個 SHELL 腳本，透過 `curl` 直接呼叫 Infinity 伺服器的 RESTful API，無需編寫程式碼即可測試功能。

### 目錄結構
```
example/http/
├── create_list_show_database.sh    # 創建資料庫並顯示
├── create_table_insert_query.sh    # 創建表、插入資料、查詢
└── ...                            # 其他 CRUD 操作示例
```

### 運行示例
```bash
# 確保 Infinity 伺服器運行中
cd example/http

# 執行資料庫創建和顯示示例
bash create_list_show_database.sh
```

**重要提醒**：
- HTTP API **僅適用於 Infinity 伺服器版本**
- 伺服器必須處於運行狀態（預設端口通常為 8000）
- 所有腳本均使用標準 REST 端點，如 `/v1/database`、`/v1/table` 等

## 故障排除

| 問題 | 可能原因 | 解決方案 |
|------|----------|----------|
| `ModuleNotFoundError: No module named 'infinity'` | SDK 未安裝或版本錯誤 | 執行 `pip install infinity-sdk==0.7.0.dev2` |
| `Connection refused` (Python SDK) | Infinity 伺服器未運行 | 啟動 Infinity 伺服器 |
| `curl: command not found` | 未安裝 curl | `sudo apt install curl` |
| `HTTP 404/500 錯誤` | 伺服器未運行或端點錯誤 | 確認伺服器狀態，檢查腳本中的 URL |

## 進階使用

1. **Python SDK**：參考 `simple_example.py` 中的連接配置，修改主機地址和認證資訊以適配生產環境
2. **HTTP API**：腳本支援自訂參數，可編輯腳本中的 JSON payload 進行進階測試
3. **效能優化**：建議使用伺服器版本於生產環境，嵌入式版本適合本地開發和測試

透過這些示例，您可以快速驗證 Infinity 的向量搜尋、相似度匹配等核心功能，並作為開發應用的起點。