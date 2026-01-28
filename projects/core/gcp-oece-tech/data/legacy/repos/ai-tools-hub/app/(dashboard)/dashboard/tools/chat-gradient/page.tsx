'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Loader2,
  Zap,
  Code,
  Lightbulb,
  BookOpen,
  Palette,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatGradientPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Gemini API
      const response = await fetch('/api/chat/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const capabilities = [
    {
      icon: Code,
      title: 'Code Generation',
      description: 'Write, debug, and explain code',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Lightbulb,
      title: 'Creative Ideas',
      description: 'Brainstorm and innovate',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: BookOpen,
      title: 'Learning',
      description: 'Explain complex topics simply',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Palette,
      title: 'Content Creation',
      description: 'Write articles, stories, and more',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Problem Solving',
      description: 'Analyze and find solutions',
      gradient: 'from-red-500 to-rose-500',
    },
    {
      icon: Music,
      title: 'Creative Writing',
      description: 'Poems, lyrics, and scripts',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  const quickPrompts = [
    'Help me write a professional email',
    'Explain machine learning basics',
    'Write a Python function to sort a list',
    'Give me ideas for a blog post',
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full space-y-8"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 shadow-2xl shadow-purple-500/50"
                >
                  <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                    Mini Gemini
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    Your AI-powered creative assistant
                  </p>
                </motion.div>
              </div>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {capabilities.map((capability, index) => {
                  const Icon = capability.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                      <div className="relative space-y-3">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${capability.gradient}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm mb-1">
                            {capability.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {capability.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Prompts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full max-w-2xl space-y-3"
              >
                <p className="text-sm text-muted-foreground text-center">
                  Try these prompts to get started:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(prompt)}
                      className="rounded-full hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:border-purple-500/50"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-purple-500/50"
                    >
                      <Bot className="h-5 w-5 text-white" />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className={`max-w-[75%] relative group ${
                      message.role === 'user' ? 'order-1' : ''
                    }`}
                  >
                    {message.role === 'user' ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-sm opacity-50"></div>
                        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl px-5 py-3 shadow-lg">
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-card border border-border rounded-2xl px-5 py-3 shadow-md hover:shadow-lg transition-shadow">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {message.role === 'user' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50"
                    >
                      <User className="h-5 w-5 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-5 py-3 shadow-md">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="pb-6 pt-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative max-w-3xl mx-auto"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-3xl blur-xl opacity-20"></div>
            
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative bg-card border-2 border-border rounded-3xl overflow-hidden shadow-2xl hover:border-primary/50 transition-colors">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="min-h-[70px] max-h-[200px] resize-none border-0 focus-visible:ring-0 px-6 py-4 pr-16 text-base"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 bottom-2 h-12 w-12 p-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <Send className="h-5 w-5 text-white" />
                  )}
                </Button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-3">
              Powered by Gemini AI • Mini Gemini can make mistakes. Verify important information.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Add custom animations to globals.css */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
