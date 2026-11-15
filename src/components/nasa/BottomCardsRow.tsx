"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Administrative coverage",
    value: "72",
    detail: "zone boundaries across 11 parent regions",
    note: "Geographic context only; no drought classification is implied.",
    href: "/explore",
    action: "Explore map",
  },
  {
    title: "Data availability",
    value: "No live feed",
    detail: "Historical summaries and source references",
    note: "Review temporal coverage and integration status before interpreting a dataset.",
    href: "/datasets",
    action: "Open registry",
  },
  {
    title: "Rainfall prototype",
    value: "June 2025",
    detail: "Historical GPM-based prediction output",
    note: "This is not a current forecast or a zone-level observation.",
    href: "/predict",
    action: "View predictor",
  },
];

export const BottomCardsRow: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full z-20 pointer-events-auto">
    {cards.map((card) => (
      <article
        key={card.title}
        className="nasa-reference-glass min-h-48 p-5 flex flex-col justify-between gap-4 group hover:border-accent-cyan/40 transition-all shadow-xl"
      >
        <div>
          <div className="flex items-center justify-between gap-3 pb-2">
            <h2 className="text-xs font-sans text-[#A8BFDC]">{card.title}</h2>
            <Link
              href={card.href}
              aria-label={card.action}
              className="text-[#999CA0] hover:text-white transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="font-michroma text-2xl font-bold text-[#FBFCFD] tracking-wide">
            {card.value}
          </p>
          <p className="mt-1 text-[11px] font-mono text-[#A8BFDC]">{card.detail}</p>
        </div>
        <div>
          <p className="text-[10px] leading-relaxed text-[#999CA0]">{card.note}</p>
          <Link
            href={card.href}
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-accent-cyan hover:text-white"
          >
            {card.action}
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </article>
    ))}
  </div>
);
