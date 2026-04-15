'use client';

import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { LocationPicker } from '@/components/location-picker';
import { TemperatureCard } from '@/components/temperature-card';
import { useForecast } from '@/hooks/use-forecast';
import { useLocation } from '@/hooks/use-location';

export default function Home() {
  const { location, setLocation } = useLocation();

  const { status, data, error } = useForecast();

  const temperatureData = useMemo<
    ComponentProps<typeof TemperatureCard>['data'] | undefined
  >(() => {
    if (!data) {
      return undefined;
    }
    return {
      daily: {
        temperature: data.daily.temperature[0],
        apparent_temperature: data.daily.apparent_temperature[0],
      },
      hourly: data.hourly.time.reduce<ComponentProps<typeof TemperatureCard>['data']['hourly']>(
        (result, time, index) => ({
          temperature: [
            ...result.temperature,
            {
              time,
              value: data.hourly.temperature[index],
            },
          ],
          apparent_temperature: [
            ...result.apparent_temperature,
            {
              time,
              value: data.hourly.apparent_temperature[index],
            },
          ],
        }),
        {
          temperature: [],
          apparent_temperature: [],
        },
      ),
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <LocationPicker className="self-center" value={location} onChange={setLocation} />
      {status === 'pending' && <p className="text-center">Loading...</p>}
      {status === 'error' && (
        <p className="text-destructive text-center">{error?.message || 'Failed to get forecast'}</p>
      )}
      {status === 'success'
        && (!temperatureData
          ? (
              <p className="text-center">No forecast data</p>
            )
          : (
              <TemperatureCard data={temperatureData} />
            ))}
    </div>
  );
}
