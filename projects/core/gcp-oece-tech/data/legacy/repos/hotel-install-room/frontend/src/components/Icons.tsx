import React from 'react';

/**
 * SVG图标集合
 * 统一的现代、简洁风格图标
 */

// 1. 网站Logo - 字母'T'与代码符号'<>'的结合
export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 背景圆 */}
    <circle cx="32" cy="32" r="30" stroke="url(#logo-gradient)" strokeWidth="2" opacity="0.2"/>
    
    {/* 左侧 < 符号 */}
    <path 
      d="M20 24L12 32L20 40" 
      stroke="url(#logo-gradient)" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 中间 T 字母 */}
    <path 
      d="M32 18V46M24 18H40" 
      stroke="url(#logo-gradient)" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 右侧 > 符号 */}
    <path 
      d="M44 24L52 32L44 40" 
      stroke="url(#logo-gradient)" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7"/>
        <stop offset="100%" stopColor="#ec4899"/>
      </linearGradient>
    </defs>
  </svg>
);

// 2. Web开发 - 显示器图标
export const WebDevIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 显示器外框 */}
    <rect 
      x="8" 
      y="12" 
      width="48" 
      height="32" 
      rx="4" 
      stroke="currentColor" 
      strokeWidth="2"
    />
    
    {/* 屏幕内容 - 代码行 */}
    <path 
      d="M14 20H26M30 20H38M14 26H22M26 26H34M38 26H42M14 32H28M32 32H40M44 32H50" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      opacity="0.6"
    />
    
    {/* 底座 */}
    <path 
      d="M24 44V50M40 44V50M20 50H44" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 装饰性元素 - 窗口控制按钮 */}
    <circle cx="14" cy="18" r="1" fill="currentColor" opacity="0.6"/>
    <circle cx="18" cy="18" r="1" fill="currentColor" opacity="0.6"/>
    <circle cx="22" cy="18" r="1" fill="currentColor" opacity="0.6"/>
  </svg>
);

// 3. AI与机器学习 - 大脑与电路结合
export const AIMLIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 大脑轮廓 */}
    <path 
      d="M32 52C32 52 48 48 48 32C48 24 44 20 40 20C38 16 34 14 30 14C26 14 22 16 20 20C16 20 12 24 12 32C12 48 28 52 32 52Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 大脑纹理 */}
    <path 
      d="M20 28C20 28 24 26 28 28C32 30 36 28 36 28M24 34C24 34 28 32 32 34C36 36 40 34 40 34" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      opacity="0.6"
    />
    
    {/* 电路节点 */}
    <circle cx="20" cy="24" r="2" fill="currentColor"/>
    <circle cx="44" cy="24" r="2" fill="currentColor"/>
    <circle cx="32" cy="20" r="2" fill="currentColor"/>
    <circle cx="26" cy="40" r="2" fill="currentColor"/>
    <circle cx="38" cy="40" r="2" fill="currentColor"/>
    
    {/* 连接线 */}
    <path 
      d="M22 24H28M36 24H42M32 22V28M26 38V34M38 38V34" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// 4. 完成课程徽章
export const BadgeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 徽章主体 - 星形 */}
    <path 
      d="M32 8L38.5 21L52 23L42 33L44.5 46L32 39L19.5 46L22 33L12 23L25.5 21L32 8Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinejoin="round"
    />
    
    {/* 中心圆 */}
    <circle 
      cx="32" 
      cy="28" 
      r="8" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    
    {/* 勾选标记 */}
    <path 
      d="M28 28L30.5 30.5L36 25" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 装饰性光芒 */}
    <path 
      d="M32 4V8M32 46V50M50 28H54M10 28H14M46 14L43 17M21 17L18 14M46 42L43 39M21 39L18 42" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// 5. 付费服务 - 盾牌与美元符号
export const PremiumIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 盾牌轮廓 */}
    <path 
      d="M32 8C32 8 48 12 48 12V28C48 40 40 52 32 56C24 52 16 40 16 28V12C16 12 32 8 32 8Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinejoin="round"
    />
    
    {/* 美元符号 */}
    <path 
      d="M32 20V44M28 24C28 24 28 20 32 20C36 20 36 24 36 24C36 26 34 28 32 28C30 28 28 30 28 32C28 32 28 36 32 36C36 36 36 32 36 32" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* 装饰性元素 - 顶部皇冠 */}
    <path 
      d="M26 12L32 8L38 12" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      opacity="0.6"
    />
    
    {/* 侧边装饰线 */}
    <path 
      d="M22 18V24M42 18V24" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// 图标展示组件
export const IconShowcase: React.FC = () => {
  return (
    <div className="p-8 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">图标集合</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-4 bg-gray-800 rounded-lg">
            <LogoIcon className="w-12 h-12 text-purple-400" />
          </div>
          <span className="text-sm text-gray-400">Logo</span>
        </div>
        
        {/* Web开发 */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-4 bg-gray-800 rounded-lg">
            <WebDevIcon className="w-12 h-12 text-blue-400" />
          </div>
          <span className="text-sm text-gray-400">Web开发</span>
        </div>
        
        {/* AI与机器学习 */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-4 bg-gray-800 rounded-lg">
            <AIMLIcon className="w-12 h-12 text-green-400" />
          </div>
          <span className="text-sm text-gray-400">AI/ML</span>
        </div>
        
        {/* 徽章 */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-4 bg-gray-800 rounded-lg">
            <BadgeIcon className="w-12 h-12 text-yellow-400" />
          </div>
          <span className="text-sm text-gray-400">成就徽章</span>
        </div>
        
        {/* 付费服务 */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-4 bg-gray-800 rounded-lg">
            <PremiumIcon className="w-12 h-12 text-purple-400" />
          </div>
          <span className="text-sm text-gray-400">付费服务</span>
        </div>
      </div>
      
      {/* 使用示例 */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">使用示例</h3>
        <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { LogoIcon, WebDevIcon, AIMLIcon, BadgeIcon, PremiumIcon } from './Icons';

// 基础使用
<LogoIcon className="w-8 h-8 text-purple-400" />

// 自定义颜色
<WebDevIcon className="w-12 h-12 text-blue-500" />

// 悬停效果
<AIMLIcon className="w-10 h-10 text-green-400 hover:text-green-300 transition-colors" />`}
        </pre>
      </div>
    </div>
  );
};

// Export aliases for compatibility
export const WebsiteLogo = LogoIcon;
export const WebDevelopmentIcon = WebDevIcon;
export const AIIcon = AIMLIcon;
export const UserBadgeIcon = BadgeIcon;

export default IconShowcase;
