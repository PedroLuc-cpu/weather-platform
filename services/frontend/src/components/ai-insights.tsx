import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Sparkles, AlertTriangle, Info, TrendingUp } from "lucide-react";

const insights = [
  {
    id: 1,
    title: "Alta chance de chuva",
    description:
      "Probabilidade de chuva aumenta significativamente após às 18h. Recomendamos levar um guarda-chuva.",
    icon: AlertTriangle,
    variant: "destructive" as const,
  },
  {
    id: 2,
    title: "Temperatura agradável",
    description:
      "A temperatura está ideal para atividades ao ar livre durante a manhã e tarde.",
    icon: Info,
    variant: "default" as const,
  },
  {
    id: 3,
    title: "Tendência de aquecimento",
    description:
      "Padrão indica aumento gradual da temperatura nos próximos dias, podendo chegar a 28°C.",
    icon: TrendingUp,
    variant: "default" as const,
  },
];

export function AIInsights() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-chart-1" />
          Insights de IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: carrossel deslizável */}
        <div className="md:hidden">
          <Carousel opts={{ align: "start" }} className="-mx-1">
            <CarouselContent className="px-1">
              {insights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <CarouselItem key={insight.id} className="basis-[88%] pl-3">
                    <Alert variant={insight.variant} className="h-full">
                      <Icon className="w-4 h-4" />
                      <AlertTitle>{insight.title}</AlertTitle>
                      <AlertDescription className="text-xs leading-relaxed">
                        {insight.description}
                      </AlertDescription>
                    </Alert>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Deslize para ver mais
          </p>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Alert key={insight.id} variant={insight.variant}>
                <Icon className="w-4 h-4" />
                <AlertTitle>{insight.title}</AlertTitle>
                <AlertDescription className="text-xs leading-relaxed">
                  {insight.description}
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
