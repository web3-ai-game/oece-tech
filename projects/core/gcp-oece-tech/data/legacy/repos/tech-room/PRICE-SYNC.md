# 💰 价格自动同步系统

## 🎯 目标

由于 AI 资源和服务价格变动频繁，需要：
1. GitHub 作为单一真实数据源
2. 服务器自动同步最新价格
3. 无需手动 SSH 修改
4. 支持多币种显示

---

## 📊 价格数据结构

### 创建价格配置文件

`config/pricing.json`:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-10-19T06:00:00Z",
  "currency": {
    "primary": "USD",
    "supported": ["USD", "CNY", "SGD", "HKD"]
  },
  "exchangeRates": {
    "CNY": 7.2,
    "SGD": 1.35,
    "HKD": 7.8
  },
  "plans": [
    {
      "id": "free",
      "name": {
        "zh-TW": "免費版",
        "en": "Free"
      },
      "priceUSD": 0,
      "period": "forever",
      "features": [
        "基礎教程訪問",
        "社區論壇",
        "基礎工具使用",
        "每月 10 次 API 調用"
      ],
      "limitations": [
        "廣告顯示",
        "標準速度"
      ],
      "cta": "開始使用",
      "highlighted": false
    },
    {
      "id": "pro",
      "name": {
        "zh-TW": "專業版",
        "en": "Professional"
      },
      "priceUSD": 9.99,
      "period": "month",
      "discount": {
        "enabled": true,
        "text": "首月 5 折",
        "code": "LAUNCH50"
      },
      "features": [
        "所有免費版功能",
        "解鎖全部教程",
        "無廣告體驗",
        "優先技術支持",
        "每月 1000 次 API 調用",
        "下載離線教程",
        "專屬會員徽章"
      ],
      "limitations": [],
      "cta": "立即訂閱",
      "highlighted": true
    },
    {
      "id": "enterprise",
      "name": {
        "zh-TW": "企業版",
        "en": "Enterprise"
      },
      "priceUSD": 29.99,
      "period": "month",
      "features": [
        "所有專業版功能",
        "團隊協作功能",
        "無限 API 調用",
        "私有部署支持",
        "定制教程內容",
        "1對1 技術指導",
        "企業專屬論壇",
        "SLA 保障"
      ],
      "limitations": [],
      "cta": "聯繫我們",
      "highlighted": false
    }
  ],
  "ai_services": {
    "openai": {
      "gpt4": {
        "input": 0.03,
        "output": 0.06,
        "unit": "per 1K tokens"
      },
      "gpt35": {
        "input": 0.001,
        "output": 0.002,
        "unit": "per 1K tokens"
      }
    },
    "anthropic": {
      "claude3_opus": {
        "input": 0.015,
        "output": 0.075,
        "unit": "per 1K tokens"
      },
      "claude3_sonnet": {
        "input": 0.003,
        "output": 0.015,
        "unit": "per 1K tokens"
      }
    }
  },
  "vps_pricing": {
    "digitalocean": {
      "basic": {
        "ram": "2GB",
        "cpu": "2 vCPU",
        "ssd": "60GB",
        "transfer": "3TB",
        "priceUSD": 12,
        "period": "month"
      },
      "database": {
        "type": "PostgreSQL",
        "ram": "1GB",
        "disk": "10GB",
        "priceUSD": 15,
        "period": "month"
      }
    }
  }
}
```

---

## 🔄 自动同步机制

### 方案 1: GitHub Actions + Webhook（推荐）

#### 1.1 创建同步脚本

`scripts/sync-pricing.sh`:

```bash
#!/bin/bash
set -e

echo "💰 Syncing pricing data..."

PROJECT_DIR="/home/geeksea/geeksea"
CONFIG_FILE="$PROJECT_DIR/config/pricing.json"
BACKUP_DIR="$PROJECT_DIR/config/backups"

cd $PROJECT_DIR

# 创建备份
mkdir -p $BACKUP_DIR
if [ -f "$CONFIG_FILE" ]; then
    cp $CONFIG_FILE "$BACKUP_DIR/pricing_$(date +%Y%m%d_%H%M%S).json"
fi

# 拉取最新代码
git pull origin main

# 验证 JSON 格式
if ! jq empty $CONFIG_FILE 2>/dev/null; then
    echo "❌ Invalid JSON format, restoring backup..."
    cp $BACKUP_DIR/pricing_*.json $CONFIG_FILE | tail -1
    exit 1
fi

# 触发应用重载（无需重启）
# Next.js 会自动读取新配置
echo "✅ Pricing data synced successfully!"

# 可选：通知
curl -X POST https://geeksea.com/api/webhook/pricing-updated \
  -H "Authorization: Bearer $WEBHOOK_SECRET" \
  -d '{"status": "success", "timestamp": "'$(date -Iseconds)'"}'
```

#### 1.2 GitHub Actions 配置

`.github/workflows/sync-pricing.yml`:

```yaml
name: Sync Pricing to Server

on:
  push:
    paths:
      - 'config/pricing.json'
    branches: [main]
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    
    steps:
      - name: Trigger Server Sync
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DO_HOST }}
          username: geeksea
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            /home/geeksea/geeksea/scripts/sync-pricing.sh
      
      - name: Notify Success
        run: echo "✅ Pricing synced to production!"
```

---

### 方案 2: API 读取（实时）

#### 2.1 创建价格 API

`app/api/pricing/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 缓存配置（5分钟）
let cachedPricing: any = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const currency = searchParams.get('currency') || 'USD'
  const lang = searchParams.get('lang') || 'zh-TW'
  
  try {
    // 检查缓存
    if (cachedPricing && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedPricing,
        cached: true,
        cacheAge: Math.floor((Date.now() - cacheTime) / 1000)
      })
    }
    
    // 读取配置文件
    const configPath = path.join(process.cwd(), 'config', 'pricing.json')
    const data = fs.readFileSync(configPath, 'utf-8')
    const pricing = JSON.parse(data)
    
    // 货币转换
    const plans = pricing.plans.map((plan: any) => {
      let price = plan.priceUSD
      
      if (currency !== 'USD' && pricing.exchangeRates[currency]) {
        price = (plan.priceUSD * pricing.exchangeRates[currency]).toFixed(2)
      }
      
      return {
        ...plan,
        price,
        currency,
        name: plan.name[lang] || plan.name['zh-TW']
      }
    })
    
    const response = {
      version: pricing.version,
      lastUpdated: pricing.lastUpdated,
      currency,
      plans,
      vps: pricing.vps_pricing,
      ai_services: pricing.ai_services
    }
    
    // 更新缓存
    cachedPricing = response
    cacheTime = Date.now()
    
    return NextResponse.json({
      ...response,
      cached: false
    })
    
  } catch (error) {
    console.error('Error reading pricing config:', error)
    return NextResponse.json(
      { error: 'Failed to load pricing' },
      { status: 500 }
    )
  }
}

// 清除缓存端点（需要认证）
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader !== `Bearer ${process.env.PRICING_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  cachedPricing = null
  cacheTime = 0
  
  return NextResponse.json({ message: 'Cache cleared' })
}
```

#### 2.2 前端使用

更新 `app/pricing/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function PricingPage() {
  const [pricing, setPricing] = useState<any>(null)
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchPricing()
  }, [currency])
  
  const fetchPricing = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pricing?currency=${currency}&lang=zh-TW`)
      const data = await res.json()
      setPricing(data)
    } catch (error) {
      console.error('Failed to fetch pricing:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading || !pricing) {
    return <div>Loading pricing...</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 货币选择器 */}
      <div className="flex justify-center gap-2 mb-8">
        {['USD', 'CNY', 'SGD', 'HKD'].map(curr => (
          <button
            key={curr}
            onClick={() => setCurrency(curr)}
            className={`px-4 py-2 rounded ${
              currency === curr ? 'btn-pixel' : 'btn-pixel-outline'
            }`}
          >
            {curr}
          </button>
        ))}
      </div>
      
      {/* 价格卡片 */}
      <div className="grid md:grid-cols-3 gap-8">
        {pricing.plans.map((plan: any) => (
          <div key={plan.id} className="card-pixel-glow">
            <h3 className="text-pixel-lg mb-4">{plan.name}</h3>
            <div className="text-4xl font-bold mb-4">
              {currency === 'USD' && '$'}
              {currency === 'CNY' && '¥'}
              {currency === 'SGD' && 'S$'}
              {currency === 'HKD' && 'HK$'}
              {plan.price}
            </div>
            {/* ... 其他内容 */}
          </div>
        ))}
      </div>
      
      {/* 更新时间 */}
      <div className="text-center mt-8 text-sm text-pixel-light/50">
        最後更新: {new Date(pricing.lastUpdated).toLocaleString('zh-TW')}
        {pricing.cached && ` (緩存: ${pricing.cacheAge}秒前)`}
      </div>
    </div>
  )
}
```

---

## 📱 实时价格监控

### Webhook 通知

`app/api/webhook/pricing-updated/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  
  // 可以发送通知到 Discord/Slack/Email
  console.log('Pricing updated:', body)
  
  // 清除缓存
  // ... 触发缓存更新
  
  return NextResponse.json({ success: true })
}
```

---

## 🔧 快速更新价格

### 1. 本地修改

```bash
# 编辑价格配置
nano config/pricing.json

# 提交到 GitHub
git add config/pricing.json
git commit -m "💰 Update pricing: Pro plan $8.99"
git push origin main
```

### 2. 自动同步到服务器

GitHub Actions 自动触发，30秒内生效！

### 3. 验证

```bash
# 访问 API 查看
curl https://geeksea.com/api/pricing

# 查看服务器同步日志
ssh geeksea@YOUR_IP
pm2 logs geeksea | grep "pricing"
```

---

## 📊 AI 服务价格追踪

### 自动抓取外部价格

`scripts/fetch-ai-prices.js`:

```javascript
// 定期抓取 OpenAI/Anthropic 价格
const fetchAIPrices = async () => {
  // 从官网 API 或 Scraping 获取最新价格
  const openaiPrices = await fetch('https://openai.com/api/pricing')
  const anthropicPrices = await fetch('https://anthropic.com/api/pricing')
  
  // 更新 pricing.json
  // ...
  
  // 提交到 GitHub
  exec('git add config/pricing.json && git commit -m "🤖 Auto-update AI prices" && git push')
}

// 每天运行
schedule('0 0 * * *', fetchAIPrices)
```

---

## ✅ 部署清单

### 服务器端

```bash
# 1. 创建配置目录
mkdir -p /home/geeksea/geeksea/config/backups

# 2. 添加同步脚本
nano /home/geeksea/geeksea/scripts/sync-pricing.sh
chmod +x /home/geeksea/geeksea/scripts/sync-pricing.sh

# 3. 设置 Webhook Secret
echo "WEBHOOK_SECRET=your_secret_here" >> /home/geeksea/geeksea/.env.production
echo "PRICING_WEBHOOK_SECRET=your_secret_here" >> /home/geeksea/geeksea/.env.production

# 4. 测试同步
/home/geeksea/geeksea/scripts/sync-pricing.sh
```

### GitHub 端

```bash
# 1. 添加 Secrets
# Settings → Secrets → Actions
# 添加: DO_HOST, DO_SSH_KEY, WEBHOOK_SECRET

# 2. 测试 Workflow
# 修改 pricing.json 并 push
git add config/pricing.json
git commit -m "test: pricing sync"
git push

# 3. 查看 Actions 运行状态
# GitHub → Actions → Sync Pricing to Server
```

---

## 🎯 使用流程

### 日常价格更新

```bash
# 1. 克隆到本地（如果还没有）
git clone https://github.com/YOUR_USERNAME/geeksea.git
cd geeksea

# 2. 修改价格
nano config/pricing.json
# 只需修改 priceUSD 字段即可

# 3. 提交并推送
git add config/pricing.json
git commit -m "💰 Update Pro plan: $7.99"
git push origin main

# 4. 等待 30 秒，自动同步到服务器
# 5. 验证: 访问 https://geeksea.com/pricing
```

### 紧急价格调整

```bash
# 如果需要立即生效，手动触发
ssh geeksea@YOUR_IP
cd /home/geeksea/geeksea
./scripts/sync-pricing.sh
```

---

**配置完成后，你只需要在 GitHub 修改 `config/pricing.json`，服务器会自动同步！** 🚀
