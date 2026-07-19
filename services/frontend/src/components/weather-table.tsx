import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Cloud, CloudRain } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type WeatherRecord = {
  _id: string;
  current: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  latitude: number;
  longitude: number;
  location_name?: string;
  createdAt: string;
};

function getCondition(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: "Ensolarado", Icon: Sun };
  if (code <= 3) return { label: "Parc. nublado", Icon: Cloud };
  if (code <= 48) return { label: "Nevoeiro", Icon: Cloud };
  if (code <= 67) return { label: "Chuvoso", Icon: CloudRain };
  if (code <= 82) return { label: "Chuva", Icon: CloudRain };
  return { label: "Tempestade", Icon: CloudRain };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    full: d.toLocaleString("pt-BR"),
    short: d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

interface WeatherTableProps {
  records?: WeatherRecord[];
  isLoading?: boolean;
}

export function WeatherTable({ records, isLoading }: WeatherTableProps) {
  return (
    <ScrollArea className="h-[360px] rounded-b-xl">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className="text-xs">Data/Hora</TableHead>
            {/* oculta no mobile */}
            <TableHead className="text-xs hidden sm:table-cell">
              Localização
            </TableHead>
            <TableHead className="text-xs">Condição</TableHead>
            <TableHead className="text-xs text-right">Temp.</TableHead>
            {/* oculta no mobile */}
            <TableHead className="text-xs text-right hidden sm:table-cell">
              Vento
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24 sm:w-32" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 sm:w-28" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-10 ml-auto" />
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  <Skeleton className="h-4 w-14 ml-auto" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading &&
            records?.map((record) => {
              const { label, Icon } = getCondition(
                record.current?.weathercode ?? 0
              );
              const date = formatDate(record.createdAt);
              return (
                <TableRow key={record._id}>
                  <TableCell className="text-xs font-mono">
                    {/* data completa no desktop, curta no mobile */}
                    <span className="hidden sm:inline">{date.full}</span>
                    <span className="sm:hidden">{date.short}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                    {record.location_name ??
                      `${record.latitude?.toFixed(2)}°, ${record.longitude?.toFixed(2)}°`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center gap-1 w-fit"
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-right font-medium tabular-nums">
                    {record.current?.temperature}°C
                  </TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground tabular-nums hidden sm:table-cell">
                    {record.current?.windspeed} km/h
                  </TableCell>
                </TableRow>
              );
            })}

          {!isLoading && !records?.length && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-xs text-muted-foreground py-10"
              >
                Nenhum registro encontrado. Aguardando dados do produtor...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
