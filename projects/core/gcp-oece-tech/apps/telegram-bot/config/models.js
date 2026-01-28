/**
 * 模型配置 - BongBong Bot
 * 基於實際可用性和成本優化
 * 
 * 成本策略:
 * - Gemini 50% (免費額度高)
 * - Grok 30% (便宜快速)  
 * - 集成 Key 20% (備用)
 * 
 * 排除的昂貴模型:
 * - grok-4-0709 ($3/$15)
 * - grok-3 ($3/$15)
 * - grok-2-vision-1212 ($2/$10)
 * - grok-2-1212 ($2/$10)
 * - grok-code-fast-1 (不寫代碼)
 */

export const AVAILABLE_MODELS = {
  // === Gemini 模型 (50% 使用率) ===
  gemini: {
    // 快速對話 - 免費額度最高
    flash: {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: '快速回應，日常對話',
      costPerMToken: 0,  // 免費額度內
      rateLimit: { rpm: 1000, tpm: 1000000, rpd: 10000 },
      capabilities: ['text', 'vision', 'audio'],
      icon: '⚡'
    },
    // 深度分析
    pro: {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: '複雜推理，深度分析',
      costPerMToken: 1.25,
      rateLimit: { rpm: 15, tpm: 1000000, rpd: 300 },
      capabilities: ['text', 'vision', 'reasoning'],
      icon: '🧠'
    },
    // 實驗性多模態
    flashExp: {
      id: 'gemini-2.0-flash-exp',
      name: 'Gemini 2.0 Flash Exp',
      description: '實驗功能，圖像生成',
      costPerMToken: 0,
      rateLimit: { rpm: 10, tpm: 250000, rpd: 500 },
      capabilities: ['text', 'vision', 'image-gen'],
      icon: '🎨'
    },
    // 超輕量
    lite: {
      id: 'gemini-2.5-flash-lite',
      name: 'Gemini 2.5 Flash Lite',
      description: '超輕量，摘要任務',
      costPerMToken: 0,
      rateLimit: { rpm: 4000, tpm: 4000000, rpd: 'unlimited' },
      capabilities: ['text'],
      icon: '💨'
    }
  },

  // === Grok 模型 (30% 使用率) ===
  grok: {
    // 最便宜的推理模型
    mini: {
      id: 'grok-3-mini',
      name: 'Grok 3 Mini',
      description: '經濟實惠，幽默風趣',
      costPerMToken: { input: 0.30, output: 0.50 },
      rateLimit: { rpm: 480 },
      capabilities: ['text', 'humor'],
      icon: '😎'
    },
    // 快速非推理
    fast: {
      id: 'grok-4-fast-non-reasoning',
      name: 'Grok 4 Fast',
      description: '快速回應，情緒價值',
      costPerMToken: { input: 0.20, output: 0.50 },
      rateLimit: { rpm: 480, tpm: 4000000 },
      capabilities: ['text', 'emotional'],
      icon: '🚀'
    },
    // 圖像生成
    image: {
      id: 'grok-2-image-1212',
      name: 'Grok Image',
      description: '搞笑圖片，模因生成',
      costPerImage: 0.07,
      rateLimit: { rpm: 300 },
      capabilities: ['image-gen', 'meme'],
      icon: '🖼️'
    }
  }
};

// 任務到模型的映射
export const TASK_MODEL_MAP = {
  // 日常對話
  casual: ['gemini.flash', 'grok.fast'],
  
  // 複雜推理 (人際關係、深度分析)
  reasoning: ['gemini.pro', 'gemini.flash'],
  
  // 情緒支持
  emotional: ['grok.fast', 'grok.mini'],
  
  // 養生醫學
  health: ['gemini.pro', 'gemini.flash'],
  
  // 幽默娛樂
  humor: ['grok.mini', 'grok.fast'],
  
  // 寫作擴展
  writing: ['gemini.pro', 'gemini.flash'],
  
  // 記憶摘要 (用最便宜的)
  summary: ['gemini.lite', 'grok.mini'],
  
  // 圖像生成
  imageRealistic: ['gemini.flashExp'],
  imageMeme: ['grok.image'],
  
  // 算命玄學
  fortune: ['gemini.pro', 'grok.mini']
};

// 排除的昂貴模型 (絕對不使用)
export const EXCLUDED_MODELS = [
  'grok-4-0709',      // $3/$15 太貴
  'grok-3',           // $3/$15 太貴
  'grok-2-vision-1212', // $2/$10
  'grok-2-1212',      // $2/$10
  'grok-code-fast-1', // 不寫代碼
  'grok-4-1-fast-reasoning' // 過度使用
];

// 視頻生成限制
export const VIDEO_LIMITS = {
  maxDuration: 8,     // 秒
  dailyLimit: 5,      // 每天5次
  model: 'veo-3.0-fast-generate'
};

export default {
  AVAILABLE_MODELS,
  TASK_MODEL_MAP,
  EXCLUDED_MODELS,
  VIDEO_LIMITS
};
