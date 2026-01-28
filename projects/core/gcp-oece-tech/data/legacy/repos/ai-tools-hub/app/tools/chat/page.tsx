'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import {
  Send,
  Sparkles,
  BookOpen,
  FileText,
  Lightbulb,
  Users,
  MessageSquare,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [usageCost, setUsageCost] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 使用限制：10美金
  const MAX_COST = 10.0;
  const COST_PER_REQUEST = 0.01; // 估算每次请求0.01美金

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    {
      icon: FileText,
      title: '生成教案',
      titleEn: 'Create Lesson Plan',
      prompt: '帮我生成一个关于"Python基础编程"的90分钟教案，包括学习目标、教学步骤、课堂活动和作业布置。',
    },
    {
      icon: BookOpen,
      title: '设计测验',
      titleEn: 'Design Quiz',
      prompt: '为"世界历史-第二次世界大战"创建一套包含10道选择题和3道简答题的测验，附带参考答案。',
    },
    {
      icon: Lightbulb,
      title: '教学建议',
      titleEn: 'Teaching Tips',
      prompt: '我有一些学生在理解"牛顿第二定律"时遇到困难，请给我一些创新的教学方法和实例。',
    },
    {
      icon: Users,
      title: '课堂活动',
      titleEn: 'Class Activity',
      prompt: '设计一个互动性强的课堂活动，帮助学生更好地理解"英语语法-现在完成时"。',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 检查使用限制
    if (usageCost >= MAX_COST) {
      alert('已达到使用限制（$10），请联系管理员。');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('API请求失败');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // 更新使用统计
      setUsageCount((prev) => prev + 1);
      setUsageCost((prev) => prev + COST_PER_REQUEST);
      
      // 保存到localStorage
      localStorage.setItem('chatUsageCount', String(usageCount + 1));
      localStorage.setItem('chatUsageCost', String(usageCost + COST_PER_REQUEST));
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，发生了错误。请稍后重试。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const clearChat = () => {
    if (confirm('确定要清空对话历史吗？')) {
      setMessages([]);
    }
  };

  // 从localStorage加载使用统计
  useEffect(() => {
    const savedCount = localStorage.getItem('chatUsageCount');
    const savedCost = localStorage.getItem('chatUsageCost');
    if (savedCount) setUsageCount(Number(savedCount));
    if (savedCost) setUsageCost(Number(savedCost));
  }, []);

  const usagePercentage = (usageCost / MAX_COST) * 100;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              AI教学助手 AI Teaching Assistant
            </Badge>
            <h1 className="mb-2 text-3xl font-bold">智能教学助手</h1>
            <p className="text-muted-foreground">
              由 Google Gemini AI 驱动，专为教育工作者设计
            </p>
          </div>

          {/* Usage Stats */}
          <Card className="mb-6 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">使用次数</p>
                  <p className="text-2xl font-bold">{usageCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">累计成本</p>
                  <p className="text-2xl font-bold">${usageCost.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex-1 max-w-md ml-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">使用进度</span>
                  <span className="text-sm font-medium">{usagePercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      usagePercentage >= 80 ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  限额: ${MAX_COST.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick Prompts */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="mb-4 font-semibold">快速开始</h3>
                <div className="space-y-3">
                  {quickPrompts.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.title}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => handleQuickPrompt(item.prompt)}
                      >
                        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.titleEn}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">使用提示</p>
                      <ul className="text-blue-700 space-y-1 text-xs">
                        <li>• 描述越详细，答案越精准</li>
                        <li>• 可以要求特定格式输出</li>
                        <li>• 支持多轮对话优化</li>
                        <li>• 最大使用限额：$10</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="flex flex-col h-[600px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">开始对话</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                          向AI教学助手提问，获取教案、测验、教学建议等帮助。
                          或选择左侧的快速开始模板。
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {message.role === 'assistant' && (
                                <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                <p
                                  className={`mt-1 text-xs ${
                                    message.role === 'user'
                                      ? 'text-primary-foreground/70'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString('zh-CN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  {messages.length > 0 && (
                    <div className="mb-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className="text-muted-foreground"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        清空对话
                      </Button>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="输入您的问题... (Shift + Enter 换行)"
                      className="flex-1 resize-none rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      disabled={isLoading || usageCost >= MAX_COST}
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isLoading || usageCost >= MAX_COST}
                      size="lg"
                      className="px-6"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </form>
                  {usageCost >= MAX_COST && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      已达到使用限额，请联系管理员升级账户。
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 text-center">
              <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <h4 className="font-semibold mb-1">专业教学</h4>
              <p className="text-xs text-muted-foreground">
                基于教育学原理的AI建议
              </p>
            </Card>
            <Card className="p-4 text-center">
              <CheckCircle className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <h4 className="font-semibold mb-1">多语言支持</h4>
              <p className="text-xs text-muted-foreground">
                支持中英文等多种语言
              </p>
            </Card>
            <Card className="p-4 text-center">
              <CheckCircle className="mx-auto mb-2 h-8 w-8 text-purple-600" />
              <h4 className="font-semibold mb-1">即时响应</h4>
              <p className="text-xs text-muted-foreground">
                秒级生成教学内容
              </p>
            </Card>
            <Card className="p-4 text-center">
              <CheckCircle className="mx-auto mb-2 h-8 w-8 text-orange-600" />
              <h4 className="font-semibold mb-1">成本控制</h4>
              <p className="text-xs text-muted-foreground">
                透明的使用量追踪
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
