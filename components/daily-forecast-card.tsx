import type { DailyForecast } from '@/types/forecast';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { computeForecast } from '@/lib/forecast';
import { getOutfit } from '@/lib/outfit';
import { cn } from '@/lib/utils';
import { Outfit } from './outfit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WeatherCodeIcon } from './weather-code-icon';

interface Props {
  className?: string;
  data: DailyForecast<Date>;
  isToday?: boolean;
  activeTab: string;
  onActiveTabChange: (newActiveTab: string) => void;
}

export function DailyForecastCard({
  className,
  data,
  isToday,
  activeTab,
  onActiveTabChange,
}: Props) {
  const { $t, formatDate } = useIntl();

  const computedData = useMemo(() => computeForecast(data), [data]);

  const outfit = useMemo(() => getOutfit(computedData), [computedData]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className={cn('text-center', { 'text-destructive': isToday })}>
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
        <Tabs value={activeTab} onValueChange={onActiveTabChange}>
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
