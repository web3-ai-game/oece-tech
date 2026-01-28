# OECE — 東南亞數字遊民與道德駭客知識庫 (Private)

本倉庫為私密（private）用於整理針對東南亞地區的數字遊民、道德駭客與 Kali (資訊安全) 相關的知識庫。

This repository is private and serves as a knowledge base for digital nomads and ethical hackers related to Southeast Asia, including Kali-related content.

---

## 內容概要 / Overview

- 一個為數字遊民（Digital Nomads）與道德駭客（Ethical Hackers）在東南亞活動整理的知識庫。
- 包含：地區須知、工具與範例（Kali Linux）、安全與合規性注意事項、實務建議。

This repo collects resources for digital nomads and ethical hackers in Southeast Asia: regional tips, Kali Linux tooling, security and compliance considerations, and practical advice.

## 目錄結構 / Directory Structure

```plaintext
oece/
├── 01-digital-nomad-數字遊民基礎/
├── 02-southeast-asia-東南亞指南/
│   ├── thailand-泰國/
│   ├── vietnam-越南/
│   ├── indonesia-印尼/
│   ├── malaysia-馬來西亞/
│   ├── singapore-新加坡/
│   └── philippines-菲律賓/
├── 03-kali-linux-滲透測試系統/
│   ├── installation-安裝指南/
│   ├── tools-工具介紹/
│   └── tutorials-教學範例/
├── 04-ethical-hacking-道德駭客/
│   ├── penetration-testing-滲透測試/
│   ├── vulnerability-assessment-漏洞評估/
│   └── compliance-合規要求/
├── 05-security-privacy-安全與隱私/
│   ├── vpn-setup-VPN設置/
│   ├── encryption-加密技術/
│   └── opsec-操作安全/
├── 06-legal-compliance-法律合規/
├── 07-resources-資源彙整/
├── 08-community-社群交流/
├── assets/                    # 圖標與資源文件
├── scripts/                   # 工具腳本
├── README.md                  # 專案說明
└── CONTRIBUTING.md            # 貢獻指南
```

## 圖標 / Icon

倉庫圖標位於 `assets/icon.svg`。

Icon for the repository is located at `assets/icon.svg`.

## 免責聲明 / Disclaimer

本倉庫的資訊僅供教育與自我保護用途。任何侵害他人或違法活動的操作，責任自負。請遵守當地法律及職業道德。

The information in this repository is for educational and defensive purposes only. Any illegal activities are the user's responsibility. Follow local laws and professional ethics.

## 禁止表情包、避免圖裂 / No memes & image integrity

- 倉庫嚴禁上傳含有表情包的圖像或迷因類內容。
- 所有圖檔請以向量化（SVG）或高解析 PNG/JPEG 並附上 MD5 或 SHA256 校驗，避免圖裂或被替換。

This repo disallows meme images/emojis. Images should be vector (SVG) or high-res PNG/JPEG with MD5/SHA256 checksums to prevent corruption or tampering.

## 快速開始 / Quick Start

1. Clone this private repository (access required):

	```bash
	git clone git@github.com:your-org-or-username/oece.git
	```

2. Verify icons and checksums:

	```bash
	sh scripts/verify-assets.sh
	```

3. Follow CONTRIBUTING.md for submissions.

## 東南亞須知 / Southeast Asia Notes

- 簽證與停留：不同國家簽證政策差異大，出發前查詢官方簽證資訊與電子落地簽（e-Visa/e-VOA）。
- 網路與 SIM 卡：建議購買當地預付 SIM，以便通訊與行動網路。
- 法律合規：某些國家對加密、資安工具有特別限制，請先確認當地法律。

- Visas & stay: Policies vary—check official e-Visa/e-VOA info per country.
- Network & SIM: Get a local prepaid SIM for connectivity.
- Legal & compliance: Some countries restrict cryptography or security tools. Verify local law.

## Kali / Ethical Hacking Notes

- 本倉庫提供 Kali Linux 基礎設置、常用工具與學習資源的整理。所有示例以教育、防禦與合規用途為主。
- 使用 Kali 或其他滲透測試工具時，務必取得目標資產所有者授權。未授權測試為違法行為。

- This repo organizes basic Kali Linux setup, common tools, and learning resources for defensive and educational purposes.
- Always obtain authorization before testing any systems. Unauthorized testing is illegal.

## 貢獻 / Contributing

請先閱讀 `CONTRIBUTING.md`，並遵守倉庫內指引。

Please read `CONTRIBUTING.md` before contributing and follow the repository guidelines.

---

維護者 / Maintainers: OECE Team
