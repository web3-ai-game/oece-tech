import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Shield,
  Infinity,
  TrendingUp,
} from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: '免费试用',
      nameEn: 'Free Trial',
      nameTh: 'ทดลองฟรี',
      nameMs: 'Percubaan Percuma',
      price: '¥0',
      priceEn: '$0',
      period: '/月',
      periodEn: '/month',
      description: '体验基础AI教学功能',
      descriptionEn: 'Experience basic AI teaching features',
      icon: Sparkles,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      buttonText: '立即开始 Start Free',
      buttonVariant: 'outline' as const,
      popular: false,
      features: [
        '每月 50 次 AI 对话',
        '基础教案生成（5个/月）',
        '测验生成（3个/月）',
        '社区支持',
        '基础模板库',
        '邮件支持（48小时响应）',
      ],
      featuresEn: [
        '50 AI conversations/month',
        'Basic lesson plans (5/month)',
        'Quiz generation (3/month)',
        'Community support',
        'Basic template library',
        'Email support (48h response)',
      ],
    },
    {
      name: 'Pro 专业版',
      nameEn: 'Pro Plan',
      nameTh: 'แผน Pro',
      nameMs: 'Pelan Pro',
      price: '¥199',
      priceEn: '$28',
      period: '/月',
      periodEn: '/month',
      yearlyPrice: '¥1,990',
      yearlyPriceEn: '$280',
      yearlyDiscount: '省 ¥398 (17% off)',
      yearlyDiscountEn: 'Save $56 (17% off)',
      description: '适合专业教师和培训师',
      descriptionEn: 'Perfect for professional teachers',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      buttonText: '订阅专业版 Subscribe Pro',
      buttonVariant: 'default' as const,
      popular: true,
      features: [
        '每月 1,000 次 AI 对话',
        '无限教案生成',
        '无限测验和评估生成',
        '教学视频制作（20个/月）',
        '教育素材库（无限访问）',
        '多语言内容翻译',
        '批量内容生成',
        'SEO优化工具',
        '优先邮件支持（12小时响应）',
        '数据导出功能',
        '去除水印',
      ],
      featuresEn: [
        '1,000 AI conversations/month',
        'Unlimited lesson plans',
        'Unlimited quiz generation',
        'Video creation (20/month)',
        'Educational materials (unlimited)',
        'Multi-language translation',
        'Bulk content generation',
        'SEO optimization tools',
        'Priority email support (12h)',
        'Data export',
        'Remove watermark',
      ],
    },
    {
      name: 'Pro+ 旗舰版',
      nameEn: 'Pro+ Plan',
      nameTh: 'แผน Pro+',
      nameMs: 'Pelan Pro+',
      price: '¥399',
      priceEn: '$56',
      period: '/月',
      periodEn: '/month',
      yearlyPrice: '¥3,990',
      yearlyPriceEn: '$560',
      yearlyDiscount: '省 ¥798 (17% off)',
      yearlyDiscountEn: 'Save $112 (17% off)',
      description: '适合教育机构和团队',
      descriptionEn: 'For institutions and teams',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      buttonText: '订阅旗舰版 Subscribe Pro+',
      buttonVariant: 'default' as const,
      popular: false,
      features: [
        '无限 AI 对话',
        '所有 Pro 功能',
        '无限教学视频制作',
        'API 访问权限',
        '自定义 AI 模型训练',
        '团队协作功能（最多10人）',
        '高级数据分析',
        '白标定制',
        '专属客户经理',
        '1对1培训支持',
        '电话/即时聊天支持',
        '99.9% SLA保障',
      ],
      featuresEn: [
        'Unlimited AI conversations',
        'All Pro features',
        'Unlimited video creation',
        'API access',
        'Custom AI model training',
        'Team collaboration (up to 10)',
        'Advanced analytics',
        'White-label customization',
        'Dedicated account manager',
        '1-on-1 training support',
        'Phone/live chat support',
        '99.9% SLA guarantee',
      ],
    },
  ];

  const faqs = [
    {
      q: '如何选择适合我的订阅计划？',
      qEn: 'How do I choose the right plan?',
      a: '如果您是个人教师，Pro专业版足够满足日常需求。如果您是培训机构或需要团队协作，推荐Pro+旗舰版。',
      aEn: 'If you\'re an individual teacher, Pro is sufficient. For institutions or teams, we recommend Pro+.',
    },
    {
      q: '可以随时取消订阅吗？',
      qEn: 'Can I cancel anytime?',
      a: '是的，您可以随时取消订阅。取消后将继续享受服务直到当前计费周期结束，不会产生额外费用。',
      aEn: 'Yes, you can cancel anytime. Service continues until the end of your billing period with no additional charges.',
    },
    {
      q: '年付和月付有什么区别？',
      qEn: 'What\'s the difference between yearly and monthly?',
      a: '年付可享受17%折扣，相当于免费使用2个月。而且年付用户优先获得新功能。',
      aEn: 'Yearly plans get 17% off (2 months free) and priority access to new features.',
    },
    {
      q: '支持哪些支付方式？',
      qEn: 'What payment methods are supported?',
      a: '我们支持支付宝、微信支付、信用卡（Visa/Mastercard）、PayPal等多种支付方式。',
      aEn: 'We support Alipay, WeChat Pay, Credit Cards (Visa/Mastercard), PayPal, and more.',
    },
    {
      q: '数据安全吗？',
      qEn: 'Is my data safe?',
      a: '绝对安全。我们采用企业级加密，遵守GDPR和数据保护法规，您的数据不会被用于训练AI模型。',
      aEn: 'Absolutely. We use enterprise-grade encryption, comply with GDPR, and never use your data to train AI models.',
    },
  ];

  const stats = [
    { label: '活跃用户', labelEn: 'Active Users', value: '10,000+', icon: TrendingUp },
    { label: '生成内容', labelEn: 'Content Generated', value: '500K+', icon: Infinity },
    { label: '客户满意度', labelEn: 'Satisfaction', value: '98%', icon: Shield },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-purple-50 to-background py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4" variant="secondary">
                <Sparkles className="mr-1 h-3 w-3" />
                订阅计划 Pricing Plans
              </Badge>
              
              <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">选择适合您的方案</span>
                <span className="mt-2 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Choose Your Plan
                </span>
              </h1>
              
              <p className="mb-3 text-lg text-muted-foreground">
                灵活的订阅方案，满足个人教师到教育机构的不同需求
              </p>
              <p className="mb-8 text-base text-muted-foreground/80 italic">
                Flexible plans for individual teachers and educational institutions
              </p>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                      <div className="text-xs text-muted-foreground/70">{stat.labelEn}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="container px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card
                    key={plan.name}
                    className={`relative overflow-hidden p-8 transition-all hover:shadow-2xl ${
                      plan.popular ? 'border-2 border-primary scale-105 shadow-xl' : ''
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute right-4 top-4 bg-gradient-to-r from-primary to-purple-600">
                        <Crown className="mr-1 h-3 w-3" />
                        最受欢迎 Popular
                      </Badge>
                    )}

                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${plan.bgColor}`}>
                      <Icon className={`h-6 w-6 ${plan.color}`} />
                    </div>

                    <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                    <p className="mb-1 text-sm text-muted-foreground">{plan.nameEn}</p>
                    <p className="mb-4 text-sm text-muted-foreground/70 italic">
                      {plan.nameTh} • {plan.nameMs}
                    </p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="ml-2 text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{plan.priceEn}{plan.periodEn}</p>
                      
                      {plan.yearlyPrice && (
                        <div className="mt-3 rounded-lg bg-green-50 p-3">
                          <p className="text-sm font-medium text-green-700">
                            年付 {plan.yearlyPrice} / {plan.yearlyPriceEn}
                          </p>
                          <p className="text-xs text-green-600">{plan.yearlyDiscount}</p>
                        </div>
                      )}
                    </div>

                    <p className="mb-6 text-muted-foreground">{plan.description}</p>
                    <p className="mb-6 text-sm text-muted-foreground/80 italic">{plan.descriptionEn}</p>

                    <Button 
                      asChild 
                      variant={plan.buttonVariant}
                      size="lg"
                      className={`mb-6 w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-purple-600 hover:opacity-90' : ''}`}
                    >
                      <Link href="/auth/register">
                        {plan.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold">包含功能：</p>
                      {plan.features.map((feature, index) => (
                        <div key={feature} className="flex items-start">
                          <Check className="mr-2 h-5 w-5 flex-shrink-0 text-primary" />
                          <div>
                            <p className="text-sm">{feature}</p>
                            <p className="text-xs text-muted-foreground/70 italic">
                              {plan.featuresEn[index]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Enterprise CTA */}
            <Card className="mt-12 bg-gradient-to-r from-primary/5 to-purple-50 p-8 text-center">
              <h3 className="mb-2 text-2xl font-bold">教育机构定制方案</h3>
              <p className="mb-1 text-lg text-muted-foreground">Enterprise Custom Solution</p>
              <p className="mb-6 text-muted-foreground/80 italic">
                โซลูชั่นสำหรับองค์กร • Penyelesaian Perusahaan
              </p>
              <p className="mb-6 text-muted-foreground">
                需要为您的学校或培训机构定制方案？联系我们获取专属报价和服务。
              </p>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  联系销售 Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/50 py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="mb-2 text-3xl font-bold">常见问题</h2>
                <p className="text-lg text-muted-foreground">Frequently Asked Questions</p>
                <p className="text-sm text-muted-foreground/70 italic">
                  คำถามที่พบบ่อย • Soalan Lazim
                </p>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="mb-2 text-lg font-semibold">{faq.q}</h3>
                    <p className="mb-3 text-sm text-muted-foreground italic">{faq.qEn}</p>
                    <p className="text-muted-foreground">{faq.a}</p>
                    <p className="mt-2 text-sm text-muted-foreground/80 italic">{faq.aEn}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-primary to-purple-600 py-16 text-primary-foreground">
          <div className="container px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">准备开始了吗？</h2>
            <p className="mb-8 text-lg opacity-90">
              立即订阅，开启AI赋能的教育之旅 • Ready to Start Your AI-Powered Education Journey?
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">
                  免费试用 Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/tools">查看所有工具 View All Tools</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
