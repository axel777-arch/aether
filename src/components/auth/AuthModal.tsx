"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import {
  X,
  Lock,
  Mail,
  User,
  Building,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Satellite,
  Radio,
} from "lucide-react";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    login,
    loginAs,
    signup,
  } = useAuth();
  const { lang } = useApp();
  const isAmharic = lang === "am";

  const [mode, setMode] = useState<"login" | "signup">(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [focusRegion, setFocusRegion] = useState("Borena Zone");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode with context
  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError(isAmharic ? "እባክዎን ኢሜይል ያስገቡ" : "Please provide a valid email address");
      return;
    }
    const res = login(email, password);
    if (res.success) {
      setSuccessMsg(isAmharic ? "በተሳካ ሁኔታ ገብተዋል!" : "Authenticated successfully");
      setTimeout(() => closeAuthModal(), 600);
    } else {
      setError(res.error || "Login failed");
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError(isAmharic ? "እባክዎን ስምዎንና ኢሜይልዎን ያስገቡ" : "Name and email are required");
      return;
    }
    const res = signup({
      name,
      email,
      password,
      organization: organization || "Disaster Risk Assessment Agency",
      role: role || "Drought Surveillance Analyst",
      focusRegion,
    });
    if (res.success) {
      setSuccessMsg(isAmharic ? "መለያዎ በተሳካ ሁኔታ ተፈጥሯል!" : "Account created & telemetry authorized");
      setTimeout(() => closeAuthModal(), 700);
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0b1424]/95 border border-[rgba(168,191,220,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden select-none">
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(168,191,220,0.12)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-panel-dark border border-accent-cyan/40 flex items-center justify-center text-accent-cyan shadow-[0_0_12px_rgba(40,215,197,0.3)]">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest block">
                NASA SPACE APPS 2026 · SECURITY
              </span>
              <h2 className="font-heading text-lg font-bold text-[#FBFCFD]">
                {mode === "login"
                  ? isAmharic
                    ? "ወደ መረጃ ማዕከሉ ይግቡ"
                    : "Access Intelligence Portal"
                  : isAmharic
                  ? "አዲስ የባለሙያ መለያ ይክፈቱ"
                  : "Investigator Registration"}
              </h2>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-[#162036] hover:bg-[#253352] border border-white/10 flex items-center justify-center text-[#999CA0] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 mx-6 mt-6 rounded-2xl bg-[#121929] border border-white/5 text-xs font-mono">
          <button
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all font-semibold ${
              mode === "login"
                ? "bg-accent-blue/40 text-accent-cyan border border-accent-cyan/40 shadow-md"
                : "text-[#999CA0] hover:text-white"
            }`}
          >
            {isAmharic ? "መግቢያ (Sign In)" : "SIGN IN"}
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all font-semibold ${
              mode === "signup"
                ? "bg-accent-blue/40 text-accent-cyan border border-accent-cyan/40 shadow-md"
                : "text-[#999CA0] hover:text-white"
            }`}
          >
            {isAmharic ? "አዲስ መለያ (Sign Up)" : "CREATE ACCOUNT"}
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                {isAmharic ? "ኢሜይል አድራሻ" : "Institutional Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@edrmc.gov.et / nasa.gov"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                {isAmharic ? "የይለፍ ቃል" : "Access Key / Password"}
              </label>
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
              className="w-full py-3 rounded-2xl bg-accent-cyan text-[#040507] hover:bg-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(40,215,197,0.35)] flex items-center justify-center gap-2 mt-2"
            >
              <span>{isAmharic ? "ይግቡና ዳታውን ያግኙ" : "AUTHENTICATE TELEMETRY"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Personas 1-Click Login */}
            <div className="pt-4 border-t border-[rgba(168,191,220,0.1)] space-y-2">
              <span className="text-[10px] font-mono text-[#999CA0] uppercase tracking-wider block text-center">
                {isAmharic ? "በ 1-ጠቅታ የናሙና መለያ ይምረጡ" : "OR INSTANT 1-CLICK DEMO AUTHENTICATION"}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loginAs("selamawit")}
                  className="p-2.5 rounded-xl bg-[#121929] hover:bg-accent-blue/30 border border-white/5 hover:border-accent-cyan/40 text-left transition-all group"
                >
                  <div className="text-[11px] font-bold text-[#FBFCFD] group-hover:text-accent-cyan line-clamp-1">
                    Dr. Selamawit
                  </div>
                  <div className="text-[9px] font-mono text-[#A8BFDC] line-clamp-1">
                    NASA Lead
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => loginAs("tadesse")}
                  className="p-2.5 rounded-xl bg-[#121929] hover:bg-accent-blue/30 border border-white/5 hover:border-accent-cyan/40 text-left transition-all group"
                >
                  <div className="text-[11px] font-bold text-[#FBFCFD] group-hover:text-accent-cyan line-clamp-1">
                    Tadesse A.
                  </div>
                  <div className="text-[9px] font-mono text-[#A8BFDC] line-clamp-1">
                    Borena Field DRM
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => loginAs("marcus")}
                  className="p-2.5 rounded-xl bg-[#121929] hover:bg-accent-blue/30 border border-white/5 hover:border-accent-cyan/40 text-left transition-all group"
                >
                  <div className="text-[11px] font-bold text-[#FBFCFD] group-hover:text-accent-cyan line-clamp-1">
                    Dr. Marcus V.
                  </div>
                  <div className="text-[9px] font-mono text-[#A8BFDC] line-clamp-1">
                    GSFC Satellite
                  </div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* TAB 2: CREATE ACCOUNT */
          <form onSubmit={handleSignupSubmit} className="p-6 space-y-3.5">
            <div>
              <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                {isAmharic ? "ሙሉ ስም" : "Full Name & Credentials"}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abebech Tolosa, MSc"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                {isAmharic ? "ኢሜይል" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abebech@university.edu.et"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                  {isAmharic ? "ተቋም" : "Organization"}
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="EDRMC / Academic"
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                  {isAmharic ? "የትኩረት ክልል" : "Focus Zone"}
                </label>
                <select
                  value={focusRegion}
                  onChange={(e) => setFocusRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
                >
                  <option value="Borena Zone">Borena Pastoral Zone</option>
                  <option value="Somali Region">Somali / Fafan Basin</option>
                  <option value="Afar Region">Afar Scrublands</option>
                  <option value="Tigray Region">Tigray Highlands</option>
                  <option value="Nationwide">Nationwide (All Ethiopia)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                {isAmharic ? "የይለፍ ቃል" : "Create Security Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-accent-cyan text-[#040507] hover:bg-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(40,215,197,0.35)] flex items-center justify-center gap-2 mt-1"
            >
              <span>{isAmharic ? "መለያ ፍጠርና ጀምር" : "REGISTER & CONNECT TELEMETRY"}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
