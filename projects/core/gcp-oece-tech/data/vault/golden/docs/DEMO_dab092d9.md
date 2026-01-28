# 🎬 Digital Assets Distiller V2.0 - 演示指南

## 🌟 一分鐘快速體驗

```bash
# 在任何Linux VPS上執行（Ubuntu/Debian）
curl -fsSL https://raw.githubusercontent.com/web3-ai-game/digital-assets-distiller-v2/master/quick-deploy.sh | sudo bash
```

**就這麼簡單！** 腳本會自動：
1. 安裝Docker、Docker Compose、PM2
2. 克隆項目
3. 配置API keys（互動式輸入）
4. 構建Docker鏡像
5. 設置開機自啟

---

## 🔥 完整演示流程

### 場景：你有507個去重後的珍貴文檔需要蒸餾

#### 步驟1: 準備VPS
```bash
# SSH登錄你的DigitalOcean/GCP VPS
ssh root@your-vps-ip

# 檢查磁盤空間（至少需要10GB）
df -h
```

#### 步驟2: 克隆並配置
```bash
git clone https://github.com/web3-ai-game/digital-assets-distiller-v2.git
cd digital-assets-distiller-v2

# 配置API keys
nano config/api-keys.env
```

在 `api-keys.env` 中填入：
```bash
API_KEY_1=你的第一個Gemini_key
API_KEY_2=你的第二個Gemini_key
API_KEY_3=你的第三個Gemini_key
MODEL_NAME=gemini-3-pro-preview
BUDGET_LIMIT=10
```

#### 步驟3: 放置文檔
```bash
# 假設你的文檔在 /mnt/sms/kill-old/organized_docs/02_documentation/
# 自動分配到3個波次
python3 scripts/split_docs.py /path/to/your/docs ./input
```

這會自動將文檔平均分配：
- `input/wave1/` - 前1/3文檔（169個）
- `input/wave2/` - 中1/3文檔（169個）
- `input/wave3/` - 後1/3文檔（169個）

#### 步驟4: 啟動蒸餾！🚀
```bash
./start-distillation.sh
```

你會看到：
```
🔥 Digital Assets Distiller V2.0 - 啟動中...

📋 步驟 1/5: 檢查依賴...
✅ 依賴檢查通過

📋 步驟 2/5: 分配文檔到3個波次...
✅ 文檔已分配

📋 步驟 3/5: 構建Docker鏡像...
✅ Docker鏡像構建完成

📋 步驟 4/5: 啟動3個蒸餾容器...
✅ 容器已啟動

📋 步驟 5/5: 啟動PM2監控...
✅ 監控已啟動

╔══════════════════════════════════════════════════════════╗
║  🎉 數字資產蒸餾系統已啟動！                            ║
╠══════════════════════════════════════════════════════════╣
║  📊 查看實時監控: pm2 monit                             ║
║  📜 查看日誌:     pm2 logs distiller-monitor            ║
║  🐳 容器狀態:     docker ps                             ║
║  🛑 停止蒸餾:     ./stop-distillation.sh                ║
╚══════════════════════════════════════════════════════════╝
```

#### 步驟5: 實時監控 📊
```bash
# 方式1: PM2監控面板（推薦）
pm2 monit

# 方式2: 查看容器日誌
docker logs -f distiller-wave1

# 方式3: 查看所有容器狀態
docker ps
```

你會看到類似這樣的監控：
```
╔══════════════════════════════════════════════════════════════════╗
║       🔥 Digital Assets Distiller V2.0 - 實時監控面板           ║
╚══════════════════════════════════════════════════════════════════╝

⏰ 2025-11-26 17:30:45

┌─ Wave 1 ──────────────────────────────────────────┐
│ 📊 進度: 45 文檔
│ 💰 成本: $2.3456 USD (฿83.27 THB)
│ 📈 Tokens: 125,340 in / 89,234 out
│ 🐳 容器: 23.4% CPU / 456MB / 2GB
└────────────────────────────────────────────────────┘

┌─ Wave 2 ──────────────────────────────────────────┐
│ 📊 進度: 42 文檔
│ 💰 成本: $2.1234 USD (฿75.38 THB)
│ 📈 Tokens: 118,456 in / 82,145 out
│ 🐳 容器: 19.8% CPU / 423MB / 2GB
└────────────────────────────────────────────────────┘

┌─ Wave 3 ──────────────────────────────────────────┐
│ 📊 進度: 47 文檔
│ 💰 成本: $2.5678 USD (฿91.16 THB)
│ 📈 Tokens: 132,789 in / 91,456 out
│ 🐳 容器: 25.1% CPU / 478MB / 2GB
└────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════╗
║ 🎯 總計
║   📊 總處理: 134 文檔
║   💰 總成本: $7.0368 USD (฿249.81 THB)
║   📈 預算: $7.04 / $30.00 (23.5%)
╚════════════════════════════════════════════════════════╝
```

#### 步驟6: 等待蒸餾完成 ⏱️

根據文檔數量，蒸餾時間：
- 100個文檔 ≈ 30-45分鐘
- 300個文檔 ≈ 1.5-2小時
- 500個文檔 ≈ 2.5-3小時

**3個容器並發 = 速度提升3倍！**

#### 步驟7: 查看結果 📁
```bash
# 蒸餾結果
ls -la output/wave1/
ls -la output/wave2/
ls -la output/wave3/

# 查看某個蒸餾後的文檔
cat output/wave1/distilled_tech-room__README.md
```

每個蒸餾後的文檔包含：
```markdown
# 蒸餾報告: tech-room__README.md

## 價值分析
[AI評估文檔的核心價值和評分]

## 精華提取
[提取的關鍵知識點和技巧]

## 結構化內容
[格式化後的Markdown文檔]

## 創意擴展
[基於知識的實踐建議和應用場景]

---
💰 成本: $0.0234 USD (฿0.83 THB)
📊 Tokens: 3,456 in / 2,345 out
```

#### 步驟8: 停止蒸餾 🛑
```bash
./stop-distillation.sh
```

會生成最終報告：
```
🛑 停止數字資產蒸餾系統...

📋 步驟 1/3: 停止PM2監控...
✅ 監控已停止

📋 步驟 2/3: 停止Docker容器...
✅ 容器已停止

📋 步驟 3/3: 生成蒸餾報告...

╔══════════════════════════════════════════════════════════╗
║           📊 蒸餾報告                                    ║
╠══════════════════════════════════════════════════════════╣
║ Wave 1: 169 文檔 | $8.7654 USD (฿311.17 THB) ║
║ Wave 2: 169 文檔 | $8.5432 USD (฿303.28 THB) ║
║ Wave 3: 169 文檔 | $9.1234 USD (฿323.88 THB) ║
╠══════════════════════════════════════════════════════════╣
║ 總計:  507 文檔 | $26.4320 USD (฿938.34 THB) ║
╚══════════════════════════════════════════════════════════╝

✅ 蒸餾系統已完全停止
📁 蒸餾結果保存在: output/
```

---

## 🎯 進階使用場景

### 場景A: 斷點續傳
```bash
# 如果蒸餾過程中斷（VPS重啟、網絡斷開等）
# 直接重新啟動，會從檢查點繼續
./start-distillation.sh
```

### 場景B: 只蒸餾某一波
```bash
# 進入容器目錄
cd containers

# 只啟動Wave 1
docker-compose up distiller-wave1

# 或者啟動Wave 2和3
docker-compose up distiller-wave2 distiller-wave3
```

### 場景C: 調整預算
```bash
# 編輯配置
nano config/api-keys.env

# 修改 BUDGET_LIMIT=20  （每個容器$20）
# 重啟蒸餾
./stop-distillation.sh
./start-distillation.sh
```

### 場景D: 批量蒸餾多個項目
```bash
# 項目1
python3 scripts/split_docs.py /path/to/project1 ./input
./start-distillation.sh
# 等待完成...
./stop-distillation.sh

# 備份結果
mv output project1_output

# 項目2
python3 scripts/split_docs.py /path/to/project2 ./input
./start-distillation.sh
```

---

## 📊 實際案例

### 案例1: 蒸餾26個GitHub倉庫
- **原始文檔**: 781個md文件
- **去重後**: 507個唯一文檔
- **蒸餾結果**: 492個高價值蒸餾報告（15個低分跳過）
- **總成本**: $26.43 USD (฿938 THB)
- **時間**: 2小時15分鐘（3容器並發）
- **單線程對比**: 約6-7小時

### 案例2: Notion導出的個人筆記
- **原始文檔**: 1,234個md文件
- **去重後**: 856個唯一文檔
- **蒸餾結果**: 823個精華提取
- **總成本**: $45.67 USD
- **時間**: 3小時50分鐘

---

## 💡 最佳實踐

1. **預算控制**: 設置每個容器$10，總計$30即可處理500個文檔
2. **API key輪換**: 如果有更多keys，可以配置到更多容器
3. **磁盤空間**: 確保至少10GB空閒空間
4. **網絡穩定**: VPS選擇網絡穩定的區域
5. **批量處理**: 先小批量測試，再大規模蒸餾

---

## 🚀 下一步

蒸餾完成後，你可以：
1. 將蒸餾結果推送到新的GitHub倉庫
2. 生成知識圖譜
3. 創建個人知識庫網站
4. 訓練專屬AI模型

**數字黃金已提煉完成，開始創造吧！** 💎✨
