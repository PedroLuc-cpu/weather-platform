"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data12h = [
  { time: "00:00", temp: 18 },
  { time: "02:00", temp: 17 },
  { time: "04:00", temp: 16 },
  { time: "06:00", temp: 17 },
  { time: "08:00", temp: 20 },
  { time: "10:00", temp: 22 },
  { time: "12:00", temp: 24 },
  { time: "14:00", temp: 26 },
  { time: "16:00", temp: 25 },
  { time: "18:00", temp: 23 },
  { time: "20:00", temp: 21 },
  { time: "22:00", temp: 19 },
];

const data24h = [
  { time: "00:00", temp: 16 },
  { time: "03:00", temp: 15 },
  { time: "06:00", temp: 16 },
  { time: "09:00", temp: 20 },
  { time: "12:00", temp: 24 },
  { time: "15:00", temp: 26 },
  { time: "18:00", temp: 23 },
  { time: "21:00", temp: 19 },
];

interface WeatherChartProps {
  timeRange: string;
}

export function WeatherChart({ timeRange }: WeatherChartProps) {
  const data = timeRange === "12h" ? data12h : data24h;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}°`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                  <div className="grid gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        {payload[0].payload.time}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {payload[0].value}°C
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
