import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ';
const genAI = new GoogleGenerativeAI(apiKey);

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set');
}

// 三种模型配置
export const geminiLite = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
  }
});

export const geminiFlash = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.9,
    maxOutputTokens: 4096,
  }
});

export const geminiPro = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-thinking-exp-01-21',
  generationConfig: {
    temperature: 1.0,
    maxOutputTokens: 8192,
  }
});

/**
 * 根据模式选择模型
 */
export function getModelByMode(mode: 'quick' | 'standard' | 'detailed') {
  switch (mode) {
    case 'quick':
      return geminiLite;
    case 'detailed':
      return geminiPro;
    default:
      return geminiFlash;
  }
}
