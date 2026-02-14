---
source: one-code_shared_safe-docs_UPSTASH_REDIS_SETUP.md
distilled_at: 2026-02-14T09:29:12.077Z
model: grok-4-1-fast-non-reasoning
---

# Upstash Redis 配置指南 - oece.tech 專用

## 介紹

**Upstash Redis** 是一個無服務器（Serverless）的 Redis 託管服務，專為現代應用設計。它提供 Redis 的完整功能，無需管理基礎設施，非常適合用於 **API 限流（Rate Limiting）**、**數據緩存（Caching）** 和 **會話管理** 等場景。

對於 **oece.tech** 項目，Upstash Redis 主要用於：
- 防止 API 濫用攻擊
- 限制單個 IP 的請求頻率
- 提升系統穩定性和響應速度

## 免費額度（完全滿足 oece.tech 需求）

| 資源 | 額度 | oece.tech 評估 |
|------|------|---------------|
| **命令數** | 10,000 命令/天 | ✅ 完全足夠 |
| **存儲空間** | 256MB | ✅ 完全足夠 |
| **地區選擇** | Regional（免費） | ✅ 推薦新加坡 |

> **重要**：oece.tech 在不配置 Upstash Redis 的情況下仍可正常運行。僅在需要 API 限流保護時才建議配置。

## 快速設置步驟

### 1. 註冊 Upstash 帳戶
```
前往：https://upstash.com/
推薦使用 GitHub 登錄（最快）
```

### 2. 創建 Redis 數據庫
在 Upstash 控制台點擊 **"Create Database"**，填寫以下配置：

| 字段 | 值 | 說明 |
|------|----|------|
| **Name** | `oece-tech-redis` | 建議名稱，方便識別 |
| **Type** | `Regional` | ✅ 免費選項 |
| **Region** | `Singapore (ap-southeast-1)` | ✅ 亞太低延遲 |

點擊 **"Create"**，等待 30 秒創建完成。

### 3. 獲取連接配置
創建完成後，複製以下兩個關鍵信息：
```
UPSTASH_REDIS_REST_URL=https://your-db-id.upstash.io
UPSTASH_REDIS_REST_TOKEN=Ayour-token-here==
```

### 4. 配置環境變量
在項目根目錄的 `.env.local` 文件中添加：

```bash
# Upstash Redis 配置
UPSTASH_REDIS_REST_URL=https://your-db-id.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### 5. 重啟應用
```bash
# 使用 PM2 重啟（推薦）
pm2 restart oece-tech

# 或使用其他方式重啟 Next.js 應用
npm run dev
# 或
yarn dev
```

## 驗證配置是否成功

重啟後，檢查應用日誌確認 Redis 連接正常：
```
✅ Upstash Redis connected successfully
✅ Rate limiting enabled
```

## 主要用途

### 🎯 API 限流（核心功能）
```javascript
// 示例：每 IP 每分鐘最多 60 次請求
const rateLimit = await redis.set(
  `ratelimit:${ip}`,
  hits,
  'EX', 60,  // 60秒過期
  'NX'
);
```

### 🚀 數據緩存
- 用戶配置緩存
- API 響應緩存
- 熱門數據預載

### 🛡️ 防止濫用
- IP 黑名單
- 異常行為檢測
- 自動封禁機制

## 注意事項與最佳實踐

### ✅ 必須知道
- **免費額度充足**：10K 命令/天遠超 oece.tech 需求
- **非強制配置**：未配置 Redis 時應用照常運行
- **REST API 連接**：使用 REST 協議，無需 TCP 端口配置

### ⚠️ 常見問題
| 問題 | 解決方案 |
|------|----------|
| 連接失敗 | 檢查 `.env.local` 變量是否正確 |
| 命令超限 | 監控 Upstash 控制台使用量 |
| 延遲較高 | 確認選擇 Singapore 地區 |

### 🔧 生產環境建議
```bash
# 監控 Redis 使用情況
pm2 monit

# 查看 Upstash 控制台統計
# https://console.upstash.com/
```

## 故障排除

### Redis 連接錯誤
```
Error: Invalid UPSTASH_REDIS_REST_TOKEN
```
**解決**：重新從 Upstash 控制台複製 Token

### 限流不生效
```
Rate limit middleware not loaded
```
**解決**：確認環境變量已載入，重啟應用

## 升級與擴展

當流量增長時：
1. 升級到 **Global** 類型（多地區複製）
2. 增加命令額度（按需付費）
3. 配置自定義限流規則

---

**📄 文檔版本：v1.0**  
**適用項目：oece.tech**  
**最後更新：基於最新 Upstash 免費額度**