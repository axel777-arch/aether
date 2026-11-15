"use client";

import React from "react";
import { translations, Language } from "@/data/translations";
import { 
  Globe2, 
  Sparkles, 
  Target, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Award,
  ArrowRight
} from "lucide-react";

interface AboutPageProps {
  lang: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-mono">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl nasa-panel-blue border border-accent-secondary/35 shadow-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-accent-cyan" />
          <span className="text-xs tracking-widest text-accent-light uppercase">
            NASA SPACE APPS CHALLENGE 2026
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-wide">
          {t.about.title}
        </h1>
        <p className="text-xs text-text-secondary mt-1 max-w-3xl leading-relaxed">
          Beyond Rainfall: Understanding the Signals of Drought through multi-sensor NASA Earth observations.
        </p>
      </div>

      {/* "Why Ethiopia?" Section - Mandatory Prompt Requirement */}
      <div className="p-6 rounded-3xl nasa-panel border border-panel-border/30 space-y-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent-cyan" />
          <h2 className="text-lg font-bold text-text-primary tracking-wide">
            {t.about.whyEthiopia}
          </h2>
        </div>

        {/* Empirical Numerical Crisis Evidence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-red-500/30">
            <div className="text-2xl font-mono font-bold text-red-400">&gt; 6.8M</div>
            <div className="text-[11px] font-mono text-accent-light uppercase mt-1">Livestock Deaths (2020–2023)</div>
            <p className="text-[10px] text-text-secondary mt-1">Across affected Ethiopian pastoral regions during 5 consecutive failed rains.</p>
          </div>
          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-red-500/30">
            <div className="text-2xl font-mono font-bold text-red-400">&gt; 3.3M</div>
            <div className="text-[11px] font-mono text-accent-light uppercase mt-1">Deaths in Borena Zone Alone</div>
            <p className="text-[10px] text-text-secondary mt-1">Near-total decimation of traditional pastoral cattle herds.</p>
          </div>
          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-amber-500/30">
            <div className="text-2xl font-mono font-bold text-amber-400">~ 1.7M</div>
            <div className="text-[11px] font-mono text-accent-light uppercase mt-1">Borena Population (2023)</div>
            <p className="text-[10px] text-text-secondary mt-1">Pastoralist communities dependent on deep tula wells.</p>
          </div>
          <div className="p-4 rounded-2xl bg-panel-dark/80 border border-amber-500/30">
            <div className="text-2xl font-mono font-bold text-amber-400">&gt; 50%</div>
            <div className="text-[11px] font-mono text-accent-light uppercase mt-1">Food Assistance Needed</div>
            <p className="text-[10px] text-text-secondary mt-1">Over half the population required emergency humanitarian aid.</p>
          </div>
        </div>

        {/* Recent 2026-2027 Conditions */}
        <div className="p-4 rounded-2xl bg-panel-dark/60 border border-accent-secondary/30 space-y-2 text-xs">
          <div className="font-bold text-text-primary flex items-center gap-1.5 text-accent-cyan">
            <span>Recent Environmental Dynamics (2026–2027 Monitoring Cycle)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-text-secondary pt-1">
            <div className="p-3 rounded-xl bg-panel-dark border border-panel-border/20">
              <span className="font-bold text-text-primary block mb-1">2026 Kiremt Monsoon Deficits:</span>
              Significant rainfall deficits across parts of Tigray, eastern Amhara, and eastern Oromia directly suppressed crop germination and vegetative development.
            </div>
            <div className="p-3 rounded-xl bg-panel-dark border border-panel-border/20">
              <span className="font-bold text-text-primary block mb-1">Northern Afar Dry Period:</span>
              Entered the October 2026–March 2027 dry period with severely below-average livestock conditions, rapid forage exhaustion, and drying surface watering points.
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs text-text-secondary leading-relaxed pt-2">
          <p>
            In southern and eastern Ethiopia—particularly in the pastoral rangelands of <strong>Borena Zone</strong> and the arid lowlands of Somali Region—communities depend on seasonal rainfall cycles to sustain livestock, open grazing pastures, and deep traditional watering wells (known as <em>tula</em> wells).
          </p>
          <p>
            Traditional drought monitoring has historically looked almost exclusively at <strong>rainfall gauges</strong>. However, rainfall alone tells an incomplete story:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-text-primary">
            <li>
              A brief shower may register as precipitation on a rain gauge, yet evaporate before penetrating root-zone soil.
            </li>
            <li>
              Vegetation greenness (NDVI) often exhibits a 30 to 60-day lag behind precipitation failure, masking subterranean drought.
            </li>
            <li>
              When multiple consecutive rainy seasons fail—such as the unprecedented 2020–2023 multi-year drought across the Horn of Africa—pasture exhaustion and groundwater depletion outlast the meteorological deficit.
            </li>
          </ul>
          <p>
            By combining NASA satellite measurements of rainfall (GPM IMERG), root-zone soil moisture (FLDAS Noah), and canopy health (MODIS NDVI) into the <strong>Drought Fingerprint Engine</strong>, Aether aims to provide pastoralists, agricultural extension workers, and humanitarian agencies with earlier and more credible diagnostic intelligence.
          </p>
        </div>
      </div>

      {/* Objectives and Proposed Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-3xl nasa-panel border border-panel-border/30 space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <Target className="w-4 h-4 text-accent-cyan" />
            <span>Project Objectives</span>
          </div>
          <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-accent-cyan font-bold">•</span>
              <span><strong>Demystify Drought Signals:</strong> Move beyond raw rainfall figures to reveal decoupled moisture layers and canopy stress.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-cyan font-bold">•</span>
              <span><strong>Detect 24-Year Earth System Trends:</strong> Compute mathematically verified Mann-Kendall statistics and Sen's slope rates of change from 2000 to 2024.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-cyan font-bold">•</span>
              <span><strong>Foster Bilingual Accessibility:</strong> Provide full bilingual support in English and Amharic (አማርኛ) so Ethiopian researchers and community workers can interact directly with the platform.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-3xl nasa-panel border border-panel-border/30 space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Scientific Integrity & Open Source Ethos</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Aether was conceived for the 2026 NASA Space Apps Challenge under the category <em>"Be An Earth System Trend Detective!"</em>.
            All satellite archives are traceable to official NASA Earthdata portals (FLDAS, GPM, MODIS). 
            No measurements are fabricated, and demonstration values are transparently demarcated.
          </p>
          <div className="pt-2 border-t border-panel-border/20 flex items-center justify-between text-[11px] text-text-subtle">
            <span>License: MIT Open Access</span>
            <span className="text-accent-cyan">NASA Space Apps 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
