// 🤖 AI 模型配置（Grok + Gemini + OpenRouter）

// ========== Grok (xAI) - 主力，無限制 ==========
export const GROK_MODELS = {
  'grok-fast': {
    apiName: 'grok-4-1-fast-non-reasoning',
    displayName: 'Grok Fast',
    rateLimit: { rpm: 480, tpm: 4000000 },
    costPer1M: { input: 0.20, output: 0.50 },
    context: 2000000,
    description: '🔥 推薦：日常對話，無限制'
  },
  'grok-reasoning': {
    apiName: 'grok-4-1-fast-reasoning',
    displayName: 'Grok Reasoning',
    rateLimit: { rpm: 480, tpm: 4000000 },
    costPer1M: { input: 0.20, output: 0.50 },
    context: 2000000,
    description: '🔥 推薦：複雜推理，算命專用'
  },
  'grok-code': {
    apiName: 'grok-code-fast-1',
    displayName: 'Grok Code',
    rateLimit: { rpm: 480, tpm: 2000000 },
    costPer1M: { input: 0.20, output: 1.50 },
    context: 256000,
    description: '代碼生成專用'
  },
  'grok-mini': {
    apiName: 'grok-3-mini',
    displayName: 'Grok Mini',
    rateLimit: { rpm: 480 },
    costPer1M: { input: 0.30, output: 0.50 },
    context: 131072,
    description: '輕量任務'
  }
} as const;

// ========== Gemini (Google) - 免費層，有限流 ==========
export const GEMINI_MODELS = {
  'gemini-lite': {
    apiName: 'gemini-2.5-flash-lite',
    displayName: 'Gemini Lite',
    rateLimit: { rpm: 20, rpd: Infinity },
    costPer1K: 0,
    description: '免費，20次/分鐘'
  },
  'gemini-flash': {
    apiName: 'gemini-2.5-flash',
    displayName: 'Gemini Flash',
    rateLimit: { rpm: 5, rpd: 100 },
    costPer1K: 0.14,
    description: '備用，5次/分鐘'
  },
  'gemini-pro': {
    apiName: 'gemini-2.5-pro',
    displayName: 'Gemini Pro',
    rateLimit: { rpm: 5, rpd: 50 },
    costPer1K: 7.00,
    description: '備用，複雜任務'
  }
} as const;

// ========== OpenRouter - 備用，$3 限額 ==========
export const OPENROUTER_MODELS = {
  'openrouter-free': {
    apiName: 'google/gemini-2.0-flash-exp:free',
    displayName: 'OpenRouter Free',
    costPer1K: 0,
    description: '免費備用'
  },
  'openrouter-llama': {
    apiName: 'meta-llama/llama-3.3-70b-instruct',
    displayName: 'Llama 3.3',
    costPer1K: 0.5,
    description: '低價備用'
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
