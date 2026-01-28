'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  FileText,
  BookOpen,
  Image,
  Video,
  Search,
  TrendingUp,
  BarChart3,
  Globe,
  Users,
  Mail,
  Share2,
  Newspaper,
  PenTool,
  Target,
  Zap,
  Sparkles,
  Clock,
  ArrowRight,
  Lightbulb,
  Database,
  LineChart,
  Hash,
  Link2,
  FileSpreadsheet,
  Megaphone,
  Brain,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';

export default function ToolsPage() {
  const toolCategories = [
    {
      name: 'AI教学工具',
      nameEn: 'AI Teaching Tools',
      nameTh: 'เครื่องมือสอน AI',
      nameMs: 'Alat Pengajaran AI',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tools: [
        {
          name: 'AI教学助手',
          nameEn: 'AI Teaching Assistant',
          description: '智能备课、答疑、个性化学习指导',
          descriptionEn: 'Smart lesson prep, Q&A, personalized guidance',
          icon: MessageSquare,
          href: '/tools/chat',
          status: 'active',
          hot: true,
          new: true,
        },
        {
          name: '教案生成器',
          nameEn: 'Lesson Plan Generator',
          description: '自动生成完整教案和教学材料',
          descriptionEn: 'Auto-generate comprehensive lesson plans',
          icon: FileText,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '测验评估生成器',
          nameEn: 'Quiz Creator',
          description: '智能生成测验题目和评估标准',
          descriptionEn: 'Generate quizzes and assessments',
          icon: BookOpen,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '教学视频制作',
          nameEn: 'Educational Video Maker',
          description: '将课程内容转化为视频讲座',
          descriptionEn: 'Convert lessons into video lectures',
          icon: Video,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '教学素材库',
          nameEn: 'Teaching Materials Library',
          description: '生成图表、插图等教学素材',
          descriptionEn: 'Generate diagrams and illustrations',
          icon: Image,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '学习路径规划',
          nameEn: 'Learning Path Planner',
          description: '为学生定制个性化学习路径',
          descriptionEn: 'Customize learning paths for students',
          icon: Target,
          href: '/tools/coming-soon',
          status: 'coming',
        },
      ],
    },
    {
      name: '内容工厂',
      nameEn: 'Content Factory',
      nameTh: 'โรงงานเนื้อหา',
      nameMs: 'Kilang Kandungan',
      icon: PenTool,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tools: [
        {
          name: '批量文章生成',
          nameEn: 'Bulk Article Generator',
          description: '批量生成高质量教育文章',
          descriptionEn: 'Generate educational articles in bulk',
          icon: Newspaper,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '多语言内容翻译',
          nameEn: 'Multi-language Translator',
          description: '一键翻译为多国语言',
          descriptionEn: 'Translate to multiple languages',
          icon: Globe,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '内容改写工具',
          nameEn: 'Content Rewriter',
          description: '智能改写避免重复',
          descriptionEn: 'Smart rewriting to avoid duplicates',
          icon: Sparkles,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '社交媒体文案',
          nameEn: 'Social Media Copy',
          description: '生成各平台营销文案',
          descriptionEn: 'Generate platform-specific copy',
          icon: Share2,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '邮件营销内容',
          nameEn: 'Email Marketing',
          description: '批量生成营销邮件',
          descriptionEn: 'Generate marketing emails in bulk',
          icon: Mail,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '内容日历管理',
          nameEn: 'Content Calendar',
          description: '规划和管理内容发布',
          descriptionEn: 'Plan and manage content publishing',
          icon: Clock,
          href: '/tools/coming-soon',
          status: 'coming',
        },
      ],
    },
    {
      name: 'SEO优化工具',
      nameEn: 'SEO Tools',
      nameTh: 'เครื่องมือ SEO',
      nameMs: 'Alat SEO',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tools: [
        {
          name: '关键词研究',
          nameEn: 'Keyword Research',
          description: '实时查询关键词热度和竞争度',
          descriptionEn: 'Real-time keyword analysis',
          icon: Search,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: 'SEO标题生成',
          nameEn: 'SEO Title Generator',
          description: '生成高转化率标题',
          descriptionEn: 'Generate high-conversion titles',
          icon: Hash,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '元描述生成器',
          nameEn: 'Meta Description Generator',
          description: '优化搜索引擎描述',
          descriptionEn: 'Optimize search descriptions',
          icon: FileText,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '内链建议',
          nameEn: 'Internal Link Suggestions',
          description: '智能推荐内部链接',
          descriptionEn: 'Smart internal link recommendations',
          icon: Link2,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '竞争对手分析',
          nameEn: 'Competitor Analysis',
          description: '分析竞争对手SEO策略',
          descriptionEn: 'Analyze competitor SEO strategies',
          icon: BarChart3,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '排名追踪',
          nameEn: 'Rank Tracking',
          description: '监控关键词排名变化',
          descriptionEn: 'Monitor keyword ranking changes',
          icon: LineChart,
          href: '/tools/coming-soon',
          status: 'coming',
        },
      ],
    },
    {
      name: '流量工厂',
      nameEn: 'Traffic Factory',
      nameTh: 'โรงงานทราฟฟิก',
      nameMs: 'Kilang Trafik',
      icon: Megaphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      tools: [
        {
          name: '落地页生成器',
          nameEn: 'Landing Page Builder',
          description: '快速创建高转化落地页',
          descriptionEn: 'Create high-conversion landing pages',
          icon: Target,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '广告文案生成',
          nameEn: 'Ad Copy Generator',
          description: '生成各平台广告文案',
          descriptionEn: 'Generate platform-specific ad copy',
          icon: Megaphone,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: 'A/B测试工具',
          nameEn: 'A/B Testing Tool',
          description: '对比测试不同版本效果',
          descriptionEn: 'Compare different version performance',
          icon: BarChart3,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '用户画像分析',
          nameEn: 'User Persona Analysis',
          description: '分析目标用户特征',
          descriptionEn: 'Analyze target user characteristics',
          icon: Users,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '流量来源分析',
          nameEn: 'Traffic Source Analytics',
          description: '追踪和分析流量来源',
          descriptionEn: 'Track and analyze traffic sources',
          icon: TrendingUp,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '转化率优化',
          nameEn: 'Conversion Rate Optimization',
          description: '提升转化率的建议',
          descriptionEn: 'Suggestions to improve conversion',
          icon: Zap,
          href: '/tools/coming-soon',
          status: 'coming',
        },
      ],
    },
    {
      name: '数据分析',
      nameEn: 'Data Analytics',
      nameTh: 'การวิเคราะห์ข้อมูล',
      nameMs: 'Analitik Data',
      icon: Database,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      tools: [
        {
          name: '学员数据分析',
          nameEn: 'Student Analytics',
          description: '分析学员学习数据和行为',
          descriptionEn: 'Analyze student learning data',
          icon: BarChart3,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '课程效果评估',
          nameEn: 'Course Effectiveness',
          description: '评估课程效果和改进建议',
          descriptionEn: 'Evaluate course effectiveness',
          icon: CheckCircle,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '营销数据报告',
          nameEn: 'Marketing Reports',
          description: '生成详细营销数据报告',
          descriptionEn: 'Generate marketing reports',
          icon: FileSpreadsheet,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: '智能预测分析',
          nameEn: 'Predictive Analytics',
          description: 'AI预测趋势和结果',
          descriptionEn: 'AI-powered trend prediction',
          icon: Brain,
          href: '/tools/coming-soon',
          status: 'coming',
        },
      ],
    },
    {
      name: '创意工具',
      nameEn: 'Creative Tools',
      nameTh: 'เครื่องมือสร้างสรรค์',
      nameMs: 'Alat Kreatif',
      icon: Lightbulb,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      tools: [
        {
          name: '品牌名称生成',
          nameEn: 'Brand Name Generator',
          description: '为品牌生成创意名称',
          descriptionEn: 'Generate creative brand names',
          icon: Sparkles,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: 'Slogan生成器',
          nameEn: 'Slogan Generator',
          description: '创建吸引人的品牌口号',
          descriptionEn: 'Create catchy brand slogans',
          icon: MessageSquare,
          href: '/tools/coming-soon',
          status: 'coming',
        },
        {
          name: 'Logo创意建议',
          nameEn: 'Logo Ideas',
          description: '提供Logo设计创意',
          descriptionEn: 'Provide logo design ideas',
          icon: Sparkles,
          href: '/tools/coming-soon',
          status: 'coming',
        },
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>35+ AI工具</span>
            </div>
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">
              工具中心
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              一站式AI工具助力教育创新
            </p>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="px-4 py-6 md:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {toolCategories.map((category, catIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div 
                key={category.name} 
                id={catIndex === 0 ? 'teaching' : catIndex === 1 ? 'content' : catIndex === 2 ? 'seo' : catIndex === 3 ? 'traffic' : catIndex === 4 ? 'analytics' : 'creative'}
                className="scroll-mt-20"
              >
                {/* Category Header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${category.bgColor}`}>
                    <CategoryIcon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <p className="text-xs text-muted-foreground">{category.nameEn}</p>
                  </div>
                </div>

                {/* Tools List */}
                <div className="space-y-2">
                  {category.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    const isActive = tool.status === 'active';
                    
                    return (
                      <Link
                        key={tool.name}
                        href={isActive ? tool.href : '/tools/coming-soon'}
                        className="block"
                      >
                        <div className="group flex items-center gap-4 rounded-lg border bg-background p-4 transition-all hover:border-primary/50 hover:bg-accent/50">
                          {/* Icon */}
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50">
                            <ToolIcon className="h-6 w-6 text-primary" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{tool.name}</h3>
                              {tool.hot && (
                                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                                  <Zap className="mr-0.5 h-2.5 w-2.5" />
                                  HOT
                                </Badge>
                              )}
                              {'new' in tool && isActive && (
                                <Badge className="h-5 px-1.5 text-[10px] bg-blue-500">
                                  <Sparkles className="mr-0.5 h-2.5 w-2.5" />
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 md:line-clamp-2">
                              {tool.description}
                            </p>
                          </div>

                          {/* Status/Action */}
                          <div className="flex-shrink-0">
                            {isActive ? (
                              <div className="flex items-center gap-1 text-primary text-sm font-medium">
                                <span className="hidden sm:inline">使用</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="mr-1 h-3 w-3" />
                                即将上线
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t bg-muted/30 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-xl font-bold md:text-2xl">
            准备好开始了吗？
          </h2>
          <p className="mb-6 text-sm text-muted-foreground md:text-base">
            免费试用，探索AI工具如何改变你的工作方式
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                免费开始
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">查看定价</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
