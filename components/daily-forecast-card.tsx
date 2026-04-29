import type { DailyForecast } from '@/types/forecast';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { computeForecast } from '@/lib/forecast';
import { getOutfit } from '@/lib/outfit';
import { Outfit } from './outfit';
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
          <TabsContent value="outfit">
            <Outfit value={outfit} />
          </TabsContent>
          <TabsContent value="data">
            <pre className="text-xs">{JSON.stringify(computedData, null, 2)}</pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
