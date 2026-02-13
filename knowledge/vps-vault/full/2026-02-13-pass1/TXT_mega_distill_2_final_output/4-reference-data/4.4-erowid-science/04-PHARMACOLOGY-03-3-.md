---
distilled_by: grok-4-0709
mode: B
---
part: 3
---

## 3. 藥代動力學

### 3.1 給藥途徑比較
背景：途徑影響吸收速度，源自藥物開發歷史。原理：生物利用度決定有效劑量。實例：注射用於緊急醫療。

擴展表格如原內容，並添加：

| 途徑 | 優點 | 缺點 | 示例物質 |
|------|------|------|----------|
| 吸入 | 快速 | 肺損傷 | DMT |
| 鼻內 | 方便 | 鼻膜刺激 | Cocaine |
| 舌下 | 避開肝臟 | 味苦 | LSD |
| 口服 | 易用 | 第一過效應 | Psilocybin |
| 注射 | 精準 | 感染風險 | Heroin |

#### 3.11 代碼範例：生物利用度計算
```python
def bioavailability(route='Oral'):
    """估計生物利用度"""
    rates = {'Injection': 100, 'Oral': 50}  # 百分比
    return rates.get(route, 0)

print(bioavailability('Injection'))  # 執行
```

### 3.2 藥物相互作用
#### 3.21 危險組合
背景：許多過量來自組合，如opioid危機。原理：協同效應放大風險。

擴展表格如原內容。

#### 3.22 減害組合
實例：Naloxone拯救無數生命。
