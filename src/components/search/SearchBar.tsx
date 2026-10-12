import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, MapPin, X, Loader2, Navigation, AlertCircle } from 'lucide-react';
import { useLocationSearch } from '../../hooks/useLocationSearch';
import { useWeatherContext } from '../../context/WeatherContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { LocationItem } from '../../types/location';

export const SearchBar: React.FC = () => {
  const { setSelectedLocation } = useWeatherContext();
  const { query, setQuery, results, isLoading, clear, debouncedQuery } = useLocationSearch();
  const { getCurrentLocation, isLoading: isLocating, error: geoError } = useGeolocation();

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
    if (results.length > 0 || (debouncedQuery.length >= 2 && !isLoading)) {
      setIsOpen(true);
    }
  }, [results, debouncedQuery, isLoading]);

  const handleSelect = (location: LocationItem) => {
    setSelectedLocation(location);
    clear();
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        handleSelect(results[highlightedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation((loc) => {
      setSelectedLocation(loc);
      setIsOpen(false);
    });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (debouncedQuery.length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="搜索城市（如：北京、Taipei、Tokyo）..."
          className="w-full pl-11 sm:pl-12 pr-24 py-3 sm:py-3.5 bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-900 text-slate-100 placeholder-slate-400 text-base rounded-2xl border border-slate-700/80 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 backdrop-blur-xl shadow-lg transition-all duration-200 outline-none"
          aria-label="搜索城市或地点"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />

        <div className="absolute right-2.5 sm:right-3 flex items-center gap-1.5">
          {query && (
            <button
              onClick={() => {
                clear();
                inputRef.current?.focus();
              }}
              title="清除搜索"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 active:bg-slate-700 transition-colors touch-manipulation"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            title="使用当前 GPS 定位"
            className="p-2 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-sky-300 border border-slate-700/60 transition-all cursor-pointer disabled:opacity-50 touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {geoError && (
        <div className="mt-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/20 rounded-xl px-3.5 py-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{geoError}</span>
        </div>
      )}

      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl overflow-hidden divide-y divide-slate-800/60 animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading && results.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              搜索中...
            </div>
          ) : results.length > 0 ? (
            <ul role="listbox" className="max-h-72 overflow-y-auto py-1">
              {results.map((loc, index) => {
                const isSelected = index === highlightedIndex;
                return (
                  <li
                    key={`${loc.id}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(loc)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between text-sm transition-colors ${
                      isSelected
                        ? 'bg-sky-500/15 text-white'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-slate-800 text-sky-400 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-slate-100">{loc.name}</span>
                        {loc.admin1 && loc.admin1 !== loc.name && (
                          <span className="text-xs text-slate-400 ml-1.5">{loc.admin1}</span>
                        )}
                        {loc.country && (
                          <span className="text-xs text-slate-500 ml-1.5">({loc.country})</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0 ml-2">
                      {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              <p className="font-medium text-slate-300">未找到匹配地点</p>
              <p className="text-xs text-slate-500 mt-1">
                请尝试输入其他城市名称，或使用拼音/英文地名（如 Beijing, Shanghai, Tokyo）
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
