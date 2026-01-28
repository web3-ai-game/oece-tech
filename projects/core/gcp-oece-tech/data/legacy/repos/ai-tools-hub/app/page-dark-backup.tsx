'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  FileText,
  Zap,
  ArrowRight,
  CheckSquare,
  MessageSquare,
  Rocket,
  BarChart3,
} from 'lucide-react';

export default function Home() {
  const tools = [
    {
      icon: MessageSquare,
      title: "AI Teaching Assistant",
      titleZh: "AI教学助手",
      description: "智能备课、答疑、个性化学习指导",
      badge: "HOT",
      color: "from-purple-500 to-pink-500",
      link: "/tools/chat"
    },
    {
      icon: ImageIcon,
      title: "AI Image Generator",
      titleZh: "AI图片生成器",
      description: "从文本创建精美图像",
      badge: "NEW",
      color: "from-blue-500 to-cyan-500",
      link: "/dashboard/tools/image-gen"
    },
    {
      icon: FileText,
      title: "Lesson Plan Generator",
      titleZh: "教案生成器",
      description: "自动生成教案和课程材料",
      color: "from-green-500 to-emerald-500",
      link: "/tools/coming-soon"
    },
    {
      icon: CheckSquare,
      title: "Quiz & Assessment",
      titleZh: "测验评估",
      description: "AI驱动的测评创建工具",
      color: "from-orange-500 to-red-500",
      link: "/tools/coming-soon"
    },
    {
      icon: Video,
      title: "Video Assistant",
      titleZh: "视频助手",
      description: "视频课程辅助工具",
      color: "from-indigo-500 to-purple-500",
      link: "/tools/coming-soon"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      titleZh: "数据分析",
      description: "学生进度追踪分析",
      color: "from-pink-500 to-rose-500",
      link: "/tools/coming-soon"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header with backdrop blur */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <Header />
        </div>
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-[700px] flex items-center overflow-hidden">
            <div className="container px-6 py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="z-10"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300">Powered by Google Gemini AI</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                      AI-Powered
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Education Platform
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-400 mb-8 max-w-xl leading-relaxed">
                    使用智能 AI 工具为教育工作者赋能。简化备课流程、创建引人入胜的评估、提升学生学习成果。
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/tools">
                      <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                        免费开始试用
                        <Zap className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button size="lg" variant="outline" className="border-gray-700 text-white hover:border-purple-500 hover:bg-purple-500/10">
                        查看定价
                      </Button>
                    </Link>
                  </div>
                </motion.div>
                
                {/* Right: 3D Animation */}
                <div className="relative lg:block hidden">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl" />
                  </motion.div>
                  
                  <motion.div
                    className="relative z-10 p-8 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <div className="space-y-3 font-mono text-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="text-gray-400">
                        <span className="text-purple-400">const</span> tools = [<br/>
                        &nbsp;&nbsp;<span className="text-green-400">&apos;AI Teaching Assistant&apos;</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">&apos;Image Generator&apos;</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">&apos;Lesson Planner&apos;</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">&apos;Quiz Creator&apos;</span>,<br/>
                        ];
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Tools Grid */}
          <section className="container px-6 py-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  35+ AI工具助力教育
                </span>
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                从教学到营销，从内容创作到数据分析，一站式AI工具解决方案
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {tools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Link href={tool.link}>
                      <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-purple-500/50 transition-all cursor-pointer h-full">
                        {/* Badge */}
                        {tool.badge && (
                          <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${
                            tool.badge === 'HOT' 
                              ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          } text-white`}>
                            {tool.badge}
                          </div>
                        )}
                        
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        
                        {/* Content */}
                        <h3 className="text-xl font-semibold mb-2 text-white">{tool.titleZh}</h3>
                        <p className="text-sm text-gray-500 mb-1">{tool.title}</p>
                        <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                        
                        {/* Hover Arrow */}
                        <div className="flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm">立即使用</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/tools">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                  查看所有35+工具
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container px-6 py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  准备好开始了吗？
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                加入数千名使用 OECE 提升教学质量的教育工作者。免费试用，无需信用卡。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                    免费开始试用
                    <Rocket className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-gray-700 text-white hover:border-purple-500 hover:bg-purple-500/10">
                    查看定价方案
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
