import React, { useState, useEffect } from 'react';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  icon: React.ReactNode;
  color: string;
}

interface RoadmapStepProps {
  step: RoadmapStep;
  index: number;
  isActive: boolean;
  isVisible: boolean;
}

const RoadmapStepCard: React.FC<RoadmapStepProps> = ({ step, index, isActive, isVisible }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`relative transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`} style={{ transitionDelay: `${index * 200}ms` }}>
      <div className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'} gap-8`}>
        {/* Content Card */}
        <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
          <div className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border transition-all duration-300 ${
            isActive 
              ? `border-${step.color}-500/50 shadow-lg shadow-${step.color}-500/20 scale-105` 
              : 'border-gray-700 hover:border-gray-600 hover:scale-102'
          }`}>
            <div className={`flex items-center gap-3 mb-4 ${isEven ? 'justify-end' : 'justify-start'}`}>
              <div className={`w-10 h-10 bg-gradient-to-r from-${step.color}-500 to-${step.color}-400 rounded-lg flex items-center justify-center text-white`}>
                {step.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <span className="text-sm text-gray-400">{step.duration}</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 leading-relaxed">
              {step.description}
            </p>
            
            <div className={`flex flex-wrap gap-2 ${isEven ? 'justify-end' : 'justify-start'}`}>
              {step.skills.map((skill, skillIndex) => (
                <span 
                  key={skillIndex}
                  className={`px-3 py-1 bg-${step.color}-500/10 text-${step.color}-400 rounded-full text-sm border border-${step.color}-500/20`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Timeline Node */}
        <div className="relative flex-shrink-0">
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
            isActive 
              ? `border-${step.color}-500 bg-${step.color}-500/20 shadow-lg shadow-${step.color}-500/40` 
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          }`}>
            <span className={`text-lg font-bold ${
              isActive ? `text-${step.color}-400` : 'text-gray-400'
            }`}>
              {index + 1}
            </span>
          </div>
          
          {/* Connecting Line */}
          {index < 5 && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-gray-600 to-gray-700"></div>
          )}
        </div>
        
        {/* Spacer for alignment */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export const LearningRoadmap: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const roadmapSteps: RoadmapStep[] = [
    {
      id: 'basics',
      title: 'Web开发基础',
      description: '掌握HTML、CSS、JavaScript等前端基础技术，建立扎实的编程基础',
      duration: '4-6周',
      skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git版本控制'],
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      id: 'frontend',
      title: '前端框架进阶',
      description: '学习现代前端框架React/Vue，掌握组件化开发和状态管理',
      duration: '6-8周',
      skills: ['React/Vue', '状态管理', '路由系统', '组件设计'],
      color: 'green',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
        </svg>
      )
    },
    {
      id: 'backend',
      title: '后端开发技能',
      description: '学习服务器端开发，掌握数据库设计和API开发技能',
      duration: '8-10周',
      skills: ['Node.js/Python', '数据库设计', 'RESTful API', '身份认证'],
      color: 'purple',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      )
    },
    {
      id: 'ai',
      title: 'AI与机器学习',
      description: '探索人工智能领域，学习机器学习算法和深度学习框架',
      duration: '10-12周',
      skills: ['Python数据科学', '机器学习', '深度学习', 'TensorFlow/PyTorch'],
      color: 'pink',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 'devops',
      title: 'DevOps与部署',
      description: '掌握现代化部署流程，学习容器化技术和持续集成/持续部署',
      duration: '6-8周',
      skills: ['Docker', 'CI/CD', '云服务', '监控运维'],
      color: 'orange',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      id: 'career',
      title: '职业发展',
      description: '完善作品集，准备技术面试，规划职业发展路径',
      duration: '4-6周',
      skills: ['作品集优化', '面试技巧', '职业规划', '持续学习'],
      color: 'yellow',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-step-index') || '0');
            setVisibleSteps(prev => {
              if (prev.includes(index)) return prev;
              return [...prev, index];
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const stepElements = document.querySelectorAll('[data-step-index]');
    stepElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % roadmapSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roadmapSteps.length]);

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            完整学习路线图
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            从零基础到技术专家，我们为您规划了完整的学习成长路径
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {roadmapSteps.map((step, index) => (
              <div key={step.id} data-step-index={index}>
                <RoadmapStepCard 
                  step={step}
                  index={index}
                  isActive={activeStep === index}
                  isVisible={visibleSteps.includes(index)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              准备开始您的学习之旅了吗？
            </h3>
            <p className="text-gray-400 mb-6">
              选择适合您的起点，我们将为您提供个性化的学习计划
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              开始学习评估
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
