import { TemperatureUnit } from '../types/weather';

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit, showDecimal = false): string {
  const value = convertTemperature(celsius, unit);
  const formatted = showDecimal ? value.toFixed(1) : Math.round(value).toString();
  return `${formatted}°${unit === 'celsius' ? 'C' : 'F'}`;
}
