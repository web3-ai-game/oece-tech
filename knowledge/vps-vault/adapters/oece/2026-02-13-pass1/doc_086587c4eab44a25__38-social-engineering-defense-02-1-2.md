---
title: 社會工程學防禦指南
slug: survival-social-engineering-defense
category: survival-skills
tags: [社工, phishing, vishing, pretexting, awareness, MITRE]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
distilled_by: grok-4-0709
distilled_at: 2026-07-09T12:00:00Z
---
part: 2
---

## 1.2 常見類型
社會工程學不是單一招式，而是像武術一樣有各種流派。以下是幾種最常見的，讓我們一一拆解，並添加一些實戰例子。

### 1.21 Phishing：電子郵件詐騙
Phishing 是最普遍的形式，攻擊者發送假 email 誘導你點擊連結或下載附件。關鍵防禦：檢查 sender spoofing（發件人偽造）。例如，email 看似來自 bank.com，但實際是 bank-com-fake.ru。根據 SANS Institute 的報告，Phishing 攻擊在 2022 年造成全球損失超過 50 億美元。

#### 1.211 識別技巧
- 檢查 URL：懸停滑鼠查看真實連結。
- 尋找拼寫錯誤：如 "PayPaI" 而非 "PayPal"。
- 驗證發件人：使用工具如 `whois` 查詢域名。

代碼示例：使用 Python 檢查 email 頭部（需安裝 `email` 模組）：

```python
import email
from email import policy

def check_email_headers(email_file):
    with open(email_file, 'rb') as f:
        msg = email.message_from_bytes(f.read(), policy=policy.default)
    sender = msg['From']
    received = msg.get_all('Received')
    print(f"Sender: {sender}")
    for rec in received:
        print(f"Received from: {rec}")

# 用法：check_email_headers('suspicious.eml')
```

這段程式能幫助你分析 email 的傳輸路徑，識別偽造跡象。

### 1.22 Vishing：電話語音詐騙
Vishing（Voice Phishing）是透過電話進行的攻擊，攻擊者假裝是銀行或政府官員，要求你提供資訊。防禦關鍵：驗證 callback，即掛斷後自己撥打官方號碼確認。CIS Controls v8 建議在所有通話中實施此步驟。

#### 1.221 實戰案例分析
引用 OWASP 的案例：在 2016 年的 IRS 詐騙事件，攻擊者假裝稅務局官員，騙取數百萬美元。受害者常因緊急感（如 "立即繳稅否則逮捕"）而上鉤。最佳實踐：永遠不要在未驗證的通話中分享敏感資料。

### 1.23 Smishing：SMS 簡訊詐騙
Smishing 是透過 SMS 發送的 Phishing，誘導點擊不明連結。防禦：勿點擊不明來源的連結，使用 app 如 Google Messages 的內建過濾。根據 NIST 的 Cybersecurity Framework，教育用戶辨識這些攻擊是 Tier 1 防禦。

#### 1.231 其他變體
- Pretexting：編造情境獲取信任，如假裝調查員。
- Baiting：用 USB 隨身碟誘導插入電腦（參考 MITRE T1200 Hardware Additions）。

表格匯總：常見社會工程學類型

| 類型       | 描述                          | 常見媒介     | 防禦要點                  |
|------------|-------------------------------|--------------|---------------------------|
| Phishing  | 假 email 誘導點擊            | Email       | 檢查 URL, 啟用 SPF       |
| Vishing   | 電話假冒身份                 | 電話        | Callback 驗證            |
| Smishing  | SMS 連結誘導                 | 簡訊        | 勿點不明連結             |
| Pretexting| 編造情境獲取資訊             | 面對面/線上 | 驗證身份                 |
