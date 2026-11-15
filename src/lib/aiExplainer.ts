/**
 * Scientific Narrative Explainer & Trend Synthesis
 * Deterministic, mathematically grounded translation of calculated satellite indicators
 * into peer-reviewed research insights and humanitarian policy briefings.
 */

import { MannKendallResult } from './stats';
import { FingerprintDiagnosis } from './droughtEngine';

export interface ExplanationPayload {
  regionName: string;
  variableName: string;
  dateStr: string;
  rainfallZ: number;
  soilZ: number;
  vegZ: number;
  diagnosis: FingerprintDiagnosis;
  trendResult?: MannKendallResult;
  periodLabel: string;
}

export function generateScientificExplanation(
  payload: ExplanationPayload,
  mode: 'research' | 'policy' = 'research'
): { english: string; amharic: string } {
  const { regionName, variableName, dateStr, rainfallZ, soilZ, vegZ, diagnosis, trendResult, periodLabel } = payload;

  if (mode === 'policy') {
    const en = `Exploratory summary for ${regionName} (${dateStr}; ${periodLabel}):
${diagnosis.title.toUpperCase()} is indicated by the input series. Standardized input values are rainfall ${rainfallZ >= 0 ? '+' : ''}${rainfallZ.toFixed(2)}σ, soil moisture ${soilZ >= 0 ? '+' : ''}${soilZ.toFixed(2)}σ, and vegetation ${vegZ >= 0 ? '+' : ''}${vegZ.toFixed(2)}σ. Inputs are not independently verified; this is not an official humanitarian advisory.
${diagnosis.summary}
Potential implication to investigate: ${diagnosis.agriculturalImplication}`;

    const am = `የምርመራ ማጠቃለያ ለ${regionName} (${dateStr}; ${periodLabel})፡
${diagnosis.titleAmharic} በግቤት የጊዜ ተከታታይ ተጠቁሟል። የግቤት መደበኛ እሴቶች፡ ዝናብ ${rainfallZ >= 0 ? '+' : ''}${rainfallZ.toFixed(2)}σ፣ የአፈር እርጥበት ${soilZ >= 0 ? '+' : ''}${soilZ.toFixed(2)}σ፣ ዕፅዋት ${vegZ >= 0 ? '+' : ''}${vegZ.toFixed(2)}σ ናቸው። ግቤቶቹ በግል አልተረጋገጡም፤ ይህ ይፋዊ የሰብዓዊ ድጋፍ ምክር አይደለም።
${diagnosis.summaryAmharic}
ሊመረመር የሚችል ተጽዕኖ፡ ${diagnosis.agriculturalImplication}`;

    return { english: en, amharic: am };
  }

  // Academic / Remote Sensing Research Mode
  let trendSectionEn = "";
  let trendSectionAm = "";
  if (trendResult) {
    const trendWord = trendResult.trend === 'increasing' ? 'increasing' : trendResult.trend === 'decreasing' ? 'decreasing' : 'non-monotonic';
    const significance = trendResult.significant ? 'statistically significant' : 'not statistically significant';
    trendSectionEn = `\nTrend analysis of ${variableName} across ${periodLabel} indicates a ${trendWord} direction that is ${significance} at α = 0.05 (Theil-Sen slope Q = ${trendResult.sensSlope > 0 ? '+' : ''}${trendResult.sensSlope.toFixed(5)} units/step, Mann-Kendall score S = ${trendResult.S}, standardized Z = ${trendResult.zScore.toFixed(2)}, two-tailed p = ${trendResult.pValue.toFixed(4)}).`;

    const trendWordAm = trendResult.trend === 'increasing' ? 'እያደገ የሚሄድ' : trendResult.trend === 'decreasing' ? 'ቀጣይነት ያለው ቅናሽ የሚያሳይ' : 'የተረጋጋ ወይም ጉልህ ለውጥ የሌለው';
    const significanceAm = trendResult.significant ? 'በ α = 0.05 ስታትስቲካዊ ጉልህ ነው' : 'በ α = 0.05 ስታትስቲካዊ ጉልህ አይደለም';
    trendSectionAm = `\nበ${periodLabel} የጊዜ መስኮት ውስጥ የ${variableName} አዝማሚያ ${trendWordAm} ነው፤ ${significanceAm} (Sen's slope Q = ${trendResult.sensSlope.toFixed(5)}፣ Mann-Kendall S = ${trendResult.S}፣ Z = ${trendResult.zScore.toFixed(2)}፣ p = ${trendResult.pValue.toFixed(4)})።`;
  }

  const en = `Exploratory indicator diagnostic (${regionName}, ${dateStr}; ${periodLabel}):
The input-series fingerprint indicates ${diagnosis.title} (Phase: ${diagnosis.phase}). Inputs have not been independently verified.
${diagnosis.scientificExplanation}
Input standardized departures: precipitation Z = ${rainfallZ.toFixed(2)}σ, soil moisture Z = ${soilZ.toFixed(2)}σ, vegetation Z = ${vegZ.toFixed(2)}σ.${trendSectionEn}`;

  const am = `የግቤት ጠቋሚዎች የምርመራ ትንተና (${regionName}፣ ${dateStr}; ${periodLabel})፡
የጊዜ ተከታታዩ የድርቅ አሻራ ${diagnosis.titleAmharic} ያመለክታል። ግቤቶቹ በግል አልተረጋገጡም።
${diagnosis.scientificExplanation}
የግቤት መደበኛ ልዩነቶች፡ ዝናብ Z = ${rainfallZ.toFixed(2)}σ፣ የአፈር እርጥበት Z = ${soilZ.toFixed(2)}σ፣ ዕፅዋት Z = ${vegZ.toFixed(2)}σ።${trendSectionAm}`;

  return { english: en, amharic: am };
}
