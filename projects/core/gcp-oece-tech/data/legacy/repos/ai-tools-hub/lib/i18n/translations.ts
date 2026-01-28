import type { Language } from '@/types/language';

export interface Translations {
  // Header Navigation
  nav: {
    home: string;
    tools: string;
    pricing: string;
    about: string;
    signIn: string;
    getStarted: string;
    dashboard: string;
    billing: string;
    settings: string;
    signOut: string;
    credits: string;
  };

  // Tools
  tools: {
    imageGeneration: string;
    videoGeneration: string;
    contentWriting: string;
    imageDesc: string;
    videoDesc: string;
    contentDesc: string;
  };

  // Home Page
  home: {
    hero: {
      badge: string;
      title: string;
      titleHighlight: string;
      subtitle: string;
      getStarted: string;
      viewPricing: string;
    };
    features: {
      title: string;
      subtitle: string;
      imagePrice: string;
      videoPrice: string;
      contentPrice: string;
      tryNow: string;
    };
    benefits: {
      title: string;
      items: string[];
    };
    whyChoose: {
      lightningFast: string;
      lightningFastDesc: string;
      securePrivate: string;
      securePrivateDesc: string;
      globalAccess: string;
      globalAccessDesc: string;
      latestAI: string;
      latestAIDesc: string;
    };
    testimonials: {
      title: string;
      subtitle: string;
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      tools: 'Tools',
      pricing: 'Pricing',
      about: 'About',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      dashboard: 'Dashboard',
      billing: 'Billing',
      settings: 'Settings',
      signOut: 'Sign out',
      credits: 'Credits',
    },
    tools: {
      imageGeneration: 'Image Generation',
      videoGeneration: 'Video Generation',
      contentWriting: 'Content Writing',
      imageDesc: 'Create stunning images from text',
      videoDesc: 'Generate videos from descriptions',
      contentDesc: 'AI-powered content creation',
    },
    home: {
      hero: {
        badge: 'Powered by Gemini AI',
        title: 'Create Amazing Content with',
        titleHighlight: 'AI Tools Hub',
        subtitle: 'Professional AI tools for image generation, video creation, and content writing. Pay only for what you use - no subscriptions required.',
        getStarted: 'Get Started Free',
        viewPricing: 'View Pricing',
      },
      features: {
        title: 'Powerful AI Tools at Your Fingertips',
        subtitle: 'Choose from our suite of professional AI tools',
        imagePrice: '$0.50 per image',
        videoPrice: '$2.00 per 30s',
        contentPrice: '$0.20 per 100 words',
        tryNow: 'Try Now',
      },
      benefits: {
        title: 'Why Choose AI Tools Hub?',
        items: [
          'No subscription required - pay as you go',
          'State-of-the-art AI models',
          'Fast generation times',
          'Commercial usage rights',
          'API access available',
          '24/7 customer support',
        ],
      },
      whyChoose: {
        lightningFast: 'Lightning Fast',
        lightningFastDesc: 'Generate content in seconds, not hours',
        securePrivate: 'Secure & Private',
        securePrivateDesc: 'Your data is encrypted and never shared',
        globalAccess: 'Global Access',
        globalAccessDesc: 'Available worldwide, 24/7',
        latestAI: 'Latest AI Models',
        latestAIDesc: 'Powered by cutting-edge technology',
      },
      testimonials: {
        title: 'Loved by Creators Worldwide',
        subtitle: 'See what our users are saying',
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of creators using AI Tools Hub to transform their content',
        button: 'Start Creating for Free',
      },
    },
  },
  zh: {
    nav: {
      home: '首页',
      tools: '工具',
      pricing: '价格',
      about: '关于',
      signIn: '登录',
      getStarted: '开始使用',
      dashboard: '控制台',
      billing: '账单',
      settings: '设置',
      signOut: '退出登录',
      credits: '积分',
    },
    tools: {
      imageGeneration: '图片生成',
      videoGeneration: '视频生成',
      contentWriting: '内容写作',
      imageDesc: '从文本创建精美图片',
      videoDesc: '从描述生成视频',
      contentDesc: 'AI驱动的内容创作',
    },
    home: {
      hero: {
        badge: '由 Gemini AI 驱动',
        title: '使用',
        titleHighlight: 'AI 工具中心',
        subtitle: '专业的 AI 工具，用于图片生成、视频创作和内容写作。只需为您使用的内容付费 - 无需订阅。',
        getStarted: '免费开始',
        viewPricing: '查看价格',
      },
      features: {
        title: '强大的 AI 工具触手可及',
        subtitle: '从我们的专业 AI 工具套件中选择',
        imagePrice: '每张图片 $0.50',
        videoPrice: '每 30 秒 $2.00',
        contentPrice: '每 100 字 $0.20',
        tryNow: '立即试用',
      },
      benefits: {
        title: '为什么选择 AI 工具中心？',
        items: [
          '无需订阅 - 按需付费',
          '最先进的 AI 模型',
          '快速生成时间',
          '商业使用权限',
          '可用 API 访问',
          '全天候客户支持',
        ],
      },
      whyChoose: {
        lightningFast: '闪电般快速',
        lightningFastDesc: '在几秒钟内生成内容，而不是几小时',
        securePrivate: '安全私密',
        securePrivateDesc: '您的数据已加密，绝不共享',
        globalAccess: '全球访问',
        globalAccessDesc: '全球范围，全天候可用',
        latestAI: '最新 AI 模型',
        latestAIDesc: '由尖端技术驱动',
      },
      testimonials: {
        title: '深受全球创作者喜爱',
        subtitle: '看看我们的用户怎么说',
      },
      cta: {
        title: '准备好开始了吗？',
        subtitle: '加入数千名使用 AI 工具中心转变内容创作的创作者',
        button: '免费开始创作',
      },
    },
  },
  th: {
    nav: {
      home: 'หน้าแรก',
      tools: 'เครื่องมือ',
      pricing: 'ราคา',
      about: 'เกี่ยวกับ',
      signIn: 'เข้าสู่ระบบ',
      getStarted: 'เริ่มต้นใช้งาน',
      dashboard: 'แดชบอร์ด',
      billing: 'การเรียกเก็บเงิน',
      settings: 'การตั้งค่า',
      signOut: 'ออกจากระบบ',
      credits: 'เครดิต',
    },
    tools: {
      imageGeneration: 'สร้างภาพ',
      videoGeneration: 'สร้างวิดีโอ',
      contentWriting: 'เขียนเนื้อหา',
      imageDesc: 'สร้างภาพสวยงามจากข้อความ',
      videoDesc: 'สร้างวิดีโอจากคำอธิบาย',
      contentDesc: 'การสร้างเนื้อหาด้วย AI',
    },
    home: {
      hero: {
        badge: 'ขับเคลื่อนโดย Gemini AI',
        title: 'สร้างเนื้อหาที่น่าทึ่งด้วย',
        titleHighlight: 'AI Tools Hub',
        subtitle: 'เครื่องมือ AI มืออาชีพสำหรับการสร้างภาพ การสร้างวิดีโอ และการเขียนเนื้อหา จ่ายเฉพาะสิ่งที่คุณใช้ - ไม่ต้องสมัครสมาชิก',
        getStarted: 'เริ่มใช้งานฟรี',
        viewPricing: 'ดูราคา',
      },
      features: {
        title: 'เครื่องมือ AI ที่ทรงพลังอยู่ใกล้แค่ปลายนิ้ว',
        subtitle: 'เลือกจากชุดเครื่องมือ AI มืออาชีพของเรา',
        imagePrice: '$0.50 ต่อภาพ',
        videoPrice: '$2.00 ต่อ 30 วินาที',
        contentPrice: '$0.20 ต่อ 100 คำ',
        tryNow: 'ลองตอนนี้',
      },
      benefits: {
        title: 'ทำไมต้องเลือก AI Tools Hub?',
        items: [
          'ไม่ต้องสมัครสมาชิก - จ่ายตามการใช้งาน',
          'โมเดล AI ที่ทันสมัยที่สุด',
          'เวลาสร้างที่รวดเร็ว',
          'สิทธิ์การใช้งานเชิงพาณิชย์',
          'เข้าถึง API ได้',
          'การสนับสนุนลูกค้าตลอด 24/7',
        ],
      },
      whyChoose: {
        lightningFast: 'รวดเร็วเหมือนฟ้าแลบ',
        lightningFastDesc: 'สร้างเนื้อหาในไม่กี่วินาที ไม่ใช่หลายชั่วโมง',
        securePrivate: 'ปลอดภัยและเป็นส่วนตัว',
        securePrivateDesc: 'ข้อมูลของคุณถูกเข้ารหัสและไม่มีการแชร์',
        globalAccess: 'เข้าถึงได้ทั่วโลก',
        globalAccessDesc: 'พร้อมใช้งานทั่วโลก ตลอด 24/7',
        latestAI: 'โมเดล AI ล่าสุด',
        latestAIDesc: 'ขับเคลื่อนด้วยเทคโนโลยีล้ำสมัย',
      },
      testimonials: {
        title: 'ได้รับความรักจากผู้สร้างสรรค์ทั่วโลก',
        subtitle: 'ดูสิ่งที่ผู้ใช้ของเราพูด',
      },
      cta: {
        title: 'พร้อมที่จะเริ่มต้นแล้วหรือยัง?',
        subtitle: 'เข้าร่วมกับผู้สร้างสรรค์หลายพันคนที่ใช้ AI Tools Hub เพื่อเปลี่ยนแปลงเนื้อหาของพวกเขา',
        button: 'เริ่มสร้างฟรี',
      },
    },
  },
  ms: {
    nav: {
      home: 'Laman Utama',
      tools: 'Alat',
      pricing: 'Harga',
      about: 'Tentang',
      signIn: 'Log Masuk',
      getStarted: 'Mulakan',
      dashboard: 'Papan Pemuka',
      billing: 'Pengebilan',
      settings: 'Tetapan',
      signOut: 'Log Keluar',
      credits: 'Kredit',
    },
    tools: {
      imageGeneration: 'Penjanaan Imej',
      videoGeneration: 'Penjanaan Video',
      contentWriting: 'Penulisan Kandungan',
      imageDesc: 'Cipta imej menakjubkan dari teks',
      videoDesc: 'Jana video dari penerangan',
      contentDesc: 'Penciptaan kandungan berkuasa AI',
    },
    home: {
      hero: {
        badge: 'Dikuasakan oleh Gemini AI',
        title: 'Cipta Kandungan Menakjubkan dengan',
        titleHighlight: 'AI Tools Hub',
        subtitle: 'Alat AI profesional untuk penjanaan imej, penciptaan video, dan penulisan kandungan. Bayar hanya untuk apa yang anda gunakan - tiada langganan diperlukan.',
        getStarted: 'Mulakan Percuma',
        viewPricing: 'Lihat Harga',
      },
      features: {
        title: 'Alat AI Berkuasa di Hujung Jari Anda',
        subtitle: 'Pilih dari suite alat AI profesional kami',
        imagePrice: '$0.50 setiap imej',
        videoPrice: '$2.00 setiap 30s',
        contentPrice: '$0.20 setiap 100 perkataan',
        tryNow: 'Cuba Sekarang',
      },
      benefits: {
        title: 'Mengapa Pilih AI Tools Hub?',
        items: [
          'Tiada langganan diperlukan - bayar mengikut penggunaan',
          'Model AI terkini',
          'Masa penjanaan yang pantas',
          'Hak penggunaan komersial',
          'Akses API tersedia',
          'Sokongan pelanggan 24/7',
        ],
      },
      whyChoose: {
        lightningFast: 'Pantas Seperti Kilat',
        lightningFastDesc: 'Jana kandungan dalam beberapa saat, bukan jam',
        securePrivate: 'Selamat & Peribadi',
        securePrivateDesc: 'Data anda disulitkan dan tidak dikongsi',
        globalAccess: 'Akses Global',
        globalAccessDesc: 'Tersedia di seluruh dunia, 24/7',
        latestAI: 'Model AI Terkini',
        latestAIDesc: 'Dikuasakan oleh teknologi terkini',
      },
      testimonials: {
        title: 'Disayangi oleh Pencipta di Seluruh Dunia',
        subtitle: 'Lihat apa yang pengguna kami katakan',
      },
      cta: {
        title: 'Bersedia untuk Bermula?',
        subtitle: 'Sertai beribu-ribu pencipta menggunakan AI Tools Hub untuk mengubah kandungan mereka',
        button: 'Mula Mencipta Secara Percuma',
      },
    },
  },
};
