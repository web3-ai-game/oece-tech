# 🔥 Firebase 初始化教程（手動操作）

**項目**: oece-tech  
**Firebase 項目**: oece-tech-9aa8d

---

## 📋 步驟 1: 登錄 Firebase CLI

打開終端，執行：

```bash
firebase login
```

會打開瀏覽器，選擇你的 Google 帳號（sms.pve@gmail.com）並授權。

---

## 🔧 步驟 2: 初始化 Firebase Hosting

```bash
cd /Users/deepweay/Documents/github/oece-tech
firebase init hosting
```

### 2.1 選擇項目
```
? Please select an option:
  > Use an existing project
```
按 Enter

### 2.2 選擇 oece-tech-9aa8d
```
? Select a default Firebase project for this directory:
  > oece-tech-9aa8d (oece-tech)
```
按 Enter

### 2.3 選擇框架
```
? What do you want to use as your public directory?
  > Detected an existing Next.js codebase in the current directory
  > Set up automatic builds and deploys with GitHub?
```
選擇 **Yes**（按 Y）

### 2.4 GitHub 集成（可選）
```
? For which GitHub repository would you like to set up a GitHub workflow?
  > web3-ai-game/oece-tech
```
按 Enter

如果詢問是否覆蓋現有的 workflow，選擇 **No**（我們已經有了）

---

## ✅ 步驟 3: 驗證生成的文件

初始化完成後，會生成以下文件：

- `.firebaserc` - Firebase 項目配置
- `firebase.json` - Hosting 配置

### 檢查 .firebaserc 內容
```bash
cat .firebaserc
```

應該看到：
```json
{
  "projects": {
    "default": "oece-tech-9aa8d"
  }
}
```

### 檢查 firebase.json 內容
```bash
cat firebase.json
```

應該看到類似：
```json
{
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "frameworksBackend": {
      "region": "us-central1"
    }
  }
}
```

---

## 🚀 步驟 4: 手動部署測試

```bash
cd /Users/deepweay/Documents/github/oece-tech
source /Users/deepweay/Documents/github/sms-key/FINAL-KEYS-CONFIG.env
firebase deploy
```

### 部署過程
1. 檢測 Next.js 項目
2. 構建生產版本（`npm run build`）
3. 上傳到 Firebase Hosting
4. 部署 Cloud Functions（API Routes）
5. 完成！

### 成功後會顯示
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/oece-tech-9aa8d/overview
Hosting URL: https://oece-tech-9aa8d.web.app
```

---

## 🔍 步驟 5: 驗證部署

訪問: https://oece-tech-9aa8d.web.app

應該看到你的賽博朋克指揮中心 UI！

---

## 📝 完成後請刪除此文件

配置完成後，請刪除此文件：
```bash
rm /Users/deepweay/Documents/github/oece-tech/SETUP-FIREBASE.md
```

---

**創建時間**: 2025-11-28  
**用途**: 手動初始化 Firebase Hosting  
**狀態**: ⚠️ 配置完成後請刪除
