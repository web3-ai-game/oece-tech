"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { chat, type Message } from '@/lib/grok';

export function CompanionChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '嗨！我是你的 AI 伴侶 🤖 有什麼想聊的嗎？',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 調用 Grok API
      const response = await chat(
        [...messages, userMessage],
        'demo-user', // TODO: 使用真實用戶 ID
        { model: 'grok-4' }
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '抱歉，我遇到了一些問題。請稍後再試。',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Container */}
      <div className="rounded-2xl border border-[#00FF41]/20 bg-[#0D1117] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#00FF41]/10 bg-gradient-to-r from-[#00FF41]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00FF41]/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00FF41]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI 伴侶</h3>
              <p className="text-xs text-gray-400">由 Grok 4 驅動</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#00FF41]/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-[#00FF41]" />
                </div>
              )}
              
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[#00FF41]/10 text-white'
                    : 'bg-[#161B22] text-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#00FF41]/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#00FF41]" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#00FF41]/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#00FF41] animate-pulse" />
              </div>
              <div className="bg-[#161B22] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-[#00FF41]/10 bg-[#0D1117]">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="跟我聊聊天吧..."
              disabled={isLoading}
              className="flex-1 bg-[#161B22] border border-[#00FF41]/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF41]/40 transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-[#00FF41] text-black rounded-xl font-medium hover:bg-[#00FF41]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              發送
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 提示：按 Enter 發送，Shift+Enter 換行
          </p>
        </div>
      </div>
    </div>
  );
}
