import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from 'recharts';
import { ChartContainer } from './ui/chart';

interface Props {
  className?: string;
  data: Array<{
    time: Date;
    value: number;
  }>;
  domain?: [number, number];
  getColor: (item: Props['data'][number], index: number) => string;
  getLabel: (item: Props['data'][number], index: number) => string;
}

export function ForecastVariableChart({ className, data, domain, getColor, getLabel }: Props) {
  return (
    <ChartContainer className={className} config={{}}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 8, bottom: 0, left: 8 }}
        barCategoryGap={0.5}
        accessibilityLayer
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value: Date, index) => {
            if (index % 3 === 0) {
              return value.getHours().toString();
            }
            return '';
          }}
        />
        <YAxis domain={domain} hide />
        <Bar
          dataKey="value"
          radius={[4, 4, 0, 0]}
          shape={(barProps) => {
            const item = data[barProps.index];
            if (!item) {
              return;
            }

            const label = getLabel(item, barProps.index);
            return (
              <g>
                <Rectangle {...barProps} fill={`var(--color-${getColor(item, barProps.index)})`} />
                {label && (
                  <text
                    x={barProps.x + barProps.width / 2}
                    y={item.value > 0 ? barProps.y - 8 : barProps.y + barProps.height - 8}
                    fontSize={12}
                    textAnchor="middle"
                  >
                    {label}
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
