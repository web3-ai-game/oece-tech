'use client'

import { useState } from 'react'
import { Check, Zap, Crown, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'ad-points'>('plans')
  
  const plans = [
    {
      name: '免費版',
      price: 0,
      period: '永久免費',
      icon: Zap,
      color: 'text-pixel-accent',
      features: [
        '訣竅基礎教程',
        '社區論壇訪問',
        '基礎工具使用',
        '每月 10 次 API 調用',
      ],
      limitations: [
        '廣告顯示',
        '標準速度',
      ],
      cta: '開始使用',
      highlighted: false,
    },
    {
      name: '專業版',
      price: 9.99,
      period: '每月',
      icon: Crown,
      color: 'text-pixel-primary',
      features: [
        '所有免費版功能',
        '解鎖全部教程',
        '無廣告體驗',
        '優先技術支持',
        '每月 1000 次 API 調用',
        '下載離線教程',
        '專屬會員徽章',
      ],
      limitations: [],
      cta: '立即訂閱',
      highlighted: true,
      discount: '首月 5 折',
    },
    {
      name: '企業版',
      price: 29.99,
      period: '每月',
      icon: Rocket,
      color: 'text-pixel-secondary',
      features: [
        '所有專業版功能',
        '團隊協作功能',
        '無限 API 調用',
        '私有部署支持',
        '定制教程內容',
        '1對1 技術指導',
        '企業專屬論壇',
        'SLA 保障',
      ],
      limitations: [],
      cta: '聯繫我們',
      highlighted: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <section className="text-center mb-16">
        {/* 标签切换 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={activeTab === 'plans' ? 'btn-pixel' : 'btn-pixel-outline'
          >
            訂閱方案
          </button>
          <button
            onClick={() => setActiveTab('ad-points')}
            className={activeTab === 'ad-points' ? 'btn-pixel' : 'btn-pixel-outline'
          >
            廣告積分系統
          </button>
        </div>
        <div className="inline-block font-mono text-xs text-pixel-primary border border-pixel-primary px-3 py-1 mb-4 animate-pulse">
          [PRICING_SYSTEM]
        </div>
        <h1 className="text-pixel-2xl mb-6 text-neon">
          選擇你的方案
        </h1>
        <p className="text-lg text-pixel-light/80 font-mono max-w-2xl mx-auto mb-8">
          靈活的定價方案，滿足不同需求
        </p>
        
        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-pixel-light/70 font-mono">
          <div className="flex items-center gap-2">
            <span>💳</span>
            <span>信用卡</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span>支付寶</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💚</span>
            <span>微信支付</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🪙</span>
            <span>USDT</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏦</span>
            <span>GrabPay</span>
          </div>
        </div>
      </section>

      {activeTab === 'plans' ? (
        <>
      {/* Pricing Cards */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`card-pixel-glow relative ${
                  plan.highlighted ? 'border-pixel-primary scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Discount Badge */}
                {plan.discount && (
                  <div className="absolute -top-3 -right-3 bg-pixel-danger text-pixel-darker px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    {plan.discount}
                  </div>
                )}

                {/* Icon */}
                <div className="text-center mb-6">
                  <Icon className={`inline ${plan.color}`} size={48} />
                </div>

                {/* Plan Name */}
                <h3 className="text-pixel-lg text-center mb-2 font-mono">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-pixel-primary font-mono">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-pixel-light/50 font-mono">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="text-pixel-primary flex-shrink-0 mt-1" size={16} />
                      <span className="text-sm text-pixel-light/90 font-sans">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-3">
                      <span className="text-pixel-danger flex-shrink-0 mt-1">×</span>
                      <span className="text-sm text-pixel-light/50 font-sans line-through">
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full ${
                    plan.highlighted ? 'btn-pixel' : 'btn-pixel-outline'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Payment Info */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-pixel-lg text-center mb-8 text-neon-cyan font-mono">
            支付方式說明
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* International */}
            <div className="card-pixel-glow">
              <h3 className="text-pixel-base mb-4 font-mono text-pixel-accent">
                🌍 國際支付
              </h3>
              <ul className="space-y-2 text-sm text-pixel-light/80 font-sans">
                <li>• Stripe 安全支付</li>
                <li>• 支持 Visa、Mastercard</li>
                <li>• 支持 Alipay 國際版</li>
                <li>• 支持 GrabPay、PayNow</li>
                <li>• USDT (TRC20/ERC20)</li>
              </ul>
            </div>

            {/* China */}
            <div className="card-pixel-glow">
              <h3 className="text-pixel-base mb-4 font-mono text-pixel-secondary">
                🇨🇳 大陸支付
              </h3>
              <ul className="space-y-2 text-sm text-pixel-light/80 font-sans">
                <li>• 支付寶直連</li>
                <li>• 微信支付</li>
                <li>• 銀聯在線支付</li>
                <li>• 數字人民幣（即將支持）</li>
                <li>• 發票開具服務</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-pixel-lg text-center mb-8 text-neon-pink font-mono">
            常見問題
          </h2>

          <div className="space-y-4">
            <div className="card-pixel">
              <h3 className="text-pixel-base mb-2 font-mono">可以隨時取消嗎？</h3>
              <p className="text-sm text-pixel-light/70 font-sans">
                是的，你可以隨時在帳戶設置中取消訂閱。取消後，你仍可使用到當前計費週期結束。
              </p>
            </div>

            <div className="card-pixel">
              <h3 className="text-pixel-base mb-2 font-mono">支持退款嗎？</h3>
              <p className="text-sm text-pixel-light/70 font-sans">
                如果你在購買後 7 天內不滿意，我們提供全額退款保證。
              </p>
            </div>

            <div className="card-pixel">
              <h3 className="text-pixel-base mb-2 font-mono">企業版有什麼優勢？</h3>
              <p className="text-sm text-pixel-light/70 font-sans">
                企業版提供團隊協作、私有部署、定制內容和專屬技術支持，適合 5 人以上團隊。
              </p>
            </div>

            <div className="card-pixel">
              <h3 className="text-pixel-base mb-2 font-mono">加密貨幣支付安全嗎？</h3>
              <p className="text-sm text-pixel-light/70 font-sans">
                我們使用去中心化錢包接收 USDT，交易完全透明可查，無需擔心安全問題。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="card-pixel-glow text-center p-12 max-w-3xl mx-auto">
          <h3 className="text-pixel-xl mb-4 text-neon font-mono">
            還有疑問？
          </h3>
          <p className="text-lg text-pixel-light/80 mb-8 font-mono">
            聯繫我們的支持團隊，我們隨時為你解答
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/forum" className="btn-pixel">
              訪問論壇
            </Link>
            <a 
              href="mailto:support@geeksea.com" 
              className="btn-pixel-outline"
            >
              郵件聯繫
            </a>
          </div>
        </div>
      </section>
      </>
      ) : (
        <AdPointsSystem />
      )}
    </div>
  )
}

// 广告积分系统详细介绍
function AdPointsSystem() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 介绍 */}
      <div className="card-pixel-glow p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-pixel-warning/20 flex items-center justify-center">
          <span className="text-4xl">💰</span>
        </div>
        <h2 className="text-pixel-xl mb-4 text-neon-cyan">廣告積分系統</h2>
        <p className="text-lg text-pixel-light/80 font-mono mb-4">
          GeekSEA 的核心收入來源
        </p>
        <p className="text-pixel-light/70">
          通過觀看廣告賺取積分，用積分解鎖付費內容。這是平台可持續運營的關鍵！
        </p>
      </div>

      {/* 如何运作 */}
      <div className="card-pixel-glow p-6">
        <h3 className="text-pixel-lg mb-6 text-pixel-primary">
          📊 運作機制
        </h3>
        
        <div className="space-y-4">
          <div className="card-pixel p-4">
            <h4 className="text-pixel-base mb-2 text-pixel-accent">1. 用戶觀看廣告</h4>
            <p className="text-sm text-pixel-light/70 mb-2">
              用戶觀看 30 秒視頻廣告，完整觀看後獲得 10 積分
            </p>
            <div className="text-xs text-pixel-warning">
              → 平台從廣告商獲得收入: $0.02-0.05
            </div>
          </div>

          <div className="card-pixel p-4">
            <h4 className="text-pixel-base mb-2 text-pixel-accent">2. 用戶使用積分</h4>
            <p className="text-sm text-pixel-light/70 mb-2">
              用戶用 50 積分解鎖一篇教程（價值 $0.50）
            </p>
            <div className="text-xs text-pixel-primary">
              → 平台成本: 10 積分的廣告收入約 $0.02-0.05
            </div>
          </div>

          <div className="card-pixel p-4 border-pixel-primary">
            <h4 className="text-pixel-base mb-2 text-pixel-primary">3. 平台利潤</h4>
            <p className="text-sm text-pixel-light/70 mb-2">
              收入 $0.02-0.05 × 5次觀看 = $0.10-0.25
            </p>
            <p className="text-sm text-pixel-light/70 mb-2">
              用戶解鎖價值: $0.50 等值內容
            </p>
            <div className="text-xs text-pixel-primary font-bold">
              → 平台毛利潤: 40-80%
            </div>
          </div>
        </div>
      </div>

      {/* 收入预估 */}
      <div className="card-pixel-glow p-6">
        <h3 className="text-pixel-lg mb-6 text-pixel-secondary">
          💸 收入預估
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card-pixel p-4 text-center bg-pixel-darker/50">
            <div className="text-3xl font-bold text-pixel-primary font-mono mb-2">
              $60-150
            </div>
            <div className="text-xs text-pixel-light/50">月廣告收入（1000用戶）</div>
          </div>
          
          <div className="card-pixel p-4 text-center bg-pixel-darker/50">
            <div className="text-3xl font-bold text-pixel-accent font-mono mb-2">
              $300-500
            </div>
            <div className="text-xs text-pixel-light/50">月訂閱收入（5%轉化率）</div>
          </div>
          
          <div className="card-pixel p-4 text-center bg-pixel-darker/50">
            <div className="text-3xl font-bold text-pixel-secondary font-mono mb-2">
              $360-650
            </div>
            <div className="text-xs text-pixel-light/50">月總收入</div>
          </div>
        </div>

        <div className="text-sm text-pixel-light/70 text-center">
          * 基於 1000 活躍用戶，每用戶每月觀看 20 個廣告的保守估算
        </div>
      </div>

      {/* 优势 */}
      <div className="card-pixel-glow p-6">
        <h3 className="text-pixel-lg mb-6 text-pixel-warning">
          ⭐ 商業優勢
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-pixel p-4">
            <h4 className="text-sm font-bold mb-2 text-pixel-primary">對用戶</h4>
            <ul className="text-sm text-pixel-light/70 space-y-1">
              <li>✓ 不花錢也能學習</li>
              <li>✓ 靈活選擇付費方式</li>
              <li>✓ 積分可抵扣訂閱</li>
              <li>✓ 公平的價值交換</li>
            </ul>
          </div>

          <div className="card-pixel p-4">
            <h4 className="text-sm font-bold mb-2 text-pixel-accent">對平台</h4>
            <ul className="text-sm text-pixel-light/70 space-y-1">
              <li>✓ 雙重收入來源</li>
              <li>✓ 用戶粘性增加</li>
              <li>✓ 付費轉化率提升</li>
              <li>✓ 可持續商業模式</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 广告商合作 */}
      <div className="card-pixel-glow p-6">
        <h3 className="text-pixel-lg mb-6 text-pixel-primary">
          🤝 廣告商合作
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 card-pixel">
            <div className="flex items-center gap-3">
              <img src="https://www.google.com/adsense/static/en_US/logo.png" alt="Google AdSense" className="h-6" />
              <span className="text-sm font-mono">Google AdSense</span>
            </div>
            <span className="text-xs text-pixel-primary">CPM: $2-5</span>
          </div>

          <div className="flex items-center justify-between p-3 card-pixel">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-mono">Carbon Ads</span>
            </div>
            <span className="text-xs text-pixel-accent">技術友好</span>
          </div>

          <div className="flex items-center justify-between p-3 card-pixel">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <span className="text-sm font-mono">直接廣告商</span>
            </div>
            <span className="text-xs text-pixel-secondary">高利潤</span>
          </div>
        </div>
      </div>

      {/* 用户反馈 */}
      <div className="card-pixel-glow p-6">
        <h3 className="text-pixel-lg mb-6 text-pixel-secondary">
          💬 用戶反饋
        </h3>
        
        <div className="space-y-4">
          <div className="card-pixel p-4 bg-pixel-darker/50">
            <p className="text-sm text-pixel-light/80 mb-2">
              "看幾個廣告就能學習，比直接付費更靈活！"
            </p>
            <span className="text-xs text-pixel-light/50">- 免費用戶</span>
          </div>

          <div className="card-pixel p-4 bg-pixel-darker/50">
            <p className="text-sm text-pixel-light/80 mb-2">
              "用積分抵扣了一半訂閱費，超值！"
            </p>
            <span className="text-xs text-pixel-light/50">- 專業版用戶</span>
          </div>

          <div className="card-pixel p-4 bg-pixel-darker/50">
            <p className="text-sm text-pixel-light/80 mb-2">
              "不想看廣告就直接訂閱，選擇很人性化。"
            </p>
            <span className="text-xs text-pixel-light/50">- 企業版用戶</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/auth/register" className="btn-pixel">
          立即註冊，開始賺取積分 →
        </Link>
      </div>
    </div>
  )
}
