"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Info } from "lucide-react";

export const AiInsightsSidebar: React.FC = () => {
  return (
    <aside className="nasa-reference-glass p-5 w-full max-w-[340px] flex flex-col justify-between gap-4 text-[#FBFCFD] shadow-2xl select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(168,191,220,0.12)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <h2 className="font-michroma text-sm tracking-[0.15em] font-bold text-[#FBFCFD]">
            Research status
          </h2>
        </div>
        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-accent-blue/20 text-accent-light border border-accent-blue/30">
          NO LIVE FEED
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-michroma text-[#FBFCFD]">Historical rainfall</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#121929]/70 border border-[rgba(168,191,220,0.15)] hover:border-accent-cyan/40 transition-all group relative overflow-hidden">
          <div className="h-28 w-full rounded-xl overflow-hidden relative bg-black/40 border border-white/5 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80"
              alt="Illustrative Earth image"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-transparent" />
            <Link
              href="/predict"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#162036]/80 border border-white/10 flex items-center justify-center text-[#A8BFDC] group-hover:text-accent-cyan transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-2 text-[10px] font-mono text-[#999CA0] uppercase">
            Historical prototype
          </div>
          <div className="text-xs font-michroma font-bold text-[#FBFCFD]">
            GPM-based rainfall prediction
          </div>
          <div className="mt-2 text-[10px] leading-relaxed text-[#A8BFDC]">
            June 2025 output; this is not a current forecast or live observation.
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-michroma text-[#FBFCFD]">Spatial data summary</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#121929]/70 border border-[rgba(168,191,220,0.15)] hover:border-accent-cyan/40 transition-all group relative overflow-hidden">
          <div className="h-24 w-full rounded-xl overflow-hidden relative bg-black/40 border border-white/5 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&auto=format&fit=crop&q=80"
              alt="Illustrative Earth observation image"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-transparent to-transparent" />
            <Link
              href="/data"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#162036]/80 border border-white/10 flex items-center justify-center text-[#A8BFDC] group-hover:text-accent-cyan transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-2 text-[10px] font-mono text-[#999CA0] uppercase">
            Historical grid summary
          </div>
          <div className="text-xs font-michroma font-bold text-[#FBFCFD]">
            NASA MERRA-2 · GWETTOP
          </div>
          <div className="mt-2 text-[10px] leading-relaxed text-[#A8BFDC]">
            2000–2025 period mean, not a month-by-month time series.
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-michroma text-[#FBFCFD]">Available analysis</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#121929]/70 border border-[rgba(168,191,220,0.15)] hover:border-accent-cyan/40 transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-[#999CA0] uppercase">Geography</div>
              <div className="text-xs font-michroma font-bold text-[#FBFCFD]">72-zone boundary map</div>
            </div>
            <Link
              href="/explore"
              className="w-7 h-7 rounded-full bg-[#162036]/80 border border-white/10 flex items-center justify-center text-[#A8BFDC] group-hover:text-accent-cyan transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Link
            href="/datasets"
            className="mt-3 w-full py-2 px-3 rounded-full bg-[#1a243a] hover:bg-accent-cyan hover:text-[#040507] border border-accent-cyan/40 flex items-center justify-center gap-2 text-xs font-mono text-accent-cyan transition-all shadow-[0_0_12px_rgba(40,215,197,0.2)]"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Review dataset registry</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
