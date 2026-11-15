"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, Settings, Globe2, User, Lock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

interface NasaTopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const NasaTopBar: React.FC<NasaTopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
}) => {
  const { lang, toggleLang } = useApp();
  const { user, isAuthenticated, toggleProfileModal, openLogin } = useAuth();
  const isAmharic = lang === "am";

  const navItems = [
    { id: "home", label: isAmharic ? "መነሻ" : "HOME", href: "/" },
    { id: "story", label: isAmharic ? "ሳይንስ" : "STORY", href: "/problem" },
    { id: "signals", label: isAmharic ? "ምልክቶች" : "SIGNALS", href: "/fingerprint" },
    { id: "regions", label: isAmharic ? "ክልሎች" : "REGIONS", href: "/compare" },
    { id: "forecast", label: isAmharic ? "ትንበያ" : "FORECAST", href: "/predict" },
    { id: "reports", label: isAmharic ? "ሪፖርቶች" : "REPORTS", href: "/data" },
    { id: "lab", label: isAmharic ? "ላብ" : "LAB", href: "/lab" },
  ];

  return (
    <header className="relative z-30 w-full px-6 lg:px-12 pt-6 pb-2 flex items-center justify-between pointer-events-auto">
      {/* Left: ETHIODROUGHT Wordmark (Wide futuristic typography matching reference, no NASA logo) */}
      <Link href="/" className="flex items-center gap-3.5 group shrink-0">
        <div className="w-10 h-10 rounded-2xl overflow-hidden bg-panel-dark border-2 border-accent-cyan/50 shadow-[0_0_20px_rgba(40,215,197,0.35)] group-hover:border-accent-cyan group-hover:shadow-[0_0_25px_rgba(40,215,197,0.6)] transition-all shrink-0">
          <img src="/logo.jpg" alt="ETHIODROUGHT" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="font-michroma text-xl lg:text-2xl font-bold tracking-[0.18em] text-[#FBFCFD] group-hover:text-accent-cyan transition-colors drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            ETHIODROUGHT
          </span>
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#A8BFDC] uppercase opacity-80">
            {isAmharic ? "ከዝናብ ባሻገር · 2026" : "BEYOND RAINFALL · 2026"}
          </span>
        </div>
      </Link>

      {/* Center Nav Pills matching reference: HOME has glowing cyan outer capsule ring */}
      <nav className="hidden md:flex items-center gap-2 lg:gap-4 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-[rgba(168,191,220,0.15)] shadow-2xl">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          if (isActive) {
            return (
              <div key={item.id} className="nasa-glowing-pill">
                <Link
                  href={item.href}
                  className="nasa-glowing-pill-inner"
                >
                  {item.label}
                </Link>
              </div>
            );
          }
          return (
            <Link
              key={item.id}
              href={item.href}
              className="px-4 py-2 font-michroma text-[11px] tracking-[0.14em] text-[#999CA0] hover:text-[#FBFCFD] transition-colors uppercase"
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Circular Icon Buttons & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <button
          onClick={toggleLang}
          className="w-10 h-10 rounded-full bg-[#121929]/80 border border-[rgba(168,191,220,0.2)] hover:border-accent-cyan flex items-center justify-center text-xs font-mono text-[#A8BFDC] hover:text-white transition-all shadow-lg"
          title="Toggle Language"
        >
          {lang === "en" ? "አማ" : "EN"}
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="w-10 h-10 rounded-full bg-[#121929]/80 border border-[rgba(168,191,220,0.2)] hover:border-accent-cyan flex items-center justify-center text-[#A8BFDC] hover:text-white transition-all shadow-lg group"
          title="Search"
        >
          <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>

        {/* Notifications with small cyan badge "2" matching reference */}
        <button
          className="relative w-10 h-10 rounded-full bg-[#121929]/80 border border-[rgba(168,191,220,0.2)] hover:border-accent-cyan flex items-center justify-center text-[#A8BFDC] hover:text-white transition-all shadow-lg group"
          title="Notifications"
        >
          <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-cyan text-[#040507] font-bold text-[9px] font-mono flex items-center justify-center shadow-[0_0_8px_rgba(40,215,197,0.8)]">
            2
          </span>
        </button>

        {/* Settings */}
        <button
          className="w-10 h-10 rounded-full bg-[#121929]/80 border border-[rgba(168,191,220,0.2)] hover:border-accent-cyan flex items-center justify-center text-[#A8BFDC] hover:text-white transition-all shadow-lg group"
          title="Settings"
        >
          <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
        </button>

        {/* Visible Login / Sign Up Portal Button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-cyan/15 hover:bg-accent-cyan text-accent-cyan hover:text-[#040507] border border-accent-cyan/40 text-[11px] font-mono font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(40,215,197,0.25)] hover:scale-105"
          title="Open Authentication Portal"
        >
          <Lock className="w-3 h-3" />
          <span>{isAuthenticated && user ? (isAmharic ? "መለያ" : "PORTAL") : (isAmharic ? "ይግቡ" : "LOG IN")}</span>
        </Link>

        {/* Round User Avatar matching reference — Opens Profile or Login Modal */}
        <button
          onClick={isAuthenticated ? toggleProfileModal : openLogin}
          className="relative w-10 h-10 rounded-full border-2 border-accent-cyan/60 shadow-[0_0_15px_rgba(40,215,197,0.4)] cursor-pointer hover:scale-105 transition-transform flex items-center justify-center bg-[#121929] group shrink-0 overflow-hidden"
          title={isAuthenticated && user ? `${user.name} (${user.role})` : "Sign In / Register"}
        >
          {isAuthenticated && user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className="w-5 h-5 text-accent-cyan" />
          )}

          {/* Active Status Pulse */}
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#040507] ${
              isAuthenticated ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
            }`}
          />
        </button>
      </div>
    </header>
  );
};
