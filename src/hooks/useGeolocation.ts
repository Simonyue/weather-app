import { useState, useCallback } from 'react';
import { LocationItem } from '../types/location';

interface GeolocationState {
  isLoading: boolean;
  error: string | null;
  location: LocationItem | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    isLoading: false,
    error: null,
    location: null,
  });

  const getCurrentLocation = useCallback((onSuccess?: (loc: LocationItem) => void) => {
    if (!navigator.geolocation) {
      setState({
        isLoading: false,
        error: '您的浏览器不支持地理位置定位功能',
        location: null,
      });
      return;
    }

    setState({ isLoading: true, error: null, location: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const loc: LocationItem = {
          id: Math.round(latitude * 1000 + longitude * 1000),
          name: '当前位置',
          latitude,
          longitude,
          displayName: `当前位置 (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
        };

        setState({
          isLoading: false,
          error: null,
          location: loc,
        });

        if (onSuccess) {
          onSuccess(loc);
        }
      },
      (error) => {
        let errorMsg = '无法获取您的当前位置';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = '定位权限已被拒绝，请在浏览器设置中允许位置访问';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = '无法获取当前位置信息，请稍后再试';
            break;
          case error.TIMEOUT:
            errorMsg = '获取位置信息超时';
            break;
        }

        setState({
          isLoading: false,
          error: errorMsg,
          location: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return {
    ...state,
    getCurrentLocation,
  };
}
