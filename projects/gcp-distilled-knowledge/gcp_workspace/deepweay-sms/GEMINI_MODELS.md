# 🔍 Gemini 模型對照表（官方 API 檢測結果）

> **檢測時間**: 2025-11-26  
> **API Key**: GEMINI_PRO_30 (AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4)

---

## ✅ 可用模型完整列表

### 🔴 Gemini 3 Pro（最新）

```
models/gemini-3-pro-preview           ⭐ 主力數據清洗
models/gemini-3-pro-image-preview     圖像生成
```

**正確調用名稱**: `gemini-3-pro-preview`

---

### 🟠 Gemini 2.5 Pro

```
models/gemini-2.5-pro                      ✅ 穩定版
models/gemini-2.5-pro-preview-03-25        Preview 版本
models/gemini-2.5-pro-preview-05-06        Preview 版本
models/gemini-2.5-pro-preview-06-05        Preview 版本
models/gemini-2.5-pro-vtea-da-csi          特殊版本
models/gemini-2.5-pro-preview-tts          文字轉語音
models/gemini-2.5-computer-use-preview-10-2025  電腦操作
```

---

### 🟡 Gemini 2.5 Flash（快速）

```
models/gemini-2.5-flash                    ✅ 穩定版
models/gemini-2.5-flash-lite               輕量版
models/gemini-2.5-flash-image              圖像處理
models/gemini-2.5-flash-preview-09-2025    Preview 版本
models/gemini-2.5-flash-lite-preview-09-2025  輕量 Preview
models/gemini-2.5-flash-image-preview      圖像 Preview
models/gemini-2.5-flash-preview-tts        文字轉語音
```

---

### 🟢 Gemini 2.0 Pro

```
models/gemini-2.0-pro-exp                  ✅ 實驗版
models/gemini-2.0-pro-exp-02-05            日期版本
```

---

### 🔵 Gemini 2.0 Flash

```
models/gemini-2.0-flash                    ✅ 穩定版
models/gemini-2.0-flash-001                版本 001
models/gemini-2.0-flash-exp                實驗版
models/gemini-2.0-flash-lite               輕量版
models/gemini-2.0-flash-lite-001           輕量版本 001
models/gemini-2.0-flash-lite-preview       輕量 Preview
models/gemini-2.0-flash-lite-preview-02-05  輕量日期版本
models/gemini-2.0-flash-thinking-exp       思考模式
models/gemini-2.0-flash-thinking-exp-01-21  思考日期版本
models/gemini-2.0-flash-thinking-exp-1219   思考日期版本
models/gemini-2.0-flash-exp-image-generation  圖像生成
```

---

## 🎯 推薦使用策略

### 數據清洗（關鍵任務）

```javascript
{
  model: 'gemini-3-pro-preview',  // ✅ 最新最強
  apiKey: GEMINI_PRO_30,
  temperature: 0.3,
  use: '數據清洗、架構設計、去重'
}
```

### 高速處理（大量任務）

```javascript
{
  model: 'gemini-2.5-flash',  // ✅ 快速穩定
  apiKey: GEMINI_PRO_25,
  temperature: 0.5,
  use: '批量代碼生成、快速分析'
}
```

### 客服陣列（免費層）

```javascript
{
  model: 'gemini-2.5-flash-lite',  // ✅ 免費層最佳
  apiKey: FREE_KEYS[i],
  temperature: 0.7,
  use: '電報客服、簡單問答'
}
```

---

## 📊 速率對照（Paid Tier 1）

| 模型 | RPM | TPM | RPD | 用途 |
|------|-----|-----|-----|------|
| **gemini-3-pro-preview** | **25** | **1M** | **250** | **數據清洗** |
| gemini-2.5-pro | 150 | 2M | 10K | 備用/高並發 |
| gemini-2.0-flash-lite | 4K | 4M | ∞ | 高速處理 |

---

## ⚠️ 重要發現

1. **Gemini 3 Pro 模型名稱**: `gemini-3-pro-preview`（不是 `gemini-3-pro`）
2. **已可用**: Paid Tier 1 可以直接使用
3. **速率限制**: 25 RPM, 1M TPM, 250 RPD
4. **成本**: 與 2.5 Pro 相同（輸入 $1.25/1M, 輸出 $5/1M）

---

## 🧪 測試命令

```bash
# 測試 Gemini 3 Pro Preview
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "測試 Gemini 3 Pro Preview"}]
    }],
    "generationConfig": {
      "temperature": 0.3,
      "maxOutputTokens": 100
    }
  }'
```

---

**維護者**: DeepWeay SMS Team  
**版本**: v1.0  
**狀態**: ✅ **VERIFIED**

