import type { ComponentProps } from 'react';
import { ThermometerSnowflakeIcon, ThermometerSunIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { ForecastVariableCard } from './forecast-variable-card';
import { ForecastVariableChart } from './forecast-variable-chart';

const VARIABLES = ['temperature', 'apparent_temperature'] as const;

type Variable = (typeof VARIABLES)[number];

interface Props {
  className?: string;
  data: {
    daily: Record<Variable, number>;
    hourly: Record<Variable, ComponentProps<typeof ForecastVariableChart>['data']>;
  };
}

function getColor(value: number) {
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

function getIcon(value: number) {
  const className = `text-${getColor(value)}`;
  if (value < 18) {
    return <ThermometerSnowflakeIcon className={className} />;
  }
  return <ThermometerSunIcon className={className} />;
}

function getTitle(value: number) {
  return `${Math.round(value)}°C`;
}

export function TemperatureCard({ className, data }: Props) {
  const { $t } = useIntl();

  const [selectedVariable, setSelectedVariable] = useState<Variable>('apparent_temperature');

  const minAbsoluteTemperature = useMemo(
    () =>
      Math.min(...VARIABLES.flatMap(variable => data.hourly[variable].map(item => item.value))),
    [data],
  );

  const maxAbsoluteTemperature = useMemo(
    () =>
      Math.max(...VARIABLES.flatMap(variable => data.hourly[variable].map(item => item.value))),
    [data],
  );

  const minSelectedTemperature = useMemo(
    () => Math.min(...data.hourly[selectedVariable].map(item => item.value)),
    [data, selectedVariable],
  );

  const maxSelectedTemperature = useMemo(
    () => Math.max(...data.hourly[selectedVariable].map(item => item.value)),
    [data, selectedVariable],
  );

  const minSelectedTemperatureIndex = useMemo(
    () => data.hourly[selectedVariable].findIndex(item => item.value === minSelectedTemperature),
    [data, selectedVariable, minSelectedTemperature],
  );

  const maxSelectedTemperatureIndex = useMemo(
    () => data.hourly[selectedVariable].findIndex(item => item.value === maxSelectedTemperature),
    [data, selectedVariable, maxSelectedTemperature],
  );

  const chartDomain = useMemo<[number, number]>(() => {
    const dataMin = Math.floor(minAbsoluteTemperature / 5) * 5;
    const dataMax = Math.ceil(maxAbsoluteTemperature / 5) * 5;
    const min = Math.min(dataMin, 0);
    const max = Math.max(dataMax, 0);
    return [min, max];
  }, [minAbsoluteTemperature, maxAbsoluteTemperature]);

  function getChartLabel(
    item: ComponentProps<typeof ForecastVariableChart>['data'][number],
    index: number,
  ) {
    if (index === minSelectedTemperatureIndex || index === maxSelectedTemperatureIndex) {
      return `${Math.round(item.value)}°`;
    }
    return '';
  }

  return (
    <ForecastVariableCard
      className={className}
      variables={VARIABLES.map(variable => ({
        key: variable,
        icon: getIcon(data.daily[variable]),
        title: getTitle(data.daily[variable]),
        description: $t({ id: `forecast.${variable}` }),
      }))}
      selectedVariable={selectedVariable}
      onSelectedVariableChange={setSelectedVariable}
    >
      <ForecastVariableChart
        className="h-30 -mx-2"
        data={data.hourly[selectedVariable]}
        domain={chartDomain}
        getColor={item => getColor(item.value)}
        getLabel={getChartLabel}
      />
    </ForecastVariableCard>
  );
}
