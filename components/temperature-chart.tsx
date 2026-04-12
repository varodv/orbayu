'use client';

import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { ForecastVariableChart } from './forecast-variable-chart';

type Props = Pick<ComponentProps<typeof ForecastVariableChart>, 'className' | 'data'>;

export function TemperatureChart({ className, data }: Props) {
  const minValue = useMemo(() => Math.min(...data.map(item => item.value)), [data]);

  const maxValue = useMemo(() => Math.max(...data.map(item => item.value)), [data]);

  const minValueIndex = useMemo(
    () => data.findIndex(item => item.value === minValue),
    [data, minValue],
  );

  const maxValueIndex = useMemo(
    () => data.findIndex(item => item.value === maxValue),
    [data, maxValue],
  );

  const domain = useMemo<[number, number]>(() => {
    const dataMin = Math.floor(minValue / 5) * 5;
    const min = Math.min(dataMin, 0);
    const dataMax = Math.ceil(maxValue / 5) * 5;
    const max = Math.max(dataMax, 0);
    return [min, max];
  }, [minValue, maxValue]);

  function getColor(item: Props['data'][number]) {
    if (item.value < -10)
      return 'blue-900';
    if (item.value < 0)
      return 'blue-700';
    if (item.value < 10)
      return 'blue-400';
    if (item.value < 18)
      return 'teal-400';
    if (item.value < 24)
      return 'green-500';
    if (item.value < 28)
      return 'yellow-400';
    if (item.value < 32)
      return 'orange-400';
    if (item.value < 38)
      return 'orange-600';
    return 'red-600';
  }

  function getLabel(item: Props['data'][number], index: number) {
    if (index === minValueIndex || index === maxValueIndex) {
      return `${Math.round(item.value)}°`;
    }
    return '';
  }

  return (
    <ForecastVariableChart
      className={className}
      data={data}
      domain={domain}
      getColor={getColor}
      getLabel={getLabel}
    />
  );
}
