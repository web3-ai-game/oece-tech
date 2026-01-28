// Grok API Integration for AI Companion
// Architecture: User → OECE.tech PWA → Grok API Proxy → xAI Grok 4

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokChatOptions {
  model?: 'grok-4' | 'grok-3.5' | 'grok-2';
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export async function chat(
  messages: Message[],
  userId: string,
  options: GrokChatOptions = {}
) {
  const {
    model = 'grok-4',
    temperature = 0.7,
    max_tokens = 4000,
    stream = false,
  } = options;

  try {
    // 調用內部 API 路由（避免暴露 API key）
    const response = await fetch('/api/companion/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        userId,
        model,
        temperature,
        max_tokens,
        stream,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Grok chat error:', error);
    throw error;
  }
}

export async function getConversationHistory(userId: string, limit = 10) {
  try {
    const response = await fetch(`/api/companion/history?userId=${userId}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversation history');
    }

    return await response.json();
  } catch (error) {
    console.error('Get conversation history error:', error);
    return [];
  }
}

export async function saveMessage(userId: string, message: Message) {
  try {
    await fetch('/api/companion/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        message,
      }),
    });
  } catch (error) {
    console.error('Save message error:', error);
  }
}
