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
part: 4
---

## 1.4 個人防護 🛡️
個人層面，你就是自己的守門人。別讓攻擊者輕易得手！

### 1.41 多因素認證與密碼管理
啟用 2FA（Two-Factor Authentication） everywhere，使用 password manager 如 LastPass。風險提示：單一密碼洩露可能導致連鎖效應。

#### 1.411 配置 2FA 示例
在 Google 帳戶中：

1. 前往 myaccount.google.com。
2. 選擇 "安全性" > "2 步驟驗證"。
3. 設定 app-based 或 hardware key（如 YubiKey）。

代碼示例：使用 Python 產生 TOTP（Time-based One-Time Password）：

```python
import pyotp

totp = pyotp.TOTP('JBSWY3DPEHPK3PXP')  # 你的 secret key
print(totp.now())  # 產生當前 OTP
```

這能幫助你理解 2FA 的後端機制。

### 1.42 報告與回應
發現可疑活動？立即報告內部 incident response 團隊。個人用戶可向 FTC 或本地執法單位舉報。

#### 1.421 個人最佳實踐
- 定期檢查帳戶活動。
- 使用 VPN 在公共 Wi-Fi 上。
- 避免分享過多個人資訊在社群媒體。

⚡ 實戰要點
- **日常習慣**：永遠驗證請求來源。
- **風險提示**：忽略報告可能放大損害，如 Equifax 2017 breach（影響 1.47 億人）。
- **最佳實踐**：加入 Bug Bounty 計劃練習辨識漏洞。
