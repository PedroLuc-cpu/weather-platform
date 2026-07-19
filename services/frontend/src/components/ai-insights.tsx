import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Sparkles, AlertTriangle, Info, TrendingUp } from "lucide-react";
import api from "@/services/api/config";

type InsightType = "alert" | "info" | "trend";

type Insight = {
  title: string;
  description: string;
  type: InsightType;
};

type InsightsResponse = {
  totalRecords: number;
  insights: Insight[];
  source: "claude" | "rule-based" | "no-data";
};

function InsightIcon({ type }: { type: InsightType }) {
  if (type === "alert") return <AlertTriangle className="w-4 h-4" />;
  if (type === "trend") return <TrendingUp className="w-4 h-4" />;
  return <Info className="w-4 h-4" />;
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Alert variant={insight.type === "alert" ? "destructive" : "default"} className="h-full">
      <InsightIcon type={insight.type} />
      <AlertTitle className="text-sm">{insight.title}</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed">
        {insight.description}
      </AlertDescription>
    </Alert>
  );
}

export function AIInsights() {
  const { data, isLoading } = useQuery<InsightsResponse>({
    queryKey: ["insights"],
    queryFn: async () => {
      const { data } = await api.get<InsightsResponse>("/weather/insights");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  const sourceLabel =
    data?.source === "claude"
      ? "Claude AI"
      : data?.source === "rule-based"
        ? "Análise local"
        : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 flex-wrap">
          <Sparkles className="w-4 h-4 text-chart-1 shrink-0" />
          Insights de IA
          {sourceLabel && (
            <Badge variant="outline" className="text-xs font-normal">
              {sourceLabel}
            </Badge>
          )}
          {data?.totalRecords != null && (
            <span className="text-xs font-normal text-muted-foreground ml-auto">
              {data.totalRecords} registros
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <div className="md:hidden space-y-2">
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="hidden md:grid md:grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </>
        ) : !data?.insights?.length ? (
          <p className="text-sm text-muted-foreground py-2">
            Aguardando dados suficientes para gerar insights...
          </p>
        ) : (
          <>
            {/* Mobile: swipeable carousel */}
            <div className="md:hidden">
              <Carousel opts={{ align: "start" }} className="-mx-1">
                <CarouselContent className="px-1">
                  {data.insights.map((insight, i) => (
                    <CarouselItem key={i} className="basis-[88%] pl-3">
                      <InsightCard insight={insight} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Deslize para ver mais
              </p>
            </div>

            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-3">
              {data.insights.map((insight, i) => (
                <InsightCard key={i} insight={insight} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
