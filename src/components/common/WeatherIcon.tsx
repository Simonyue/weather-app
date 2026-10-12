import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', ...props }) => {
  switch (name) {
    case 'Sun':
      return <Sun className={`text-amber-400 ${className}`} {...props} />;
    case 'SunDim':
      return <Sun className={`text-amber-300 ${className}`} {...props} />;
    case 'Moon':
      return <Moon className={`text-indigo-300 ${className}`} {...props} />;
    case 'CloudSun':
      return <CloudSun className={`text-amber-300 ${className}`} {...props} />;
    case 'CloudMoon':
      return <CloudMoon className={`text-indigo-300 ${className}`} {...props} />;
    case 'Cloud':
      return <Cloud className={`text-slate-300 ${className}`} {...props} />;
    case 'CloudFog':
      return <CloudFog className={`text-slate-400 ${className}`} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`text-sky-300 ${className}`} {...props} />;
    case 'CloudRain':
    case 'CloudRainWind':
      return <CloudRain className={`text-sky-400 ${className}`} {...props} />;
    case 'Snowflake':
      return <Snowflake className={`text-blue-200 ${className}`} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={`text-amber-400 ${className}`} {...props} />;
    default:
      return <CloudSun className={`text-sky-300 ${className}`} {...props} />;
  }
};
