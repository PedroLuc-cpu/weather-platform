"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertTriangle, Info, TrendingUp } from "lucide-react";

const insights = [
  {
    id: 1,
    type: "alert",
    title: "Alta chance de chuva",
    description:
      "Probabilidade de chuva aumenta significativamente após às 18h. Recomendamos levar um guarda-chuva.",
    icon: AlertTriangle,
    variant: "destructive" as const,
  },
  {
    id: 2,
    type: "info",
    title: "Temperatura agradável",
    description:
      "A temperatura está ideal para atividades ao ar livre durante a manhã e tarde.",
    icon: Info,
    variant: "default" as const,
  },
  {
    id: 3,
    type: "trend",
    title: "Tendência de aquecimento",
    description:
      "Padrão indica aumento gradual da temperatura nos próximos dias, podendo chegar a 28°C.",
    icon: TrendingUp,
    variant: "secondary" as const,
  },
];

export function AIInsights() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-chart-1" />
          Insights de IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className="rounded-lg border border-border p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm font-medium text-foreground leading-tight text-balance">
                      {insight.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
