---
title: 道德黑客藍隊 - C級：威脅獵捕與 EDR
slug: ethical-hacking-blue-team-level-c
category: deepweay-me/ethical-hacking
tags: [藍隊, threat-hunting, EDR, zeek, suricata, velocloud]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
level: C
team: blue
prereq: level-b
---

# 1. 藍隊 C級概述
## 1.1 C級定位
1.11 主動獵捕（Threat Hunting），EDR 部署，NDR 網絡檢測。
1.12 範圍：hypothesis-driven hunting，MITRE CARDS 原子。
1.13 成熟度：SANS Blue Team Maturity Model Level 3。

## 1.2 EDR 開源替代
1.21 Wazuh：`curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo apt-key add -` ，全棧 SIEM+EDR。
1.22 Osquery：fleetdm.com，SQL query 端點 `SELECT * FROM processes WHERE name = 'suspicious.exe'`。

## 1.3 網絡 IDS/IPS
1.31 Suricata：`sudo apt install suricata`，/etc/suricata/suricata.yaml rules：
```
alert http any any -> any any (msg:"ET SCAN Nmap"; sid:2018956;)
```
1.32 Zeek：`zeekctl install`，scripts/local.zeek 加 SSH brute detect。

## 1.4 Threat Hunting Workflow
1.41 Hypothesis：`data_model = process_exec | where process_name in ("cmd.exe", "powershell.exe") | summarize count by process_command_line`。
1.42 Tools：Kestrel incident response，GRR rapid response。

## 1.5 響應自動化
1.51 SOAR：Shuffle.io 開源，playbooks for containment。

## 1.6 案例
1.61 SolarWinds hunt：異常 DLL load（FireEye 報告）。

**C級里程碑**：每日 hunt report，EDR 覆蓋 100%。預計 80 小時，資源：MITRE Engage, SANS FOR572。