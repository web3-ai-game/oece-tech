// 💎 OECE.tech 資產組合 - 資本家視角

export const ASSET_PORTFOLIO = {
  // Google 教育計劃
  googleEducation: {
    name: "Google Workspace for Education",
    tier: "Education Plus",
    benefits: [
      "Unlimited Google Drive storage",
      "Advanced security features",
      "Classroom integration",
      "Meet recording & attendance"
    ],
    value: { usd: 0, thb: 0, desc: "教育機構免費" },
    status: "active"
  },

  // Google 開發者計劃
  googleDeveloper: {
    name: "Google Cloud Platform",
    programs: [
      { name: "GCP Free Tier", value: 300, thb: 10500, desc: "$300 贈金（新用戶）" },
      { name: "Gemini API Credits", value: 1000, thb: 35000, desc: "$1000 產品贈金" },
      { name: "Firebase Blaze Plan", value: 0, thb: 0, desc: "按量計費（已配置）" },
      { name: "Cloud Run", value: 0, thb: 0, desc: "每月 200 萬請求免費" }
    ],
    totalValue: { usd: 1300, thb: 45500 }
  },

  // Google One AI Premium
  googleOneAI: {
    name: "Google One AI Premium",
    tier: "2 TB + Gemini Advanced",
    monthlyFee: { usd: 19.99, thb: 699.65 },
    benefits: [
      "Gemini Advanced access",
      "2 TB cloud storage",
      "Google Photos magic editor",
      "VPN included"
    ],
    status: "subscribed"
  },

  // GitHub 計劃
  github: {
    name: "GitHub Pro + Student Pack",
    programs: [
      { name: "GitHub Pro", value: 4, thb: 140, desc: "月費 $4（已訂閱）" },
      { name: "Student Developer Pack", value: 200000, thb: 7000000, desc: "價值 $200K+ 工具包" },
      { name: "Copilot", value: 10, thb: 350, desc: "月費 $10（學生免費）" },
      { name: "Actions", value: 0, thb: 0, desc: "3000 分鐘/月免費" }
    ],
    totalValue: { usd: 200014, thb: 7000490, desc: "主要是學生包價值" }
  },

  // API Keys 資產
  apiKeys: {
    gemini: {
      freeKeys: 28,
      paidKeys: 1,
      valuePerKey: 100,
      totalValue: { usd: 2900, thb: 101500 },
      desc: "28 免費 + 1 付費（$100 已充值）"
    },
    openRouter: {
      balance: 1111,
      thb: 38885,
      desc: "OpenRouter 餘額"
    },
    claude: {
      balance: 100,
      thb: 3500,
      desc: "Claude Kilo JWT（有效至 2030）"
    }
  },

  // 基礎設施資產
  infrastructure: {
    firebase: {
      projects: 2,
      hosting: "Unlimited",
      database: "Realtime DB",
      auth: "全棧登錄支持",
      value: { usd: 0, thb: 0, desc: "Blaze Plan 按量計費" }
    },
    supabase: {
      projects: 4,
      tier: "Pro",
      valuePerProject: 25,
      totalValue: { usd: 100, thb: 3500 }
    },
    mongodb: {
      tier: "M0 (Free)",
      storage: "512 MB",
      value: { usd: 0, thb: 0 }
    },
    vercel: {
      tier: "Hobby",
      deployments: "Unlimited",
      value: { usd: 0, thb: 0 }
    },
    cloudflare: {
      tier: "Free",
      bandwidth: "Unlimited",
      value: { usd: 0, thb: 0 }
    }
  },

  // 開發工具資產
  devTools: {
    windsurf: {
      tier: "Pro",
      monthlyFee: { usd: 10, thb: 350 },
      status: "下個月不續費"
    },
    cursor: {
      tier: "Pro",
      monthlyFee: { usd: 20, thb: 700 },
      status: "active"
    },
    copilot: {
      tier: "Individual",
      monthlyFee: { usd: 10, thb: 350 },
      status: "學生免費"
    }
  },

  // 總資產價值
  totalAssets: {
    liquidAssets: {
      usd: 5311,
      thb: 185885,
      desc: "可用現金 + API 餘額"
    },
    subscriptionValue: {
      usd: 200000,
      thb: 7000000,
      desc: "GitHub 學生包等訂閱價值"
    },
    grandTotal: {
      usd: 205311,
      thb: 7185885,
      desc: "總數字資產價值"
    }
  }
};

// 資產分類
export const ASSET_CATEGORIES = {
  "算力資源": {
    items: ["GCP $300", "Gemini $1000", "28 Gemini Keys"],
    value: 145500
  },
  "API 餘額": {
    items: ["OpenRouter $1,111", "Claude $100"],
    value: 42385
  },
  "訂閱服務": {
    items: ["GitHub Pro", "Google One AI", "Cursor Pro"],
    value: 1399.65
  },
  "基礎設施": {
    items: ["Firebase", "Supabase", "MongoDB", "Vercel", "Cloudflare"],
    value: 3500
  }
};

// 月度運營成本
export const MONTHLY_COSTS = {
  subscriptions: {
    googleOneAI: 699.65,
    githubPro: 140,
    cursorPro: 700,
    total: 1539.65
  },
  infrastructure: {
    firebase: 0, // 按量計費
    supabase: 0, // 免費層
    mongodb: 0, // 免費層
    total: 0
  },
  apis: {
    estimatedTokens: 50000,
    estimatedCost: 7.00, // ฿0.14/1K × 50K
    total: 7.00
  },
  grandTotal: 1546.65 // THB/month
};
