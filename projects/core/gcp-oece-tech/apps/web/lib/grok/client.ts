// 🔥 Grok (xAI) API 客戶端 - 主力 AI 服務

import { GROK_MODELS } from '../gemini/config';

export type GrokModelKey = keyof typeof GROK_MODELS;

export interface GrokChatOptions {
  model?: GrokModelKey;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface GrokResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const XAI_BASE_URL = process.env.XAI_BASE_URL || 'https://api.x.ai/v1';

/**
 * 調用 Grok API（非流式）
 */
export async function callGrok(options: GrokChatOptions): Promise<GrokResponse> {
  const {
    model = 'grok-fast',
    messages,
    temperature = 0.7,
    maxTokens = 2048
  } = options;

  const apiKey = process.env.XAI_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_XAI_API_KEY_HERE') {
    throw new Error('XAI_API_KEY not configured');
  }

  const modelConfig = GROK_MODELS[model];
  
  const response = await fetch(`${XAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelConfig.apiName,
      messages,
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Grok API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();

  return {
    text: data.choices?.[0]?.message?.content || '',
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens || 0,
      completionTokens: data.usage.completion_tokens || 0,
      totalTokens: data.usage.total_tokens || 0
    } : undefined
  };
}

/**
 * 調用 Grok API（流式）
 */
export async function callGrokStream(options: GrokChatOptions): Promise<ReadableStream<Uint8Array>> {
  const {
    model = 'grok-fast',
    messages,
    temperature = 0.7,
    maxTokens = 2048
  } = options;

  const apiKey = process.env.XAI_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_XAI_API_KEY_HERE') {
    throw new Error('XAI_API_KEY not configured');
  }

  const modelConfig = GROK_MODELS[model];

  const response = await fetch(`${XAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelConfig.apiName,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Grok API error: ${error.error?.message || response.statusText}`);
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  return response.body;
}

/**
 * 檢查 Grok API 是否可用
 */
export function isGrokAvailable(): boolean {
  const apiKey = process.env.XAI_API_KEY;
  return !!apiKey && apiKey !== 'YOUR_XAI_API_KEY_HERE';
}
