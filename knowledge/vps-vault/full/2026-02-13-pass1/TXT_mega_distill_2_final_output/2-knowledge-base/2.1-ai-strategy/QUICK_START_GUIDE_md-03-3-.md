---
distilled_by: grok-4-0709
mode: B
target_category: 2-knowledge-base/2.1-ai-strategy
source: gcp-distilled/QUICK_START_GUIDE.md.distilled
---
part: 3
---

## 3. 關鍵配置與測試策略

### 3.1 環境變量與安全最佳實務

背景：安全配置源自 OWASP 指南，強調最小權限原則。

展開：避免洩露 API Keys，使用 secrets manager。實例：整合 Google Secret Manager。

代碼範例7：使用 Google Secret Manager

```javascript
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function getSecret() {
  const [version] = await client.accessSecretVersion({ name: 'projects/your-project/secrets/MONGODB_URI/versions/latest' });
  return version.payload.data.toString();
}
```

### 3.2 API 測試命令與驗證

背景：API 測試是 RESTful 設計的核心，自2010年代普及。

展開：多種測試如 GET/POST。實例：驗證 Supabase 即時更新。

代碼範例8：Firebase 認證測試

```javascript
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });

async function verifyToken(idToken) {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log('Verified user:', decoded.uid);
  } catch (error) {
    console.error('Verification failed:', error);
  }
}
```

| 測試命令 | 目的 | 成功指標 | 故障排除 |
|----------|------|----------|----------|
| curl /health | 檢查服務 | 200 OK | 查看日誌 |
| curl /api/auth | 驗證登入 | JWT token | 檢查 key |
