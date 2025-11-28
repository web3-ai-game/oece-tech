// 🎯 泰銖資源陣列池 - 極致價格發揮

export const PRICING_POOL = {
  // Google 開發者計劃資源
  googleCredits: {
    gcp: { amount: 300, currency: "USD", thb: 10500, desc: "GCP $300 贈金" },
    gemini: { amount: 1000, currency: "USD", thb: 35000, desc: "Gemini 產品贈金" },
    firebase: { amount: 0, currency: "USD", thb: 0, desc: "Firebase Blaze Plan（按量計費）" }
  },

  // API Keys 價值池（28 個 Gemini Keys）
  geminiKeys: {
    freeKeys: 28,
    valuePerKey: 100, // USD
    totalValue: 2800, // USD
    thbValue: 98000, // THB
    desc: "28 個免費 Gemini Keys，每個價值 $100"
  },

  // 付費 API 餘額
  paidAPIs: {
    openRouter: { balance: 1111, currency: "USD", thb: 38885, desc: "OpenRouter 餘額" },
    claudeKilo: { balance: 100, currency: "USD", thb: 3500, desc: "Claude Kilo JWT（有效至 2030）" }
  },

  // 基礎設施價值
  infrastructure: {
    supabase: { projects: 4, valuePerProject: 25, totalThb: 3500, desc: "4 個 Supabase 項目" },
    mongodb: { tier: "M0", valuePerMonth: 0, thb: 0, desc: "MongoDB Atlas 免費層" },
    algolia: { requests: 10000, valuePerMonth: 0, thb: 0, desc: "Algolia 10K 請求/月" },
    upstash: { tier: "Free", valuePerMonth: 0, thb: 0, desc: "Upstash Redis 免費層" }
  },

  // 總資源價值
  totalAssets: {
    usd: 5311, // $300 + $1000 + $2800 + $1111 + $100
    thb: 185885, // 35 THB/USD
    desc: "總數字資產價值"
  }
};

// 服務定價（泰銖本位）
export const SERVICE_PRICING = {
  // AI 模型調用
  models: {
    "gemini-lite": { 
      baseCost: 0, 
      markup: 2, 
      final: 0, 
      unit: "1K tokens",
      desc: "Gemini 2.5 Flash Lite - 完全免費"
    },
    "gemini-flash": { 
      baseCost: 0.07, 
      markup: 2, 
      final: 0.14, 
      unit: "1K tokens",
      desc: "Gemini 2.5 Flash"
    },
    "gemini-pro": { 
      baseCost: 0.14, 
      markup: 2, 
      final: 0.28, 
      unit: "1K tokens",
      desc: "Gemini 2.5 Pro"
    },
    "claude-sonnet": { 
      baseCost: 0.56, 
      markup: 2, 
      final: 1.12, 
      unit: "1K tokens",
      desc: "Claude 4 Sonnet"
    },
    "gpt4o": { 
      baseCost: 1.40, 
      markup: 2, 
      final: 2.80, 
      unit: "1K tokens",
      desc: "GPT-4o"
    },
    "cyber-sage": { 
      baseCost: 3.50, 
      markup: 2, 
      final: 7.00, 
      unit: "1K tokens",
      desc: "賽博神佛（最貴，最準）"
    }
  },

  // 向量記憶
  vectorMemory: {
    storage: { baseCost: 0.05, markup: 2, final: 0.10, unit: "1K tokens" },
    search: { baseCost: 0.03, markup: 2, final: 0.06, unit: "query" },
    retrieval: { baseCost: 0.01, markup: 2, final: 0.02, unit: "result" }
  },

  // 特殊服務
  premium: {
    divination: { 
      tarot: 7.00, 
      astrology: 5.00, 
      iching: 7.00, 
      dream: 3.00, 
      love: 10.00,
      unit: "reading"
    },
    imageGen: { cost: 2.00, unit: "image" },
    videoSummary: { cost: 5.00, unit: "video" },
    voiceClone: { cost: 10.00, unit: "minute" }
  }
};

// 成本計算公式
export function calculateCost(
  tokens: number, 
  model: keyof typeof SERVICE_PRICING.models,
  useVectorMemory: boolean = false
): number {
  const modelCost = (tokens / 1000) * SERVICE_PRICING.models[model].final;
  const vectorCost = useVectorMemory 
    ? (tokens / 1000) * SERVICE_PRICING.vectorMemory.storage.final 
    : 0;
  
  return modelCost + vectorCost;
}

// 格式化泰銖
export function formatTHB(amount: number): string {
  return `฿${amount.toFixed(2)}`;
}
