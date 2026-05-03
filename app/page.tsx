'use client';

import type { CarouselApi } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { DailyForecastCard } from '@/components/daily-forecast-card';
import { DatePicker } from '@/components/date-picker';
import { LocationPicker } from '@/components/location-picker';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useForecast } from '@/hooks/use-forecast';
import { useLocation } from '@/hooks/use-location';

export default function Home() {
  const { location, setLocation } = useLocation();

  const { status, data, error } = useForecast();

  const [api, setApi] = useState<CarouselApi>();

  const [activeIndex, setActiveIndex] = useState(0);

  const [activeTab, setActiveTab] = useState('outfit');

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    setActiveIndex(0);
  }, [data]);

  return (
    <div className="flex flex-col gap-4 flex-1">
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
              <>
                <DatePicker
                  data={data}
                  activeIndex={activeIndex}
                  onActiveIndexChange={(newActiveIndex) => {
                    setActiveIndex(newActiveIndex);
                    api?.scrollTo(newActiveIndex);
                  }}
                />
                <Carousel className="flex flex-1" setApi={setApi}>
                  <CarouselContent>
                    {data.daily.map((item, index) => (
                      <CarouselItem key={item.time.toISOString()}>
                        <DailyForecastCard
                          className="h-full"
                          data={item}
                          isToday={index === 0}
                          activeTab={activeTab}
                          onActiveTabChange={setActiveTab}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </>
            ))}
    </div>
  );
}
