import React from 'react';
import { History, X, Trash2, MapPin } from 'lucide-react';
import { useWeatherContext } from '../../context/WeatherContext';
import { DEFAULT_PRESET_LOCATIONS } from '../../api/geocodingApi';
import { LocationItem } from '../../types/location';

export const SearchHistory: React.FC = () => {
  const { searchHistory, selectedLocation, setSelectedLocation, removeFromHistory, clearHistory } =
    useWeatherContext();

  const handleSelect = (loc: LocationItem) => {
    setSelectedLocation(loc);
  };

  const isCurrentActive = (loc: LocationItem) => {
    return (
      Math.abs(loc.latitude - selectedLocation.latitude) < 0.01 &&
      Math.abs(loc.longitude - selectedLocation.longitude) < 0.01
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <History className="w-3.5 h-3.5 text-slate-500" />
          {searchHistory.length > 0 ? '最近搜索' : '热门推荐城市'}
        </span>
        {searchHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-400 active:text-red-300 transition-colors cursor-pointer py-1 px-1.5 touch-manipulation"
          >
            <Trash2 className="w-3 h-3" />
            清除记录
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {searchHistory.length > 0 ? (
          searchHistory.map((loc) => {
            const active = isCurrentActive(loc);
            return (
              <div
                key={`${loc.id}-${loc.latitude}`}
                className={`group inline-flex items-center gap-1 pl-3 pr-1.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer touch-manipulation active:scale-95 ${
                  active
                    ? 'bg-sky-500/20 text-sky-200 border-sky-500/40 shadow-sm shadow-sky-500/10'
                    : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span onClick={() => handleSelect(loc)} className="hover:underline flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400/80 shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{loc.name}</span>
                  {loc.country && <span className="text-[10px] text-slate-500 font-normal">({loc.country})</span>}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(loc.id);
                  }}
                  title="移除"
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 active:bg-slate-600 transition-colors ml-0.5"
                  aria-label={`移除 ${loc.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })
        ) : (
          DEFAULT_PRESET_LOCATIONS.map((loc) => {
            const active = isCurrentActive(loc);
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border cursor-pointer touch-manipulation active:scale-95 ${
                  active
                    ? 'bg-sky-500/20 text-sky-200 border-sky-500/40'
                    : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <MapPin className="w-3 h-3 text-sky-400/80" />
                {loc.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
