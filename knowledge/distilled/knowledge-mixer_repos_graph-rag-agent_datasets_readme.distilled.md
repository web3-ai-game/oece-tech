---
source: knowledge-mixer_repos_graph-rag-agent_datasets_readme.md
distilled_at: 2026-02-14T09:33:49.748Z
model: grok-4-1-fast-non-reasoning
---

# HotpotQA 多智能體評測腳本知識文檔

本指南詳細介紹如何使用多智能體模塊對HotpotQA數據集進行評測。HotpotQA是一個多跳問答（Multi-hop QA）基準數據集，包含需要跨多個支持性段落推理的問題。本腳本透過TF-IDF檢索和大語言模型（LLM）評估，實現對智能體預測的自動化評測。

## 1. 環境準備

### 1.1 下載數據集
HotpotQA dev集（帶干擾項版本）用於測試模型性能，包含約7,405個問題樣本。

```bash
# 進入數據集目錄
cd datasets/

# 下載HotpotQA dev集（約44MB）
wget http://curtis.ml.ccm.edu/datasets/hotpot/hotpot_dev_distractor_v1.json

# 默認文件位置
ls datasets/hotpot_dev_distractor_v1.json
```

**數據集結構**：
- 每個樣本包含：問題、答案、10個支持性段落、10個干擾段落
- 支持短答案（span）和長文檔（document）兩種格式

### 1.2 配置大模型環境
確保已設置必要的API密鑰環境變量：
```bash
export OPENAI_API_KEY="your-openai-api-key"
# 或其他LLM提供商的環境變量
```

### 1.3 腳本位置
評測腳本位於項目根目錄：
```
test/hotpot_multi_agent_eval.py
```

## 2. 快速開始

### 示例命令
在**項目根目錄**執行以下命令，評估前20個樣本：

```bash
python test/hotpot_multi_agent_eval.py \
    --limit 20 \
    --retrieval-top-k 5 \
    --report-type short_answer \
    --llm-eval \
    --predictions outputs/hotpot_predictions.json
```

**執行流程**：
1. TF-IDF檢索Top-K相關段落
2. 多智能體協作生成答案
3. LLM自動評估正確性
4. 保存預測結果和評測指標至JSON文件

## 3. 參數詳解

| 參數 | 說明 | 類型 | 默認值 | 必填 |
|------|------|------|--------|------|
| `--dataset` | HotpotQA數據集JSON文件路徑 | 字符串 | `datasets/hotpot_dev_distractor_v1.json` | 否 |
| `--limit` | 僅評估前N條樣本（用於快速測試） | 整數 | 全部（0） | 否 |
| `--retrieval-top-k` | TF-IDF檢索返回的Top-K段落數 | 整數 | - | 是 |
| `--report-type` | Reporter輸出類型<br>`short_answer`：返回答案span<br>`long_document`：返回完整文檔 | 字符串 | `short_answer` | 否 |
| `--llm-eval` | 啟用LLM自動判定答案正確性（推薦） | 旗標 | - | 否 |
| `--predictions` | 保存預測結果和評測指標的JSON文件路徑 | 字符串 | - | 否 |

### 常用參數組合示例

```bash
# 完整評估（全數據集，Top-10檢索，LLM評估）
python test/hotpot_multi_agent_eval.py \
    --retrieval-top-k 10 \
    --report-type short_answer \
    --llm-eval \
    --predictions outputs/full_hotpot_results.json

# 快速測試（前50個樣本）
python test/hotpot_multi_agent_eval.py \
    --limit 50 \
    --retrieval-top-k 5 \
    --llm-eval
```

## 4. 輸出結果

### 4.1 控制台輸出
```
Processing sample 1/20...
Retrieval: Top-5 paragraphs retrieved
Agent prediction: "The answer is Paris."
LLM Evaluation: Correct ✓ (F1: 1.0)

Joint F1: 0.875 | EM: 0.900 | Progress: 5/20
```

### 4.2 JSON輸出文件（`--predictions`）
```json
{
  "metrics": {
    "joint_f1": 0.823,
    "joint_em": 0.815,
    "support_f1": 0.912,
    "support_em": 0.885
  },
  "predictions": [
    {
      "question_id": "123",
      "question": "Who founded company X?",
      "prediction": "John Doe",
      "gold_answer": "John Doe",
      "is_correct": true,
      "supporting_facts": [...],
      "retrieved_paragraphs": [...]
    }
  ]
}
```

## 5. 評測指標說明

| 指標 | 說明 |
|------|------|
| **Joint F1** | 答案+支持事實同時正確的F1分數（HotpotQA標準指標） |
| **Joint EM** | 答案+支持事實完全匹配的準確率 |
| **Support F1** | 僅支持事實的F1分數 |
| **Support EM** | 僅支持事實的完全匹配準確率 |

## 6. 故障排除

| 問題 | 解決方案 |
|------|----------|
| `FileNotFoundError: datasets/hotpot_dev...` | 執行數據集下載步驟 |
| `OPENAI_API_KEY not found` | 設置環境變量 `export OPENAI_API_KEY=...` |
| `retrieval-top-k is required` | 添加 `--retrieval-top-k 5` 參數 |
| 記憶體不足 | 使用 `--limit 10` 減少批次大小 |

## 7. 性能優化建議

1. **快速調試**：`--limit 20 --retrieval-top-k 3`
2. **標準評測**：`--retrieval-top-k 5 --llm-eval`
3. **完整基準**：移除`--limit`，使用Top-10檢索

此腳本適用於多智能體HotpotQA系統的標準化評測，確保結果可重現且與官方基準一致。