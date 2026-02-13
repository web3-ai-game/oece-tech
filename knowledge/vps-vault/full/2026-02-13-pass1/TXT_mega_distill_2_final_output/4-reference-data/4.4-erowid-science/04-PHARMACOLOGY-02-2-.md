---
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. 主要作用機制分類

### 2.1 血清素能 (Serotonergic) 物質
#### 2.11 5-HT2A 激動劑 (經典致幻劑)
背景：這些物質模擬血清素，源自於印加文化中使用仙人掌（mescaline）或亞馬遜原住民使用ayahuasca（DMT）。原理：通過激活5-HT2A受體，干擾感覺處理，導致視覺扭曲和意識擴展。實例：LSD在音樂節中常見，使用者報告"看到音樂"。

擴展表格：

| 物質 | 類別 | 作用時間 | 典型劑量 | 常見副作用 |
|------|------|----------|----------|------------|
| LSD | Lysergamide | 8-12h | 50-200μg | 焦慮、偏執 |
| Psilocybin | Tryptamine | 4-6h | 10-50mg | 噁心、情緒波動 |
| DMT | Tryptamine | 15-45min | 20-60mg | 強烈視覺、恐慌 |
| Mescaline | Phenethylamine | 8-12h | 200-400mg | 胃部不適 |
| 2C-B | Phenethylamine | 4-6h | 15-30mg | 視覺增強 |
| DOB/DOC | Amphetamine | 12-24h | 1-3mg | 長效刺激 |

共同特徵深度：視覺增強可能包括幾何圖案，感知扭曲如時間延展，意識改變可引發內省或神秘體驗，如"ego death"。

#### 2.12 代碼範例：模擬5-HT2A激動劑效應
以下Python代碼模擬簡單的幻覺視覺效應，使用random模組生成感知扭曲。

```python
import random  # 用於生成隨機扭曲

# 模擬LSD視覺扭曲
def simulate_lsd_visual(distortion_level=5):
    """模擬LSD的視覺增強：生成隨機顏色和圖案變化"""
    colors = ['red', 'blue', 'green', 'yellow']  # 基本顏色
    for i in range(distortion_level):
        pattern = random.choice(colors) + " swirling"  # 模擬圖案
        print(f"Visual: {pattern} at intensity {i+1}")

simulate_lsd_visual(7)  # 執行模擬
```

### 2.2 多巴胺能 (Dopaminergic) 物質
#### 2.21 釋放劑/再攝取抑制劑
背景：源自於19世紀的古柯葉使用（cocaine），現代合成如amphetamine用於ADHD治療。原理：增加多巴胺水平，強化獎勵迴路，導致欣快但也成癮。實例：MDMA在派對文化中流行，使用者體驗"empathy rush"。

擴展表格：

| 物質 | 機制 | 風險 | 典型效應 | 歷史使用 |
|------|------|------|----------|----------|
| Amphetamine | DA/NE 釋放 | 成癮性高 | 警覺、欣快 | 二戰士兵 |
| Methamphetamine | DA 釋放 | 神經毒性 | 極端興奮 | 濫用流行 |
| Cocaine | DA 再攝取抑制 | 心血管 | 短暫高潮 | 南美傳統 |
| MDMA | DA/5-HT 釋放 | 神經毒性 | 親密感 | 療法試驗 |

#### 2.22 代碼範例：多巴胺水平模擬
Python腳本模擬多巴胺釋放。

```python
def simulate_dopamine_release(substance='Amphetamine', dose=10):
    """模擬多巴胺釋放：基於劑量計算峰值"""
    base_da = 100  # 正常多巴胺水平
    release_factor = 2 if substance == 'Amphetamine' else 3  # 物質因素
    peak_da = base_da + (dose * release_factor)  # 計算峰值
    print(f"{substance} peak dopamine: {peak_da}%")

simulate_dopamine_release('MDMA', 100)  # 執行
```

### 2.3 NMDA 拮抗劑 (解離類)
背景：Ketamine源自1960年代作為麻醉劑，後用於抑鬱治療。原理：阻斷NMDA受體，抑制谷氨酸訊號，導致解離感。實例：PCP在1970年代濫用導致"angel dust"危機。

擴展表格：

| 物質 | 親和力 | 特性 | 醫療應用 | 濫用風險 |
|------|--------|------|----------|----------|
| Ketamine | 高 | K-hole | 抑鬱治療 | 膀胱損傷 |
| PCP | 極高 | 長效 | 無 | 暴力行為 |
| DXM | 中 | 平台效應 | 止咳 | 肝毒性 |
| Nitrous | 低 | 極短效 | 牙科 | 缺氧 |
| MXE | 高 | 類酮胺 | 無 | 成癮 |

共同特徵：自我解離如出體體驗，止痛效應用於手術。

#### 2.31 代碼範例：解離效應模擬
```python
import time  # 用於延遲

def simulate_dissociation(substance='Ketamine', duration=60):
    """模擬解離：漸進式意識斷裂"""
    for sec in range(duration):
        if sec % 10 == 0:
            print(f"Time {sec}: Feeling detached...")  # 模擬斷裂
        time.sleep(1)  # 延遲效應

simulate_dissociation()  # 執行
```

### 2.4 阿片類 (Opioidergic) 物質
#### 2.41 μ-opioid 激動劑
背景：鴉片自古以來用於止痛，heroin是19世紀合成。原理：結合μ受體，抑制疼痛訊號並釋放內啡肽。實例：Fentanyl危機導致美國過量死亡激增。

擴展表格：

| 物質 | 效價 | 作用時間 | 醫療用 | 風險 |
|------|------|----------|--------|------|
| Morphine | 1x | 4-6h | 止痛 | 依賴 |
| Heroin | 2-4x | 4-5h | 無 | 過量 |
| Fentanyl | 80-100x | 1-2h | 手術 | 呼吸抑制 |
| Oxycodone | 1.5x | 4-6h | 慢性痛 | 濫用 |
| Kratom | 部分 | 3-5h | 替代 | 依賴 |

風險深度：呼吸抑制可致命，耐受性導致劑量增加。

#### 2.42 代碼範例：阿片效價計算
```python
def calculate_potency(substance='Fentanyl', base='Morphine'):
    """計算相對效價"""
    potencies = {'Morphine': 1, 'Heroin': 3, 'Fentanyl': 90}  # 效價字典
    relative = potencies[substance] / potencies[base]  # 相對值
    print(f"{substance} is {relative}x stronger than {base}")

calculate_potency('Heroin')  # 執行
```

### 2.5 GABAergic 物質
#### 2.51 GABA-A 調節劑
背景：Alcohol是人類最古老的鎮靜劑，benzodiazepines自1960年代用於焦慮。原理：增強GABA抑制，降低神經活性。實例：GHB在club中使用導致昏迷事件。

擴展表格：

| 物質 | 類型 | 風險 | 效應 | 撤退症狀 |
|------|------|------|------|----------|
| Alcohol | 正向調節 | 肝毒性 | 鬆弛 | 震顫 |
| Benzodiazepines | 正向調節 | 依賴性 | 抗焦慮 | 癲癇 |
| Barbiturates | 正向調節 | 過量風險 | 催眠 | 致命 |
| GHB | GABA-B | 昏迷風險 | 欣快 | 焦慮 |

### 2.6 抗膽鹼能 (Anticholinergic) 物質
背景：源自毒草如datura，用於古代儀式。原理：阻斷乙酰膽鹼，導致譫妄。實例：Scopolamine用於哥倫比亞犯罪。

擴展表格：

| 物質 | 來源 | 危險級別 | 效應 | 恢復時間 |
|------|------|----------|------|----------|
| Scopolamine | Datura | ⚠️ 極高 | 譫妄 | 數天 |
| Atropine | Belladonna | ⚠️ 高 | 乾嘴 | 數小時 |
| Diphenhydramine | OTC | ⚠️ 中 | 嗜睡 | 數小時 |

效應：真實幻覺如與不存在的人交談。

#### 2.61 代碼範例：抗膽鹼效應模擬
```python
def simulate_delirium(intensity=5):
    """模擬譫妄：生成隨機幻覺描述"""
    hallucinations = ['seeing shadows', 'talking to ghosts']  # 幻覺類型
    for _ in range(intensity):
        print(random.choice(hallucinations))  # 輸出幻覺

simulate_delirium(6)  # 執行
```

### 2.7 大麻素能 (Cannabinoid) 物質
背景：大麻使用可追溯至古中國，CBD近年用於癲癇。原理：結合CB1/CB2受體，調節疼痛和情緒。實例：Synthetic cannabinoids導致不可預測的癲癇。

擴展表格：

| 物質 | 受體 | 效應 | 法律狀態 | 副作用 |
|------|------|------|----------|--------|
| THC | CB1/CB2 | 精神活性 | 部分合法 | 偏執 |
| CBD | 多重 | 抗焦慮 | 合法 | 無明顯 |
| Synthetic | CB1 | 不可預測 | 非法 | 心律不整 |

### 2.8 κ-Opioid 激動劑
背景：Salvia源自墨西哥原住民，ibogaine用於成癮治療。原理：激活κ受體，導致強烈解離而非欣快。實例：Salvinorin A trip持續短但強烈。

擴展表格：

| 物質 | 來源 | 效應 | 持續時間 | 潛在益處 |
|------|------|------|----------|----------|
| Salvinorin A | Salvia | 強烈解離 | 5-20min | 無 |
| Ibogaine | Iboga | 致幻 | 24h+ | 斷癮 |

#### 2.81 代碼範例：κ-Opioid效應模擬
```python
def simulate_kappa_trip(duration=10):
    """模擬Salvia解離"""
    for min in range(duration):
        print(f"Minute {min}: Entering alternate reality...")  # 模擬trip

simulate_kappa_trip(15)  # 執行
```

### 2.9 額外代碼範例：藥物分類器
```python
def classify_substance(name):
    """簡單分類器基於名稱"""
    categories = {'LSD': 'Serotonergic', 'Cocaine': 'Dopaminergic'}  # 字典
    return categories.get(name, 'Unknown')  # 返回分類

print(classify_substance('LSD'))  # 執行
```

```python
import pandas as pd  # 需要pandas庫

# 創建數據框模擬藥物數據
data = {'Substance': ['LSD', 'Ketamine'], 'Category': ['Serotonergic', 'NMDA']}
df = pd.DataFrame(data)
print(df)  # 輸出表格
```
