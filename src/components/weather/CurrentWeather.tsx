import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { LocationItem } from '../../types/location';
import { useWeatherContext } from '../../context/WeatherContext';
import { getWmoWeatherInfo } from '../../utils/wmoCodes';
import { formatTemperature } from '../../utils/temperature';
import { formatLastUpdated } from '../../utils/date';
import { WeatherIcon } from '../common/WeatherIcon';

interface CurrentWeatherProps {
  weather: WeatherData;
  location: LocationItem;
  isFetching?: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, location, isFetching = false }) => {
  const { unit } = useWeatherContext();
  const current = weather.current;
  const todayForecast = weather.daily[0];
  const weatherInfo = getWmoWeatherInfo(current.weatherCode, current.isDay);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/80 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-300">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-row items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sky-400 font-medium text-xs sm:text-sm">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{location.country ? `${location.country}` : '位置'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 truncate">
            {location.name}
            {location.admin1 && location.admin1 !== location.name && (
              <span className="text-sm sm:text-lg font-normal text-slate-400 ml-1.5 sm:ml-2">
                {location.admin1}
              </span>
            )}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] sm:text-xs font-medium text-slate-300">
            <WeatherIcon name={weatherInfo.iconName} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{weatherInfo.descriptionZh}</span>
          </div>

          <div
            className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 pr-1"
            title="最后更新时间"
          >
            <Clock className="w-3 h-3" />
            <span>{formatLastUpdated(new Date(current.time))}</span>
            {isFetching && <span className="text-sky-400 ml-0.5 animate-pulse">●</span>}
          </div>
        </div>
      </div>

      <div className="relative z-10 my-6 sm:my-8 flex items-center justify-between gap-4">
        <div>
          <span className="text-5xl sm:text-7xl font-black tracking-tighter text-white">
            {formatTemperature(current.temperature, unit)}
          </span>
          <div className="text-xs sm:text-sm text-slate-400 space-y-1 mt-1">
            <p>
              体感{' '}
              <span className="font-semibold text-slate-200">
                {formatTemperature(current.apparentTemperature, unit)}
              </span>
            </p>
            {todayForecast && (
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <span className="flex items-center text-rose-300 font-medium">
                  <ArrowUp className="w-3 h-3 mr-0.5" />
                  {formatTemperature(todayForecast.maxTemperature, unit)}
                </span>
                <span className="flex items-center text-sky-300 font-medium">
                  <ArrowDown className="w-3 h-3 mr-0.5" />
                  {formatTemperature(todayForecast.minTemperature, unit)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/40 border border-slate-700/40 backdrop-blur-md shrink-0 flex items-center justify-center shadow-inner">
          <WeatherIcon name={weatherInfo.iconName} className="w-14 h-14 sm:w-20 sm:h-20 drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
};
