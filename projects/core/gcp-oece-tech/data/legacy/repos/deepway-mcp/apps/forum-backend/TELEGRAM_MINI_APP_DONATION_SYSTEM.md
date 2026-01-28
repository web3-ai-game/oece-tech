# 💎 Telegram Mini App 打赏系统设计

## 🎯 系统概述

打造一个现代化的打赏Mini App，连接小爱同学，让群友可以通过Telegram Stars打赏，解锁VIP特权！

### 核心功能
```yaml
1. 打赏方式:
   ✓ Telegram Stars (官方支付)
   ✓ 加密货币 (BTC, ETH, USDT)
   ✓ 支付宝/微信 (二维码)

2. VIP特权:
   ✓ 无日配额限制
   ✓ 优先响应队列
   ✓ 专属模型访问
   ✓ 自定义系统提示词
   ✓ 历史对话导出

3. 打赏档位:
   ✓ 轻量支持: 10 Stars = 1天VIP
   ✓ 标准支持: 50 Stars = 7天VIP
   ✓ 超级支持: 200 Stars = 30天VIP
   ✓ 终身会员: 1000 Stars = 永久VIP
```

## 🏗️ 技术架构

### 前端 (Telegram Mini App)
```
技术栈:
  - React 18 + TypeScript
  - Telegram WebApp SDK
  - TailwindCSS + Framer Motion
  - Zustand (状态管理)
  - React Query (数据获取)

特性:
  - 🎨 赛博朋克UI风格
  - 🌈 流畅动画效果
  - 📱 完美适配Telegram
  - 🔐 JWT认证集成
  - ⚡ 极速加载(<2s)
```

### 后端 (Go API)
```go
架构:
  - Gin Web Framework
  - JWT认证
  - Supabase数据库
  - Redis缓存
  - Telegram Bot API
  - Blockchain API (Blockchair)

端点:
  GET  /api/v1/user/profile       # 用户信息
  GET  /api/v1/donation/tiers     # 打赏档位
  POST /api/v1/donation/create    # 创建打赏订单
  POST /api/v1/donation/verify    # 验证支付
  GET  /api/v1/donation/history   # 打赏历史
  GET  /api/v1/vip/status         # VIP状态
  POST /api/v1/vip/activate       # 激活VIP
```

## 💰 打赏档位设计

### 档位配置
```go
type DonationTier struct {
    ID          string  `json:"id"`
    Name        string  `json:"name"`
    Description string  `json:"description"`
    PriceStars  int     `json:"price_stars"`
    PriceUSD    float64 `json:"price_usd"`
    VIPDays     int     `json:"vip_days"`
    Badge       string  `json:"badge"`
    Features    []string `json:"features"`
}

var Tiers = []DonationTier{
    {
        ID:          "tier_1",
        Name:        "轻量支持 ☕",
        Description: "请小爱喝杯咖啡",
        PriceStars:  10,
        PriceUSD:    0.50,
        VIPDays:     1,
        Badge:       "🌟",
        Features: []string{
            "1天VIP特权",
            "无配额限制",
            "优先响应",
        },
    },
    {
        ID:          "tier_2",
        Name:        "标准支持 🎁",
        Description: "送小爱一份礼物",
        PriceStars:  50,
        PriceUSD:    2.50,
        VIPDays:     7,
        Badge:       "⭐⭐",
        Features: []string{
            "7天VIP特权",
            "无配额限制",
            "优先响应",
            "专属模型",
        },
    },
    {
        ID:          "tier_3",
        Name:        "超级支持 🚀",
        Description: "成为小爱的超级粉丝",
        PriceStars:  200,
        PriceUSD:    10.00,
        VIPDays:     30,
        Badge:       "⭐⭐⭐",
        Features: []string{
            "30天VIP特权",
            "无配额限制",
            "优先响应",
            "专属模型",
            "自定义提示词",
        },
    },
    {
        ID:          "tier_4",
        Name:        "终身会员 👑",
        Description: "与小爱永远同在",
        PriceStars:  1000,
        PriceUSD:    50.00,
        VIPDays:     -1, // -1表示永久
        Badge:       "👑",
        Features: []string{
            "🔥 永久VIP特权",
            "无配额限制",
            "最高优先级",
            "专属模型",
            "自定义提示词",
            "历史对话导出",
            "专属徽章",
        },
    },
}
```

## 📱 Mini App UI设计

### 页面结构
```
/                      # 首页 - 欢迎页面
/tiers                 # 打赏档位选择
/payment               # 支付页面
/success               # 支付成功
/profile               # 个人中心
/history               # 打赏历史
/vip                   # VIP特权展示
```

### 首页设计 (React)
```tsx
// src/pages/Home.tsx
import { TelegramWebApp } from '@twa-dev/sdk'
import { motion } from 'framer-motion'

export function HomePage() {
    const tg = TelegramWebApp()
    const user = tg.initDataUnsafe.user

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
            {/* 头部 */}
            <header className="p-6">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-3xl">
                        🤖
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">小爱同学</h1>
                        <p className="text-gray-300">AI智能助手</p>
                    </div>
                </motion.div>
            </header>

            {/* 用户卡片 */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mx-6 p-6 bg-white/10 backdrop-blur-lg rounded-2xl"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-300">Hi, {user?.first_name}</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {getVIPStatus() ? '👑 VIP会员' : '普通用户'}
                        </p>
                    </div>
                    {getVIPStatus() && (
                        <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                            <p className="text-sm font-bold text-white">
                                剩余 {getVIPDays()} 天
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 打赏档位 */}
            <div className="p-6 space-y-4 mt-6">
                <h2 className="text-xl font-bold text-white mb-4">💎 支持小爱</h2>
                {Tiers.map((tier, index) => (
                    <TierCard key={tier.id} tier={tier} index={index} />
                ))}
            </div>

            {/* 底部按钮 */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                <button
                    onClick={() => navigate('/history')}
                    className="w-full py-4 bg-white/20 backdrop-blur-lg rounded-xl text-white font-bold"
                >
                    查看我的打赏记录
                </button>
            </div>
        </div>
    )
}

function TierCard({ tier, index }: { tier: DonationTier; index: number }) {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelectTier(tier)}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl cursor-pointer hover:bg-white/20 transition"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{tier.Badge}</span>
                        <h3 className="text-xl font-bold text-white">{tier.Name}</h3>
                    </div>
                    <p className="text-gray-300 mb-3">{tier.Description}</p>
                    <div className="space-y-1">
                        {tier.Features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-400 text-2xl font-bold">
                        <span>⭐</span>
                        <span>{tier.PriceStars}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        ≈ ${tier.PriceUSD}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
```

### 支付流程页面
```tsx
// src/pages/Payment.tsx
export function PaymentPage() {
    const { tier } = useParams()
    const [paymentMethod, setPaymentMethod] = useState('stars')

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 p-6">
            {/* 订单摘要 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4">订单确认</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                        <span>档位</span>
                        <span className="text-white font-bold">{tier.Name}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                        <span>VIP时长</span>
                        <span className="text-white font-bold">
                            {tier.VIPDays === -1 ? '永久' : `${tier.VIPDays}天`}
                        </span>
                    </div>
                    <div className="h-px bg-white/20 my-3" />
                    <div className="flex justify-between text-white font-bold text-lg">
                        <span>总计</span>
                        <span className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{tier.PriceStars}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* 支付方式选择 */}
            <div className="space-y-3 mb-6">
                <h3 className="text-lg font-bold text-white mb-3">选择支付方式</h3>
                
                {/* Telegram Stars */}
                <PaymentMethodCard
                    icon="⭐"
                    name="Telegram Stars"
                    description="推荐 - 官方支付"
                    selected={paymentMethod === 'stars'}
                    onClick={() => setPaymentMethod('stars')}
                />

                {/* 加密货币 */}
                <PaymentMethodCard
                    icon="₿"
                    name="加密货币"
                    description="BTC, ETH, USDT"
                    selected={paymentMethod === 'crypto'}
                    onClick={() => setPaymentMethod('crypto')}
                />
            </div>

            {/* 支付按钮 */}
            <button
                onClick={handlePay}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold text-lg"
            >
                {paymentMethod === 'stars' ? '使用 Stars 支付' : '生成支付地址'}
            </button>
        </div>
    )
}

async function handlePay() {
    if (paymentMethod === 'stars') {
        // 调用Telegram Stars支付
        TelegramWebApp().showPopup({
            title: '确认支付',
            message: `支付 ${tier.PriceStars} Stars 解锁VIP?`,
            buttons: [
                { id: 'cancel', type: 'cancel' },
                { id: 'pay', type: 'default', text: '确认支付' }
            ]
        }, (buttonId) => {
            if (buttonId === 'pay') {
                initiateStarsPayment()
            }
        })
    } else {
        // 生成加密货币地址
        generateCryptoAddress()
    }
}
```

## 🔐 后端API实现 (Go)

### 主要结构
```go
// internal/donation/types.go
package donation

type Donation struct {
    ID             string    `json:"id" db:"id"`
    UserID         int64     `json:"user_id" db:"user_id"`
    Username       string    `json:"username" db:"username"`
    TierID         string    `json:"tier_id" db:"tier_id"`
    Amount         float64   `json:"amount" db:"amount"`
    Currency       string    `json:"currency" db:"currency"` // STARS, BTC, ETH, USD
    PaymentMethod  string    `json:"payment_method" db:"payment_method"`
    PaymentID      string    `json:"payment_id" db:"payment_id"`
    Status         string    `json:"status" db:"status"` // pending, completed, failed
    VIPDays        int       `json:"vip_days" db:"vip_days"`
    CreatedAt      time.Time `json:"created_at" db:"created_at"`
    CompletedAt    *time.Time `json:"completed_at,omitempty" db:"completed_at"`
}

type VIPStatus struct {
    UserID      int64      `json:"user_id"`
    IsVIP       bool       `json:"is_vip"`
    IsLifetime  bool       `json:"is_lifetime"`
    ExpireAt    *time.Time `json:"expire_at,omitempty"`
    RemainingDays int      `json:"remaining_days"`
    Badge       string     `json:"badge"`
}
```

### API处理器
```go
// internal/donation/handlers.go
package donation

import (
    "github.com/gin-gonic/gin"
    "time"
)

type Handler struct {
    db    *Database
    redis *redis.Client
    bot   *telegram.Bot
}

// GET /api/v1/donation/tiers
func (h *Handler) GetTiers(c *gin.Context) {
    c.JSON(200, gin.H{
        "tiers": Tiers,
    })
}

// POST /api/v1/donation/create
func (h *Handler) CreateDonation(c *gin.Context) {
    var req struct {
        TierID        string `json:"tier_id" binding:"required"`
        PaymentMethod string `json:"payment_method" binding:"required"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    // 获取用户ID (从JWT)
    userID := c.GetInt64("user_id")
    username := c.GetString("username")
    
    // 查找档位
    tier := findTier(req.TierID)
    if tier == nil {
        c.JSON(404, gin.H{"error": "档位不存在"})
        return
    }
    
    // 创建订单
    donation := &Donation{
        ID:            generateID(),
        UserID:        userID,
        Username:      username,
        TierID:        req.TierID,
        Amount:        tier.PriceUSD,
        Currency:      "STARS",
        PaymentMethod: req.PaymentMethod,
        Status:        "pending",
        VIPDays:       tier.VIPDays,
        CreatedAt:     time.Now(),
    }
    
    // 保存到数据库
    if err := h.db.CreateDonation(donation); err != nil {
        c.JSON(500, gin.H{"error": "创建订单失败"})
        return
    }
    
    // 根据支付方式生成支付信息
    var paymentInfo interface{}
    switch req.PaymentMethod {
    case "stars":
        paymentInfo = h.generateStarsInvoice(donation, tier)
    case "crypto":
        paymentInfo = h.generateCryptoAddress(donation)
    }
    
    c.JSON(200, gin.H{
        "donation":    donation,
        "payment_info": paymentInfo,
    })
}

// POST /api/v1/donation/verify
func (h *Handler) VerifyPayment(c *gin.Context) {
    var req struct {
        DonationID string `json:"donation_id" binding:"required"`
        PaymentID  string `json:"payment_id"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    // 获取订单
    donation, err := h.db.GetDonation(req.DonationID)
    if err != nil {
        c.JSON(404, gin.H{"error": "订单不存在"})
        return
    }
    
    // 验证支付
    verified := false
    switch donation.PaymentMethod {
    case "stars":
        verified = h.verifyStarsPayment(req.PaymentID)
    case "crypto":
        verified = h.verifyCryptoPayment(donation, req.PaymentID)
    }
    
    if !verified {
        c.JSON(400, gin.H{"error": "支付验证失败"})
        return
    }
    
    // 更新订单状态
    now := time.Now()
    donation.Status = "completed"
    donation.PaymentID = req.PaymentID
    donation.CompletedAt = &now
    h.db.UpdateDonation(donation)
    
    // 激活VIP
    h.activateVIP(donation.UserID, donation.VIPDays)
    
    // 发送感谢消息
    h.sendThankYouMessage(donation)
    
    c.JSON(200, gin.H{
        "success": true,
        "donation": donation,
    })
}

// GET /api/v1/vip/status
func (h *Handler) GetVIPStatus(c *gin.Context) {
    userID := c.GetInt64("user_id")
    
    status, err := h.getVIPStatus(userID)
    if err != nil {
        c.JSON(500, gin.H{"error": "获取VIP状态失败"})
        return
    }
    
    c.JSON(200, status)
}

// POST /api/v1/vip/activate
func (h *Handler) ActivateVIP(userID int64, days int) error {
    if days == -1 {
        // 永久VIP
        return h.db.SetLifetimeVIP(userID)
    }
    
    // 计算过期时间
    expireAt := time.Now().AddDate(0, 0, days)
    
    // 如果已经是VIP，延长时间
    currentStatus, _ := h.getVIPStatus(userID)
    if currentStatus.IsVIP && currentStatus.ExpireAt != nil {
        if currentStatus.ExpireAt.After(time.Now()) {
            expireAt = currentStatus.ExpireAt.AddDate(0, 0, days)
        }
    }
    
    return h.db.SetVIP(userID, expireAt)
}
```

### Telegram Stars 支付集成
```go
// internal/donation/telegram_stars.go
package donation

import (
    tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func (h *Handler) generateStarsInvoice(donation *Donation, tier *DonationTier) *tgbotapi.InvoiceConfig {
    // 创建发票
    invoice := tgbotapi.NewInvoice(
        donation.UserID,
        tier.Name,
        tier.Description,
        donation.ID, // payload
        h.bot.Token,  // provider_token (Stars使用空字符串)
        "XTR",        // currency (Stars)
        []tgbotapi.LabeledPrice{
            {
                Label:  tier.Name,
                Amount: tier.PriceStars, // 单位: Stars
            },
        },
    )
    
    // 发送发票
    msg, _ := h.bot.Send(invoice)
    
    return &invoice
}

func (h *Handler) verifyStarsPayment(paymentID string) bool {
    // Telegram会通过webhook通知支付成功
    // 这里检查数据库中的支付记录
    payment, err := h.db.GetPayment(paymentID)
    if err != nil {
        return false
    }
    
    return payment.Status == "successful"
}

// Webhook处理器 (接收Telegram支付通知)
func (h *Handler) HandlePaymentWebhook(c *gin.Context) {
    var update tgbotapi.Update
    if err := c.ShouldBindJSON(&update); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    // 处理successful_payment
    if update.Message != nil && update.Message.SuccessfulPayment != nil {
        payment := update.Message.SuccessfulPayment
        donationID := payment.InvoicePayload
        
        // 更新订单
        donation, _ := h.db.GetDonation(donationID)
        if donation != nil {
            now := time.Now()
            donation.Status = "completed"
            donation.PaymentID = payment.TelegramPaymentChargeID
            donation.CompletedAt = &now
            h.db.UpdateDonation(donation)
            
            // 激活VIP
            h.activateVIP(donation.UserID, donation.VIPDays)
            
            // 发送感谢消息
            h.sendThankYouMessage(donation)
        }
    }
    
    c.JSON(200, gin.H{"ok": true})
}
```

## 📊 数据库表设计

```sql
-- 打赏记录表
CREATE TABLE donations (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    username VARCHAR(100),
    tier_id VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_id VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    vip_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at DESC)
);

-- VIP状态表
CREATE TABLE vip_status (
    user_id BIGINT PRIMARY KEY,
    username VARCHAR(100),
    is_lifetime BOOLEAN DEFAULT FALSE,
    expire_at TIMESTAMP,
    total_donated DECIMAL(10, 2) DEFAULT 0,
    donation_count INT DEFAULT 0,
    activated_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 打赏统计表
CREATE TABLE donation_stats (
    date DATE PRIMARY KEY,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    total_count INT DEFAULT 0,
    vip_activated INT DEFAULT 0,
    top_tier_id VARCHAR(20),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 UI/UX 优化

1. **加载动画**: Skeleton screens
2. **支付反馈**: 实时状态更新
3. **成功动效**: Confetti 🎉
4. **VIP徽章**: 动态显示在群组中
5. **打赏排行榜**: 月度/年度榜单

## 🚀 部署流程

```bash
# 1. 前端构建
cd miniapp-frontend
npm install
npm run build

# 2. 部署到Telegram
# 上传dist到CDN或VPS
# 配置Bot Menu Button指向Mini App URL

# 3. 后端API
cd ../svs_bot
go build -o donation-api ./cmd/donation
./donation-api

# 4. Webhook配置
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://yourdomain.com/api/webhook/payment"
```

---

**设计完成**: 2025-11-09  
**支付方式**: Telegram Stars + 加密货币  
**前端框架**: React + TypeScript + TailwindCSS  
**后端API**: Go + Gin + Supabase  
**特色**: 赛博朋克UI + 流畅动画 + 完整VIP体系 🍄
