import React from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchBar } from './components/search/SearchBar';
import { SearchHistory } from './components/search/SearchHistory';
import { CurrentWeather } from './components/weather/CurrentWeather';
import { WeatherMetrics } from './components/weather/WeatherMetrics';
import { HourlyForecast } from './components/weather/HourlyForecast';
import { DailyForecast } from './components/weather/DailyForecast';
import { WeatherHeroSkeleton, Skeleton } from './components/common/Skeleton';
import { ErrorAlert } from './components/common/ErrorAlert';
import { useWeatherContext } from './context/WeatherContext';
import { useWeatherQuery } from './hooks/useWeatherQuery';

export const App: React.FC = () => {
  const { selectedLocation } = useWeatherContext();
  const {
    data: weather,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useWeatherQuery(selectedLocation);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        <div className="space-y-2.5 sm:space-y-3">
          <SearchBar />
          <SearchHistory />
        </div>

        {isLoading && !weather ? (
          <div className="space-y-4 sm:space-y-6">
            <WeatherHeroSkeleton />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-24 rounded-2xl ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
                />
              ))}
            </div>
            <Skeleton className="h-40 sm:h-44 rounded-2xl" />
            <Skeleton className="h-64 sm:h-72 rounded-2xl" />
          </div>
        ) : isError ? (
          <ErrorAlert
            title="无法加载天气数据"
            message={
              error instanceof Error
                ? error.message
                : '无法与天气服务器建立连接，请检查网络或稍后再试。'
            }
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        ) : weather ? (
          <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-300">
            <CurrentWeather
              weather={weather}
              location={selectedLocation}
              isFetching={isFetching}
            />

            <WeatherMetrics
              current={weather.current}
              todayForecast={weather.daily[0]}
            />

            <HourlyForecast hourly={weather.hourly} />

            <DailyForecast daily={weather.daily} />
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default App;
