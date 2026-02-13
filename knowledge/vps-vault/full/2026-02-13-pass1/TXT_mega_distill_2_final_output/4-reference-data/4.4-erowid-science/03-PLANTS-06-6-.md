---
distilled_by: grok-4-0709
mode: B
---
part: 6
---

## 6. 代碼範例：Python 處理植物數據

以下提供 5-8 個 Python 代碼範例，用於教育目的，如查詢、分類或簡單分析植物數據。這些是參考腳本，非操作指南。

### 6.1 範例1：植物清單字典
```python
# 範例：建立精神活性植物字典
plants = {
    "Psilocybin Mushrooms": {"component": "Psilocybin", "duration": "4-6 hours"},
    "Salvia divinorum": {"component": "Salvinorin A", "duration": "5-15 min"}
}
# 註釋：用於快速查詢活性成分與作用時間
print(plants["Psilocybin Mushrooms"])
```

### 6.2 範例2：過濾致幻植物
```python
# 範例：過濾效果類型
all_plants = [("Acacia", "DMT", "hallucinogen"), ("Kava", "Kavalactones", "relaxant")]
hallucinogens = [p for p in all_plants if p[2] == "hallucinogen"]
# 註釋：返回致幻植物列表，用於研究分類
print(hallucinogens)
```

### 6.3 範例3：風險等級排序
```python
# 範例：排序風險
risks = {"Datura": "extreme", "Kava": "low", "Ayahuasca": "medium"}
sorted_risks = sorted(risks.items(), key=lambda x: x[1])
# 註釋：按風險等級排序，幫助教育風險評估
print(sorted_risks)
```

### 6.4 範例4：生成報告
```python
# 範例：簡單報告生成
def generate_report(plant, component, effect):
    return f"Plant: {plant}\nComponent: {component}\nEffect: {effect}"
# 註釋：用於產生教育報告
print(generate_report("Peyote", "Mescaline", "hallucinogenic"))
```

### 6.5 範例5：數據視覺化偽碼
```python
# 範例：偽碼 - 繪製作用時間圖
import matplotlib.pyplot as plt  # 需要安裝
durations = {"Mushrooms": 5, "Ayahuasca": 5, "Peyote": 10}
plt.bar(durations.keys(), durations.values())
# 註釋：視覺化比較作用時間
plt.show()
```

### 6.6 範例6：查詢 URL
```python
# 範例：生成 Erowid URL
base_url = "https://erowid.org/plants/"
plant = "mushrooms"
full_url = base_url + plant + "/"
# 註釋：自動生成參考連結
print(full_url)
```

### 6.7 範例7：成分比較
```python
# 範例：比較成分
def compare_components(p1, p2):
    if p1 == p2:
        return "相同成分"
    return "不同成分"
# 註釋：用於分析相似植物
print(compare_components("Peyote", "San Pedro"))  # Mescaline - 相同
```

### 6.8 範例8：隨機選擇植物
```python
import random
# 範例：隨機教育選擇
plants_list = ["Ayahuasca", "Kratom", "Salvia"]
random_plant = random.choice(plants_list)
# 註釋：用於隨機學習模擬
print(f"今日學習: {random_plant}")
```
