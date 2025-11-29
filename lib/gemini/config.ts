// 🤖 Gemini API 配置和模型定义

export const GEMINI_MODELS = {
  'gemini-lite': {
    apiName: 'gemini-2.5-flash-lite',
    displayName: 'Gemini Lite',
    rateLimit: { rpm: Infinity, rpd: Infinity },
    costPer1K: 0, // 免费
    description: '无限使用，展示用'
  },
  'gemini-flash': {
    apiName: 'gemini-2.5-flash',
    displayName: 'Gemini Pro', // 改名
    rateLimit: { rpm: 5, rpd: 100 },
    costPer1K: 0.14, // THB
    description: 'IP限流：5次/分钟'
  },
  'gemini-pro': {
    apiName: 'gemini-2.5-pro',
    displayName: '赛博神佛',
    rateLimit: { rpm: 5, rpd: 50 },
    costPer1K: 7.00, // THB
    description: '最强模型，算命专用'
  }
} as const;

export type GeminiModelKey = keyof typeof GEMINI_MODELS;

// Gemini API Keys 池（20个）
export function getGeminiKeys(): string[] {
  const keys: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`];
    if (key) {
      keys.push(key);
    }
  }

  return keys;
}

// API 端点
export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export function getGeminiEndpoint(model: GeminiModelKey, streaming: boolean = false): string {
  const apiModel = GEMINI_MODELS[model].apiName;
  const method = streaming ? 'streamGenerateContent' : 'generateContent';
  return `${GEMINI_API_BASE}/models/${apiModel}:${method}`;
}
