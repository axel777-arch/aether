"use client";

import React, { useState } from "react";
import { translations, Language } from "@/data/translations";
import { FingerprintDiagnosis } from "@/lib/droughtEngine";
import { MannKendallResult } from "@/lib/stats";
import { 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Clock, 
  MapPin, 
  FileText, 
  BookOpen
} from "lucide-react";

interface InsightsPanelProps {
  lang: Language;
  diagnosis: FingerprintDiagnosis;
  trendResult: MannKendallResult;
  regionName: string;
  observationDate: string;
  scientificExplanation: { english: string; amharic: string };
  onNavigateToFingerprint: () => void;
  onNavigateToTrend: () => void;
  onNavigateToMethodology: () => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  lang,
  diagnosis,
  trendResult,
  regionName,
  observationDate,
  scientificExplanation,
  onNavigateToFingerprint,
  onNavigateToTrend,
  onNavigateToMethodology,
}) => {
  const t = translations[lang];
  const [explanationMode, setExplanationMode] = useState<"research" | "policy">("research");

  // Trend direction styling
  const isDeclining = trendResult.trend === "decreasing";
  const isIncreasing = trendResult.trend === "increasing";

  return (
    <aside className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-3 p-4 rounded-3xl nasa-panel-blue shadow-2xl border border-accent-secondary/35 text-xs font-mono">
      {/* Panel Top Header: ✨ DROUGHT INSIGHTS */}
      <div className="flex items-center justify-between pb-2 border-b border-panel-border/30">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-accent-cyan/15 text-accent-cyan">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold font-mono tracking-wider text-text-primary uppercase">
            {t.insights.heading}
          </h3>
        </div>
        <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-accent-cyan/20 text-accent-cyan rounded-full border border-accent-cyan/40">
          INPUT SERIES · UNVERIFIED
        </span>
      </div>

      {/* CARD 1: Drought Fingerprint */}
      <div className="p-3.5 rounded-2xl bg-panel-dark/75 border border-panel-border/40 hover:border-accent-cyan/50 transition-all group">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-[10px] text-text-subtle tracking-widest uppercase block">
              DIAGNOSTIC SIGNAL
            </span>
            <h4 className="text-sm font-bold text-text-primary tracking-wide">
              {lang === "am" ? diagnosis.titleAmharic : diagnosis.title}
            </h4>
          </div>
          <button
            onClick={onNavigateToFingerprint}
            className="p-1.5 rounded-full bg-panel hover:bg-accent-blue text-accent-light hover:text-white transition-colors"
            title="Inspect Fingerprint Engine"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Triple Indicator Signals */}
        <div className="grid grid-cols-3 gap-2 py-2 text-center text-[10px]">
          <div className="p-2 rounded-xl bg-black/40 border border-panel-border/20">
            <span className="text-text-secondary block mb-0.5">Rainfall</span>
            <span className={`font-bold ${diagnosis.indicators.rainfall.z < -1 ? 'text-red-400' : 'text-accent-cyan'}`}>
              {diagnosis.indicators.rainfall.label}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-panel-border/20">
            <span className="text-text-secondary block mb-0.5">Soil Moist</span>
            <span className={`font-bold ${diagnosis.indicators.soilMoisture.z < -1 ? 'text-red-400' : 'text-accent-cyan'}`}>
              {diagnosis.indicators.soilMoisture.label}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-panel-border/20">
            <span className="text-text-secondary block mb-0.5">NDVI Canopy</span>
            <span className={`font-bold ${diagnosis.indicators.vegetation.z < -1 ? 'text-amber-400' : 'text-accent-cyan'}`}>
              {diagnosis.indicators.vegetation.label}
            </span>
          </div>
        </div>

        {/* Warning / Decoupling Banner */}
        <div className="mt-2 p-2 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2 text-[10px] text-red-200">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <span>
            {lang === "am" ? diagnosis.summaryAmharic : diagnosis.summary}
          </span>
        </div>
      </div>

      {/* CARD 2: Environmental Trend (Mann-Kendall & Sen's Slope) */}
      <div className="p-3.5 rounded-2xl bg-panel-dark/75 border border-panel-border/40 hover:border-accent-secondary/70 transition-all">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-[10px] text-text-subtle tracking-widest uppercase block">
              EARTH SYSTEM TREND DETECTIVE
            </span>
            <h4 className="text-sm font-bold text-text-primary tracking-wide">
              {!trendResult.significant
                ? "No statistically significant trend"
                : isDeclining
                  ? "Significant downward trend"
                  : isIncreasing
                    ? "Significant upward trend"
                    : "No monotonic trend"}
            </h4>
          </div>
          <button
            onClick={onNavigateToTrend}
            className="p-1.5 rounded-full bg-panel hover:bg-accent-blue text-accent-light hover:text-white transition-colors"
            title="Open Trend Detective"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] py-1">
          <div className="p-2 rounded-xl bg-black/40 border border-panel-border/20">
            <span className="text-text-subtle text-[10px] block">Sen's Slope (Q)</span>
            <span className={`font-bold ${trendResult.sensSlope < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {trendResult.sensSlope > 0 ? `+${trendResult.sensSlope}` : trendResult.sensSlope} /yr
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/40 border border-panel-border/20">
            <span className="text-text-subtle text-[10px] block">Mann-Kendall (p)</span>
            <span className="font-bold text-accent-light">
              p = {trendResult.pValue}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-text-secondary border-t border-panel-border/20 pt-1.5">
          <span>Significance:</span>
          <span className="px-2 py-0.5 rounded bg-accent-blue/30 text-accent-light font-bold">
            {trendResult.significant ? "Significant (α = 0.05)" : "Non-significant"}
          </span>
        </div>
      </div>

      {/* CARD 3: Regional Observation */}
      <div className="p-3.5 rounded-2xl bg-panel-dark/75 border border-panel-border/40">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-text-subtle tracking-widest uppercase">
            GEOGRAPHIC TARGET
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
            <AlertTriangle className="w-3 h-3" /> NOT INDEPENDENTLY VERIFIED
          </span>
        </div>
        <div className="text-sm font-bold text-text-primary flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-accent-cyan" />
          <span>{regionName}</span>
        </div>
        <div className="text-[10px] text-text-secondary mt-1 flex items-center gap-2">
          <Clock className="w-3 h-3 text-accent-secondary" />
          <span>Selected record: {observationDate}</span>
        </div>
      </div>

      {/* CARD 4: Scientific Explanation */}
      <div className="p-3.5 rounded-2xl bg-panel-dark/75 border border-panel-border/40 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-text-subtle tracking-widest uppercase">
              SCIENTIFIC SYNTHESIS
            </span>
            <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-panel-border/30 text-[9px]">
              <button
                onClick={() => setExplanationMode("research")}
                className={`px-1.5 py-0.5 rounded ${explanationMode === "research" ? "bg-accent-blue text-white" : "text-text-subtle"}`}
              >
                Science
              </button>
              <button
                onClick={() => setExplanationMode("policy")}
                className={`px-1.5 py-0.5 rounded ${explanationMode === "policy" ? "bg-accent-blue text-white" : "text-text-subtle"}`}
              >
                Policy
              </button>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-text-secondary font-mono">
            {lang === "am" ? scientificExplanation.amharic : scientificExplanation.english}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-panel-border/30 flex items-center justify-between text-[10px]">
          <button
            onClick={onNavigateToMethodology}
            className="text-accent-cyan hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>Methodology & Caveats</span>
          </button>
          <span className="text-text-subtle font-mono">SOURCE NOT ATTACHED</span>
        </div>
      </div>
    </aside>
  );
};
