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
part: 3
---

## 1.3 防禦策略 ⚔️
防禦社會工程學不是靠運氣，而是系統化的策略。想像你是在建造一座城堡：意識訓練是護城河，技術工具是城牆。

### 1.31 訓練與意識提升
定期訓練是王道。使用 KnowBe4 平台模擬 Phishing 攻擊，讓員工練習辨識。根據 SANS 的 SEC530 課程，模擬訓練能將點擊率從 30% 降到 5% 以內。

#### 1.311 實施步驟
1. 評估當前風險：使用 MITRE 的 ATT&CK Navigator 映射弱點。
2. 設計課程：涵蓋心理原理和實戰演練。
3. 追蹤成效：監測報告率。

⚡ 實戰要點
- **模擬攻擊**：每季度發送假 Phishing email，獎勵正確報告者。
- **風險提示**：忽略訓練可能導致資料外洩，參考 Target 2013 年 breach（因 Phishing 導致 4000 萬信用卡洩露）。
- **最佳實踐**：整合到 onboarding 流程。

### 1.32 技術防禦
技術層面，實施 email 驗證協議如 DMARC、SPF 和 DKIM。這些能防止 sender spoofing。

#### 1.321 配置範例
在 DNS 中設定 SPF 記錄（使用 Bash 命令檢查）：

```bash
# 檢查 SPF 記錄
dig TXT example.com

# 示例輸出：v=spf1 include:_spf.google.com ~all
```

對於 DMARC，添加 DNS TXT 記錄：

```
_dmarc.example.com TXT "v=DMARC1; p=quarantine; rua=mailto:reports@example.com"
```

這會將可疑 email 隔離，並發送報告。OWASP 推薦在所有域名上啟用這些。

#### 1.322 進階工具
- 使用 SIEM 系統如 Splunk 監測異常。
- 部署 Endpoint Detection and Response (EDR) 如 CrowdStrike 偵測 Phishing 後續行為。

真實案例分析：2016 年烏克蘭電網攻擊（引用 NIST IR 7628），攻擊者用 Spear Phishing 獲取存取權，導致大規模停電。教訓：技術防禦需與人類訓練結合。

### 1.33 組織層級防禦
建立 incident response 團隊，參考 NIST SP 800-61。包括報告管道和快速響應計劃。
