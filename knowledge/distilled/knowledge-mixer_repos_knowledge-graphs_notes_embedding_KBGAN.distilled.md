---
source: knowledge-mixer_repos_knowledge-graphs_notes_embedding_KBGAN.md
category: oece
distilled_at: 2026-02-14T09:06:19.343Z
model: grok-4-1-fast-non-reasoning
---

# 使用 GAN 生成負樣本提升知識圖譜連結預測

## 介紹

知識圖譜 (Knowledge Graph, KG) 是結構化的知識表示形式，廣泛應用於搜尋引擎、推薦系統和問答系統中。它們通常由事實三元��� (subject-predicate-object, 如 (Paris, capitalOf, France)) 組成。然而，傳統知識圖譜僅包含**正向事實 (positive facts)**，缺乏負向事實 (negative facts，例如 (Paris, capitalOf, Germany) 是錯誤的)。這導致模型在學習時容易過度擬合正樣本，影響連結預測 (link prediction) 任務的泛化能力。

本文檔介紹一種創新方法：**使用生成對抗網路 (Generative Adversarial Network, GAN) 生成負樣本**，以補充知識圖譜的訓練數據，提升模型性能。該方法已在 FB15k-237、WN18 和 WN18RR 等標準資料集上進行實驗驗證。

## 背景脈絡

### 知識圖譜連結預測的挑戰
- **正負樣本不平衡**：知識圖譜中正樣本稀疏 (僅佔所有可能三元組的極小比例)，負樣本生成是關鍵。
- **傳統負樣本生成**：隨機替換頭實體 (head corruption) 或尾實體 (tail corruption)，但這些負樣本過於簡單，模型易辨識，無法有效挑戰模型。
- **GAN 的優勢**：GAN 由生成器 (Generator) 和鑑別器 (Discriminator) 組成，能產生**逼真負樣本**，模擬真實負向事實的分佈，提高訓練難度與模型魯棒性。

此方法解決了知識圖譜「僅正向事實」的動機問題，透過數據增強實現更全面的學習。

## 方法詳述

### 核心架構：GAN-based ��樣本生成
1. **生成器 (Generator)**：
   - 輸入：隨機噪聲 + 正樣本上下文。
   - 輸出：候選負樣本三元組。
   - 目標：生成難以辨識的「硬負樣本」，接近正樣本分佈邊緣。

2. **鑑別器 (Discriminator)**：
   - 輸入：正樣本 + 生成負樣本。
   - 輸出：真/假標籤。
   - 目標：區分真實正樣本與生成負樣本。

3. **訓練過程**：
   - **對抗訓練**：生成器試圖「欺騙」鑑別器，鑑別器不斷提升辨識能力。
   - **整合到 KG 模型**：生成負樣本用於知識圖譜嵌入模型 (如 TransE、DistMult 或 ComplEx) 的損失計算。
   - 公式簡述：最小化生成器損失 \( \min_G \max_D V(D, G) = \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log (1 - D(G(z)))] \)，其中 \( x \) 為正樣本，\( G(z) \) 為負樣本。

此方法確保負樣本不僅數量充足，還具備高品質與多樣性。

## 實驗驗證

### 資料集
| 資料集     | 描述                  | 實體數 | 關係數 | 三元組數   |
|------------|-----------------------|--------|--------|------------|
| **FB15k-237** | Freebase 子集 (電影/運動/地點) | 14,541 | 237    | 310,116   |
| **WN18**     | WordNet (詞彙關係)    | 40,943 | 18     | 151,442   |
| **WN18RR**   | WN18 精��版 (移除反轉關係) | 40,943 | 11     | 93,003    |

### 結果亮點
- **指標**：Mean Reciprocal Rank (MRR)、Hits@1、Hits@10。
- **性能提升**：相較傳統隨機負採樣，MRR 提升 5-15% (依資料集而異)，尤其在 WN18RR 上顯著 (Hits@10 達 0.55+)。
- **消融研究**：移除 GAN 後性能下降，證明生成負樣本的必要性。

完整結果見原論文表格，證實方法在不同領域 (社會網絡 vs. 詞彙) 的泛化性。

## 實際應用建議

### 實施步驟
1. **環境準備**：PyTorch + DGL/ PyG (知識圖譜庫)，安裝 `torchgan` 或自實作 GAN。
2. **數據處理**：
   - 加載 KG 資料集 (e.g., `torch_geometric.datasets.FB15k_237()`)。
   - 產生初始正樣本池。
3. **模型整合**：
   ```python
   # 簡化偽碼
   generator = GANGenerator(emb_dim=100)
   discriminator = GANDiscriminator(emb_dim=100)
   for epoch in range(100):
       neg_samples = generator(noise)  # 生成負樣本
       loss_d = train_discriminator(pos_samples, neg_samples)
       loss_g = train_generator(discriminator)
       kg_model.update(pos_samples + neg_samples)  # 更新 KG 嵌入
   ```
4. **超參調優**：學習率 1e-4，批次大小 1024，GAN 訓練 50 epochs 後凍結。

### 實用場景
- **推薦系統**：生成「用戶不喜愛項目」負樣本，提���推薦準確率。
- **問答系統**：改善事實查證，減少幻覺 (hallucination)。
- **資源考量**：GPU 需求中等 (RTX 3080 足夠)，訓練時間 ~2-4 小時/資料集。

### 注意事項
- **驗證負樣本品質**：使用 t-SNE 可視化分佈，確保不產生偽正樣本。
- **擴展性**：適用大型 KG 如 Wikidata，結合自監督學習進一步優化。
- **開源資源**：參考 LibKGE 或 OpenKE 框架，論文代碼通常在 GitHub 可用。

此方法為知識圖譜注入「負向智慧」，是當前研究熱點，值得工程師與研究者實踐。