# 🎯 最小 MVP 計劃 - Notion 數據清洗

> **基於掃描報告生成的最小可行方案**
> 
> **生成時間**: 2025-11-26
> **執行優先級**: 🔴 HIGH

---

## 📊 掃描結果摘要

```
✅ 總頁面數: 30
📦 有效頁面: 15 (50%)
⚠️  空頁面: 15 (50%)
🔄 重複頁面: 0
📦 總區塊數: 2737
📊 平均區塊/頁: 91
```

### 核心發現

1. **空頁面過多**: 15個空頁面需要清理
2. **標題缺失**: 大部分頁面標題為「無標題」
3. **分類不足**: 僅1個技術類頁面被識別
4. **數據集中**: 前3個頁面佔據大部分內容（527 + 261 + 341 = 1129 區塊，41%）

---

## 🎯 MVP 階段劃分

### Phase 1: 清理與去重（✅ 已完成）

```bash
# 已執行：scan_notion_data.js
✅ 識別 15 個空頁面
✅ 檢測 0 個重複頁面
✅ 分類統計完成
✅ 核心頁面識別（Top 10）
```

**輸出文件**: `notion_export/scan_report.json`

---

### Phase 2: 低溫裁切提取（🔄 進行中）

**目標**: 精確提取核心內容，去除噪音數據

**使用規則**:
- Key: `GEMINI_PRO_25` (收費 key)
- 溫度: `0.3` (低溫精確)
- 模型: `gemini-2.5-pro`

**執行步驟**:

```bash
# Step 1: 提取核心頁面內容（Top 5）
node scripts/extract_core_content.js \
  --pages "ab1f1ed4324f4bbebc9db9db6a344b89,2a36b9c2d37981b5aa18e29a0eecfb3b,8748dcf11bd3441a9bc7d61aef041180" \
  --temperature 0.3 \
  --output notion_export/core_extracted.json

# Step 2: 去除空頁面
node scripts/clean_empty_pages.js \
  --input notion_export/pages \
  --output notion_export/cleaned

# Step 3: 結構化分類
node scripts/categorize_content.js \
  --input notion_export/cleaned \
  --categories "architecture,technical,strategy,deployment" \
  --output notion_export/categorized.json
```

**預期輸出**:
```json
{
  "totalExtracted": 5,
  "categories": {
    "technical": ["圖片生成提示詞", "極客硬件實戰"],
    "architecture": [],
    "strategy": [],
    "deployment": []
  },
  "totalBlocks": 1129,
  "cleanedPercentage": "41%"
}
```

---

### Phase 3: Google AI Studio UI 最小生成器（⏳ 待執行）

**目標**: 使用 Google AI Studio 的 UI 快速生成文檔

**工具**: 
- Google AI Studio (aistudio.google.com)
- Gemini 3 Pro Preview

**操作流程**:

```markdown
1. 打開 Google AI Studio
   URL: https://aistudio.google.com

2. 選擇模型: Gemini 3 Pro Preview

3. 上傳清洗後的數據:
   - 文件: notion_export/core_extracted.json
   - 格式: JSON
   - 大小: ~500KB

4. 使用 Prompt:
   """
   基於以下 Notion 數據，生成結構化的技術文檔：
   
   要求：
   - 提取核心架構概念
   - 識別技術要點
   - 生成最佳實踐
   - 補充實戰案例
   - Markdown 格式輸出
   
   溫度: 0.9 (高溫創意模式)
   """

5. 導出結果:
   - 格式: Markdown
   - 保存位置: docs/zh/generated_from_ui.md
```

**預期成本**: $0.05 - $0.10 (使用 GEMINI_PRO_25)

---

### Phase 4: 精準裁切修正（⏳ 待執行）

**目標**: 去除飄移內容，保留精華

**使用規則**:
- Key: `GEMINI_PRO_30` (僅在必要時)
- 溫度: `0.2` (超低溫修正)
- 模型: `gemini-3.0-pro`

**執行命令**:

```bash
# 技術審核與修正
node scripts/final_correction.js \
  --input docs/zh/generated_from_ui.md \
  --temperature 0.2 \
  --output docs/zh/final_docs.md \
  --checks "technical_accuracy,grammar,structure"
```

**檢查項目**:
- ✅ 技術準確性
- ✅ 語法正確性
- ✅ 結構完整性
- ✅ 去除重複內容
- ✅ 補充缺失引用

---

## 🔧 需要創建的腳本

### 1. `extract_core_content.js`

```javascript
// 提取核心內容（低溫模式）
// 輸入: scan_report.json + pages/*.json
// 輸出: core_extracted.json
// Temperature: 0.3
// Key: GEMINI_PRO_25
```

### 2. `clean_empty_pages.js`

```javascript
// 清理空頁面
// 輸入: pages/*.json
// 輸出: cleaned/*.json
// 操作: 刪除 15 個空頁面
```

### 3. `categorize_content.js`

```javascript
// 結構化分類
// 輸入: cleaned/*.json
// 輸出: categorized.json
// 分類: architecture, technical, strategy, deployment
```

### 4. `final_correction.js`

```javascript
// 最終修正（超低溫）
// 輸入: generated_from_ui.md
// 輸出: final_docs.md
// Temperature: 0.2
// Key: GEMINI_PRO_30 (僅在必要時)
```

---

## 📊 成本估算

| 階段 | 使用 Key | 預估 Token | 預估成本 | 狀態 |
|-----|---------|-----------|---------|-----|
| Phase 1: 掃描 | 本地 | 0 | $0 | ✅ |
| Phase 2: 低溫提取 | GEMINI_PRO_25 | ~50K | $0.50 | 🔄 |
| Phase 3: UI 生成 | GEMINI_PRO_25 | ~100K | $1.00 | ⏳ |
| Phase 4: 精準修正 | GEMINI_PRO_30 | ~30K | $0.60 | ⏳ |
| **總計** | - | ~180K | **$2.10** | - |

**預算**: $5.00 (安全範圍內)

---

## ⏱️ 時間估算

```
Phase 1: 掃描與去重          ✅ 2 分鐘 (已完成)
Phase 2: 低溫裁切           🔄 15 分鐘 (進行中)
Phase 3: UI 生成            ⏳ 10 分鐘
Phase 4: 精準修正           ⏳ 5 分鐘
測試與驗證                  ⏳ 5 分鐘
提交到 GitHub              ⏳ 2 分鐘
─────────────────────────────────
總計                       ⏱️ 39 分鐘
```

---

## 🚀 執行檢查清單

- [x] ✅ 掃描 Notion 數據
- [x] ✅ 生成掃描報告
- [x] ✅ 識別空頁面（15個）
- [x] ✅ 識別核心頁面（Top 10）
- [x] ✅ 更新 AI Key 調用規則
- [ ] 📝 創建 `extract_core_content.js`
- [ ] 📝 創建 `clean_empty_pages.js`
- [ ] 📝 創建 `categorize_content.js`
- [ ] 📝 創建 `final_correction.js`
- [ ] 🧪 測試免費 Key (超限)
- [ ] 🧪 測試收費 Key (GEMINI_PRO_25)
- [ ] 🎨 使用 Google AI Studio UI 生成
- [ ] ✂️ 最終裁切修正
- [ ] 🚀 提交到 GitHub

---

## 📍 當前狀態

```
✅ 掃描完成: 30 個頁面已分析
⚠️  免費 Key 超限: GEMINI_FREE_1 配額耗盡（需等待 47 秒）
🔄 測試收費 Key: GEMINI_PRO_25 測試中...
📝 下一步: 創建提取腳本
```

---

## 🎯 立即行動

```bash
# 1. 等待收費 Key 測試結果
# 2. 創建核心提取腳本
# 3. 執行低溫裁切
# 4. 使用 Google AI Studio UI 生成
# 5. 最終修正並提交
```

**預計完成時間**: 2025-11-26 15:30

---

**維護者**: DeepWeay SMS Team  
**版本**: v1.0-MVP  
**狀態**: 🔄 **IN PROGRESS**

