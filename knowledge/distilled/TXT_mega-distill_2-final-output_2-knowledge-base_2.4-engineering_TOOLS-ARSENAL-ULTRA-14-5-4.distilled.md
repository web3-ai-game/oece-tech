---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_TOOLS-ARSENAL-ULTRA-14-5-4.md
distilled_at: 2026-02-14T09:18:14.798Z
model: grok-4-1-fast-non-reasoning
---

# 🛠️ 工具武器庫 | TOOL ARSENAL

**類別**: 2-knowledge-base/2.4-engineering  
**來源**: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md  
**蒸餾者**: grok-4-0709  
**模式**: B  
**部分**: 14  

---

## 5.4 Stable Diffusion 提示工程

### 概述
Stable Diffusion 是一種強大的開源文本到圖像生成模型，由 CompVis 團隊開發，基於擴散模型（Diffusion Models）架構。它能根據自然語言提示（prompt）生成高品質圖像，廣泛應用於藝術創作、設計原型和視覺內容生成。本節聚焦於使用 Hugging Face 的 `diffusers` 庫進行**提示工程**（Prompt Engineering），這是優化生成結果的關鍵技巧，包括提示詞設計、參數調整和管道操作。

**核心庫**: [Hugging Face `diffusers`](https://huggingface.co/docs/diffusers/index) – 一個輕量級、用戶友好的擴散模型推理庫，支持多種 Stable Diffusion 變體。  
**推薦模型**: `"CompVis/stable-diffusion-v1-4"` – Stable Diffusion v1.4 版本，平衡品質與效率，預訓練於 LAION-5B 資料集，擅長生成寫實和藝術風格圖像。

### 安裝依賴
在開始前，確保環境已安裝必要套件：
```bash
pip install diffusers transformers torch accelerate
```
- `torch`: PyTorch 後端（建議 GPU 加速）。
- `accelerate`: 優化模型載入和推理。

### 核心 Python 代碼示例
以下是完整的基本管道（Pipeline），從模型載入到圖像生成與保存：

```python
from diffusers import StableDiffusionPipeline
import torch  # 用於設備管理

# 加載 Stable Diffusion 管道（自動下載模型）
pipe = StableDiffusionPipeline.from_pretrained(
    "CompVis/stable-diffusion-v1-4",
    torch_dtype=torch.float16  # 使用半精度加速（GPU 推薦）
)

# 移至 GPU（若可用）
pipe = pipe.to("cuda")

# 生成圖像：輸入提示詞 "cyberpunk cityscape"
prompt = "cyberpunk cityscape, neon lights, rainy night, highly detailed, cinematic lighting"
image = pipe(prompt).images[0]  # 返回 PIL.Image 物件

# 保存圖像
image.save("city.png")
```

**功能分解**:
1. **加載管道** (`StableDiffusionPipeline.from_pretrained`): 下載並初始化模型權重、VAE（變分自編碼器）和 U-Net。首次運行會緩存模型（約 4GB）。
2. **生成圖像** (`pipe(prompt)`): 輸入提示詞，默認生成 512x512 圖像。返回 `PipelineOutput` 物件，包含 `.images` 清單。
3. **保存圖像** (`image.save`): 使用 PIL 庫輸出 PNG 檔案。

**執行結果示例**: 提示 "cyberpunk cityscape" 會產生霓虹燈都市夜景，融合賽博龐克美學。

### 提示工程最佳實踐
提示工程是提升生成品質的藝術。Stable Diffusion 對提示敏感，以下技巧基於社區經驗：

#### 1. **基本結構**
```
主題 + 細節 + 風格 + 品質修飾語 + 藝術家參考
```
- 示例: `"a majestic dragon flying over mountains, detailed scales, fantasy art by Greg Rutkowski, 8k, volumetric lighting"`

#### 2. **關鍵參數調整**
```python
image = pipe(
    prompt="cyberpunk cityscape",
    negative_prompt="blurry, low quality, distorted",  # 排除不良元素
    num_inference_steps=50,  # 步數（20-50，越多越精細）
    guidance_scale=7.5,      # 提示遵循度（7-12，高值更貼合提示）
    width=512, height=512,   # 解析度（勿超過模型訓練尺寸）
    num_images_per_prompt=1  # 批次大小
).images[0]
```

#### 3. **進階技巧**
- **權重強調**: `(keyword:1.2)` 加強，`[keyword]` 弱化。
  - 示例: `"cyberpunk cityscape (neon lights:1.5), rainy night"`
- **負提示 (Negative Prompt)**: 避免常見缺陷，如 `"ugly, deformed, extra limbs"`.
- **種子控制**: `generator = torch.Generator(device="cuda").manual_seed(42)` 確保可重現。
- **多模型組合**: 切換至 `"runwayml/stable-diffusion-v1-5"` 或 fine-tuned 模型如 Anything V5。

| 參數 | 默認值 | 推薦範圍 | 效果 |
|------|--------|----------|------|
| `guidance_scale` | 7.5 | 5-15 | 提示忠實度 |
| `num_inference_steps` | 50 | 20-100 | 細節與速度 |
| `width/height` | 512 | 512/768 | 解析度（GPU 記憶體限制） |

### 效能優化與注意事項
- **GPU 要求**: 至少 6GB VRAM（RTX 3060+）。使用 `torch_dtype=torch.float16` 減半記憶體。
- **常見錯誤**:
  - `OutOfMemoryError`: 降低解析度或步數。
  - 模型下載失敗: 檢查 Hugging Face 權杖（HF_TOKEN）。
- **擴展**: 整合 ControlNet（姿態控制）或 LoRA（風格微調）以增強提示工程。
- **倫理考量**: 生成內容應遵守版權與道德規範，避免有害提示。

### 資源連結
- [Hugging Face Diffusers 文檔](https://huggingface.co/docs/diffusers/using-diffusers/stable_diffusion)
- [Stable Diffusion 模型庫](https://huggingface.co/models?pipeline_tag=text-to-image&sort=trending)
- [提示工程指南](https://prompthero.com/stable-diffusion-prompt-guide)

此文檔提供即用基礎，鼓勵實驗提示以解鎖創作潛力！