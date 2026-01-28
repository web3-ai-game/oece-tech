# 🚀 快速啟動指南

## 一鍵克隆並啟動

```bash
# 1. 克隆項目
git clone https://github.com/web3-ai-game/digital-assets-distiller-v2.git
cd digital-assets-distiller-v2

# 2. 配置API keys（編輯這個文件）
nano config/api-keys.env

# 3. 一鍵啟動（自動完成所有步驟）
./start-distillation.sh

# 4. 查看實時監控
pm2 monit
```

## VPS上快速部署

```bash
# SSH登錄VPS後執行
curl -fsSL https://raw.githubusercontent.com/web3-ai-game/digital-assets-distiller-v2/main/quick-deploy.sh | bash
```

## 核心命令

```bash
# 查看容器狀態
docker ps

# 查看容器日誌
docker logs -f distiller-wave1
docker logs -f distiller-wave2
docker logs -f distiller-wave3

# 查看PM2監控
pm2 list
pm2 logs distiller-monitor

# 停止蒸餾
./stop-distillation.sh

# 重啟蒸餾（從檢查點繼續）
./start-distillation.sh
```

## 目錄結構說明

```
input/wave1/     ← Wave 1 處理的文檔
input/wave2/     ← Wave 2 處理的文檔
input/wave3/     ← Wave 3 處理的文檔

output/wave1/    ← Wave 1 蒸餾結果
output/wave2/    ← Wave 2 蒸餾結果
output/wave3/    ← Wave 3 蒸餾結果

checkpoints/     ← 進度檢查點（支持斷點續傳）
logs/            ← PM2日誌
```

## 預期效果

- **並發速度**: 3個容器同時工作，速度提升3倍
- **成本控制**: 每個容器最多$10，總計$30預算
- **智能去重**: 自動跳過低價值文檔
- **斷點續傳**: 意外中斷後可從檢查點繼續

## 故障排除

```bash
# 如果容器無法啟動
docker-compose logs

# 如果PM2監控失敗
pm2 restart distiller-monitor

# 清理並重新開始
docker-compose down -v
rm -rf checkpoints/* output/* input/*
./start-distillation.sh
```

## 進階配置

編輯 `config/api-keys.env` 調整：
- `BUDGET_LIMIT`: 每個容器的預算上限（USD）
- `MODEL_NAME`: 使用的Gemini模型
- `EXCHANGE_RATE`: 匯率（用於顯示泰銖）
