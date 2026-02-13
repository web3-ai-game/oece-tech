---
title: 道德黑客紅隊 - B級：中級枚舉與弱點識別
slug: ethical-hacking-red-team-level-b
category: deepweay-me/ethical-hacking
tags: [紅隊, gobuster, hydra, metasploit, 枚舉, 弱口令, Kali]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
level: B
team: red
prereq: level-a
---

# 1. 紅隊 B級概述
## 1.1 B級定位
1.11 從偵察升級至枚舉（Enumeration, MITRE TA0007），識別弱服務/配置。
1.12 範圍：非破壞掃描，無 shell 獲取，聚焦 vuln 確認。
1.13 法規依據：GDPR Art32, HIPAA 需定期 pentest。

## 1.2 進階 Kali 工具鏈
1.21 更新工具：`sudo apt install dirb gobuster hydra nikto sqlmap -y`。
1.22 Metasploit Framework：`msfconsole`，`msfupdate` 同步 modules（2024+ 版超 3000 modules）。

## 1.3 網頁枚舉
1.31 目錄爆破：
```
gobuster dir -u http://target -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt
dirb http://target /usr/share/dirb/wordlists/common.txt
```
1.32 解釋：-w 字典，-x 擴展，status 403/301 為熱點。
1.33 JS 端點：`cat subdomains.txt | waybackurls | grep api` 歷史快照。

## 1.4 弱口令與服務枚舉
1.41 Hydra 爆破：
```
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://target
hydra -C users.txt:pass.txt ftp://target
```
1.42 SNMP：`onesixtyone -c community.txt target`。
1.43 注意：限速 `--delay 5`，僅 lab 環境。

## 1.5 Metasploit 入門
1.51 輔助模塊：
```
use auxiliary/scanner/http/dir_listing
use auxiliary/scanner/ssh/ssh_login
set RHOSTS target
run
```
1.52 無 exploit：僅 scanner/auxiliary，驗證 vuln 如 EternalBlue（MS17-010）。

## 1.6 實戰平台與案例
1.61 VulnHub DVWA：練習 SQLi 枚舉。
1.62 案例：Equifax 2017（Apache Struts vuln），枚舉階段關鍵（US-CERT 報告）。

# 2. 風險管理
## 2.1 合法性檢查
2.11 獲書面授權，定義 scope（如 IP 範圍）。
## 2.2 升級至 C級
2.21 全 Metasploit workflow，custom payloads（無實際 deploy）。

**B級里程碑**：生成 POC 報告，涵蓋 5+ 服務枚舉。預計 50 小時，參 PTES (Penetration Testing Execution Standard) Enumeration 階段。