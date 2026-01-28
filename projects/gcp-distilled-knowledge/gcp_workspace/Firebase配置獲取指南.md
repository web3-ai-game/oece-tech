# 🔥 Firebase 配置獲取指南

## 快速獲取方法

### 方法 1: Firebase CLI（推薦）

```bash
# 1. 登錄 Firebase
firebase login

# 2. 列出項目
firebase projects:list

# 3. 獲取 Web App 配置
firebase apps:sdkconfig WEB
```

### 方法 2: Firebase Console

1. 訪問 https://console.firebase.google.com
2. 選擇項目 `deep-weay`（或創建新項目）
3. 點擊齒輪 ⚙️ → Project Settings
4. 滾動到 "Your apps" 區塊
5. 如果沒有 Web App，點擊 `</>` 添加
6. 複製配置

---

## 預期的 Firebase 配置格式

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // 🔑 API Key
  authDomain: "deep-weay.firebaseapp.com",
  projectId: "deep-weay",
  storageBucket: "deep-weay.appspot.com",
  messagingSenderId: "950482302...",
  appId: "1:950482302:web:..."
};
```

---

## 環境變量格式

獲取後填入 `.env.local`：

```bash
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=deep-weay.firebaseapp.com
FIREBASE_PROJECT_ID=deep-weay
FIREBASE_STORAGE_BUCKET=deep-weay.appspot.com
FIREBASE_MESSAGING_SENDER_ID=950482302...
FIREBASE_APP_ID=1:950482302:web:...
```

---

## 免費層 (Spark Plan) 包含

| 服務 | 免費額度 |
|------|---------|
| Authentication | 10,000 用戶/月 |
| Firestore | 1GB 存儲, 50k 讀取/日 |
| Cloud Storage | 5GB 存儲 |
| Hosting | 10GB 存儲 |
| Cloud Functions | 125,000 調用/月 |

---

## 快速啟用步驟

```bash
# 1. 初始化 Firebase 項目
cd /home/svs-main-key/GCP
firebase init

# 選擇:
# - Firestore
# - Authentication  
# - Hosting (可選)

# 2. 選擇現有項目
# → deep-weay

# 3. 完成配置
```

---

**提示**: 如果你還沒有 Firebase 項目，可以直接在 GCP Console 啟用 Firebase：
https://console.firebase.google.com/?project=deep-weay
