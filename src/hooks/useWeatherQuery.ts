import { useQuery } from '@tanstack/react-query';
import { fetchWeatherForecast } from '../api/weatherApi';
import { LocationItem } from '../types/location';
import { ApiError } from '../api/client';

export function useWeatherQuery(location: LocationItem | null) {
  return useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: ({ signal }) => {
      if (!location) {
        throw new ApiError('未指定有效的位置信息', { category: 'not_found' });
      }
      return fetchWeatherForecast(location.latitude, location.longitude, signal);
    },
    enabled: Boolean(location && typeof location.latitude === 'number' && typeof location.longitude === 'number'),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.category === 'not_found') {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}
