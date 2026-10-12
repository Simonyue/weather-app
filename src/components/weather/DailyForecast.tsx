import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { DailyForecastItem } from '../../types/weather';
import { useWeatherContext } from '../../context/WeatherContext';
import { formatTemperature } from '../../utils/temperature';
import { formatDailyDate } from '../../utils/date';
import { getWmoWeatherInfo } from '../../utils/wmoCodes';
import { WeatherIcon } from '../common/WeatherIcon';
import { Card } from '../common/Card';

interface DailyForecastProps {
  daily: DailyForecastItem[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily }) => {
  const { unit } = useWeatherContext();

  if (!daily || daily.length === 0) return null;

  const allMin = Math.min(...daily.map((d) => d.minTemperature));
  const allMax = Math.max(...daily.map((d) => d.maxTemperature));
  const tempRange = Math.max(1, allMax - allMin);

  return (
    <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm sm:text-base">
        <Calendar className="w-4 h-4 text-sky-400" />
        <span>7 天天气预报</span>
      </div>

      <div className="divide-y divide-slate-800/60">
        {daily.map((item) => {
          const { label, subLabel } = formatDailyDate(item.date);
          const weatherInfo = getWmoWeatherInfo(item.weatherCode, true);

          const leftPercent = Math.max(0, ((item.minTemperature - allMin) / tempRange) * 100);
          const widthPercent = Math.max(
            15,
            ((item.maxTemperature - item.minTemperature) / tempRange) * 100
          );

          return (
            <div
              key={item.date}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3 text-sm first:pt-1 last:pb-1"
            >
              <div className="w-16 sm:w-24 shrink-0">
                <span className="font-medium text-slate-200 text-xs sm:text-sm">{label}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 ml-1 block sm:inline">
                  {subLabel}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 flex-1 min-w-0">
                <WeatherIcon name={weatherInfo.iconName} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-xs text-slate-400 truncate hidden xs:inline">
                  {weatherInfo.descriptionZh}
                </span>
              </div>

              <div className="w-10 sm:w-14 shrink-0 text-right">
                {item.precipitationProbabilityMax > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-[11px] sm:text-xs text-sky-400 font-medium">
                    <Droplets className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {item.precipitationProbabilityMax}%
                  </span>
                ) : (
                  <span className="text-[11px] sm:text-xs text-slate-600">-</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 justify-end w-32 xs:w-40 sm:w-48">
                <span className="text-xs text-slate-400 font-medium w-8 sm:w-9 text-right">
                  {formatTemperature(item.minTemperature, unit)}
                </span>

                <div className="relative w-10 xs:w-16 sm:flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                    }}
                  />
                </div>

                <span className="text-xs text-slate-100 font-bold w-8 sm:w-9 text-right">
                  {formatTemperature(item.maxTemperature, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
