---
distilled_by: grok-4-0709
mode: B
---
part: 5
---

## 5. 設計工作流建議與代碼範例
工作流如原圖示。擴展：背景為 Agile 設計方法，原理為迭代循環。

以下 6 個代碼範例，展示整合（HTML/CSS/SVG）。

1. **HTML 中嵌入 Icons8 SVG**：
   ```html
   <!-- 註釋：從 Icons8 下載 SVG，嵌入網頁 UI -->
   <svg width="50" height="50">
     <path d="M10 10 H 90 V 90 H 10 Z" fill="#007BFF" /> <!-- 自訂顏色圖標 -->
   </svg>
   ```

2. **CSS 自訂 Iconscout Lottie**：
   ```css
   /* 註釋：整合 Lottie 動畫到網站 */
   .lottie-animation {
     animation: fadeIn 2s; /* 原理：CSS 動畫提升互動 */
   }
   ```

3. **Canva 導出到 HTML**：
   ```html
   <!-- 註釋：Canva 導出 PNG 作為背景 -->
   <div style="background-image: url('canva-export.png');">Content</div>
   ```

4. **JavaScript 載入 Icons8 音樂**：
   ```javascript
   // 註釋：為 demo 影片添加背景音樂
   const audio = new Audio('icons8-music.mp3');
   audio.play(); // 原理：提升影片專業度
   ```

5. **SVG 自訂顏色 (Icons8)**：
   ```svg
   <svg>
     <circle cx="25" cy="25" r="20" fill="var(--brand-color)" /> <!-- 變數顏色，整合 Brand Kit -->
   </svg>
   ```

6. **Figma 匯入 Iconscout**：
   ```html
   <!-- 註釋：Figma 插件導出 HTML -->
   <img src="iconscout-3d.svg" alt="3D Model" />
   ```
