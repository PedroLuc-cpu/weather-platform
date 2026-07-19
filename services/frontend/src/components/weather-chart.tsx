import { Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  temp: {
    label: "Temperatura",
    color: "hsl(var(--chart-1))",
  },
};

interface WeatherChartProps {
  data: { time: string; temp: number }[];
}

export function WeatherChart({ data }: WeatherChartProps) {
  if (!data.length) {
    return (
      <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">
        Sem dados disponíveis. Aguardando coleta...
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <LineChart data={data}>
        <XAxis
          dataKey="time"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
        />
        <YAxis
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}°`}
          width={32}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [`${value}°C`, "Temperatura"]}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="var(--color-temp)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
