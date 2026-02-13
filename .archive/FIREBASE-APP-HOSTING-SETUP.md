# 🔥 Firebase App Hosting 環境變量配置指南

## 問題診斷

**錯誤**: `Error: [FirebaseError]: Firebase: Error (auth/invalid-api-key)`  
**原因**: App Hosting 構建時沒有讀取到環境變量  
**解決**: 在 Firebase Console 手動配置環境變量

---

## ✅ 已完成的代碼修復

### 1. lib/firebase.ts - 防禦性初始化
```typescript
// ✅ 允許 Build Time 沒有 API Key
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

if (hasValidConfig) {
  // 正常初始化
} else {
  console.warn('Firebase config missing - Build Time mode');
}
```

### 2. apphosting.yaml - 環境變量聲明
```yaml
runConfig:
  env:
    - variable: NEXT_PUBLIC_FIREBASE_API_KEY
      value: ***REDACTED***
    # ... 其他變量
```

---

## 🎯 需要手動配置（重要！）

### 步驟 1: 進入 Firebase Console

1. 訪問: https://console.firebase.google.com
2. 選擇項目: **oece-tech-9aa8d**
3. 左側菜單 → **App Hosting**

### 步驟 2: 配置環境變量

1. 點擊你的後端名稱（oece-tech）
2. 點擊右上角 **⚙️ 設定** 或 **Settings**
3. 找到 **環境變量 (Environment variables)** 區塊
4. 點擊 **新增變量 (Add variable)**

### 步驟 3: 添加以下 7 個變量

| 變量名 | 值 |
|--------|-----|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `***REDACTED***` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `oece-tech-9aa8d.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | `https://oece-tech-9aa8d-default-rtdb.asia-southeast1.firebasedatabase.app` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `oece-tech-9aa8d` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `oece-tech-9aa8d.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `501753160098` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:501753160098:web:ae60f099b05b6bc8e812fb` |

### 步驟 4: 保存並重新部署

1. 點擊 **保存 (Save)**
2. 回到 App Hosting 主頁
3. 點擊 **重新部署 (Redeploy)** 或推送新的 commit

---

## 🔍 驗證方法

### 方法 1: 查看 Cloud Build 日誌

1. 進入 Cloud Build: https://console.cloud.google.com/cloud-build
2. 選擇最新的構建
3. 查看日誌中是否有：
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=***REDACTED***
   ```

### 方法 2: 檢查構建是否成功

如果環境變量配置正確：
- ✅ `npm run build` 成功
- ✅ 沒有 `auth/invalid-api-key` 錯誤
- ✅ 部署成功

---

## 🚨 常見錯誤

### 錯誤 1: 只配置了 GitHub Secrets
❌ **App Hosting 不會自動讀取 GitHub Secrets**  
✅ 必須在 Firebase Console 手動配置

### 錯誤 2: 使用了 Secret Manager
如果使用 Secret Manager，apphosting.yaml 應該這樣寫：
```yaml
runConfig:
  env:
    - variable: NEXT_PUBLIC_FIREBASE_API_KEY
      secret: firebase-api-key  # Secret Manager 中的名稱
```

### 錯誤 3: 變量名錯誤
必須是 `NEXT_PUBLIC_` 開頭，Next.js 才能在客戶端訪問

---

## 📊 配置優先級

```
1. Firebase Console 環境變量（最高優先級）
2. apphosting.yaml
3. .env.local（僅本地開發）
4. GitHub Secrets（僅 GitHub Actions）
```

---

## 🎯 快速檢查清單

- [ ] Firebase Console → App Hosting → Settings → Environment variables
- [ ] 添加 7 個 `NEXT_PUBLIC_FIREBASE_*` 變量
- [ ] 保存配置
- [ ] 觸發重新部署（git push 或手動）
- [ ] 檢查 Cloud Build 日誌
- [ ] 確認構建成功

---

## 💡 推薦配置方式

### 開發環境
```bash
# .env.local (本地開發)
NEXT_PUBLIC_FIREBASE_API_KEY=...
```

### 生產環境
```
Firebase Console → App Hosting → Environment variables
```

---

**重要**: 配置完環境變量後，必須重新部署才能生效！

**下一步**: 
1. 按照上述步驟配置 Firebase Console
2. 推送一個空 commit 觸發重新部署：
   ```bash
   git commit --allow-empty -m "🔥 Trigger redeploy after env config"
   git push origin main
   ```
