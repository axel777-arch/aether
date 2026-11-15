"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import overlay from "@/data/ethiopiaZoneDatasetOverlay.json";
import {
  isEthiopiaZoneFeatureCollection,
  type EthiopiaZoneFeatureCollection,
} from "@/lib/zone-boundaries";

export type MapLayerType = "normal" | "temperature" | "rainfall";

const BORENA_ZONE_ID = "13679";
const METRIC_PALETTE = ["#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c"];
const REGION_COLORS: Record<string, string> = {
  "Addis Ababa": "#38bdf8",
  Afar: "#f59e0b",
  Amhara: "#a78bfa",
  "Benshangul-Gumaz": "#34d399",
  "Dire Dawa": "#fb7185",
  "Gambela Peoples": "#2dd4bf",
  "Harari People": "#f472b6",
  Oromia: "#22d3ee",
  Somali: "#facc15",
  "Southern Nations, Nationalities and Peoples": "#4ade80",
  Tigray: "#818cf8",
};

type ZoneMetric = { mean: number; gridCellCount: number };

const temperatureDataset = overlay.datasets.surfaceTemperature;
const temperatureZoneValues = Object.values(temperatureDataset.zones).filter(
  (value): value is ZoneMetric => value !== null,
);
const temperatureMinimum = Math.min(...temperatureZoneValues.map((value) => value.mean));
const temperatureMaximum = Math.max(...temperatureZoneValues.map((value) => value.mean));
const rainfallDataset = overlay.datasets.rainfall;

function getTemperatureValue(zoneId: string): ZoneMetric | null {
  const entry = Object.entries(temperatureDataset.zones).find(([id]) => id === zoneId);
  return entry?.[1] ?? null;
}

function colorForValue(value: number, minimum: number, maximum: number) {
  if (maximum <= minimum) return METRIC_PALETTE[Math.floor(METRIC_PALETTE.length / 2)];
  const normalized = Math.min(1, Math.max(0, (value - minimum) / (maximum - minimum)));
  const index = Math.min(METRIC_PALETTE.length - 1, Math.floor(normalized * METRIC_PALETTE.length));
  return METRIC_PALETTE[index];
}

interface LeafletMapInnerProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
  selectedMapLayer: MapLayerType;
}

export default function LeafletMapInner({
  selectedRegionId,
  onSelectRegion,
  selectedMapLayer,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsGroupRef = useRef<L.FeatureGroup | null>(null);
  const fittedBoundsRef = useRef(false);
  const [features, setFeatures] = useState<EthiopiaZoneFeatureCollection | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState(
    selectedRegionId === "borena" ? BORENA_ZONE_ID : "",
  );
  const [boundaryError, setBoundaryError] = useState<string | null>(null);
  const [tileError, setTileError] = useState(false);
  const selectedZone = features?.features.find(
    (feature) => String(feature.properties.ID_2) === selectedZoneId,
  );
  const regionNames = [...new Set(features?.features.map((feature) => feature.properties.NAME_1) ?? [])].sort();

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [9.1, 40.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      crossOrigin: true,
    });

    osmLayer.on("tileerror", () => setTileError(true));
    osmLayer.on("load", () => setTileError(false));
    osmLayer.addTo(map);

    polygonsGroupRef.current = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    fetch("/zone-data/ethiopia_zones.geojson", {
      signal: controller.signal,
      cache: "force-cache",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Boundary request failed with HTTP ${response.status}.`);
        const payload: unknown = await response.json();
        if (!isEthiopiaZoneFeatureCollection(payload)) {
          throw new TypeError("The boundary file did not match the validated 72-zone GeoJSON structure.");
        }
        return payload;
      })
      .then((payload) => {
        if (active) {
          setFeatures(payload);
          setBoundaryError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setBoundaryError(error instanceof Error ? error.message : "Unable to load the zone boundaries.");
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (selectedRegionId === "borena") setSelectedZoneId(BORENA_ZONE_ID);
  }, [selectedRegionId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const polygons = polygonsGroupRef.current;
    if (!map || !polygons || !features) return;

    polygons.clearLayers();
    const zonesLayer = L.geoJSON(features, {
      style: (feature) => {
        const zoneId = String(feature?.properties?.ID_2 ?? "");
        const regionName = String(feature?.properties?.NAME_1 ?? "");
        const regionColor = REGION_COLORS[regionName] ?? "#7397bd";
        const isSelected = zoneId === selectedZoneId;
        const temperatureValue = selectedMapLayer === "temperature"
          ? getTemperatureValue(zoneId)
          : null;
        const metricFill = selectedMapLayer === "temperature"
          ? temperatureValue
            ? colorForValue(temperatureValue.mean, temperatureMinimum, temperatureMaximum)
            : "#364152"
          : selectedMapLayer === "rainfall"
            ? colorForValue(
                rainfallDataset.latestObservation.value,
                rainfallDataset.valueRange.minimum,
                rainfallDataset.valueRange.maximum,
              )
            : regionColor;
        return {
          color: regionColor,
          weight: isSelected ? 2.4 : 1,
          fillColor: metricFill,
          fillOpacity: selectedMapLayer === "normal"
            ? isSelected ? 0.2 : 0.035
            : selectedMapLayer === "temperature" && !temperatureValue
              ? 0.3
              : 0.78,
        };
      },
      onEachFeature: (feature, layer) => {
        const zoneId = String(feature.properties.ID_2);
        const zoneName = `${feature.properties.NAME_2}, ${feature.properties.NAME_1}`;
        const temperatureValue = getTemperatureValue(zoneId);
        const tooltipText = selectedMapLayer === "temperature"
          ? temperatureValue
            ? `${zoneName} — ${temperatureValue.mean.toFixed(2)} °C mean (${temperatureValue.gridCellCount} grid cells; ${temperatureDataset.temporalCoverage})`
            : `${zoneName} — no temperature grid-cell value`
          : selectedMapLayer === "rainfall"
            ? `${zoneName} — Ethiopia-wide value ${rainfallDataset.latestObservation.value.toFixed(3)} (units not stated; ${rainfallDataset.latestObservation.date}; not zone-specific)`
            : zoneName;
        layer.bindTooltip(tooltipText, { sticky: true, opacity: 0.95 });
        layer.on("click", () => {
          setSelectedZoneId(zoneId);
          if (zoneId === BORENA_ZONE_ID) onSelectRegion("borena");
          if (layer instanceof L.Polygon) {
            map.flyToBounds(layer.getBounds(), { maxZoom: 8, duration: 1.2 });
          }
        });
      },
    });
    polygons.addLayer(zonesLayer);
    if (!fittedBoundsRef.current) {
      const bounds = zonesLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [16, 16] });
        fittedBoundsRef.current = true;
      }
    }
  }, [features, onSelectRegion, selectedMapLayer, selectedZoneId]);

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px]">
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[460px] lg:min-h-[580px]"
        aria-label={`Map of Ethiopia's 72 administrative zones with ${selectedMapLayer} values`}
      />
      <div className="absolute bottom-3 left-3 z-[500] max-w-[calc(100%-1.5rem)] md:max-w-md rounded-xl border border-amber-500/40 bg-panel-dark/95 px-3 py-2 text-[10px] font-mono text-amber-200 shadow-xl">
        <strong className="block tracking-wide">
          {selectedMapLayer === "normal"
            ? "72 ADMINISTRATIVE ZONES · NORMAL VIEW"
            : selectedMapLayer === "temperature"
              ? "HISTORICAL DAYTIME SURFACE TEMPERATURE"
              : "ETHIOPIA-WIDE DAILY RAINFALL"}
        </strong>
        <span>
          {selectedMapLayer === "normal"
            ? "Parent-region boundary colors are shown without environmental shading. "
            : selectedMapLayer === "temperature"
              ? `${temperatureDataset.source}; ${temperatureDataset.temporalCoverage}. `
              : `${rainfallDataset.source}; latest observation ${rainfallDataset.latestObservation.date}. The source is nationwide, not zone-specific. `}
          {selectedZone
            ? `Selected: ${selectedZone.properties.NAME_2}, ${selectedZone.properties.NAME_1}. `
            : ""}
          {selectedMapLayer === "temperature"
            ? `${temperatureDataset.zonesWithData}/72 zones have grid-cell values; this is not current air temperature.`
            : selectedMapLayer === "rainfall"
              ? `All zones share the same source value (${rainfallDataset.latestObservation.value.toFixed(3)}; units not stated), not a zonal rainfall estimate.`
              : ""}
        </span>
      </div>
      <div className="absolute top-3 right-3 z-[500] max-h-52 overflow-y-auto rounded-xl border border-panel-border/40 bg-panel-dark/95 p-2 text-[9px] text-text-primary shadow-xl">
        {selectedMapLayer !== "normal" && (
          <div className="mb-2 border-b border-panel-border/30 pb-2">
            <p className="mb-1 font-bold uppercase tracking-wider text-text-secondary">
              {selectedMapLayer === "temperature" ? "Temperature scale" : "Rainfall scale · nationwide"}
            </p>
            <div className="flex items-center gap-1" aria-label="Color scale from lower to higher values">
              {METRIC_PALETTE.map((color) => (
                <span key={color} className="h-2 flex-1 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[8px] text-text-subtle">
              <span>
                {selectedMapLayer === "temperature"
                  ? `${temperatureMinimum.toFixed(1)} °C`
                  : rainfallDataset.valueRange.minimum.toFixed(2)}
              </span>
              <span>
                {selectedMapLayer === "temperature"
                  ? `${temperatureMaximum.toFixed(1)} °C`
                  : rainfallDataset.valueRange.maximum.toFixed(2)}
              </span>
            </div>
            {selectedMapLayer === "temperature" && (
              <p className="mt-1 text-[8px] text-text-subtle">Gray fill = no zone value</p>
            )}
            {selectedMapLayer === "rainfall" && (
              <p className="mt-1 text-[8px] leading-relaxed text-amber-200">
                Units not stated; same national value on every zone.
              </p>
            )}
          </div>
        )}
        <p className="mb-1 font-bold uppercase tracking-wider text-text-secondary">Administrative regions</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {regionNames.map((name) => (
            <span key={name} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: REGION_COLORS[name] ?? "#7397bd" }} />
              {name}
            </span>
          ))}
        </div>
      </div>
      {boundaryError && (
        <div role="alert" className="absolute left-3 right-3 top-3 z-[600] rounded-xl border border-red-500/40 bg-panel-dark/95 p-3 text-xs text-red-200">
          Zone map unavailable: {boundaryError}
        </div>
      )}
      {tileError && (
        <div className="absolute bottom-3 right-3 z-[500] rounded-xl border border-panel-border/50 bg-panel-dark/95 px-3 py-2 text-[10px] font-mono text-text-secondary shadow-xl">
          Basemap tiles unavailable. Boundary and selected dataset layers remain available.
        </div>
      )}
    </div>
  );
}

export { LeafletMapInner };
