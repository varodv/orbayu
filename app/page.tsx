'use client';

import { LocationPicker } from '@/components/location-picker';
import { TemperatureCard } from '@/components/temperature-card';
import { useForecast } from '@/hooks/use-forecast';
import { useLocation } from '@/hooks/use-location';

export default function Home() {
  const { location, setLocation } = useLocation();

  const { status, data, error } = useForecast();

  return (
    <div className="flex flex-col gap-4">
      <LocationPicker className="self-center" value={location} onChange={setLocation} />
      {status === 'pending' && <p className="text-center">Loading...</p>}
      {status === 'error' && (
        <p className="text-destructive text-center">{error?.message || 'Failed to get forecast'}</p>
      )}
      {status === 'success'
        && (!data?.daily.length
          ? (
              <p className="text-center">No forecast data</p>
            )
          : (
              <TemperatureCard data={data.daily[0]} />
            ))}
    </div>
  );
}
