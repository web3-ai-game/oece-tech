---
distilled_by: grok-4-0709
mode: B
---
part: 11
---

## ⚡ 實戰要點
1. 始終從 Rails 7 + Hotwire 啟動新專案，以減少 JS 依賴。  
2. 使用 Turbo Streams 實現即時功能，優先於傳統 WebSocket 庫。  
3. 整合 Stripe 前，測試 Webhook 在本地環境。  
4. 應用 Pundit 政策確保多租戶安全隔離。  
5. 透過 Sidekiq 處理所有異步任務，提升應用響應性。  
6. 部署到 Render 時，配置環境變數以保護敏感資料。  
7. 定期運行 RSpec 測試，維持 TDD 習慣。  
8. 監控 PostgreSQL 查詢效能，使用索引避免瓶頸。
