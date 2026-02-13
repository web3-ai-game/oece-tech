---
distilled_by: grok-4-0709
mode: B
---
part: 5
---

## 5. 進階技術與工具

### 5.1 社會工程學防禦

社會工程學涉及phishing等技巧。背景源於人類因素是安全弱點，Kevin Mitnick的經典案例。原理是教育訓練和模擬攻擊。實例：企業使用KnowBe4平台進行phishing模擬。

#### 5.11 代碼範例：模擬Phishing檢測 (JavaScript)

```javascript
// 範例5: 簡單URL檢查以檢測潛在phishing
function isPhishing(url) {
  const suspiciousDomains = ['fakebank.com', 'phishsite.net'];
  return suspiciousDomains.some(domain => url.includes(domain));
}
// 註釋: 此函數可用於瀏覽器擴展，檢查連結是否匹配已知惡意域名

// 範例6: 生成安全的2FA備份碼
const crypto = require('crypto');
function generateBackupCodes(count = 8) {
  return Array.from({length: count}, () => crypto.randomBytes(4).toString('hex'));
}
// 註釋: 用於雙因素驗證，產生一次性備份碼；儲存時需加密
```

### 5.2 滲透測試技術

滲透測試使用工具如Metasploit。背景是紅隊演練，模擬攻擊以強化防禦。原理是識別漏洞後修補。實例：DEF CON大會的CTF挑戰。

#### 5.21 代碼範例：基本端口掃描 (Bash)

```bash
# 範例7: 使用nmap掃描開放端口 (僅限授權使用)
nmap -p 1-1000 target_ip  # 掃描1-1000端口
# 註釋: nmap是標準工具，用於網路發現；避免未授權掃描以防法律問題
```

```python
# 範例8: Python腳本檢查弱密碼
import hashlib

def check_weak_password(password):
    weak_hashes = [hashlib.md5(b'password').hexdigest()]  # 示例弱密碼哈希
    return hashlib.md5(password.encode()).hexdigest() in weak_hashes
# 註釋: 此腳本檢測常見弱密碼；實際應用中整合到登錄系統
```
