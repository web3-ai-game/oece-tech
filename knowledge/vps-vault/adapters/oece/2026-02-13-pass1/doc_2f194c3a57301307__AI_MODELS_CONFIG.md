---
title: AI MODELS CONFIG
slug: ai-models-config
category: vps_oece_docs
tags: [vps-sync]
lang: zh
created: 2026-02-13
source: vps-pass1-sync
vector_ready: true
---

# 🤖 AI 模型配置指南

> **最後更新**: 2026-01-12
> **用途**: OECE.tech AI 服務模型配置參考

---

## 📊 模型優先級策略

```
1. Grok (xAI) - 主力，無限制
2. Gemini - 免費層，有限流
3. OpenRouter - 備用，$3 限額
```

---

## 🔥 Grok (xAI) - 推薦主力

### 可用模型（2026-01）

| 模型 | Context | Rate Limit | 價格 (per M tokens) | 推薦用途 |
|------|---------|------------|---------------------|----------|
| `grok-4-1-fast-reasoning` | 2M | 4M tpm / 480 rpm | $0.20 / $0.50 | 🔥 **推薦** 複雜推理 |
| `grok-4-1-fast-non-reasoning` | 2M | 4M tpm / 480 rpm | $0.20 / $0.50 | 🔥 **推薦** 日常對話 |
| `grok-code-fast-1` | 256K | 2M tpm / 480 rpm | $0.20 / $1.50 | 代碼生成 |
| `grok-4-fast-reasoning` | 2M | 4M tpm / 480 rpm | $0.20 / $0.50 | 推理任務 |
| `grok-4-fast-non-reasoning` | 2M | 4M tpm / 480 rpm | $0.20 / $0.50 | 快速回覆 |
| `grok-4-0709` | 256K | 2M tpm / 480 rpm | $3.00 / $15.00 | 舊版本 |
| `grok-3-mini` | 131K | 480 rpm | $0.30 / $0.50 | 輕量任務 |
| `grok-3` | 131K | 600 rpm | $3.00 / $15.00 | 標準版 |
| `grok-2-vision-1212` | 32K | 600 rpm | $2.00 / $10.00 | 圖像理解 |
| `grok-2-image-1212` | - | 300 rpm | $0.07/image | 圖像生成 |

### API 端點
```
Base URL: https://api.x.ai/v1
```

### 推薦配置
```typescript
// 日常對話（最便宜 + 無限制）
model: 'grok-4-1-fast-non-reasoning'

// 複雜推理（算命、分析）
model: 'grok-4-1-fast-reasoning'

// 代碼生成
model: 'grok-code-fast-1'
```

---

## 💎 Gemini (Google) - 免費層

### 可用模型（2026-01）

| 模型 | Rate Limit | 價格 | 推薦用途 |
|------|------------|------|----------|
| `gemini-2.5-flash-lite` | 20 rpm (免費) | 免費 | 🔥 **推薦** 展示用 |
| `gemini-2.5-flash` | 5 rpm (免費) | 低價 | 日常對話 |
| `gemini-2.5-pro` | 5 rpm (免費) | 中價 | 複雜任務 |
| `gemini-3.0-flash` | 待確認 | 很便宜 | ⚡ 新模型 |

### API 端點
```
Base URL: https://generativelanguage.googleapis.com/v1beta
```

### 限流說明
- **免費帳戶**: 20 rpm (gemini-2.5-flash-lite)
- **付費帳戶**: 更高限流，但需要計費

---

## 🔄 OpenRouter - 備用（$3 限額）

### 推薦模型

| 模型 | 價格 | 用途 |
|------|------|------|
| `google/gemini-2.0-flash-exp:free` | 免費 | 備用對話 |
| `meta-llama/llama-3.3-70b-instruct` | 低價 | 備用推理 |
| `anthropic/claude-3.5-sonnet` | 中價 | 高質量回覆 |

### API 端點
```
Base URL: https://openrouter.ai/api/v1
```

### 限額策略
- **總預算**: $3 USD
- **用途**: 當 Grok 和 Gemini 都不可用時的備用
- **監控**: 設置告警在 $2.5 時通知

---

## 🎯 OECE.tech 模型分配策略

### 首頁聊天（未登錄）
```
優先級:
1. grok-4-1-fast-non-reasoning (無限制)
2. gemini-2.5-flash-lite (免費，20rpm)
3. openrouter/gemini-2.0-flash-exp:free (備用)
```

### 會員聊天（登錄後）
```
優先級:
1. grok-4-1-fast-reasoning (複雜問題)
2. grok-4-1-fast-non-reasoning (日常對話)
3. gemini-2.5-flash (備用)
```

### 賽博神佛（算命）
```
優先級:
1. grok-4-1-fast-reasoning (推理能力強)
2. gemini-2.5-pro (備用)
```

### 代碼生成
```
優先級:
1. grok-code-fast-1
2. grok-4-1-fast-reasoning
```

---

## 🔐 環境變量配置

```bash
# Grok (xAI) - 主力
XAI_API_KEY=your_xai_api_key
XAI_BASE_URL=https://api.x.ai/v1

# Gemini - 免費層
GEMINI_API_KEY=your_gemini_api_key

# OpenRouter - 備用 ($3 限額)
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BUDGET_LIMIT=3.00
```

---

## ⚠️ 重要提醒

1. **Grok 是無限制的**，優先使用
2. **Gemini 免費層有限流**，作為備用
3. **OpenRouter 有 $3 限額**，僅在緊急情況使用
4. **模型名稱會變化**，定期檢查官方文檔
5. **API Key 不要暴露**，使用環境變量

---

## 📝 更新日誌

- **2026-01-12**: 初始版本，添加 Grok 4.1 Fast 系列
- **待更新**: Gemini 3.0 Flash 發布後更新
