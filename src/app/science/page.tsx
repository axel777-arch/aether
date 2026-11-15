"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  CloudRain,
  Droplets,
  Sprout,
  Activity,
  ArrowRight,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Compass,
  Fingerprint,
} from "lucide-react";

export default function SciencePage() {
  const { lang } = useApp();
  const isAmharic = lang === "am";

  // Illustrative 12-month precipitation anomaly bars (Borena 2023)
  const monthlyAnomalies = [
    { month: "Jan", val: -18, positive: false },
    { month: "Feb", val: -25, positive: false },
    { month: "Mar", val: -42, positive: false },
    { month: "Apr", val: +15, positive: true }, // brief illusory spike
    { month: "May", val: -30, positive: false },
    { month: "Jun", val: -55, positive: false },
    { month: "Jul", val: -60, positive: false },
    { month: "Aug", val: -48, positive: false },
    { month: "Sep", val: -35, positive: false },
    { month: "Oct", val: -10, positive: false },
    { month: "Nov", val: 8, positive: true },
    { month: "Dec", val: -28, positive: false },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#040507] text-[#FBFCFD] selection:bg-accent-cyan/30 selection:text-white pb-24">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(65, 97, 159, 0.14) 0%, rgba(4, 5, 7, 0.92) 70%, #040507 100%)",
          }}
        />
        <div className="absolute top-1/3 left-1/5 w-[550px] h-[550px] bg-accent-blue/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[450px] h-[450px] bg-accent-cyan/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 space-y-20">
        {/* ========================================================
            HERO: UNDERSTANDING THE PROBLEM
            ======================================================== */}
        <section className="text-center max-w-4xl mx-auto pt-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-blue/20 border border-accent-blue/35 text-accent-cyan text-xs font-mono tracking-wider">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>
              {isAmharic ? "የምድር ምልከታ ሳይንስ · ባለሦስት መስፈርት ትንተና" : "EARTH OBSERVATION SCIENCE · TRIPLE-SENSOR SYNTHESIS"}
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FBFCFD] leading-[1.1]">
            {isAmharic ? (
              <>
                ችግሩን መረዳት፡ <br />
                <span className="text-accent-cyan">ለምን ዝናብ ብቻውን በቂ አልሆነም?</span>
              </>
            ) : (
              <>
                Understanding the Problem: <br />
                <span className="text-accent-cyan">Why Rainfall Alone Is Not Enough</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[#A8BFDC] max-w-2xl mx-auto leading-relaxed font-sans">
            {isAmharic
              ? "ድርቅ የዝናብ እጥረት ብቻ አይደለም። ዝናብ፣ የአፈር እርጥበት እና የዕፅዋት ጤና እያንዳንዳቸው የተለያየ ታሪክ ይናገራሉ። እውነተኛውን የድርቅ አደጋ ለመረዳት ሦስቱንም በአንድ ላይ ማየት ግድ ይላል።"
              : "Drought is an intricate multi-dimensional environmental phenomenon. Standard surface rain measurements often generate false alarms or miss subterranean water crises. ETHIODROUGHT decodes how rainfall, soil moisture, and canopy vigor interact."}
          </p>

          {/* Large Editorial Pull Quote */}
          <div className="nasa-reference-glass p-8 rounded-3xl border-l-4 border-l-accent-cyan text-left max-w-3xl mx-auto mt-8 shadow-2xl">
            <span className="text-xs font-mono uppercase text-accent-cyan tracking-widest block mb-2">
              {isAmharic ? "ሳይንሳዊ ምልከታ · ቦረና 2023" : "EMPIRICAL ANOMALY · BORENA CASE STUDY"}
            </span>
            <blockquote className="text-lg sm:text-xl font-heading font-medium text-[#FBFCFD] leading-relaxed italic">
              {isAmharic
                ? "“በ 2023 በቦረና አንዳንድ አካባቢዎች የተመዘገበው የዝናብ መጠን ወደ መደበኛው የተጠጋ ነበር — ሆኖም ግን የድርቅ ሁኔታው ቀጥሎ የቤት እንስሳት እልቂት አልቆመም ነበር። ምክንያቱም የተሟጠጠው የአፈር እርጥበት አልተመለሰም ነበር።”"
                : "“In 2023, parts of Borena recorded near-normal seasonal rainfall — yet severe drought conditions persisted and livestock continued to die. Soil storage had collapsed, and brief downpours ran off before reaching the root zone.”"}
            </blockquote>
          </div>
        </section>

        {/* ========================================================
            THREE VISUAL SCIENTIFIC SECTIONS
            ======================================================== */}
        <section className="space-y-12">
          {/* SECTION 1: PRECIPITATION DEFICITS */}
          <div className="nasa-panel p-8 lg:p-10 rounded-3xl border border-[rgba(168,191,220,0.18)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-accent-blue/30 border border-accent-blue/50 flex items-center justify-center text-accent-cyan">
                  <CloudRain className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider font-bold">
                  01 · PRECIPITATION ANOMALIES
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-panel-dark border border-white/10 text-[10px] font-mono text-[#A8BFDC]">
                  NASA GPM IMERG V07 · 0.1°
                </span>
              </div>

              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#FBFCFD]">
                {isAmharic ? "የዝናብ እጥረት እና ያልተስተካከለ ስርጭት" : "Precipitation Deficits & Runoff Inefficiency"}
              </h2>

              <p className="text-xs sm:text-sm text-[#A8BFDC] leading-relaxed">
                {isAmharic
                  ? "የዝናብ መጠን የመጀመርያውን ምልክት ይሰጣል። ነገር ግን የዝናብ ጥንካሬ፣ ጊዜና ስርጭት ወሳኝ ናቸው። አጭርና ከባድ ዝናብ ወደ አፈር ሳይሰርግ በውሃ ፈሳሽ መልክ ታጥቦ ያልፋል፤ ይህም ለተክሎችና ለከርሰ ምድር ውሃ ምንም ፋይዳ አይሰጥም።"
                  : "Rainfall provides the initial meteorological signal, but surface gauges can be highly deceptive. Intense, episodic storms produce severe surface runoff rather than percolating into dry, hardened topsoil. Regional averages frequently conceal extreme localized rainfall deficits."}
              </p>

              {/* Formula & Stat Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.14)]">
                  <span className="text-[10px] font-mono uppercase text-[#999CA0] block mb-1">
                    {isAmharic ? "የዝናብ ስሌት ቀመር" : "PRECIPITATION ANOMALY FORMULA"}
                  </span>
                  <div className="font-mono text-xs text-accent-cyan font-bold tracking-wider">
                    A_r = ((R - R_base) / R_base) × 100
                  </div>
                  <span className="text-[10px] text-[#A8BFDC]/70 block mt-1">
                    Normalized against 2000–2020 climatology
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.14)]">
                  <span className="text-[10px] font-mono uppercase text-[#999CA0] block mb-1">
                    {isAmharic ? "ቦረና የተመዘገበ ልዩነት" : "BORENA OBSERVED ANOMALY"}
                  </span>
                  <div className="font-mono text-xl text-red-400 font-bold">
                    -1.82 σ (Severe Deficit)
                  </div>
                  <span className="text-[10px] text-[#A8BFDC]/70 block mt-1">
                    32.4 mm observed vs 74.5 mm baseline
                  </span>
                </div>
              </div>
            </div>

            {/* Right: SVG Bar Chart */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#121929]/90 border border-[rgba(168,191,220,0.15)] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-mono text-[#FBFCFD] font-semibold">
                  Illustrative Monthly Anomaly (mm)
                </span>
                <span className="text-[10px] font-mono text-[#999CA0]">Borena 2023</span>
              </div>

              {/* Anomaly Bar Graphic */}
              <div className="h-44 w-full flex items-end justify-between gap-1.5 pt-6 pb-2">
                {monthlyAnomalies.map((bar, idx) => {
                  const heightPct = Math.min(Math.abs(bar.val) * 1.5, 90);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-center">
                      <div className="w-full h-1/2 flex items-end justify-center">
                        {bar.positive && (
                          <div
                            style={{ height: `${heightPct}%` }}
                            className="w-full rounded-t bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                          />
                        )}
                      </div>
                      <div className="w-full h-[1px] bg-white/20" />
                      <div className="w-full h-1/2 flex items-start justify-center">
                        {!bar.positive && (
                          <div
                            style={{ height: `${heightPct}%` }}
                            className="w-full rounded-b bg-red-400/80 shadow-[0_0_8px_rgba(248,113,113,0.4)]"
                          />
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-[#999CA0]">{bar.month}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono pt-3 border-t border-white/5 text-[#A8BFDC]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-emerald-400" /> Surplus
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-red-400" /> Deficit (7 Consecutive Months)
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: ROOT-ZONE SOIL MOISTURE */}
          <div className="nasa-panel p-8 lg:p-10 rounded-3xl border border-[rgba(168,191,220,0.18)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider font-bold">
                  02 · ROOT-ZONE SOIL MOISTURE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-panel-dark border border-white/10 text-[10px] font-mono text-[#A8BFDC]">
                  NASA FLDAS Noah LSM · 0-100cm
                </span>
              </div>

              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#FBFCFD]">
                {isAmharic ? "የስር-ዞን አፈር እርጥበት መሟጠጥ" : "Root-Zone Hydrological Memory"}
              </h2>

              <p className="text-xs sm:text-sm text-[#A8BFDC] leading-relaxed">
                {isAmharic
                  ? "የአፈር ስር-ዞን (0–100 ሳ.ሜ) እርጥበት ለተክሎችና ለከብቶች መጠጥ ጉድጓዶች እጅግ ወሳኙ መለኪያ ነው። አፈሩ የውሃ ማጠራቀሚያ አቅሙን ካጣ፣ ዝናብ ቢዘንብም እንኳን አፈሩ ውሃውን ይዞ ማቆየት ስለማይችል ድርቁ ይቀጥላል።"
                  : "Root-zone soil moisture (0-100cm depth) acts as the Earth's environmental memory. It captures cumulative water balance over weeks and months. Depleted subterranean aquifers prevent perennial grasses from establishing root systems even after seasonal rains arrive."}
              </p>

              {/* Stat Callout */}
              <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.14)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#999CA0] uppercase block">
                    {isAmharic ? "የቦረና የአፈር እርጥበት መጠን" : "BORENA CURRENT ROOT-ZONE STORAGE"}
                  </span>
                  <div className="font-heading text-2xl font-bold text-accent-cyan mt-0.5">
                    0.142 m³/m³
                  </div>
                  <span className="text-[11px] text-red-400 font-mono">
                    -2.14 σ below baseline (0.312 m³/m³)
                  </span>
                </div>
                <div className="text-right font-mono text-xs text-[#A8BFDC]">
                  <div>Critical Deficit: -54.5%</div>
                  <div className="text-[10px] text-[#999CA0]">Tula well collapse</div>
                </div>
              </div>
            </div>

            {/* Right: Tank Level Visual Gauge */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#121929]/90 border border-[rgba(168,191,220,0.15)] space-y-4">
              <span className="text-xs font-mono text-[#FBFCFD] font-semibold block">
                Soil Moisture Tank Fill Simulation
              </span>

              {/* Tank Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-accent-cyan">Current: 0.142 m³/m³</span>
                  <span className="text-[#999CA0]">Normal: 0.312 m³/m³</span>
                </div>
                <div className="h-6 w-full rounded-full bg-black/60 border border-white/10 overflow-hidden relative">
                  <div
                    style={{ width: "45%" }}
                    className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-accent-cyan shadow-[0_0_15px_rgba(40,215,197,0.4)]"
                  />
                  <div className="absolute right-0 top-0 bottom-0 left-[45%] flex items-center justify-center text-[10px] font-mono text-red-300 bg-red-950/20">
                    Deficit -54.5%
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-[#A8BFDC] space-y-1">
                <div className="text-accent-cyan font-bold">HYDRAULIC STATUS: DESICCATED</div>
                <div>Top 0-10cm: 0.082 m³/m³ (Wilting point)</div>
                <div>Root 10-100cm: 0.142 m³/m³ (Severe stress)</div>
              </div>
            </div>
          </div>

          {/* SECTION 3: VEGETATION HEALTH (NDVI) */}
          <div className="nasa-panel p-8 lg:p-10 rounded-3xl border border-[rgba(168,191,220,0.18)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  03 · VEGETATION CONDITION (NDVI)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-panel-dark border border-white/10 text-[10px] font-mono text-[#A8BFDC]">
                  MODIS MOD13A2 · 1km · 16-Day
                </span>
              </div>

              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#FBFCFD]">
                {isAmharic ? "የዕፅዋት ሽፋን ጤና እና የግጦሽ ሳር እልቂት" : "Canopy Vigor & Pasture Degradation"}
              </h2>

              <p className="text-xs sm:text-sm text-[#A8BFDC] leading-relaxed">
                {isAmharic
                  ? "የ NDVI (የተስተካከለ የዕፅዋት ልዩነት መረጃ ጠቋሚ) የቅጠል አረንጓዴነትንና ጤናን በቀጥታ ይለካል። በቂ ዝናብ ቢጥል እንኳ አፈሩና ዘሩ ከተጎዱ እፅዋት ወዲያውኑ አያገግሙም። ይህ የዕፅዋት መዘግየት በሳተላይት ክትትል ብቻ የሚረጋገጥ ወሳኝ እውነታ ነው።"
                  : "Normalized Difference Vegetation Index (NDVI) measures photosynthetic canopy absorption. Vegetation stress lags rainfall by 2–4 weeks and exhibits hysteresis: degraded grasslands fail to regenerate despite intermittent rains due to seed bank loss and topsoil erosion."}
              </p>

              {/* Formula & Stat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.14)]">
                  <span className="text-[10px] font-mono uppercase text-[#999CA0] block mb-1">
                    {isAmharic ? "የ NDVI ስሌት" : "VEGETATION ANOMALY FORMULA"}
                  </span>
                  <div className="font-mono text-xs text-emerald-400 font-bold tracking-wider">
                    A_v = NDVI_current - NDVI_baseline
                  </div>
                  <span className="text-[10px] text-[#A8BFDC]/70 block mt-1">
                    24-year long-term baseline reference
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.14)]">
                  <span className="text-[10px] font-mono uppercase text-[#999CA0] block mb-1">
                    {isAmharic ? "የአሁኑ NDVI ውጤት" : "BORENA CURRENT NDVI"}
                  </span>
                  <div className="font-mono text-xl text-amber-400 font-bold">
                    0.375 (-1.65 σ)
                  </div>
                  <span className="text-[10px] text-[#A8BFDC]/70 block mt-1">
                    Expected Climatology: 0.620
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Color Gradient Bar */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#121929]/90 border border-[rgba(168,191,220,0.15)] space-y-4">
              <span className="text-xs font-mono text-[#FBFCFD] font-semibold block">
                NDVI Severity Spectrum
              </span>

              {/* Gradient Bar */}
              <div className="space-y-2">
                <div className="h-4 w-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 relative">
                  {/* Marker at 0.375 (position ~40%) */}
                  <div
                    style={{ left: "40%" }}
                    className="absolute -top-1.5 w-3 h-7 bg-white rounded-full shadow-[0_0_10px_white] -translate-x-1/2 border-2 border-black"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#999CA0]">
                  <span>0.00 (Barren)</span>
                  <span className="text-white font-bold">Borena 0.375</span>
                  <span>0.80 (Dense Canopy)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-[#A8BFDC] space-y-1">
                <div className="text-amber-400 font-bold">PASTURE STATUS: SEVERELY DEGRADED</div>
                <div>Afar North: 0.210 (-1.90 σ) · Critical scrubland collapse</div>
                <div>Fafan Zone: 0.290 (-1.35 σ) · Rangeland stress</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            CLOSING SYNTHESIS: THREE SENSORS. ONE TRUTH.
            ======================================================== */}
        <section className="nasa-reference-glass p-8 lg:p-12 rounded-3xl border border-accent-cyan/30 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
              {isAmharic ? "የተቀናጀ ሳይንሳዊ ድምዳሜ" : "COMPOUND DROUGHT DETECTION"}
            </span>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#FBFCFD]">
              {isAmharic ? "ሦስት ሳተላይቶች · አንዲት ሳይንሳዊ እውነት" : "Three Sensors. One Truth."}
            </h2>
            <p className="text-xs sm:text-sm text-[#A8BFDC] leading-relaxed">
              {isAmharic
                ? "እውነተኛና አደገኛ ድርቅ የሚከሰተው ዝናብ ሲቀንስ፣ የአፈር እርጥበት ሲሟጠጥ እና የዕፅዋት ሽፋን ሲደርቅ በሦስቱም በአንድ ላይ ነው። ETHIODROUGHT ይህንን የተቀናጀ አደጋ በቅጽበት ይለያል።"
                : "A catastrophic drought emergency occurs when precipitation deficits, subterranean soil moisture depletion, and vegetation canopy collapse align simultaneously. ETHIODROUGHT synthesizes all three to deliver definitive early warnings."}
            </p>
          </div>

          {/* Venn-Style Triple Sensor Convergence Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
            <div className="p-5 rounded-2xl bg-[#121929] border border-blue-500/30 text-center space-y-2">
              <CloudRain className="w-6 h-6 text-accent-blue mx-auto" />
              <div className="font-heading text-base font-bold text-[#FBFCFD]">Rainfall Deficit</div>
              <p className="text-[11px] text-[#A8BFDC]">GPM IMERG detects surface meteorological precipitation shortages</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121929] border border-accent-cyan/40 text-center space-y-2">
              <Droplets className="w-6 h-6 text-accent-cyan mx-auto" />
              <div className="font-heading text-base font-bold text-accent-cyan">Soil Moisture Collapse</div>
              <p className="text-[11px] text-[#A8BFDC]">FLDAS confirms root-zone aquifer exhaustion (0-100cm)</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#121929] border border-emerald-500/30 text-center space-y-2">
              <Sprout className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-heading text-base font-bold text-[#FBFCFD]">Vegetation Stress</div>
              <p className="text-[11px] text-[#A8BFDC]">MODIS verifies rangeland pasture and canopy vitality loss</p>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/solution"
              className="px-6 py-3.5 rounded-2xl bg-accent-cyan text-[#040507] hover:bg-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(40,215,197,0.3)] flex items-center gap-2"
            >
              <span>{isAmharic ? "መፍትሔያችንን ይመልከቱ" : "DISCOVER OUR SOLUTION"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/fingerprint"
              className="px-6 py-3.5 rounded-2xl bg-[#162036] hover:bg-[#253352] border border-[rgba(168,191,220,0.2)] text-[#FBFCFD] font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2"
            >
              <span>{isAmharic ? "የድርቅ አሻራ መመርመሪያ" : "EXPLORE FINGERPRINT ENGINE"}</span>
              <Fingerprint className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
