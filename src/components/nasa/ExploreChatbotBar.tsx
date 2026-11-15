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
      "🌍 **Borena Zone (Oromia)** is in the most critical drought state. Root-zone soil moisture (0–100 cm) sits at **0.142 m³/m³** — that's **2.14 σ below the 2000–2020 baseline**. Despite scattered showers, subterranean water storage has collapsed across all 8 pastoral woredas. Livestock mortality risk is HIGH.",
  },
  {
    match: ["soil", "moisture", "fldas", "noah"],
    reply:
      "💧 **Soil moisture** across southern Ethiopia is tracked using NASA FLDAS Noah LSM at 0–100 cm depth. This captures root-zone water that sustains pasture and crops — unlike surface rainfall, it reflects **accumulated water stress over weeks**. Borena reads 0.142 m³/m³ vs. the 0.312 m³/m³ long-term mean.",
  },
  {
    match: ["rain", "rainfall", "precipitation", "gpm", "imerg"],
    reply:
      "🌧️ **GPM IMERG V07** satellite data shows a **–1.82 σ precipitation anomaly** over Borena — meaning only **32.4 mm** fell where **74.5 mm** is expected. But rainfall is just one piece: two consecutive failed monsoons (2022 Deyr, 2023 Belg) have drained soil reserves even where brief rains occurred.",
  },
  {
    match: ["ndvi", "vegetation", "veg", "plant", "modis", "canopy"],
    reply:
      "🌿 **MODIS NDVI (MOD13A2)** measures canopy greenness at 1 km / 16-day resolution. Borena's NDVI sits at **0.375** — a **–1.65 σ anomaly** indicating severe pasture degradation. Afar reads even lower at 0.210 (–1.90 σ), reflecting hyper-arid scrubland collapse that livestock cannot recover from without intervention.",
  },
  {
    match: ["afar", "northern"],
    reply:
      "⚠️ **Afar (North)** is the most critical zone on all three sensors: rainfall at **–1.95 σ**, soil moisture at **0.118 m³/m³ (–2.40 σ)**, and NDVI at **0.210 (–1.90 σ)**. The hyper-arid scrubland has experienced 6 consecutive months below baseline — livestock hydration sources are critically low.",
  },
  {
    match: ["somali", "fafan", "ogaden"],
    reply:
      "🏜️ **Somali Region / Fafan Zone** shows HIGH-level drought: rainfall anomaly **–1.45 σ**, soil moisture **0.155 m³/m³ (–1.80 σ)**, NDVI **0.290 (–1.35 σ)**. Lowland pastoral communities and riverine recharge zones are most affected. Groundwater recharge has not occurred in 2 consecutive wet seasons.",
  },
  {
    match: ["tigray", "highland"],
    reply:
      "📊 **Tigray (Central)** is in MODERATE drought: rainfall **–0.92 σ**, soil moisture **0.210 m³/m³ (–0.85 σ)**, NDVI **0.480 (–0.60 σ)**. Highland terraced agriculture faces Kiremt shortfall stress. Woreda-level monitoring is active across Enderta, Kola Tembien, and Tanqua Abergele.",
  },
  {
    match: ["severe", "critical", "worst", "emergency", "alert"],
    reply:
      "🚨 **Compound drought emergency** is active across southern Ethiopia. Ranked by severity:\n1. **AFAR NORTH** — Critical (all 3 indicators > 1.9 σ below baseline)\n2. **BORENA** — Severe (soil moisture at –2.14 σ)\n3. **SOMALI / FAFAN** — High\n4. **TIGRAY** — Moderate\n\nVisit the Alerts page for real-time monitoring.",
  },
  {
    match: ["satellite", "sensor", "data", "source", "nasa"],
    reply:
      "🛰️ ETHIODROUGHT fuses **3 NASA/ESA satellite datasets**:\n• **GPM IMERG V07** — Global precipitation at 0.1° / 30-min\n• **NASA FLDAS Noah LSM** — Root-zone soil moisture (0–100 cm)\n• **MODIS MOD13A2** — 16-day NDVI at 1 km resolution\n\nAll data spans 2000–2024 and is processed through Mann-Kendall trend analysis.",
  },
  {
    match: ["mann-kendall", "trend", "statistics", "sen", "slope"],
    reply:
      "📈 The **Mann-Kendall test** is a non-parametric method to detect monotonic trends. It doesn't assume normal data distribution, making it ideal for noisy climate signals. **Sen's Slope** (Q = median of all pairwise slopes) gives the rate of change per year. NDVI in Borena shows –0.0142/decade — a statistically significant drying trend (p < 0.001).",
  },
  {
    match: ["why", "enough", "alone", "just rainfall"],
    reply:
      "💡 **Rainfall alone is misleading.** In 2023, parts of Borena recorded near-normal rain — yet drought conditions persisted. Why?\n1. **Soil memory** — decades of overgrazing stripped topsoil water retention\n2. **Timing** — brief intense rain runs off; it doesn't recharge root-zone moisture\n3. **Vegetation lag** — degraded pasture can't recover from a single good rain\n\nThis is the core insight of ETHIODROUGHT: it takes 3 sensors to see the full picture.",
  },
  {
    match: ["methodology", "how", "calculated", "method", "algorithm"],
    reply:
      "🔬 ETHIODROUGHT's methodology combines:\n1. **Anomaly detection** — Z-score standardization vs. 2000–2020 climatological mean\n2. **Compound drought index** — When all 3 indicators fall below –1.5 σ simultaneously\n3. **Mann-Kendall trend analysis** — Non-parametric, autocorrelation-resistant\n4. **Spatial aggregation** — Zone-level averages from pixel-level satellite products",
  },
  {
    match: ["lab", "investigation", "workbench", "experiment", "simulator", "synthetic", "custom data"],
    reply:
      "🧪 The **Drought Investigation Lab** is our hands-on interactive scientific workbench at **/lab**! Features include:\n• **Map Canvas**: click anywhere in Ethiopia, choose your radius (25–600 km)\n• **Time Scrubber**: step or play month-by-month through 15+ years\n• **Drought Fingerprint**: matrix showing which sensor departed first (Precip vs Soil vs NDVI)\n• **Lead/Lag Analysis**: cross-correlations revealing signal lags\n• **Custom Data**: drag & drop your own CSV or run synthetic demos.\n\nVisit **/lab** to start an investigation!",
  },
  {
    match: ["help", "what can", "commands", "options", "ask"],
    reply:
      "🤖 I can answer questions about:\n• **Drought zones** — Borena, Afar, Somali, Tigray\n• **Satellite data** — GPM rainfall, FLDAS soil moisture, MODIS NDVI\n• **Statistics** — Mann-Kendall trends, anomalies, Sen's slope\n• **Why rainfall alone isn't enough**\n\nTry: *\"Why is Borena so critical?\"* or *\"Explain the soil moisture situation\"*",
  },
];

function getReply(text: string): string {
  const lower = text.toLowerCase();
  for (const entry of KB) {
    if (entry.match.some((kw) => lower.includes(kw))) {
      return entry.reply;
    }
  }
  return "🛰️ I didn't catch a specific drought topic there. Try asking about **Borena**, **soil moisture**, **rainfall anomalies**, **NDVI vegetation**, or a specific zone like **Afar** or **Somali**. You can also type **help** to see what I know.";
}

const QUICK_CHIPS = [
  "What is the Investigation Lab?",
  "Why is Borena so critical?",
  "What does soil moisture mean?",
  "Which zone is worst?",
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
      text: "👋 Welcome to **ETHIODROUGHT Earth Intelligence**. I can explain drought conditions across Ethiopia — just ask about any region, satellite data, or indicator. Try a quick question below, or type your own!",
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
                EARTH INTELLIGENCE · ETHIODROUGHT AI
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
