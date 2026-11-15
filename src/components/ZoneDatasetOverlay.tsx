"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import overlay from "@/data/ethiopiaZoneDatasetOverlay.json";
import { isEthiopiaZoneFeatureCollection, type EthiopiaZoneFeatureCollection } from "@/lib/zone-boundaries";

type OverlayLayer = "soilMoisture" | "surfaceTemperature";
type ZoneValue = { mean: number; gridCellCount: number } | null;
type ZoneFeatureCollection = EthiopiaZoneFeatureCollection;

const PALETTE = ["#365c8d", "#277da1", "#43aa8b", "#f9c74f", "#f9844a"];

function getZoneValue(layer: OverlayLayer, id: string): ZoneValue {
  const entries = Object.entries(overlay.datasets[layer].zones);
  return entries.find(([zoneId]) => zoneId === id)?.[1] ?? null;
}

function layerDetails(layer: OverlayLayer) {
  const dataset = overlay.datasets[layer];
  return {
    name: dataset.name,
    units: dataset.units,
    source: dataset.source,
    temporalCoverage: dataset.temporalCoverage,
    spatialResolution: dataset.spatialResolution,
    spatialMethod: dataset.spatialMethod,
    zonesWithData: dataset.zonesWithData,
    zoneValues: Object.values(dataset.zones).filter((value): value is Exclude<ZoneValue, null> => value !== null),
  };
}

function colorFor(value: number, minimum: number, maximum: number) {
  if (maximum <= minimum) return PALETTE[2];
  const normalized = (value - minimum) / (maximum - minimum);
  const index = Math.min(PALETTE.length - 1, Math.floor(normalized * PALETTE.length));
  return PALETTE[index];
}

export function ZoneDatasetOverlay() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const zonesLayerRef = useRef<L.GeoJSON | null>(null);
  const [features, setFeatures] = useState<ZoneFeatureCollection | null>(null);
  const [layer, setLayer] = useState<OverlayLayer>("soilMoisture");
  const [selectedZoneId, setSelectedZoneId] = useState("13679");
  const [loadError, setLoadError] = useState<string | null>(null);

  const selectedZone = useMemo(() => {
    const feature = features?.features.find((item) => String(item.properties.ID_2) === selectedZoneId);
    if (!feature) return null;
    return {
      name: `${feature.properties.NAME_2}, ${feature.properties.NAME_1}`,
      value: getZoneValue(layer, selectedZoneId),
    };
  }, [features, layer, selectedZoneId]);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;
    const map = L.map(mapElementRef.current, { zoomControl: true, minZoom: 4, maxZoom: 12 })
      .setView([9.1, 40.5], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    zonesLayerRef.current = L.geoJSON().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      zonesLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/zone-data/ethiopia_zones.geojson", { cache: "force-cache" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Boundary request failed with HTTP ${response.status}.`);
        const payload: unknown = await response.json();
        if (!isEthiopiaZoneFeatureCollection(payload, overlay.boundary.featureCount)) {
          throw new TypeError("The boundary file did not match the validated 72-zone GeoJSON structure.");
        }
        return payload;
      })
      .then((payload) => {
        if (active) {
          setFeatures(payload);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Unable to load the zone boundary.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const zonesLayer = zonesLayerRef.current;
    if (!map || !zonesLayer || !features) return;
    zonesLayer.clearLayers();
    const details = layerDetails(layer);
    const values = details.zoneValues.map((item) => item.mean);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const plotted = L.geoJSON(features, {
      style: (feature) => {
        const zoneId = String(feature?.properties?.ID_2 ?? "");
        const value = getZoneValue(layer, zoneId);
        return {
          color: zoneId === selectedZoneId ? "#f8fafc" : "#b9d1e8",
          weight: zoneId === selectedZoneId ? 2 : 0.8,
          fillColor: value ? colorFor(value.mean, minimum, maximum) : "#364152",
          fillOpacity: value ? 0.8 : 0.35,
        };
      },
      onEachFeature: (feature, polygon) => {
        const zoneId = String(feature.properties.ID_2);
        const zoneName = `${feature.properties.NAME_2}, ${feature.properties.NAME_1}`;
        const value = getZoneValue(layer, zoneId);
        const tooltip = document.createElement("span");
        tooltip.textContent = value
          ? `${zoneName} — ${value.mean} ${details.units} (${value.gridCellCount} grid cells)`
          : `${zoneName} — no grid-cell center available`;
        polygon.bindTooltip(tooltip, { sticky: true });
        polygon.on("click", () => setSelectedZoneId(zoneId));
      },
    });
    zonesLayer.addLayer(plotted);
    if (map.getZoom() < 5) map.fitBounds(plotted.getBounds(), { padding: [12, 12] });
  }, [features, layer, selectedZoneId]);

  const details = layerDetails(layer);
  const scaleMinimum = Math.min(...details.zoneValues.map((value) => value.mean));
  const scaleMaximum = Math.max(...details.zoneValues.map((value) => value.mean));

  return (
    <section className="space-y-4 rounded-3xl nasa-panel border border-panel-border/30 p-5">
      <header className="space-y-1">
        <h2 className="text-base font-bold uppercase tracking-wider text-text-primary">
          72-zone spatial data overlay
        </h2>
        <p className="text-xs leading-relaxed text-text-secondary">
          Zone boundaries are overlaid with the available NASA grid-cell values. Select a zone to inspect its spatial summary.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-panel-border/40 bg-[#040507]">
          <div ref={mapElementRef} className="h-[420px] w-full" aria-label="Map of Ethiopia's 72 administrative zones" />
          {loadError && (
            <div role="alert" className="absolute left-3 right-3 top-3 z-[500] rounded-xl border border-red-500/40 bg-panel-dark/95 p-3 text-xs text-red-200">
              Zone map unavailable: {loadError}
            </div>
          )}
          <div className="absolute bottom-3 left-3 z-[500] rounded-xl border border-panel-border/40 bg-panel-dark/95 p-2 text-[10px] text-text-primary">
            {details.name} · zone grid means · {details.units}
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-panel-border/30 bg-panel-dark/60 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLayer("soilMoisture")}
              aria-pressed={layer === "soilMoisture"}
              className={`rounded-lg px-3 py-2 text-[11px] ${layer === "soilMoisture" ? "bg-accent-blue text-white" : "text-text-secondary"}`}
            >
              Surface soil wetness
            </button>
            <button
              type="button"
              onClick={() => setLayer("surfaceTemperature")}
              aria-pressed={layer === "surfaceTemperature"}
              className={`rounded-lg px-3 py-2 text-[11px] ${layer === "surfaceTemperature" ? "bg-accent-blue text-white" : "text-text-secondary"}`}
            >
              Surface temperature
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary">{details.name}</h3>
            <p className="mt-1 text-[10px] leading-relaxed text-text-secondary">{details.source}</p>
            <div className="mt-3 space-y-1">
              <div className="flex items-center gap-1" aria-label="Color scale from lower to higher zone means">
                {PALETTE.map((color) => (
                  <span key={color} className="h-2 flex-1 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-text-subtle">
                <span>Lower mean · {scaleMinimum}</span>
                <span>Higher mean · {scaleMaximum}</span>
              </div>
            </div>
            <dl className="mt-3 space-y-2 text-[10px]">
              <div className="flex justify-between gap-2">
                <dt className="text-text-subtle">Temporal coverage</dt>
                <dd className="text-right text-text-primary">{details.temporalCoverage}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-subtle">Grid resolution</dt>
                <dd className="text-right text-text-primary">{details.spatialResolution}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-subtle">Zones with values</dt>
                <dd className="text-right text-text-primary">{details.zonesWithData} / 72</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-panel-border/30 bg-panel-dark/70 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-subtle">Selected zone</p>
            {selectedZone ? (
              <>
                <p className="mt-1 text-xs font-bold text-text-primary">{selectedZone.name}</p>
                {selectedZone.value ? (
                  <p className="mt-2 text-lg font-bold text-accent-cyan">
                    {selectedZone.value.mean} <span className="text-xs">{details.units}</span>
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-amber-200">No grid-cell center falls inside this zone.</p>
                )}
                {selectedZone.value && (
                  <p className="mt-1 text-[10px] text-text-secondary">
                    Mean of {selectedZone.value.gridCellCount} grid-cell center(s)
                  </p>
                )}
              </>
            ) : (
              <p className="mt-2 text-xs text-text-secondary">Choose a zone on the map.</p>
            )}
          </div>

          <div className="space-y-1 text-[10px] leading-relaxed text-amber-200/90">
            <p>{details.spatialMethod}</p>
            <p>These are static time-averaged grid values, not current conditions or monthly series.</p>
            <p>They are not used to calculate drought severity or train the forecast model.</p>
          </div>
        </aside>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">Rainfall cannot be overlaid by zone</h3>
          <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
            The rainfall CSV contains daily Ethiopia-bounding-box averages without zone or grid coordinates. Its units are unstated, so it is not joined to the zone polygons or used as a model target.
          </p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-200">Zone-specific model training is not ready</h3>
          <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
            No paired monthly per-zone rainfall and soil-moisture series are available. The soil and temperature files are long-period spatial averages; training on them as monthly records would create false temporal information.
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-text-secondary">
            Needed: quality-screened monthly values for each zone, with units, valid observation dates, dataset versions, and extraction provenance.
          </p>
        </div>
      </div>
    </section>
  );
}
