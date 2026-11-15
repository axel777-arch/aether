"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DATASET_CATALOG, DatasetCatalogItem } from "@/data/datasetsData";
import {
  Database,
  Search,
  ExternalLink,
  Layers,
  Satellite,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Globe2,
} from "lucide-react";

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredDatasets = useMemo(() => {
    return DATASET_CATALOG.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.variable.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.purpose.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === "all" || item.integrationStatus === selectedStatus;

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, selectedStatus, selectedCategory]);

  const getStatusBadge = (status: DatasetCatalogItem["integrationStatus"]) => {
    switch (status) {
      case "Integrated":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            INTEGRATED
          </span>
        );
      case "Available for exploration":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/35 flex items-center gap-1.5">
            <Globe2 className="w-3 h-3 text-accent-cyan" />
            EXPLORATION READY
          </span>
        );
      case "Planned":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-400" />
            PLANNED INGESTION
          </span>
        );
      case "Research reference":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/35 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-purple-400" />
            METHODOLOGY REFERENCE
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl nasa-panel-blue border border-accent-secondary/35 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-panel-dark/90 border border-accent-secondary/40 text-[11px] font-mono text-accent-cyan uppercase">
              <Database className="w-3.5 h-3.5" />
              <span>NASA &amp; INTERNATIONAL EARTH OBSERVATION CATALOG</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-text-primary tracking-tight">
              Dataset Explorer
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Transparent catalog of satellite constellations, land surface models, climate indices, and hydrological archives utilized by the ETHIODROUGHT Earth System Intelligence platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/data"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-panel-dark border border-panel-border/40 hover:border-accent-cyan text-xs font-mono text-accent-light hover:text-text-primary transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-accent-cyan" />
              <span>Data Quality &amp; CSV Upload</span>
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-cyan text-[#040507] text-xs font-mono font-bold uppercase tracking-wider hover:bg-accent-cyan/90 transition-all shadow-lg"
            >
              <span>Scientific Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="nasa-panel p-5 rounded-2xl border border-panel-border/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-subtle absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dataset, provider, environmental variable, or instrument..."
            className="w-full bg-panel-dark border border-panel-border/40 rounded-xl pl-11 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-accent-cyan font-mono transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-panel-dark p-1 rounded-xl border border-panel-border/40 text-[11px] font-mono">
            <span className="text-text-subtle px-2">Status:</span>
            {[
              { id: "all", label: "All" },
              { id: "Integrated", label: "Integrated" },
              { id: "Available for exploration", label: "Exploration" },
              { id: "Planned", label: "Planned" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedStatus(btn.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedStatus === btn.id
                    ? "bg-accent-blue/40 text-accent-cyan border border-accent-cyan/40 font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-panel-dark p-1 rounded-xl border border-panel-border/40 text-[11px] font-mono">
            <span className="text-text-subtle px-2">Domain:</span>
            {[
              { id: "all", label: "All" },
              { id: "satellite", label: "Satellite" },
              { id: "hydrology", label: "Hydrology" },
              { id: "climate", label: "Climate" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedCategory(btn.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCategory === btn.id
                    ? "bg-accent-blue/40 text-accent-cyan border border-accent-cyan/40 font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDatasets.map((ds) => (
          <div
            key={ds.id}
            className="nasa-panel p-6 rounded-3xl border border-panel-border/30 hover:border-accent-cyan/60 transition-all flex flex-col justify-between group shadow-xl bg-panel-translucent"
          >
            <div className="space-y-4">
              {/* Card Top: Provider and Badge */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent-light px-2.5 py-1 rounded-md bg-panel-dark border border-panel-border/40 line-clamp-1">
                  {ds.provider}
                </span>
                {getStatusBadge(ds.integrationStatus)}
              </div>

              {/* Title & Variable */}
              <div>
                <h3 className="text-lg font-heading font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                  {ds.name}
                </h3>
                <div className="text-xs font-mono text-accent-cyan mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  <span>{ds.variable}</span>
                </div>
              </div>

              {/* Purpose */}
              <p className="text-xs text-text-secondary leading-relaxed">
                {ds.purpose}
              </p>

              {/* Technical Specifications Table */}
              <div className="p-3.5 rounded-2xl bg-panel-dark/80 border border-panel-border/25 space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-text-subtle">Spatial Resolution:</span>
                  <span className="text-text-primary font-medium">{ds.spatialResolution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-subtle">Temporal Step:</span>
                  <span className="text-text-primary font-medium">{ds.temporalResolution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-subtle">Coverage:</span>
                  <span className="text-text-primary font-medium">{ds.geographicCoverage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-subtle">Baseline:</span>
                  <span className="text-accent-light font-medium">{ds.observationPeriod}</span>
                </div>
              </div>

              {/* Quality Note */}
              <div className="p-3 rounded-xl bg-panel-dark/40 border border-panel-border/20 text-[10px] text-text-subtle leading-relaxed">
                <strong className="text-text-secondary font-mono">Quality Assurance:</strong> {ds.qualityNote}
              </div>
            </div>

            {/* Official Resource Link */}
            <div className="mt-6 pt-4 border-t border-panel-border/20 flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-subtle">Verified Origin</span>
              <a
                href={ds.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel-dark border border-panel-border/40 hover:border-accent-cyan text-xs font-mono text-accent-cyan hover:bg-accent-cyan/10 transition-all"
              >
                <span>Official Resource</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="nasa-panel p-12 rounded-3xl border border-panel-border/30 text-center space-y-3">
          <Database className="w-8 h-8 text-text-subtle mx-auto" />
          <h3 className="text-lg font-heading font-bold text-text-primary">No Datasets Found</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            No satellite resources matched your query &ldquo;{searchQuery}&rdquo;. Try clearing your filters or search terms.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedStatus("all");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 rounded-xl bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/40 text-xs font-mono font-bold"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
