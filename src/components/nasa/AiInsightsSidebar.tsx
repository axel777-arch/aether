"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, AlertTriangle, Info, Satellite } from "lucide-react";

export const AiInsightsSidebar: React.FC = () => {
  return (
    <aside className="nasa-reference-glass p-5 w-full max-w-[340px] flex flex-col justify-between gap-4 text-[#FBFCFD] shadow-2xl select-none">
      {/* Top Header: ✦ IA Insights */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(168,191,220,0.12)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <h2 className="font-michroma text-sm tracking-[0.15em] font-bold text-[#FBFCFD]">
            IA Insights
          </h2>
        </div>
        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-accent-blue/20 text-accent-light border border-accent-blue/30">
          AUTONOMOUS
        </span>
      </div>

      {/* Card 1: Predictions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-michroma text-[#FBFCFD]">Predictions</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#121929]/70 border border-[rgba(168,191,220,0.15)] hover:border-accent-cyan/40 transition-all group relative overflow-hidden">
          {/* Satellite Image Graphic */}
          <div className="h-28 w-full rounded-xl overflow-hidden relative bg-black/40 border border-white/5 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80"
              alt="GPM Satellite Core"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-transparent" />
            <Link
              href="/fingerprint"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#162036]/80 border border-white/10 flex items-center justify-center text-[#A8BFDC] group-hover:text-accent-cyan transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-2 text-[10px] font-mono text-[#999CA0] uppercase">
            Satellite Observation
          </div>
          <div className="text-xs font-michroma font-bold text-[#FBFCFD]">
            GPM IMERG-3210
          </div>

          {/* Warning badge */}
          <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-[10px] text-amber-300 font-sans">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>Risk of pasture collapse (72h)</span>
          </div>
        </div>
      </div>

      {/* Card 2: About to Expire / Critical Anomaly */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-michroma text-[#FBFCFD]">About to expire</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#121929]/70 border border-[rgba(168,191,220,0.15)] hover:border-accent-cyan/40 transition-all group relative overflow-hidden">
          <div className="h-24 w-full rounded-xl overflow-hidden relative bg-black/40 border border-white/5 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&auto=format&fit=crop&q=80"
              alt="Satellite Sensor Telescope"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-transparent" />
            <Link
              href="/trends"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#162036]/80 border border-white/10 flex items-center justify-center text-[#A8BFDC] group-hover:text-accent-cyan transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-2 text-[10px] font-mono text-[#999CA0] uppercase">
            Sensor Mission
          </div>
          <div className="text-xs font-michroma font-bold text-[#FBFCFD]">
            FLDAS Noah LSM
          </div>

          <div className="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-[10px] text-red-300 font-sans">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
            <span>6 months below baseline</span>
          </div>
        </div>
      </div>

      {/* Card 3: Recommendations / Action Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-michroma text-[#FBFCFD]">Recommendations</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#121929]/70 border border-[rgba(168,191,220,0.15)] hover:border-accent-cyan/40 transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#999CA0] uppercase">Target Zone</div>
              <div className="text-xs font-michroma font-bold text-[#FBFCFD]">MODIS NDVI Vigor</div>
            </div>
            <Link
              href="/alerts"
              className="w-7 h-7 rounded-full bg-[#162036]/80 border border-white/10 flex items-center justify-center text-[#A8BFDC] group-hover:text-accent-cyan transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bottom Action Pill matching reference 'Adjust orbit' */}
          <Link
            href="/alerts"
            className="mt-3 w-full py-2 px-3 rounded-full bg-[#1a243a] hover:bg-accent-cyan hover:text-[#040507] border border-accent-cyan/40 flex items-center justify-center gap-2 text-xs font-mono text-accent-cyan transition-all shadow-[0_0_12px_rgba(40,215,197,0.2)]"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Adjust Water Response</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
