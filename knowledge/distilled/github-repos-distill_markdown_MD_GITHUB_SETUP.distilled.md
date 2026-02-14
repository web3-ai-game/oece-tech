---
source: github-repos-distill_markdown_MD_GITHUB_SETUP.md
distilled_at: 2026-02-14T09:31:57.433Z
model: grok-4-1-fast-non-reasoning
---

# GitHub 知識庫倉庫建立與管理指南

本指南詳細說明如何基於現有本地知識庫（包含 1016 本書籍與結構化數據）建立私有 GitHub 倉庫，並完成初始推送與後續同步。當前本地狀態已準備就緒，總大小約 350 MB。

## 1. 創建 GitHub 倉庫

### 步驟
1. 訪問 [GitHub 新倉庫頁面](https://github.com/new)。
2. 填寫倉庫資訊：
   | 欄位     | 內容                                      |
   |----------|-------------------------------------------|
   | **倉庫名稱** | `MD`                                      |
   | **描述**    | `個人知識庫 - 1016本書籍 + 結構化數據`     |
   | **可見性**  | **Private** (推薦，避免公開敏感知識內容)   |
3. **不要勾選**「初始化 README、.gitignore 或許可證」。

完成後，複製倉庫的 HTTPS URL：`https://github.com/YOUR_USERNAME/MD.git`。

## 2. 配置 Personal Access Token (PAT)

GitHub 不再支援密碼認證，必須使用 PAT。

### 生成步驟
1. 訪問 [GitHub 個人存取權杖頁面](https://github.com/settings/tokens)。
2. 點擊 **Generate new token > Generate new token (classic)**。
3. 設定：
   | 權限     | 範圍    | 說明                  |
   |----------|---------|-----------------------|
   | **repo** | ✅ 勾選 | 完整倉庫存取權限      |
4. 生成後**立即複製 Token**（僅顯示一次）。

### 推送時認證
- **Username**: `YOUR_USERNAME`
- **Password**: 貼上剛生成的 Token

## 3. 初始推送至 GitHub

假設當前位於本地目錄 `/mnt/sms/MD`，且狀態為：
- ✅ Git 已初始化
- ✅ 所有文件已提交
- ✅ 廢料已在 `.gitignore`（不影響倉庫大小）

執行以下命令：

```bash
# 切換到知識庫目錄
cd /mnt/sms/MD

# 添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/MD.git

# 確保分支名稱為 main
git branch -M main

# 推送並設定上游分支（輸入 Username 與 Token）
git push -u origin main
```

推送成功後，GitHub 倉庫將包含完整知識庫。

## 4. 後續更新與推送

日常同步流程：

```bash
# 添加所有變更
git add .

# 提交變更（自訂訊息）
git commit -m "Update: description"

# 推送至 GitHub（已設定自動認證）
git push
```

**提示**：若 Token 過期，重複步驟 2 生成新 Token。

## 5. 倉庫內容與大小概覽

| 類別        | 大小     | 說明                     |
|-------------|----------|--------------------------|
| **Books**   | ~313 MB | 1016 本書籍原始檔案      |
| **Structures** | ~34 MB | 結構化數據與索引         |
| **Total**   | ~350 MB | 不含 `.gitignore` 廢料   |

**注意**：GitHub 免費帳戶單倉庫上限 1 GB，本倉庫安全範圍內。

## 6. 當前狀態檢查表

| 項目                  | 狀態 |
|-----------------------|------|
| Git 初始化            | ✅   |
| 文件已提交            | ✅   |
| 廢料已忽略 (.gitignore) | ✅   |
| **推送到 GitHub**     | ⏳ 等待執行 |

## 7. 常見問題排除

| 問題                          | 解決方案                              |
|-------------------------------|---------------------------------------|
| `remote origin already exists` | `git remote remove origin` 後重加    |
| 認證失敗                      | 確認 Token 權限包含 `repo`           |
| 推送過大                      | 分批 commit 或使用 Git LFS（選用）    |
| 忘記 Token                    | 重新生成（舊 Token 自動失效）         |

完成初始推送後，即可透過 GitHub 網頁瀏覽、搜尋與備份您的個人知識庫！