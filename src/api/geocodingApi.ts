import { fetchJson } from './client';
import { LocationItem, OpenMeteoGeocodingResponse, OpenMeteoGeocodingResult } from '../types/location';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

function mapGeocodingResultToLocation(item: OpenMeteoGeocodingResult): LocationItem {
  const parts: string[] = [item.name];
  if (item.admin1 && item.admin1 !== item.name) {
    parts.push(item.admin1);
  }
  if (item.country) {
    parts.push(item.country);
  }

  return {
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country,
    countryCode: item.country_code,
    admin1: item.admin1,
    displayName: parts.join(', '),
  };
}

export async function searchLocations(query: string, signal?: AbortSignal): Promise<LocationItem[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(
    trimmed
  )}&count=8&language=zh&format=json`;

  const data = await fetchJson<OpenMeteoGeocodingResponse>(url, { signal, timeoutMs: 6000 });

  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map(mapGeocodingResultToLocation);
}

export const DEFAULT_PRESET_LOCATIONS: LocationItem[] = [
  {
    id: 1816670,
    name: '北京',
    latitude: 39.9042,
    longitude: 116.4074,
    country: '中国',
    countryCode: 'CN',
    displayName: '北京, 中国',
  },
  {
    id: 1796236,
    name: '上海',
    latitude: 31.2222,
    longitude: 121.4581,
    country: '中国',
    countryCode: 'CN',
    displayName: '上海, 中国',
  },
  {
    id: 1850147,
    name: '东京',
    latitude: 35.6895,
    longitude: 139.6917,
    country: '日本',
    countryCode: 'JP',
    displayName: '东京, 日本',
  },
  {
    id: 5128581,
    name: '纽约',
    latitude: 40.7143,
    longitude: -74.006,
    country: '美国',
    countryCode: 'US',
    displayName: '纽约, 美国',
  },
];
