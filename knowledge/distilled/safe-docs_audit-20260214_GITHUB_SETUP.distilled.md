---
source: safe-docs_audit-20260214_GITHUB_SETUP.md
distilled_at: 2026-02-14T09:32:04.733Z
model: grok-4-1-fast-non-reasoning
---

# 個人知識庫 GitHub 倉庫設置指南

本文檔提供基於事實的完整步驟，指導您創建並推送個人知識庫（包含 1016 本書籍 + 結構化數據）至 GitHub。私有倉庫推薦用於保護知識資產。總大小約 350 MB，Git 已本地初始化並準備推送。

## 1. 倉庫創建（GitHub 網頁操作）

1. **訪問 GitHub 新倉庫頁面**：
   ```
   https://github.com/new
   ```

2. **倉庫配置**：
   | 項目 | 設定值 |
   |------|--------|
   | **倉庫名稱** | `MD` |
   | **描述** | `個人知識庫 - 1016本書籍 + 結構化數據` |
   | **公開/私有** | **Private**（推薦，保護隱私） |
   | **初始化 README** | **不要勾選**（避免衝突） |

3. **創建完成後**，複製倉庫 URL：
   ```
   https://github.com/YOUR_USERNAME/MD.git
   ```
   *替換 `YOUR_USERNAME` 為您的 GitHub 用戶名。*

## 2. 本地推送設置

### 先決條件檢查（當前狀態）
```
✅ Git 已初始化
✅ 所有文件已提交  
✅ 廢料已在 .gitignore
⏳ 等待推送到 GitHub
```
- **工作目錄**：`/mnt/sms/MD`
- **倉庫大小**：
  | 組件 | 大小 |
  |------|------|
  | Books | ~313 MB |
  | Structures | ~34 MB |
  | **總計** | **~350 MB**（不含廢料） |

### 推送命令序列

#### 首次推送
```bash
# 進入工作目錄
cd /mnt/sms/MD

# 添加遠程倉庫（替換 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/MD.git

# 設置主分支並推送
git branch -M main
git push -u origin main
```

#### 後續更新推送
```bash
git add .
git commit -m "Update: description"
git push
```

## 3. 認證設置（Personal Access Token）

GitHub 已棄用密碼認證，**必須使用 Personal Access Token**。

### 生成 Token
1. **訪問設置頁面**：
   ```
   https://github.com/settings/tokens
   ```
2. **生成新 Token**：
   - 選擇 **Generate new token (classic)**
   - **權限**：勾選 `repo`（完整倉庫存取）
   - **複製 Token**（僅顯示一次！）

### Git 認證使用
```
Username: YOUR_USERNAME
Password: YOUR_TOKEN（貼上剛生成的 Token）
```

**提示**：首次推送時，系統會提示輸入上述資訊。之後 Git 會快取。

## 4. 故障排除

| 問題 | 解決方案 |
|------|----------|
| `remote origin already exists` | `git remote remove origin` 後重新添加 |
| `refusing to merge unrelated histories` | 使用 `git pull origin main --allow-unrelated-histories` |
| 認證失敗 | 確認 Token 權限包含 `repo`，重新生成 |
| 推送超時（大檔案） | 分批 commit 或使用 `git push --force`（謹慎） |

## 5. 後續維護

- **日常更新**：遵循「添加 → 提交 → 推送」流程
- **備份**：定期下載 ZIP 或使用 `git clone`
- **協作**：Private 倉庫可邀請合作者
- **監控**：GitHub 提供流量與大小統計

**完成後狀態**：您的個人知識庫將安全存儲在 GitHub，總計 ~350 MB，包含 1016 本書籍與結構化數據。

*文檔版本：1.0 | 更新日期：基於提供事實*