# ⚡ Doppler 命令速查

> **1分鐘掌握所有 Doppler 操作**

---

## 🎯 常用命令 (99% 只用這些)

### 查看所有 Keys
```bash
doppler secrets
```

### 查看 Key 名稱列表
```bash
doppler secrets --only-names
```

### 獲取單個 Key 的值
```bash
doppler secrets get RESEND_API_KEY
```

### 添加/更新單個 Key
```bash
doppler secrets set RESEND_API_KEY="re_TSnXmDTx..."
```

### 批量添加多個 Keys
```bash
doppler secrets set \
  KEY1="value1" \
  KEY2="value2" \
  KEY3="value3"
```

### 刪除 Key
```bash
doppler secrets delete OLD_KEY_NAME
```

### 搜索包含關鍵字的 Keys
```bash
doppler secrets | grep -i "gemini"
doppler secrets | grep -i "devcycle"
doppler secrets | grep -i "openrouter"
```

---

## 🔥 實戰範例

### 添加 DevCycle 所有 Keys (一次完成)
```bash
doppler secrets set \
  DEVCYCLE_DEV_CLIENT="dvc_client_..." \
  DEVCYCLE_DEV_MOBILE="dvc_mobile_..." \
  DEVCYCLE_DEV_SERVER="dvc_server_..." \
  DEVCYCLE_STAGING_CLIENT="dvc_client_..." \
  DEVCYCLE_STAGING_MOBILE="dvc_mobile_..." \
  DEVCYCLE_STAGING_SERVER="dvc_server_..." \
  DEVCYCLE_PROD_CLIENT="dvc_client_..." \
  DEVCYCLE_PROD_MOBILE="dvc_mobile_..." \
  DEVCYCLE_PROD_SERVER="dvc_server_..."
```

### 查看所有 AI API Keys
```bash
doppler secrets | grep -E "(OPENROUTER|GEMINI|XAI|ANTHROPIC)"
```

### 查看所有數據庫連接
```bash
doppler secrets | grep -E "(MONGODB|SUPABASE|REDIS|POSTGRESQL)"
```

### 導出為 .env 文件 (本地測試用)
```bash
doppler secrets download --no-file --format env > .env
```

---

## 📊 當前配置統計

```bash
# 總共 107 個環境變量
doppler secrets --only-names | wc -l

# 按服務分類統計
doppler secrets --only-names | grep "^GEMINI" | wc -l      # 19 個 Gemini Keys
doppler secrets --only-names | grep "^OPENROUTER" | wc -l  # 5 個 OpenRouter Keys
doppler secrets --only-names | grep "^DEVCYCLE" | wc -l    # 12 個 DevCycle Keys
doppler secrets --only-names | grep "^XAI" | wc -l         # 2 個 xAI Keys
```

---

## 🎯 進入項目目錄後自動加載

在專案根目錄已配置:
```bash
cd /mnt/volume_sgp1_01/deepway-mcp
# Doppler 自動載入 deepway-mcp 項目的 dev 環境
```

配置文件: `.doppler.yaml`
```yaml
setup:
  project: deepway-mcp
  config: dev
```

---

## 🚨 注意事項

1. **所有命令在項目根目錄執行**
   ```bash
   cd /mnt/volume_sgp1_01/deepway-mcp
   ```

2. **Key 值包含特殊字符要加引號**
   ```bash
   doppler secrets set KEY="value-with-dash"
   ```

3. **批量操作用反斜杠換行**
   ```bash
   doppler secrets set \
     KEY1="value1" \
     KEY2="value2"
   ```

4. **刪除前先確認**
   ```bash
   doppler secrets get OLD_KEY  # 先查看
   doppler secrets delete OLD_KEY  # 確認後刪除
   ```

---

**就這些!** 🎉 夠用了!
