import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  Download,
  Moon,
  CloudRain,
  Thermometer,
} from "lucide-react";
import { WeatherChart } from "@/components/weather-chart";
import { RainProbabilityChart } from "@/components/rain-probability-chart";
import { WeatherTable } from "@/components/weather-table";
import { AIInsights } from "@/components/ai-insights";
import api from "@/services/api/config";
import { downloadCsv } from "@/utils/export";

type WeatherRecord = {
  _id: string;
  source: string;
  latitude: number;
  longitude: number;
  current: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  raw: {
    hourly?: {
      rain?: number[];
      time?: string[];
      relativehumidity_2m?: number[];
    };
  };
  createdAt: string;
};

function getCondition(code: number) {
  if (code === 0) return { label: "Ensolarado", Icon: Sun };
  if (code <= 3) return { label: "Parcialmente nublado", Icon: Cloud };
  if (code <= 48) return { label: "Nevoeiro", Icon: Cloud };
  if (code <= 67) return { label: "Chuvoso", Icon: CloudRain };
  if (code <= 82) return { label: "Chuva", Icon: CloudRain };
  return { label: "Tempestade", Icon: CloudRain };
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("12h");
  const { theme, setTheme } = useTheme();

  const { data: records, isLoading } = useQuery<WeatherRecord[]>({
    queryKey: ["weather"],
    queryFn: async () => {
      const { data } = await api.get<WeatherRecord[]>("/weather?limit=50");
      return data;
    },
    refetchInterval: 60_000,
  });

  const latest = records?.[0];
  const limit = timeRange === "12h" ? 12 : 24;

  const chartData =
    records
      ?.slice(0, limit)
      .reverse()
      .map((r) => ({
        time: new Date(r.createdAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temp: r.current?.temperature ?? 0,
      })) ?? [];

  const rainData = (() => {
    const hourlyRain = latest?.raw?.hourly?.rain;
    const hourlyTime = latest?.raw?.hourly?.time;
    if (!hourlyRain || !hourlyTime) return [];
    return hourlyTime.slice(0, 8).map((t, i) => ({
      time: new Date(t).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      probability: Math.min(100, Math.round((hourlyRain[i] ?? 0) * 100)),
    }));
  })();

  const temperature = latest?.current?.temperature;
  const windspeed = latest?.current?.windspeed;
  const weathercode = latest?.current?.weathercode ?? 0;
  const humidity = latest?.raw?.hourly?.relativehumidity_2m?.[0] ?? null;
  const { label: conditionLabel, Icon: ConditionIcon } = getCondition(weathercode);

  const location =
    latest != null
      ? `${latest.latitude?.toFixed(2)}°, ${latest.longitude?.toFixed(2)}°`
      : "São Paulo, BR";

  const lastUpdate =
    latest != null
      ? new Date(latest.createdAt).toLocaleTimeString("pt-BR")
      : "--:--";

  const handleExportCSV = () => {
    if (!records?.length) return;
    const rows = [
      ["Data/Hora", "Temperatura (°C)", "Vento (km/h)", "Condição"],
      ...records.map((r) => [
        new Date(r.createdAt).toLocaleString("pt-BR"),
        r.current?.temperature ?? "",
        r.current?.windspeed ?? "",
        getCondition(r.current?.weathercode ?? 0).label,
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadCsv(blob, "clima.csv");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-5 h-5 text-chart-1 shrink-0" />
              <div>
                <h1 className="text-base font-semibold text-foreground leading-tight">
                  Dashboard de Clima
                </h1>
                <p className="text-xs text-muted-foreground">
                  <span className="hidden sm:inline">
                    Dados em tempo real com insights de IA
                  </span>
                  <span className="sm:hidden">
                    Atualizado {lastUpdate}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs hidden sm:flex">
                {location}
              </Badge>
              <Badge variant="secondary" className="text-xs hidden sm:flex">
                Atualizado {lastUpdate}
              </Badge>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 relative"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Alternar tema</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Alternar tema</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-default">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Thermometer className="w-3.5 h-3.5" />
                    Temperatura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-20 mb-1" />
                      <Skeleton className="h-3 w-28" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-semibold tabular-nums">
                        {temperature != null ? `${temperature}°C` : "--"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sensação:{" "}
                        {temperature != null ? `${temperature + 2}°C` : "--"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Temperatura atual do ar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-default">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5" />
                    Umidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-1.5 w-full" />
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-semibold tabular-nums">
                        {humidity != null ? `${humidity}%` : "--"}
                      </div>
                      <Progress
                        value={humidity ?? 0}
                        className="h-1.5 mt-2"
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Umidade relativa do ar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-default">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5" />
                    Vento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-2" />
                      <Skeleton className="h-1.5 w-full" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-semibold tabular-nums">
                        {windspeed != null ? windspeed : "--"}
                        <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">
                          km/h
                        </span>
                      </div>
                      <Progress
                        value={
                          windspeed != null ? Math.min(windspeed, 100) : 0
                        }
                        className="h-1.5 mt-2"
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Velocidade do vento</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-default">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <ConditionIcon className="w-3.5 h-3.5" />
                    Condição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-7 w-36 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </>
                  ) : (
                    <>
                      <div className="text-base sm:text-lg font-semibold leading-tight">
                        {conditionLabel}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cód. WMO {weathercode}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>Condição meteorológica atual</TooltipContent>
          </Tooltip>
        </div>

        {/* AI Insights */}
        <AIInsights />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Temperatura
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Variação nas últimas{" "}
                    {timeRange === "12h" ? "12" : "24"} medições
                  </CardDescription>
                </div>
                <Tabs value={timeRange} onValueChange={setTimeRange}>
                  <TabsList className="h-7">
                    <TabsTrigger value="12h" className="text-xs px-2.5">
                      12h
                    </TabsTrigger>
                    <TabsTrigger value="24h" className="text-xs px-2.5">
                      24h
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[240px] w-full" />
              ) : (
                <WeatherChart data={chartData} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Probabilidade de Chuva
              </CardTitle>
              <CardDescription className="text-xs">
                Previsão para as próximas horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[240px] w-full" />
              ) : (
                <RainProbabilityChart data={rainData} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Registros de Clima
                </CardTitle>
                <CardDescription className="text-xs">
                  {records?.length ?? 0} registros coletados
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    disabled={!records?.length}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportCSV}>
                    Exportar CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <WeatherTable records={records} isLoading={isLoading} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
