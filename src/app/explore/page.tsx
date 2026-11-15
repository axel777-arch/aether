"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import type { MapLayerType } from "@/components/LeafletMapInner";
import overlay from "@/data/ethiopiaZoneDatasetOverlay.json";
import { CloudRain, Map as MapIcon, MapPin, Thermometer } from "lucide-react";

const DynamicMap = dynamic(
  () => import("@/components/LeafletMapInner").then((mod) => ({ default: mod.LeafletMapInner })),
  { ssr: false, loading: () => <div className="w-full h-full bg-panel-dark animate-pulse" /> },
);

const layers: {
  id: MapLayerType;
  label: string;
  icon: React.ReactNode;
  source: string;
  limitation: string;
}[] = [
  {
    id: "normal",
    label: "Normal",
    icon: <MapIcon className="w-4 h-4" />,
    source: "Supplied Ethiopia 72-zone GeoJSON",
    limitation: "Shows administrative boundaries with fixed parent-region outline colors and no environmental shading.",
  },
  {
    id: "temperature",
    label: "Temperature",
    icon: <Thermometer className="w-4 h-4" />,
    source: overlay.datasets.surfaceTemperature.source,
    limitation: `${overlay.datasets.surfaceTemperature.zonesWithData}/72 zones have static grid-point means (${overlay.datasets.surfaceTemperature.temporalCoverage}); daytime surface temperature is not air temperature or a current reading.`,
  },
  {
    id: "rainfall",
    label: "Rainfall",
    icon: <CloudRain className="w-4 h-4" />,
    source: overlay.datasets.rainfall.source,
    limitation: `Latest observation: ${overlay.datasets.rainfall.latestObservation.date}. The source is one Ethiopia-wide value with unstated units, so every zone receives the same fill; this is not zonal rainfall.`,
  },
];

export default function ExplorePage() {
  const { lang, selectedRegionId, setSelectedRegionId } = useApp();
  const [selectedMapLayer, setSelectedMapLayer] = useState<MapLayerType>("normal");
  const selectedLayer = layers.find((layer) => layer.id === selectedMapLayer) ?? layers[0];
  const observationPeriod = selectedMapLayer === "temperature"
    ? overlay.datasets.surfaceTemperature.temporalCoverage
    : selectedMapLayer === "rainfall"
      ? `${overlay.datasets.rainfall.temporalCoverage.start} to ${overlay.datasets.rainfall.temporalCoverage.end}`
      : "Not applicable";
  const spatialResolution = selectedMapLayer === "temperature"
    ? overlay.datasets.surfaceTemperature.spatialResolution
    : selectedMapLayer === "rainfall"
      ? "Ethiopia-wide average; not zone-resolved"
      : "Administrative zones";
  const regionName = selectedRegionId === "borena"
    ? "Borena Zone (Oromia)"
    : selectedRegionId === "somali"
      ? "Somali Region (Fafan)"
      : selectedRegionId === "tigray"
        ? "Tigray Region (Central Highlands)"
        : selectedRegionId;

  return (
    <div className="min-h-[calc(100vh-52px)] flex flex-col p-2.5 lg:p-4 gap-3 bg-[#040507]">
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-[620px]">
        <section className="w-full lg:w-3/4 min-h-[460px] relative rounded-2xl overflow-hidden border border-panel-border/40 bg-panel-dark shadow-2xl">
          <DynamicMap
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
            selectedMapLayer={selectedMapLayer}
          />
          <div className="absolute top-3.5 left-3.5 z-[600] flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[#162036]/95 backdrop-blur-md border border-[#41619F]/40 shadow-xl">
            {layers.map((layer) => {
              const isActive = selectedMapLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedMapLayer(layer.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs transition-colors ${
                    isActive
                      ? "bg-accent-blue text-white border border-accent-cyan/80"
                      : "text-text-secondary hover:text-text-primary border border-transparent"
                  }`}
                >
                  {layer.icon}
                  <span>{layer.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="w-full lg:w-1/4 nasa-panel-blue p-5 rounded-2xl border border-panel-border/40 space-y-5">
          <header className="border-b border-panel-border/30 pb-4">
            <div className="text-[10px] font-mono tracking-widest text-amber-300 uppercase font-bold">
              Historical data layers
            </div>
            <h1 className="mt-1 text-lg font-bold text-text-primary">
              {lang === "am" ? "የድርቅ ማስረጃ ምርመራ" : "Drought evidence investigation"}
            </h1>
            <p className="mt-2 text-xs text-text-secondary leading-relaxed">
              Historical dataset summaries are shown where available; this is not a live monitoring service.
            </p>
          </header>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Region / zone</span>
            <span className="relative block">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent-light" />
              <select
                value={selectedRegionId}
                onChange={(event) => setSelectedRegionId(event.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-panel-dark border border-panel-border/60 text-xs text-text-primary font-mono focus:outline-none focus:border-accent-cyan"
              >
                <option value="borena">Borena Zone (Oromia)</option>
                <option value="somali">Somali Region (Fafan)</option>
                <option value="tigray">Tigray Region (Central Highlands)</option>
              </select>
            </span>
          </label>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200">Assessment</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-200 border border-amber-500/40">
                Insufficient data
              </span>
            </div>
            <p className="text-xs text-text-primary font-medium">{regionName}</p>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              No drought classification or stress score is issued without verified observations and a defensible baseline.
            </p>
          </div>

          <div className="space-y-2.5">
            <h2 className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">Selected evidence layer</h2>
            <div className="p-3 rounded-xl bg-panel-dark/70 border border-panel-border/40 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                {selectedLayer.icon}
                {selectedLayer.label}
              </div>
              <p className="text-[11px] text-accent-light">{selectedLayer.source}</p>
              <p className="text-[11px] text-text-secondary leading-relaxed">{selectedLayer.limitation}</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-2 rounded-lg bg-panel-dark/60 border border-panel-border/30">
              <dt className="text-text-subtle">Observation period</dt>
              <dd className="mt-1 text-text-primary">{observationPeriod}</dd>
            </div>
            <div className="p-2 rounded-lg bg-panel-dark/60 border border-panel-border/30">
              <dt className="text-text-subtle">Dataset status</dt>
              <dd className="mt-1 text-text-primary">{selectedMapLayer === "normal" ? "Boundary file" : "Static summary"}</dd>
            </div>
            <div className="p-2 rounded-lg bg-panel-dark/60 border border-panel-border/30">
              <dt className="text-text-subtle">Spatial resolution</dt>
              <dd className="mt-1 text-text-primary">{spatialResolution}</dd>
            </div>
            <div className="p-2 rounded-lg bg-panel-dark/60 border border-panel-border/30">
              <dt className="text-text-subtle">Boundary source</dt>
              <dd className="mt-1 text-amber-200">Supplied GeoJSON</dd>
            </div>
          </dl>

          <p className="text-[10px] text-text-subtle leading-relaxed">
            Temperature shading uses historical, unweighted grid-cell means where available. Rainfall shading uses the dataset's final Ethiopia-wide observation uniformly because the file contains no zone-specific values. These are value scales, not correlations; the files lack paired zone-by-time rainfall and temperature observations. Neither layer represents current conditions.
          </p>
        </aside>
      </div>
    </div>
  );
}
