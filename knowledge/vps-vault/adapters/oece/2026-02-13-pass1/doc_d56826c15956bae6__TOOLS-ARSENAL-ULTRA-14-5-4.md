---
title: 🛠️ 工具武器庫 | TOOL ARSENAL
category: 2-knowledge-base/2.4-engineering
source: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md
distilled_by: grok-4-0709
mode: B
---
part: 14
---

## 5.4 Stable Diffusion提示工程

```python
# 使用Hugging Face庫
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4")
image = pipe("cyberpunk cityscape").images[0]  # 生成圖像
image.save("city.png")  # 保存圖像
```
