# VPS 4v8g 15天使用建議

## 📊 VPS 配置

- **規格**: 4 vCPU / 8GB RAM
- **位置**: 新加坡數據中心
- **網絡**: 泰國訪問（延遲 ~30-50ms）
- **使用期**: 15 天（開發測試期）
- **當前狀態**: 空閒（可惜）

## 🎯 推薦方案：AI 開發加速器

### 方案 1: AI 代理編輯器專用環境 ⭐️ 最推薦

**適合場景**: 你主要用 AI 代理編輯器（Cursor/Windsurf/Copilot）工作

**配置方案**:

```yaml
服務配置:
  - Code Server (VSCode Web): 2GB RAM
  - AI 模型緩存服務: 2GB RAM  
  - Redis 緩存: 512MB RAM
  - PostgreSQL 數據庫: 1GB RAM
  - Nginx 反向代理: 256MB RAM
  
總使用: ~6GB / 8GB (剩餘 2GB 緩衝)
```

**優勢**:
- ✅ 遠程 VSCode，任何設備都能開發
- ✅ AI 補全緩存加速（Gemini Router）
- ✅ 數據庫持久化
- ✅ 新加坡節點快速訪問 AI API
- ✅ 15 天足夠開發和測試

**部署命令**:
```bash
# 在 VPS 上
docker-compose -f docker-compose.ai-dev.yml up -d
```

**訪問方式**:
```
https://code.your-domain.com  # VSCode Web
https://api.your-domain.com   # 後端 API
https://cache.your-domain.com # Redis Commander
```

---

### 方案 2: Gemini AI 加速代理

**適合場景**: 優化 AI API 訪問速度

**配置方案**:

```yaml
服務:
  1. Gemini Router (負載均衡): 1GB
     - 25 個 API Key 輪詢
     - 智能速率限制
     - 請求緩存
     
  2. Redis 緩存層: 2GB
     - AI 回應緩存（相同問題直接返回）
     - Session 存儲
     - 速率限制計數器
     
  3. PostgreSQL 日誌: 1GB
     - API 調用記錄
     - 成本分析
     - 性能監控
     
  4. Monitoring Stack: 2GB
     - Prometheus (指標收集)
     - Grafana (可視化)
     - Loki (日誌聚合)
```

**收益**:
- 🚀 API 延遲降低 50%（新加坡到 Google 更快）
- 💰 緩存命中率 30-40%，節省 API 配額
- 📊 實時監控 API 使用情況
- 🔄 自動故障轉移（某個 Key 被限速自動切換）

---

### 方案 3: 完整開發+演示環境

**適合場景**: 需要完整展示項目給客戶/團隊

**配置方案**:

```yaml
生產級部署:
  Frontend (Next.js):
    CPU: 1 vCPU
    RAM: 2GB
    Port: 3000
    
  Backend (Python):
    CPU: 1 vCPU  
    RAM: 2GB
    Port: 8000
    
  Telegram Bots (3個):
    CPU: 0.5 vCPU
    RAM: 1.5GB
    Port: -
    
  PostgreSQL:
    CPU: 1 vCPU
    RAM: 1.5GB
    Port: 5432
    
  Redis:
    CPU: 0.5 vCPU
    RAM: 512MB
    Port: 6379
    
  Nginx:
    CPU: - 
    RAM: 256MB
    Port: 80, 443
```

**功能**:
- 🌐 完整論壇網站（deepway.me）
- 🤖 3 個 Telegram 機器人在線
- 📱 支持外部訪問展示
- 🔒 HTTPS 加密（Let's Encrypt）
- 📊 實時監控面板

---

### 方案 4: AI 模型測試實驗室

**適合場景**: 測試不同 AI 模型性能

**配置方案**:

```yaml
多模型對比環境:
  Gemini Router: 1.5GB
    - 25 keys 負載均衡
    - A/B 測試框架
    
  OpenRouter Proxy: 1.5GB
    - 接入 Claude, GPT-4, Llama
    - 成本對比分析
    
  Model Benchmark: 1GB
    - 自動化測試腳本
    - 性能指標收集
    - 質量評分系統
    
  Data Analytics: 2GB
    - Jupyter Notebook
    - Pandas, NumPy
    - 數據可視化
    
  Storage: 2GB
    - 測試數據集
    - 結果緩存
```

**產出**:
- 📊 不同模型的性能報告
- 💰 成本效益分析
- 🎯 最優模型選擇建議
- 📈 15 天完整測試週期

---

## 💡 我的推薦（根據你的情況）

### 🏆 最佳方案: **方案 1 + 方案 2 混合**

**理由**:
1. ✅ **你在泰國，VPS 在新加坡** → 延遲低（30-50ms）
2. ✅ **15 天短期** → 專注開發，不需要長期運維
3. ✅ **主要用 AI 代理編輯器** → Code Server + Gemini Router 完美組合
4. ✅ **4v8g 規格剛好** → 不浪費資源

**混合配置**:

```yaml
version: '3.8'
services:
  # 遠程 VSCode
  code-server:
    image: codercom/code-server:latest
    ports:
      - "8080:8080"
    environment:
      - PASSWORD=${CODE_SERVER_PASSWORD}
    volumes:
      - ./workspace:/home/coder/workspace
    cpus: 1
    mem_limit: 2g
    
  # Gemini AI Router
  gemini-router:
    build: ./apps/forum-backend
    environment:
      - GEMINI_API_KEYS=${GEMINI_API_KEYS}
      - GEMINI_ROUTER_STRATEGY=priority
    ports:
      - "5000:5000"
    depends_on:
      - redis
    cpus: 0.5
    mem_limit: 1g
    
  # Redis 緩存
  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"
    cpus: 0.5
    mem_limit: 2.5g
    
  # PostgreSQL
  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=deepway
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    cpus: 1
    mem_limit: 1.5g
    
  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - code-server
      - gemini-router
    cpus: 0.25
    mem_limit: 256m
    
  # 監控面板（可選）
  portainer:
    image: portainer/portainer-ce:latest
    ports:
      - "9000:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    cpus: 0.25
    mem_limit: 512m

volumes:
  postgres_data:
  portainer_data:
```

**總資源使用**: ~7.75GB / 8GB

---

## 🚀 部署步驟

### 1. 準備 VPS

```bash
# SSH 登錄
ssh root@your-vps-ip

# 安裝 Docker
curl -fsSL https://get.docker.com | sh

# 安裝 Docker Compose
apt install docker-compose-plugin -y

# 克隆項目
git clone https://github.com/web3-ai-game/deepway-mcp.git
cd deepway-mcp
```

### 2. 配置環境變量

```bash
# 從 Doppler 同步
doppler secrets download --no-file --format env > .env

# 或手動設置
cat > .env << EOF
CODE_SERVER_PASSWORD=your_secure_password
GEMINI_API_KEYS=key1,key2,key3...
DB_PASSWORD=your_db_password
EOF
```

### 3. 啟動服務

```bash
# 構建並啟動
docker-compose up -d

# 查看狀態
docker-compose ps

# 查看日誌
docker-compose logs -f
```

### 4. 配置域名（可選）

```bash
# 使用 Cloudflare Tunnel 或 ngrok
# 無需公網 IP，免費 HTTPS

# Cloudflare Tunnel
cloudflared tunnel create deepway-dev
cloudflared tunnel route dns deepway-dev code.yourdomain.com
cloudflared tunnel run deepway-dev
```

---

## 📊 15 天使用計劃

### Week 1: 環境搭建 + 核心開發
```
Day 1-2:  VPS 部署，環境測試
Day 3-5:  論壇核心功能開發
Day 6-7:  Telegram Bot 集成
```

### Week 2: 功能完善 + 測試
```
Day 8-10:  AI 功能優化
Day 11-12: 用戶體驗改進
Day 13-14: 性能測試，bug 修復
```

### Day 15: 遷移準備
```
- 備份數據庫
- 導出代碼
- 記錄配置
- 準備長期部署方案
```

---

## 💰 成本對比

### VPS vs 本機開發

| 項目 | VPS (新加坡) | 本機 (Mac) |
|------|------------|-----------|
| AI API 延遲 | ⭐⭐⭐⭐⭐ 20-30ms | ⭐⭐⭐ 100-150ms |
| 24/7 運行 | ✅ 可以 | ❌ 不實際 |
| 多設備訪問 | ✅ 任何設備 | ❌ 僅限本機 |
| RAM 壓力 | ✅ 無影響 | ❌ 高壓力 |
| 展示給他人 | ✅ 簡單 | ❌ 複雜 |
| 成本 | $0 (15天免費) | 電費+性能損耗 |

**結論**: VPS 完勝，特別是 AI 開發場景

---

## 🎁 額外建議

### 1. 數據備份自動化

```bash
# 每日備份腳本
cat > /root/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d)
docker exec postgres pg_dump -U postgres deepway > /backup/db_$DATE.sql
tar -czf /backup/code_$DATE.tar.gz /root/deepway-mcp
# 上傳到 S3 或 Google Drive
EOF

chmod +x /root/backup.sh
crontab -e
# 添加: 0 2 * * * /root/backup.sh
```

### 2. 監控告警

```bash
# Uptime Kuma (輕量級監控)
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

### 3. Gemini API 優化

```python
# apps/forum-backend/gemini_optimizer.py
import redis
import hashlib

r = redis.Redis(host='redis', port=6379)

def cached_gemini_call(prompt, model="gemini-2.0-flash"):
    # 緩存相同問題的回答
    cache_key = f"gemini:{hashlib.md5(prompt.encode()).hexdigest()}"
    cached = r.get(cache_key)
    
    if cached:
        return cached.decode()
    
    # 調用 API
    response = call_gemini_api(prompt, model)
    
    # 緩存 24 小時
    r.setex(cache_key, 86400, response)
    return response
```

---

## 🤔 Q&A

**Q: 15 天後怎麼辦？**  
A: 
1. 續費 VPS（如果效果好）
2. 遷移到長期雲服務（AWS/GCP Free Tier）
3. 遷移回本機（已有完整 Docker 配置）
4. 使用免費 Render/Railway 部署靜態部分

**Q: 4v8g 會不會太大？**  
A: 剛好！Code Server + Gemini Router + 數據庫 + 監控 = ~7GB

**Q: 泰國訪問新加坡 VPS 快嗎？**  
A: 很快！泰國-新加坡延遲 30-50ms，比訪問美國（200ms+）快 4 倍

**Q: AI 代理編輯器能用 VPS 的 Gemini Router 嗎？**  
A: 可以！配置 API Base URL 指向 VPS 即可

**Q: 需要域名嗎？**  
A: 不必須。可以用 Cloudflare Tunnel 或直接 IP:端口訪問

---

## 📝 下一步行動

1. ✅ **決定方案**: 選擇方案 1+2 混合
2. ⏳ **創建配置文件**: `docker-compose.ai-dev.yml`
3. ⏳ **VPS 部署**: SSH 登錄並執行部署
4. ⏳ **測試訪問**: 確認所有服務正常
5. ⏳ **開始開發**: 15 天全力衝刺！

**準備好了嗎？我可以幫你生成完整的 docker-compose.ai-dev.yml！**
