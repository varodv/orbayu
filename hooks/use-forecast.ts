'use client';

import type { Forecast } from '@/types/forecast';
import { useQuery } from '@tanstack/react-query';
import { fromZonedTime } from 'date-fns-tz';
import { useMemo } from 'react';
import { useLocation } from './use-location';

export function useForecast() {
  const { location } = useLocation();

  const dateRange = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timezone = location?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const startDate = fromZonedTime(today, timezone, { timeZone: 'UTC' });
    const tomorrow = new Date(today.getTime());
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endDate = fromZonedTime(tomorrow.setHours(tomorrow.getHours() - 1), timezone, {
      timeZone: 'UTC',
    });
    return [startDate, endDate] as const;
  }, [location?.timezone]);

  const { status, data, error } = useQuery({
    queryKey: ['forecast', location],
    queryFn: async ({ signal }) => {
      if (!location) {
        return null;
      }
      const { latitude, longitude, altitude, timezone } = location;
      const [startDate, endDate] = dateRange;
      const urlParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        ...(altitude && { altitude: altitude.toString() }),
        start_date: startDate.toISOString().slice(0, 16),
        end_date: endDate.toISOString().slice(0, 16),
      });
      const url = `/api/forecast?${urlParams.toString()}`;
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error('Failed to get forecast');
      }
      const forecast = (await response.json()) as Forecast<string>;
      const result: Forecast<Date> = {
        daily: {
          ...forecast.daily,
          time: forecast.daily.time.map(time => fromZonedTime(time, timezone)),
          sunrise: forecast.daily.sunrise.map(time => fromZonedTime(time, timezone)),
          sunset: forecast.daily.sunset.map(time => fromZonedTime(time, timezone)),
        },
        hourly: {
          ...forecast.hourly,
          time: forecast.hourly.time.map(time => fromZonedTime(time, timezone)),
        },
      };
      return result;
    },
    retry: false,
  });

  return {
    status,
    data,
    error,
  };
}
