"use client";

import React, { useEffect, useState } from "react";
import { Radio } from "lucide-react";

interface MiniRadarCardProps {
  activeHotspotName?: string;
}

export const MiniRadarCard: React.FC<MiniRadarCardProps> = ({
  activeHotspotName = "BORENA",
}) => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nasa-reference-glass p-4 w-full max-w-[320px] h-[160px] relative overflow-hidden flex flex-col justify-between select-none">
      {/* Background Radar Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none radar-grid" />

      {/* Top Status */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#A8BFDC] z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="tracking-wider uppercase">SENSOR RADAR SCAN</span>
        </div>
        <span className="text-accent-cyan font-bold">LIVE · 0.1° GPM</span>
      </div>

      {/* Center Radar Sweep Circle */}
      <div className="relative mx-auto w-24 h-24 my-auto flex items-center justify-center">
        {/* Concentric distance rings */}
        <div className="absolute inset-0 rounded-full border border-accent-cyan/25" />
        <div className="absolute inset-3 rounded-full border border-accent-cyan/20 border-dashed" />
        <div className="absolute inset-6 rounded-full border border-accent-cyan/15" />

        {/* Crosshair lines */}
        <div className="absolute w-full h-[1px] bg-accent-cyan/25" />
        <div className="absolute h-full w-[1px] bg-accent-cyan/25" />

        {/* Sweeping Radar Line */}
        <div
          className="absolute w-12 h-[1.5px] origin-left bg-gradient-to-r from-accent-cyan to-transparent shadow-[0_0_8px_rgba(40,215,197,0.8)]"
          style={{
            left: "50%",
            transform: `rotate(${angle}deg)`,
          }}
        />

        {/* Radar Detection Blips */}
        <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping opacity-75" />
        <div className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#28d7c5]" />

        <div className="absolute bottom-5 right-7 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping opacity-60" />
        <div className="absolute bottom-5 right-7 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#f59e0b]" />

        <div className="absolute bottom-7 left-5 w-1 h-1 rounded-full bg-sky-400" />
      </div>

      {/* Telemetry Coordinates Footer */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#999CA0] z-10 pt-1 border-t border-[rgba(168,191,220,0.12)]">
        <span>04°32&apos;N 38°18&apos;E</span>
        <span className="text-[#A8BFDC]">STATION: YABELLO / TULA</span>
      </div>
    </div>
  );
};
