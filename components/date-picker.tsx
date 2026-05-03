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
  const { formatDate } = useIntl();

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
              className="flex flex-col gap-0 p-1"
              value={index.toString()}
            >
              <span
                className={cn('text-xs uppercase', {
                  'text-destructive/60': index === 0,
                  'text-destructive': index === 0 && index === activeIndex,
                })}
              >
                {formatDate(item.time, { weekday: 'short' })}
              </span>
              <WeatherCodeIcon className="size-6" value={item.weather_code} />
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
