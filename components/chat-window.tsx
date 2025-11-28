"use client";

import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatWindow() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Chat Messages */}
      <div className="mb-4 space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-[var(--foreground)]/50">
            <p className="text-sm">Start a conversation with Gemini AI</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "p-4 rounded-2xl",
                msg.role === "user"
                  ? "bg-[var(--primary)]/10 ml-auto max-w-[80%]"
                  : "bg-[var(--foreground)]/5 mr-auto max-w-[80%]"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))
        )}
        {isLoading && (
          <div className="bg-[var(--foreground)]/5 p-4 rounded-2xl mr-auto max-w-[80%]">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="relative">
        <div className="flex items-center gap-2 p-2 rounded-2xl border border-[var(--foreground)]/20 bg-[var(--background)] focus-within:border-[var(--primary)] transition-colors">
          <button className="p-2 hover:bg-[var(--foreground)]/5 rounded-lg transition-colors">
            <Paperclip className="h-5 w-5 text-[var(--foreground)]/50" />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--foreground)]/50"
          />
          
          <button className="p-2 hover:bg-[var(--foreground)]/5 rounded-lg transition-colors">
            <Mic className="h-5 w-5 text-[var(--foreground)]/50" />
          </button>
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={cn(
              "p-2 rounded-lg transition-colors",
              message.trim() && !isLoading
                ? "bg-[var(--primary)] text-white hover:opacity-90"
                : "bg-[var(--foreground)]/10 text-[var(--foreground)]/30 cursor-not-allowed"
            )}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {/* Rate Limit Indicator */}
        <div className="mt-2 text-xs text-[var(--foreground)]/50 text-center">
          Gemini Lite • Unlimited • 5/5 requests remaining
        </div>
      </div>
    </div>
  );
}
