import type { PropsWithChildren, ReactNode } from 'react';
import type { DailyForecast, HourlyForecast } from '@/types/forecast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type Variable = keyof DailyForecast<Date> & keyof HourlyForecast<Date>;

interface Props<VariableType extends Variable> extends PropsWithChildren {
  className?: string;
  variables: Array<{
    key: VariableType;
    icon: ReactNode;
    title: string;
    description: string;
  }>;
  selectedVariable: VariableType;
  onSelectedVariableChange?: (newSelectedVariable: VariableType) => void;
}

export function ForecastVariableCard<VariableType extends Variable>({
  className,
  variables,
  selectedVariable,
  children,
  onSelectedVariableChange,
}: Props<VariableType>) {
  return (
    <Card className={cn('gap-0 py-0', className)}>
      <CardHeader
        className={cn('flex gap-0 px-0', variables.length > 1 && 'border-b-2 border-accent')}
      >
        {variables.map((variable, index) => (
          <button
            key={variable.key}
            className={cn(
              'flex flex-col gap-1 p-4 first:text-start',
              variables.length > 1 && 'last:text-end',
              variables.length > 1 && variable.key === selectedVariable && 'bg-muted',
            )}
            style={{ width: `${100 / variables.length}%` }}
            disabled={variables.length === 1}
            onClick={() => onSelectedVariableChange?.(variable.key)}
          >
            <CardTitle
              className={cn(
                'flex items-center gap-2 text-2xl [&>svg]:size-7',
                index > 0 && (index < variables.length - 1 ? 'justify-center' : 'justify-end'),
              )}
            >
              {variable.icon}
              {variable.title}
            </CardTitle>
            <CardDescription className="truncate">{variable.description}</CardDescription>
          </button>
        ))}
      </CardHeader>
      <CardContent className={cn('flex flex-col gap-2 p-4', variables.length === 1 && 'pt-0')}>
        {children}
      </CardContent>
    </Card>
  );
}
