---
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 真實案例分析

### 4.1 案例一：SolarWinds供應鏈攻擊 (2020)

SolarWinds事件影響數千組織，包括美國政府部門。攻擊者透過軟件更新插入後門，洩露敏感憑證。引用來源：FireEye報告（https://www.fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor.html）。分析：背景是供應鏈漏洞，原理在於未驗證的更新通道；教訓是實施零信任模型和定期審計。

### 4.2 案例二：Yahoo數據洩露 (2013-2014)

Yahoo遭駭導致30億帳戶資訊外洩，主要因弱鹹值加密和憑證管理不善。引用來源：Verizon調查報告（https://enterprise.verizon.com/resources/reports/dbir/）。分析：背景是大型服務器的規模效應，原理是加密不足導致批量破解；防範包括使用bcrypt或Argon2進行密碼哈希。

### 4.3 案例三：Equifax洩露 (2017)

如前述，Equifax因未修補已知漏洞導致洩露。引用來源：GAO報告（https://www.gao.gov/products/gao-18-559）。分析：背景是延遲修補，原理在於訪問控制失效；建議實施自動化漏洞掃描工具如Nessus。
