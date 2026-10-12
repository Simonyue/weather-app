import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchLocations } from '../api/geocodingApi';
import { LocationItem } from '../types/location';

export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const {
    data: results = [],
    isLoading,
    isError,
    error,
  } = useQuery<LocationItem[]>({
    queryKey: ['locationSearch', debouncedQuery],
    queryFn: ({ signal }) => searchLocations(debouncedQuery, signal),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 10,
  });

  const clear = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    results: debouncedQuery.length >= 2 ? results : [],
    isLoading: debouncedQuery.length >= 2 && isLoading,
    isError,
    error,
    clear,
  };
}
