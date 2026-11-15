"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { translations } from "@/data/translations";
import { Satellite, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  const { lang } = useApp();
  const t = translations[lang];

  return (
    <footer className="w-full border-t border-panel-border/20 bg-[#040507]">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-panel-dark border border-accent-cyan/40 shadow-[0_0_15px_rgba(40,215,197,0.3)] shrink-0">
                <img
                  src="/aether-logo.png"
                  alt="Aether logo"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-heading font-bold text-text-primary tracking-wider text-base">
                {t.appName}
              </span>
            </div>
            <p className="text-text-subtle text-[11px] leading-relaxed max-w-xs">
              NASA POWER / MERRA-2 point data and static 72-zone soil-wetness / surface-temperature summaries are available. The experimental rainfall predictor is historical and national-box only; zonal monthly observation feeds are not connected.
            </p>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-panel-dark/80 border border-accent-blue/30 w-fit">
              <Satellite className="w-3 h-3 text-accent-cyan" />
              <span className="text-[10px] font-mono text-accent-light">NASA Space Apps Challenge 2026</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-text-secondary font-mono font-bold uppercase tracking-widest text-[10px]">Platform</h4>
            <nav className="flex flex-col gap-1.5">
              <Link href="/explore" className="text-text-subtle hover:text-accent-cyan transition-colors">Explore Ethiopia</Link>
              <Link href="/fingerprint" className="text-text-subtle hover:text-accent-cyan transition-colors">Drought Fingerprint</Link>
              <Link href="/trends" className="text-text-subtle hover:text-accent-cyan transition-colors">Trend Detective</Link>
              <Link href="/predict" className="text-text-subtle hover:text-accent-cyan transition-colors">Experimental Predictor</Link>
              <Link href="/compare" className="text-text-subtle hover:text-accent-cyan transition-colors">Regional Comparison</Link>
              <Link href="/alerts" className="text-text-subtle hover:text-accent-cyan transition-colors">Aether Alert</Link>
              <Link href="/datasets" className="text-text-subtle hover:text-accent-cyan transition-colors">Dataset Explorer</Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-text-secondary font-mono font-bold uppercase tracking-widest text-[10px]">Resources</h4>
            <nav className="flex flex-col gap-1.5">
              <Link href="/data" className="text-text-subtle hover:text-accent-cyan transition-colors">Data Explorer</Link>
              <Link href="/methodology" className="text-text-subtle hover:text-accent-cyan transition-colors">Methodology</Link>
              <a href="https://www.spaceappschallenge.org/" target="_blank" rel="noreferrer" className="text-text-subtle hover:text-accent-cyan transition-colors flex items-center gap-1">
                Space Apps <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a href="https://earthdata.nasa.gov/" target="_blank" rel="noreferrer" className="text-text-subtle hover:text-accent-cyan transition-colors flex items-center gap-1">
                NASA Earthdata <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </nav>
          </div>

          {/* Data Sources */}
          <div className="space-y-3">
            <h4 className="text-text-secondary font-mono font-bold uppercase tracking-widest text-[10px]">Candidate Sources · Not Integrated</h4>
            <div className="space-y-2 text-[11px] text-text-subtle">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>Rainfall: GPM IMERG / CHIRPS v3</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                <span>Soil moisture: FLDAS / SMAP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Vegetation: MODIS MOD13A2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-panel-border/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-text-subtle">
          <span>Aether — Beyond Rainfall | 2026 NASA Space Apps Challenge</span>
          <span>Ethiopia | Borena Zone Case Study | Open Science</span>
        </div>
      </div>
    </footer>
  );
};
