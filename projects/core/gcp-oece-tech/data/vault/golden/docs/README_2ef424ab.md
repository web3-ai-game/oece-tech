# 📖 README - 多普勒文檔中心

> **快速導航**: 5秒找到任何 API Key!

---

## 📚 文檔目錄

| 文檔 | 用途 | 適合場景 |
|------|------|---------|
| **01_快速找Key指南.md** | 詳細查找教程 | 第一次註冊服務,不知道 Key 在哪 |
| **02_Doppler命令速查.md** | Doppler CLI 命令 | 忘記 Doppler 命令語法 |
| **03_所有服務API登錄地址.md** | 快速登錄鏈接 | 需要快速打開服務後台 |
| **04_當前所有Keys清單.md** | 完整 Keys 列表 | 查看已配置的所有環境變量 |

---

## 🎯 快速使用指南

### 場景 1: 我要找 DevCycle 的 API Key
```
1. 打開 → 03_所有服務API登錄地址.md
2. 點擊 → https://app.devcycle.com
3. 導航 → Environments & Keys
4. 複製 → 對應環境的 Key
5. 添加 → doppler secrets set DEVCYCLE_DEV_CLIENT="..."
```

### 場景 2: 我忘記 Doppler 命令怎麼寫
```
打開 → 02_Doppler命令速查.md
找到 → 對應操作的命令範例
複製 → 直接粘貼執行
```

### 場景 3: 我要查看所有 AI API Keys
```
打開 → 04_當前所有Keys清單.md
搜索 → "AI API Keys" 章節
查看 → 29 個 AI Keys 完整列表
```

### 場景 4: 新服務不知道 Key 在哪
```
打開 → 01_快速找Key指南.md
搜索 → 服務名稱 (如 "OpenRouter")
跟隨 → 步驟 1-2-3 找到 Key
```

---

## 🔥 最常用操作

### 查看所有 Keys
```bash
cd /mnt/volume_sgp1_01/deepway-mcp
doppler secrets
```

### 添加新 Key
```bash
doppler secrets set SERVICE_KEY="your-api-key"
```

### 搜索特定服務
```bash
doppler secrets | grep -i "devcycle"
```

---

## 📊 當前統計

- **總環境變量**: 107 個
- **AI API Keys**: 29 個 (OpenRouter 5 + Gemini 19 + xAI 2 + Claude 2 + Anthropic 1)
- **數據庫 Keys**: 11 個 (Supabase 3 + MongoDB 2 + Redis 3 + PostgreSQL 3)
- **開發工具**: 15 個 (DevCycle 12 + GitHub 2 + Bootstrap 1)
- **監控服務**: 6 個 (Datadog 2 + Sentry 2 + Honeybadger 2)

---

## 🎨 文檔特色

✅ **精簡直達** - 去除廢話,直奔主題  
✅ **快速鏈接** - 一鍵打開服務後台  
✅ **命令即用** - 複製粘貼直接執行  
✅ **分類清晰** - 按服務類型組織  
✅ **安全標注** - 標記保密等級

---

## 🚀 下次找 Key 只需 3 步

```
1. 打開 → 03_所有服務API登錄地址.md
2. 點擊 → 對應服務鏈接
3. 複製 → Key 添加到 Doppler
```

**就這麼簡單!** 🎉

---

## 📝 維護建議

每次添加新服務後:
1. 更新 `01_快速找Key指南.md` - 添加查找步驟
2. 更新 `03_所有服務API登錄地址.md` - 添加登錄鏈接
3. 更新 `04_當前所有Keys清單.md` - 更新 Keys 列表
4. 更新統計數字

---

**Happy Coding!** 💻
