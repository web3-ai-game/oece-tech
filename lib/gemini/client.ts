// 🤖 Gemini API 客户端

import keyRotation from './key-rotation';
import { getGeminiEndpoint, GeminiModelKey } from './config';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiChatOptions {
  model: GeminiModelKey;
  messages: ChatMessage[];
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * 调用 Gemini API（非流式）
 */
export async function callGemini(
  options: GeminiChatOptions
): Promise<GeminiResponse> {
  const { model, messages, systemInstruction, temperature = 0.7, maxTokens = 2048 } = options;

  // 获取 API Key（轮换）
  const apiKey = keyRotation.getNextKey();
  const endpoint = getGeminiEndpoint(model, false);

  // 构建请求体
  const requestBody: any = {
    contents: messages,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      topP: 0.95,
      topK: 40
    }
  };

  // 添加系统指令（如果有）
  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  // 发送请求
  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();

  // 解析响应
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const usage = data.usageMetadata
    ? {
        promptTokens: data.usageMetadata.promptTokenCount || 0,
        completionTokens: data.usageMetadata.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata.totalTokenCount || 0
      }
    : undefined;

  return { text, usage };
}

/**
 * 调用 Gemini API（流式）- 返回 ReadableStream
 */
export async function callGeminiStream(
  options: GeminiChatOptions
): Promise<ReadableStream<Uint8Array>> {
  const { model, messages, systemInstruction, temperature = 0.7, maxTokens = 2048 } = options;

  // 获取 API Key
  const apiKey = keyRotation.getNextKey();
  const endpoint = getGeminiEndpoint(model, true);

  // 构建请求体
  const requestBody: any = {
    contents: messages,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      topP: 0.95,
      topK: 40
    }
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  // 发送请求
  const response = await fetch(`${endpoint}?key=${apiKey}&alt=sse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  return response.body;
}

/**
 * 多模态输入（文本 + 图片）
 */
export async function callGeminiMultimodal(
  model: GeminiModelKey,
  textPrompt: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<GeminiResponse> {
  const messages: ChatMessage[] = [
    {
      role: 'user',
      parts: [
        { text: textPrompt },
        {
          inline_data: {
            mime_type: mimeType,
            data: imageBase64
          }
        } as any
      ]
    }
  ];

  return callGemini({ model, messages });
}
