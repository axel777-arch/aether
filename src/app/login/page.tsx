"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Satellite,
  User,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Compass,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAs, user, isAuthenticated } = useAuth();
  const { lang } = useApp();
  const isAmharic = lang === "am";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError(isAmharic ? "እባክዎን ትክክለኛ ኢሜይል ያስገቡ" : "Please provide your institutional email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        setSuccess(isAmharic ? "በተሳካ ሁኔታ ገብተዋል! ወደ ማዕከሉ በመሸጋገር ላይ..." : "Authenticated successfully! Transferring to dashboard...");
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        setError(res.error || "Authentication failed");
      }
    }, 400);
  };

  const handleDemoLogin = (key: "selamawit" | "tadesse" | "marcus") => {
    loginAs(key);
    setSuccess(isAmharic ? "የናሙና መለያ ነቅቷል! በመሸጋገር ላይ..." : "Demo investigator session active! Transferring to dashboard...");
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#040507] text-[#FBFCFD] selection:bg-accent-cyan/30 selection:text-white flex flex-col justify-center items-center px-4 py-12">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(40, 215, 197, 0.12) 0%, rgba(4, 5, 7, 0.94) 70%, #040507 100%)",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-accent-cyan/10 rounded-full blur-[160px]" />
      </div>

      {/* Back to Home Link */}
      <div className="relative z-10 w-full max-w-md mb-6 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A8BFDC] hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isAmharic ? "ወደ መነሻ ገጽ ተመለስ" : "RETURN TO OBSERVATORY"}</span>
        </Link>
        <span className="text-[10px] font-mono text-accent-cyan tracking-widest uppercase">
          NASA 2026 SECURITY
        </span>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0b1424]/95 border border-[rgba(168,191,220,0.22)] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-8 backdrop-blur-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-panel-dark border-2 border-accent-cyan/50 shadow-[0_0_20px_rgba(40,215,197,0.4)] mx-auto flex items-center justify-center">
            <img src="/logo.jpg" alt="ETHIODROUGHT" className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="font-heading text-2xl font-bold text-[#FBFCFD] tracking-wide">
              {isAmharic ? "የመረጃ ማዕከል መግቢያ" : "Intelligence Portal Login"}
            </h1>
            <p className="text-xs text-[#A8BFDC] mt-1 font-sans">
              {isAmharic
                ? "የኢትዮጵያን የሳተላይት መረጃ ለመከታተል መለያዎን ያስገቡ"
                : "Authorized Access for Researchers, DRM Officers & Field Analysts"}
            </p>
          </div>
        </div>

        {/* Tab switchers: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#121929] border border-white/5 text-xs font-mono">
          <div className="py-2 text-center rounded-xl bg-accent-blue/40 text-accent-cyan border border-accent-cyan/40 font-semibold shadow-md">
            {isAmharic ? "መግቢያ (Sign In)" : "SIGN IN"}
          </div>
          <Link
            href="/signup"
            className="py-2 text-center rounded-xl text-[#999CA0] hover:text-white transition-colors"
          >
            {isAmharic ? "አዲስ መለያ (Sign Up)" : "CREATE ACCOUNT"}
          </Link>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
              {isAmharic ? "ኢሜይል" : "Institutional Email Address"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@edrmc.gov.et / nasa.gov"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-[#A8BFDC] uppercase">
                {isAmharic ? "የይለፍ ቃል" : "Security Password"}
              </label>
              <span className="text-[10px] font-mono text-[#999CA0]">Demo mode enabled</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-accent-cyan text-[#040507] hover:bg-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(40,215,197,0.35)] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{loading ? "CONNECTING..." : isAmharic ? "ወደ ሲስተሙ ግቡ" : "AUTHORIZE & CONNECT"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Instant Demo Authentication */}
        <div className="pt-4 border-t border-[rgba(168,191,220,0.12)] space-y-2.5">
          <span className="text-[10px] font-mono text-[#999CA0] uppercase tracking-wider block text-center">
            {isAmharic ? "ወይም በ 1-ጠቅታ የናሙና መለያ ይግቡ" : "OR QUICK 1-CLICK DEMO AUTHENTICATION"}
          </span>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("selamawit")}
              className="p-3 rounded-xl bg-[#121929] hover:bg-accent-blue/30 border border-white/5 hover:border-accent-cyan/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/50 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                    alt="Dr. Selamawit"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#FBFCFD] group-hover:text-accent-cyan">
                    Dr. Selamawit Bekele
                  </div>
                  <div className="text-[10px] font-mono text-[#A8BFDC]">
                    Lead Scientist · EDRMC & NASA Harvest
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#999CA0] group-hover:text-accent-cyan group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("tadesse")}
              className="p-3 rounded-xl bg-[#121929] hover:bg-accent-blue/30 border border-white/5 hover:border-accent-cyan/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/50 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    alt="Tadesse Alemayehu"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#FBFCFD] group-hover:text-accent-cyan">
                    Tadesse Alemayehu
                  </div>
                  <div className="text-[10px] font-mono text-[#A8BFDC]">
                    Zonal Coordinator · Borena Field DRM
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#999CA0] group-hover:text-accent-cyan group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("marcus")}
              className="p-3 rounded-xl bg-[#121929] hover:bg-accent-blue/30 border border-white/5 hover:border-accent-cyan/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/50 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
                    alt="Dr. Marcus Vance"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#FBFCFD] group-hover:text-accent-cyan">
                    Dr. Marcus Vance
                  </div>
                  <div className="text-[10px] font-mono text-[#A8BFDC]">
                    Satellite Specialist · NASA GSFC
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#999CA0] group-hover:text-accent-cyan group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
