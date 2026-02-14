---
source: knowledge-mixer_repos_knowledge-graphs_notes_QA_strong-baselines.md
distilled_at: 2026-02-14T09:16:59.658Z
model: grok-4-1-fast-non-reasoning
---

# Knowledge Document: A Traditional Approach to Knowledge Base Question Answering (KBQA)

## Introduction

This document describes a traditional machine learning-based pipeline for Knowledge Base Question Answering (KBQA), designed to map natural language questions to structured answers from a knowledge base (KB) like Freebase. The system leverages feature engineering, classical models, and rule-based integration, achieving competitive performance through LSTM fine-tuning as a benchmark. Unlike modern neural end-to-end methods, this approach decomposes QA into modular subtasks: **Entity Detection**, **Entity Linking**, **Relation Prediction**, and **Evidence Integration**. It was evaluated primarily on the **SimpleQuestions** dataset, focusing on single-relation factual questions.

The motivation stems from demonstrating that carefully engineered traditional methods can rival deep learning baselines, particularly in resource-constrained settings where interpretability and efficiency are prioritized.

## System Architecture

The pipeline processes a question through four stages, combining outputs to retrieve precise KB triples (entity-relation-entity).

### 1. Entity Detection
- **Model**: Conditional Random Field (CRF) with hand-crafted feature engineering.
- **Features**: Word shapes, part-of-speech tags, Brown clustering, and contextual n-grams.
- **Output**: Sequence of BIO-tagged entities (e.g., "Who founded Microsoft?" → "Microsoft" as ENTITY).
- **Rationale**: CRFs excel at structured prediction for named entity recognition (NER), outperforming early neural taggers on small datasets like SimpleQuestions.

### 2. Entity Linking
- **Method**: N-gram inverse indexing combined with Levenshtein (edit) Distance.
- **Process**:
  1. Index KB entities by character n-grams (e.g., 3-5 grams for robustness to typos).
  2. Retrieve top candidates via approximate matching.
  3. Rank by normalized Levenshtein Distance (threshold: ~0.8 similarity).
- **Output**: Candidate KB entity IDs (e.g., "Microsoft" → fb:en.microsoft).
- **Advantages**: Efficient for large KBs; handles surface form variations without embeddings.

### 3. Relation Prediction
- **Models**: Ensemble of RNNs (LSTM-based), CNNs, and logistic regression.
- **Features**:
  | Feature Type       | Description                          | Dimensionality |
  |--------------------|--------------------------------------|---------------|
  | TF-IDF            | Term frequency-inverse document frequency on question words | Sparse (~10k) |
  | Bi-grams          | Consecutive word pairs               | Sparse (~50k) |
  | Word Embeddings   | GloVe or Word2Vec averages           | 300           |
  | Relation Words    | Pre-defined lexical triggers (e.g., "founded by" → founder relation) | One-hot       |
- **Training**: Supervised on question-relation pairs from SimpleQuestions; LSTM fine-tuning serves as a strong baseline.
- **Output**: Ranked list of candidate KB relations (e.g., "founded" → fb:founder).
- **Performance Note**: RNNs/CNNs capture sequential patterns; logistic regression provides robustness.

### 4. Evidence Integration
- **Method**: Combinatorial aggregation of top-m entities and top-n relations into candidate entity-relation pairs.
  - Formula: Generate \( m \times n \) pairs, score by joint probability \( P(e_1, r \| q) = P(e_1 \| q) \times P(r \| q) \).
  - Rerank using KB popularity priors and lexical overlap.
- **Query Execution**: For each top pair \((e_1, r)\), retrieve tail entity \(e_2\) from KB and return as answer.
- **Output**: Final ranked list of answers (e.g., "Bill Gates").

## Datasets
- **SimpleQuestions (SQ)**: Primary benchmark.
  - ~100K train / 21K dev / 50K test questions.
  - Format: Single-hop, factual queries (e.g., "Where was Barack Obama born?" → fb:place_of_birth.fb:United_States).
  - KB: Freebase (subset of ~1.2M entities, ~2K relations).
  - Splits enable precise evaluation of each module.

## Experiments and Results
Experiments isolate subtask performance and end-to-end QA accuracy, benchmarking against LSTM fine-tuning ( Hits@1 metric on dev set).

### Key Results Table
| Task                | Method                          | Hits@1 (Dev) | Notes |
|---------------------|---------------------------------|--------------|-------|
| **Entity Linking** | N-gram + Levenshtein            | 89.2%       | Top-10 recall: 97% |
| **Relation Prediction** | RNN/CNN/LogReg Ensemble     | 82.5%       | LSTM fine-tune: 84.1% (comparable) |
| **End-to-End QA**  | Full Pipeline                   | 76.8%       | LSTM fine-tune: 77.2%; ablation shows entity linking as bottleneck |

- **Ablations**:
  - Removing relation words drops relation pred. by 8%.
  - N=5, m=3 yields optimal end-to-end balance.
- **Error Analysis**: 60% errors from multi-entity questions; 25% from rare relations.
- **Runtime**: ~50ms/question on CPU (vs. 200ms for full LSTM).

## Comparison to Baselines
- **LSTM Fine-Tuning**: Achieves comparable end-to-end performance (77.2% vs. 76.8%) but lacks modularity.
- **Strengths**: Interpretable features, no GPU needed, easy to extend (e.g., add multi-hop).
- **Limitations**: Relies on feature engineering; struggles with paraphrasing-heavy datasets.

## Conclusion and Future Work
This pipeline exemplifies effective KBQA via decomposition, matching neural baselines on SimpleQuestions through precise engineering. Future enhancements could integrate pre-trained embeddings or graph neural networks for multi-hop support. Code and models are available for reproducibility.

**References**: Adapted from traditional KBQA papers (e.g., Bordes et al., 2015; Yao & Van Durme, 2014). Last updated: 2023.