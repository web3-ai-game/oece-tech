import React, { useState } from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  details: string[];
}

interface FeatureCardProps {
  feature: Feature;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, isHovered, onHover }) => {
  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 ${
        isHovered ? 'scale-105 z-10' : 'scale-100'
      }`}
      onMouseEnter={() => onHover(feature.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 h-full transition-all duration-300 ${
        isHovered ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' : 'hover:border-gray-600'
      }`}>
        {/* 图标区域 */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${feature.gradient} transition-all duration-300 ${
          isHovered ? 'scale-110 shadow-lg' : ''
        }`}>
          <div className="text-white">
            {feature.icon}
          </div>
        </div>
        
        {/* 标题和描述 */}
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          {feature.description}
        </p>
        
        {/* 特性列表 - 悬停时显示 */}
        <div className={`transition-all duration-300 ${
          isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
        } overflow-hidden`}>
          <ul className="space-y-2">
            {feature.details.map((detail, index) => (
              <li key={index} className="flex items-center text-sm text-gray-300">
                <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {detail}
              </li>
            ))}
          </ul>
        </div>
        
        {/* 查看更多按钮 */}
        <div className={`mt-6 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button className="text-purple-400 hover:text-purple-300 font-medium text-sm flex items-center group/btn">
            了解更多
            <svg className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const FeaturesShowcase: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features: Feature[] = [
    {
      id: 'interactive',
      title: '互动式学习',
      description: '通过实时代码编辑器、在线测试和即时反馈，让学习更加生动有趣',
      gradient: 'from-blue-500 to-cyan-500',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      details: [
        '在线代码编辑器',
        '实时预览效果',
        '智能代码补全',
        '错误检测提示'
      ]
    },
    {
      id: 'ai-powered',
      title: 'AI智能辅导',
      description: '基于人工智能的个性化学习路径推荐和智能答疑系统',
      gradient: 'from-purple-500 to-pink-500',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      details: [
        '个性化学习计划',
        'AI智能问答',
        '学习进度分析',
        '知识点推荐'
      ]
    },
    {
      id: 'community',
      title: '活跃社区',
      description: '与全球开发者交流学习经验，参与开源项目，建立职业网络',
      gradient: 'from-green-500 to-teal-500',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      details: [
        '技术讨论区',
        '项目协作',
        '职业指导',
        '行业资讯分享'
      ]
    },
    {
      id: 'practical',
      title: '实战项目',
      description: '通过真实的企业级项目案例，掌握实际工作中的技术应用',
      gradient: 'from-orange-500 to-red-500',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      details: [
        '企业级项目案例',
        '完整开发流程',
        '部署上线指导',
        '性能优化技巧'
      ]
    },
    {
      id: 'certification',
      title: '专业认证',
      description: '完成课程后获得行业认可的技能证书，提升职场竞争力',
      gradient: 'from-yellow-500 to-orange-500',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      details: [
        '官方技能认证',
        '数字化证书',
        '简历认证标识',
        '职业背书'
      ]
    },
    {
      id: 'support',
      title: '24/7支持',
      description: '专业导师团队全天候在线答疑，确保学习过程无障碍',
      gradient: 'from-indigo-500 to-purple-500',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      details: [
        '全天候在线客服',
        '专业导师答疑',
        '学习进度跟踪',
        '个性化指导'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            平台核心特色
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            融合最新教育技术与实战经验，为每位学习者提供卓越的学习体验
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard 
              key={feature.id}
              feature={feature}
              isHovered={hoveredFeature === feature.id}
              onHover={setHoveredFeature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
