import { describe, it, expect } from 'vitest';
import { getWmoWeatherInfo } from '../../utils/wmoCodes';

describe('WMO Weather Code utility', () => {
  it('returns sunny weather information for code 0 during the day', () => {
    const info = getWmoWeatherInfo(0, true);
    expect(info.descriptionZh).toBe('晴天');
    expect(info.iconName).toBe('Sun');
    expect(info.isRain).toBe(false);
  });

  it('returns moon icon for code 0 during the night', () => {
    const info = getWmoWeatherInfo(0, false);
    expect(info.descriptionZh).toBe('晴天');
    expect(info.iconName).toBe('Moon');
  });

  it('returns rain weather info for thunderstorm code 95', () => {
    const info = getWmoWeatherInfo(95, true);
    expect(info.descriptionZh).toBe('雷阵雨');
    expect(info.isRain).toBe(true);
    expect(info.isThunder).toBe(true);
  });

  it('returns fallback for unknown code', () => {
    const info = getWmoWeatherInfo(999, true);
    expect(info.descriptionZh).toBe('晴间多云');
    expect(info.iconName).toBe('CloudSun');
  });
});
