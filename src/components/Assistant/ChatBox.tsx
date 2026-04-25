"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Terminal, Trash2, Globe, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" }
];

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Neural link established. I am Electra. How can I assist with your electoral mission today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: "assistant",
      content: "Memory wipe complete. Ready for new input.",
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          language: (() => {
            const lang = LANGUAGES.find(l => l.code === selectedLang);
            if (!lang) return "English";
            // Extract English name from format like "हिन्दी (Hindi)" → "Hindi"
            const match = lang.name.match(/\((\w+)\)/);
            return match ? match[1] : lang.name;
          })()
        }),
      });

      if (!response.ok) {
        // Non-streaming error response (rate limit, validation, etc.)
        const data = await response.json().catch(() => null);
        throw new Error(data?.content || `Server error (${response.status})`);
      }

      // Add an empty assistant message that we'll stream into
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream unavailable");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const currentText = accumulated;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: currentText } : msg
          )
        );
      }

      // Final decode flush
      accumulated += decoder.decode();
      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: "Neural Interface yielded no data." } : msg
          )
        );
      }
    } catch (err: unknown) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        // If we already added an empty assistant message, update it with the error
        const hasAssistant = prev.some((m) => m.id === assistantId);
        if (hasAssistant) {
          return prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: "Neural link unstable. Error: " + (err instanceof Error ? err.message : String(err)) }
              : msg
          );
        }
        return [
          ...prev,
          {
            id: assistantId,
            role: "assistant" as const,
            content: "Neural link unstable. Error: " + (err instanceof Error ? err.message : String(err)),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-950/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl relative">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-saffron/10 rounded-lg flex items-center justify-center border border-saffron/20">
            <Terminal size={18} className="text-saffron" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Neural Interface v3</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span className="text-[8px] text-emerald font-bold uppercase tracking-widest">Active Link</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <Globe size={14} className="text-saffron" />
            <select 
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent text-[10px] font-bold text-white uppercase outline-none cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="bg-slate-900">{l.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 hover:bg-red-500/10 text-white/40 hover:text-red-500 transition-all rounded-lg"
            title="Clear Memory"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-80">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 shadow-lg",
                msg.role === "user" ? "bg-white/5 border-white/10" : "bg-saffron/10 border-saffron/20"
              )}>
                {msg.role === "user" ? <User size={18} className="text-white" /> : <Bot size={18} className="text-saffron" />}
              </div>
              <div className="space-y-1">
                <div className={cn(
                  "p-5 border shadow-2xl relative group",
                  msg.role === "user" 
                    ? "bg-white/5 border-white/10 text-white rounded-2xl rounded-tr-none" 
                    : "bg-slate-900/90 border-saffron/20 text-white/90 rounded-2xl rounded-tl-none"
                )}>
                  {msg.role === "assistant" && (
                    <div className="absolute -top-2 -right-2 bg-saffron text-black p-1 rounded font-black text-[7px] opacity-0 group-hover:opacity-100 transition-opacity">
                      AI RESPONSE
                    </div>
                  )}
                  <div className="prose prose-sm prose-invert max-w-none font-sans text-sm leading-relaxed tracking-wide">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest px-1">
                  {msg.role === "user" ? "Transmitted" : "Received"} {`//`} 0x{msg.id.slice(-4)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
              <Sparkles size={18} className="text-saffron animate-spin-slow" />
            </div>
            <div className="bg-white/5 border border-white/10 h-12 w-32 rounded-2xl rounded-tl-none" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10 bg-white/5">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="ENTER_QUERY_COMMAND..."
            className="w-full bg-slate-950/50 border border-white/10 p-5 rounded-2xl text-sm focus:border-saffron outline-none transition-all pr-16 text-white placeholder:text-white/20 font-mono tracking-wider group-hover:border-white/20"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-saffron text-black rounded-xl hover:bg-white transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(255,153,51,0.3)]"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
