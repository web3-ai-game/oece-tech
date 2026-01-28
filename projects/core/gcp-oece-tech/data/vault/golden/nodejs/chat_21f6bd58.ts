/**
 * Mini Gemini Chat Configuration
 * 
 * This file contains configuration for the Mini Gemini chat feature.
 * You can customize the API endpoint and model settings here.
 */

export const chatConfig = {
  // API endpoint for chat requests
  // Default: '/api/chat/gemini' (uses built-in Gemini API)
  // Custom: You can change this to your own API endpoint
  apiEndpoint: process.env.NEXT_PUBLIC_CHAT_API_ENDPOINT || '/api/chat/gemini',
  
  // Model configuration
  model: {
    name: process.env.NEXT_PUBLIC_CHAT_MODEL || 'gemini-1.5-pro',
    temperature: parseFloat(process.env.NEXT_PUBLIC_CHAT_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.NEXT_PUBLIC_CHAT_MAX_TOKENS || '2048'),
  },
  
  // UI configuration
  ui: {
    // Default welcome message
    welcomeMessage: 'Mini Gemini Chat',
    welcomeSubtitle: 'How can I help you today?',
    
    // Placeholder text for input
    inputPlaceholder: 'Send a message...',
    
    // Footer disclaimer
    footerText: 'Mini Gemini can make mistakes. Check important info.',
  },
  
  // Feature flags
  features: {
    // Enable chat history management
    enableChatHistory: true,
    
    // Enable settings panel
    enableSettings: true,
    
    // Enable export chat feature (coming soon)
    enableExportChat: false,
  },
};

/**
 * Custom API Configuration Example:
 * 
 * If you want to use your own tuned Gemini model or custom API:
 * 
 * 1. Set environment variable in .env.local:
 *    NEXT_PUBLIC_CHAT_API_ENDPOINT=https://your-custom-api.com/chat
 * 
 * 2. Your API should accept POST requests with this format:
 *    {
 *      "messages": [
 *        { "role": "user", "content": "Hello" },
 *        { "role": "assistant", "content": "Hi there!" },
 *        { "role": "user", "content": "How are you?" }
 *      ]
 *    }
 * 
 * 3. Your API should return this format:
 *    {
 *      "message": "I'm doing great, thanks for asking!",
 *      "timestamp": "2024-01-01T00:00:00.000Z"
 *    }
 * 
 * Example .env.local configuration:
 * 
 * # Use custom API endpoint
 * NEXT_PUBLIC_CHAT_API_ENDPOINT=https://your-api.com/chat
 * 
 * # Use custom model settings
 * NEXT_PUBLIC_CHAT_MODEL=gemini-1.5-pro-tuned
 * NEXT_PUBLIC_CHAT_TEMPERATURE=0.8
 * NEXT_PUBLIC_CHAT_MAX_TOKENS=4096
 */

export default chatConfig;
