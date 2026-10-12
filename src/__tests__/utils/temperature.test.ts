import { describe, it, expect } from 'vitest';
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  convertTemperature,
  formatTemperature,
} from '../../utils/temperature';

describe('Temperature utility functions', () => {
  it('correctly converts Celsius to Fahrenheit', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(25)).toBe(77);
    expect(celsiusToFahrenheit(-10)).toBe(14);
  });

  it('correctly converts Fahrenheit to Celsius', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(fahrenheitToCelsius(212)).toBe(100);
    expect(fahrenheitToCelsius(77)).toBe(25);
  });

  it('converts temperature according to specified unit', () => {
    expect(convertTemperature(20, 'celsius')).toBe(20);
    expect(convertTemperature(20, 'fahrenheit')).toBe(68);
  });

  it('formats temperature with unit symbol', () => {
    expect(formatTemperature(25, 'celsius')).toBe('25°C');
    expect(formatTemperature(25, 'fahrenheit')).toBe('77°F');
    expect(formatTemperature(25.4, 'celsius', true)).toBe('25.4°C');
    expect(formatTemperature(25.4, 'celsius', false)).toBe('25°C');
  });
});
