---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_TOOLS-ARSENAL-ULTRA-12-5-2.md
distilled_at: 2026-02-14T09:16:07.591Z
model: grok-4-1-fast-non-reasoning
---

# 🛠️ 工具武器庫 | TOOL ARSENAL

**類別**: 2-knowledge-base/2.4-engineering  
**來源文件**: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md  
**蒸餾工具**: grok-4-0709  
**模式**: B  
**部分**: 12  
**主題**: 5.2 Docker Compose部署服務  

---

## 介紹

Docker Compose 是 Docker 官方提供的工具，用於定義和運行多容器 Docker 應用。它透過單一的 YAML 配置文件（`docker-compose.yml`）來管理應用程式的服務、網路和卷宗，讓開發者和運維人員能夠輕鬆部署複雜的應用堆疊，而無需手動啟動多個容器。

**核心優勢**：
- **簡化多容器管理**：一鍵啟動/停止整個應用。
- **環境一致性**：開發、測試和生產環境配置相同。
- **依賴自動化**：自動處理服務間的網路連線和依賴順序。
- **版本控制**：YAML 文件可納入 Git 版本控制。

適用場景：Web 應用、後端 API、資料庫 + 快取 + Web 伺服器的全棧部署。

---

## Docker Compose 基本概念

| 概念 | 說明 |
|------|------|
| **服務 (Services)** | 應用程式的單一容器定義（例如 Web 伺服器、資料庫）。 |
| **網路 (Networks)** | 容器間通訊的虛擬網路（預設自動創建）。 |
| **卷宗 (Volumes)** | 持久化資料儲存，避免容器重啟資料丟失。 |
| **環境變數** | 配置注入（如資料庫密碼、API 金鑰）。 |

**安裝 Docker Compose**：
```bash
# Linux/macOS
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 驗證
docker-compose --version
```

---

## YAML 配置結構

Docker Compose 使用 YAML 3.x 版本（推薦 '3.8' 或更高），基本結構如下：

```yaml
version: '3.8'  # 指定 Compose 文件格式版本

services:       # 定義所有服務
  # 服務定義...

networks:       # 自訂網路（可選）
  default:

volumes:        # 自訂卷宗（可選）
  db-data:
```

---

## YAML 配置示例：簡單 Nginx Web 服務

以下是基於提供的核心事實的完整示例，部署一個 Nginx Web 伺服器：

```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine  # 使用輕量 Alpine 版本的 Nginx 鏡像
    container_name: my-nginx-web  # 自訂容器名稱（可選）
    ports:
      - "80:80"  # 主機端口 80 映射到容器端口 80
    restart: unless-stopped  # 容器自動重啟策略
    volumes:
      - ./html:/usr/share/nginx/html:ro  # 掛載本地靜態文件到容器
    environment:
      - NGINX_HOST=foobar.nginx
    networks:
      - web-network

networks:
  web-network:
    driver: bridge  # 使用橋接網路模式
```

### 配置說明
| 鍵值 | 說明 | 示例值 |
|------|------|--------|
| `version` | Compose 文件格式版本 | '3.8' |
| `image` | Docker 鏡像來源（Docker Hub） | `nginx:alpine` |
| `ports` | 端口映射格式 `"主機端口:容器端口"` | `"80:80"` |
| `volumes` | 資料持久化掛載 | `./html:/usr/share/nginx/html` |
| `restart` | 重啟策略 | `unless-stopped`（除非手動停止） |

---

## 常用命令

執行以下命令前，確保在 `docker-compose.yml` 所在目錄：

| 命令 | 說明 |
|------|------|
| `docker-compose up` | 啟動所有服務（前景執行） |
| `docker-compose up -d` | 背景啟動（Detached 模式） |
| `docker-compose down` | 停止並移除容器、網路 |
| `docker-compose ps` | 查看運行中的服務狀態 |
| `docker-compose logs web` | 查看特定服務日誌 |
| `docker-compose build` | 建置自訂鏡像（若使用 `build` 指令） |
| `docker-compose exec web sh` | 進入容器執行 shell |

**完整部署流程**：
```bash
# 1. 創建靜態 HTML 目錄
mkdir html && echo "<h1>Hello Docker Compose!</h1>" > html/index.html

# 2. 啟動服務
docker-compose up -d

# 3. 驗證
curl http://localhost  # 應回應 HTML 內容

# 4. 停止
docker-compose down
```

---

## 進階配置示例：多服務堆疊

部署 WordPress + MySQL 的完整範例：

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: wordpress
    networks:
      - wp-network

  wordpress:
    depends_on:
      - db  # 依賴 db 服務先啟動
    image: wordpress:6.0-php8.1-apache
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: example
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_data:/var/www/html
    networks:
      - wp-network
    restart: unless-stopped

volumes:
  db_data:
  wp_data:

networks:
  wp-network:
    driver: bridge
```

---

## 最佳實務與疑難排解

### ✅ 最佳實務
- **使用特定版本標籤**：避免 `nginx:latest`，改用 `nginx:1.25-alpine`。
- **敏感資訊使用 `.env` 文件**：
  ```
  DB_PASSWORD=supersecret
  ```
  YAML 中引用：`${DB_PASSWORD}`。
- **健康檢查**：
  ```yaml
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost"]
    interval: 30s
    timeout: 10s
    retries: 3
  ```
- **資源限制**：
  ```yaml
  deploy:
    resources:
      limits:
        cpus: '0.50'
        memory: 512M
  ```

### ❌ 常見問題
| 問題 | 解決方案 |
|------|----------|
| 端口已被佔用 | 修改主機端口，如 `"8080:80"` |
| 卷宗權限錯誤 | `chmod -R 755 volumes/` 或使用 `user: "1000:1000"` |
| 服務啟動順序 | 使用 `depends_on` 和 `healthcheck` |
| 鏡像拉取失敗 | `docker-compose pull` 預先下載 |

---

## 參考資源
- [官方文件](https://docs.docker.com/compose/)
- [Compose 文件參考](https://docs.docker.com/compose/compose-file/)
- [範例倉庫](https://github.com/docker/awesome-compose)

此文檔提供 Docker Compose 部署的核心知識與實戰配置，適用於快速構建生產級服務堆疊。