// 🛠️ Gemini 工具函数

import { ChatMessage } from './client';

/**
 * 将简单的文本消息转换为 Gemini ChatMessage 格式
 */
export function createUserMessage(text: string): ChatMessage {
  return {
    role: 'user',
    parts: [{ text }]
  };
}

/**
 * 将简单的对话历史转换为 Gemini 格式
 */
export function createChatHistory(
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): ChatMessage[] {
  return history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
}

/**
 * 估算文本的 Token 数量（简单估算）
 */
export function estimateTokens(text: string): number {
  // 简单估算：1 token ≈ 4 个字符
  return Math.ceil(text.length / 4);
}

/**
 * 将文件转换为 Base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      // 移除 data:image/xxx;base64, 前缀
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.readAsDataURL(file);
  });
}

/**
 * 验证图片文件
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

/**
 * 验证图片大小（最大 10MB）
 */
export function isValidImageSize(file: File): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
}
