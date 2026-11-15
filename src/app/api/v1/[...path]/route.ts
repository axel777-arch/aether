import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { REGIONS_DATA } from '@/data/monthlyObservations';
import borenaBoundary from '@/data/borenaBoundary.json';
import { DATASETS, DATA_SOURCE_REFERENCES, DEMONSTRATION_PROVENANCE } from '@/lib/backend/catalog';
import {
  calculateEnvironmentalPriority,
  calculateMannKendall,
  classifyRecovery,
  detectEnvironmentalAlert,
  detectFingerprintPatterns,
  rainfallAnomalyPercent,
  soilMoistureAnomaly,
  summarizeBaseline,
  vegetationAnomaly,
} from '@/lib/backend/science';
import {
  assertSampleMessage,
  createMockSmsProvider,
  generateSampleMessage,
  isSampleSmsMode,
  SMS_MODE,
} from '@/lib/backend/notifications';
import {
  createSampleEmailAlert,
  getEmailTransportConfig,
  sendEmailAlert,
} from '@/lib/backend/email-alerts';
import {
  readBackendState,
  updateBackendState,
  type StoredAlert,
  type StoredContact,
  type StoredEmailAlert,
  type StoredIngestion,
  type StoredMessage,
  type StoredObservation,
} from '@/lib/backend/state';
import { validateCsvUpload, type CsvIngestionValidation } from '@/lib/backend/ingestion';
import { fetchBorenaNasaPowerObservations } from '@/lib/backend/nasa-power';

export const runtime = 'nodejs';

type IndicatorKey = 'rainfall' | 'soilMoisture' | 'vegetation';
type MonthlyRecord = (typeof REGIONS_DATA)[string]['records'][number];
interface IndicatorResponse {
  latest: { value: number; date: string; unit: string };
  anomaly: { standardized: number | null; value: number | null; unit: string };
  baseline: ReturnType<typeof summarizeBaseline> & { start: string; end: string; comparison: string };
  observations: Array<{
    date: string;
    value: number;
    anomaly: number | null;
    standardizedAnomaly: number | null;
    units: string;
    sourceDataset: string;
    processingDate: null;
    qualityFlags: string[];
  }>;
  sourceDataset: string;
  productId: null;
  observationPeriod: { start: string; end: string };
  processing: { method: string; qualityFiltersApplied: string[] };
  dataQuality: ReturnType<typeof qualityForDemonstration>;
  limitations: readonly string[];
}

const REGION_NAMES: Record<string, { name: string; level: string; parentId: string | null }> = {
  borena: { name: 'Borena Zone', level: 'zone', parentId: 'oromia' },
  somali: { name: 'Somali Region (Fafan Zone)', level: 'region', parentId: 'ethiopia' },
  tigray: { name: 'Tigray Region', level: 'region', parentId: 'ethiopia' },
};
const BASELINE_START_YEAR = Number(process.env.BASELINE_START_YEAR || 2000);
const BASELINE_END_YEAR = Number(process.env.BASELINE_END_YEAR || 2020);
const MIN_BASELINE_OBSERVATIONS = Number(process.env.MIN_BASELINE_OBSERVATIONS || 10);
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 120;
const MAX_CSV_UPLOAD_BYTES = 2 * 1024 * 1024;
const MAX_CSV_UPLOAD_ROWS = 5000;
const requests = new Map<string, { start: number; count: number }>();

function json(body: unknown, status = 200, request?: Request) {
  const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
  const origin = request?.headers.get('origin');
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',').map((item) => item.trim()).filter(Boolean);
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return NextResponse.json(body, { status, headers });
}

function rateLimited(request: Request) {
  const now = Date.now();
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const current = requests.get(key);
  if (!current || now - current.start >= RATE_LIMIT_WINDOW_MS) {
    requests.set(key, { start: now, count: 1 });
    return false;
  }
  current.count++;
  return current.count > RATE_LIMIT_MAX;
}

function validRegion(regionId: string) {
  return Object.prototype.hasOwnProperty.call(REGIONS_DATA, regionId);
}

function makeSeries(regionId: string) {
  if (!validRegion(regionId)) return null;
  const region = REGIONS_DATA[regionId];
  const records = region.records;
  const variableConfig = {
    rainfall: {
      unit: 'mm/month',
      dataset: 'gpm-imerg',
      value: (record: MonthlyRecord) => record.rainfallMm,
    },
    soilMoisture: {
      unit: 'm³/m³',
      dataset: 'fldas',
      value: (record: MonthlyRecord) => record.soilMoistureM3M3,
    },
    vegetation: {
      unit: 'NDVI',
      dataset: 'modis-mod13a2',
      value: (record: MonthlyRecord) => record.ndvi,
    },
  };
  const series = {} as Record<IndicatorKey, {
    key: IndicatorKey;
    unit: string;
    dataset: string;
    points: Array<{ date: string; value: number; anomaly: number | null; zScore: number | null }>;
  }>;
  (Object.keys(variableConfig) as IndicatorKey[]).forEach((key) => {
    const config = variableConfig[key];
    const byMonth = new Map<number, ReturnType<typeof summarizeBaseline>>();
    for (let month = 1; month <= 12; month++) {
      byMonth.set(month, summarizeBaseline(records
        .filter((record) => record.year >= BASELINE_START_YEAR && record.year <= BASELINE_END_YEAR && record.month === month)
        .map((record) => config.value(record)), MIN_BASELINE_OBSERVATIONS));
    }
    const points = records.map((record) => {
      const monthBaseline = byMonth.get(record.month) ?? summarizeBaseline([], MIN_BASELINE_OBSERVATIONS);
      const observed = config.value(record);
      const departure = monthBaseline.mean === null ? null : observed - monthBaseline.mean;
      const zScore = departure === null || monthBaseline.standardDeviation === null || monthBaseline.standardDeviation <= 0
        ? null
        : departure / monthBaseline.standardDeviation;
      const anomaly = key === 'rainfall' && monthBaseline.mean !== null
        ? rainfallAnomalyPercent(observed, monthBaseline.mean)
        : key === 'soilMoisture' && monthBaseline.mean !== null
          ? soilMoistureAnomaly(observed, monthBaseline.mean).difference
          : key === 'vegetation' && monthBaseline.mean !== null
            ? vegetationAnomaly(observed, monthBaseline.mean)
            : null;
      return {
        date: record.date,
        value: observed,
        anomaly,
        zScore,
      };
    });
    series[key] = { key, unit: config.unit, dataset: config.dataset, points };
  });
  return { region, records, series };
}

function qualityForDemonstration() {
  return {
    status: 'insufficient' as const,
    validObservationCount: 0,
    missingObservationCount: null,
    note: DEMONSTRATION_PROVENANCE.sourceDescription,
  };
}

function indicatorPayload(regionId: string, key?: IndicatorKey) {
  const data = makeSeries(regionId);
  if (!data) return null;
  const entries = key ? [key] : ['rainfall', 'soilMoisture', 'vegetation'] as IndicatorKey[];
  const indicators = Object.fromEntries(entries.map((indicatorKey) => {
    const item = data.series[indicatorKey];
    const latest = item.points[item.points.length - 1];
    const years = data.records.filter((record) => record.year >= BASELINE_START_YEAR && record.year <= BASELINE_END_YEAR);
    const month = Number(latest.date.slice(5, 7));
    const baselineValues = years.filter((record) => record.month === month).map((record) => {
      if (indicatorKey === 'rainfall') return record.rainfallMm;
      if (indicatorKey === 'soilMoisture') return record.soilMoistureM3M3;
      return record.ndvi;
    });
    return [indicatorKey, {
      latest: { value: latest.value, date: latest.date, unit: item.unit },
      anomaly: { standardized: latest.zScore, value: latest.anomaly, unit: indicatorKey === 'rainfall' ? '%' : item.unit },
      baseline: {
        start: `${BASELINE_START_YEAR}-01`,
        end: `${BASELINE_END_YEAR}-12`,
        comparison: 'matching_calendar_month',
        ...summarizeBaseline(baselineValues, MIN_BASELINE_OBSERVATIONS),
      },
      observations: item.points.map((point) => ({
        date: point.date,
        value: point.value,
        anomaly: point.anomaly,
        standardizedAnomaly: point.zScore,
        units: item.unit,
        sourceDataset: DEMONSTRATION_PROVENANCE.sourceDataset,
        processingDate: null,
        qualityFlags: ['synthetic demonstration value', 'not an observed satellite measurement'],
      })),
      sourceDataset: DEMONSTRATION_PROVENANCE.sourceDataset,
      productId: null,
      observationPeriod: { start: data.records[0].date, end: latest.date },
      processing: { method: 'synthetic demonstration only', qualityFiltersApplied: [] },
      dataQuality: qualityForDemonstration(),
      limitations: DEMONSTRATION_PROVENANCE.limitations,
    } satisfies IndicatorResponse];
  })) as Partial<Record<IndicatorKey, IndicatorResponse>>;
  return { regionId, indicators, provenance: DEMONSTRATION_PROVENANCE };
}

function fingerprintPayload(regionId: string) {
  const payload = indicatorPayload(regionId);
  if (!payload) return null;
  const { rainfall, soilMoisture, vegetation } = payload.indicators;
  if (!rainfall || !soilMoisture || !vegetation) return null;
  const items: Record<IndicatorKey, IndicatorResponse> = { rainfall, soilMoisture, vegetation };
  const keys: IndicatorKey[] = ['rainfall', 'soilMoisture', 'vegetation'];
  const indicators = Object.fromEntries(keys.map((key) => [key, {
    value: items[key].latest.value,
    baseline: items[key].baseline.mean,
    anomaly: items[key].anomaly.standardized,
    unit: items[key].latest.unit,
    observationPeriod: items[key].latest.date,
    sourceDataset: items[key].sourceDataset,
    quality: items[key].dataQuality.status,
  }])) as Parameters<typeof detectFingerprintPatterns>[0];
  const previous = {} as { rainfall: number | null; soilMoisture: number | null; vegetation: number | null };
  keys.forEach((key) => {
    const observations = items[key].observations;
    previous[key] = observations.length > 1 ? observations[observations.length - 2].standardizedAnomaly : null;
  });
  const patterns = detectFingerprintPatterns(indicators, previous);
  return {
    regionId,
    indicators,
    patterns: patterns.map((type) => ({
      type,
      indicatorsInvolved: type === 'insufficient_data' ? [] : keys,
      supportingObservations: [],
      observationPeriod: 'Synthetic demonstration series; not an observed environmental period.',
      interpretation: 'No environmental interpretation is available because this series is synthetic.',
      dataQuality: 'insufficient',
      limitations: DEMONSTRATION_PROVENANCE.limitations,
    })),
    composite: { value: null, status: 'not_calculated_insufficient_source_data', experimental: true },
    dataQuality: qualityForDemonstration(),
    provenance: DEMONSTRATION_PROVENANCE,
  };
}

function trendPayload(regionId: string) {
  const data = makeSeries(regionId);
  if (!data) return null;
  const values = data.records.map((record) => record.ndvi);
  const times = data.records.map((record) => record.year * 12 + record.month);
  return {
    regionId,
    indicator: 'vegetation',
    units: 'NDVI/month',
    method: 'Mann-Kendall with exact permutation p-value for n <= 9; tie-corrected normal approximation otherwise; Sen pairwise median slope.',
    result: calculateMannKendall(values, 0.05, times),
    dataQuality: qualityForDemonstration(),
    provenance: DEMONSTRATION_PROVENANCE,
  };
}

function listRegions() {
  return Object.entries(REGION_NAMES).map(([id, meta]) => ({
    id,
    name: meta.name,
    administrativeLevel: meta.level,
    parentId: meta.parentId,
    geometry: id === 'borena' ? borenaBoundary.geometry : null,
    geometryStatus: id === 'borena' ? 'verified_public_boundary' : 'not_available_verified',
    geometrySource: id === 'borena'
      ? 'geoBoundaries Ethiopia ADM2 humanitarian boundary, 2020; source: CSA and BoFED via HDX; CC BY 3.0 IGO'
      : null,
    datasetCoverage: DATASETS.filter((dataset) => ['gpm-imerg', 'fldas', 'modis-mod13a2'].includes(dataset.id))
      .map((dataset) => ({ datasetId: dataset.id, status: 'planned' })),
  }));
}

function authorize(request: Request): { authorized: boolean; reviewer: string | null } {
  const expected = process.env.ADMIN_API_TOKEN;
  const reviewer = process.env.ADMIN_REVIEWER_ID;
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!expected || !reviewer || !supplied) return { authorized: false, reviewer: null };
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  const authorized = expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
  return { authorized, reviewer: authorized ? reviewer : null };
}

async function bodyJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const value: unknown = await request.json();
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

function adminRequired(request: Request): { authorized: true; reviewer: string } | null {
  const identity = authorize(request);
  return identity.authorized && identity.reviewer
    ? { authorized: true, reviewer: identity.reviewer }
    : null;
}

function makeReport(regionId: string) {
  const fingerprint = fingerprintPayload(regionId);
  const indicators = indicatorPayload(regionId);
  const trends = trendPayload(regionId);
  if (!fingerprint || !indicators || !trends) return null;
  return {
    reportReference: `DEMO-${regionId.toUpperCase()}-${new Date().toISOString().slice(0, 10)}`,
    region: listRegions().find((item) => item.id === regionId),
    analysisPeriod: { start: '2000-01', end: REGIONS_DATA[regionId].records.at(-1)?.date ?? null },
    generatedAt: new Date().toISOString(),
    datasets: DATASETS.filter((dataset) => ['gpm-imerg', 'fldas', 'modis-mod13a2'].includes(dataset.id)),
    measuredObservations: 'None. Values included below are generated synthetic demonstrations.',
    calculatedIndicators: indicators,
    statisticalResults: trends,
    interpretations: fingerprint.patterns,
    limitations: DEMONSTRATION_PROVENANCE.limitations,
    dataQuality: qualityForDemonstration(),
    alertInformation: { status: 'insufficient_data', alerts: [] },
    recovery: recoveryPayload(regionId),
    summary: 'This report is a demonstration of the API contract only; it contains no verified environmental observations.',
  };
}

function recoveryPayload(regionId: string) {
  const data = makeSeries(regionId);
  if (!data) return null;
  return {
    regionId,
    ...classifyRecovery(data.records.map((record) => ({
      date: record.date,
      rainfall: record.rainfallZ ?? null,
      soilMoisture: record.soilMoistureZ ?? null,
      vegetation: record.ndviZ ?? null,
    }))),
    definition: 'Recovery requires all three standardized anomalies to exceed -1 for each consecutive period.',
    recoveryIsEnvironmentalOnly: true,
    dataQuality: qualityForDemonstration(),
    provenance: DEMONSTRATION_PROVENANCE,
  };
}

async function getHandler(request: NextRequest, path: string[]) {
  if (path.length === 1 && path[0] === 'health') {
    return json({
      status: 'ok',
      service: 'aether-api',
      version: 'v1',
      smsMode: SMS_MODE,
      emailMode: process.env.EMAIL_MODE === 'smtp' ? 'smtp_enabled' : 'disabled',
      observationStatus: 'nasa_power_point_source_available_primary_drought_products_not_integrated',
    }, 200, request);
  }
  if (path.length === 2 && path[0] === 'observations' && path[1] === 'borena') {
    try {
      return json(await fetchBorenaNasaPowerObservations(), 200, request);
    } catch (error) {
      console.error('Aether NASA POWER retrieval failed:', error);
      return json({ error: 'nasa_power_retrieval_failed' }, 502, request);
    }
  }
  if (path.length === 1 && path[0] === 'metadata') {
    return json({
      apiVersion: 'v1',
      service: 'Aether backend',
      smsMode: SMS_MODE,
      emailMode: process.env.EMAIL_MODE === 'smtp' ? 'smtp_enabled' : 'disabled',
      baselinePeriod: { startYear: BASELINE_START_YEAR, endYear: BASELINE_END_YEAR, minimumObservations: MIN_BASELINE_OBSERVATIONS },
      datasetStatuses: {
        integrated: DATASETS.filter((dataset) => dataset.integrationStatus === 'integrated').length,
        planned: DATASETS.filter((dataset) => dataset.integrationStatus === 'planned').length,
      },
      observationStatus: 'NASA POWER MERRA-2 point retrieval is available; GPM, FLDAS, MODIS NDVI, and verified zonal observations are not integrated.',
      limitations: DEMONSTRATION_PROVENANCE.limitations,
    }, 200, request);
  }
  if (path[0] === 'regions' && path.length === 1) return json({ regions: listRegions() }, 200, request);
  if (path[0] === 'regions' && path.length >= 2) {
    const regionId = path[1];
    if (!validRegion(regionId)) return json({ error: 'region_not_found' }, 404, request);
    if (path.length === 2) return json(listRegions().find((region) => region.id === regionId), 200, request);
    if (path[2] === 'children') return json({
      regionId,
      children: [],
      available: false,
      reason: regionId === 'borena'
        ? 'Borena is a zone; verified woreda boundaries are not loaded.'
        : 'Verified boundary geometry is not loaded for this region.',
    }, 200, request);
    if (path[2] === 'indicators') {
      const keyMap: Record<string, IndicatorKey> = {
        rainfall: 'rainfall',
        'soil-moisture': 'soilMoisture',
        vegetation: 'vegetation',
      };
      if (path.length === 3) return json(indicatorPayload(regionId), 200, request);
      if (path.length === 4 && keyMap[path[3]]) return json(indicatorPayload(regionId, keyMap[path[3]]), 200, request);
    }
    if (path[2] === 'fingerprint' && path.length === 3) return json(fingerprintPayload(regionId), 200, request);
    if (path[2] === 'fingerprint' && path[3] === 'timeline') {
      const data = makeSeries(regionId)!;
      return json({ regionId, points: data.records.map((record) => ({
        date: record.date, rainfallZ: record.rainfallZ ?? null, soilMoistureZ: record.soilMoistureZ ?? null,
        vegetationZ: record.ndviZ ?? null, dataQuality: 'insufficient', sampleOnly: true,
      })), provenance: DEMONSTRATION_PROVENANCE }, 200, request);
    }
    if (path[2] === 'recovery') return json(recoveryPayload(regionId), 200, request);
    if (path[2] === 'trends') return json(trendPayload(regionId), 200, request);
    if (path[2] === 'data-quality') return json({
      regionId,
      quality: 'insufficient',
      datasets: DATASETS.filter((dataset) => ['gpm-imerg', 'fldas', 'modis-mod13a2'].includes(dataset.id))
        .map((dataset) => ({ datasetId: dataset.id, validObservationCount: 0, missingObservationCount: null, quality: 'insufficient' })),
      provenance: DEMONSTRATION_PROVENANCE,
    }, 200, request);
    if (path[2] === 'report') {
      if (request.nextUrl.searchParams.get('format') === 'pdf') {
        return json({ error: 'pdf_not_implemented', message: 'Only JSON reports are implemented.' }, 501, request);
      }
      return json(makeReport(regionId), 200, request);
    }
  }
  if (path[0] === 'datasets' && path.length === 1) return json({ datasets: DATASETS }, 200, request);
  if (path.length === 1 && path[0] === 'references') {
    return json({
      references: DATA_SOURCE_REFERENCES,
      note: 'References are classified by role. Listing a source does not mean data were ingested or validated.',
    }, 200, request);
  }
  if (path[0] === 'datasets' && path.length === 2) {
    const dataset = DATASETS.find((item) => item.id === path[1]);
    return dataset ? json(dataset, 200, request) : json({ error: 'dataset_not_found' }, 404, request);
  }
  if (path.length === 2 && path[0] === 'rankings' && path[1] === 'environmental-priority') {
    return json({
      methodology: 'Transparent prototype score: stress count, capped anomaly magnitude, persistence, trend direction; unavailable when source quality is insufficient.',
      label: 'Environmental Investigation Priority',
      rankings: Object.keys(REGIONS_DATA).map((regionId) => ({
        regionId,
        regionName: REGION_NAMES[regionId]?.name,
        ...calculateEnvironmentalPriority({ anomalies: [null, null, null], persistencePeriods: 0, trend: 'no_trend', quality: 'insufficient' }),
        dataQuality: 'insufficient',
      })),
      limitations: DEMONSTRATION_PROVENANCE.limitations,
    }, 200, request);
  }
  if (path.length === 1 && path[0] === 'compare') {
    const regionIds = Array.from(new Set((request.nextUrl.searchParams.get('regions') || 'borena,somali')
      .split(',').map((item) => item.trim())));
    if (regionIds.some((regionId) => !validRegion(regionId))) {
      return json({ error: 'invalid_region_id' }, 400, request);
    }
    const regions = regionIds.map((regionId) => ({
      regionId,
      indicators: indicatorPayload(regionId),
      trends: trendPayload(regionId),
      fingerprint: fingerprintPayload(regionId),
    }));
    return json({
      regions,
      compatiblePeriod: {
        start: '2000-01',
        end: '2024-12',
        alignment: 'monthly calendar periods',
      },
      comparisonStatus: 'demonstration_only',
      dataQuality: 'insufficient',
      limitations: ['Comparisons use synthetic series; no regional environmental comparison is scientifically available.'],
    }, 200, request);
  }
  if (path.length === 1 && path[0] === 'ingestions') {
    if (!adminRequired(request)) return json({ error: 'unauthorized' }, 401, request);
    const state = await readBackendState();
    return json({
      ingestions: state.ingestions,
      note: 'Uploaded observations are unverified and quarantined from environmental analysis.',
    }, 200, request);
  }
  if (path.length === 1 && path[0] === 'email-alerts') {
    if (!adminRequired(request)) return json({ error: 'unauthorized' }, 401, request);
    const state = await readBackendState();
    return json({ emailAlerts: state.emailAlerts }, 200, request);
  }
  if (path.length === 2 && path[0] === 'email-alerts') {
    if (!adminRequired(request)) return json({ error: 'unauthorized' }, 401, request);
    const state = await readBackendState();
    const emailAlert = state.emailAlerts.find((item) => item.id === path[1]);
    return emailAlert ? json(emailAlert, 200, request) : json({ error: 'email_alert_not_found' }, 404, request);
  }
  if (path.length === 2 && path[0] === 'ingestions') {
    if (!adminRequired(request)) return json({ error: 'unauthorized' }, 401, request);
    const state = await readBackendState();
    const ingestion = state.ingestions.find((item) => item.id === path[1]);
    if (!ingestion) return json({ error: 'ingestion_not_found' }, 404, request);
    const offsetValue = Number(request.nextUrl.searchParams.get('offset') || 0);
    const limitValue = Number(request.nextUrl.searchParams.get('limit') || 100);
    const offset = Number.isInteger(offsetValue) ? Math.max(0, offsetValue) : 0;
    const limit = Number.isInteger(limitValue) ? Math.min(500, Math.max(1, limitValue)) : 100;
    const observations = state.observations.filter((item) => item.ingestionId === ingestion.id);
    const page = observations.slice(offset, offset + limit);
    return json({
      ingestion,
      observations: page,
      pagination: { offset, limit, total: observations.length, nextOffset: offset + page.length < observations.length ? offset + page.length : null },
      analysisStatus: 'quarantined_pending_source_review',
    }, 200, request);
  }
  if (path.length === 1 && path[0] === 'alerts') {
    const state = await readBackendState();
    return json({ alerts: state.alerts, smsMode: 'sample' }, 200, request);
  }
  if (path.length === 2 && path[0] === 'alerts') {
    const state = await readBackendState();
    const alert = state.alerts.find((item) => item.id === path[1]);
    return alert ? json(alert, 200, request) : json({ error: 'alert_not_found' }, 404, request);
  }
  if (path[0] === 'authority-contacts' && path.length === 1) {
    const state = await readBackendState();
    return json({ contacts: state.contacts.map((contact) => ({ ...contact, phone: null })) }, 200, request);
  }
  if (path[0] === 'authority-contacts' && path.length === 2) {
    const state = await readBackendState();
    const contact = state.contacts.find((item) => item.id === path[1]);
    return contact ? json({ ...contact, phone: null }, 200, request) : json({ error: 'contact_not_found' }, 404, request);
  }
  if (path.length === 2 && path[0] === 'notifications' && path[1] === 'history') {
    if (!adminRequired(request)) return json({ error: 'unauthorized' }, 401, request);
    const state = await readBackendState();
    return json({ history: state.audit, messages: state.messages.map((item) => ({ ...item, content: '[protected message content]' })) }, 200, request);
  }
  if (path.length === 3 && path[0] === 'notifications' && path[2] === 'status') {
    if (!adminRequired(request)) return json({ error: 'unauthorized' }, 401, request);
    const state = await readBackendState();
    const message = state.messages.find((item) => item.id === path[1]);
    return message ? json({ id: message.id, status: message.status, simulation: message.simulation }, 200, request) : json({ error: 'message_not_found' }, 404, request);
  }
  return json({ error: 'not_found' }, 404, request);
}

async function postHandler(request: NextRequest, path: string[]) {
  if (rateLimited(request)) return json({ error: 'rate_limit_exceeded' }, 429, request);
  if (path.length === 2 && path[0] === 'ingestions' && path[1] === 'csv') {
    const identity = adminRequired(request);
    if (!identity) return json({ error: 'unauthorized' }, 401, request);
    const contentLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_CSV_UPLOAD_BYTES + 16_384) {
      return json({ error: 'upload_too_large', maximumBytes: MAX_CSV_UPLOAD_BYTES }, 413, request);
    }
    const body = await bodyJson(request);
    if (!body || typeof body.csv !== 'string' || Buffer.byteLength(body.csv, 'utf8') > MAX_CSV_UPLOAD_BYTES) {
      return json({ error: 'invalid_or_oversized_csv', maximumBytes: MAX_CSV_UPLOAD_BYTES }, 400, request);
    }
    const { regionId, datasetId, provider, productId, datasetVersion } = body;
    if (typeof regionId !== 'string' || typeof datasetId !== 'string' ||
        typeof provider !== 'string' || typeof productId !== 'string' || typeof datasetVersion !== 'string') {
      return json({ error: 'missing_upload_metadata' }, 400, request);
    }
    if (!validRegion(regionId)) return json({ error: 'invalid_region_id' }, 400, request);

    let validation: CsvIngestionValidation;
    try {
      validation = validateCsvUpload({
        csv: body.csv,
        regionId,
        datasetId,
        provider,
        productId,
        datasetVersion,
      });
    } catch (error) {
      if (error instanceof TypeError || error instanceof RangeError || error instanceof SyntaxError) {
        return json({ error: 'csv_validation_failed', message: error.message }, 400, request);
      }
      throw error;
    }

    const createdAt = new Date().toISOString();
    const id = randomUUID();
    const checksumSha256 = createHash('sha256').update(body.csv, 'utf8').digest('hex');
    const result = await updateBackendState((state) => {
      const observationKey = (item: Pick<StoredObservation, 'regionId' | 'date' | 'indicator' | 'datasetId' | 'productIdDeclaredByUploader' | 'datasetVersionDeclaredByUploader'>) =>
        [item.regionId, item.date, item.indicator, item.datasetId, item.productIdDeclaredByUploader, item.datasetVersionDeclaredByUploader].join('|');
      const seen = new Set(state.observations.map(observationKey));
      const newObservations: StoredObservation[] = [];
      let duplicateCount = 0;
      for (const record of validation.records) {
        const key = [regionId, record.date, record.indicator, datasetId, productId.trim(), datasetVersion.trim()].join('|');
        if (seen.has(key)) {
          duplicateCount++;
          continue;
        }
        seen.add(key);
        newObservations.push({
          id: randomUUID(),
          ingestionId: id,
          regionId,
          date: record.date,
          indicator: record.indicator,
          value: record.value,
          units: record.units,
          datasetId,
          providerDeclaredByUploader: provider.trim(),
          productIdDeclaredByUploader: productId.trim(),
          datasetVersionDeclaredByUploader: datasetVersion.trim(),
          qualityFlagAsSupplied: record.qualityFlag,
          ingestedAt: createdAt,
          quality: 'insufficient',
          analysisStatus: 'quarantined_pending_source_review',
        });
      }
      const rejectedCount = validation.rowsReceived - validation.records.length;
      const ingestion: StoredIngestion = {
        id,
        regionId,
        datasetId,
        providerDeclaredByUploader: provider.trim(),
        productIdDeclaredByUploader: productId.trim(),
        datasetVersionDeclaredByUploader: datasetVersion.trim(),
        checksumSha256,
        createdAt,
        status: newObservations.length === 0 && validation.records.length === 0
          ? 'failed' : rejectedCount > 0 ? 'partial' : 'completed',
        rowsReceived: validation.rowsReceived,
        acceptedCount: newObservations.length,
        rejectedCount,
        duplicateCount,
        rejectedRows: validation.rejectedRows,
        submittedBy: identity.reviewer,
        provenanceStatus: 'user_upload_unverified',
      };
      state.ingestions.push(ingestion);
      state.observations.push(...newObservations);
      state.audit.push({ action: 'csv_ingestion_recorded', ingestionId: id, submittedBy: identity.reviewer, timestamp: createdAt, provenanceStatus: 'user_upload_unverified' });
      return { ingestion, storedObservationCount: newObservations.length };
    });
    return json({
      ...result,
      analysisStatus: 'quarantined_pending_source_review',
      message: 'Uploader-provided source metadata is unverified. These records are stored for review and are not used in environmental analysis.',
      rowLimit: MAX_CSV_UPLOAD_ROWS,
    }, 201, request);
  }
  if (path.length === 2 && path[0] === 'alerts' && path[1] === 'evaluate') {
    const body = await bodyJson(request);
    const regionId = typeof body?.regionId === 'string' ? body.regionId : '';
    if (!validRegion(regionId)) return json({ error: 'invalid_region_id' }, 400, request);
    const simulationRequested = body?.sampleMode === true;
    if (!simulationRequested) {
      const emptyDetection = detectEnvironmentalAlert({
        anomalies: [null, null, null], persistencePeriods: 0, worseningTrend: false, quality: 'insufficient',
      });
      return json({ regionId, ...emptyDetection, alert: null, dataQuality: 'insufficient' }, 200, request);
    }
    const now = new Date().toISOString();
    const id = randomUUID();
    const alert: StoredAlert = {
      id,
      reference: `SAMPLE-${id.slice(0, 8).toUpperCase()}`,
      regionId,
      observationPeriod: 'not assessed',
      classification: 'sample_workflow_only',
      indicatorsInvolved: [],
      supportingMeasurements: [],
      dataQuality: 'insufficient',
      sampleOnly: true,
      status: 'sample_workflow_only',
      createdAt: now,
      reportReference: `SAMPLE-REPORT-${id.slice(0, 8).toUpperCase()}`,
    };
    const saved = await updateBackendState((state) => {
      const cooldownCutoff = Date.now() - 24 * 60 * 60 * 1000;
      const existing = state.alerts.find((item) =>
        item.regionId === regionId && item.sampleOnly &&
        new Date(item.createdAt).getTime() >= cooldownCutoff);
      if (existing) return { alert: existing, created: false };
      state.alerts.push(alert);
      state.audit.push({ action: 'sample_alert_workflow_created', alertId: id, timestamp: now, sampleMode: true });
      return { alert, created: true };
    });
    return json({
      ...saved.alert,
      interpretation: 'Workflow demonstration only; no observations were analyzed and no environmental alert was detected.',
      smsMode: 'sample',
    }, saved.created ? 201 : 200, request);
  }
  if (path.length === 3 && path[0] === 'alerts' && path[2] === 'generate-email') {
    const identity = adminRequired(request);
    if (!identity) return json({ error: 'unauthorized' }, 401, request);
    const state = await readBackendState();
    const alert = state.alerts.find((item) => item.id === path[1]);
    if (!alert) return json({ error: 'alert_not_found' }, 404, request);
    if (!alert.sampleOnly) return json({ error: 'sample_alert_required' }, 409, request);
    let generated: ReturnType<typeof createSampleEmailAlert>;
    try {
      generated = createSampleEmailAlert(alert);
    } catch (error) {
      console.error('Aether email configuration invalid:', error);
      return json({ error: 'email_configuration_invalid' }, 503, request);
    }
    const emailAlert: StoredEmailAlert = {
      id: randomUUID(),
      alertId: alert.id,
      ...generated,
      createdAt: new Date().toISOString(),
      status: 'draft',
      reviewer: null,
      reviewComment: null,
      reviewedAt: null,
      sentAt: null,
      providerMessageId: null,
    };
    const saved = await updateBackendState((current) => {
      const existing = current.emailAlerts.find((item) => item.alertId === alert.id);
      if (existing) return { emailAlert: existing, created: false };
      current.emailAlerts.push(emailAlert);
      current.audit.push({
        action: 'sample_email_alert_created',
        alertId: alert.id,
        emailAlertId: emailAlert.id,
        submittedBy: identity.reviewer,
        timestamp: emailAlert.createdAt,
        sampleMode: true,
      });
      return { emailAlert, created: true };
    });
    return json({
      ...saved.emailAlert,
      sampleOnly: true,
      externalDispatch: false,
    }, saved.created ? 201 : 200, request);
  }
  if (path.length === 3 && path[0] === 'alerts' && path[2] === 'generate-message') {
    if (!isSampleSmsMode()) return json({ error: 'sample_mode_required' }, 503, request);
    const state = await readBackendState();
    const alert = state.alerts.find((item) => item.id === path[1]);
    if (!alert) return json({ error: 'alert_not_found' }, 404, request);
    const id = randomUUID();
    const message: StoredMessage = {
      id,
      alertId: alert.id,
      content: generateSampleMessage(alert),
      templateVersion: 'sample-en-v1',
      createdAt: new Date().toISOString(),
      status: 'draft',
      reviewer: null,
      reviewComment: null,
      reviewedAt: null,
      simulation: null,
    };
    assertSampleMessage(message.content);
    const saved = await updateBackendState((current) => {
      const existing = current.messages.find((item) =>
        item.alertId === alert.id && item.templateVersion === message.templateVersion && item.status === 'draft');
      if (existing) return { message: existing, created: false };
      current.messages.push(message);
      current.audit.push({ action: 'sample_message_created', alertId: alert.id, messageId: id, timestamp: message.createdAt, sampleMode: true });
      return { message, created: true };
    });
    return json({ ...saved.message, sampleMode: true, externalDispatch: false }, saved.created ? 201 : 200, request);
  }
  const emailReview = path.length === 3 && path[0] === 'email-alerts' && ['approve', 'reject'].includes(path[2]);
  const emailSend = path.length === 3 && path[0] === 'email-alerts' && path[2] === 'send';
  if (emailReview || emailSend) {
    const identity = adminRequired(request);
    if (!identity) return json({ error: 'unauthorized', message: 'Configure ADMIN_API_TOKEN and ADMIN_REVIEWER_ID.' }, 401, request);
    const body = await bodyJson(request);
    if (!body) return json({ error: 'invalid_json_body' }, 400, request);

    if (emailReview) {
      const now = new Date().toISOString();
      const result = await updateBackendState((state) => {
        const emailAlert = state.emailAlerts.find((item) => item.id === path[1]);
        if (!emailAlert) return { error: 'email_alert_not_found' as const };
        if (emailAlert.status !== 'draft') return { error: 'email_alert_not_reviewable' as const };
        emailAlert.status = path[2] === 'approve' ? 'approved' : 'rejected';
        emailAlert.reviewer = identity.reviewer;
        emailAlert.reviewComment = typeof body.comment === 'string' ? body.comment.slice(0, 1000) : null;
        emailAlert.reviewedAt = now;
        state.audit.push({
          action: path[2] === 'approve' ? 'sample_email_alert_approved' : 'sample_email_alert_rejected',
          emailAlertId: emailAlert.id,
          reviewer: identity.reviewer,
          comment: emailAlert.reviewComment,
          timestamp: now,
          sampleMode: true,
        });
        return { emailAlert: { ...emailAlert } };
      });
      if ('error' in result) {
        return json({ error: result.error }, result.error === 'email_alert_not_found' ? 404 : 409, request);
      }
      return json(result.emailAlert, 200, request);
    }

    if (process.env.EMAIL_MODE !== 'smtp') return json({ error: 'email_delivery_disabled' }, 503, request);
    let transportConfig;
    try {
      transportConfig = getEmailTransportConfig();
    } catch (error) {
      console.error('Aether email configuration invalid:', error);
      return json({ error: 'email_configuration_invalid' }, 503, request);
    }
    const claimed = await updateBackendState((state) => {
      const emailAlert = state.emailAlerts.find((item) => item.id === path[1]);
      if (!emailAlert) return { error: 'email_alert_not_found' as const };
      if (emailAlert.status !== 'approved') return { error: 'email_alert_requires_approval' as const };
      emailAlert.status = 'sending';
      return { emailAlert: { ...emailAlert } };
    });
    if ('error' in claimed) {
      return json({ error: claimed.error }, claimed.error === 'email_alert_not_found' ? 404 : 409, request);
    }

    let dispatch: { messageId: string };
    try {
      dispatch = await sendEmailAlert(claimed.emailAlert, transportConfig);
    } catch (error) {
      console.error('Aether email delivery failed:', error);
      await updateBackendState((state) => {
        const emailAlert = state.emailAlerts.find((item) => item.id === path[1]);
        if (emailAlert?.status === 'sending') {
          emailAlert.status = 'failed';
          state.audit.push({
            action: 'sample_email_alert_delivery_failed',
            emailAlertId: emailAlert.id,
            reviewer: identity.reviewer,
            timestamp: new Date().toISOString(),
            failure: 'delivery_failed',
            sampleMode: true,
          });
        }
      });
      return json({ error: 'email_delivery_failed', status: 'failed' }, 502, request);
    }

    const sentAt = new Date().toISOString();
    const sentEmail = await updateBackendState((state) => {
      const emailAlert = state.emailAlerts.find((item) => item.id === path[1]);
      if (!emailAlert || emailAlert.status !== 'sending') return null;
      emailAlert.status = 'sent';
      emailAlert.sentAt = sentAt;
      emailAlert.providerMessageId = dispatch.messageId;
      state.audit.push({
        action: 'sample_email_alert_sent',
        emailAlertId: emailAlert.id,
        reviewer: identity.reviewer,
        providerMessageId: dispatch.messageId,
        timestamp: sentAt,
        sampleMode: true,
      });
      return { ...emailAlert };
    });
    if (!sentEmail) return json({ error: 'email_delivery_state_conflict' }, 409, request);
    return json({ ...sentEmail, externalDispatch: true }, 200, request);
  }
  const review = path.length === 3 && path[0] === 'notifications' && ['approve', 'reject'].includes(path[2]);
  const simulation = path.length === 3 && path[0] === 'notifications' && path[2] === 'simulate';
  const contactCreate = path.length === 1 && path[0] === 'authority-contacts';
  if (review || simulation || contactCreate) {
    const identity = adminRequired(request);
    if (!identity) return json({ error: 'unauthorized', message: 'Configure ADMIN_API_TOKEN and ADMIN_REVIEWER_ID.' }, 401, request);
    const body = contactCreate ? await bodyJson(request) : await bodyJson(request);
    if (!body) return json({ error: 'invalid_json_body' }, 400, request);
    if (contactCreate) {
      if (body.phone !== undefined || body.telephone !== undefined || body.phoneNumber !== undefined) {
        return json({ error: 'telephone_numbers_not_accepted', message: 'No contact telephone numbers may be registered in sample mode.' }, 400, request);
      }
      if (typeof body.organizationName !== 'string' || typeof body.officialRole !== 'string' ||
          typeof body.administrativeRegion !== 'string' || typeof body.contactSource !== 'string') {
        return json({ error: 'invalid_contact_fields' }, 400, request);
      }
      const contact: StoredContact = {
        id: randomUUID(),
        organizationName: body.organizationName,
        officialRole: body.officialRole,
        administrativeRegion: body.administrativeRegion,
        contactSource: body.contactSource,
        verificationDate: null,
        verificationStatus: 'placeholder',
        preferredLanguage: ['English', 'Amharic', 'Afaan Oromo'].includes(String(body.preferredLanguage))
          ? body.preferredLanguage as StoredContact['preferredLanguage'] : 'English',
        authorizedCategories: Array.isArray(body.authorizedCategories)
          ? body.authorizedCategories.filter((item): item is string => typeof item === 'string')
          : [],
        active: false,
        phone: null,
      };
      const now = new Date().toISOString();
      await updateBackendState((state) => {
        state.contacts.push(contact);
        state.audit.push({ action: 'placeholder_contact_created', contactId: contact.id, reviewer: identity.reviewer, timestamp: now, sampleMode: true });
      });
      return json(contact, 201, request);
    }
    if (simulation && !isSampleSmsMode()) return json({ error: 'sample_mode_required' }, 503, request);
    if (review && body.decision !== (path[2] === 'approve' ? 'approve' : 'reject')) {
      return json({ error: 'review_decision_mismatch' }, 400, request);
    }
    const now = new Date().toISOString();
    const result = await updateBackendState(async (state) => {
      const message = state.messages.find((item) => item.id === path[1]);
      if (!message) return { error: 'message_not_found' as const };
      if (review) {
        if (message.status !== 'draft') return { error: 'message_not_reviewable' as const };
        message.status = path[2] === 'approve' ? 'approved' : 'rejected';
        message.reviewer = identity.reviewer;
        message.reviewComment = typeof body.comment === 'string' ? body.comment.slice(0, 1000) : null;
        message.reviewedAt = now;
        state.audit.push({ action: path[2] === 'approve' ? 'message_approved' : 'message_rejected', messageId: message.id, reviewer: identity.reviewer, comment: message.reviewComment, timestamp: now, sampleMode: true });
        return { message: { ...message } };
      }
      if (message.status !== 'approved') return { error: 'message_requires_approval' as const };
      const provider = createMockSmsProvider();
      const dispatch = await provider.dispatch(message);
      message.status = 'simulated';
      message.simulation = { reference: dispatch.reference, status: dispatch.status, timestamp: dispatch.timestamp };
      state.audit.push({ action: 'mock_sms_simulated', alertId: message.alertId, messageId: message.id, reviewer: identity.reviewer, providerReference: dispatch.reference, deliveryStatus: 'simulated', timestamp: dispatch.timestamp, sampleMode: true });
      return { message: { ...message } };
    });
    if ('error' in result) return json({ error: result.error }, result.error === 'message_not_found' ? 404 : 409, request);
    return json({ ...result.message, externalDispatch: false, deliveryStatus: result.message.simulation?.status || result.message.status }, 200, request);
  }
  return json({ error: 'not_found' }, 404, request);
}

async function patchHandler(request: NextRequest, path: string[]) {
  if (path.length !== 2 || path[0] !== 'authority-contacts') return json({ error: 'not_found' }, 404, request);
  if (rateLimited(request)) return json({ error: 'rate_limit_exceeded' }, 429, request);
  const identity = adminRequired(request);
  if (!identity) return json({ error: 'unauthorized' }, 401, request);
  const body = await bodyJson(request);
  if (!body) return json({ error: 'invalid_json_body' }, 400, request);
  if (body.phone !== undefined || body.telephone !== undefined || body.phoneNumber !== undefined ||
      body.verificationStatus === 'verified_official_contact') {
    return json({ error: 'contact_verification_not_available', message: 'Sample mode cannot register telephone numbers or verify contacts.' }, 400, request);
  }
  const now = new Date().toISOString();
  const contact = await updateBackendState((state) => {
    const stored = state.contacts.find((item) => item.id === path[1]);
    if (!stored) return null;
    if (typeof body.organizationName === 'string') stored.organizationName = body.organizationName;
    if (typeof body.officialRole === 'string') stored.officialRole = body.officialRole;
    if (typeof body.administrativeRegion === 'string') stored.administrativeRegion = body.administrativeRegion;
    if (typeof body.contactSource === 'string') stored.contactSource = body.contactSource;
    if (typeof body.active === 'boolean') stored.active = body.active;
    stored.verificationStatus = 'placeholder';
    state.audit.push({ action: 'placeholder_contact_updated', contactId: stored.id, reviewer: identity.reviewer, timestamp: now, sampleMode: true });
    return { ...stored };
  });
  return contact ? json(contact, 200, request) : json({ error: 'contact_not_found' }, 404, request);
}

type ApiRouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: ApiRouteContext) {
  try {
    const { path } = await context.params;
    return await getHandler(request, path);
  } catch (error) {
    console.error('Aether API GET failed:', error);
    return json({ error: 'internal_server_error' }, 500, request);
  }
}

export async function POST(request: NextRequest, context: ApiRouteContext) {
  try {
    const { path } = await context.params;
    return await postHandler(request, path);
  } catch (error) {
    console.error('Aether API POST failed:', error);
    return json({ error: 'internal_server_error' }, 500, request);
  }
}

export async function PATCH(request: NextRequest, context: ApiRouteContext) {
  try {
    const { path } = await context.params;
    return await patchHandler(request, path);
  } catch (error) {
    console.error('Aether API PATCH failed:', error);
    return json({ error: 'internal_server_error' }, 500, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  const origin = request.headers.get('origin');
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',').map((item) => item.trim()).filter(Boolean);
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}
