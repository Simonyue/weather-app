import React from 'react';
import { CloudSun, Navigation, Compass } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { useGeolocation } from '../../hooks/useGeolocation';

export const Header: React.FC = () => {
  const { unit, toggleUnit, setSelectedLocation } = useWeatherContext();
  const { getCurrentLocation, isLoading: isLocating } = useGeolocation();

  const handleLocateMe = () => {
    getCurrentLocation((loc) => {
      setSelectedLocation(loc);
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 shadow-md shadow-sky-500/20 text-white shrink-0">
            <CloudSun className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent truncate">
              WeatherLens
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium hidden xs:block">
              实时天气与预报
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            title="定位当前位置"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-sky-500/60 hover:bg-slate-800 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 min-h-[38px] touch-manipulation"
          >
            {isLocating ? (
              <Compass className="w-4 h-4 text-sky-400 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4 text-sky-400" />
            )}
            <span className="hidden sm:inline">当前位置</span>
          </button>

          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800/80 min-h-[38px]">
            <button
              onClick={() => unit !== 'celsius' && toggleUnit()}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 ${
                unit === 'celsius'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'fahrenheit' && toggleUnit()}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 ${
                unit === 'fahrenheit'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
