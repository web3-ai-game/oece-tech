---
distilled_by: grok-4-0709
mode: B
---
part: 3
---

## 3. 編碼面試準備路線
**目標**：攻克LeetCode Medium/Hard，掌握14+ coding patterns如Sliding Window、Two Pointers。

3.1 **總時長與結構**：78小時（6-10周）。背景：編碼面試聚焦算法效率，源自Donald Knuth的算法理論。

3.11 **核心階段 (30h)**：Grokking the Coding Interview。原理：pattern-based解題，取代傳統DSA樹狀學習。實例：使用two pointers解決container with most water問題。

3.12 **語言實作階段 (18h)**：Python Data Structures & Algorithms。原理：Python的簡潔語法適合快速DSA實現。實例：implement binary search tree。

3.13 **補充階段 (30h)**：Machine Learning Fundamentals（選修）。原理：應用DSA於ML，如k-nearest neighbors。實例：使用Scikit-learn預測房屋價格。

| 階段 | 課程名稱 | 主題 | 時長 | 等級 | 理由 |
|------|----------|------|------|------|------|
| 核心 | Grokking the Coding Interview | Algorithms, DSA | 30h | 中級 | Pattern導向 |
| 語言實作 | Python DSA | Python, Algorithms | 18h | 中級 | 面試主流語言 |
| 補充 | ML Fundamentals | ML, Scikit-learn | 30h | 中級 | ML工程師強化 |

3.2 **代碼範例**：
以下是5個帶註釋的代碼範例，聚焦coding patterns。

3.21 **範例1: Two Pointers (Python)**
```python
# 目的: 找到陣列中和為目標值的兩個數字
def two_sum(nums, target):
    left, right = 0, len(nums) - 1  # 初始化左右指針
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]  # 找到返回索引
        elif current_sum < target:
            left += 1  # 增加左指針以增大和
        else:
            right -= 1  # 減少右指針以減小和
    return []  # 未找到返回空
# 測試: two_sum([2,7,11,15], 9) -> [0,1]
```

3.22 **範例2: Sliding Window (Java)**
```java
// 目的: 找到子陣列最大和
public int maxSubArray(int[] nums) {
    int maxSum = nums[0];  // 初始化最大和
    int currentSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);  // 更新當前窗口和
        maxSum = Math.max(maxSum, currentSum);  // 更新全局最大
    }
    return maxSum;  // 返回結果
}
// 測試: maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) -> 6
```

3.23 **範例3: Binary Search (Go)**
```go
// 目的: 在排序陣列中二分搜尋
func search(nums []int, target int) int {
    left, right := 0, len(nums)-1  // 初始化範圍
    for left <= right {
        mid := left + (right - left)/2  // 計算中點避免溢位
        if nums[mid] == target {
            return mid  // 找到返回索引
        } else if nums[mid] < target {
            left = mid + 1  // 搜尋右半
        } else {
            right = mid - 1  // 搜尋左半
        }
    }
    return -1  // 未找到
}
// 測試: search([]int{-1,0,3,5,9,12}, 9) -> 4
```

3.24 **範例4: DFS (Rust)**
```rust
// 目的: 深度優先搜尋樹的高度
struct TreeNode {
    val: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

fn max_depth(root: Option<Box<TreeNode>>) -> i32 {
    match root {
        Some(node) => {
            let left_depth = max_depth(node.left);  // 遞迴左子樹
            let right_depth = max_depth(node.right);  // 遞迴右子樹
            1 + left_depth.max(right_depth)  // 返回最大深度 +1
        }
        None => 0,  // 空節點深度為0
    }
}
// 測試: 假設樹 [3,9,20,null,null,15,7] -> 3
```

3.25 **範例5: Hash Table (Python)**
```python
# 目的: 檢查重複元素
def contains_duplicate(nums):
    seen = set()  # 使用集合追蹤已見元素
    for num in nums:
        if num in seen:
            return True  # 發現重複
        seen.add(num)  # 添加到集合
    return False  # 無重複
# 測試: contains_duplicate([1,2,3,1]) -> True
```

3.3 **學習建議**：每日1-2題LeetCode + pattern對照。輸出：NeetCode 150全通，mock interview準備就緒。
