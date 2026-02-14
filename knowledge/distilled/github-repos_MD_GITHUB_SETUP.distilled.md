---
source: github-repos_MD_GITHUB_SETUP.md
distilled_at: 2026-02-14T09:30:38.023Z
model: grok-4-1-fast-non-reasoning
---

# GitHub 知識庫倉庫設置指南

本文檔詳細說明如何將本地知識庫（**MD** 目錄）推送到 GitHub，並建立個人知識管理系統。該知識庫包含 **1016本書籍**（~313 MB）與**結構化數據**（~34 MB），總大小約 **350 MB**。

## 📋 當前狀態檢查

| 狀態 | 描述 |
|------|------|
| ✅ | Git 已初始化 |
| ✅ | 所有文件已提交 |
| ✅ | 廢料文件已在 `.gitignore` 中排除 |
| ⏳ | **等待推送到 GitHub** |

**總倉庫大小**：~350 MB（不含廢料）

---

## 🚀 步驟 1：創建 GitHub 倉庫

1. 訪問 [GitHub 新倉庫頁面](https://github.com/new)
2. 填寫倉庫信息：
   ```
   倉庫名稱：MD
   描述：個人知識庫 - 1016本書籍 + 結構化數據
   可見性：Private（強烈推薦）
   ```
3. **重要**：**不要** 初始化 README 文件
4. 點擊 **"Create repository"**

![創建倉庫截圖位置](https://github.com/new) ← 此處會顯示你的倉庫 URL

---

## 🔑 步驟 2：生成 Personal Access Token

由於 GitHub 已廢除密碼認證，必須使用 **Personal Access Token**：

1. 訪問 [GitHub Token 設置頁面](https://github.com/settings/tokens)
2. 點擊 **"Generate new token"** → **"Generate new token (classic)"**
3. 設置：
   ```
   Token 名稱：MD Repository
   過期時間：無限制（或依需求）
   權限：☑️ repo（完整控制私有倉庫）
   ```
4. **複製生成的 Token**（僅顯示一次！安全保存）

**使用時**：
- Username：`YOUR_USERNAME`
- Password：`你的 Token`（不是 GitHub 密碼）

---

## ⬆️ 步驟 3：首次推送至 GitHub

在終端執行以下命令（確保在 `/mnt/sms/MD` 目錄）：

```bash
# 添加遠端倉庫
git remote add origin https://github.com/YOUR_USERNAME/MD.git

# 設置主分支名稱
git branch -M main

# 首次推送（使用 Token 認證）
git push -u origin main
```

**認證提示**：
```
Username for 'https://github.com': YOUR_USERNAME
Password for 'https://YOUR_USERNAME@github.com': ghp_xxxxxxxxxxxxxxxxxxxx
```

---

## 🔄 步驟 4：後續更新推送

日常更新工作流程：

```bash
git add .
git commit -m "Update: description"
git push
```

**Git 認證已緩存**，後續推送無需重複輸入 Token。

---

## 🛡️ 安全與最佳實踐

### 倉庫設置建議
```
☑️ Private 倉庫（保護個人知識庫）
☑️ .gitignore 已配置（排除廢料）
☑️ Token 權限僅限 repo
☐ 啟用雙因素認證（2FA）
☐ 定期備份 Token
```

### 文件結構概覽
```
MD/
├── Books/              # 1016本書籍 (~313 MB)
├── Structures/         # 結構化數據 (~34 MB)
├── .gitignore          # 排除廢料文件
└── README.md           # （稍後手動創建）
```

---

## ✅ 完成檢查清單

- [ ] GitHub 倉庫創建完成
- [ ] Personal Access Token 生成並保存
- [ ] 首次推送成功
- [ ] 倉庫顯示 1016 本書籍 + 結構化數據
- [ ] 本地與遠端同步

**預期結果**：你的 GitHub 將擁有一個 **350 MB 的私人知識庫**，包含完整書籍與結構化數據！

---

## ❓ 常見問題

**Q: 推送失敗？**
```
A: 檢查 Token 是否正確複製，重新生成或確認 repo 權限
```

**Q: 倉庫太大？**
```
A: GitHub 支援 5GB 私有倉庫，350MB 完全沒問題
```

**Q: 如何本地編輯後同步？**
```
A: 執行步驟 4 的三行命令即可
```

**完成後，你的個人知識系統就正式上線了！🎉**