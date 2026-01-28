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
  DollarSign,
  Users,
  Globe,
} from 'lucide-react';

export default function ToolsShowcase() {
  const tools = [
    {
      icon: MessageSquare,
      title: "AI Teaching Assistant",
      titleZh: "AI教学助手",
      titleTh: "ผู้ช่วยสอน AI",
      titleMs: "Pembantu Pengajaran AI",
      description: "智能备课、答疑、个性化学习指导",
      badge: "HOT",
      color: "from-purple-500 to-pink-500",
      link: "/tools/chat",
      cost: "$0.001/请求"
    },
    {
      icon: ImageIcon,
      title: "AI Image Generator",
      titleZh: "AI图片生成器",
      titleTh: "เครื่องมือสร้างรูปภาพ",
      titleMs: "Penjana Imej",
      description: "从文本创建精美图像",
      badge: "NEW",
      color: "from-blue-500 to-cyan-500",
      link: "/dashboard/tools/image-gen",
      cost: "$0.50/张"
    },
    {
      icon: FileText,
      title: "Lesson Plan Generator",
      titleZh: "教案生成器",
      titleTh: "เครื่องมือสร้างแผนบทเรียน",
      titleMs: "Penjana Rancangan Pelajaran",
      description: "自动生成教案和课程材料",
      color: "from-green-500 to-emerald-500",
      link: "/tools/coming-soon",
      cost: "$0.002/请求"
    },
    {
      icon: CheckSquare,
      title: "Quiz Creator",
      titleZh: "测验生成器",
      titleTh: "เครื่องมือสร้างแบบทดสอบ",
      titleMs: "Pencipta Kuiz",
      description: "AI驱动的测评创建工具",
      color: "from-orange-500 to-red-500",
      link: "/tools/coming-soon",
      cost: "$0.001/题目"
    },
    {
      icon: Video,
      title: "Video Assistant",
      titleZh: "视频助手",
      titleTh: "ผู้ช่วยวิดีโอ",
      titleMs: "Pembantu Video",
      description: "视频课程辅助工具",
      color: "from-indigo-500 to-purple-500",
      link: "/tools/coming-soon",
      cost: "$0.005/分钟"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      titleZh: "数据分析",
      titleTh: "การวิเคราะห์ข้อมูล",
      titleMs: "Analitik",
      description: "学生进度追踪分析",
      color: "from-pink-500 to-rose-500",
      link: "/tools/coming-soon",
      cost: "免费"
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "快如闪电",
      titleEn: "Lightning Fast",
      description: "Gemini 2.5 Flash 驱动，响应速度极快",
      descriptionEn: "Powered by Gemini 2.5 Flash for ultra-fast response"
    },
    {
      icon: DollarSign,
      title: "成本优化",
      titleEn: "Cost Optimized",
      description: "每次请求仅需 $0.001 起，比市场低 80%",
      descriptionEn: "Starting from $0.001 per request, 80% lower than market"
    },
    {
      icon: Users,
      title: "$5 免费额度",
      titleEn: "$5 Free Credits",
      description: "新用户注册即送 $5，体验所有功能",
      descriptionEn: "Get $5 free credits on sign up, try all features"
    },
    {
      icon: Globe,
      title: "多语言支持",
      titleEn: "Multi-language",
      description: "支持中英泰马来语，自动翻译",
      descriptionEn: "Chinese, English, Thai, Malay supported with auto-translation"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
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
                    <span className="text-sm text-purple-300">Powered by Gemini 2.5 Flash</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                      35+ AI工具
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      助力教育创新
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-400 mb-4 max-w-xl leading-relaxed">
                    使用 Gemini 2.5 Flash 驱动的 AI 工具，快速、便宜、高效。
                  </p>
                  <p className="text-lg text-gray-500 mb-8 max-w-xl">
                    35+ AI tools powered by Gemini 2.5 Flash - Fast, Affordable, Efficient
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/auth/register">
                      <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                        免费获取 $5 额度
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
                        <span className="text-purple-400">const</span> price = <span className="text-green-400">&apos;$0.001&apos;</span>;<br/>
                        <span className="text-purple-400">const</span> speed = <span className="text-green-400">&apos;2.5 Flash&apos;</span>;<br/>
                        <span className="text-purple-400">const</span> credits = <span className="text-blue-400">$5</span>;<br/>
                        <span className="text-gray-500">{'// 免费试用开始'}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="container px-6 py-20 border-t border-white/5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                为什么选择我们？
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Why Choose Us? | ทำไมต้องเลือกเรา? | Mengapa Pilih Kami?
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{feature.titleEn}</p>
                    <p className="text-sm text-gray-400 mb-1">{feature.description}</p>
                    <p className="text-xs text-gray-500">{feature.descriptionEn}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Tools Grid */}
          <section className="container px-6 py-20 border-t border-white/5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  全部工具
                </span>
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                All Tools | เครื่องมือทั้งหมด | Semua Alat
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
                        <h3 className="text-xl font-semibold mb-1 text-white">{tool.titleZh}</h3>
                        <p className="text-sm text-gray-500 mb-2">{tool.title}</p>
                        <p className="text-xs text-gray-600 mb-2">{tool.titleTh} • {tool.titleMs}</p>
                        <p className="text-gray-400 text-sm mb-3">{tool.description}</p>
                        
                        {/* Cost */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-400 font-semibold">{tool.cost}</span>
                          <div className="flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-sm">使用</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="container px-6 py-32 border-t border-white/5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  立即开始免费试用
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
                注册即送 $5 免费额度，无需信用卡
              </p>
              <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
                Get $5 free credits on sign up - No credit card required
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 text-lg px-8">
                    免费注册
                    <Rocket className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="border-gray-700 text-white hover:border-purple-500 hover:bg-purple-500/10 text-lg px-8">
                    已有账号登录
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
