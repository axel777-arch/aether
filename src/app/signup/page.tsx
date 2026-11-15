"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import {
  Lock,
  Mail,
  User,
  Building,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Satellite,
  Sparkles,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { lang } = useApp();
  const isAmharic = lang === "am";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("Drought Surveillance Analyst");
  const [focusRegion, setFocusRegion] = useState("Borena Zone");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError(isAmharic ? "እባክዎን ስምዎንና ኢሜይልዎን ያስገቡ" : "Name and email are required to register");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = signup({
        name,
        email,
        password,
        organization: organization || "Disaster Risk Management Agency",
        role: role || "Drought Surveillance Analyst",
        focusRegion,
      });
      setLoading(false);
      if (res.success) {
        setSuccess(isAmharic ? "መለያዎ በተሳካ ሁኔታ ተፈጥሯል! ወደ ሲስተሙ በመሸጋገር ላይ..." : "Investigator profile established! Connecting telemetry...");
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        setError(res.error || "Registration failed");
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#040507] text-[#FBFCFD] selection:bg-accent-cyan/30 selection:text-white flex flex-col justify-center items-center px-4 py-12">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(65, 97, 159, 0.14) 0%, rgba(4, 5, 7, 0.94) 70%, #040507 100%)",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-accent-cyan/10 rounded-full blur-[160px]" />
      </div>

      {/* Back to Home Link */}
      <div className="relative z-10 w-full max-w-lg mb-6 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A8BFDC] hover:text-accent-cyan transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isAmharic ? "ወደ መነሻ ገጽ ተመለስ" : "RETURN TO OBSERVATORY"}</span>
        </Link>
        <span className="text-[10px] font-mono text-accent-cyan tracking-widest uppercase">
          CREDENTIAL AUTHORIZATION
        </span>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0b1424]/95 border border-[rgba(168,191,220,0.22)] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-8 backdrop-blur-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-panel-dark border-2 border-accent-cyan/50 shadow-[0_0_20px_rgba(40,215,197,0.4)] mx-auto flex items-center justify-center">
            <img src="/logo.jpg" alt="ETHIODROUGHT" className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="font-heading text-2xl font-bold text-[#FBFCFD] tracking-wide">
              {isAmharic ? "አዲስ የባለሙያ መለያ ይክፈቱ" : "Create Investigator Profile"}
            </h1>
            <p className="text-xs text-[#A8BFDC] font-sans">
              {isAmharic
                ? "የኢትዮጵያን የድርቅ መረጃና የሳተላይት ትንበያዎችን ለማግኘት ይመዝገቡ"
                : "Register for High-Resolution Multi-Sensor Environmental Telemetry"}
            </p>
          </div>
        </div>

        {/* Tab switchers: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#121929] border border-white/5 text-xs font-mono">
          <Link
            href="/login"
            className="py-2 text-center rounded-xl text-[#999CA0] hover:text-white transition-colors"
          >
            {isAmharic ? "መግቢያ (Sign In)" : "SIGN IN"}
          </Link>
          <div className="py-2 text-center rounded-xl bg-accent-blue/40 text-accent-cyan border border-accent-cyan/40 font-semibold shadow-md">
            {isAmharic ? "አዲስ መለያ (Sign Up)" : "CREATE ACCOUNT"}
          </div>
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
              {isAmharic ? "ሙሉ ስም" : "Full Name & Official Title"}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abebech Tolosa, MSc"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
              />
            </div>
          </div>

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
                placeholder="tolosa@university.edu.et / edrmc.gov.et"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                {isAmharic ? "ተቋም" : "Organization / Agency"}
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3 w-4 h-4 text-[#999CA0]" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="EDRMC / Ministry / UN"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] placeholder-[#555C6B] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
                {isAmharic ? "የትኩረት ዞን" : "Primary Focus Zone"}
              </label>
              <div className="relative">
                <select
                  value={focusRegion}
                  onChange={(e) => setFocusRegion(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#121929] border border-[rgba(168,191,220,0.18)] text-xs text-[#FBFCFD] font-mono focus:border-accent-cyan focus:outline-none transition-colors"
                >
                  <option value="Borena Zone">Borena Pastoral Zone</option>
                  <option value="Somali Region">Somali / Fafan Basin</option>
                  <option value="Afar Region">Afar Scrublands</option>
                  <option value="Tigray Region">Tigray Highlands</option>
                  <option value="Nationwide">Nationwide (All Ethiopia)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-[#A8BFDC] uppercase block mb-1">
              {isAmharic ? "የይለፍ ቃል" : "Create Password"}
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
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-accent-cyan text-[#040507] hover:bg-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(40,215,197,0.35)] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{loading ? "ESTABLISHING..." : isAmharic ? "መለያ ፍጠርና ግባ" : "REGISTER & INITIALIZE TELEMETRY"}</span>
            <ShieldCheck className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
