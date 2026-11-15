"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { translations } from "@/data/translations";
import {
  Globe2,
  Menu,
  X,
  Satellite,
  Map,
  Fingerprint,
  TrendingUp,
  GitCompare,
  Database,
  BookOpen,
  Bell,
  Layers,
  AlertTriangle,
  Sprout,
  FlaskConical,
  Lightbulb,
  User,
  Lock,
  Sliders,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  href: string;
  label: string;
  labelAm: string;
  icon: React.ReactNode;
  group: "story" | "workspace";
}

export const Navbar: React.FC = () => {
  const { lang, toggleLang } = useApp();
  const { user, isAuthenticated, toggleProfileModal, openLogin } = useAuth();
  const t = translations[lang];
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    // Story pages
    { href: "/problem",    label: "The Problem",  labelAm: "ችግሩ",         icon: <AlertTriangle className="w-3.5 h-3.5" />, group: "story" },
    { href: "/science",    label: "The Science",  labelAm: "ሳይንሱ",         icon: <FlaskConical  className="w-3.5 h-3.5" />, group: "story" },
    { href: "/solution",   label: "Our Solution", labelAm: "መፍትሔው",        icon: <Lightbulb     className="w-3.5 h-3.5" />, group: "story" },
    // Workspace pages
    { href: "/lab",        label: "Lab",          labelAm: "ላብ",            icon: <Sliders       className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/explore",    label: "Explore",      labelAm: "ካርታ",          icon: <Map           className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/fingerprint",label: "Fingerprint",  labelAm: "ሳምንተኛ",        icon: <Fingerprint   className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/trends",     label: "Trends",       labelAm: "አዝማሚያ",        icon: <TrendingUp    className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/compare",    label: "Compare",      labelAm: "ንፅፅር",          icon: <GitCompare    className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/alerts",     label: "Alerts",       labelAm: "ማስጠንቀቂያ",      icon: <Bell          className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/data",       label: "Data",         labelAm: "ዳታ",            icon: <Database      className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/datasets",   label: "Datasets",     labelAm: "የመረጃ ስብስቦች", icon: <Database      className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/predict",    label: "Predictor",    labelAm: "ትንበያ",          icon: <TrendingUp    className="w-3.5 h-3.5" />, group: "workspace" },
    { href: "/methodology",label: "Methodology",  labelAm: "ዘዴ",            icon: <BookOpen      className="w-3.5 h-3.5" />, group: "workspace" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#040507]/90 backdrop-blur-xl border-b border-panel-border/30">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Left: Aether brand */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl overflow-hidden bg-panel-dark border-2 border-accent-cyan/40 shadow-[0_0_18px_rgba(40,215,197,0.35)] group-hover:border-accent-cyan group-hover:shadow-[0_0_24px_rgba(40,215,197,0.6)] transition-all duration-300 group-hover:scale-105 shrink-0">
            <img
              src="/aether-logo.png"
              alt="Aether logo"
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading tracking-wider font-bold text-base text-text-primary group-hover:text-accent-cyan transition-colors">
                {t.appName}
              </span>
              <span className="hidden sm:inline px-1.5 py-0.5 text-[8px] font-mono tracking-widest uppercase bg-accent-blue/30 text-accent-light rounded border border-accent-blue/50">
                NASA 2026
              </span>
            </div>
            <span className="hidden md:block text-[9px] tracking-widest text-text-subtle font-mono uppercase">
              {t.tagline}
            </span>
          </div>
        </Link>

        {/* Center: Grouped Pill Navigation — Story | Workspace */}
        <nav className="hidden xl:flex items-center gap-1 bg-panel-dark/80 p-1 rounded-full border border-panel-border/40 shadow-inner">
          {/* Story group */}
          {navItems.filter(i => i.group === "story").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-1.5 text-[11px] font-medium rounded-full transition-all duration-200 tracking-wider flex items-center gap-1.5 ${
                isActive(item.href)
                  ? "nasa-active-pill font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span className="hidden 2xl:inline">{lang === "am" ? item.labelAm : item.label}</span>
            </Link>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-panel-border/40 mx-1" />

          {/* Workspace group */}
          {navItems.filter(i => i.group === "workspace").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-1.5 text-[11px] font-medium rounded-full transition-all duration-200 tracking-wider flex items-center gap-1.5 ${
                isActive(item.href)
                  ? "nasa-active-pill font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span className="hidden 2xl:inline">{lang === "am" ? item.labelAm : item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: Controls */}
        <div className="flex items-center gap-2.5">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-panel-dark border border-panel-border/50 text-accent-light hover:border-accent-cyan text-xs font-mono tracking-wider transition-all"
            title="Toggle English / አማርኛ"
          >
            <Globe2 className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="font-semibold">{lang === "en" ? "አማርኛ" : "EN"}</span>
          </button>

          {/* Space Apps Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-panel-dark border border-accent-blue/40 text-[10px] font-mono text-accent-light">
            <Satellite className="w-3 h-3 text-accent-cyan" />
            <span>Space Apps 2026</span>
          </div>

          {/* Visible Login / Portal Button */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-cyan/15 hover:bg-accent-cyan text-accent-cyan hover:text-[#040507] border border-accent-cyan/40 text-[11px] font-mono font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(40,215,197,0.25)] hover:scale-105"
            title="Open Authentication Portal"
          >
            <Lock className="w-3 h-3" />
            <span>{isAuthenticated && user ? (lang === "am" ? "መለያ" : "PORTAL") : (lang === "am" ? "ይግቡ" : "LOG IN")}</span>
          </Link>

          {/* Round User Profile Button */}
          <button
            onClick={isAuthenticated ? toggleProfileModal : openLogin}
            className="relative w-9 h-9 rounded-full border-2 border-accent-cyan/60 shadow-[0_0_12px_rgba(40,215,197,0.35)] cursor-pointer hover:scale-105 transition-transform flex items-center justify-center bg-[#121929] shrink-0 overflow-hidden"
            title={isAuthenticated && user ? `${user.name} (${user.role})` : "Sign In / Register"}
          >
            {isAuthenticated && user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-accent-cyan" />
            )}

            {/* Active Status Pulse */}
            <span
              className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#040507] ${
                isAuthenticated ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
              }`}
            />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-panel-dark text-text-secondary hover:text-text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-panel-border/30 bg-[#040507]/95 backdrop-blur-xl px-4 pb-4 pt-3 space-y-3">
          <div className="text-[9px] font-mono text-text-subtle uppercase tracking-widest px-1">Story</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {navItems.filter(i => i.group === "story").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all ${
                  isActive(item.href)
                    ? "bg-accent-blue/30 text-accent-cyan border border-accent-cyan/40"
                    : "bg-panel-dark text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.icon}
                <span className="text-[9px]">{lang === "am" ? item.labelAm : item.label}</span>
              </Link>
            ))}
          </div>
          <div className="text-[9px] font-mono text-text-subtle uppercase tracking-widest px-1">Workspace</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {navItems.filter(i => i.group === "workspace").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 rounded-xl flex flex-col items-center gap-1.5 text-center transition-all ${
                  isActive(item.href)
                    ? "bg-accent-blue/30 text-accent-cyan border border-accent-cyan/40"
                    : "bg-panel-dark text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.icon}
                <span className="text-[9px]">{lang === "am" ? item.labelAm : item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
