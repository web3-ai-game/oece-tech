---
title: 道德黑客藍隊 - A級：基礎防禦與安全衛生
slug: ethical-hacking-blue-team-level-a
category: deepweay-me/ethical-hacking
tags: [藍隊, 防禦, firewall, ufw, clamav, NIST, CIS]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
level: A
team: blue
---

# 1. 藍隊 A級概述
## 1.1 什麼是藍隊
1.11 藍隊（Blue Team）專注防禦、檢測、響應，保護資產免受紅隊威脅（SANS Institute 定義）。
1.12 A級重點：基本衛生配置，預防常見攻擊，無需高級工具。
1.13 框架：NIST Cybersecurity Framework Identify-Protect。

## 1.2 系統強化基礎
1.21 OS 硬化：Ubuntu/Debian `sudo apt install ufw fail2ban rkhunter clamav -y`。
1.22 密碼政策：`/etc/security/pwquality.conf` minlen=12, dcredit=-1。
1.23 自動更新：`sudo apt install unattended-upgrades` 配置 /etc/apt/apt.conf.d/50unattended-upgrades。

## 1.3 Firewall 配置
1.31 UFW 入門：
```
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw enable
sudo ufw status verbose
```
1.32 iptables 進階：`iptables -A INPUT -p tcp --dport 22 -m connlimit --connlimit-above 3 -j REJECT` 防暴力。
1.33 驗證：`nmap localhost` 確認僅開端口。

## 1.4 惡意軟件防護
1.41 ClamAV：
```
sudo freshclam
sudo clamscan -r /home --bell -i
```
1.42 RKHunter：`sudo rkhunter --update; sudo rkhunter --check` 根kit 掃描。
1.43 Fail2Ban：監 jail.local 配置 sshd：
```
[DEFAULT]
bantime = 3600
[sshd]
enabled = true
```
## 1.5 日誌基礎監控
1.51 /var/log/auth.log 關鍵：grep 'Failed password'。
1.52 Logwatch：`sudo apt install logwatch; logwatch --detail High --mailto admin@email --service all`。
1.53 警報：simple script tail -f /var/log/auth.log | grep fail。

## 1.6 實踐與案例
1.61 CIS Benchmarks：Linux 1.0+，檢查 100+ controls。
1.62 案例：WannaCry 2017，無 patch RDP 導致全球爆發（Microsoft report）。

# 2. 檢查清單
## 2.1 每日衛生
| 項目 | 命令 | 預期 |
|------|------|------|
| 更新 | apt list --upgradable | 0 |
| UFW | ufw status | active |
| Fail2Ban | fail2ban-client status sshd | banned IPs |

**A級里程碑**：伺服器達 CIS Level 1 合規。預計 20 小時，資源：CISecurity.org benchmarks, NIST SP 800-123。