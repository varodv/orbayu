'use client';

import type { Forecast } from '@/types/forecast';
import { useQuery } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { convertToLocalDate } from '@/lib/date';
import { useLocation } from './use-location';

export function useForecast() {
  const { location } = useLocation();

  const { status, data, error } = useQuery({
    queryKey: ['forecast', location],
    queryFn: async ({ signal }) => {
      if (!location) {
        return null;
      }
      const { latitude, longitude, altitude, timezone } = location;
      const urlParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        ...(altitude && { altitude: altitude.toString() }),
        start_date: formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd'),
        end_date: formatInTimeZone(addDays(new Date(), 6), timezone, 'yyyy-MM-dd'),
        ...(timezone && { timezone }),
      });
      const url = `/api/forecast?${urlParams.toString()}`;
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error('Failed to get forecast');
      }
      const forecast = (await response.json()) as Forecast<string>;
      const result: Forecast<Date> = {
        daily: forecast.daily.map(dailyItem => ({
          ...dailyItem,
          time: convertToLocalDate(dailyItem.time, timezone),
          sunrise: convertToLocalDate(dailyItem.sunrise, timezone),
          sunset: convertToLocalDate(dailyItem.sunset, timezone),
          hourly: dailyItem.hourly.map(hourlyItem => ({
            ...hourlyItem,
            time: convertToLocalDate(hourlyItem.time, timezone),
          })),
        })),
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
