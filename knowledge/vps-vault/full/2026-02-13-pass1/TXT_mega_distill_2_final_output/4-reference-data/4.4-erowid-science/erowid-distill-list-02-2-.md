---
title: Erowid.org 蒸餾任務清單 - 深度知識擴展
category: 4-reference-data/4.4-erowid-science
source: erowid/erowid-distill-list.md
distilled_by: grok-4-0709
mode: B
---
part: 2
---

## 2. CHEMICALS 分類深度展開

CHEMICALS 分類涵蓋130頁，聚焦合成或提煉化學物質。背景：這部分源自 Alexander Shulgin 等化學家的研究，記錄 phenethylamines 和 tryptamines。原理：每頁提供化學結構、效果、劑量和風險，基於 peer-reviewed 數據。實例：2C-B 頁面討論其 psychedelics 效果，用於娛樂或治療。

### 2.1 前100頁連結分析

清單列出前100個連結（如 https://erowid.org/chemicals/2cb/2cb.shtml）。背景：這些頁面多為特定化合物，涵蓋從 2C 系列到常見物質如 cocaine。原理：連結結構遵循系統命名，方便搜尋。實例：5-MeO-DMT 頁面解釋其從植物萃取的原理，並討論 toad venom 來源。

| 化合物系列 | 示例連結 | 化學家族 | 常見效果 | 風險對比 |
|------------|----------|----------|----------|----------|
| 2C 系列 | 2cb.shtml, 2ce.shtml | Phenethylamines | 視覺幻覺、euphoria | 低心臟風險 vs. 高過量風險 (e.g., 2C-I-NBOMe) |
| 5-MeO 系列 | 5meo_dmt.shtml | Tryptamines | 強烈神祕體驗 | 短暫 vs. 持久心理影響 |
| 其他合成 | ketamine.shtml, mdma.shtml | Dissociatives/Amphetamines | 解離/興奮 | 醫療用 vs. 娛樂濫用 |
| 常見物質 | alcohol.shtml, caffeine.shtml | Depressants/Stimulants | 放鬆/警覺 | 廣泛可用 vs. 成癮潛力 |

此表格總結化合物對比，強調效果與風險。

### 2.11 代碼範例：解析 CHEMICALS 清單

以下是5-8個代碼範例，使用 Python 處理類似清單。這些範例模擬如何從 Erowid 清單生成結構化數據，帶註釋。

#### 範例1: 讀取並計數連結
```python
# 範例1: 從文本檔案讀取連結並計數
def count_links(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()
    links = [line.strip() for line in lines if line.startswith('https://erowid.org/chemicals/')]
    return len(links)  # 返回 CHEMICALS 連結數量

# 使用: print(count_links('erowid-list.txt'))  # 輸出: 約100
```

#### 範例2: 提取化合物名稱
```python
# 範例2: 從連結提取化合物名稱
import re

def extract_names(links):
    names = []
    for link in links:
        match = re.search(r'/chemicals/([^/]+)/\1\.shtml', link)
        if match:
            names.append(match.group(1))  # 提取如 '2cb'
    return names

# 使用: names = extract_names(links_list)  # 輸出: ['2cb', '2ce', ...]
```

#### 範例3: 生成分類表格
```python
# 範例3: 使用 pandas 生成表格
import pandas as pd

data = {'分類': ['chemicals', 'plants'], '頁數': [130, 70]}
df = pd.DataFrame(data)
print(df.to_markdown())  # 輸出 Markdown 表格
```

#### 範例4: 爬蟲模擬 (注意: 僅教育用途)
```python
# 範例4: 模擬請求 Erowid 頁面 (使用 requests)
import requests

def fetch_page(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.text  # 返回 HTML 內容
    return None

# 使用: content = fetch_page('https://erowid.org/chemicals/2cb/2cb.shtml')
```

#### 範例5: 關鍵字搜尋
```python
# 範例5: 在連結中搜尋特定化合物
def search_compound(links, keyword):
    return [link for link in links if keyword in link]  # 如搜尋 'dmt'

# 使用: dmt_links = search_compound(links, 'dmt')  # 輸出相關連結
```

#### 範例6: 統計化合物類型
```python
# 範例6: 分類化合物到家族
def categorize(links):
    categories = {'phenethylamines': [], 'tryptamines': []}
    for link in links:
        if '2c' in link:
            categories['phenethylamines'].append(link)
        elif 'dmt' in link or '5meo' in link:
            categories['tryptamines'].append(link)
    return categories

# 使用: cats = categorize(links)
```

#### 範例7: 生成 JSON 輸出
```python
# 範例7: 轉換清單到 JSON
import json

def to_json(stats):
    return json.dumps(stats, indent=4)  # 輸出統計為 JSON

# 使用: json_output = to_json({'chemicals': 130})
```

#### 範例8: 視覺化頁數
```python
# 範例8: 使用 matplotlib 繪製柱狀圖
import matplotlib.pyplot as plt

categories = ['chemicals', 'plants']
pages = [130, 70]
plt.bar(categories, pages)
plt.title('Erowid Categories Pages')
plt.show()  # 顯示圖表
```

這些代碼範例展示如何以程式方式處理 Erowid 清單，適用於數據分析。
