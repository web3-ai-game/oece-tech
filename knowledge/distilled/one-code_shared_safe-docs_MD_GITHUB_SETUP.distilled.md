---
source: one-code_shared_safe-docs_MD_GITHUB_SETUP.md
distilled_at: 2026-02-14T09:30:59.005Z
model: grok-4-1-fast-non-reasoning
---

# GitHub 個人知識庫倉庫建立與同步指南

這份文檔詳細說明如何基於現有本地知識庫（`MD` 目錄）創建 GitHub Private 倉庫並完成首次推送與後續同步。知識庫包含 **1016本書籍（~313 MB）** + **結構化數據（~34 MB）**，總大小約 **350 MB**。

## 前置條件檢查
```
✅ Git 已初始化
✅ 所有文件已提交  
✅ 廢料已在 .gitignore
⏳ 等待推送到 GitHub
```

## 步驟 1: 創建 GitHub 倉庫

1. 訪問 **[GitHub 新建倉庫頁面](https://github.com/new)**
2. 填寫倉庫資訊：
   ```
   倉庫名稱: MD
   描述: 個人知識庫 - 1016本書籍 + 結構化數據
   ```
3. **重要設定**：
   - ✅ **設為 Private**（強烈推薦，保護個人知識庫隱私）
   - ❌ **不要初始化 README**（避免與本地衝突）
4. 點擊「**Create repository**」

## 步驟 2: 生成 Personal Access Token（認證憑證）

由於 GitHub 已停用密碼認證，必須使用 Token：

1. 訪問 **[Personal Access Token 設定頁面](https://github.com/settings/tokens)**
2. 點擊「**Generate new token > Generate new token (classic)**」
3. 設定：
   ```
   Token 名稱: MD Repository (可自訂)
   過期時間: 無限制 或 90天
   權限: ✅ repo (完整倉庫存取權限)
   ```
4. **複製生成的 Token**（⚠️ 只顯示一次，請妥善保存）

**使用方式**：
```
Username: YOUR_USERNAME
Password: YOUR_TOKEN (不是 GitHub 帳號密碼)
```

## 步驟 3: 首次推送至 GitHub

在終端機執行以下命令（位於 `/mnt/sms/MD` 目錄）：

```bash
# 添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/MD.git

# 設定分支名稱為 main
git branch -M main

# 推送並設定上游分支
git push -u origin main
```

**認證提示時輸入**：
```
Username: YOUR_USERNAME
Password: YOUR_PERSONAL_ACCESS_TOKEN
```

## 步驟 4: 後續同步命令

日常更新知識庫時，使用以下固定流程：

```bash
git add .
git commit -m "Update: description"
git push
```

### 示例提交訊息
```
git commit -m "Update: 新增 5 本書籍 + 更新結構化索引"
git commit -m "Update: 清理重複文件 + 優化目錄結構"
```

## 倉庫內容概覽

| 類別 | 大小 | 說明 |
|------|------|------|
| **Books** | ~313 MB | 1016本書籍內容 |
| **Structures** | ~34 MB | 結構化數據與索引 |
| **Total** | ~350 MB | 不含 .gitignore 過濾的廢料 |

## 故障排除

### 常見問題
```
❌ remote origin already exists
解決: git remote remove origin
```

```
❌ Permission denied (publickey)
解決: 使用 HTTPS + Token 認證
```

```
❌ Push rejected (non-fast-forward)
解決: git pull --rebase origin main 後再 push
```

### 驗證推送成功
- 訪問 `https://github.com/YOUR_USERNAME/MD`
- 確認文件樹與本地一致
- 檢查倉庫大小 ≈ 350 MB

## 最佳實踐建議

1. **定期備份**：每週至少推送一次
2. **分支管理**：主分支 `main` 用於穩定版本
3. **gitignore 維護**：持續過濾不必要的大文件
4. **Token 安全**：不要提交到代碼中，使用環境變數或 GitHub Actions

**完成後狀態**：  
`✅ 本地知識庫已同步至 GitHub Private 倉庫`

---

*文檔版本：v1.0 | 更新日期：當前時間 | 適用 GitHub 最新版本*