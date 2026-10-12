import { fetchJson } from './client';
import {
  WeatherData,
  OpenMeteoForecastResponse,
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
} from '../types/weather';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';

function normalizeWeatherData(raw: OpenMeteoForecastResponse): WeatherData {
  const current: CurrentWeather = {
    time: raw.current.time,
    temperature: raw.current.temperature_2m,
    apparentTemperature: raw.current.apparent_temperature,
    humidity: raw.current.relative_humidity_2m,
    windSpeed: raw.current.wind_speed_10m,
    pressure: raw.current.surface_pressure ?? 1013,
    precipitation: raw.current.precipitation,
    weatherCode: raw.current.weather_code,
    isDay: raw.current.is_day === 1,
  };

  const currentTimeIso = raw.current.time;
  let startIndex = 0;
  if (raw.hourly.time && raw.hourly.time.length > 0) {
    const idx = raw.hourly.time.findIndex((t) => t >= currentTimeIso);
    if (idx !== -1) {
      startIndex = idx;
    }
  }

  const hourly: HourlyForecastItem[] = [];
  const hourlyTimes = raw.hourly.time || [];
  const maxHours = Math.min(24, hourlyTimes.length - startIndex);

  for (let i = 0; i < maxHours; i++) {
    const index = startIndex + i;
    hourly.push({
      time: hourlyTimes[index],
      temperature: raw.hourly.temperature_2m[index],
      weatherCode: raw.hourly.weather_code[index],
      precipitationProbability: raw.hourly.precipitation_probability
        ? raw.hourly.precipitation_probability[index] ?? 0
        : 0,
      isDay: raw.hourly.is_day ? raw.hourly.is_day[index] === 1 : true,
    });
  }

  const daily: DailyForecastItem[] = [];
  const dailyTimes = raw.daily.time || [];
  for (let i = 0; i < dailyTimes.length; i++) {
    daily.push({
      date: dailyTimes[i],
      weatherCode: raw.daily.weather_code[i],
      maxTemperature: raw.daily.temperature_2m_max[i],
      minTemperature: raw.daily.temperature_2m_min[i],
      precipitationProbabilityMax: raw.daily.precipitation_probability_max
        ? raw.daily.precipitation_probability_max[i] ?? 0
        : 0,
      uvIndexMax: raw.daily.uv_index_max ? raw.daily.uv_index_max[i] ?? 0 : 0,
    });
  }

  return {
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    current,
    hourly,
    daily,
  };
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure',
    hourly: 'temperature_2m,weather_code,precipitation_probability,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const url = `${WEATHER_BASE_URL}/forecast?${params.toString()}`;
  const rawData = await fetchJson<OpenMeteoForecastResponse>(url, { signal, timeoutMs: 8000 });

  return normalizeWeatherData(rawData);
}
