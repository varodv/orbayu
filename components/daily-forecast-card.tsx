import type { DailyForecast } from '@/types/forecast';
import type { OutfitItem } from '@/types/outfit';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { computeForecast } from '@/lib/forecast';
import { getOutfit } from '@/lib/outfit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { WeatherCodeIcon } from './weather-code-icon';

interface Props {
  className?: string;
  data: DailyForecast<Date>;
}

export function DailyForecastCard({ className, data }: Props) {
  const { $t, formatDate } = useIntl();

  const computedData = useMemo(() => computeForecast(data), [data]);

  const outfit = useMemo(() => getOutfit(computedData), [computedData]);

  const outfitData = useMemo(() => {
    const variables = Array.from(
      new Set(
        Object.values(outfit)
          .filter(Boolean)
          .flatMap((item: OutfitItem<string> | Array<OutfitItem<string>>) => item)
          .flatMap(item => item.variables),
      ),
    );
    return Object.keys(computedData).reduce<Partial<Omit<typeof computedData, 'time'>>>(
      (result, key) => {
        if (!variables.includes(key as (typeof variables)[number])) {
          delete result[key as keyof Partial<Omit<typeof computedData, 'time'>>];
        }
        return result;
      },
      { ...computedData },
    );
  }, [outfit]);

  const outfitMessages = useMemo(
    () =>
      Object.entries(outfitData).map(
        ([key, value]) => `${key} is ${value.range} (${value.value.toFixed(1)})`,
      ),
    [outfitData],
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center">
          {formatDate(computedData.time, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </CardTitle>
        <CardDescription className="flex items-center justify-center gap-1">
          <WeatherCodeIcon className="size-8" value={data.weather_code} />
          {$t({ id: `forecast.weather_code.${data.weather_code}` })}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-center">
        <div className="col-span-2">
          {outfitMessages.map(message => (
            <p key={message}>{message}</p>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <p className="uppercase">{`[ ${$t({ id: 'outfit.top' })} ]`}</p>
          {outfit.outerwear && <p>{outfit.outerwear.key}</p>}
          {outfit.midLayer && <p>{outfit.midLayer.key}</p>}
          <p>{outfit.baseLayer.key}</p>
        </div>
        <div className="flex flex-col gap-1 row-span-3">
          <p className="uppercase">{`[ ${$t({ id: 'outfit.accessories' })} ]`}</p>
          {outfit.accessories.map(item => (
            <p key={item.key}>{item.key}</p>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <p className="uppercase">{`[ ${$t({ id: 'outfit.bottom' })} ]`}</p>
          <p>{outfit.bottom.key}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="uppercase">{`[ ${$t({ id: 'outfit.footwear' })} ]`}</p>
          <p>{outfit.footwear.key}</p>
        </div>
      </CardContent>
    </Card>
  );
}
