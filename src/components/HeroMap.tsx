"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import type { MapLayerType } from "./LeafletMapInner";
import { ArrowRight, CloudRain, Map as MapIcon, Thermometer } from "lucide-react";

const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[520px] rounded-3xl bg-panel-dark animate-pulse" />,
});

interface HeroMapProps {
  selectedLayer: MapLayerType;
  onLayerChange: (layer: MapLayerType) => void;
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
  onExploreClick: () => void;
}

const layerOptions: { id: MapLayerType; label: string; icon: React.ReactNode }[] = [
  { id: "normal", label: "Normal", icon: <MapIcon className="w-3.5 h-3.5" /> },
  { id: "temperature", label: "Temperature", icon: <Thermometer className="w-3.5 h-3.5" /> },
  { id: "rainfall", label: "Rainfall", icon: <CloudRain className="w-3.5 h-3.5" /> },
];

export const HeroMap: React.FC<HeroMapProps> = ({
  selectedLayer,
  onLayerChange,
  selectedRegionId,
  onSelectRegion,
  onExploreClick,
}) => {
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-full h-[580px] lg:h-[680px] rounded-3xl overflow-hidden border border-panel-border/40 bg-[#040507] shadow-2xl">
      <LeafletMapInner
        selectedRegionId={selectedRegionId}
        onSelectRegion={onSelectRegion}
        selectedMapLayer={selectedLayer}
      />
      <div className="absolute top-5 left-5 z-[600] max-w-[calc(100%-2.5rem)] flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-panel-dark/95 border border-panel-border/40">
        {layerOptions.map((layer) => (
          <button
            key={layer.id}
            type="button"
            aria-pressed={selectedLayer === layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs ${
              selectedLayer === layer.id ? "bg-accent-blue text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {layer.icon}{layer.label}
          </button>
        ))}
      </div>
      <div className="absolute top-20 left-5 z-[600] rounded-xl bg-panel-dark/95 border border-amber-500/40 px-3 py-2 text-[10px] font-mono text-amber-200">
        Historical summaries only; rainfall is an Ethiopia-wide value, not zone-specific.
      </div>
      <div className="absolute bottom-5 left-5 right-5 z-[600] flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && query.trim()) onExploreClick();
          }}
          aria-label="Region or environmental question"
          placeholder="Search or describe an environmental question"
          className="min-w-[220px] flex-1 rounded-full bg-panel-dark/95 border border-panel-border/50 px-4 py-3 text-xs text-text-primary placeholder:text-text-secondary"
        />
        <button
          onClick={onExploreClick}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-accent-blue hover:bg-accent-blue/80 text-white text-xs font-mono"
        >
          Open investigation map <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
