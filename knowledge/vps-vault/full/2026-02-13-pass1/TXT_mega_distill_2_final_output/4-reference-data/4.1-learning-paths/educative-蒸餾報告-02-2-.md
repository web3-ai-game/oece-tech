---
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. 系統設計面試準備路線
**目標**：掌握FAANG等大廠系統設計面試，從單機到分散式系統，涵蓋scalability和distributed systems。

2.1 **總時長與結構**：95小時（8-12周），分為基礎、進階和補充階段。背景：系統設計面試強調高階思維，如trade-offs between consistency and availability (CAP theorem)。

2.11 **基礎階段 (25h)**：Grokking the System Design Interview。原理：透過經典題目如URL Shortener，學習load balancing和sharding。實例：設計TinyURL系統，使用hashing將長URL映射到短代碼。

2.12 **進階階段 (35h)**：Grokking Modern System Design for Engineers。原理：引入microservices和caching，如使用Redis for caching。實例：整合Kafka for event-driven architecture。

2.13 **補充階段 (35h)**：Spring Boot Fundamentals + Node.js and Express.js。原理：實務整合API和microservices。實例：構建RESTful API模擬Netflix推薦系統。

| 階段 | 課程名稱 | 主題 | 時長 | 等級 | 理由 |
|------|----------|------|------|------|------|
| 基礎 | Grokking the System Design Interview | System Design, Scalability | 25h | 中級 | 經典題目入門 |
| 進階 | Grokking Modern System Design for Engineers | Microservices, Databases | 35h | 進階 | 現代架構實作 |
| 補充 | Spring Boot + Node.js | API, Microservices | 35h | 中級 | 實務模擬 |

2.2 **學習建議擴展**：每週3-4天，搭配LeetCode System Design練習。輸出：獨立設計TinyURL或Netflix系統。原理：模擬面試透過whiteboarding練習，強化communication skills。
