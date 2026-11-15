"use client";

import React from "react";
import { X, Plus, AlertTriangle, Layers, Droplets, Sprout } from "lucide-react";
import { Hotspot } from "./EthiopiaDottedGlobe";

interface RegionDetailCardProps {
  hotspot: Hotspot;
  onClose?: () => void;
  onAddComparison?: () => void;
}

export const RegionDetailCard: React.FC<RegionDetailCardProps> = ({
  hotspot,
  onClose,
  onAddComparison,
}) => {
  return (
    <div className="nasa-reference-glass p-6 w-full max-w-[320px] text-[#FBFCFD] shadow-2xl relative select-none">
      {/* Top Header: Code / Region Name & Close Button */}
      <div className="flex items-start justify-between pb-3">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#999CA0] uppercase block mb-1">
            Code
          </span>
          <h2 className="font-michroma text-xl tracking-wider font-bold text-[#FBFCFD]">
            {hotspot.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#162036]/80 hover:bg-[#253352] border border-[rgba(168,191,220,0.2)] flex items-center justify-center text-[#999CA0] hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2-Column Stats Grid matching reference */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-3 mt-3 pt-3 border-t border-[rgba(168,191,220,0.12)]">
        {/* Row 1: Precipitation Anomaly & Soil Moisture */}
        <div>
          <span className="text-[10px] font-sans text-[#999CA0] block leading-tight">
            Rainfall anomaly
          </span>
          <div className="font-michroma text-lg font-bold text-accent-cyan mt-0.5">
            {hotspot.anomaly}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-sans text-[#999CA0] block leading-tight">
            Root-zone soil
          </span>
          <div className="font-michroma text-sm font-bold text-sky-400 mt-0.5 leading-tight">
            {hotspot.soil}
          </div>
        </div>

        {/* Row 2: Observation Window & Drought Status */}
        <div>
          <span className="text-[10px] font-sans text-[#999CA0] block leading-tight">
            Obs. epoch
          </span>
          <div className="font-michroma text-base font-bold text-[#FBFCFD] mt-0.5">
            92 days
          </div>
        </div>

        <div>
          <span className="text-[10px] font-sans text-[#999CA0] block leading-tight">
            Drought status
          </span>
          <div className="font-michroma text-base font-bold text-amber-400 mt-0.5">
            {hotspot.status}
          </div>
        </div>
      </div>

      {/* Purpose / Focus Section */}
      <div className="mt-4 pt-3 border-t border-[rgba(168,191,220,0.12)]">
        <span className="text-[10px] font-sans text-[#999CA0] block">
          Primary focus
        </span>
        <p className="text-xs text-[#A8BFDC] italic mt-0.5 leading-relaxed font-sans pr-8">
          {hotspot.focus}
        </p>
      </div>

      {/* Floating Plus Button matching reference bottom right */}
      <button
        onClick={onAddComparison}
        className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#162036]/90 hover:bg-accent-cyan hover:text-[#040507] border border-[rgba(168,191,220,0.3)] flex items-center justify-center text-[#FBFCFD] transition-all shadow-lg group"
        title="Add to Regional Comparison"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
      </button>
    </div>
  );
};
