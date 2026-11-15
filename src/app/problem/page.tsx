"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  AlertTriangle,
  TrendingDown,
  Users,
  Activity,
  ArrowRight,
  ExternalLink,
  Info,
  Calendar,
  ShieldAlert,
  Compass,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function ProblemPage() {
  const { lang } = useApp();
  const isAmharic = lang === "am";

  // Count-up animation state
  const [counts, setCounts] = useState({
    livestockTotal: 0,
    borenaDeaths: 0,
    borenaPop: 0,
    assistancePct: 0,
  });

  useEffect(() => {
    const duration = 1800;
    const steps = 60;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        livestockTotal: Number((6.8 * ease).toFixed(1)),
        borenaDeaths: Number((3.3 * ease).toFixed(1)),
        borenaPop: Number((1.7 * ease).toFixed(1)),
        assistancePct: Math.round(52 * ease),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#040507] text-[#FBFCFD] selection:bg-accent-cyan/30 selection:text-white pb-24">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(65, 97, 159, 0.15) 0%, rgba(4, 5, 7, 0.9) 65%, #040507 100%)",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-accent-cyan/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 space-y-20">
        {/* ========================================================
            HERO: THE PROBLEM — WHY ETHIOPIA?
            ======================================================== */}
        <section className="text-center max-w-4xl mx-auto pt-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>
              {isAmharic ? "ገላጭ ሳይንሳዊ ማስረጃ · ቀጣይ ቀውስ" : "EMPIRICAL CLIMATE EVIDENCE · PROTRACTED CRISIS"}
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FBFCFD] leading-[1.1]">
            {isAmharic ? (
              <>
                ከዝናብ ባሻገር ያለው እውነት፡ <br />
                <span className="text-accent-cyan">የኢትዮጵያ ድርቅ አደጋ</span>
              </>
            ) : (
              <>
                The Evidence: <br />
                <span className="text-accent-cyan">Why Ethiopia Faces Climate Crisis</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[#A8BFDC] max-w-2xl mx-auto leading-relaxed font-sans">
            {isAmharic
              ? "ባህላዊ የዝናብ ክትትል ብቻውን በደቡብና ምሥራቅ ኢትዮጵያ የተከሰተውን የከብቶች እልቂትና የምግብ ዋስትና እጦት ሊተነብይ አልቻለም። ይህ ገጽ ትክክለኛውን የቁጥር መረጃ እና ሳይንሳዊ እውነታ ያቀርባል።"
              : "Standard rainfall tracking alone failed to anticipate the collapse of pastoral livelihoods across southern and eastern Ethiopia. Understanding drought requires confronting both empirical historical devastation and real-time multi-satellite telemetry."}
          </p>
        </section>

        {/* ========================================================
            SECTION A: HISTORICAL IMPACT (2020–2023)
            ======================================================== */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(168,191,220,0.12)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                  {isAmharic ? "ታሪካዊ የመረጃ ምዘና (2020–2023)" : "HISTORICAL IMPACT ASSESSMENT · 2020–2023"}
                </span>
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#FBFCFD]">
                {isAmharic ? "ያለፉት ዓመታት የተመዘገቡ አደጋዎች" : "Catastrophic Pastoral Losses in Southern Ethiopia"}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300">
              {isAmharic ? "ታሪካዊ ማስረጃ (የአሁኑ መለኪያ አይደለም)" : "HISTORICAL RECORD · NOT CURRENT TELEMETRY"}
            </span>
          </div>

          {/* 4 Large Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1: 6.8M Livestock Total */}
            <div className="nasa-reference-glass p-6 rounded-3xl flex flex-col justify-between group hover:border-accent-cyan/40 transition-all">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#999CA0] mb-3">
                  <span>{isAmharic ? "ሀገር አቀፍ የከብት እልቂት" : "TOTAL LIVESTOCK"}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                    2020–2023
                  </span>
                </div>
                <div className="font-heading text-5xl lg:text-6xl font-bold text-accent-cyan tracking-tight">
                  &gt;{counts.livestockTotal}M
                </div>
                <p className="text-sm font-semibold text-[#FBFCFD] mt-2">
                  {isAmharic
                    ? "በተጎዱት የኢትዮጵያ ክልሎች የሞቱ የቤት እንስሳት"
                    : "Livestock estimated dead across affected Ethiopian regions"}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[rgba(168,191,220,0.1)] text-[11px] font-mono text-[#A8BFDC]/70">
                <span>{isAmharic ? "ምንጭ፡ FAO / FEWS NET" : "Source: UN FAO & FEWS NET Consolidated Assessment"}</span>
              </div>
            </div>

            {/* Stat 2: 3.3M Borena Alone */}
            <div className="nasa-reference-glass p-6 rounded-3xl flex flex-col justify-between group hover:border-red-400/40 transition-all">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#999CA0] mb-3">
                  <span>{isAmharic ? "ቦረና ዞን ብቻ" : "BORENA ZONE ONLY"}</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-[10px]">
                    2022–2023
                  </span>
                </div>
                <div className="font-heading text-5xl lg:text-6xl font-bold text-red-400 tracking-tight">
                  &gt;{counts.borenaDeaths}M
                </div>
                <p className="text-sm font-semibold text-[#FBFCFD] mt-2">
                  {isAmharic
                    ? "በቦረና ዞን ብቻ የተመዘገበ የከብቶች ሞት"
                    : "Reported livestock fatalities concentrated in Borena Zone"}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[rgba(168,191,220,0.1)] text-[11px] font-mono text-[#A8BFDC]/70">
                <span>{isAmharic ? "ምንጭ፡ የኦሮሚያ ግብርና ቢሮ የመስክ ሪፖርት" : "Source: Borena Zonal Disaster Risk Management Field Survey"}</span>
              </div>
            </div>

            {/* Stat 3: 1.7M Borena Population */}
            <div className="nasa-reference-glass p-6 rounded-3xl flex flex-col justify-between group hover:border-accent-blue/40 transition-all">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#999CA0] mb-3">
                  <span>{isAmharic ? "የቦረና ሕዝብ ብዛት" : "ZONE DEMOGRAPHICS"}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                    2023 Census Est.
                  </span>
                </div>
                <div className="font-heading text-5xl lg:text-6xl font-bold text-[#FBFCFD] tracking-tight">
                  ~{counts.borenaPop}M
                </div>
                <p className="text-sm font-semibold text-[#FBFCFD] mt-2">
                  {isAmharic
                    ? "በ 2023 ግምገማ ወቅት የነበረው የዞኑ ነዋሪ ብዛት"
                    : "Approximate population of Borena Zone pastoral livelihood zone"}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[rgba(168,191,220,0.1)] text-[11px] font-mono text-[#A8BFDC]/70">
                <span>{isAmharic ? "ምንጭ፡ OCHA የሰብዓዊ ምዘና" : "Source: UN OCHA Joint Inter-Agency Population Assessment"}</span>
              </div>
            </div>

            {/* Stat 4: >50% Food Assistance */}
            <div className="nasa-reference-glass p-6 rounded-3xl flex flex-col justify-between group hover:border-amber-400/40 transition-all">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#999CA0] mb-3">
                  <span>{isAmharic ? "የዕርዳታ ጥገኛ" : "FOOD INSECURITY"}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px]">
                    2023 Peak
                  </span>
                </div>
                <div className="font-heading text-5xl lg:text-6xl font-bold text-amber-400 tracking-tight">
                  &gt;{counts.assistancePct}%
                </div>
                <p className="text-sm font-semibold text-[#FBFCFD] mt-2">
                  {isAmharic
                    ? "አፋጣኝ የምግብ ድጋፍ የፈለገው የቦረና ሕዝብ ድርሻ"
                    : "Proportion of Borena population requiring emergency food aid"}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[rgba(168,191,220,0.1)] text-[11px] font-mono text-[#A8BFDC]/70">
                <span>{isAmharic ? "ምንጭ፡ IPC Acute Food Insecurity Report" : "Source: IPC Acute Food Insecurity Classification Phase 3+"}</span>
              </div>
            </div>
          </div>

          {/* Historical Drought Escalation Timeline */}
          <div className="nasa-panel p-6 rounded-3xl border border-[rgba(168,191,220,0.16)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A8BFDC]">
                {isAmharic ? "የአደጋው ሂደት የጊዜ ሰሌዳ (2020–2023)" : "DROUGHT ESCALATION CHRONOLOGY · 5 CONSECUTIVE FAILED SEASONS"}
              </span>
              <span className="text-[11px] font-mono text-[#999CA0]">La Niña Synoptic Cycle</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#121929] border border-yellow-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-yellow-400">
                  <span>2020 LATE DEYR</span>
                  <span>BELOW NORMAL</span>
                </div>
                <p className="text-xs text-[#FBFCFD]">
                  {isAmharic
                    ? "የአጭር ወቅት ዝናብ ማነስ፣ የግጦሽ ሳር መቀነስ መጀመሪያ"
                    : "First below-average rainy season; rangeland biomass begins gradual decline."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#121929] border border-amber-500/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                  <span>2021 BELG & DEYR</span>
                  <span>SEVERE DEFICIT</span>
                </div>
                <p className="text-xs text-[#FBFCFD]">
                  {isAmharic
                    ? "ሁለት ተከታታይ ወቅቶች ዝናብ አጡ፤ የቱላ ጥልቅ ጉድጓዶች ውሃ ማነስ"
                    : "Back-to-back failed monsoons; traditional Tula deep well aquifers depleted."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#121929] border border-red-500/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-red-400">
                  <span>2022 HISTORIC COLLAPSE</span>
                  <span>EXTREME CRISIS</span>
                </div>
                <p className="text-xs text-[#FBFCFD]">
                  {isAmharic
                    ? "ከ 3 ሚሊዮን በላይ ከብቶች ሞቱ፤ የግጦሽ መሬቶች ሙሉ በሙሉ ደረቁ"
                    : "Over 3 million livestock fatalities; pasture collapse across pastoral belts."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#121929] border border-red-600/70 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-red-300">
                  <span>2023 COMPOUND FAMINE</span>
                  <span>&gt;50% AID DEPENDENT</span>
                </div>
                <p className="text-xs text-[#FBFCFD]">
                  {isAmharic
                    ? "ከ 1.7 ሚሊዮን ሕዝብ ከግማሽ በላይ አስቸኳይ እርዳታ ፈላጊ ሆነ"
                    : "Critical livelihood breakdown; over 50% of Borena population under food aid."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION B: RECENT CONDITIONS (2026)
            ======================================================== */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(168,191,220,0.12)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
                  {isAmharic ? "ወቅታዊ ምልከታዎችና ትንበያዎች (2026)" : "CURRENT OBSERVATIONS & FORECASTS · 2026 SEASON"}
                </span>
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#FBFCFD]">
                {isAmharic ? "የ 2026 የዝናብና የአፈር ሁኔታዎች" : "Emerging Environmental Stresses Across Ethiopia"}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-[11px] font-mono text-accent-cyan">
              {isAmharic ? "የአሁኑ መረጃ (2026)" : "ACTIVE 2026 MONITORING CYCLE"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: 2026 Kiremt Deficits in Tigray, Amhara, Oromia */}
            <div className="nasa-reference-glass p-6 rounded-3xl space-y-4 border border-[rgba(168,191,220,0.18)]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  {isAmharic ? "ትግራይ · ምሥራቅ አማራ · ምሥራቅ ኦሮሚያ" : "Tigray · E. Amhara · E. Oromia"}
                </span>
                <span className="text-[10px] font-mono text-[#999CA0]">2026 KIREMT</span>
              </div>

              <h3 className="font-heading text-lg font-bold text-[#FBFCFD]">
                {isAmharic ? "የክረምት ዝናብ እጥረት እና የሰብል መጎዳት" : "Kiremt Rainfall Deficits Impede Crop Development"}
              </h3>

              <p className="text-xs text-[#A8BFDC] leading-relaxed">
                {isAmharic
                  ? "የ 2026 ክረምት ዝናብ በትግራይ፣ በምሥራቅ አማራና በምሥራቅ ኦሮሚያ ክፍሎች ባልተለመደ መልኩ ዘግይቶና ቀንሶ መጥቷል። ይህ ጉድለት የሰብል ዘር ማብቀልንና ቀጣይ እድገትን በእጅጉ ጎድቷል።"
                  : "The 2026 Kiremt (main agricultural season) experienced significant rainfall deficits across Tigray, eastern Amhara, and eastern Oromia. Irregular temporal distribution critically delayed crop germination and vegetative development."}
              </p>

              <div className="pt-3 border-t border-[rgba(168,191,220,0.1)] flex items-center justify-between text-[11px] font-mono text-[#999CA0]">
                <span>{isAmharic ? "ምንጭ፡ FEWS NET 2026" : "Source: FEWS NET Ethiopia Food Security Outlook"}</span>
                <span className="text-amber-400 font-semibold">CROP STRESS</span>
              </div>
            </div>

            {/* Card 2: Northern Afar dry period */}
            <div className="nasa-reference-glass p-6 rounded-3xl space-y-4 border border-[rgba(168,191,220,0.18)]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
                  {isAmharic ? "ሰሜን አፋር" : "Northern Afar"}
                </span>
                <span className="text-[10px] font-mono text-[#999CA0]">OCT 2026 – MAR 2027</span>
              </div>

              <h3 className="font-heading text-lg font-bold text-[#FBFCFD]">
                {isAmharic ? "የደረቅ ወቅት መጀመሪያ ከደካማ የግጦሽ ሁኔታ ጋር" : "Entering Dry Period With Deficit Biomass"}
              </h3>

              <p className="text-xs text-[#A8BFDC] leading-relaxed">
                {isAmharic
                  ? "ሰሜን አፋር ወደ ጥቅምት 2026 – መጋቢት 2027 ደረቅ ወቅት የገባው ከተለመደው በታች በሆነ የከብቶች ጤና ሁኔታ፣ ውስን የግጦሽ ሳርና የውሃ እጥረት ጋር ነው። ይህም አርብቶ አደሩን ለከፍተኛ ተጋላጭነት ዳርጓል።"
                  : "Northern Afar entered the October 2026–March 2027 dry season with below-average livestock body condition scores, critically limited pasture regeneration, and severe water scarcity."}
              </p>

              <div className="pt-3 border-t border-[rgba(168,191,220,0.1)] flex items-center justify-between text-[11px] font-mono text-[#999CA0]">
                <span>{isAmharic ? "ምንጭ፡ FEWS NET / WFP" : "Source: FEWS NET Pastoral Assessment"}</span>
                <span className="text-red-400 font-semibold">PASTORAL ALERT</span>
              </div>
            </div>

            {/* Card 3: Deep Root-Zone Deficit */}
            <div className="nasa-reference-glass p-6 rounded-3xl space-y-4 border border-[rgba(168,191,220,0.18)]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-mono">
                  {isAmharic ? "ደቡብና ምሥራቅ አርብቶ አደር ዞኖች" : "Southern Pastoral Zones"}
                </span>
                <span className="text-[10px] font-mono text-[#999CA0]">MULTI-SENSOR</span>
              </div>

              <h3 className="font-heading text-lg font-bold text-[#FBFCFD]">
                {isAmharic ? "የአፈር እርጥበት መሟጠጥ ቀጣይነት" : "Subterranean Root-Zone Soil Depletion"}
              </h3>

              <p className="text-xs text-[#A8BFDC] leading-relaxed">
                {isAmharic
                  ? "አልፎ አልፎ የሚዘንብ ዝናብ ቢኖርም፣ የከርሰ ምድር አፈር እርጥበት (0–100 ሳ.ሜ) በከፍተኛ ሁኔታ ተሟጧል። የሳተላይት መረጃ እንደሚያሳየው አፈሩ በቂ እርጥበት ካላገኘ ሳርና ሰብል ሊያገግሙ አይችሉም።"
                  : "NASA FLDAS observations confirm that subterranean root-zone soil moisture (0-100cm) remains depressed across Borena and Somali zones. Scattered rainfall events have failed to replenish multi-year aquifer deficits."}
              </p>

              <div className="pt-3 border-t border-[rgba(168,191,220,0.1)] flex items-center justify-between text-[11px] font-mono text-[#999CA0]">
                <span>{isAmharic ? "ምንጭ፡ NASA FLDAS Noah" : "Source: NASA FLDAS Noah LSM Hydrology"}</span>
                <span className="text-accent-cyan font-semibold">-2.14 σ DEPLETED</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            NAVIGATION CALL TO ACTION
            ======================================================== */}
        <section className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-[#121929] via-panel-dark to-[#121929] border border-panel-border/40 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider">
              {isAmharic ? "ቀጣይ እርምጃ" : "NEXT IN THE SCIENTIFIC STORY"}
            </span>
            <h3 className="font-heading text-xl lg:text-2xl font-bold text-[#FBFCFD]">
              {isAmharic ? "ለምን ዝናብ ብቻውን በቂ አልሆነም?" : "Why Rainfall Alone Is Insufficient to Understand Drought"}
            </h3>
            <p className="text-xs text-[#A8BFDC] max-w-xl">
              {isAmharic
                ? "በዝናብ፣ በአፈር እርጥበት እና በዕፅዋት ጤና መካከል ያለውን የሳይንስ ትስስር ይመልከቱ።"
                : "Explore how precipitation, root-zone soil moisture, and canopy vigor tell completely different stories."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/science"
              className="px-6 py-3 rounded-2xl bg-accent-cyan text-[#040507] hover:bg-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(40,215,197,0.3)] flex items-center gap-2"
            >
              <span>{isAmharic ? "ሳይንሳዊ ትንተናውን ይመልከቱ" : "UNDERSTAND THE SCIENCE"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/explore"
              className="px-6 py-3 rounded-2xl bg-[#162036] hover:bg-[#253352] border border-[rgba(168,191,220,0.2)] text-[#FBFCFD] font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2"
            >
              <span>{isAmharic ? "ካርታውን ያስሱ" : "EXPLORE MAP"}</span>
              <Compass className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
