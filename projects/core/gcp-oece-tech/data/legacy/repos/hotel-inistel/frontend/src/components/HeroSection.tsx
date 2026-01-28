import React from 'react';
import AnimatedVisual from './AnimatedVisual';

/**
 * Hero Section Component
 * 主页首屏区域，包含标题、介绍文字、CTA按钮和动态视觉元素
 */
const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* 背景渐变效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />
      
      {/* 网格背景装饰 */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
      }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* 左侧内容区域 */}
          <div className="text-left space-y-8 z-10">
            {/* 标签 */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <span className="text-purple-400 text-sm font-medium">🚀 全新在线学习平台</span>
            </div>
            
            {/* 主标题 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              掌握前沿技术
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-2">
                开启编程之旅
              </span>
            </h1>
            
            {/* 副标题 */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
              通过互动式教程、实战项目和专业指导，快速提升你的编程技能。
              加入数万名开发者，一起探索技术的无限可能。
            </p>
            
            {/* CTA按钮区域 */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 主要CTA按钮 - 带微动画效果 */}
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900">
                <span className="relative z-10 flex items-center">
                  开始学习
                  <svg 
                    className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                
                {/* 按钮光晕效果 */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              </button>
              
              {/* 次要按钮 */}
              <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-300 transition-all duration-200 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900">
                浏览课程
              </button>
            </div>
            
            {/* 统计数据 */}
            <div className="flex gap-8 pt-8 border-t border-gray-800">
              <div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">活跃学员</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">精品课程</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-gray-400">满意度</div>
              </div>
            </div>
          </div>
          
          {/* 右侧动态视觉元素 */}
          <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
            <AnimatedVisual />
          </div>
        </div>
      </div>
      
      {/* 底部装饰性元素 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </section>
  );
};

export { HeroSection };
export default HeroSection;
