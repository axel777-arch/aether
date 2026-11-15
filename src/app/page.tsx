"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import { translations } from "@/data/translations";
import { NasaTopBar } from "@/components/nasa/NasaTopBar";
import { ETHIOPIA_HOTSPOTS, Hotspot } from "@/components/nasa/EthiopiaDottedGlobe";
import { RegionDetailCard } from "@/components/nasa/RegionDetailCard";
import { MiniRadarCard } from "@/components/nasa/MiniRadarCard";
import { ExploreChatbotBar } from "@/components/nasa/ExploreChatbotBar";
import { AiInsightsSidebar } from "@/components/nasa/AiInsightsSidebar";
import { BottomCardsRow } from "@/components/nasa/BottomCardsRow";
import { RecoveryTracker } from "@/components/RecoveryTracker";
import { RegionalPriorityRanking } from "@/components/RegionalPriorityRanking";
import { ChevronDown, Layers, Droplets, Sprout, ArrowRight, Activity, ShieldAlert, Sparkles, Compass, FlaskConical } from "lucide-react";

const EthiopiaDottedGlobe = dynamic(
  () => import("@/components/nasa/EthiopiaDottedGlobe").then((m) => m.EthiopiaDottedGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan animate-spin" />
      </div>
    ),
  }
);

const DynamicMap = dynamic(
  () => import("@/components/LeafletMapInner"),
  {
    ssr: false,
    loading: () => <div className="w-full h-[520px] rounded-3xl bg-panel-dark animate-pulse" />,
  }
);

export default function HomePage() {
  const {
    lang,
    selectedRegionId,
    setSelectedRegionId,
  } = useApp();
  const isAmharic = lang === "am";
  const t = translations[lang];

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("home");

  // Selected hotspot on the 3D globe (defaults to Borena)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(ETHIOPIA_HOTSPOTS[0]);
  const [showDetailCard, setShowDetailCard] = useState(true);

  const handleSelectHotspot = (h: Hotspot) => {
    setSelectedHotspot(h);
    setShowDetailCard(true);
  };

  const scrollToAnalytics = () => {
    const el = document.getElementById("analytics-suite");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#040507] text-[#FBFCFD] overflow-x-hidden selection:bg-accent-cyan/30 selection:text-white">
      {/* Background radial glow & faint stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 45% 40%, rgba(65,97,159,0.18) 0%, rgba(4,5,7,0.85) 60%, #040507 100%)",
          }}
        />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-accent-cyan/10 rounded-full blur-[160px]" />
      </div>

      {/* ========================================================
          PIXEL-FAITHFUL NASA REFERENCE DASHBOARD (1440x1024 Stage)
          ======================================================== */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between pb-8 max-w-[1680px] mx-auto">
        {/* 1. TOP BAR */}
        <NasaTopBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 2. MAIN STAGE: GRID LAYOUT (Left/Center Globe + Right Sidebar) */}
        <div className="flex-1 w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto pt-2 pb-6 items-stretch">

          {/* LEFT & CENTER COLUMN (Globe, Hotspot Cards, Explore Bar, Bottom Row) */}
          <div className="lg:col-span-9 flex flex-col justify-between gap-6">

            {/* 3D Globe Stage with Overlaid Cards */}
            <div className="relative w-full h-[540px] lg:h-[580px] rounded-3xl overflow-hidden bg-[#040507]/60 border border-[rgba(168,191,220,0.08)] flex items-center justify-center shadow-2xl">

              {/* Center-Left 3D Dotted Particle Globe */}
              <div className="absolute inset-0 z-0">
                <EthiopiaDottedGlobe
                  selectedHotspot={selectedHotspot}
                  onSelectHotspot={handleSelectHotspot}
                />
              </div>

              {/* Bottom-Left Lens Flare / Glow Accent */}
              <div className="nasa-lens-flare bottom-4 left-4" />

              {/* Top-Right Overlaid Cards: RegionDetailCard and MiniRadarCard */}
              <div className="absolute top-5 right-5 z-20 flex flex-col gap-4 pointer-events-auto items-end">
                {showDetailCard && (
                  <div className="transform transition-all duration-300">
                    <RegionDetailCard
                      hotspot={selectedHotspot}
                      onClose={() => setShowDetailCard(false)}
                      onAddComparison={() => {
                        const nextIdx = (ETHIOPIA_HOTSPOTS.findIndex(h => h.id === selectedHotspot.id) + 1) % ETHIOPIA_HOTSPOTS.length;
                        setSelectedHotspot(ETHIOPIA_HOTSPOTS[nextIdx]);
                      }}
                    />
                  </div>
                )}
                <MiniRadarCard activeHotspotName={selectedHotspot.name} />
              </div>

              {/* Center-Bottom Globe Controls: EXPLORE pill & Query Bar */}
              <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center px-4">
                <ExploreChatbotBar onExploreClick={scrollToAnalytics} />
              </div>
            </div>

            {/* 3. BOTTOM ROW: THREE METRIC CARDS */}
            <div className="w-full">
              <BottomCardsRow />
            </div>

          </div>

          {/* RIGHT COLUMN: ✦ IA INSIGHTS SIDEBAR */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <AiInsightsSidebar />
          </div>

        </div>

        {/* Navigation & Scientific Story Action Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link
            href="/problem"
            className="flex items-center gap-2 text-xs font-mono text-[#FBFCFD] hover:text-accent-cyan transition-all py-2.5 px-5 rounded-full bg-accent-blue/30 hover:bg-accent-blue/50 border border-accent-blue/50 backdrop-blur-md shadow-lg group"
          >
            <span>{isAmharic ? "ሳይንሳዊ መንገዳችንን ይወቁ" : "DISCOVER OUR APPROACH"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent-cyan group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 text-xs font-mono text-accent-cyan hover:text-white transition-all py-2.5 px-5 rounded-full bg-panel-dark/80 hover:bg-panel-dark border border-accent-cyan/40 backdrop-blur-md shadow-lg"
          >
            <span>{isAmharic ? "ኢትዮጵያን ያስሱ" : "EXPLORE ETHIOPIA"}</span>
            <Compass className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/lab"
            className="flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-white transition-all py-2.5 px-5 rounded-full bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)] group"
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span>{isAmharic ? "የምርምር ላብ" : "INVESTIGATION LAB"}</span>
          </Link>
          <button
            onClick={scrollToAnalytics}
            className="flex items-center gap-2 text-xs font-mono text-[#A8BFDC] hover:text-accent-cyan transition-colors py-2 px-4 rounded-full bg-panel-dark/40 border border-white/5 backdrop-blur-md"
          >
            <span>{isAmharic ? "ዝርዝር ሳይንሳዊ መረጃዎች" : "DEEP ANALYTICS"}</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>

      {/* ========================================================
          DEEP EARTH SYSTEM ANALYTICS WORKBENCH
          ======================================================== */}
      <section id="analytics-suite" className="relative z-10 w-full max-w-[1680px] mx-auto px-6 lg:px-12 py-16 border-t border-[rgba(168,191,220,0.1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/15 border border-accent-blue/30 text-accent-cyan text-xs font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NASA SPACE APPS 2026 CHALLENGE</span>
            </div>
            <h2 className="font-michroma text-2xl lg:text-3xl font-bold text-[#FBFCFD] tracking-wide">
              {isAmharic ? "ሁለገብ የሳተላይት መረጃ ማዕከል" : "Geospatial Earth Observation Suite"}
            </h2>
            <p className="text-sm text-[#A8BFDC] mt-1 max-w-2xl font-sans">
              {isAmharic
                ? "ይህ ቅድመ-ሙከራ የዞን ድንበሮችን እና ታሪካዊ የቦታ አማካይ መረጃዎችን ያሳያል። የቀጥታ የዝናብ፣ የአፈር እርጥበት እና የዕፅዋት ጊዜ ተከታታይ መረጃ ገና አልተዋሃደም።"
                : "This prototype shows zone boundaries and historical spatial summaries. Live rainfall, soil moisture, and vegetation time series are not yet integrated."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/fingerprint"
              className="px-4 py-2 rounded-xl bg-panel-dark border border-panel-border/40 hover:border-accent-cyan text-xs font-mono tracking-wider text-accent-light hover:text-accent-cyan transition-all flex items-center gap-2"
            >
              <span>{isAmharic ? "ምልክቶች" : "DROUGHT SIGNALS"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/compare"
              className="px-4 py-2 rounded-xl bg-panel-dark border border-panel-border/40 hover:border-accent-cyan text-xs font-mono tracking-wider text-accent-light hover:text-accent-cyan transition-all flex items-center gap-2"
            >
              <span>{isAmharic ? "የክልሎች ንፅፅር" : "ZONE COMPARISON"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* GIS Interactive Map View */}
        <div className="mb-12">
          <div className="nasa-reference-glass p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[rgba(168,191,220,0.1)]">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-accent-cyan" />
                <h3 className="font-michroma text-base font-bold text-[#FBFCFD]">
                  {isAmharic ? "የክልል ድንበር ካርታ" : "Regional Boundary Map"}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#A8BFDC]">
                72 administrative zones · geographic context only
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[rgba(168,191,220,0.15)] h-[560px]">
              <DynamicMap
                selectedRegionId={selectedRegionId}
                onSelectRegion={(id) => setSelectedRegionId(id)}
                selectedMapLayer="normal"
              />
            </div>
          </div>
        </div>

        {/* Priority Rankings and Recovery Analytics — Stacked Vertically */}
        <div className="flex flex-col gap-10 w-full">
          <div className="w-full">
            <RegionalPriorityRanking isAmharic={isAmharic} />
          </div>
          <div className="w-full">
            <RecoveryTracker isAmharic={isAmharic} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-[rgba(168,191,220,0.1)] py-8 px-6 lg:px-12 text-center text-xs font-mono text-[#A8BFDC]/60">
        <p>AETHER · BEYOND RAINFALL · NASA SPACE APPS CHALLENGE 2026</p>
        <p className="mt-1 text-[11px] opacity-70">
          Dataset registry documents data provenance, temporal coverage, and integration status
        </p>
      </footer>
    </div>
  );
}
