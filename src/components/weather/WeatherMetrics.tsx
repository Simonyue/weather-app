import React from 'react';
import { Droplets, Wind, Sun, CloudRain, Gauge } from 'lucide-react';
import { CurrentWeather, DailyForecastItem } from '../../types/weather';
import { Card } from '../common/Card';

interface WeatherMetricsProps {
  current: CurrentWeather;
  todayForecast?: DailyForecastItem;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ current, todayForecast }) => {
  const getHumidityDesc = (val: number) => {
    if (val < 40) return '干燥';
    if (val <= 70) return '舒适';
    return '偏潮湿';
  };

  const getUvDesc = (val: number) => {
    if (val <= 2) return '微量级';
    if (val <= 5) return '中量级';
    if (val <= 7) return '高量级';
    if (val <= 10) return '过量级';
    return '危险级';
  };

  const uvVal = todayForecast?.uvIndexMax ?? 0;
  const rainProb = todayForecast?.precipitationProbabilityMax ?? 0;

  const metrics = [
    {
      id: 'humidity',
      label: '相对湿度',
      value: `${current.humidity}%`,
      description: getHumidityDesc(current.humidity),
      icon: Droplets,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
    },
    {
      id: 'wind',
      label: '风速',
      value: `${Math.round(current.windSpeed)} km/h`,
      description: current.windSpeed > 20 ? '有感强风' : '微风徐徐',
      icon: Wind,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
    },
    {
      id: 'rain',
      label: '降水概率',
      value: `${rainProb}%`,
      description: current.precipitation > 0 ? `累计 ${current.precipitation}mm` : '无显著降水',
      icon: CloudRain,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'uv',
      label: '紫外线指数',
      value: `${uvVal.toFixed(1)}`,
      description: getUvDesc(uvVal),
      icon: Sun,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      id: 'pressure',
      label: '大气压',
      value: `${Math.round(current.pressure)} hPa`,
      description: '正常气压',
      icon: Gauge,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
      {metrics.map((item, index) => {
        const Icon = item.icon;
        const isLastOnMobile = index === metrics.length - 1;
        return (
          <Card
            key={item.id}
            className={`p-3.5 sm:p-4 flex flex-col justify-between ${
              isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
              <span className="text-xs font-medium">{item.label}</span>
              <div className={`p-1.5 rounded-lg ${item.bgColor} ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                {item.value}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                {item.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
