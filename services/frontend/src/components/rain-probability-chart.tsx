"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { time: "12:00", probability: 15 },
  { time: "14:00", probability: 25 },
  { time: "16:00", probability: 45 },
  { time: "18:00", probability: 65 },
  { time: "20:00", probability: 75 },
  { time: "22:00", probability: 60 },
  { time: "00:00", probability: 40 },
  { time: "02:00", probability: 25 },
];

export function RainProbabilityChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
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
          tickFormatter={(value) => `${value}%`}
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
                        {payload[0].value}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="probability"
          stroke="hsl(var(--chart-2))"
          fill="url(#rainGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
