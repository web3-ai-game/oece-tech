---
title: 道德黑客紅隊 - A級：基礎偵察與情報收集
slug: ethical-hacking-red-team-level-a
category: deepweay-me/ethical-hacking
tags: [紅隊, 道德黑客, OSINT, nmap, Kali Linux, 基礎偵察, NIST]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
level: A
team: red
---

# 1. 紅隊 A級概述
## 1.1 什麼是紅隊
1.11 紅隊（Red Team）模擬真實攻擊者進行滲透測試，驗證組織防禦（NIST SP 800-115 Technical Guide to Information Security Testing and Assessment）。
1.12 A級範圍：純偵察階段，不觸碰漏洞利用，聚焦合法開源情報（OSINT）。
1.13 道德框架：僅授權目標，簽 NDA/ROE，MITRE ATT&CK 框架導航（Tactic TA0043 Reconnaissance）。

## 1.2 Kali Linux 基礎部署
1.21 下載：kali.org/get-kali，選擇64-bit Installer 或 Live USB。
1.22 虛擬化：VMware/VirtualBox，分配4GB RAM，啟用 nested VT-x/AMD-V。
1.23 初始化：
```
sudo apt update && sudo apt full-upgrade -y
sudo apt install nmap whois theharvester maltego -y
```
1.24 驗證：`nmap --version` 確認 7.94+。

## 1.3 被動偵察工具與技巧
1.31 域名與 IP 情報：
  - `whois domain.com`：查詢註冊商、email、NS記錄（ICANN whois）。
  - Shodan.io：搜索公開設備 `port:22 country:TW`。
1.32 子域名枚舉：Sublist3r.py 或 `dnsdumpster.com` 視覺圖。
1.33 人員 OSINT：theHarvester `theHarvester -d example.com -b google,linkedin`。

## 1.4 主動偵察：Nmap 入門
1.41 基本語法：
```
nmap -sn 192.168.1.0/24     # 僅 ping 存活主機
nmap -sS -T4 -p 1-1000 target  # SYN掃描常見端口
nmap -sV -sC -O target       # 版本檢測 + 腳本 + OS指紋
```
1.42 輸出管理：`-oA scan` 生成 nmap.xml/gnmap 等。
1.43 規避檢測：`-sS --scan-delay 1s` 慢掃。

## 1.5 合法實踐平台
1.51 HackTheBox.eu：免費 starting point 機器。
1.52 TryHackMe.com：室內 OSINT 房間，免費憑證。
1.53 VulnHub.com：下載 VM 本地練。

## 1.6 真實案例分析
1.61 SolarWinds 供應鏈攻擊（2020）：攻擊者先 OSINT 收集供應商資訊（CrowdStrike 報告）。
1.62 統計：Verizon 2024 DBIR，偵察佔 breach 階段 20%以上。

# 2. 進階準備
## 2.1 報告模板
2.11 使用 Dradis 或 Faraday 框架記錄 findings。
## 2.2 升級至 B級
2.21 學習目錄爆破（dirb/gobuster）、弱口令（hydra）。

**A級里程碑**：獨立完成目標域名全偵察報告，工具熟練度 80%。預計 30 小時，基於 Kali 官方 docs & OWASP Web Security Testing Guide。