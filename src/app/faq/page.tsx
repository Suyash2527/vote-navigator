"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How do I register to vote in India?",
  "What is EPIC and how to get Voter ID?",
  "What is NOTA and how to use it?",
  "How can I find my polling booth?",
];

export default function FAQPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! 🇮🇳 I'm your AI Civic Assistant for Indian elections. Ask me anything about voter registration (EPIC/Form 6), Lok Sabha or Vidhan Sabha elections, polling booths, NOTA, EVMs, or the Election Commission of India (ECI)." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      const reply = typeof data.reply === "string" ? data.reply : "Sorry, I received an unexpected response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pb-6 shrink-0"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-accent mb-4 border border-accent/20">
          <Sparkles className="w-4 h-4" /> Smart Civic Assistant
        </div>
        <h1 className="text-3xl font-black gradient-text">Ask Me Anything</h1>
        <p className="text-sm text-foreground/50 mt-1">About voting, registration, elections, and more.</p>
      </motion.div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-4 shrink-0"
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-sm px-4 py-2 rounded-full glass border border-border/40 text-foreground/70 hover:text-primary hover:border-primary/40 transition-all"
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-tr-sm"
                  : "glass border border-border/30 text-foreground/90 rounded-tl-sm"
              }`}
            >
              {String(msg.content || "").split("\n").map((line, li) => (
                <p key={li} className={li > 0 ? "mt-1" : ""}>{line}</p>
              ))}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="glass border border-border/30 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 mt-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about EPIC, voter registration, polling booths, NOTA, ECI…"
          className="input-field flex-1"
          disabled={loading}
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary px-5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </motion.button>
      </form>
    </div>
  );
}
