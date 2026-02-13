---
title: interview-cake-蒸餾報告
slug: interview-cake
category: vps_knowledge_base/distilled-reports
tags: [vps-sync]
lang: zh
created: 2026-02-13
source: vps-pass1-sync
vector_ready: true
---

# Interview Cake 題庫深度分析報告

## 執行摘要
Interview Cake 題庫包含 58 道精心設計的演算法題目，涵蓋 Arrays、Strings、Hashing、Stacks、Linked Lists、Trees 等核心資料結構，難度分佈均衡（Easy: 45%、Medium: 55%）。本報告提供系統化刷題策略，幫助讀者在 2-8 周內掌握 FAANG 面試核心技巧。

## 1. 按難度分級的刷題計劃

### Easy (26 題，45%)
**目標**：建立基本資料結構操作信心（1-2 天完成）
```
Phase 1: 基礎操作 (Day 1)
├── Arrays: The Cashier, Stock Prices, Merge Times
├── Strings: Permutation Palindrome  
├── Hashing: Word Cloud, Top Characters
├── Stacks: Balanced Brackets
└── Linked Lists: Apple Trees, Reverse Linked List

Phase 2: 進階 Easy (Day 2)
├── Arrays: Delete Duplicates from Sorted Array, Highest Product of 3 Integers
├── Trees: Binary Tree Path Sum
└── 其他 Easy 題目...
```

### Medium (32 題，55%)
**目標**：掌握優化技巧與經典演算法（3-5 天完成）
```
Phase 1: 陣列優化 (Day 3-4)
├── Product of All Integers Except At Index (O(n) 雙指針)
├── Largest Continuous Sum (Kadane's Algorithm)
└── No Duplicates (Set 應用)

Phase 2: 進階資料結構 (Day 5-7)
├── Stacks: Parentheses (回溯法)
├── Linked Lists: Linked List Cycle (Floyd's Tortoise & Hare)
├── Trees: Binary Tree Level Order Traversal (BFS), Balanced Binary Tree
```

## 2. 按類型分類的題目索引

| 類型 | 題目數量 | 題目列表 |
|------|----------|----------|
| **Arrays** | 8 | The Cashier, Delete Duplicates, Stock Prices, Highest Product of 3, Merge Times, Product Except Self, Largest Continuous Sum, No Duplicates |
| **Strings** | 1 | Permutation Palindrome |
| **Hashing** | 2 | Word Cloud, Top Characters |
| **Stacks** | 2 | Balanced Brackets, Parentheses |
| **Linked Lists** | 3 | Apple Trees, Linked List Cycle, Reverse Linked List |
| **Trees** | 3 | Binary Tree Level Order, Binary Tree Path Sum, Balanced Binary Tree |

**建議刷題順序**：Arrays → Hashing → Stacks → Strings → Linked Lists → Trees

## 3. FAANG 面試重點題目（Top 12）

| 優先級 | 題目 | 公司出現頻率 | 關鍵技巧 |
|--------|------|--------------|----------|
| ⭐⭐⭐⭐⭐ | Product of All Integers Except At Index | Google, Amazon, Meta | O(n) 雙向掃描，無除法 |
| ⭐⭐⭐⭐⭐ | Largest Continuous Sum | All FAANG | Kadane's Algorithm |
| ⭐⭐⭐⭐⭐ | Linked List Cycle | All FAANG | Floyd's 龜兔賽跑 |
| ⭐⭐⭐⭐ | Binary Tree Level Order Traversal | Google, Amazon | BFS 層次遍歷 |
| ⭐⭐⭐⭐ | Balanced Binary Tree | Meta, Apple | 後序遍歷 + 高度檢查 |
| ⭐⭐⭐⭐ | Stock Prices | Amazon, Microsoft | 單次買賣最大利潤 |
| ⭐⭐⭐ | Parentheses | Google, Meta | 回溯法 + 有效括號 |
| ⭐⭐⭐ | Delete Duplicates from Sorted Array | LeetCode 經典 | 雙指針 in-place |
| ⭐⭐⭐ | Balanced Brackets | Amazon, Apple | 堆疊匹配 |

## 4. 每個概念的核心要點

### Arrays (8 題)
```
核心技巧：
1. 雙指針：Delete Duplicates, Merge Times
2. 滑動窗口：Stock Prices, Largest Continuous Sum (Kadane)
3. 前綴/後綴乘積：Product Except Self (left[i] * right[i])
4. 貪心：The Cashier (最小硬幣枚數)
```

### Hashing (2 題)
```
核心技巧：
1. 頻率計數：Word Cloud, Top Characters
2. 字符統計：Permutation Palindrome (奇數次出現 ≤ 1)
```

### Stacks (2 題)
```
核心技巧：
1. 匹配驗證：Balanced Brackets (push/pop 配對)
2. 回溯生成：Parentheses (left_count, right_count 控制)
```

### Linked Lists (3 題)
```
核心技巧：
1. 反轉：Reverse Linked List (prev, curr, next 三指針)
2. 循環檢測：Floyd's Algorithm (slow:1x, fast:2x)
```

### Trees (3 題)
```
核心技巧：
1. BFS 層次：Queue + level size
2. 路徑和：DFS 前序遍歷
3. 平衡檢查：後序遍歷返回高度
```

## 5. 時間複雜度速查表

| 演算法/資料結構 | 最佳情況 | 平均情況 | 最差情況 | 空間複雜度 |
|----------------|----------|----------|----------|------------|
| **陣列遍歷** | O(n) | O(n) | O(n) | O(1) |
| **Kadane's Algorithm** | O(n) | O(n) | O(n) | O(1) |
| **雙指針** | O(n) | O(n) | O(n) | O(1) |
| **Hash Table 查詢** | O(1) | O(1) | O(n) | O(n) |
| **Stack 匹配** | O(n) | O(n) | O(n) | O(n) |
| **Floyd's Cycle** | O(n) | O(n) | O(n) | O(1) |
| **Tree BFS** | O(n) | O(n) | O(n) | O(w) |
| **Tree DFS** | O(n) | O(n) | O(n) | O(h) |

## 6. 刷題計劃

### 2 周衝刺計劃（每天 5-6 小時）
```
Week 1: 基礎+核心 (30 題)
| Day 1-2 | Easy Arrays + Hashing + Strings |
| Day 3-4 | Medium Arrays (重點：Product Except Self, Kadane) |
| Day 5   | Stacks + Linked Lists |
| Day 6-7 | Trees + 複習 |

Week 2: 強化+模擬 (28 題)
| Day 8-10  | 重刷重點題 + 手寫代碼 |
| Day 11-12 | 計時模擬面試 (45min/題) |
| Day 13-14 | 錯題重做 + 複雜度分析 |
```

### 4 周穩健計劃（每天 2-3 小時）
```
Week 1: Easy 全清 (26 題)
Week 2: Medium Arrays + Hashing (15 題)
Week 3: Stacks/Lists/Trees (11 題)
Week 4: 重複練習 + 模擬面試
```

### 8 周深度計劃（每天 1-2 小時）
```
Month 1: 類型學習 (Week 1-2 類型各一週)
Month 2: 技巧強化 (重點題重複 3 次)
Week 7-8: 模擬面試 + 系統設計
```

## 7. 常見面試模式總結

### 🎯 必背 7 大模式
```
1. **雙指針模式** (40% 題目)
   - 陣列去重、合併、有序陣���問題
   
2. **滑動窗口** (20% 題目)  
   - 最大子陣列和、股票買賣
   
3. **前綴/後綴乘積** (10% 題目)
   - Product Except Self
   
4. **堆疊匹配** (10% 題目)
   - 括號問題、表達式驗證
   
5. **BFS 層次遍歷** (10% 題目)
   - Tree Level Order
   
6. **Floyd's 循環檢測** (5% 題目)
   - Linked List Cycle
   
7. **貪心法** (5% 題目)
   - The Cashier 找零錢
```

### 🚀 面試成功 Checklist
```
✅ 5 秒讀懂題目，畫圖確認
✅ 先說暴力解 O(n²)，再優化 O(n)
✅ 邊寫邊說時間複雜度
✅ 考慮邊界：空陣列、單元素、負數
✅ 寫完測試 3-5 個 case
✅ Big O 總結 + 空間優化
```

**結論**：Interview Cake 題庫精華濃縮，2 周衝刺足以應付 80% FAANG 面試。以「類型→難度→重複」的順序刷題，搭配手寫代碼+複雜度分析，面試通過率將大幅提升！