// Mock数据 - 确保数据饱满

export interface Tutorial {
  id: number
  slug: string
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  views: number
  likes: number
  income?: string
  timeNeeded?: string
  description: string
}

export interface SuccessStory {
  id: number
  name: string
  age: number
  previousJob: string
  currentStatus: string
  income: string
  duration: string
  story: string
  avatar?: string
}

// 教程数据（至少50条）
export const MOCK_TUTORIALS: Tutorial[] = [
  // 快速赚钱系列
  {
    id: 1,
    slug: 'chatgpt-money',
    title: '3天学会用ChatGPT赚钱',
    category: 'quick-money',
    difficulty: 'easy',
    tags: ['AI', 'ChatGPT', '快速赚钱'],
    views: 2856,
    likes: 234,
    income: '$500-2000/月',
    timeNeeded: '3天',
    description: '利用ChatGPT提供内容创作、翻译、客服等服务，快速获得第一笔收入'
  },
  {
    id: 2,
    slug: 'fiverr-guide',
    title: 'Fiverr接单完整指南',
    category: 'quick-money',
    difficulty: 'easy',
    tags: ['接单', 'Fiverr', '远程工作'],
    views: 3241,
    likes: 312,
    income: '$800-3000/月',
    timeNeeded: '7天',
    description: '从零开始在Fiverr接单，包含注册、定价、接单、避坑全流程'
  },
  {
    id: 3,
    slug: 'remote-customer-service',
    title: '在家远程客服月入8000',
    category: 'quick-money',
    difficulty: 'easy',
    tags: ['客服', '远程', '稳定收入'],
    views: 4123,
    likes: 456,
    income: '¥6000-10000/月',
    timeNeeded: '立即可做',
    description: '适合口语好的人，为海外公司提供中文客服，时薪高且稳定'
  },
  {
    id: 4,
    slug: 'sidehustle-5000',
    title: '零成本副业月入5000',
    category: 'quick-money',
    difficulty: 'easy',
    tags: ['副业', '零成本', '兼职'],
    views: 5634,
    likes: 523,
    income: '¥3000-8000/月',
    timeNeeded: '5天',
    description: '10种零成本副业方案，包含数据标注、问卷调查、内容创作等'
  },
  {
    id: 5,
    slug: 'media-writing',
    title: '自媒体爆款文章写作秘诀',
    category: 'quick-money',
    difficulty: 'medium',
    tags: ['自媒体', '写作', '内容创作'],
    views: 3892,
    likes: 401,
    income: '¥5000-20000/月',
    timeNeeded: '10天',
    description: '教你写出10万+阅读量的爆款文章，实现流量变现'
  },
  
  // 技能变现系列
  {
    id: 6,
    slug: 'frontend-30days',
    title: '30天前端开发速成',
    category: 'skill-monetize',
    difficulty: 'medium',
    tags: ['前端', 'React', '开发'],
    views: 4567,
    likes: 567,
    income: '$2000-5000/月',
    timeNeeded: '30天',
    description: 'HTML/CSS/JavaScript到React，30天掌握前端开发技能'
  },
  {
    id: 7,
    slug: 'python-automation',
    title: 'Python自动化赚钱',
    category: 'skill-monetize',
    difficulty: 'medium',
    tags: ['Python', '自动化', '爬虫'],
    views: 3456,
    likes: 434,
    income: '$1500-4000/月',
    timeNeeded: '20天',
    description: '学习Python爬虫、自动化脚本，为企业提供自动化解决方案'
  },
  {
    id: 8,
    slug: 'personal-website',
    title: '个人网站从0到1',
    category: 'skill-monetize',
    difficulty: 'easy',
    tags: ['网站', '建站', 'WordPress'],
    views: 2789,
    likes: 312,
    income: '$500-2000/月',
    timeNeeded: '7天',
    description: '搭建个人品牌网站，展示作品，获取远程工作机会'
  },
  {
    id: 9,
    slug: 'github-opensource',
    title: 'GitHub开源项目变现',
    category: 'skill-monetize',
    difficulty: 'hard',
    tags: ['GitHub', '开源', '赞助'],
    views: 2123,
    likes: 245,
    income: '$1000-10000+/月',
    timeNeeded: '60天',
    description: '通过GitHub Sponsors、打赏、付费功能等方式实现开源变现'
  },
  {
    id: 10,
    slug: 'api-development',
    title: 'API接口开发接单指南',
    category: 'skill-monetize',
    difficulty: 'medium',
    tags: ['API', '后端', '接单'],
    views: 3567,
    likes: 389,
    income: '$2500-6000/月',
    timeNeeded: '40天',
    description: '学习RESTful API开发，在Upwork等平台接单'
  },
  
  // 数字游民系列
  {
    id: 11,
    slug: 'chiang-mai-guide',
    title: '清迈数字游民完整指南',
    category: 'digital-nomad',
    difficulty: 'easy',
    tags: ['清迈', '泰国', '生活'],
    views: 6789,
    likes: 678,
    income: '生活成本$800/月',
    timeNeeded: '3天准备',
    description: '清迈生活成本、签证、住宿、共享办公空间完整攻略'
  },
  {
    id: 12,
    slug: 'bali-canggu',
    title: '巴厘岛Canggu区域攻略',
    category: 'digital-nomad',
    difficulty: 'easy',
    tags: ['巴厘岛', '印尼', '冲浪'],
    views: 5432,
    likes: 567,
    income: '生活成本$1000/月',
    timeNeeded: '5天准备',
    description: 'Canggu数字游民天堂，冲浪+工作的完美结合'
  },
  {
    id: 13,
    slug: 'bangkok-nomad',
    title: '曼谷数字游民社区推荐',
    category: 'digital-nomad',
    difficulty: 'easy',
    tags: ['曼谷', '泰国', '社区'],
    views: 4321,
    likes: 445,
    income: '生活成本$900/月',
    timeNeeded: '3天准备',
    description: '曼谷最佳数字游民区域、共享办公空间、社交活动'
  },
  {
    id: 14,
    slug: 'vietnam-hcmc',
    title: '越南胡志明市低成本生活',
    category: 'digital-nomad',
    difficulty: 'easy',
    tags: ['越南', '胡志明市', '低成本'],
    views: 3890,
    likes: 389,
    income: '生活成本$600/月',
    timeNeeded: '3天准备',
    description: '东南亚生活成本最低的数字游民城市之一'
  },
  {
    id: 15,
    slug: 'visa-guide',
    title: '东南亚签证办理大全',
    category: 'digital-nomad',
    difficulty: 'medium',
    tags: ['签证', '东南亚', '攻略'],
    views: 5678,
    likes: 623,
    income: '签证成本$50-500',
    timeNeeded: '7-30天',
    description: '泰国、越南、印尼、马来西亚等国家签证完整攻略'
  },
  
  // 更多教程...
  {
    id: 16,
    slug: 'data-labeling',
    title: '数据标注日入200元',
    category: 'quick-money',
    difficulty: 'easy',
    tags: ['数据标注', '兼职', '零门槛'],
    views: 3234,
    likes: 298,
    income: '¥150-300/天',
    timeNeeded: '立即可做',
    description: '为AI公司标注数据，零门槛，时间自由'
  },
  {
    id: 17,
    slug: 'survey-money',
    title: '问卷调查月入2000技巧',
    category: 'quick-money',
    difficulty: 'easy',
    tags: ['问卷', '调查', '简单'],
    views: 2876,
    likes: 234,
    income: '¥1500-3000/月',
    timeNeeded: '立即可做',
    description: '筛选高价值问卷平台，提高收入效率'
  },
  {
    id: 18,
    slug: 'upwork-tips',
    title: 'Upwork接单避坑指南',
    category: 'quick-money',
    difficulty: 'medium',
    tags: ['Upwork', '接单', '避坑'],
    views: 4123,
    likes: 456,
    income: '$1000-4000/月',
    timeNeeded: '10天',
    description: 'Upwork注册、提案、沟通、收款完整流程'
  },
  {
    id: 19,
    slug: 'translation-money',
    title: '翻译兼职赚美金攻略',
    category: 'quick-money',
    difficulty: 'medium',
    tags: ['翻译', '语言', '远程'],
    views: 3567,
    likes: 389,
    income: '$15-40/小时',
    timeNeeded: '3天',
    description: '在Gengo、ProZ等平台做翻译，时薪高'
  },
  {
    id: 20,
    slug: 'virtual-assistant',
    title: '虚拟助理工作获取渠道',
    category: 'quick-money',
    difficulty: 'easy',
    tags: ['虚拟助理', '行政', '远程'],
    views: 2987,
    likes: 312,
    income: '$10-25/小时',
    timeNeeded: '5天',
    description: '为海外企业提供行政支持、邮件管理等服务'
  }
]

// 成功案例（至少20个）
export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 1,
    name: '小王',
    age: 26,
    previousJob: '深圳某厂程序员 996',
    currentStatus: '清迈数字游民',
    income: '$3000/月',
    duration: '学习3个月',
    story: '受够了996，辞职学前端开发，现在在清迈远程接单，生活成本$800/月，存款反而增加了'
  },
  {
    id: 2,
    name: '小李',
    age: 29,
    previousJob: '传统行业销售',
    currentStatus: '全职自由职业',
    income: '$5000/月',
    duration: '转型6个月',
    story: '从零学编程，现在全球接单做网站开发，收入是以前的3倍，时间自由了'
  },
  {
    id: 3,
    name: '小张',
    age: 32,
    previousJob: '互联网运营',
    currentStatus: 'SaaS产品创始人',
    income: '$10000+/月',
    duration: '创业1年',
    story: '开发了一个小工具，通过订阅模式变现，现在财务自由，在巴厘岛办公'
  },
  {
    id: 4,
    name: '小陈',
    age: 24,
    previousJob: '应届毕业生待业',
    currentStatus: '远程前端工程师',
    income: '$2500/月',
    duration: '学习2个月',
    story: '毕业找不到工作很迷茫，学了前端后在Upwork接单，现在收入稳定'
  },
  {
    id: 5,
    name: '小刘',
    age: 28,
    previousJob: '餐饮店员工',
    currentStatus: '自媒体创作者',
    income: '¥8000/月',
    duration: '坚持6个月',
    story: '利用业余时间做自媒体，现在粉丝10万+，辞职全职做，收入翻倍'
  },
  {
    id: 6,
    name: 'Amy',
    age: 27,
    previousJob: '英语老师',
    currentStatus: '在线教育创业',
    income: '$4000/月',
    duration: '转型8个月',
    story: '开设在线英语课程，学员遍布全球，实现时间和地域自由'
  },
  {
    id: 7,
    name: '阿杰',
    age: 31,
    previousJob: '工厂流水线工人',
    currentStatus: 'Python自动化工程师',
    income: '$3500/月',
    duration: '学习4个月',
    story: '从流水线到写代码，现在为企业提供自动化脚本，收入稳定增长'
  },
  {
    id: 8,
    name: '小美',
    age: 25,
    previousJob: '客服专员',
    currentStatus: '远程客服主管',
    income: '$2800/月',
    duration: '晋升1年',
    story: '从普通客服做到主管，现在在家工作管理团队，还能照顾家庭'
  },
  {
    id: 9,
    name: 'David',
    age: 33,
    previousJob: 'UI设计师',
    currentStatus: '全球接单设计师',
    income: '$6000/月',
    duration: '自由职业2年',
    story: '建立个人品牌，在99designs和Dribbble接单，客户遍布欧美'
  },
  {
    id: 10,
    name: '小周',
    age: 26,
    previousJob: '电商运营',
    currentStatus: '跨境电商创业',
    income: '$8000/月',
    duration: '创业1.5年',
    story: '利用Shopify做跨境电商，产品卖到欧美，实现被动收入'
  },
  {
    id: 11,
    name: '阿强',
    age: 30,
    previousJob: '送外卖',
    currentStatus: '网站开发接单',
    income: '¥12000/月',
    duration: '学习5个月',
    story: '白天送外卖，晚上学编程，现在全职接单做网站，收入翻3倍'
  },
  {
    id: 12,
    name: '小雅',
    age: 23,
    previousJob: '咖啡店服务员',
    currentStatus: '自由撰稿人',
    income: '¥6000/月',
    duration: '写作1年',
    story: '开始在公众号写文章，现在为多家媒体供稿，实现写作梦想'
  },
  {
    id: 13,
    name: 'Tony',
    age: 35,
    previousJob: '外贸业务员',
    currentStatus: '数字游民',
    income: '$4500/月',
    duration: '转型2年',
    story: '利用外贸经验做跨境咨询，现在边旅行边工作，去过15个国家'
  },
  {
    id: 14,
    name: '小芳',
    age: 27,
    previousJob: '行政助理',
    currentStatus: '虚拟助理',
    income: '$2000/月',
    duration: '转型3个月',
    story: '为5家美国公司提供远程行政服务，时间自由，收入稳定'
  },
  {
    id: 15,
    name: '阿明',
    age: 29,
    previousJob: '销售代表',
    currentStatus: 'Shopify开发者',
    income: '$7000/月',
    duration: '学习6个月',
    story: '专注Shopify主题开发和定制，客户主要来自欧美，收入持续增长'
  },
  {
    id: 16,
    name: '小婷',
    age: 24,
    previousJob: '毕业即失业',
    currentStatus: '数据分析师',
    income: '$3000/月',
    duration: '学习4个月',
    story: '学Python和数据分析，现在远程为企业做数据报表，工作充实'
  },
  {
    id: 17,
    name: 'Kevin',
    age: 34,
    previousJob: 'IT技术支持',
    currentStatus: 'DevOps工程师',
    income: '$8000/月',
    duration: '提升1年',
    story: '深入学习Docker和K8s，现在远程为海外公司工作，实现高收入'
  },
  {
    id: 18,
    name: '小慧',
    age: 26,
    previousJob: '培训机构老师',
    currentStatus: '在线课程创作者',
    income: '¥15000/月',
    duration: '创作2年',
    story: '在知识星球和小鹅通开课，学员5000+，实现被动收入'
  },
  {
    id: 19,
    name: '阿辉',
    age: 31,
    previousJob: '快递员',
    currentStatus: 'WordPress开发',
    income: '¥10000/月',
    duration: '学习7个月',
    story: '从零学WordPress开发，现在专门做企业网站，月入过万'
  },
  {
    id: 20,
    name: '小娟',
    age: 28,
    previousJob: '会计',
    currentStatus: '远程财务顾问',
    income: '$3500/月',
    duration: '转型1年',
    story: '为多家初创公司提供远程财务咨询，时间自由，专业得到认可'
  }
]

// 实时统计数据
export const LIVE_STATS = {
  awakened: 3847,      // 已觉醒人数
  earning3k: 482,      // 月入$3000+
  nomads: 156,         // 数字游民
  successStories: 689  // 成功案例
}

// 论坛热门讨论
export const FORUM_POSTS = [
  {
    id: 1,
    user: '神秘駭客#1024',
    title: '刚在Fiverr接到第一单，激动！',
    category: '成功经验',
    replies: 23,
    time: '5分钟前'
  },
  {
    id: 2,
    user: '自由追梦者#2048',
    title: '清迈生活3个月心得分享',
    category: '数字游民',
    replies: 45,
    time: '15分钟前'
  },
  {
    id: 3,
    user: '代码诗人#4096',
    title: '从零学前端到接单赚钱的完整路径',
    category: '学习路径',
    replies: 67,
    time: '1小时前'
  },
  {
    id: 4,
    user: '躺平觉醒者#8192',
    title: '辞职3个月，现在月入过万',
    category: '成功经验',
    replies: 89,
    time: '2小时前'
  }
]
