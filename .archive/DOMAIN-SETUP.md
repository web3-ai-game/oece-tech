# 🌐 域名配置指南 - oece.tech

**域名註冊商**: .TECH Domains  
**目標**: 將 oece.tech 指向 Firebase Hosting  
**狀態**: 待配置

---

## 🎯 配置步驟

### Step 1: Firebase Hosting 添加自定義域名

```bash
cd /Users/deepweay/Documents/github/oece-tech

# 使用 Firebase CLI 添加域名
firebase hosting:channel:deploy live --only hosting
firebase hosting:sites:list

# 添加自定義域名
firebase hosting:sites:get oece-tech-9aa8d
```

或者在 Firebase Console 操作：
1. 訪問 https://console.firebase.google.com/project/oece-tech-9aa8d/hosting
2. 點擊 "Add custom domain"
3. 輸入 `oece.tech`
4. Firebase 會給你 DNS 記錄

---

### Step 2: 在 .TECH Domains 配置 DNS

#### 2.1 獲取 Firebase 的 DNS 記錄

Firebase 會提供類似這樣的記錄：

**A 記錄**（主域名）:
```
Type: A
Name: @
Value: 151.101.1.195
       151.101.65.195
```

**CNAME 記錄**（www 子域名）:
```
Type: CNAME
Name: www
Value: oece-tech-9aa8d.web.app
```

#### 2.2 在 .TECH Domains 添加記錄

1. 登錄 https://controlpanel.tech
2. 找到 `oece.tech` 域名
3. 點擊 "Manage Free Services" 或 DNS 管理
4. 添加以下記錄：

**記錄 1 - A 記錄**
```
Type: A
Host: @
Points to: 151.101.1.195
TTL: 3600
```

**記錄 2 - A 記錄**
```
Type: A
Host: @
Points to: 151.101.65.195
TTL: 3600
```

**記錄 3 - CNAME**
```
Type: CNAME
Host: www
Points to: oece-tech-9aa8d.web.app
TTL: 3600
```

---

### Step 3: 等待 DNS 生效

- **時間**: 5 分鐘 ~ 48 小時
- **通常**: 10-30 分鐘
- **檢查**: `dig oece.tech` 或 `nslookup oece.tech`

---

## 🔥 Firebase Hosting 配置

### 更新 firebase.json

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
    },
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      }
    ]
  }
}
```

---

## 🌐 子域名配置（未來）

### 規劃的子域名

```
oece.tech              → 主站（首頁）
chat.oece.tech         → 多人格聊天室
knowledge.oece.tech    → 知識庫
tools.oece.tech        → AI 工具大合集
memory.oece.tech       → 向量記憶庫
forum.oece.tech        → 社區論壇
divination.oece.tech   → 算命區域
bots.oece.tech         → Bot 管理
drive.oece.tech        → 雲端存儲
api.oece.tech          → API 服務
admin.oece.tech        → 管理後台
```

### 子域名 DNS 配置

每個子域名添加 CNAME 記錄：
```
Type: CNAME
Host: chat
Points to: oece-tech-9aa8d.web.app
TTL: 3600
```

---

## 🔧 本地測試

### 1. 修改 hosts 文件（可選）
```bash
sudo nano /etc/hosts

# 添加
127.0.0.1 oece.tech
127.0.0.1 chat.oece.tech
```

### 2. 本地開發
```bash
cd /Users/deepweay/Documents/github/oece-tech
source /Users/deepweay/Documents/github/sms-key/FINAL-KEYS-CONFIG.env
npm run dev
```

訪問 http://localhost:3000

---

## 📊 DNS 記錄檢查

### 檢查 A 記錄
```bash
dig oece.tech A
```

### 檢查 CNAME 記錄
```bash
dig www.oece.tech CNAME
```

### 檢查所有記錄
```bash
dig oece.tech ANY
```

---

## 🎯 完整配置流程

### 1. Firebase Console
1. 訪問 https://console.firebase.google.com/project/oece-tech-9aa8d/hosting
2. 點擊 "Add custom domain"
3. 輸入 `oece.tech`
4. 複製 Firebase 提供的 DNS 記錄

### 2. .TECH Domains
1. 訪問 https://controlpanel.tech
2. 管理 `oece.tech`
3. 添加 DNS 記錄（A 和 CNAME）
4. 保存

### 3. 驗證
1. 等待 10-30 分鐘
2. 訪問 https://oece.tech
3. 檢查 SSL 證書（Firebase 自動配置）

---

## 🔐 SSL/HTTPS

Firebase Hosting 自動提供：
- ✅ 免費 SSL 證書
- ✅ 自動續期
- ✅ HTTP → HTTPS 重定向
- ✅ 全球 CDN

---

## 🚨 常見問題

### Q: DNS 多久生效？
A: 通常 10-30 分鐘，最長 48 小時

### Q: 為什麼訪問不了？
A: 
1. 檢查 DNS 是否生效（dig oece.tech）
2. 清除瀏覽器緩存
3. 等待 SSL 證書配置完成

### Q: 子域名怎麼配置？
A: 每個子域名添加一條 CNAME 記錄指向 Firebase

---

## 📝 下一步

1. **在 Firebase Console 添加域名**
2. **複製 DNS 記錄**
3. **在 .TECH Domains 配置 DNS**
4. **等待生效**
5. **訪問 https://oece.tech** 🎉

---

**創建時間**: 2025-11-28  
**狀態**: 待配置
