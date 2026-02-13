---
distilled_by: grok-4-0709
mode: B
---
part: 3
---

## 3. Hotwire/Turbo/Stimulus 現代前端路線深度展開
Hotwire 是 Rails 7 的原生前端解決方案，強調「HTML over the wire」以取代 SPA 框架。

3.1 **入門級概念**  
背景：Stimulus 作為輕量 JS 框架，專注於增強 HTML。原理：控制器透過 data-attributes 綁定行為。實例：表單驗證，使用 Stimulus 即時檢查輸入。

3.11 **中階應用**  
背景：Turbo Frames 解決無刷新導航需求。原理：伺服器返回 HTML 片段，替換指定 frame。實例：儀表板動態載入資料。

3.12 **高階整合**  
背景：Turbo Streams 結合 WebSocket 實現推送。原理：伺服器廣播更新到客戶端。實例：即時通知系統。

3.13 **優勢對比表格**  
以下表格對比 Hotwire 與傳統 SPA 框架：

| 方面 | Hotwire | React/Vue | 優勢 |
|------|---------|-----------|------|
| 學習曲線 | 低 | 高 | 零 JS 框架需求 |
| SEO 友好 | 100% | 需額外配置 | 伺服器渲染 |
| 安全性 | 高 | 中 | 伺服器主導 |
| 性能 | 優異 | 依實現 | 減少客戶端負載 |
