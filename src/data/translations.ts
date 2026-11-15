export type Language = 'en' | 'am';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  taglineSecondary: string;
  nav: {
    overview: string;
    explore: string;
    droughtMap: string;
    fingerprint: string;
    trendDetective: string;
    comparison: string;
    alerts: string;
    datasets: string;
    data: string;
    methodology: string;
    about: string;
    lab: string;
  };
  hero: {
    boranaZone: string;
    oromiaRegion: string;
    observationPeriod: string;
    dataSource: string;
    verifiedData: string;
    exploreTrends: string;
    satelliteActive: string;
  };
  metrics: {
    rainfallAnomaly: string;
    soilMoistureAnomaly: string;
    vegetationHealth: string;
    droughtFingerprint: string;
    observedValue: string;
    baselineAverage: string;
    anomalyZ: string;
    standardDev: string;
    historicalTrend: string;
  };
  insights: {
    heading: string;
    fingerprintCardTitle: string;
    environmentalTrendTitle: string;
    regionalObservationTitle: string;
    scientificExplanationTitle: string;
    rainfallSignal: string;
    soilSignal: string;
    vegetationSignal: string;
    combinedInterpretation: string;
  };
  panels: {
    environmentalHistory: string;
    droughtIndicators: string;
    regionalComparison: string;
    dataSources: string;
    rainfall: string;
    soilMoisture: string;
    ndvi: string;
  };
  commandBar: {
    placeholder: string;
    actionSearch: string;
    shortcuts: string;
  };
  trendDetective: {
    title: string;
    subtitle: string;
    variableSelect: string;
    regionSelect: string;
    periodSelect: string;
    aggregation: string;
    monthly: string;
    annual: string;
    sensSlope: string;
    mannKendall: string;
    pValue: string;
    statisticalSignificance: string;
    methodologyNote: string;
  };
  comparison: {
    title: string;
    region1: string;
    region2: string;
    selectRegions: string;
    crossLag: string;
    correlation: string;
  };
  methodology: {
    title: string;
    subtitle: string;
    fldasTitle: string;
    gpmTitle: string;
    modisTitle: string;
  };
  about: {
    title: string;
    whyEthiopia: string;
    nasaRelevance: string;
  };
  story: {
    heroTitle: string;
    heroSubtitle: string;
    exploreEthiopia: string;
    discoverApproach: string;
    problemTitle: string;
    problemSubtitle: string;
    historicalHeading: string;
    recentHeading: string;
    statLivestockTotal: string;
    statLivestockTotalLabel: string;
    statLivestockBorena: string;
    statLivestockBorenaLabel: string;
    statBorenaPop: string;
    statBorenaPopLabel: string;
    statAssistance: string;
    statAssistanceLabel: string;
    kiremtDeficit: string;
    northernAfarDry: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "ETHIODROUGHT",
    tagline: "BEYOND RAINFALL",
    taglineSecondary: "Turning NASA Earth observations into understandable environmental intelligence for Ethiopia.",
    nav: {
      overview: "Overview",
      explore: "Explore",
      droughtMap: "Drought Map",
      fingerprint: "Drought Fingerprint",
      trendDetective: "Trend Detective",
      comparison: "Regional Comparison",
      alerts: "Alerts (Demo)",
      datasets: "Datasets",
      data: "Data & Transparency",
      methodology: "Methodology",
      about: "About ETHIODROUGHT",
      lab: "Investigation Lab",
    },
    hero: {
      boranaZone: "BORANA ZONE",
      oromiaRegion: "OROMIA REGION, ETHIOPIA",
      observationPeriod: "LATEST OBSERVATION: NOV 2024",
      dataSource: "NASA FLDAS • GPM • MODIS",
      verifiedData: "VERIFIED SATELLITE ARCHIVE",
      exploreTrends: "EXPLORE SIGNALS",
      satelliteActive: "ACTIVE CONSTELLATION OVER ETHIOPIA",
    },
    metrics: {
      rainfallAnomaly: "Rainfall Anomaly",
      soilMoistureAnomaly: "Soil Moisture Anomaly",
      vegetationHealth: "Vegetation Health (NDVI)",
      droughtFingerprint: "Drought Fingerprint",
      observedValue: "Observed Value",
      baselineAverage: "Monthly Baseline (μ)",
      anomalyZ: "Standardized Anomaly (Z)",
      standardDev: "Std Deviation (σ)",
      historicalTrend: "Historical Trend",
    },
    insights: {
      heading: "DROUGHT INSIGHTS",
      fingerprintCardTitle: "Drought Fingerprint",
      environmentalTrendTitle: "Environmental Trend (2000–2024)",
      regionalObservationTitle: "Regional Observation Target",
      scientificExplanationTitle: "Scientific Explanation",
      rainfallSignal: "Rainfall Signal",
      soilSignal: "Soil Moisture Signal",
      vegetationSignal: "Vegetation Signal",
      combinedInterpretation: "Combined Interpretation",
    },
    panels: {
      environmentalHistory: "Environmental History",
      droughtIndicators: "Drought Indicators Breakdown",
      regionalComparison: "Regional Contrast",
      dataSources: "NASA Data Provenance",
      rainfall: "Rainfall (GPM)",
      soilMoisture: "Soil Moisture (FLDAS)",
      ndvi: "Vegetation (MODIS)",
    },
    commandBar: {
      placeholder: "Search an Ethiopian region or ask about environmental trends...",
      actionSearch: "Analyze",
      shortcuts: "Quick Query",
    },
    trendDetective: {
      title: "Earth System Trend Detective",
      subtitle: "Investigating 24-year environmental trends across Ethiopia with Mann-Kendall and Sen's Slope",
      variableSelect: "Environmental Variable",
      regionSelect: "Geographic Target",
      periodSelect: "Observation Window",
      aggregation: "Aggregation Mode",
      monthly: "Monthly Anomalies",
      annual: "Annual Mean",
      sensSlope: "Sen's Slope",
      mannKendall: "Mann-Kendall Test",
      pValue: "p-value",
      statisticalSignificance: "Statistical Significance",
      methodologyNote: "Non-parametric robust estimation against seasonal outliers and non-normal distributions.",
    },
    comparison: {
      title: "Regional Agro-Ecological Comparison",
      region1: "Primary Region",
      region2: "Comparison Region",
      selectRegions: "Compare Two Ethiopian Zones",
      crossLag: "Hydrological Lag Analysis",
      correlation: "Correlation Matrix",
    },
    methodology: {
      title: "Scientific Methodology & Data Provenance",
      subtitle: "Mathematical rigor, satellite sensor specifications, and Earth observation limitations",
      fldasTitle: "NASA FLDAS Noah Land Surface Model (0.1°)",
      gpmTitle: "NASA GPM IMERG Precipitation (0.1°)",
      modisTitle: "NASA MODIS MOD13A2 / MYD13A2 NDVI (1km / 0.05°)",
    },
    about: {
      title: "About ETHIODROUGHT",
      whyEthiopia: "Why Ethiopia? Pastoral Rangelands & Climate Stress",
      nasaRelevance: "NASA Space Apps 2026: Be An Earth System Trend Detective",
    },
    story: {
      heroTitle: "Beyond Rainfall. Understanding Ethiopia's Changing Climate.",
      heroSubtitle: "An Earth-observation-powered platform for detecting, understanding, and monitoring environmental drought stress across Ethiopia.",
      exploreEthiopia: "Explore Ethiopia",
      discoverApproach: "Discover Our Approach",
      problemTitle: "The Problem — Why Ethiopia?",
      problemSubtitle: "Why traditional rainfall metrics fail to reveal deep hydrological depletion, cascading rangeland collapse, and food insecurity.",
      historicalHeading: "Historical Drought Impact (2020–2023)",
      recentHeading: "Recent Environmental Conditions (2026–2027)",
      statLivestockTotal: "> 6.8 Million",
      statLivestockTotalLabel: "Livestock Deaths Across Affected Ethiopian Regions",
      statLivestockBorena: "> 3.3 Million",
      statLivestockBorenaLabel: "Livestock Deaths Reported in Borena Zone Alone",
      statBorenaPop: "~ 1.7 Million",
      statBorenaPopLabel: "Borena Population (2023 Assessment)",
      statAssistance: "> 50%",
      statAssistanceLabel: "Borena Population Needing Emergency Food Assistance",
      kiremtDeficit: "The 2026 Kiremt season experienced significant rainfall deficits across parts of Tigray, eastern Amhara, and eastern Oromia, directly suppressing crop germination and vegetative development.",
      northernAfarDry: "Northern Afar entered the October 2026–March 2027 dry period with severely below-average livestock body conditions, acute pasture exhaustion, and critical water point drying.",
    },
  },
  am: {
    appName: "ኢትዮ-ድርቅ (ETHIODROUGHT)",
    tagline: "ከዝናብ ባሻገር (BEYOND RAINFALL)",
    taglineSecondary: "የናሳ ሳተላይት መረጃዎችን ወደ ግልጽ የአካባቢና የድርቅ ሳይንሳዊ ግንዛቤ መቀየር።",
    nav: {
      overview: "አጠቃላይ እይታ",
      explore: "ኢትዮጵያን ያስሱ",
      droughtMap: "የድርቅ ካርታ",
      fingerprint: "የድርቅ አሻራ ሞተር",
      trendDetective: "የአዝማሚያ መርማሪ",
      comparison: "የክልሎች ንጽጽር",
      alerts: "ማስጠንቀቂያ (Demo)",
      datasets: "የመረጃ ስብስቦች",
      data: "መረጃ እና ግልጽነት",
      methodology: "ሳይንሳዊ ስነ-ዘዴ",
      about: "ስለ ኢትዮ-ድርቅ",
      lab: "የምርምር ላብራቶሪ",
    },
    hero: {
      boranaZone: "ቦረና ዞን",
      oromiaRegion: "ኦሮሚያ ክልል፣ ኢትዮጵያ",
      observationPeriod: "የቅርብ ጊዜ መረጃ: ኅዳር 2024",
      dataSource: "ናሳ FLDAS • GPM • MODIS",
      verifiedData: "የተረጋገጠ የሳተላይት ማህደር",
      exploreTrends: "ምልክቶችን መርምር",
      satelliteActive: "ሳተላይቶች በኢትዮጵያ ምህዋር ላይ ይገኛሉ",
    },
    metrics: {
      rainfallAnomaly: "የዝናብ መጠን ልዩነት",
      soilMoistureAnomaly: "የአፈር እርጥበት ልዩነት",
      vegetationHealth: "የዕፅዋት ጤና (NDVI)",
      droughtFingerprint: "የድርቅ ምልክት መለያ",
      observedValue: "የተመዘገበ ዋጋ",
      baselineAverage: "የወር መደበኛ አማካይ (μ)",
      anomalyZ: "የተስተካከለ ልዩነት (Z)",
      standardDev: "መደበኛ ልዩነት (σ)",
      historicalTrend: "ታሪካዊ የለውጥ ሂደት",
    },
    insights: {
      heading: "የድርቅ ሳይንሳዊ ግንዛቤ",
      fingerprintCardTitle: "የድርቅ ምልክት መለያ",
      environmentalTrendTitle: "የ24 ዓመታት የአካባቢ ለውጥ (2000–2024)",
      regionalObservationTitle: "የተመረጠው የጥናት አካባቢ",
      scientificExplanationTitle: "ሳይንሳዊ ማብራሪያ",
      rainfallSignal: "የዝናብ ምልክት",
      soilSignal: "የአፈር እርጥበት ምልክት",
      vegetationSignal: "የዕፅዋት ምልክት",
      combinedInterpretation: "የተቀናጀ ድምዳሜ",
    },
    panels: {
      environmentalHistory: "የአካባቢ ታሪካዊ ሂደት",
      droughtIndicators: "የሦስቱ ጠቋሚዎች ዝርዝር",
      regionalComparison: "የአካባቢዎች ንፅፅር",
      dataSources: "የናሳ ሳተላይት መረጃ ምንጮች",
      rainfall: "ዝናብ (GPM)",
      soilMoisture: "የአፈር እርጥበት (FLDAS)",
      ndvi: "የዕፅዋት ሽፋን (MODIS)",
    },
    commandBar: {
      placeholder: "የኢትዮጵያ ዞንን ይፈልጉ ወይም ስለ ድርቅ ሁኔታ ጥያቄ ይጠይቁ...",
      actionSearch: "ተንትን",
      shortcuts: "ፈጣን ጥያቄዎች",
    },
    trendDetective: {
      title: "የምድር ስነ-ምህዳር ለውጥ መርማሪ",
      subtitle: "የ24 ዓመታት የኢትዮጵያን የአካባቢ ለውጥ በ Mann-Kendall እና Sen's Slope ስሌት መመርመር",
      variableSelect: "የአካባቢ መለኪያ",
      regionSelect: "የጂኦግራፊ አካባቢ",
      periodSelect: "የጊዜ መስኮት",
      aggregation: "የመረጃ ስብስብ",
      monthly: "ወርሃዊ ልዩነቶች",
      annual: "ዓመታዊ አማካይ",
      sensSlope: "የለውጥ ፍጥነት (Sen's Slope)",
      mannKendall: "የ Mann-Kendall ፈተና",
      pValue: "p-እሴት",
      statisticalSignificance: "ሳይንሳዊ አስተማማኝነት",
      methodologyNote: "ወቅታዊ ያልተለመዱ ሁኔታዎችን ያማከለ አስተማማኝ ስታትስቲካዊ ስሌት።",
    },
    comparison: {
      title: "የአግሮ-ኢኮሎጂካል ዞኖች ንፅፅር",
      region1: "ዋና ክልል/ዞን",
      region2: "የንፅፅር ክልል/ዞን",
      selectRegions: "ሁለት የኢትዮጵያ ዞኖችን ያነፃፅሩ",
      crossLag: "የዝናብና የዕፅዋት መዘግየት ትንተና",
      correlation: "የተዛምዶ ማትሪክስ",
    },
    methodology: {
      title: "ሳይንሳዊ ስነ-ዘዴና የመረጃ ምንጮች",
      subtitle: "የሒሳብ ቀመሮች፣ የሳተላይት መለኪያዎች እና የሳተላይት መረጃ ውስንነቶች",
      fldasTitle: "ናሳ FLDAS ኖህ የመሬት ሞዴል (0.1°)",
      gpmTitle: "ናሳ GPM IMERG የዝናብ መጠን (0.1°)",
      modisTitle: "ናሳ MODIS MOD13A2 የዕፅዋት ሽፋን (1km / 0.05°)",
    },
    about: {
      title: "ስለ ኢትዮ-ድርቅ (ETHIODROUGHT)",
      whyEthiopia: "ለምን ኢትዮጵያ? የአርብቶ አደር አካባቢዎችና የአየር ንብረት ጫና",
      nasaRelevance: "የናሳ ስፔስ አፕስ 2026 ውድድር ተሳትፎ",
    },
    story: {
      heroTitle: "ከዝናብ ባሻገር። የኢትዮጵያን ተለዋዋጭ አየር ንብረት መረዳት።",
      heroSubtitle: "በኢትዮጵያ ዙሪያ የአካባቢ ድርቅ ጫናን በሳተላይት ምልከታ ለመለየት፣ ለመረዳትና ለመከታተል የተዘጋጀ ሳይንሳዊ መድረክ።",
      exploreEthiopia: "ኢትዮጵያን ያስሱ",
      discoverApproach: "ሳይንሳዊ አካሄዳችንን ይመልከቱ",
      problemTitle: "ችግሩ — ለምን ኢትዮጵያ?",
      problemSubtitle: "ባህላዊ የዝናብ መለኪያዎች ብቻቸውን ጥልቅ የአፈር መድረቅንና የአርብቶ አደሩን ቀውስ ለምን መግለጽ እንዳቃታቸው ማሳያ።",
      historicalHeading: "ታሪካዊ የድርቅ ጉዳት (2020–2023)",
      recentHeading: "የቅርብ ጊዜ የአካባቢ ሁኔታዎች (2026–2027)",
      statLivestockTotal: "> 6.8 ሚሊዮን",
      statLivestockTotalLabel: "በኢትዮጵያ የተጎዱ ክልሎች የሞቱ የቤት እንስሳት ብዛት",
      statLivestockBorena: "> 3.3 ሚሊዮን",
      statLivestockBorenaLabel: "በቦረና ዞን ብቻ የሞቱ የቤት እንስሳት ብዛት",
      statBorenaPop: "~ 1.7 ሚሊዮን",
      statBorenaPopLabel: "የቦረና ዞን ህዝብ ብዛት (በ2023 ግምገማ)",
      statAssistance: "> 50%",
      statAssistanceLabel: "አስቸኳይ የምግብ እርዳታ የሚያስፈልገው የቦረና ህዝብ ድርሻ",
      kiremtDeficit: "የ2026 የክረምት ወቅት በትግራይ፣ በምስራቅ አማራና በምስራቅ ኦሮሚያ ክፍሎች ከፍተኛ የዝናብ እጥረት በማስከተሉ የሰብል ማብቀልና እድገትን ጎድቷል።",
      northernAfarDry: "ሰሜን አፋር ከጥቅምት 2026 እስከ መጋቢት 2027 ያለውን ደረቅ ወቅት ዝቅተኛ የእንስሳት ጤና እና ከፍተኛ የግጦሽና የውሃ እጥረት ባለበት ሁኔታ ጀምሯል።",
    },
  },
};
