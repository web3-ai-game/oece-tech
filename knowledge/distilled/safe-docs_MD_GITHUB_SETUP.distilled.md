---
source: safe-docs_MD_GITHUB_SETUP.md
distilled_at: 2026-02-14T09:30:53.042Z
model: grok-4-1-fast-non-reasoning
---

# GitHub 知識庫倉庫部署指南

本指南詳細說明如何將本地知識庫（包含 **1016本書籍 + 結構化數據**）部署到 GitHub Private 倉庫。當前本地 Git 已初始化並準備就緒，總大小約 **350 MB**。

## 📋 前置條件檢查
| 項目 | 狀態 |
|------|------|
| Git 初始化 | ✅ 已完成 |
| 所有文件提交 | ✅ 已完成 |
| 廢料文件處理 | ✅ 已加入 `.gitignore` |
| 推送到 GitHub | ⏳ 等待執行 |

**倉庫大小明細**：
- Books 目錄：**~313 MB**
- Structures 目錄：**~34 MB**
- **總計：~350 MB**（不含廢料）

## 🚀 步驟 1：創建 GitHub 倉庫

1. 訪問 [GitHub 新建倉庫頁面](https://github.com/new)
2. 填寫倉庫信息：
   ```
   倉庫名稱：MD
   描述：個人知識庫 - 1016本書籍 + 結構化數據
   ```
3. **重要設置**：
   - ✅ **設為 Private**（強烈推薦，保護個人知識庫）
   - ❌ **不要初始化 README**（避免與本地文件衝突）
4. 點擊 **"Create repository"**

## 🔑 步驟 2：生成 Personal Access Token

由於 GitHub 已棄用密碼認證，必須使用 Token：

1. 訪問 [Personal Access Tokens 設置頁面](https://github.com/settings/tokens)
2. 點擊 **"Generate new token"** → **"Generate new token (classic)"**
3. 設置權限：
   ```
   ✅ repo（完整倉庫權限）
   ```
4. **複製生成的 Token**（⚠️ **僅顯示一次，立即保存！**）

**推送時認證信息**：
```
Username: YOUR_USERNAME
Password: YOUR_TOKEN（不是 GitHub 帳戶密碼）
```

## 📤 步驟 3：首次推送（關鍵步驟）

在終端執行以下命令（位於 `/mnt/sms/MD` 目錄）：

```bash
# 添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/MD.git

# 設置主分支名稱
git branch -M main

# 首次推送（建立上游分支）
git push -u origin main
```

**輸入認證**：
```
Username for 'https://github.com': YOUR_USERNAME
Password for 'https://YOUR_USERNAME@github.com': YOUR_TOKEN
```

## 🔄 步驟 4：後續日常推送

每次更新後執行：

```bash
git add .
git commit -m "Update: description"
git push
```

## 🛠️ 故障排除

### 常見問題

| 問題 | 解決方案 |
|------|----------|
| `remote origin already exists` | `git remote remove origin` 後重新添加 |
| `failed to push some refs` | `git pull origin main --allow-unrelated-histories` 後重試 |
| `Authentication failed` | 確認 Token 權限包含 `repo`，重新生成 |
| `Repository not found` | 檢查倉庫 URL 中的 `YOUR_USERNAME` 是否正確 |

### 驗證部署成功

推送完成後：
1. 訪問 `https://github.com/YOUR_USERNAME/MD`
2. 確認文件結構完整
3. 檢查 **Books (~313 MB)** 和 **Structures (~34 MB)** 目錄

## 📊 倉庫結構概覽

```
MD/
├── Books/              # 1016本書籍 (~313 MB)
├── Structures/         # 結構化數據 (~34 MB)
├── .gitignore          # 排除廢料文件
└── README.md          # 可選：添加倉庫說明
```

## 🎉 完成清單

- [ ] ✅ 創建 Private 倉庫 `MD`
- [ ] ✅ 生成 Personal Access Token（repo 權限）
- [ ] ✅ 首次推送 `git push -u origin main`
- [ ] ✅ 驗證 GitHub 頁面文件完整
- [ ] ✅ 設置後續推送流程

**部署完成後，您將擁有一個安全的、結構化的個人知識庫，包含 1016本書籍和相關數據！** 🚀