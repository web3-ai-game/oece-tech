import React, { useState } from 'react';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonText: string;
  gradient: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isYearly }) => {
  const displayPrice = isYearly ? (parseInt(plan.price) * 10).toString() : plan.price;
  const savings = isYearly ? Math.round(parseInt(plan.price) * 12 * 0.2) : 0;

  return (
    <div className={`relative group transition-all duration-300 ${
      plan.isPopular ? 'scale-105 z-10' : 'hover:scale-105'
    }`}>
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            最受欢迎
          </div>
        </div>
      )}
      
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border h-full transition-all duration-300 ${
        plan.isPopular 
          ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' 
          : 'border-gray-700 hover:border-gray-600'
      }`}>
        {/* Plan Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
          
          {/* Price Display */}
          <div className="mb-4">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-white">¥{displayPrice}</span>
              <span className="text-gray-400 ml-2">/{isYearly ? '年' : '月'}</span>
            </div>
            {isYearly && savings > 0 && (
              <div className="text-green-400 text-sm mt-2">
                节省 ¥{savings}/年
              </div>
            )}
          </div>
          
          {/* CTA Button */}
          <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            plan.isPopular
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}>
            {plan.buttonText}
          </button>
        </div>
        
        {/* Features List */}
        <ul className="space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 mr-3 ${
                feature.included 
                  ? 'bg-green-500/20' 
                  : 'bg-gray-600/20'
              }`}>
                {feature.included ? (
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${
                feature.included ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: '免费版',
      price: '0',
      period: '永久',
      description: '适合初学者入门学习',
      buttonText: '立即开始',
      gradient: 'from-gray-600 to-gray-700',
      features: [
        { text: '基础教程访问权限', included: true },
        { text: '社区讨论参与', included: true },
        { text: '基础代码练习', included: true },
        { text: '学习进度跟踪', included: true },
        { text: 'AI智能答疑', included: false },
        { text: '项目实战课程', included: false },
        { text: '专业技术支持', included: false },
        { text: '认证证书', included: false }
      ]
    },
    {
      id: 'pro',
      name: '专业版',
      price: '99',
      period: '月',
      description: '全面提升技术能力',
      buttonText: '选择专业版',
      gradient: 'from-purple-500 to-pink-500',
      isPopular: true,
      features: [
        { text: '所有教程无限制访问', included: true },
        { text: '高级社区功能', included: true },
        { text: '完整项目实战', included: true },
        { text: '个性化学习路径', included: true },
        { text: 'AI智能答疑', included: true },
        { text: '专业技术支持', included: true },
        { text: '课程认证证书', included: true },
        { text: '专属学习群组', included: true }
      ]
    },
    {
      id: 'team',
      name: '团队版',
      price: '299',
      period: '月',
      description: '适合团队协作学习',
      buttonText: '联系销售',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        { text: '专业版所有功能', included: true },
        { text: '团队学习管理', included: true },
        { text: '学习数据分析', included: true },
        { text: '定制化课程', included: true },
        { text: '专属客户经理', included: true },
        { text: '企业级技术支持', included: true },
        { text: '批量证书管理', included: true },
        { text: '私有化部署选项', included: true }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            选择适合的学习方案
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            无论您是编程新手还是资深开发者，我们都有适合的学习方案
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-900 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !isYearly
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              按月计费
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                isYearly
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              按年计费
              <span className="absolute -top-2 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isYearly={isYearly} />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">
            需要更多信息？
          </p>
          <button className="text-purple-400 hover:text-purple-300 font-medium">
            查看详细功能对比 →
          </button>
        </div>
      </div>
    </section>
  );
};
