"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Map,
  Fingerprint,
  TrendingDown,
  Sprout,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Satellite,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Database,
  LineChart,
} from "lucide-react";

export default function SolutionPage() {
  const { lang } = useApp();
  const isAmharic = lang === "am";

  const capabilities = [
    {
      id: "01",
      title: isAmharic ? "የቀጥታ የድርቅ መረጃ ካርታ" : "Regional Drought Intelligence Map",
      icon: Map,
      href: "/explore",
      problem: isAmharic
        ? "የአንድ አመልካች መረጃ ብቻውን አደጋውን በአጠቃላይ ሊያሳይ አይችልም። የክልል አስተዳዳሪዎችና ባለሙያዎች ሁሉን አቀፍ የቦታ ካርታ ይፈልጋሉ።"
        : "Drought hotspots are not obvious from isolated gauges. Decision-makers need a unified geographical interface integrating multi-satellite rasters with woreda administrative boundaries.",
      data: "NASA GPM IMERG · FLDAS Noah 0-100cm · MODIS Terra NDVI",
      produces: isAmharic
        ? "በዞንና በወረዳ የተከፋፈለ በይነተገናኝ የቀለም ደረጃ ካርታ ከወቅታዊ የመረጃ ንብርብሮች ጋር"
        : "Interactive geospatial raster & choropleth map classifying drought severity with synchronized timeline playback across 800+ woredas.",
      useful: isAmharic
        ? "አስቸኳይ የመኖ ድጋፍና የውሃ አቅርቦት የሚያስፈልጋቸውን አካባቢዎች ወዲያውኑ ለመለየት ያስችላል"
        : "Enables rapid spatial identification of priority relief areas, routing emergency water trucking and fodder distribution efficiently.",
    },
    {
      id: "02",
      title: isAmharic ? "የድርቅ አሻራ መመርመሪያ ሞተር" : "Drought Fingerprint Engine",
      icon: Fingerprint,
      href: "/fingerprint",
      problem: isAmharic
        ? "የዝናብ እጥረት ብቻውን የከብቶች ሞትና የሰብል ውድመትን አያብራራም። የተቀናጀ ባለሦስት ዘንግ ትንተና ያስፈልጋል።"
        : "Rainfall deficit alone fails to explain why livestock perish while brief showers mask deep ground desiccation. True drought requires compound multi-sensor verification.",
      data: "GPM precipitation anomaly + FLDAS root-zone moisture percentile + MODIS NDVI anomaly",
      produces: isAmharic
        ? "ሦስቱን መስፈርቶች በአንድ ላይ በማነፃፀር አደጋው በምን ምክንያት እንደተከሰተ የሚያሳይ የ3-ዘንግ አሻራ"
        : "Multi-axis diagnostic matrix characterizing specific compound stress modes (e.g. false recovery, hydrological drought, ecological collapse).",
      useful: isAmharic
        ? "አንድ አካባቢ ለምን እንደተጎዳ ሳይንሳዊና ግልጽ የሆነ ማብራሪያ ይሰጣል"
        : "Provides transparent, scientifically sound justification for drought declarations without opaque black-box scoring.",
    },
    {
      id: "03",
      title: isAmharic ? "የረጅም ጊዜ የአየር ንብረት አዝማሚያ መርማሪ" : "Earth System Trend Detective",
      icon: TrendingDown,
      href: "/trends",
      problem: isAmharic
        ? "ድርቁ በጊዜ ሂደት እየተባባሰ ነው ወይስ የአንድ ወቅት ተፈጥሯዊ መዋዠቅ ነው? ለዚህ ጥያቄ ስታትስቲካዊ ማረጋገጫ ያስፈልጋል።"
        : "Is drought frequency and intensity accelerating over decades, or is this merely interannual noise? Detecting long-term drying requires non-parametric statistical rigor.",
      data: "24-Year Continuous NASA Satellite Archive (2000–2024)",
      produces: isAmharic
        ? "የ Mann-Kendall ስታትስቲክስ (S፣ Z፣ p-እሴት) እና የ Sen's slope የለውጥ ፍጥነት"
        : "Mann-Kendall monotonic trend tests (S, Z, p-value) and Sen's slope rate-of-change regressions immune to seasonal outliers.",
      useful: isAmharic
        ? "በአየር ንብረት ለውጥ ምክንያት እየደረቁ ያሉ ዞኖችን በማስረጃ አስደግፎ ለመለየት ያስችላል"
        : "Quantifies decadal drying trends (e.g. Borena NDVI decline of -0.0142/decade, p < 0.001) for evidence-based climate adaptation policy.",
    },
    {
      id: "04",
      title: isAmharic ? "የግብርና እና የአርብቶ አደር የተለየ ምዘና" : "Agricultural & Pastoral Stress Assessment",
      icon: Sprout,
      href: "/compare",
      problem: isAmharic
        ? "አርሶ አደሩና አርብቶ አደሩ ድርቅን በተለያየ መንገድ ያጋጥማቸዋል። አንድ አይነት መለኪያ ለሁለቱም አይሰራም።"
        : "Smallholder crop farmers and pastoral pastoralists experience drought fundamentally differently; a monolithic index serves neither stakeholder group adequately.",
      data: "Growing-season moisture for crops; Rangeland NDVI biomass & aquifer depth for livestock",
      produces: isAmharic
        ? "የሰብል ማብቀል ውድቀትን ከግጦሽ ሳር እልቂት ለይቶ የሚያቀርብ ዘርፈ-ብዙ የንፅፅር ዳሽቦርድ"
        : "Disaggregated sectoral risk dashboards comparing highland agricultural zones (e.g. Tigray) with arid lowland pastoral rangelands (e.g. Borena, Afar).",
      useful: isAmharic
        ? "ለእያንዳንዱ ዘርፍ ተስማሚ የሆነ የመፍትሔ አቅጣጫ ለመቀየስ ያግዛል"
        : "Delivers sector-tailored operational intelligence for seed replenishment versus livestock feed bank deployment.",
    },
    {
      id: "05",
      title: isAmharic ? "የቅድሚያ ምርመራ እና ማስጠንቀቂያ ስርዓት" : "Investigation Priority System",
      icon: AlertTriangle,
      href: "/alerts",
      problem: isAmharic
        ? "የትኞቹ ዞኖች አስቸኳይ ትኩረት ያስፈልጋቸዋል? ሀብትና እርዳታን በቅደም ተከተል ለማዳረስ ግልጽ ቅድሚያ ያስፈልጋል።"
        : "Disaster managers face constrained logistical resources and require clear, defensible rankings of which woredas face imminent humanitarian tipping points.",
      data: "Compound multi-sensor severity composite + Population vulnerability metrics",
      produces: isAmharic
        ? "በ 4 ደረጃዎች የተከፋፈለ (መካከለኛ፣ ከፍተኛ፣ ከባድ፣ ወሳኝ) የዞኖች ደረጃ እና የቀጥታ ማስጠንቀቂያ"
        : "Ranked zonal vulnerability priority queue categorized into Moderate, High, Severe, and Critical crisis tiers with simulated SMS broadcast.",
      useful: isAmharic
        ? "የሰብዓዊ እርዳታ ሰጪዎች አደጋው ወደከፋበት ቦታ ፈጥነው እንዲደርሱ ይመራል"
        : "Guides field survey teams and emergency humanitarian logistics directly to zones in compound breakdown before mortality peaks.",
    },
  ];

  const satelliteMissions = [
    {
      name: "NASA GPM IMERG V07",
      title: "Global Precipitation Measurement",
      spec: "0.1° (~10km) · 30-Min Temporal · Radar & Radiometer Constellation",
      desc: "Multi-satellite precipitation estimates calibrated against TRMM and GPM Core Observatory radars.",
    },
    {
      name: "NASA FLDAS Noah LSM",
      title: "Famine Land Data Assimilation",
      spec: "0.1° Grid · Daily · 0–10cm & 10–100cm Subsurface Layers",
      desc: "Hydrological soil moisture simulation tracking subterranean moisture reservoir depletion.",
    },
    {
      name: "MODIS Terra MOD13A2",
      title: "Moderate Resolution Imaging",
      spec: "1km Spatial · 16-Day Cloud-Free Composites · NDVI & EVI",
      desc: "Canopy spectral reflectance measuring photosynthetic vegetation vitality and rangeland health.",
    },
    {
      name: "NASA GRACE / GRACE-FO",
      title: "Gravity Recovery & Climate Experiment",
      spec: "Terrestrial Water Storage · Aquifer Mass Anomalies",
      desc: "Detects large-scale groundwater and aquifer mass variations beneath the Horn of Africa.",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#040507] text-[#FBFCFD] selection:bg-accent-cyan/30 selection:text-white pb-24">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 25%, rgba(40, 215, 197, 0.12) 0%, rgba(4, 5, 7, 0.92) 65%, #040507 100%)",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-accent-cyan/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 space-y-20">
        {/* ========================================================
            HERO: OUR SOLUTION
            ======================================================== */}
        <section className="text-center max-w-4xl mx-auto pt-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-cyan/15 border border-accent-cyan/35 text-accent-cyan text-xs font-mono tracking-wider">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>
              {isAmharic ? "መፍትሔያችን · የሳተላይት መረጃ ጥምረት" : "INTELLIGENCE PLATFORM · NASA SPACE APPS 2026"}
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FBFCFD] leading-[1.1]">
            {isAmharic ? (
              <>
                ETHIODROUGHT፡ <br />
                <span className="text-accent-cyan">የተቀናጀ የድርቅ መረጃ ማዕከል</span>
              </>
            ) : (
              <>
                ETHIODROUGHT: <br />
                <span className="text-accent-cyan">Regional Drought Intelligence Platform</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[#A8BFDC] max-w-2xl mx-auto leading-relaxed font-sans">
            {isAmharic
              ? "ETHIODROUGHT የ 3 የናሳ ሳተላይት መረጃዎችን በማጣመር የኢትዮጵያን ድርቅ አደጋ በከፍተኛ ትክክለኛነት የሚከታተል፣ የሚተነትንና ቅድመ ማስጠንቀቂያ የሚሰጥ ሳይንሳዊ ስርዓት ነው።"
              : "A specialized Earth observation intelligence system fusing 3 NASA satellite data streams into a unified operational platform for detecting, diagnosing, and monitoring compound environmental drought stress across Ethiopia."}
          </p>
        </section>

        {/* ========================================================
            FIVE CAPABILITY CARDS
            ======================================================== */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(168,191,220,0.12)]">
            <div className="space-y-1">
              <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
                {isAmharic ? "ዋና ዋና አገልግሎቶች" : "CORE SCIENTIFIC CAPABILITIES"}
              </span>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#FBFCFD]">
                {isAmharic ? "5 ቁልፍ የመመርመሪያ ክፍሎች" : "Five Multi-Sensor Analytical Engines"}
              </h2>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-panel-dark border border-white/10 text-xs font-mono text-[#A8BFDC]">
              Fully Integrated
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {capabilities.map((cap) => {
              const IconComp = cap.icon;
              return (
                <div
                  key={cap.id}
                  className="nasa-panel p-8 rounded-3xl border border-[rgba(168,191,220,0.18)] hover:border-accent-cyan/40 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group"
                >
                  {/* Left: Icon, ID, Title & CTA */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-2xl font-bold text-accent-cyan">
                        {cap.id}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-accent-blue/30 border border-accent-blue/50 flex items-center justify-center text-accent-cyan group-hover:scale-105 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-heading text-xl lg:text-2xl font-bold text-[#FBFCFD] group-hover:text-accent-cyan transition-colors">
                      {cap.title}
                    </h3>

                    <Link
                      href={cap.href}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan text-accent-cyan hover:text-[#040507] border border-accent-cyan/35 text-xs font-mono font-bold tracking-wider transition-all"
                    >
                      <span>{isAmharic ? "ክፍሉን ይክፈቱ" : "LAUNCH WORKSPACE"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Middle & Right: Problem, Data, Produces & Useful */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    {/* Problem */}
                    <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.12)] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-red-400 font-bold tracking-wider block">
                        {isAmharic ? "የሚፈታው ችግር" : "PROBLEM ADDRESSED"}
                      </span>
                      <p className="text-[#A8BFDC] leading-relaxed">{cap.problem}</p>
                    </div>

                    {/* Data */}
                    <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.12)] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-accent-cyan font-bold tracking-wider block">
                        {isAmharic ? "የሚጠቀመው ዳታ" : "SATELLITE DATA SOURCES"}
                      </span>
                      <p className="text-[#A8BFDC] leading-relaxed font-mono text-[11px]">{cap.data}</p>
                    </div>

                    {/* Produces */}
                    <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.12)] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider block">
                        {isAmharic ? "የሚሰጠው ውጤት" : "WHAT IT PRODUCES"}
                      </span>
                      <p className="text-[#A8BFDC] leading-relaxed">{cap.produces}</p>
                    </div>

                    {/* Useful */}
                    <div className="p-4 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.12)] space-y-1">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider block">
                        {isAmharic ? "ለምን ይጠቅማል" : "WHY IT IS USEFUL"}
                      </span>
                      <p className="text-[#A8BFDC] leading-relaxed">{cap.useful}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            NASA DATA SOURCES
            ======================================================== */}
        <section className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(168,191,220,0.12)]">
            <div className="space-y-1">
              <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
                {isAmharic ? "የመረጃ ምንጮች" : "PRIMARY SATELLITE CONSTELLATIONS"}
              </span>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#FBFCFD]">
                {isAmharic ? "በናሳ የምድር ሳይንስ ሳተላይቶች የተደገፈ" : "Powered by NASA Earth Science Missions"}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent-blue/20 border border-accent-blue/30 text-xs font-mono text-accent-light">
              Verified Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {satelliteMissions.map((mission, idx) => (
              <div
                key={idx}
                className="nasa-reference-glass p-6 rounded-3xl flex flex-col justify-between space-y-4 border border-[rgba(168,191,220,0.16)]"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-panel-dark border border-white/10 flex items-center justify-center text-accent-cyan">
                    <Satellite className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#FBFCFD]">
                    {mission.name}
                  </h3>
                  <div className="text-xs font-semibold text-accent-light">
                    {mission.title}
                  </div>
                  <p className="text-xs text-[#A8BFDC] leading-relaxed">
                    {mission.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(168,191,220,0.1)] text-[10px] font-mono text-accent-cyan">
                  {mission.spec}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            BOTTOM CALL TO ACTION
            ======================================================== */}
        <section className="nasa-reference-glass p-10 lg:p-14 rounded-3xl border border-accent-cyan/30 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
              {isAmharic ? "ወደ ስራው ግቡ" : "READY TO EXPLORE"}
            </span>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-[#FBFCFD]">
              {isAmharic ? "የኢትዮጵያን የድርቅ ዳታ አሁኑኑ ያስሱ" : "Launch the Analytical Workspace"}
            </h2>
            <p className="text-xs sm:text-sm text-[#A8BFDC] max-w-xl mx-auto">
              {isAmharic
                ? "በይነተገናኝ ካርታውን ይክፈቱ፣ የዞኖችን አደጋ ደረጃ ያነፃፅሩ፣ ወይም የ 24 ዓመታት ታሪካዊ የአየር ንብረት አዝማሚያዎችን ይመልከቱ።"
                : "Explore high-resolution spatial maps across 800+ woredas, inspect triple-sensor drought fingerprints, or run Mann-Kendall trend regressions."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/explore"
              className="px-8 py-4 rounded-2xl bg-accent-cyan text-[#040507] hover:bg-white font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_25px_rgba(40,215,197,0.4)] flex items-center gap-2"
            >
              <span>{isAmharic ? "የኢትዮጵያን ካርታ ያስሱ" : "EXPLORE ETHIOPIA MAP"}</span>
              <Compass className="w-4 h-4" />
            </Link>

            <Link
              href="/fingerprint"
              className="px-8 py-4 rounded-2xl bg-[#162036] hover:bg-[#253352] border border-[rgba(168,191,220,0.2)] text-[#FBFCFD] font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2"
            >
              <span>{isAmharic ? "የድርቅ አሻራ መመርመሪያ" : "VIEW DROUGHT FINGERPRINT"}</span>
              <Fingerprint className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
