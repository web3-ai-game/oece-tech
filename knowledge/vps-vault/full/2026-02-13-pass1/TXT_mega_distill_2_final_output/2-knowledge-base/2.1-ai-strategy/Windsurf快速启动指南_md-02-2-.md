---
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. 安裝與配置

Windsurf 的安裝設計為簡易，目標是讓用戶在 5 分鐘內啟動。背景：這源自於 DevOps 運動的“即時可用”原則，確保開發者無需複雜設定即可進入生產模式。

### 2.1 安裝步驟與原理

首先，下載 Windsurf CLI 工具，從官方 GitHub 倉庫 clone 並運行安裝腳本。原理是基於 Docker 容器化，確保跨平台兼容性。實例：在一台 macOS 機器上，執行 `git clone https://github.com/windsurf-ai/core.git && cd core && ./install.sh`，系統會自動拉取依賴如 Node.js 和 Python。

代碼範例 1：安裝腳本（帶註釋）

```bash
#!/bin/bash
# 檢查依賴
if ! command -v docker &> /dev/null; then
    echo "Docker 未安裝，請先安裝 Docker。"
    exit 1
fi

# 拉取 Windsurf 鏡像
docker pull windsurf/core:latest  # 從 Docker Hub 拉取最新版本

# 運行容器
docker run -d -p 8080:80 --name windsurf windsurf/core:latest  # 後台運行，映射端口
echo "Windsurf 已啟動！訪問 http://localhost:8080"
```

### 2.11 配置 API 密钥

Windsurf 支持兩種密钥管理方式：Doppler CLI 和本地 .env 文件。背景：這是為了符合安全最佳實踐，如零信任模型（Zero Trust），防止密钥洩露。原理：Doppler 提供雲端加密存储，而 .env 適合本地開發。實例：使用 Doppler 時，執行 `doppler setup` 並添加 OpenAI API 密钥。

代碼範例 2：.env 配置（帶註釋）

```env
# Windsurf 環境變數
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXX  # OpenAI API 密钥
GCP_PROJECT_ID=my-gcp-project  # GCP 項目 ID，用於 Cloud Run 部署
DOPPLER_TOKEN=dp.XXXXXXXXXXXXXXXX  # 可選：Doppler 訪問令牌
```

### 2.2 登錄與初始設置

登錄使用 JWT 認證，原理是基於令牌的身份驗證，確保安全。實例：運行 `windsurf login --email user@example.com`，系統生成令牌並儲存於本地。
