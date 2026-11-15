const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');
const zoneOverlayTools = require('./build_zone_overlay.js');
const rainfallGpr = require('./train_rainfall_gpr.js');

function loadTypeScript(relativePath) {
  const filename = path.resolve(__dirname, '..', relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded._compile(compiled, filename);
  return loaded.exports;
}

const science = loadTypeScript('src/lib/backend/science.ts');
const ingestion = loadTypeScript('src/lib/backend/ingestion.ts');
const catalog = loadTypeScript('src/lib/backend/catalog.ts');
const nasaPower = loadTypeScript('src/lib/backend/nasa-power.ts');
const zoneBoundaries = loadTypeScript('src/lib/zone-boundaries.ts');
const aiExplainer = loadTypeScript('src/lib/aiExplainer.ts');

test('dataset and source registries distinguish candidates, tools, and references from integrations', () => {
  const expectedReferences = [
    'nasa-power',
    'chirps-v3',
    'nasa-giovanni',
    'ges-disc-hydrology-timeseries',
    'appeears',
    'noaa-cdo',
    'nasa-ntrs-20090042747',
    'knmi-climate-explorer',
    'medium-trend-methods',
    'statsig-significance-guide',
    'radarsat-constellation-data',
    'geo-ca',
    'swot',
    'csa-ecosystem-monitoring',
    'csa-sar-tutorial',
    'ethiopia-admin-boundaries',
  ];
  assert.deepEqual(
    catalog.DATA_SOURCE_REFERENCES.map((reference) => reference.id).sort(),
    expectedReferences.sort(),
  );
  assert.ok(catalog.DATASETS.some((dataset) => dataset.id === 'chirps-v3' && dataset.integrationStatus === 'planned'));
  assert.ok(catalog.DATASETS.some((dataset) =>
    dataset.id === 'nasa-power-merra2' && dataset.integrationStatus === 'integrated',
  ));
  assert.ok(catalog.DATASETS.some((dataset) =>
    dataset.id === 'merra2-gwettop-spatial-average' && dataset.integrationStatus === 'research_reference',
  ));
  assert.ok(catalog.DATASETS.some((dataset) =>
    dataset.id === 'airs-surface-temperature-average' && dataset.integrationStatus === 'research_reference',
  ));
  assert.ok(catalog.DATASETS.some((dataset) =>
    dataset.id === 'giovanni-gpm-imerg-bbox' &&
    dataset.integrationStatus === 'research_reference' &&
    dataset.units === 'Not stated in supplied CSV',
  ));
  assert.ok(catalog.DATASETS.every((dataset) =>
    dataset.id === 'nasa-power-merra2' || dataset.integrationStatus !== 'integrated',
  ));
  assert.ok(catalog.DATA_SOURCE_REFERENCES.every((reference) =>
    ['integrated', 'not_integrated', 'not_applicable'].includes(reference.integrationStatus),
  ));
  assert.ok(catalog.DATA_SOURCE_REFERENCES.some((reference) =>
    reference.id === 'nasa-power' &&
    reference.role === 'candidate_dataset' &&
    reference.integrationStatus === 'integrated',
  ));
  assert.ok(catalog.DATA_SOURCE_REFERENCES.some((reference) =>
    reference.id === 'ethiopia-admin-boundaries' &&
    reference.role === 'geography' &&
    reference.integrationStatus === 'integrated',
  ));
});

test('Borena boundary is the locally stored public Ethiopia ADM2 feature', () => {
  const boundaryPath = path.resolve(__dirname, '..', 'src/data/borenaBoundary.json');
  const boundary = JSON.parse(fs.readFileSync(boundaryPath, 'utf8'));
  assert.equal(boundary.type, 'Feature');
  assert.equal(boundary.properties.shapeName, 'Borena');
  assert.equal(boundary.properties.shapeType, 'ADM2');
  assert.equal(boundary.geometry.type, 'Polygon');
  assert.ok(boundary.geometry.coordinates[0].length > 100);
});

test('72-zone GeoJSON validator accepts the supplied boundary and rejects invalid collections', () => {
  const boundaryPath = path.resolve(__dirname, '..', 'public/zone-data/ethiopia_zones.geojson');
  const boundary = JSON.parse(fs.readFileSync(boundaryPath, 'utf8'));
  assert.equal(zoneBoundaries.isEthiopiaZoneFeatureCollection(boundary), true);

  const wrongCount = { ...boundary, features: boundary.features.slice(1) };
  assert.equal(zoneBoundaries.isEthiopiaZoneFeatureCollection(wrongCount), false);

  const duplicateId = JSON.parse(JSON.stringify(boundary));
  duplicateId.features[1].properties.ID_2 = duplicateId.features[0].properties.ID_2;
  assert.equal(zoneBoundaries.isEthiopiaZoneFeatureCollection(duplicateId), false);

  const wrongCrs = { ...boundary, crs: { type: 'name', properties: { name: 'EPSG:3857' } } };
  assert.equal(zoneBoundaries.isEthiopiaZoneFeatureCollection(wrongCrs), false);
});

test('scientific explanation distinguishes nonsignificant trends and unverified inputs', () => {
  const explanation = aiExplainer.generateScientificExplanation({
    regionName: 'Borena',
    variableName: 'vegetation',
    dateStr: '2024-11',
    rainfallZ: -1.2,
    soilZ: -0.8,
    vegZ: -1.1,
    diagnosis: {
      title: 'Demonstration pattern',
      titleAmharic: 'ምሳሌ',
      phase: 'early',
      scientificExplanation: 'Example interpretation.',
      summary: 'Example summary.',
      summaryAmharic: 'ምሳሌ',
      agriculturalImplication: 'Example implication.',
    },
    trendResult: {
      trend: 'decreasing',
      significant: false,
      sensSlope: -0.01,
      S: -4,
      zScore: -0.8,
      pValue: 0.42,
    },
    periodLabel: 'synthetic demonstration series',
  });

  assert.match(explanation.english, /synthetic demonstration series/);
  assert.match(explanation.english, /Inputs have not been independently verified/);
  assert.match(explanation.english, /decreasing direction that is not statistically significant/);
  assert.doesNotMatch(explanation.english, /statistically significant declining/);
});

test('zone overlay uses point-in-polygon assignment and excludes polygon holes', () => {
  const polygon = {
    type: 'Feature',
    properties: { ID_2: 1, NAME_1: 'Test', NAME_2: 'Polygon' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]],
        [[3, 3], [7, 3], [7, 7], [3, 7], [3, 3]],
      ],
    },
  };
  assert.equal(zoneOverlayTools.pointInFeature(1, 1, polygon), true);
  assert.equal(zoneOverlayTools.pointInFeature(5, 5, polygon), false);
  assert.equal(zoneOverlayTools.pointInFeature(12, 5, polygon), false);

  const multiPolygon = {
    ...polygon,
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
        [[[5, 5], [6, 5], [6, 6], [5, 6], [5, 5]]],
      ],
    },
  };
  assert.equal(zoneOverlayTools.pointInFeature(5.5, 5.5, multiPolygon), true);
});

test('zone overlay CSV parser supports quoted delimiters and rejects malformed rows', () => {
  assert.deepEqual(zoneOverlayTools.parseCsv(
    'name,value\r\n"Zone, North","say ""hello"""\r\n',
  ), [{ name: 'Zone, North', value: 'say "hello"' }]);
  assert.throws(() => zoneOverlayTools.parseCsv('a,b\n1'), /expected 2/);
  assert.throws(() => zoneOverlayTools.parseCsv('a,b\n"unfinished'), /unclosed quoted field/);
});

test('supplied zone datasets create static spatial summaries but block forecast training', () => {
  const result = zoneOverlayTools.buildFromDirectory();
  assert.equal(result.boundary.featureCount, 72);
  assert.equal(result.boundary.crs, 'EPSG:4326');
  assert.equal(result.datasets.soilMoisture.zonesWithData, 56);
  assert.equal(result.datasets.soilMoisture.assignedGridCells, 298);
  assert.equal(result.datasets.surfaceTemperature.zonesWithData, 42);
  assert.equal(result.datasets.surfaceTemperature.assignedGridCells, 93);
  assert.equal(result.datasets.rainfall.spatiallyMappableToZones, false);
  assert.equal(result.datasets.rainfall.temporalCoverage.validDateCount, 9131);
  assert.deepEqual(result.datasets.rainfall.latestObservation, {
    date: '2025-05-31',
    value: 0.828730941,
  });
  assert.ok(result.datasets.rainfall.valueRange.minimum < result.datasets.rainfall.valueRange.maximum);
  assert.equal(result.trainingReadiness.eligibleForForecastTraining, false);
  assert.ok(result.limitations.some((limitation) => limitation.includes('not month-by-month observations')));
});

test('rainfall GPR aggregates complete months, validates chronologically, and produces a one-step interval', () => {
  const rows = ['date,precipitation_value,measurement_description,spatial_scope,units'];
  for (let monthIndex = 0; monthIndex < 72; monthIndex++) {
    const monthStart = new Date(Date.UTC(2000, 5 + monthIndex, 1));
    const year = monthStart.getUTCFullYear();
    const month = monthStart.getUTCMonth() + 1;
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const monthlyValue = 2 + Math.sin((monthIndex / 12) * 2 * Math.PI) + monthIndex / 150;
    for (let day = 1; day <= dayCount; day++) {
      const date = `${monthKey}-${String(day).padStart(2, '0')}`;
      rows.push(`${date},${monthlyValue},daily precipitation,national box,not stated`);
    }
  }
  const trained = rainfallGpr.trainRainfallGpr({
    csvText: rows.join('\n'),
    generatedAt: '2026-11-15T00:00:00.000Z',
    checksumSha256: 'test-checksum',
  });
  assert.equal(trained.trainingStatus, 'trained_experimental_national_box_rainfall_only');
  assert.equal(trained.source.monthlyObservationCount, 72);
  assert.equal(trained.model.validation.gpr.count, 12);
  assert.equal(trained.model.validation.method.includes('walk-forward'), true);
  assert.equal(trained.forecast.date, '2006-06');
  assert.equal(trained.forecast.isHistoricalForCurrentDate, true);
  assert.ok(trained.forecast.lower95 <= trained.forecast.mean);
  assert.ok(trained.forecast.mean <= trained.forecast.upper95);
  assert.equal(trained.source.units, 'not stated');
});

test('NASA POWER parsing converts precipitation units, excludes annual aggregates, and withholds baseline anomalies', () => {
  const rainfall = {};
  const soilWetness = {};
  for (let year = 2001; year <= 2020; year++) {
    rainfall[`${year}01`] = 1 + (year - 2001) * 0.1;
    soilWetness[`${year}01`] = 0.3 + (year - 2001) * 0.005;
  }
  rainfall['202101'] = 4;
  soilWetness['202101'] = 0.9;
  rainfall['202102'] = -999;
  soilWetness['202102'] = -999;
  rainfall['202113'] = 2;
  soilWetness['202113'] = 0.5;

  const result = nasaPower.parseNasaPowerResponse({
    geometry: { coordinates: [38.2678243293, 4.4630211794, 1307.74] },
    header: {
      api: { version: 'v2.10.0' },
      sources: ['MERRA2'],
      fill_value: -999,
      time_standard: 'LST',
    },
    properties: { parameter: { PRECTOTCORR: rainfall, GWETROOT: soilWetness } },
    parameters: {
      PRECTOTCORR: { longname: 'Precipitation Corrected', units: 'mm/day' },
      GWETROOT: { longname: 'Root Zone Soil Wetness', units: '1' },
    },
  }, '2026-11-14T00:00:00.000Z', 2025);

  assert.equal(result.regionId, 'borena');
  assert.equal(result.records.length, 21);
  assert.equal(result.records[0].date, '2001-01');
  assert.equal(result.records[0].rainfallZ, null);
  assert.equal(result.records.at(-1).date, '2021-01');
  assert.equal(result.records.at(-1).rainfallMm, 124);
  assert.ok(result.records.at(-1).rainfallZ > 0);
  assert.ok(result.records.at(-1).rootZoneWetnessZ > 0);
  assert.equal(result.records.some((record) => record.date.endsWith('-13')), false);
  assert.equal(result.dataQuality, 'limited');
  assert.ok(result.limitations.some((limitation) => limitation.includes('not a zonal spatial average')));
});

test('baseline requires enough valid values and reports missing records', () => {
  const result = science.summarizeBaseline([1, 2, null, 3, 4], 4);
  assert.equal(result.available, true);
  assert.equal(result.count, 4);
  assert.equal(result.missingCount, 1);
  assert.equal(result.mean, 2.5);
  assert.equal(result.median, 2.5);
  assert.equal(science.summarizeBaseline([1, 2], 3).available, false);
});

test('anomaly methods preserve units and reject invalid baselines', () => {
  assert.equal(science.rainfallAnomalyPercent(50, 100), -50);
  assert.equal(science.rainfallAnomalyPercent(50, 0), null);
  assert.deepEqual(science.soilMoistureAnomaly(0.1, 0.2, 0.05), {
    difference: -0.1, standardized: -2, percentile: null,
  });
  assert.ok(Math.abs(science.vegetationAnomaly(0.3, 0.4) + 0.1) < 1e-12);
});

test('Mann-Kendall and Sen slope cover monotonic, constant, small, missing, and irregular-time series', () => {
  const increasing = science.calculateMannKendall([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(increasing.S, 45);
  assert.equal(increasing.trend, 'increasing');
  assert.equal(increasing.pValueMethod, 'normal_approximation');
  assert.equal(increasing.significant, true);

  const decreasing = science.calculateMannKendall([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  assert.equal(decreasing.S, -45);
  assert.equal(decreasing.senSlope, -1);
  assert.equal(decreasing.trend, 'decreasing');

  const constant = science.calculateMannKendall([5, 5, 5, 5, 5]);
  assert.equal(constant.variance, 0);
  assert.equal(constant.pValue, 1);
  assert.equal(constant.trend, 'no_trend');

  const small = science.calculateMannKendall([1, 2, 3]);
  assert.equal(small.pValueMethod, 'exact_permutation');
  assert.equal(small.pValue, 1 / 3);
  assert.equal(small.significant, false);

  const tied = science.calculateMannKendall([1, 1, 2, 2]);
  assert.equal(tied.n, 4);
  assert.equal(tied.S, 4);
  assert.ok(Math.abs(tied.variance - 120 / 18) < 1e-12);

  const random = science.calculateMannKendall([6, 1, 5, 2, 8, 3, 7, 4]);
  assert.equal(random.significant, false);

  const missing = science.calculateMannKendall([1, Number.NaN, 2, 4], 0.05, [0, 1, 3, 7]);
  assert.equal(missing.n, 3);
  assert.ok(Math.abs(missing.senSlope - 3 / 7) < 1e-12);
  assert.throws(() => science.calculateMannKendall([1, 2, 3], 0.05, [2, 1, 3]), /strictly increasing/);
});

test('data quality, fingerprints, recovery, priority and alert rules fail closed on missing data', () => {
  assert.equal(science.assessDataQuality(10, 0, false), 'insufficient');
  assert.equal(science.assessDataQuality(10, -1, true), 'insufficient');
  assert.deepEqual(science.detectFingerprintPatterns({
    rainfall: { anomaly: null, quality: 'insufficient' },
    soilMoisture: { anomaly: -2, quality: 'good' },
    vegetation: { anomaly: -2, quality: 'good' },
  }), ['insufficient_data']);

  assert.equal(science.classifyRecovery([]).status, 'insufficient_data');
  assert.equal(science.classifyRecovery([
    { date: '2024-01', rainfall: -2, soilMoisture: -2, vegetation: -2 },
    { date: '2024-02', rainfall: 0, soilMoisture: -2, vegetation: -2 },
  ]).status, 'partial_recovery');

  assert.equal(science.calculateEnvironmentalPriority({
    anomalies: [null, null, null], persistencePeriods: 3, trend: 'decreasing', quality: 'insufficient',
  }).score, null);
  assert.equal(science.detectEnvironmentalAlert({
    anomalies: [null, -2, -2], persistencePeriods: 5, worseningTrend: true, quality: 'insufficient',
  }).triggered, false);
  assert.equal(science.detectEnvironmentalAlert({
    anomalies: [-2, -2, -2], persistencePeriods: 5, worseningTrend: true, quality: 'limited',
  }).classification, 'insufficient_data');
  assert.equal(science.detectEnvironmentalAlert({
    anomalies: [-2, -2, -1.5], persistencePeriods: 3, worseningTrend: true, quality: 'good',
  }).classification, 'elevated_environmental_concern');
});

test('mock SMS provider refuses a non-sample server mode', async () => {
  const previous = process.env.SMS_MODE;
  process.env.SMS_MODE = 'live';
  const notifications = loadTypeScript('src/lib/backend/notifications.ts');
  const message = {
    id: 'm1', alertId: 'a1', content: 'AETHER SAMPLE ALERT', templateVersion: 'sample-en-v1',
    createdAt: new Date().toISOString(), status: 'approved', reviewer: 'reviewer', reviewComment: null,
    reviewedAt: new Date().toISOString(), simulation: null,
  };
  assert.match(notifications.generateSampleMessage({
    regionId: 'borena', reference: 'SAMPLE-1', observationPeriod: 'not assessed',
    reportReference: 'SAMPLE-REPORT-1',
  }), /^AETHER SAMPLE ALERT/);
  await assert.rejects(() => notifications.createMockSmsProvider().dispatch(message), /sample-only/i);
  assert.throws(() => notifications.assertSampleMessage('AETHER ALERT'), /SAMPLE/);
  if (previous === undefined) delete process.env.SMS_MODE;
  else process.env.SMS_MODE = previous;
});

test('email alerts use the configured recipient and stay disabled until SMTP is fully configured', () => {
  const emailAlerts = loadTypeScript('src/lib/backend/email-alerts.ts');
  const variables = [
    'ALERT_EMAIL_RECIPIENT',
    'EMAIL_MODE',
    'EMAIL_SMTP_HOST',
    'EMAIL_SMTP_PORT',
    'EMAIL_SMTP_SECURE',
    'EMAIL_SMTP_USER',
    'EMAIL_SMTP_PASS',
    'EMAIL_FROM_ADDRESS',
  ];
  const previous = Object.fromEntries(variables.map((key) => [key, process.env[key]]));
  try {
    variables.forEach((key) => delete process.env[key]);
    const alert = {
      id: 'a1', reference: 'SAMPLE-1', regionId: 'borena', observationPeriod: 'not assessed',
      classification: 'sample_workflow_only', indicatorsInvolved: [], supportingMeasurements: [],
      dataQuality: 'insufficient', sampleOnly: true, status: 'sample_workflow_only',
      createdAt: new Date().toISOString(), reportReference: 'SAMPLE-REPORT-1',
    };
    const email = emailAlerts.createSampleEmailAlert(alert);
    assert.equal(email.recipient, 'ezraambaw@gmail.com');
    assert.match(email.subject, /^\[AETHER SAMPLE\]/);
    assert.match(email.text, /AETHER SAMPLE EMAIL ALERT/);
    assert.match(email.subject, /SAMPLE/);
    assert.match(email.text, /No environmental measurements were analyzed/);
    assert.throws(() => emailAlerts.getEmailTransportConfig(), /disabled/i);

    process.env.ALERT_EMAIL_RECIPIENT = 'changed@example.org';
    assert.equal(emailAlerts.getAlertEmailRecipient(), 'changed@example.org');
    process.env.EMAIL_MODE = 'smtp';
    assert.throws(() => emailAlerts.getEmailTransportConfig(), /incomplete or invalid/i);
    process.env.ALERT_EMAIL_RECIPIENT = 'invalid recipient';
    assert.throws(() => emailAlerts.getAlertEmailRecipient(), /invalid/i);
  } finally {
    variables.forEach((key) => {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    });
  }
});

test('CSV ingestion validates dates, variables, units, bounds, quality flags, and preserves upload metadata', () => {
  const result = ingestion.validateCsvUpload({
    regionId: 'borena',
    datasetId: 'gpm-imerg',
    provider: 'NASA GES DISC (uploader declared)',
    productId: 'GPM-product-demo',
    datasetVersion: 'demo-v1',
    csv: [
      'date,indicator,value,units,quality_flag',
      '2024-01,rainfall,42.5,mm/month,unknown',
      '2024-02,rainfall,18,mm/month,good',
      '2024-13,rainfall,10,mm/month,good',
      '2024-04,rainfall,5,mm,good',
      '2024-05,vegetation,0.5,NDVI,good',
      '2024-06,rainfall,9,mm/month,invalid',
    ].join('\n'),
  });
  assert.equal(result.rowsReceived, 6);
  assert.equal(result.records.length, 2);
  assert.equal(result.records[0].qualityFlag, 'unknown');
  assert.equal(result.rejectedRows.length, 4);
  assert.throws(() => ingestion.validateCsvUpload({
    regionId: 'borena', datasetId: 'gpm-imerg', provider: 'x', productId: 'y', datasetVersion: 'z',
    csv: 'date,indicator,value,units,quality_flag\n"unclosed',
  }), /unclosed quoted field/);
  assert.throws(() => ingestion.validateCsvUpload({
    regionId: 'borena', datasetId: 'fldas', provider: 'x', productId: 'y', datasetVersion: 'z',
    csv: 'date,value\n2024-01,10',
  }), /header/);
});
