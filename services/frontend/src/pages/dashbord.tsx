"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, Wind, Sun, Download } from "lucide-react";
import { WeatherChart } from "@/components/weather-chart";
import { RainProbabilityChart } from "@/components/rain-probability-chart";
import { WeatherTable } from "@/components/weather-table";
import { AIInsights } from "@/components/ai-insights";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("12h");

  // Mock data - replace with actual API calls
  const currentWeather = {
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: "Parcialmente nublado",
    location: "São Paulo, BR",
    lastUpdate: new Date().toLocaleTimeString("pt-BR"),
  };

  const handleExportCSV = () => {
    console.log("Exporting CSV...");
    // TODO: Implement CSV export
  };

  const handleExportXLSX = () => {
    console.log("Exporting XLSX...");
    // TODO: Implement XLSX export
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Dashboard de Clima
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Dados em tempo real com insights de IA
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                {currentWeather.location}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Atualizado {currentWeather.lastUpdate}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current Weather Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Temperatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {currentWeather.temperature}°C
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Sensação térmica: {currentWeather.temperature + 2}°C
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Umidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {currentWeather.humidity}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Nível confortável
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Velocidade do Vento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {currentWeather.windSpeed} km/h
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Direção: Sudeste
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Condição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-foreground text-balance">
                {currentWeather.condition}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Céu parcialmente coberto
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <div className="mb-8">
          <AIInsights />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Temperatura
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Variação nas últimas 12 horas
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={timeRange === "12h" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange("12h")}
                    className="text-xs h-7"
                  >
                    12h
                  </Button>
                  <Button
                    variant={timeRange === "24h" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange("24h")}
                    className="text-xs h-7"
                  >
                    24h
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <WeatherChart timeRange={timeRange} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Probabilidade de Chuva
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Previsão para as próximas horas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RainProbabilityChart />
            </CardContent>
          </Card>
        </div>

        {/* Weather Data Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Registros de Clima
                </CardTitle>
                <CardDescription className="text-xs">
                  Histórico detalhado de medições
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="text-xs h-8 bg-transparent"
                >
                  <Download className="w-3 h-3 mr-1" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportXLSX}
                  className="text-xs h-8 bg-transparent"
                >
                  <Download className="w-3 h-3 mr-1" />
                  XLSX
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <WeatherTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
