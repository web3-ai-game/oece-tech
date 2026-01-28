'use client'

import Link from 'next/link'
import { Check, Zap, Crown, Infinity } from 'lucide-react'
import {
  CRTScanlines,
  DOSWindow,
  RetroButton,
  RetroTag,
  LEDNumber,
  PixelDivider,
  PixelIcon
} from '@/components/retro/RetroEffects'

export default function PricingPage() {
  const plans = [
    {
      id: 'free',
      name: '免費版',
      icon: '⚡',
      price: 0,
      period: '永久免費',
      color: 'accent',
      features: [
        '基礎教程訪問',
        '社區論壇發帖',
        '基礎工具使用',
        '每日10次API調用',
        '標準技術支持'
      ],
      limitations: [
        '顯示廣告',
        '標準速度',
        '部分教程鎖定'
      ]
    },
    {
      id: 'monthly',
      name: '月度會員',
      icon: '👑',
      price: 9.99,
      period: '每月',
      color: 'primary',
      popular: true,
      features: [
        '✓ 所有免費版功能',
        '✓ 解鎖全部教程',
        '✓ 無廣告體驗',
        '✓ 優先技術支持',
        '✓ 每月1000次API',
        '✓ 下載離線教程',
        '✓ 專屬會員徽章',
        '✓ 提前訪問新功能'
      ],
      limitations: []
    },
    {
      id: 'yearly',
      name: '年度會員',
      icon: '🚀',
      price: 79.99,
      originalPrice: 119.88,
      period: '每年',
      color: 'warning',
      discount: '節省 33%',
      features: [
        '✓ 所有月度會員功能',
        '✓ 年度折扣優惠',
        '✓ 無限API調用',
        '✓ VIP技術支持',
        '✓ 獨家資源下載',
        '✓ 優先活動參與',
        '✓ 專屬VIP徽章',
        '✓ 贈送500積分'
      ],
      limitations: []
    },
    {
      id: 'lifetime',
      name: '終身會員',
      icon: '♾️',
      price: 299,
      period: '一次付款',
      color: 'danger',
      ultimate: true,
      features: [
        '✓ 所有年度會員功能',
        '✓ 終身無限訪問',
        '✓ 永久免費更新',
        '✓ 終身VIP支持',
        '✓ 無限API調用',
        '✓ 所有未來功能',
        '✓ 創始會員徽章',
        '✓ 贈送2000積分',
        '✓ 專屬社區訪問',
        '✓ 終身價格鎖定'
      ],
      limitations: [],
      badge: '🔥 最超值'
    }
  ]

  return (
    <div className="min-h-screen bg-pixel-darker p-4 relative">
      <CRTScanlines />
      
      <div className="max-w-7xl mx-auto py-8 relative z-10">
        
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pixel-primary/10 border-2 border-pixel-primary mb-4">
            <PixelIcon type="coin" />
            <span className="text-sm font-mono text-pixel-primary">PRICING PLANS</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-pixel-primary mb-4">
            選擇你的方案
          </h1>
          <p className="text-lg text-pixel-light/70 font-mono">
            從免費開始，隨時升級到終身會員
          </p>
        </div>

        {/* 价格卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative ${plan.popular || plan.ultimate ? 'lg:scale-105' : ''}`}
            >
              {/* 热门标签 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <RetroTag color="primary">🔥 最受歡迎</RetroTag>
                </div>
              )}
              
              {/* 终身标签 */}
              {plan.ultimate && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <RetroTag color="danger">{plan.badge}</RetroTag>
                </div>
              )}

              <DOSWindow 
                title={`[ ${plan.name.toUpperCase()} ]`}
                className={plan.popular || plan.ultimate ? 'border-4' : ''}
              >
                {/* 图标 */}
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{plan.icon}</div>
                  <h3 className="text-xl font-bold font-mono text-pixel-light mb-2">
                    {plan.name}
                  </h3>
                </div>

                {/* 价格 */}
                <div className="text-center mb-6">
                  {plan.originalPrice && (
                    <div className="mb-2">
                      <span className="text-sm text-pixel-light/50 line-through font-mono">
                        ${plan.originalPrice}
                      </span>
                      <RetroTag color="danger" className="ml-2">
                        {plan.discount}
                      </RetroTag>
                    </div>
                  )}
                  
                  {plan.price === 0 ? (
                    <div className="mb-2">
                      <span className="text-3xl font-bold font-mono text-pixel-accent">
                        免費
                      </span>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <span className="text-sm text-pixel-light/60 font-mono">$</span>
                      <span className="text-4xl font-bold font-mono text-pixel-primary">
                        {plan.price}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm text-pixel-light/60 font-mono">
                    {plan.period}
                  </p>
                </div>

                <PixelDivider />

                {/* 功能列表 */}
                <div className="space-y-2 mb-6 min-h-[300px]">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-pixel-primary flex-shrink-0 mt-0.5" />
                      <span className="text-pixel-light">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* 限制 */}
                {plan.limitations.length > 0 && (
                  <>
                    <PixelDivider />
                    <div className="space-y-2 mb-6">
                      <p className="text-xs text-pixel-light/50 font-mono mb-2">限制:</p>
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-pixel-danger">×</span>
                          <span className="text-pixel-light/60">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* CTA按钮 */}
                <Link href={plan.id === 'free' ? '/auth/register' : `/checkout/${plan.id}`}>
                  <RetroButton 
                    variant={plan.popular || plan.ultimate ? 'primary' : 'outline'}
                    className="w-full justify-center"
                  >
                    {plan.id === 'free' ? '開始使用' : }
                     plan.id === 'lifetime' ? '立即購買 (終身)' : '立即訂閱'}
                  </RetroButton>
                </Link>
              </DOSWindow>
            </div>
          ))}
        </div>

        {/* 对比表格 */}
        <DOSWindow title="[ FEATURE COMPARISON ]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b-4 border-pixel-grid">
                  <th className="text-left p-3 text-pixel-light">功能</th>
                  <th className="text-center p-3 text-pixel-accent">免費版</th>
                  <th className="text-center p-3 text-pixel-primary">月度</th>
                  <th className="text-center p-3 text-pixel-warning">年度</th>
                  <th className="text-center p-3 text-pixel-danger">終身</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: '基礎教程', free: true, monthly: true, yearly: true, lifetime: true },
                  { feature: '高級教程', free: false, monthly: true, yearly: true, lifetime: true },
                  { feature: '無廣告', free: false, monthly: true, yearly: true, lifetime: true },
                  { feature: 'API調用', free: '10/天', monthly: '1000/月', yearly: '無限', lifetime: '無限' },
                  { feature: '離線下載', free: false, monthly: true, yearly: true, lifetime: true },
                  { feature: '技術支持', free: '標準', monthly: '優先', yearly: 'VIP', lifetime: '終身VIP' },
                  { feature: '專屬徽章', free: false, monthly: true, yearly: true, lifetime: true },
                  { feature: '贈送積分', free: '100', monthly: '0', yearly: '500', lifetime: '2000' },
                  { feature: '未來功能', free: '部分', monthly: '全部', yearly: '全部', lifetime: '終身全部' },
                  { feature: '社區訪問', free: '公開', monthly: '公開', yearly: '公開+VIP', lifetime: '全部+專屬' }
                ].map((row, i) => (
                  <tr key={i} className="border-b-2 border-pixel-grid">
                    <td className="p-3 text-pixel-light">{row.feature}</td>
                    <td className="text-center p-3">
                      {typeof row.free === 'boolean' 
                        ? row.free ? <Check size={18} className="inline text-pixel-accent" /> : '×'
                        : <span className="text-pixel-accent">{row.free}</span>
                      }
                    </td>
                    <td className="text-center p-3">
                      {typeof row.monthly === 'boolean'
                        ? row.monthly ? <Check size={18} className="inline text-pixel-primary" /> : '×'
                        : <span className="text-pixel-primary">{row.monthly}</span>
                      }
                    </td>
                    <td className="text-center p-3">
                      {typeof row.yearly === 'boolean'
                        ? row.yearly ? <Check size={18} className="inline text-pixel-warning" /> : '×'
                        : <span className="text-pixel-warning">{row.yearly}</span>
                      }
                    </td>
                    <td className="text-center p-3">
                      {typeof row.lifetime === 'boolean'
                        ? row.lifetime ? <Check size={18} className="inline text-pixel-danger" /> : '×'
                        : <span className="text-pixel-danger">{row.lifetime}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DOSWindow>

        {/* FAQ */}
        <div className="mt-12">
          <DOSWindow title="[ FREQUENTLY ASKED QUESTIONS ]">
            <div className="space-y-4">
              {[
                {
                  q: '終身會員真的是終身嗎？',
                  a: '是的！一次性支付$299，終身享受所有功能和未來更新，無需再付費。'
                },
                {
                  q: '可以隨時取消訂閱嗎？',
                  a: '月度和年度會員可以隨時取消，取消後會員將在當前計費週期結束後失效。'
                },
                {
                  q: '終身會員有什麼特殊待遇？',
                  a: '終身會員享有創始會員徽章、專屬社區訪問、2000積分贈送，以及所有未來新功能的永久訪問權。'
                },
                {
                  q: '支持哪些支付方式？',
                  a: '我們支持信用卡、PayPal、加密貨幣等多種支付方式。'
                }
              ].map((faq, i) => (
                <div key={i} className="border-2 border-pixel-grid p-4">
                  <h4 className="text-base font-bold text-pixel-primary mb-2 font-mono">
                    &gt; {faq.q}
                  </h4>
                  <p className="text-sm text-pixel-light/80">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </DOSWindow>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="border-4 border-pixel-primary bg-pixel-primary/10 p-8 inline-block">
            <h3 className="text-2xl font-bold font-mono text-pixel-primary mb-4">
              💎 終身會員限時優惠
            </h3>
            <p className="text-pixel-light mb-6 font-mono">
              一次性支付 $299，享受終身無限訪問
            </p>
            <Link href="/checkout/lifetime">
              <RetroButton className="px-12">
                <Infinity size={20} className="mr-2" />
                立即購買終身會員
              </RetroButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
