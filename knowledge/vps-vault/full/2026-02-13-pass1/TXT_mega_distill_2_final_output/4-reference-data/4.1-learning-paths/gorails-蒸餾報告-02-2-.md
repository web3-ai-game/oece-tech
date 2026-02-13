---
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. Rails 全棧學習路線深度剖析
Rails 全棧開發涵蓋後端邏輯、前端互動和資料管理。本節展開完整路徑，從基礎到進階。

2.1 **基礎架構階段**  
背景：Rails 7 強調快速啟動，整合 Hotwire 作為默認前端工具。原理：esbuild 提供高效的 JavaScript 打包，import maps 允許無需 bundler 直接引入模組。實例：創建一個簡單的 Todo 應用，從 rails new 命令開始，添加 Hotwire 來處理動態列表。

2.11 **資料層階段**  
背景：ActiveRecord 是 Rails 的 ORM 核心，支持複雜查詢。原理：多態關聯 (polymorphic associations) 允許模型共享行為，如圖片附件可屬於多種資源。實例：使用 JSONB 欄位存儲用戶偏好，結合 PostgreSQL 的全文搜尋實現高效查詢。

2.12 **前端互動階段**  
背景：Hotwire 取代傳統 JS 框架，聚焦伺服器端渲染。原理：Turbo Frames 允許局部頁面替換，而不需重載整個頁面。實例：在論壇應用中，使用 Stimulus 控制器處理按讚功能，無需額外 JS 程式碼。

2.13 **後端進階階段**  
背景：即時功能需求促使 ActionCable 的應用。原理：WebSocket 提供雙向通訊，Sidekiq 處理異步任務以避免阻塞。實例：構建聊天室，ActionCable 推送訊息，Sidekiq 排程通知。

2.14 **測試與工具階段**  
背景：TDD (Test-Driven Development) 是 Rails 最佳實踐。原理：RSpec 提供行為驅動測試，custom generators 加速開發。實例：為用戶模型撰寫 RSpec 測試，確保關聯正確。

以下表格總結 Rails 全棧路線的階段對比：

| 階段 | 總時長 | 重點技能 | 前置依賴 | 難度等級 |
|------|--------|----------|----------|----------|
| 基礎架構 | 65 分 | esbuild, Import Maps | 無 | 入門 |
| 資料層 | 110 分 | ActiveRecord, JSONB | 基礎架構 | 中階 |
| 前端互動 | 105 分 | Stimulus, Turbo Frames | 基礎架構 | 中階 |
| 後端進階 | 115 分 | ActionCable, Sidekiq | 資料層 | 高階 |
| 測試與工具 | 85 分 | RSpec, Generators | 全階段 | 高階 |
