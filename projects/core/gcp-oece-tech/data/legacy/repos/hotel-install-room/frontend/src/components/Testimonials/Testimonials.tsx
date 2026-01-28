import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, isActive }) => {
  return (
    <div className={`transition-all duration-500 transform ${
      isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
    }`}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 relative group">
        {/* 引号装饰 */}
        <div className="absolute -top-4 -left-4 text-6xl text-purple-500/20 font-serif">"</div>
        
        {/* 评星 */}
        <div className="flex mb-6">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        
        {/* 评价内容 */}
        <p className="text-gray-300 text-lg leading-relaxed mb-8 italic">
          {testimonial.content}
        </p>
        
        {/* 用户信息 */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
            {testimonial.avatar}
          </div>
          <div>
            <h4 className="text-white font-semibold">{testimonial.name}</h4>
            <p className="text-gray-400 text-sm">{testimonial.role} · {testimonial.company}</p>
          </div>
        </div>
        
        {/* 悬停效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: '张伟',
      role: '前端工程师',
      company: '字节跳动',
      avatar: '张',
      content: '这个平台的教程质量非常高，从零基础到高级进阶，每个知识点都讲解得非常清晰。特别是React和Vue的实战项目，帮我快速提升了开发技能。',
      rating: 5
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: '全栈开发者',
      company: 'Microsoft',
      avatar: 'S',
      content: 'The AI and machine learning tutorials are exceptional! The interactive coding environments and real-time feedback make learning complex algorithms much easier to understand.',
      rating: 5
    },
    {
      id: '3',
      name: '李明',
      role: '技术总监',
      company: '腾讯',
      avatar: '李',
      content: '团队成员都在使用这个平台学习最新技术。课程更新及时，内容实用性强，大大提升了我们的技术水平和项目交付质量。',
      rating: 5
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      role: 'Startup CTO',
      company: 'TechFlow',
      avatar: 'A',
      content: 'As a startup CTO, I need to stay updated with the latest tech trends. This platform provides exactly what I need - concise, practical tutorials that I can immediately apply to our products.',
      rating: 4
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-gray-800 relative overflow-hidden">
      {/* 背景动效 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            学员真实评价
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            来自全球开发者的真实反馈，见证我们的教学质量
          </p>
        </div>
        
        {/* 轮播容器 */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id}
                testimonial={testimonial}
                isActive={activeIndex === index || activeIndex === index + 2}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.slice(2, 4).map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id}
                testimonial={testimonial}
                isActive={activeIndex === index + 2}
              />
            ))}
          </div>
        </div>
        
        {/* 指示器 */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-purple-500 w-8' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
