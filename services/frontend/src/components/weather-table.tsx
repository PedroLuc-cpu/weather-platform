"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sun, Cloud, CloudRain } from "lucide-react";

const weatherData = [
  {
    id: 1,
    datetime: "20/11/2025 08:00",
    location: "São Paulo, BR",
    condition: "Ensolarado",
    temperature: 22,
    humidity: 60,
    icon: Sun,
  },
  {
    id: 2,
    datetime: "20/11/2025 10:00",
    location: "São Paulo, BR",
    condition: "Parcialmente nublado",
    temperature: 24,
    humidity: 62,
    icon: Cloud,
  },
  {
    id: 3,
    datetime: "20/11/2025 12:00",
    location: "São Paulo, BR",
    condition: "Nublado",
    temperature: 25,
    humidity: 65,
    icon: Cloud,
  },
  {
    id: 4,
    datetime: "20/11/2025 14:00",
    location: "São Paulo, BR",
    condition: "Chuvoso",
    temperature: 23,
    humidity: 75,
    icon: CloudRain,
  },
  {
    id: 5,
    datetime: "20/11/2025 16:00",
    location: "São Paulo, BR",
    condition: "Chuvoso",
    temperature: 21,
    humidity: 80,
    icon: CloudRain,
  },
];

export function WeatherTable() {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Data/Hora</TableHead>
            <TableHead className="text-xs">Local</TableHead>
            <TableHead className="text-xs">Condição</TableHead>
            <TableHead className="text-xs text-right">Temperatura</TableHead>
            <TableHead className="text-xs text-right">Umidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weatherData.map((record) => {
            const Icon = record.icon;
            return (
              <TableRow key={record.id}>
                <TableCell className="text-xs font-mono">
                  {record.datetime}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {record.location}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1 w-fit"
                  >
                    <Icon className="w-3 h-3" />
                    {record.condition}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-right font-medium">
                  {record.temperature}°C
                </TableCell>
                <TableCell className="text-xs text-right text-muted-foreground">
                  {record.humidity}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
