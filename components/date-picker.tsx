import type { Forecast } from '@/types/forecast';
import { useIntl } from 'react-intl';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { WeatherCodeIcon } from './weather-code-icon';

interface Props {
  className?: string;
  data: Forecast<Date>;
  activeIndex: number;
  onActiveIndexChange: (newActiveIndex: number) => void;
}

export function DatePicker({ className, data, activeIndex, onActiveIndexChange }: Props) {
  const { formatDate, formatNumber } = useIntl();

  return (
    <Tabs
      className={className}
      value={activeIndex.toString()}
      onValueChange={value => onActiveIndexChange(Number(value))}
    >
      <TabsList className="w-full h-auto!">
        {data.daily.map((item, index) => {
          return (
            <TabsTrigger
              key={item.time.toISOString()}
              className="flex flex-col gap-0 text-xs"
              value={index.toString()}
            >
              <span
                className={cn('uppercase', {
                  'text-destructive/60': index === 0,
                  'text-destructive': index === 0 && index === activeIndex,
                })}
              >
                {formatDate(item.time, { weekday: 'short' })}
              </span>
              <WeatherCodeIcon className="size-6" value={item.weather_code} />
              <span>
                {formatNumber(item.apparent_temperature, { maximumFractionDigits: 0 })}
                º
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
