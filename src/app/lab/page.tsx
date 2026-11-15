"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  FlaskConical,
  Maximize2,
  Minimize2,
  ExternalLink,
  Info,
  Sparkles,
  Download,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

export default function LabPage() {
  const { lang } = useApp();
  const isAmharic = lang === "am";
  const [iframeHeight, setIframeHeight] = useState(1300);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (event.data && event.data.type === "LAB_RESIZE" && typeof event.data.height === "number") {
        setIframeHeight(Math.max(1250, event.data.height + 40));
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, []);

  return (
    <div className={`w-full bg-[#040507] text-[#E7EDF5] relative ${isFullscreen ? "fixed inset-0 z-[100] overflow-y-auto" : ""}`}>
      {/* Top Controls / Breadcrumb Strip */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(40,215,197,0.15)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-cyan/10 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan shadow-[0_0_12px_rgba(40,215,197,0.25)]">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-michroma text-xs lg:text-sm font-bold tracking-[0.12em] text-[#FBFCFD]">
                {isAmharic ? "የድርቅ ምርምር ላብራቶሪ" : "DROUGHT INVESTIGATION LAB"}
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-accent-cyan/15 text-accent-cyan rounded-full border border-accent-cyan/30">
                ACTIVE WORKBENCH
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#93A1B8] tracking-wider hidden sm:block">
              {isAmharic
                ? "የሳተላይት ምልክቶች (ዝናብ፣ የአፈር እርጥበት፣ እፅዋት) ቅንጅታዊ ትንተና እና አዝማሚያ"
                : "Tri-sensor convergence · Mann-Kendall trend tests · Cross-correlation lead-lag"}
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Quick Info Drawer Toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all border ${
              showInfo
                ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_12px_rgba(40,215,197,0.2)]"
                : "bg-panel-dark/60 border-panel-border/40 text-[#93A1B8] hover:text-white hover:border-accent-cyan/40"
            }`}
            title="Investigation Guide & Info"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isAmharic ? "መመሪያ" : "Lab Guide"}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1.5 rounded-full text-xs font-mono bg-panel-dark/60 border border-panel-border/40 text-[#93A1B8] hover:text-white hover:border-accent-cyan/40 transition-all flex items-center gap-1.5"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-accent-cyan" />
                <span>{isAmharic ? "ውጣ" : "Normal"}</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-accent-cyan" />
                <span className="hidden sm:inline">{isAmharic ? "ሙሉ ስክሪን" : "Fullscreen"}</span>
              </>
            )}
          </button>

          {/* Open Standalone HTML */}
          <a
            href="/lab.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full text-xs font-mono bg-accent-blue/30 border border-accent-blue/60 text-[#FBFCFD] hover:bg-accent-blue/50 hover:border-accent-cyan transition-all flex items-center gap-1.5"
            title="Open Standalone Workbench in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="hidden sm:inline">{isAmharic ? "በአዲስ መስኮት" : "Standalone"}</span>
          </a>
        </div>
      </div>

      {/* Guide Banner Drawer (collapsible) */}
      {showInfo && (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-4 bg-[#0a0e16]/95 border-b border-[rgba(40,215,197,0.2)] backdrop-blur-xl animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-[#A8BFDC]">
            <div className="p-3.5 rounded-2xl bg-[#040507]/60 border border-[rgba(168,191,220,0.12)]">
              <span className="font-michroma text-[11px] text-accent-cyan block mb-1">
                1. SELECT LOCATION & RADIUS
              </span>
              <p className="text-[11px] leading-relaxed text-[#93A1B8]">
                {isAmharic
                  ? "ከቅድመ-ዝግጅቶች (ቦረና፣ አፋር፣ ትግራይ፣ ሶማሌ) ይምረጡ ወይም ካርታውን በመጫን የፍተሻ ማዕከሉን እና ራዲየስን ያስተካክሉ።"
                  : "Click anywhere on the Ethiopia map canvas or pick presets (Borena, Afar, Tigray, Somali). Adjust radius (25–600 km) to average surrounding satellite grid cells."}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#040507]/60 border border-[rgba(168,191,220,0.12)]">
              <span className="font-michroma text-[11px] text-[#7FA6E8] block mb-1">
                2. SENSOR DEPARTURE & TIME
              </span>
              <p className="text-[11px] leading-relaxed text-[#93A1B8]">
                {isAmharic
                  ? "የወር ስክረበሩን በማንቀሳቀስ ወይም 'Play' በመጫን የዝናብ፣ የአፈር እና የዕፅዋት አኖማሊዎችን በጊዜ ሂደት ይመልከቱ።"
                  : "Scrub through 15+ years of monthly observations. Toggle Anomaly (σ) vs Raw baseline envelopes, and check the Drought Fingerprint grid to spot leading signals."}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#040507]/60 border border-[rgba(168,191,220,0.12)]">
              <span className="font-michroma text-[11px] text-[#A6D96A] block mb-1">
                3. EVIDENCE & CUSTOM DATA
              </span>
              <p className="text-[11px] leading-relaxed text-[#93A1B8]">
                {isAmharic
                  ? "የማን-ኬንዳል አዝማሚያ፣ የመሪ ምልክት (Lead/Lag) ትንተና፣ እና የራስዎን የCSV ዳታ በመጫን የራስዎን ጥናት ያካሂዱ።"
                  : "View automated evidence checks, Sen's slope trend test, and cross-correlation. Drag-and-drop your own CSV/JSON files or export the investigation summary."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Lab Workbench (Full fidelity) */}
      <div className="w-full relative min-h-[900px] overflow-hidden">
        <iframe
          ref={iframeRef}
          src="/lab.html"
          title="Drought Investigation Lab Workbench"
          className="w-full border-0 transition-all duration-300"
          style={{ height: `${iframeHeight}px` }}
        />
      </div>
    </div>
  );
}
