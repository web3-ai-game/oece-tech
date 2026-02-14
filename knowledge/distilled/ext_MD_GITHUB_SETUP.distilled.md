---
source: ext_MD_GITHUB_SETUP.md
distilled_at: 2026-02-14T09:30:44.175Z
model: grok-4-1-fast-non-reasoning
---

# GitHub 個人知識庫倉庫設置指南

本文檔提供基於您現有本地知識庫（`MD` 目錄）的完整 GitHub 倉庫創建與同步流程。該知識庫包含 **1016本書籍**（~313 MB）和**結構化數據**（~34 MB），總大小約 **350 MB**。遵循此指南可安全將您的私人知識庫上傳至 GitHub。

## 📋 前置條件檢查
```
✅ Git 已初始化
✅ 所有文件已提交  
✅ 廢料已在 .gitignore
⏳ 等待推送到 GitHub
```

**當前目錄狀態確認命令：**
```bash
cd /mnt/sms/MD
git status
# 應顯示乾淨的工作目錄
du -sh .  # 確認總大小 ~350 MB
```

## 🚀 步驟 1：創建 GitHub 私有倉庫

1. 訪問 **[GitHub 新倉庫頁面](https://github.com/new)**
2. 填寫倉庫信息：
   ```
   倉庫名稱: MD
   描述: 個人知識庫 - 1016本書籍 + 結構化數據
   ✅ 設為 Private（強烈推薦）
   ❌ 不要勾選 "Add a README file"
   ```
3. 點擊 **"Create repository"**

**⚠️ 重要提示：**
- **私有倉庫**保護您的知識資產不被公開訪問
- 350 MB 大小完全在 GitHub 免費賬戶限制內（單倉庫 5GB）

## 🔑 步驟 2：生成 Personal Access Token

由於 GitHub 已棄用密碼認證，必須使用 Token：

1. 訪問 **[Personal Access Tokens 設置](https://github.com/settings/tokens)**
2. 點擊 **"Generate new token" → "Generate new token (classic)"**
3. 配置：
   ```
   Token 名稱: MD Knowledge Base
   過期時間: 無限期（或按需設置）
   權限勾選: ✅ repo（完整倉庫訪問）
   ```
4. **複製生成的 Token**（⚠️ 只顯示一次！安全保存）

**認證信息：**
```
Username: YOUR_USERNAME
Password: gh[paste-your-token-here]
```

## 📤 步驟 3：首次推送至 GitHub

在終端執行以下命令（替換 `YOUR_USERNAME`）：

```bash
cd /mnt/sms/MD

# 添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/MD.git

# 確保主分支名稱正確
git branch -M main

# 首次推送（輸入 Token 作為密碼）
git push -u origin main
```

**預期輸出：**
```
Enumerating objects: X, done.
...
To https://github.com/YOUR_USERNAME/MD.git
 * [new branch]      main → main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🔄 步驟 4：後續同步命令

日常更新使用簡化流程：

```bash
cd /mnt/sms/MD

# 添加變更
git add .

# 提交（自定義訊息）
git commit -m "Update: description"

# 推送
git push
```

**完整工作流程示例：**
```bash
git add .
git commit -m "Update: 添加新書 + 更新結構數據"
git push
```

## 📊 倉庫內容概覽

| 組件 | 大小 | 說明 |
|------|------|------|
| **Books** | ~313 MB | 1016本書籍全文/筆記 |
| **Structures** | ~34 MB | 結構化數據（索引、元數據） |
| **Total** | ~350 MB | 完整知識庫 |

## 🔧 故障排除

### 推送失敗 - 認證錯誤
```
remote: Support for password authentication was removed
```
**解決：** 使用 Personal Access Token 替代密碼

### 推送失敗 - 大文件限制
```
remote: error: file too large
```
**檢查：** GitHub 單文件限制 100MB，您的文件均符合要求

### 遠端倉庫已存在
```
remote origin already exists
```
**解決：**
```bash
git remote remove origin
# 重新執行步驟 3
```

## ✅ 完成驗證

推送成功後：
1. 訪問 `https://github.com/YOUR_USERNAME/MD`
2. 確認文件樹結構正確
3. 檢查 **Settings → General → Danger Zone** 顯示正確倉庫大小 (~350 MB)

## 🎉 下一步建議

1. **啟用 GitHub Pages**（私有分支）用於離線瀏覽
2. **設置 Webhook** 實現自動備份
3. **添加 GitHub Actions** 自動整理元數據

**您的私人知識庫現已安全存儲在 GitHub！** 🚀