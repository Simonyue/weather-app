import React, { createContext, useContext, ReactNode } from 'react';
import { TemperatureUnit } from '../types/weather';
import { LocationItem } from '../types/location';
import { DEFAULT_PRESET_LOCATIONS } from '../api/geocodingApi';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface WeatherContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  setUnit: (unit: TemperatureUnit) => void;
  selectedLocation: LocationItem;
  setSelectedLocation: (location: LocationItem) => void;
  searchHistory: LocationItem[];
  addToHistory: (location: LocationItem) => void;
  removeFromHistory: (id: number) => void;
  clearHistory: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const STORAGE_KEYS = {
  UNIT: 'weather_temp_unit',
  LOCATION: 'weather_last_location',
  HISTORY: 'weather_search_history',
};

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>(STORAGE_KEYS.UNIT, 'celsius');
  const [selectedLocation, setSelectedLocationState] = useLocalStorage<LocationItem>(
    STORAGE_KEYS.LOCATION,
    DEFAULT_PRESET_LOCATIONS[0]
  );
  const [searchHistory, setSearchHistory] = useLocalStorage<LocationItem[]>(STORAGE_KEYS.HISTORY, [
    DEFAULT_PRESET_LOCATIONS[0],
    DEFAULT_PRESET_LOCATIONS[1],
  ]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const addToHistory = (location: LocationItem) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (item) =>
          item.id !== location.id &&
          !(Math.abs(item.latitude - location.latitude) < 0.01 && Math.abs(item.longitude - location.longitude) < 0.01)
      );
      return [location, ...filtered].slice(0, 6);
    });
  };

  const setSelectedLocation = (location: LocationItem) => {
    setSelectedLocationState(location);
    addToHistory(location);
  };

  const removeFromHistory = (id: number) => {
    setSearchHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <WeatherContext.Provider
      value={{
        unit,
        toggleUnit,
        setUnit,
        selectedLocation,
        setSelectedLocation,
        searchHistory,
        addToHistory,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export function useWeatherContext(): WeatherContextType {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}
