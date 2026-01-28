# 🔥 Digital Assets Distiller V2.0 - 並發蒸餾系統

> **數字黃金提煉器 - 三波並發蒸餾，效率提升300%！**

## 💎 核心特性

- **3個Docker容器並發運行**：每個容器獨立API key，互不干擾
- **PM2進程監控**：實時監控每個容器的蒸餾狀態
- **智能文檔分配**：自動將文檔分成3波，並發處理
- **Gemini 3 Pro驅動**：使用最強大的AI模型蒸餾數字資產
- **一鍵啟動/停止**：簡單命令啟動整個蒸餾系統

## 🚀 快速啟動

```bash
# 1. 克隆項目
git clone https://github.com/web3-ai-game/digital-assets-distiller-v2.git
cd digital-assets-distiller-v2

# 2. 配置API keys（編輯 config/api-keys.env）
cp config/api-keys.env.example config/api-keys.env
nano config/api-keys.env

# 3. 一鍵啟動蒸餾
./start-distillation.sh

# 4. 監控進度
pm2 monit

# 5. 停止蒸餾
./stop-distillation.sh
```

## 📁 項目結構

```
digital-assets-distiller-v2/
├── README.md                    # 項目說明
├── start-distillation.sh        # 一鍵啟動腳本
├── stop-distillation.sh         # 一鍵停止腳本
├── containers/
│   ├── Dockerfile              # 統一Docker鏡像
│   └── docker-compose.yml      # 3容器編排
├── scripts/
│   ├── distiller.py            # 核心蒸餾引擎
│   ├── monitor.py              # PM2監控腳本
│   └── split_docs.py           # 文檔分配腳本
├── config/
│   ├── api-keys.env.example    # API配置模板
│   └── ecosystem.config.js     # PM2配置
└── output/
    ├── wave1/                  # 第一波輸出
    ├── wave2/                  # 第二波輸出
    └── wave3/                  # 第三波輸出
```

## 🔑 API Keys配置

三個收費Gemini keys（在 `config/api-keys.env`）：
```
API_KEY_1=AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4
API_KEY_2=AIzaSyAj08QZ4B8CMU_CTG-QtGUEv0gBHZbM_cQ
API_KEY_3=AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw
```

## 🎯 使用的模型

- **收費key**: `gemini-3-pro-preview` (深度思考3.0 Pro)
- **免費key**: `gemini-2.0-flash-lite` (僅用於測試)

## 📊 蒸餾階段

1. **去重分析** (temp=0.7): 識別重複內容
2. **精華提取** (temp=0.3): 提取核心知識
3. **邏輯整合** (temp=0.3): 結構化組織
4. **創意擴展** (temp=0.9): 生成新見解

## 💰 成本控制

- 預算上限: $10 USD / 容器
- 實時監控: 泰銖本位顯示
- 自動停止: 達到限額自動暫停

## 🐳 Docker架構

- **容器1**: 處理前1/3文檔 (API_KEY_1)
- **容器2**: 處理中1/3文檔 (API_KEY_2)
- **容器3**: 處理後1/3文檔 (API_KEY_3)

## 🔧 依賴要求

- Docker & Docker Compose
- PM2 (Node.js process manager)
- Python 3.10+
- 100GB+ 可用磁盤空間

## 📝 License

MIT License - 數字黃金自由流通

## 🌟 作者

web3-ai-game - 數字游民 & AI煉金術士
