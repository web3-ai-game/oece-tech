# 🔄 DO → GCP 水平遷移計劃

**遷移日期**: 2025-11-26  
**源環境**: DigitalOcean (8vCPU 16GB AMD Singapore)  
**目標環境**: Google Cloud Platform  
**數據量**: 207MB (/mnt/sms)

---

## 📋 遷移前檢查清單

### DO當前狀態確認
- [x] GitHub資產重組完成 (32→7倉庫)
- [x] 完整備份已推送 (sms-complete-archive-final)
- [x] 本地數據完整 (/mnt/sms 207MB)
- [ ] 導出DO配置信息
- [ ] 記錄當前服務端口和進程
- [ ] 備份環境變量和密鑰

### GitHub備份驗證
- [x] sms-complete-archive-final (207MB完整備份)
- [x] legacy-repos-archive (24個歷史項目)
- [x] 核心5倉庫 (notion-sms, sms-key等)
- [ ] 驗證GitHub備份可拉取

---

## 🚀 遷移步驟 (5步完成)

### Step 1: GCP環境創建 (30分鐘)

#### 1.1 創建GCP實例
```bash
# GCP Console操作
Project: [你的項目名]
Region: asia-east1 (台灣) 或 asia-southeast1 (新加坡)
Machine Type: e2-standard-4 (4vCPU 16GB) 或 n2-standard-4
Boot Disk: Ubuntu 22.04 LTS, 100GB SSD
Network: 允許HTTP/HTTPS/SSH
```

#### 1.2 配置SSH訪問
```bash
# 本地生成SSH密鑰(如果沒有)
ssh-keygen -t ed25519 -C "gcp-migration"

# 添加公鑰到GCP實例
# GCP Console > Compute Engine > Metadata > SSH Keys
cat ~/.ssh/id_ed25519.pub
```

#### 1.3 首次登錄
```bash
# 從DO連接到GCP
ssh -i ~/.ssh/id_ed25519 [username]@[GCP_EXTERNAL_IP]

# 或從本地連接
gcloud compute ssh [instance-name] --zone=[zone]
```

---

### Step 2: GCP環境配置 (20分鐘)

#### 2.1 系統更新
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3 python3-pip python3-venv curl wget htop
```

#### 2.2 安裝Python依賴
```bash
# 創建工作目錄
sudo mkdir -p /mnt/sms
sudo chown $USER:$USER /mnt/sms
cd /mnt/sms

# 創建虛擬環境
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
```

#### 2.3 配置Git
```bash
git config --global user.name "web3-ai-game"
git config --global user.email "your-email@example.com"
git config --global credential.helper store
```

#### 2.4 配置環境變量
```bash
cat > /mnt/sms/.env << 'EOF'
# Notion API
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxx

# GitHub
GITHUB_TOKEN=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

# OpenAI
OPENAI_API_KEY=sk-xxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Redis (如需要)
REDIS_URL=redis://localhost:6379
EOF

# 加載環境變量
echo "source /mnt/sms/.env" >> ~/.bashrc
source ~/.bashrc
```

---

### Step 3: 數據遷移 (15分鐘)

#### 3.1 從GitHub克隆完整備份
```bash
cd /mnt/sms

# 克隆完整備份
git clone https://github.com/web3-ai-game/sms-complete-archive-final.git temp_backup

# 移動內容到當前目錄
mv temp_backup/* ./
mv temp_backup/.* ./ 2>/dev/null || true
rm -rf temp_backup

# 驗證文件結構
ls -lah
du -sh .
```

#### 3.2 驗證數據完整性
```bash
# 檢查關鍵目錄
echo "📊 數據完整性檢查..."
[ -d "vectors" ] && echo "✅ vectors/ 目錄存在" || echo "❌ vectors/ 缺失"
[ -d "golden_files" ] && echo "✅ golden_files/ 目錄存在" || echo "❌ golden_files/ 缺失"
[ -f "ASSET_INVENTORY.md" ] && echo "✅ ASSET_INVENTORY.md 存在" || echo "❌ 文檔缺失"

# 統計文件數量
echo ""
echo "📈 文件統計:"
find . -type f -name "*.md" | wc -l | xargs echo "Markdown文件:"
find . -type f -name "*.py" | wc -l | xargs echo "Python文件:"
find vectors/ -type f 2>/dev/null | wc -l | xargs echo "向量文件:"
```

#### 3.3 安裝項目依賴
```bash
# 如果有requirements.txt
[ -f requirements.txt ] && pip install -r requirements.txt

# 常用依賴
pip install notion-client openai anthropic fastapi uvicorn websockets redis chromadb langchain networkx
```

---

### Step 4: 環境驗證 (10分鐘)

#### 4.1 健康檢查腳本
```bash
cat > /mnt/sms/health_check.py << 'PYEOF'
#!/usr/bin/env python3
import os
import sys
from pathlib import Path

def check_environment():
    """檢查GCP環境配置"""
    print("🔍 GCP環境健康檢查\n")
    
    checks = {
        "Notion Token": os.getenv("NOTION_TOKEN"),
        "GitHub Token": os.getenv("GITHUB_TOKEN"),
        "OpenAI Key": os.getenv("OPENAI_API_KEY"),
        "vectors/ 目錄": Path("vectors").exists(),
        "golden_files/ 目錄": Path("golden_files").exists(),
    }
    
    passed = 0
    for name, status in checks.items():
        symbol = "✅" if status else "❌"
        print(f"{symbol} {name}: {status}")
        if status:
            passed += 1
    
    print(f"\n📊 通過: {passed}/{len(checks)}")
    return passed == len(checks)

if __name__ == "__main__":
    success = check_environment()
    sys.exit(0 if success else 1)
PYEOF

chmod +x /mnt/sms/health_check.py
python3 /mnt/sms/health_check.py
```

#### 4.2 Notion API連接測試
```bash
cat > /mnt/sms/test_notion.py << 'PYEOF'
#!/usr/bin/env python3
import os
from notion_client import Client

notion = Client(auth=os.getenv("NOTION_TOKEN"))

try:
    # 測試連接
    user = notion.users.me()
    print(f"✅ Notion連接成功!")
    print(f"用戶: {user.get('name', 'N/A')}")
    print(f"Bot ID: {user.get('id', 'N/A')}")
except Exception as e:
    print(f"❌ Notion連接失敗: {e}")
PYEOF

chmod +x /mnt/sms/test_notion.py
python3 /mnt/sms/test_notion.py
```

#### 4.3 端口和防火牆配置
```bash
# GCP防火牆規則(Console操作)
# VPC Network > Firewall > Create Rule
# - Name: allow-api-server
# - Target: All instances in network
# - Source IP: 0.0.0.0/0
# - Ports: tcp:8000,tcp:8080,tcp:443

# 測試端口監聽
sudo netstat -tlnp | grep -E ':(8000|8080|443)'
```

---

### Step 5: DO環境清理 (5分鐘)

#### 5.1 DO配置備份
```bash
# 在DO上執行
cat > /tmp/do_backup_config.sh << 'EOF'
#!/bin/bash
echo "📦 備份DO配置..."

# 導出環境變量
env > /tmp/do_env_backup.txt

# 備份關鍵配置
tar -czf /tmp/do_config_backup.tar.gz \
  ~/.bashrc \
  ~/.ssh/authorized_keys \
  /etc/systemd/system/*.service 2>/dev/null

# 記錄服務狀態
systemctl list-units --type=service --state=running > /tmp/do_services.txt

echo "✅ 配置已備份到 /tmp/"
ls -lh /tmp/do_*
EOF

bash /tmp/do_backup_config.sh

# 下載備份到本地
scp root@[DO_IP]:/tmp/do_*.{txt,tar.gz} ~/do_backup/
```

#### 5.2 最終數據確認
```bash
# 在DO上執行最後檢查
echo "🔍 DO最終數據確認..."
du -sh /mnt/sms
find /mnt/sms -type f | wc -l
md5sum /mnt/sms/ASSET_INVENTORY.md

# 在GCP上對比
echo "🔍 GCP數據驗證..."
du -sh /mnt/sms
find /mnt/sms -type f | wc -l
md5sum /mnt/sms/ASSET_INVENTORY.md
```

#### 5.3 摧毀DO Droplet
```bash
# 方式1: DigitalOcean Web Console
# Dashboard > Droplets > [你的droplet] > Destroy

# 方式2: doctl CLI
doctl compute droplet list
doctl compute droplet delete [droplet-id] --force

# 確認刪除
doctl compute droplet list
```

#### 5.4 取消DO訂閱
```bash
# DigitalOcean Console操作
# Account > Billing > Cancel Subscription
# 確認沒有餘額和pending charges
```

---

## ✅ 遷移驗證清單

### GCP環境驗證
- [ ] SSH可正常登錄
- [ ] Python虛擬環境激活
- [ ] Git配置正確
- [ ] 環境變量已加載

### 數據完整性驗證
- [ ] /mnt/sms 目錄大小 = 207MB
- [ ] 1,305個金文件完整
- [ ] 908個向量文件完整
- [ ] ASSET_INVENTORY.md存在

### 服務驗證
- [ ] Notion API連接成功
- [ ] GitHub API可訪問
- [ ] Python依賴已安裝
- [ ] 端口8000可監聽

### DO清理驗證
- [ ] DO配置已備份
- [ ] DO Droplet已刪除
- [ ] DO訂閱已取消
- [ ] 無遺留數據

---

## 🚨 緊急回滾計劃

如果GCP遷移失敗,可從GitHub恢復:

```bash
# 在任何新環境執行
git clone https://github.com/web3-ai-game/sms-complete-archive-final
cd sms-complete-archive-final
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# 恢復完成
```

---

## 📊 成本對比

### DigitalOcean
- 實例: 8vCPU 16GB AMD = $84/月
- 流量: 5TB/月 included
- **總計**: ~$84/月

### Google Cloud Platform  
- 實例: e2-standard-4 (4vCPU 16GB) = ~$120/月
- 或 n2-standard-4 (4vCPU 16GB) = ~$160/月
- 流量: 1GB/月 included, 超出$0.12/GB
- **總計**: ~$120-160/月

**建議**: 考慮GCP Committed Use Discounts (1年可省30%)

---

## 📝 遷移時間估算

| 步驟 | 預計時間 | 說明 |
|------|----------|------|
| GCP環境創建 | 30分鐘 | 實例配置+SSH設置 |
| GCP環境配置 | 20分鐘 | 安裝依賴+配置 |
| 數據遷移 | 15分鐘 | Git克隆+驗證 |
| 環境驗證 | 10分鐘 | 健康檢查+測試 |
| DO清理 | 5分鐘 | 備份+刪除 |
| **總計** | **80分鐘** | ~1.5小時 |

---

## 🎯 遷移成功標準

1. GCP環境可正常訪問
2. 所有數據完整(207MB, 1,305文件, 908向量)
3. Notion API連接正常
4. Python環境可運行
5. DO環境已完全清理
6. 備份已安全保存

---

**準備就緒! 可開始執行DO→GCP水平遷移!** 🚀

**文檔版本**: v1.0  
**創建時間**: 2025-11-26
