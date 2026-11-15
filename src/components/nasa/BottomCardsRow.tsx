"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const BottomCardsRow: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full z-20 pointer-events-auto select-none">
      {/* CARD 1 (Left - matching 'Satellites by Country' with 5300 & vertical dotted equalizer bars) */}
      <div className="nasa-reference-glass p-5 flex flex-col justify-between group hover:border-accent-cyan/40 transition-all shadow-xl">
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-sans text-[#A8BFDC]">Drought Severity by Region</span>
            <Link href="/compare" className="text-[#999CA0] hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-michroma text-3xl font-bold text-[#FBFCFD] tracking-wider">
              5300
            </span>
            <span className="text-[11px] font-mono text-[#999CA0]">Woredas at Risk</span>
          </div>
        </div>

        {/* Vertical Dotted Equalizer Bars matching reference exactly */}
        <div className="mt-6 flex items-end justify-between gap-2 h-28 px-1">
          {[
            { label: "Borena", pct: 90, active: true },
            { label: "Somali", pct: 60, active: false },
            { label: "Afar", pct: 45, active: false },
            { label: "Tigray", pct: 30, active: false },
            { label: "Oromia", pct: 20, active: false },
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              {/* Dotted capsule bar */}
              <div
                className={`w-full max-w-[28px] rounded-lg p-1 flex flex-col items-center justify-end gap-1 transition-all ${
                  bar.active
                    ? "bg-accent-cyan/15 border border-accent-cyan/80 shadow-[0_0_15px_rgba(40,215,197,0.3)]"
                    : "border border-[rgba(168,191,220,0.12)] hover:border-accent-cyan/40"
                }`}
                style={{ height: `${bar.pct}%` }}
              >
                {/* Dots inside bar */}
                <span className={`w-1.5 h-1.5 rounded-full ${bar.active ? "bg-accent-cyan animate-pulse" : "bg-[#41619f]"}`} />
                <span className={`w-1.5 h-1.5 rounded-full ${bar.active ? "bg-white" : "bg-[#253352]"}`} />
              </div>
              <span className="text-[9px] font-mono text-[#999CA0] truncate uppercase">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CARD 2 (Middle - matching 'Releases' with date pills Jan 12, Feb 05, Mar 20) */}
      <div className="nasa-reference-glass p-5 flex flex-col justify-between group hover:border-accent-cyan/40 transition-all shadow-xl">
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-sans text-[#A8BFDC]">Releases &amp; Satellite Passes</span>
            <Link href="/data" className="text-[#999CA0] hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Date Pills Header matching reference */}
          <div className="flex items-center gap-2 mt-2">
            {["Jan 12", "Feb 05", "Mar 20"].map((date, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-[10px] font-mono ${
                  idx === 0
                    ? "bg-accent-blue/30 text-accent-light border border-accent-blue/50 font-bold"
                    : "bg-[#162036]/60 text-[#999CA0] border border-[rgba(168,191,220,0.1)]"
                }`}
              >
                {date}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Pass Items matching reference columns */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-left">
          <div className="space-y-1">
            <div className="text-[11px] font-sans font-bold text-[#FBFCFD] leading-tight">
              GPM IMERG V07
            </div>
            <div className="text-[10px] font-mono text-[#999CA0]">22 Woredas</div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-accent-cyan pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              <span>Oromia</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-sans font-bold text-[#FBFCFD] leading-tight">
              FLDAS Noah LSM
            </div>
            <div className="text-[10px] font-mono text-[#999CA0]">8 Basins</div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-sky-400 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>Somali</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-sans font-bold text-[#FBFCFD] leading-tight">
              MODIS NDVI
            </div>
            <div className="text-[10px] font-mono text-[#999CA0]">Rangeland</div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Borena</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3 (Right - matching 'Satellites by purpose' with horizontal progress meters) */}
      <div className="nasa-reference-glass p-5 flex flex-col justify-between group hover:border-accent-cyan/40 transition-all shadow-xl">
        <div>
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-sans text-[#A8BFDC]">Signals by Indicator</span>
            <Link href="/fingerprint" className="text-[#999CA0] hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Indicator Progress Meters matching reference lines and counts */}
        <div className="space-y-2 mt-2 text-xs font-sans">
          {[
            { name: "Precipitation (GPM)", count: 5200, width: "88%" },
            { name: "Soil Moisture (FLDAS)", count: 1100, width: "65%" },
            { name: "Vegetation Health (NDVI)", count: 150, width: "40%" },
            { name: "Surface Water (SWOT)", count: 800, width: "55%" },
            { name: "Ground Truth Stations", count: 300, width: "25%" },
            { name: "Others", count: 200, width: "15%" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-[#A8BFDC] w-36 truncate font-sans">{item.name}</span>
              <div className="flex-1 h-1 bg-[#162036] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full"
                  style={{ width: item.width }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#FBFCFD] w-10 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
