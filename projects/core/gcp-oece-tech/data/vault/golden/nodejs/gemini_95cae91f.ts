import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateText(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateContent(prompt: string, options?: Record<string, unknown>) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    ...options
  });
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export const geminiClient = {
  async chat(messages: Array<{ role: string; content: string }>) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Convert messages to Gemini format
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};

export default genAI;
