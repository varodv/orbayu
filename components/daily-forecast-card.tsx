import type { DailyForecast } from '@/types/forecast';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { computeForecast } from '@/lib/forecast';
import { getOutfit } from '@/lib/outfit';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  className?: string;
  data: DailyForecast<Date>;
}

export function DailyForecastCard({ className, data }: Props) {
  const { $t, formatDate } = useIntl();

  const computedData = useMemo(() => {
    return computeForecast(data);
  }, [data]);

  const outfit = useMemo(() => {
    return getOutfit(computedData);
  }, [computedData]);

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
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-center">
        <div className="flex flex-col gap-1">
          <p className="uppercase">
            [
            {' '}
            {$t({ id: 'outfit.top' })}
            {' '}
            ]
          </p>
          {outfit.outerwear && <p>{outfit.outerwear}</p>}
          {outfit.midLayer && <p>{outfit.midLayer}</p>}
          <p>{outfit.baseLayer}</p>
        </div>
        <div className="flex flex-col gap-1 row-span-3">
          <p className="uppercase">
            [
            {' '}
            {$t({ id: 'outfit.accessories' })}
            {' '}
            ]
          </p>
          {outfit.accessories.map(item => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <p className="uppercase">
            [
            {' '}
            {$t({ id: 'outfit.bottom' })}
            {' '}
            ]
          </p>
          <p>{outfit.bottom}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="uppercase">
            [
            {' '}
            {$t({ id: 'outfit.footwear' })}
            {' '}
            ]
          </p>
          <p>{outfit.footwear}</p>
        </div>
      </CardContent>
    </Card>
  );
}
