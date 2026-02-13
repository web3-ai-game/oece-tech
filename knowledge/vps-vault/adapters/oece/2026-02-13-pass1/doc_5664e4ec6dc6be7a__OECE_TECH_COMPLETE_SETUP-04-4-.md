---
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 郵箱與數據庫配置

### 4.1 郵箱配置詳解
使用 vip@oece.tech 綁定 iCloud Mail，DNS 記錄正確。背景是 SPF 和 DKIM 防止郵件偽造。原理是 DNS TXT 記錄驗證發送者身份。

實例：一個企業郵箱系統配置後，垃圾郵件率下降 50%。

代碼範例 4：測試郵件發送（bash）
```bash
# 使用 mail 命令測試
echo "Test body" | mail -s "Test Subject" vip@oece.tech

# 檢查 DKIM
dig sig1._domainkey.oece.tech TXT
```

### 4.2 MongoDB 配置
使用 DigitalOcean Managed MongoDB v8，連接字符串已註釋。背景是 managed 服務減輕維護負擔。原理是 NoSQL 的文檔模型適合非結構化數據。

實例：在一個 CMS 系統中，MongoDB 處理了 1 億+ 記錄，查詢速度優於 SQL。

代碼範例 5：連接 MongoDB（Node.js）
```javascript
// lib/db.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;  // 從 .env 載入

async function connectDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  await client.connect();
  return client.db('oece_tech');  // 返回數據庫實例
}

// 使用示例
const db = await connectDB();
const collection = db.collection('users');
await collection.insertOne({ name: 'Test User' });
```
