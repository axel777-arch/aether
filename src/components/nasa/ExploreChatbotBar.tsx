"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Send, ArrowRight, X, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

interface ExploreChatbotBarProps {
  onExploreClick?: () => void;
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const KB: { match: string[]; reply: string }[] = [
  {
    match: ["borena", "borana"],
    reply:
      "Borena is the prototype's focus area. The map shows administrative boundaries only; this app does not provide verified current drought conditions for Borena. See /datasets for data coverage and integration status.",
  },
  {
    match: ["soil", "moisture", "fldas", "noah"],
    reply:
      "Soil moisture is an important drought indicator, but FLDAS is not an active live feed in this app. The /data page includes historical MERRA-2 spatial summaries averaged over 2000–2025; those are not monthly observations or a current anomaly.",
  },
  {
    match: ["rain", "rainfall", "precipitation", "gpm", "imerg"],
    reply:
      "The predictor displays a historical GPM-based result for June 2025. It is not a current forecast or a zone-level rainfall observation. Check /datasets for source coverage and /predict for the prototype output.",
  },
  {
    match: ["ndvi", "vegetation", "veg", "plant", "modis", "canopy"],
    reply:
      "NDVI can indicate vegetation greenness, but this prototype does not provide a verified, current MODIS time series or zone-level vegetation anomaly. See /datasets for the status of each source.",
  },
  {
    match: ["afar", "northern"],
    reply:
      "Afar is included in the geographic context, but the prototype has no verified live three-indicator assessment or current severity ranking for the region. Please do not interpret the map markers as observations.",
  },
  {
    match: ["somali", "fafan", "ogaden"],
    reply:
      "The map provides geographic context for Somali Region, not a current drought classification. This app does not have verified zone-level rainfall, soil moisture, and vegetation observations to support a severity statement.",
  },
  {
    match: ["tigray", "highland"],
    reply:
      "Tigray is shown as part of the administrative geography. No verified current drought status or woreda-level environmental monitoring is provided by this prototype.",
  },
  {
    match: ["severe", "critical", "worst", "emergency", "alert"],
    reply:
      "This prototype does not publish verified live drought alerts or rank regions by current severity. Visit /alerts to review the available alert-system interface; do not treat it as an active monitoring feed.",
  },
  {
    match: ["satellite", "sensor", "data", "source", "nasa"],
    reply:
      "The dataset registry separates integrated products from research references and planned sources. This prototype does not fuse live GPM, FLDAS, and MODIS observations. Visit /datasets to review each source's documented status and coverage.",
  },
  {
    match: ["mann-kendall", "trend", "statistics", "sen", "slope"],
    reply:
      "Mann–Kendall is a non-parametric test for monotonic trends, and Sen's slope estimates a trend magnitude from pairwise slopes. This general method description is not a claim that a verified NDVI trend has been calculated for Borena. See /methodology for the prototype's documented methods.",
  },
  {
    match: ["why", "enough", "alone", "just rainfall"],
    reply:
      "Rainfall alone cannot describe every drought impact: soil moisture and vegetation can respond differently and on different timescales. Aether is designed to investigate those relationships, but this prototype does not yet provide a verified live three-indicator time series.",
  },
  {
    match: ["methodology", "how", "calculated", "method", "algorithm"],
    reply:
      "The methodology page describes the scientific approach and its limitations. The app's current datasets are not a complete, live three-indicator analysis, so do not interpret planned methods as completed measurements.",
  },
  {
    match: ["lab", "investigation", "workbench", "experiment", "simulator", "synthetic", "custom data"],
    reply:
      "The /lab page is an exploratory prototype. Treat sample or synthetic outputs as demonstrations, not measured environmental conditions, unless the page explicitly identifies a verified data source.",
  },
  {
    match: ["help", "what can", "commands", "options", "ask"],
    reply:
      "I can explain administrative boundaries, the documented dataset registry, the historical rainfall prototype, and general drought-analysis methods. I cannot verify current drought severity or live environmental conditions.",
  },
];

function getReply(text: string): string {
  const lower = text.toLowerCase();
  for (const entry of KB) {
    if (entry.match.some((kw) => lower.includes(kw))) {
      return entry.reply;
    }
  }
  return "I can explain the map, dataset registry, historical rainfall prototype, or general drought methods. I do not have live environmental observations; type “help” for topics.";
}

const QUICK_CHIPS = [
  "What is the Investigation Lab?",
  "Why is Borena so critical?",
  "What does soil moisture mean?",
  "Is there a live drought ranking?",
  "Why isn't rainfall enough?",
  "How is data calculated?",
];

export const ExploreChatbotBar: React.FC<ExploreChatbotBarProps> = ({
  onExploreClick,
}) => {
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Welcome. I'm a prototype guide to the map and documented datasets, not a live drought-monitoring system. Ask about data coverage, boundaries, or general analysis methods.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (userText?: string) => {
    const textToSend = userText ?? query;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    setQuery("");
    setChatOpen(true);
    setIsTyping(true);

    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const reply = getReply(textToSend);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    }, delay);
  };
  // Render **bold** markdown inline
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="text-accent-cyan font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl mx-auto z-20 pointer-events-auto">
      {/* EXPLORE Pill */}
      <Link
        href="/explore"
        className="nasa-glowing-pill cursor-pointer group hover:scale-105 transition-all"
      >
        <div className="nasa-glowing-pill-inner flex items-center gap-2">
          <span>EXPLORE</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent-cyan group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* Chat Container */}
      <div className="w-full relative">
        {/* Chat drawer */}
        {chatOpen && (
          <div className="absolute bottom-16 left-0 right-0 rounded-3xl bg-[#0b1424]/97 backdrop-blur-2xl border border-accent-cyan/30 shadow-[0_0_60px_rgba(40,215,197,0.12)] z-50 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(168,191,220,0.12)]">
              <span className="text-accent-cyan flex items-center gap-1.5 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                PROTOTYPE GUIDE · NOT LIVE ANALYSIS
              </span>
              <button
                onClick={() => setChatOpen(false)}
                className="text-[#999CA0] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-1">
              {QUICK_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 rounded-full bg-[#162036] hover:bg-accent-blue/40 border border-[rgba(168,191,220,0.18)] text-[10px] text-[#A8BFDC] hover:text-white transition-all font-mono whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages scroll area */}
            <div className="flex-1 max-h-56 overflow-y-auto px-4 py-3 space-y-2.5 text-xs font-sans scroll-smooth">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "ai" && (
                    <div className="w-5 h-5 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-accent-cyan" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl leading-relaxed whitespace-pre-line ${
                      m.role === "ai"
                        ? "bg-[#162036]/90 text-[#FBFCFD] border border-accent-cyan/15 rounded-tl-sm"
                        : "bg-accent-blue/40 text-[#FBFCFD] border border-accent-blue/50 rounded-tr-sm"
                    }`}
                  >
                    {renderText(m.text)}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-2.5 h-2.5 text-accent-cyan animate-pulse" />
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-[#162036]/90 border border-accent-cyan/15 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Inner input inside chat drawer */}
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.2)] focus-within:border-accent-cyan/60 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about drought in Ethiopia..."
                  className="flex-1 bg-transparent text-xs text-[#FBFCFD] placeholder-[#555C6B] font-sans focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!query.trim()}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    query.trim()
                      ? "bg-accent-cyan text-[#040507] shadow-[0_0_10px_rgba(40,215,197,0.5)] hover:scale-110"
                      : "bg-[#1a2540] text-[#555C6B] cursor-not-allowed"
                  }`}
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main always-visible input capsule */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#121929]/90 backdrop-blur-2xl border border-[rgba(168,191,220,0.22)] shadow-[0_15px_35px_rgba(0,0,0,0.6)] focus-within:border-accent-cyan/60 transition-all">
          <button
            onClick={() => {
              setChatOpen(!chatOpen);
              if (!chatOpen) setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="w-8 h-8 rounded-full bg-[#1a243a] border border-accent-cyan/50 flex items-center justify-center text-accent-cyan shrink-0 shadow-[0_0_12px_rgba(40,215,197,0.4)] hover:scale-110 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            onFocus={() => setChatOpen(true)}
            placeholder="Tell me what you want to know about Ethiopia drought signals..."
            className="w-full bg-transparent text-xs text-[#FBFCFD] placeholder-[#999CA0] font-sans focus:outline-none"
          />

          <div className="flex items-center gap-2 shrink-0">
            {chatOpen && (
              <button
                onClick={() => setChatOpen(false)}
                className="text-[#999CA0] hover:text-white transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            {query.trim() && (
              <button
                onClick={() => handleSend()}
                className="w-6 h-6 rounded-full bg-accent-cyan text-[#040507] flex items-center justify-center shadow-[0_0_10px_rgba(40,215,197,0.5)] hover:scale-110 transition-transform"
              >
                <Send className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
