'use client';

import { DailyForecastCard } from '@/components/daily-forecast-card';
import { LocationPicker } from '@/components/location-picker';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
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
              <Carousel>
                <CarouselContent>
                  {data.daily.map(item => (
                    <CarouselItem key={item.time.toISOString()}>
                      <DailyForecastCard data={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ))}
    </div>
  );
}
