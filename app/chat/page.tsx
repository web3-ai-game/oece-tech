"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, Paperclip, Mic, User, Bot, Brain, Sparkle } from "lucide-react";

const personas = [
  { id: "gemini-pro", name: "Gemini Pro", icon: Sparkles, color: "#4285F4", desc: "Multi-modal AI" },
  { id: "claude", name: "Claude 4", icon: Brain, color: "#D4A373", desc: "Deep reasoning" },
  { id: "gpt4", name: "GPT-4o", icon: Sparkle, color: "#10A37F", desc: "Creative writing" },
  { id: "cyber-sage", name: "賽博神佛", icon: Bot, color: "#8B5CF6", desc: "Mystical divination" },
];

export default function ChatPage() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string; persona: string }>>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: 調用對應人格的 API
    setMessages([...messages, { role: "user", content: message, persona: selectedPersona.id }]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex">
      {/* Sidebar - Persona Selector */}
      <aside className="w-64 border-r border-white/10 bg-white/5 p-4">
        <Link href="/" className="flex items-center gap-2 mb-6 px-2">
          <Sparkles className="h-5 w-5 text-[var(--primary)]" />
          <span className="font-semibold">OECE.tech</span>
        </Link>

        <div className="mb-4">
          <h3 className="text-xs font-mono text-gray-500 uppercase mb-3">Select Persona</h3>
          <div className="space-y-2">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedPersona.id === persona.id
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <persona.icon className="h-5 w-5" style={{ color: persona.color }} />
                  <span className="text-sm font-medium">{persona.name}</span>
                </div>
                <p className="text-xs text-gray-500 ml-8">{persona.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Token Usage */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xs text-gray-500 mb-2">Token Usage</div>
          <div className="text-lg font-bold text-white mb-1">12,450</div>
          <div className="text-xs text-gray-600">of 50,000</div>
          <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
            <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: "25%" }} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 space-y-2">
          <Link href="/profile" className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            Profile
          </Link>
          <Link href="/knowledge" className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            Knowledge Base
          </Link>
          <Link href="/pricing" className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            Pricing
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <selectedPersona.icon className="h-5 w-5" style={{ color: selectedPersona.color }} />
            <div>
              <h2 className="text-sm font-semibold">{selectedPersona.name}</h2>
              <p className="text-xs text-gray-500">{selectedPersona.desc}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Vector Memory: <span className="text-green-400">Active</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <selectedPersona.icon className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: selectedPersona.color }} />
                <p className="text-sm text-gray-500">Start a conversation with {selectedPersona.name}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-[var(--primary)]/20 border border-[var(--primary)]/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 p-2 rounded-2xl border border-white/20 bg-white/5 focus-within:border-[var(--primary)] transition-colors">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>
              
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Ask ${selectedPersona.name}...`}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Mic className="h-5 w-5 text-gray-500" />
              </button>
              
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  message.trim()
                    ? "bg-[var(--primary)] text-white hover:opacity-90"
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              {selectedPersona.name} · Vector Memory Active · ฿0.14/1K tokens
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
