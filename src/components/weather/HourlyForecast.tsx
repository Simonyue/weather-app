import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { HourlyForecastItem } from '../../types/weather';
import { useWeatherContext } from '../../context/WeatherContext';
import { formatTemperature } from '../../utils/temperature';
import { formatHour, isCurrentHour } from '../../utils/date';
import { getWmoWeatherInfo } from '../../utils/wmoCodes';
import { WeatherIcon } from '../common/WeatherIcon';
import { Card } from '../common/Card';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  const { unit } = useWeatherContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!hourly || hourly.length === 0) return null;

  return (
    <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm sm:text-base">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>24 小时逐小时天气预报</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            title="向左滚动"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            title="向右滚动"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar snap-x snap-mandatory touch-pan-x"
      >
        {hourly.map((item, index) => {
          const current = isCurrentHour(item.time) || index === 0;
          const weatherInfo = getWmoWeatherInfo(item.weatherCode, item.isDay);

          return (
            <div
              key={item.time}
              className={`flex flex-col items-center justify-between py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-2xl min-w-[70px] sm:min-w-[76px] shrink-0 border snap-start transition-all duration-200 select-none ${
                current
                  ? 'bg-sky-500/15 border-sky-500/40 text-white shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <span className="text-[11px] sm:text-xs font-medium text-slate-400">
                {current ? '现在' : formatHour(item.time)}
              </span>

              <div className="my-2">
                <WeatherIcon name={weatherInfo.iconName} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <span className="text-xs sm:text-sm font-bold text-white">
                {formatTemperature(item.temperature, unit)}
              </span>

              {item.precipitationProbability > 0 ? (
                <div className="flex items-center gap-0.5 text-[10px] text-sky-400 mt-1 font-medium">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{item.precipitationProbability}%</span>
                </div>
              ) : (
                <div className="h-3.5 mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
