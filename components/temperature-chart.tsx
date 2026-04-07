'use client';

import { useId, useMemo } from 'react';
import { Bar, BarChart, Rectangle, XAxis, YAxis } from 'recharts';
import { useNow } from '@/hooks/use-now';
import { ChartContainer } from './ui/chart';

interface Props {
  className?: string;
  data: Array<{
    time: Date;
    temperature: number;
  }>;
}

function getTemperatureColor(value: number) {
  if (value < -10)
    return 'blue-900';
  if (value < 0)
    return 'blue-700';
  if (value < 10)
    return 'blue-400';
  if (value < 18)
    return 'teal-400';
  if (value < 24)
    return 'green-500';
  if (value < 28)
    return 'yellow-400';
  if (value < 32)
    return 'orange-400';
  if (value < 38)
    return 'orange-600';
  return 'red-600';
}

export function TemperatureChart({ className, data }: Props) {
  const id = useId();

  const now = useNow();

  const minTemperature = useMemo(() => Math.min(...data.map(item => item.temperature)), [data]);

  const maxTemperature = useMemo(() => Math.max(...data.map(item => item.temperature)), [data]);

  const domain = useMemo(() => {
    const dataMin = Math.floor(minTemperature / 5) * 5;
    const min = Math.min(dataMin, 0);
    const dataMax = Math.ceil(maxTemperature / 5) * 5;
    const max = Math.max(dataMax, 0);
    return [min, max];
  }, [minTemperature, maxTemperature]);

  return (
    <ChartContainer className={className} config={{}}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 4, bottom: 0, left: 4 }}
        barCategoryGap={0.5}
      >
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tickFormatter={(_, index) => {
            if (index % 3 === 0) {
              return index.toString();
            }
            return '';
          }}
        />
        <YAxis domain={domain} hide />
        <Bar
          dataKey="temperature"
          radius={[4, 4, 0, 0]}
          shape={(barProps) => {
            const item = data[barProps.index];
            if (!item) {
              return;
            }

            const color = `var(--color-${getTemperatureColor(item.temperature)})`;
            const fillGradientId = `gradient-fill-${item.time.toISOString()}-${id}`;
            const fillGradientOffset
              = ((now.getTime() - item.time.getTime()) / (1000 * 60 * 60)) * 100;
            const minTemperatureIndex = data.findIndex(
              item => item.temperature === minTemperature,
            );
            const maxTemperatureIndex = data.findIndex(
              item => item.temperature === maxTemperature,
            );
            return (
              <g>
                <defs>
                  <linearGradient id={fillGradientId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset={`${fillGradientOffset}%`} stopColor={color} stopOpacity={0.5} />
                    <stop offset={`${fillGradientOffset}%`} stopColor={color} stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Rectangle {...barProps} fill={`url(#${fillGradientId})`} />
                {(barProps.index === minTemperatureIndex
                  || barProps.index === maxTemperatureIndex) && (
                  <text
                    x={barProps.x + barProps.width / 2}
                    y={item.temperature > 0 ? barProps.y - 8 : barProps.y + barProps.height - 8}
                    textAnchor="middle"
                    fontSize={12}
                  >
                    {Math.round(item.temperature)}
                    °
                  </text>
                )}
              </g>
            );
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
