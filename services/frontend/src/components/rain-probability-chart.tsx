import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  probability: {
    label: "Chuva",
    color: "hsl(var(--chart-2))",
  },
};

const fallbackData = [
  { time: "12:00", probability: 15 },
  { time: "14:00", probability: 25 },
  { time: "16:00", probability: 45 },
  { time: "18:00", probability: 65 },
  { time: "20:00", probability: 75 },
  { time: "22:00", probability: 60 },
  { time: "00:00", probability: 40 },
  { time: "02:00", probability: 25 },
];

interface RainProbabilityChartProps {
  data: { time: string; probability: number }[];
}

export function RainProbabilityChart({ data }: RainProbabilityChartProps) {
  const chartData = data.length ? data : fallbackData;

  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-probability)"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="var(--color-probability)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
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
          tickFormatter={(v) => `${v}%`}
          width={32}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [`${value}%`, "Probabilidade"]}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="probability"
          stroke="var(--color-probability)"
          fill="url(#rainGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
