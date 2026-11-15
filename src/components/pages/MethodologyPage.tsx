"use client";

import React from "react";
import { translations, Language } from "@/data/translations";
import { 
  BookOpen, 
  ExternalLink, 
  Database, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  FileCode,
  Compass
} from "lucide-react";

interface MethodologyPageProps {
  lang: Language;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-mono">
      {/* Page Header */}
      <div className="p-6 rounded-3xl nasa-panel-blue border border-accent-secondary/35 shadow-2xl">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-accent-cyan" />
          <span className="text-xs tracking-widest text-accent-light uppercase">
            OPEN SCIENCE & TRANSPARENT PROVENANCE
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-wide">
          {t.methodology.title}
        </h1>
        <p className="text-xs text-text-secondary mt-1 max-w-3xl leading-relaxed">
          {t.methodology.subtitle}
        </p>
      </div>

      {/* NASA Satellite Datasets Ledger */}
      <div className="p-6 rounded-3xl nasa-panel border border-panel-border/30 space-y-4">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Database className="w-4 h-4 text-accent-cyan" />
          <span>Primary NASA Earth Observation Datasets</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* FLDAS */}
          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-panel-border/30 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1 border-b border-panel-border/20">
                <span className="font-bold text-sky-400">NASA FLDAS Noah LSM</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300">0.1° (~10km)</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
                Famine Land Data Assimilation System designed for drought early warning in Africa. Simulates 0-100cm root-zone soil water storage (m³/m³).
              </p>
              <div className="mt-3 space-y-1 text-[10px] text-text-subtle">
                <div>Temporal: Monthly (1982–Present)</div>
                <div>Sensor: Noah Land Surface Model 3.6.1</div>
              </div>
            </div>
            <a
              href="https://ldas.gsfc.nasa.gov/fldas"
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-accent-cyan hover:underline flex items-center gap-1 text-[10px]"
            >
              <span>ldas.gsfc.nasa.gov/fldas</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* GPM IMERG */}
          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-panel-border/30 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1 border-b border-panel-border/20">
                <span className="font-bold text-accent-cyan">NASA GPM IMERG</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">0.1° (~10km)</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
                Global Precipitation Measurement Integrated Multi-satellitE Retrievals. Final Run V06B/V07 monthly precipitation accumulation (mm/month).
              </p>
              <div className="mt-3 space-y-1 text-[10px] text-text-subtle">
                <div>Temporal: Monthly (2000–Present)</div>
                <div>Sensor: Dual-frequency Precipitation Radar & Radiometer Constellation</div>
              </div>
            </div>
            <a
              href="https://gpm.nasa.gov/data"
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-accent-cyan hover:underline flex items-center gap-1 text-[10px]"
            >
              <span>gpm.nasa.gov/data</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* MODIS NDVI */}
          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-panel-border/30 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-1 border-b border-panel-border/20">
                <span className="font-bold text-emerald-400">NASA MODIS Terra/Aqua</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">1km / 0.05°</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
                MOD13A2 / MYD13A2 16-day and monthly composites of Normalized Difference Vegetation Index (NDVI) monitoring rangeland canopy greenness.
              </p>
              <div className="mt-3 space-y-1 text-[10px] text-text-subtle">
                <div>Temporal: 16-Day / Monthly (2000–Present)</div>
                <div>Sensor: Moderate Resolution Imaging Spectroradiometer</div>
              </div>
            </div>
            <a
              href="https://modis.gsfc.nasa.gov/data/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-accent-cyan hover:underline flex items-center gap-1 text-[10px]"
            >
              <span>modis.gsfc.nasa.gov/data</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Mathematical Formulations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Standardized Anomaly Formulation */}
        <div className="p-6 rounded-3xl nasa-panel border border-panel-border/30 space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <Calculator className="w-4 h-4 text-accent-cyan" />
            <span>1. Standardized Monthly Anomaly Calculation</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-panel-border/30 font-mono text-center text-accent-cyan text-sm py-3">
            Z_y,m = (X_y,m - μ_m) / σ_m
          </div>

          <div className="text-xs text-text-secondary space-y-2 leading-relaxed">
            <p>
              Where <strong>X_y,m</strong> is the observed variable in year <em>y</em> and calendar month <em>m</em> (1..12). 
              <strong>μ_m</strong> is the multi-year monthly mean for month <em>m</em> over the baseline climatology (2000–2020), 
              and <strong>σ_m</strong> is the monthly sample standard deviation.
            </p>
            <p className="text-text-subtle text-[11px]">
              <strong>Why Calendar-Month Baselines are Essential:</strong> Ethiopia's precipitation is deeply seasonal. Comparing an April observation to an annual average would be meaningless; comparing April to historical Aprils isolates true meteorological anomalies.
            </p>
          </div>
        </div>

        {/* Mann-Kendall & Sen's Slope */}
        <div className="p-6 rounded-3xl nasa-panel border border-panel-border/30 space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <Compass className="w-4 h-4 text-accent-cyan" />
            <span>2. Mann-Kendall Test & Sen's Slope</span>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-panel-border/30 font-mono text-center text-amber-400 text-xs py-2.5">
            S = ∑ ∑ sgn(x_j - x_i) &nbsp;|&nbsp; Q_k = (x_j - x_i) / (j - i)
          </div>

          <div className="text-xs text-text-secondary space-y-2 leading-relaxed">
            <p>
              <strong>The Mann-Kendall test</strong> evaluates monotonic upward or downward trends without assuming normality. 
              Ties are corrected in Var(S). The standard normal Z-statistic generates a two-tailed p-value.
            </p>
            <p className="text-text-subtle text-[11px]">
              <strong>Sen's Slope:</strong> The median of all pairwise differences Q = median(Q_k). Highly robust against missing data, flash floods, and seasonal sensor blips.
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Caveats & Earth Observation Limitations */}
      <div className="p-6 rounded-3xl nasa-panel-blue border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
          <AlertTriangle className="w-4 h-4" />
          <span>Scientific Caveats, Limitations & Operational Boundaries</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-secondary leading-relaxed">
          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-panel-border/20 space-y-1.5">
            <span className="font-bold text-text-primary block">1. Satellite Indicators vs. Ground Impacts</span>
            <p>
              Satellite observations measure physical reflectance, precipitation radar echoes, and soil dielectric properties. Satellite indicators do not directly confirm crop losses, livestock mortality, household food insecurity, or humanitarian distress on the ground.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-panel-border/20 space-y-1.5">
            <span className="font-bold text-text-primary block">2. Environmental Recovery Lag</span>
            <p>
              Vegetation greenness frequently exhibits a 30 to 60-day lag behind precipitation failure. Conversely, superficial rainfall can prompt rapid weed green-up while deep root-zone soils remain starved. Environmental recovery does not equal household livelihood restoration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-panel-border/20 space-y-1.5">
            <span className="font-bold text-text-primary block">3. Alerts Are Not Disaster Declarations</span>
            <p>
              Aether alerts are scientific monitoring notifications intended to guide research and prompt field inspection. They are not official disaster declarations and do not replace official emergency response systems (such as EDRMC).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
