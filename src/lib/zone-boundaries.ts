export interface EthiopiaZoneProperties extends Record<string, unknown> {
  ID_2: string | number;
  NAME_1: string;
  NAME_2: string;
}

export type EthiopiaZoneFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  EthiopiaZoneProperties
>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPosition(value: unknown): value is GeoJSON.Position {
  return Array.isArray(value) && value.length >= 2 &&
    value.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate));
}

function isPolygonCoordinates(value: unknown): value is GeoJSON.Position[][] {
  return Array.isArray(value) && value.length > 0 &&
    value.every((ring) => Array.isArray(ring) && ring.length >= 4 && ring.every(isPosition));
}

function isMultiPolygonCoordinates(value: unknown): value is GeoJSON.Position[][][] {
  return Array.isArray(value) && value.length > 0 && value.every(isPolygonCoordinates);
}

export function isEthiopiaZoneFeatureCollection(
  value: unknown,
  expectedCount = 72,
): value is EthiopiaZoneFeatureCollection {
  if (!isRecord(value) || value.type !== "FeatureCollection" ||
      !isRecord(value.crs) || !isRecord(value.crs.properties) ||
      value.crs.properties.name !== "EPSG:4326" ||
      !Array.isArray(value.features) || value.features.length !== expectedCount) return false;

  const ids = new Set<string>();
  return value.features.every((feature) => {
    if (!isRecord(feature) || feature.type !== "Feature" ||
        !isRecord(feature.properties) || !isRecord(feature.geometry)) return false;
    const properties = feature.properties;
    if (!["string", "number"].includes(typeof properties.ID_2) ||
        String(properties.ID_2).length === 0 ||
        typeof properties.NAME_1 !== "string" ||
        typeof properties.NAME_2 !== "string") return false;
    const id = String(properties.ID_2);
    if (ids.has(id)) return false;
    ids.add(id);

    if (feature.geometry.type === "Polygon") {
      return isPolygonCoordinates(feature.geometry.coordinates);
    }
    if (feature.geometry.type === "MultiPolygon") {
      return isMultiPolygonCoordinates(feature.geometry.coordinates);
    }
    return false;
  });
}
