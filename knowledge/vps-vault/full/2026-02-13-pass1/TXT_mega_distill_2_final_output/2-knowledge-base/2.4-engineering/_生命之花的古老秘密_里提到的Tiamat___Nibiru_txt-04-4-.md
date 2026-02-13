---
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 地球形成：Tiamat的毀滅與遺產

### 4.1 背景：Tiamat的角色
Tiamat在巴比倫神話中是原始海洋女神，西琴解讀為一顆古老行星。背景源自《恩努瑪·埃利什》，描述Marduk（可能為尼比魯的化身）與Tiamat的戰鬥。

原理：行星碰撞理論（planetary collision theory），類似月球形成的大碰撞假說（Giant Impact Hypothesis）。

實例：碰撞後，Tiamat碎片形成地球和小行星帶。

### 4.11 原理：碰撞模擬
碰撞涉及動量守恆（conservation of momentum）和能量轉換。

代碼範例3：Python模擬簡單行星碰撞

```python
class Planet:
    def __init__(self, mass, velocity):
        self.mass = mass  # 質量
        self.velocity = velocity  # 速度

def collide(p1, p2):
    # 模擬彈性碰撞
    total_mass = p1.mass + p2.mass
    final_v = (p1.mass * p1.velocity + p2.mass * p2.velocity) / total_mass
    return final_v  # 返回最終速度

tiamat = Planet(5e24, 10)  # Tiamat參數 (kg, m/s)
nibiru = Planet(3e24, -15)  # Nibiru參數
result_v = collide(tiamat, nibiru)  # 計算
print("Post-Collision Velocity:", result_v)  # 輸出
# 註釋：此代碼簡化模擬Tiamat與Nibiru碰撞，忽略碎片形成。實際需3D模擬。
```

### 4.2 遺產與現代影響
這一事件據稱塑造了太陽系結構。爭議包括NASA的行星X搜索。

表格3：Tiamat毀滅前後對比

| 階段          | 描述                      | 結果                      | 現代證據                  |
|---------------|---------------------------|---------------------------|---------------------------|
| 前碰撞       | 完整行星Tiamat           | 穩定軌道                 | 無直接證據               |
| 後碰撞       | 分裂成地球與碎片         | 月球形成                 | 月球岩石樣本分析         |
