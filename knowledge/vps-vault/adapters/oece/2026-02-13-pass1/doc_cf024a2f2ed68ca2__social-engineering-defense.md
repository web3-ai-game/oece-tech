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
---

# 1. 社會工程學基礎
## 1.1 定義與歷史
1.11 利用人類心理弱點獲敏感資訊（Kevin Mitnick 'The Art of Deception'）。
1.12 MITRE ATT&CK T1566 Phishing。

## 1.2 常見類型
1.21 Phishing：假 email，檢查 sender spoof。
1.22 Vishing：電話，驗證 callback。
1.23 Smishing：SMS，勿點不明連結。

## 1.3 防禦策略
1.31 訓練：模擬 phishing KnowBe4。
1.32 技術：DMARC, SPF, DKIM email驗證。

## 1.4 個人防護
1.41 2FA everywhere，password manager。
1.42 報告：內部 incident response。

**總結**：意識+驗證，90% 攻擊可擋（Verizon DBIR）。