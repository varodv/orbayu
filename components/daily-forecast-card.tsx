import type { DailyForecast } from '@/types/forecast';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { computeForecast } from '@/lib/forecast';
import { getOutfit } from '@/lib/outfit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WeatherCodeIcon } from './weather-code-icon';

interface Props {
  className?: string;
  data: DailyForecast<Date>;
  activeTab: string;
  onActiveTabChange: (activeTab: string) => void;
}

export function DailyForecastCard({ className, data, activeTab, onActiveTabChange }: Props) {
  const { $t, formatDate } = useIntl();

  const computedData = useMemo(() => computeForecast(data), [data]);

  const outfit = useMemo(() => getOutfit(computedData), [computedData]);

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
      <CardContent>
        <Tabs className="gap-4" value={activeTab} onValueChange={onActiveTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="outfit">{$t({ id: 'outfit.title' })}</TabsTrigger>
            <TabsTrigger value="data">{$t({ id: 'forecast.title' })}</TabsTrigger>
          </TabsList>
          <TabsContent className="grid grid-cols-2 gap-4 text-center" value="outfit">
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
          </TabsContent>
          <TabsContent value="data">
            <pre className="text-xs">{JSON.stringify(computedData, null, 2)}</pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
