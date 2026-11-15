const fs = require('node:fs');
const path = require('node:path');

const REPOSITORY_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIRECTORY = path.join(REPOSITORY_ROOT, 'data', 'source');
const DEFAULT_OUTPUT = path.join(REPOSITORY_ROOT, 'src', 'data', 'ethiopiaZoneDatasetOverlay.json');
const DEFAULT_GEOJSON = path.join(REPOSITORY_ROOT, 'public', 'zone-data', 'ethiopia_zones.geojson');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index++;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && text[index + 1] === '\n') index++;
      row.push(field);
      field = '';
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
    } else {
      field += character;
    }
  }

  if (quoted) throw new TypeError('CSV contains an unclosed quoted field.');
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }
  if (rows.length < 2) throw new TypeError('CSV must contain a header and at least one data row.');

  const headers = rows[0].map((header, index) => index === 0 ? header.replace(/^\uFEFF/, '') : header);
  if (new Set(headers).size !== headers.length || headers.some((header) => !header)) {
    throw new TypeError('CSV headers must be non-empty and unique.');
  }
  return rows.slice(1).map((cells, rowIndex) => {
    if (cells.length !== headers.length) {
      throw new TypeError(`CSV row ${rowIndex + 2} has ${cells.length} cells; expected ${headers.length}.`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  });
}

function pointInRing(longitude, latitude, ring) {
  let inside = false;
  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
    const [currentLongitude, currentLatitude] = ring[current];
    const [previousLongitude, previousLatitude] = ring[previous];
    const crossesLatitude = (currentLatitude > latitude) !== (previousLatitude > latitude);
    if (crossesLatitude &&
        longitude < ((previousLongitude - currentLongitude) * (latitude - currentLatitude)) /
          (previousLatitude - currentLatitude) + currentLongitude) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInFeature(longitude, latitude, feature) {
  const geometry = feature.geometry;
  const polygons = geometry.type === 'Polygon'
    ? [geometry.coordinates]
    : geometry.type === 'MultiPolygon'
      ? geometry.coordinates
      : null;
  if (!polygons) throw new TypeError(`Unsupported geometry type: ${geometry.type}`);

  return polygons.some((rings) =>
    rings.length > 0 &&
    pointInRing(longitude, latitude, rings[0]) &&
    !rings.slice(1).some((hole) => pointInRing(longitude, latitude, hole)),
  );
}

function validateFeatures(geoJson) {
  if (geoJson?.type !== 'FeatureCollection' || !Array.isArray(geoJson.features)) {
    throw new TypeError('Boundary input must be a GeoJSON FeatureCollection.');
  }
  if (geoJson.crs?.properties?.name !== 'EPSG:4326') {
    throw new TypeError('Boundary input must declare EPSG:4326 coordinates.');
  }

  const ids = new Set();
  for (const feature of geoJson.features) {
    const id = String(feature?.properties?.ID_2 ?? '');
    if (!id || ids.has(id)) throw new TypeError('Every zone must have a unique ID_2.');
    if (feature.properties?.NAME_1 === undefined || feature.properties?.NAME_2 === undefined) {
      throw new TypeError(`Zone ${id} is missing its region or zone name.`);
    }
    if (!['Polygon', 'MultiPolygon'].includes(feature.geometry?.type)) {
      throw new TypeError(`Zone ${id} has an unsupported geometry.`);
    }
    ids.add(id);
  }
  if (ids.size !== 72) throw new TypeError(`Expected 72 zone features; found ${ids.size}.`);
  return geoJson.features;
}

function summarizeGrid(features, rows, { valueKey, name, units, source, temporalCoverage, spatialResolution }) {
  const cells = new Map();
  let validRows = 0;
  for (const row of rows) {
    const latitude = Number(row.latitude);
    const longitude = Number(row.longitude);
    const value = Number(row[valueKey]);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 ||
        !Number.isFinite(value)) continue;
    if (name === 'surface soil wetness' && (value < 0 || value > 1)) continue;
    validRows++;
    const cellKey = `${longitude},${latitude}`;
    const values = cells.get(cellKey) ?? { longitude, latitude, values: [] };
    values.values.push(value);
    cells.set(cellKey, values);
  }

  const zoneValues = new Map(features.map((feature) => [
    String(feature.properties.ID_2),
    { sum: 0, cellCount: 0 },
  ]));
  let assignedGridCells = 0;
  let outsideGridCells = 0;
  for (const cell of cells.values()) {
    const value = cell.values.reduce((sum, item) => sum + item, 0) / cell.values.length;
    const matches = features.filter((feature) => pointInFeature(cell.longitude, cell.latitude, feature));
    if (matches.length > 1) {
      throw new TypeError(`Grid point ${cell.longitude},${cell.latitude} falls inside multiple zones.`);
    }
    if (matches.length === 0) {
      outsideGridCells++;
      continue;
    }
    const stats = zoneValues.get(String(matches[0].properties.ID_2));
    stats.sum += value;
    stats.cellCount++;
    assignedGridCells++;
  }

  const zonesWithData = [...zoneValues.values()].filter((stats) => stats.cellCount > 0).length;
  return {
    name,
    units,
    source,
    temporalCoverage,
    spatialResolution,
    spatialMethod: 'Unweighted mean of valid grid-cell center points inside each zone; not area-weighted.',
    inputRows: rows.length,
    validRows,
    uniqueGridCells: cells.size,
    assignedGridCells,
    outsideGridCells,
    zonesWithData,
    zones: Object.fromEntries([...zoneValues].map(([id, stats]) => [
      id,
      stats.cellCount === 0
        ? null
        : { mean: Number((stats.sum / stats.cellCount).toFixed(6)), gridCellCount: stats.cellCount },
    ])),
  };
}

function dateRange(rows, dateKey) {
  const dates = rows.map((row) => row[dateKey]).filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)).sort();
  if (dates.length === 0) return { start: null, end: null, validDateCount: 0 };
  return { start: dates[0], end: dates[dates.length - 1], validDateCount: dates.length };
}

function summarizeObservations(rows, dateKey, valueKey) {
  const observations = rows
    .map((row) => ({ date: row[dateKey], value: Number(row[valueKey]) }))
    .filter((observation) =>
      /^\d{4}-\d{2}-\d{2}$/.test(observation.date) && Number.isFinite(observation.value),
    )
    .sort((first, second) => first.date.localeCompare(second.date));
  if (observations.length === 0) {
    throw new TypeError(`Expected at least one valid ${dateKey}/${valueKey} observation.`);
  }
  const values = observations.map((observation) => observation.value);
  return {
    latestObservation: observations[observations.length - 1],
    valueRange: {
      minimum: Math.min(...values),
      maximum: Math.max(...values),
    },
  };
}

function buildZoneOverlay({ geoJson, rainfallRows, soilRows, temperatureRows }) {
  const features = validateFeatures(geoJson);
  const soilMetadata = soilRows[0];
  const temperatureMetadata = temperatureRows[0];
  const rainfallMetadata = rainfallRows[0];
  const rainfallSummary = summarizeObservations(rainfallRows, 'date', 'precipitation_value');

  return {
    schemaVersion: 1,
    boundary: {
      featureCount: features.length,
      crs: 'EPSG:4326',
      idField: 'ID_2',
      regionField: 'NAME_1',
      zoneField: 'NAME_2',
      source: 'User-provided 72-zone Ethiopia GeoJSON; Borena ID_2=13679, CC_2=0412 matches the supplied attributes table.',
    },
    datasets: {
      soilMoisture: summarizeGrid(features, soilRows, {
        valueKey: 'surface_soil_wetness',
        name: 'surface soil wetness',
        units: soilMetadata.units,
        source: soilMetadata.source,
        temporalCoverage: soilMetadata.temporal_coverage,
        spatialResolution: soilMetadata.spatial_resolution,
      }),
      surfaceTemperature: summarizeGrid(features, temperatureRows, {
        valueKey: 'time_averaged_surface_temperature_c',
        name: 'time-averaged daytime surface temperature',
        units: '°C',
        source: temperatureMetadata.source,
        temporalCoverage: temperatureMetadata.temporal_coverage_in_file,
        spatialResolution: `${temperatureMetadata.spatial_resolution_degrees} degree`,
      }),
      rainfall: {
        name: 'daily mean precipitation',
        source: rainfallMetadata.measurement_description,
        units: rainfallMetadata.units,
        spatialScope: rainfallMetadata.spatial_scope,
        temporalCoverage: dateRange(rainfallRows, 'date'),
        spatiallyMappableToZones: false,
        reason: 'One Ethiopia bounding-box average is provided per date; the file has no gridded or zone-level rainfall values, and its units are not stated.',
        ...rainfallSummary,
      },
    },
    trainingReadiness: {
      status: 'blocked',
      reason: 'There are no paired, temporally varying, zone-level rainfall and soil-moisture observations. The soil and temperature files contain long-period spatial averages; rainfall is a national bounding-box time series.',
      eligibleForForecastTraining: false,
      requiredData: 'For each zone and month, provide source-backed rainfall accumulation (mm/month) and soil-moisture observations with units, valid dates, quality flags, and product provenance. Keep the polygon-based extraction method and source version with the export.',
    },
    limitations: [
      'Zone summaries are approximate, unweighted means of grid-cell center values that fall inside each polygon; they are not area-weighted zonal statistics.',
      'Grid-cell centers outside all zone polygons are excluded; zones without a center point have no summary and are shown as unavailable.',
      'Soil wetness and surface temperature are long-term time averages, not month-by-month observations.',
      'Surface soil wetness (GWETTOP, unitless) is not volumetric soil moisture and is not interchangeable with FLDAS 0–10 cm m³/m³.',
      'Daytime surface temperature is not near-surface air temperature.',
      'The combined reference CSV is excluded because it repeats static spatial averages against daily rainfall dates.',
      'No forecast model is trained from these spatial summaries.',
    ],
  };
}

function buildFromDirectory(directory = SOURCE_DIRECTORY, geoJsonPath = DEFAULT_GEOJSON) {
  const geoJson = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'));
  const rainfallRows = parseCsv(fs.readFileSync(path.join(directory, 'ethiopia_rainfall_clean.csv'), 'utf8'));
  const soilRows = parseCsv(fs.readFileSync(path.join(directory, 'ethiopia_soil_moisture_clean.csv'), 'utf8'));
  const temperatureRows = parseCsv(fs.readFileSync(path.join(directory, 'ethiopia_temperature_clean.csv'), 'utf8'));
  return buildZoneOverlay({ geoJson, rainfallRows, soilRows, temperatureRows });
}

if (require.main === module) {
  try {
    const outputPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUTPUT;
    const result = buildFromDirectory();
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    console.log(`Wrote zone overlay summary: ${outputPath}`);
    console.log(`Zones: ${result.boundary.featureCount}; soil coverage: ${result.datasets.soilMoisture.zonesWithData}; temperature coverage: ${result.datasets.surfaceTemperature.zonesWithData}; model training: ${result.trainingReadiness.status}.`);
  } catch (error) {
    console.error(`Zone overlay generation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { buildFromDirectory, buildZoneOverlay, parseCsv, pointInFeature, validateFeatures };
