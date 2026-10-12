export interface LocationItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  admin1?: string;
  displayName: string;
}

export interface OpenMeteoGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
}

export interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
  generationtime_ms?: number;
}
