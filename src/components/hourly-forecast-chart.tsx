'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import type { HourlyForecast } from '@/lib/types';
import { useSettings } from '@/hooks/use-settings';
import { convertTemperature } from '@/lib/utils';
import { ChartTooltip, ChartTooltipContent, ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { useTheme } from 'next-themes';

interface HourlyForecastChartProps {
  hourlyData: HourlyForecast[];
}

const chartConfig = {
  temperature: {
    label: 'Temp.',
    color: 'hsl(var(--primary))',
  },
  precipitation: {
    label: 'Precip.',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;


const HourlyForecastChart = ({ hourlyData }: HourlyForecastChartProps) => {
  const { unit } = useSettings();
  const { resolvedTheme } = useTheme();

  const data = hourlyData.slice(0, 24).map(item => ({
    time: item.time,
    temperature: convertTemperature(item.temperature, unit),
    precipitation: item.precipitation,
  }));

  return (
    <div className="h-64 w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value, index) => index % 3 === 0 ? value : ''}
          />
          <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" hide />
          <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
                labelFormatter={(label) => `${label}`}
                formatter={(value, name) => (
                    <div className="flex flex-col">
                        <span>{value}{name === 'temperature' ? `°${unit}` : '%'}</span>
                    </div>
                )}
            />}
          />
          <Bar yAxisId="right" dataKey="precipitation" fill="hsl(var(--accent))" radius={4} barSize={10} name="Precipitation" />
          <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Temperature" />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
};

export default HourlyForecastChart;
