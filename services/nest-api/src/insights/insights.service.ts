import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import { Weather, WeatherDocument } from '../weather/schemas/weather.schema';

@Injectable()
export class InsightsService {
  private readonly logger = new Logger(InsightsService.name);
  private cache: { data: any; at: number } | null = null;
  private readonly CACHE_TTL = 10 * 60 * 1000;

  constructor(
    @InjectModel(Weather.name) private model: Model<WeatherDocument>,
  ) {}

  async generate() {
    if (this.cache && Date.now() - this.cache.at < this.CACHE_TTL) {
      return this.cache.data;
    }

    const [total, records] = await Promise.all([
      this.model.countDocuments(),
      this.model.find().sort({ createdAt: -1 }).limit(24).lean(),
    ]);

    if (!records.length) {
      return { totalRecords: 0, insights: [], source: 'no-data' };
    }

    const summary = records.map((r) => ({
      time: r.createdAt,
      temp: r.current?.temperature,
      wind: r.current?.windspeed,
      code: r.current?.weathercode,
      humidity: r.raw?.hourly?.relativehumidity_2m?.[0],
    }));

    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        totalRecords: total,
        insights: this.fallback(summary),
        source: 'rule-based',
      };
    }

    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const msg = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Analise os dados climáticos abaixo e retorne SOMENTE um JSON válido com 3 insights em português:
{"insights":[{"title":"...","description":"...","type":"alert|info|trend"}]}

Dados (últimas ${records.length} medições): ${JSON.stringify(summary)}

Regras: description máx 80 chars, type deve ser "alert" (risco), "info" (dados) ou "trend" (tendência).`,
          },
        ],
      });

      const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : {};
      const result = {
        totalRecords: total,
        insights: parsed.insights ?? [],
        source: 'claude',
      };
      this.cache = { data: result, at: Date.now() };
      return result;
    } catch (err: any) {
      this.logger.warn('Claude API error: %s', err?.message);
      return {
        totalRecords: total,
        insights: this.fallback(summary),
        source: 'rule-based',
      };
    }
  }

  private fallback(summary: any[]) {
    const insights: any[] = [];
    const latest = summary[0];
    const oldest = summary[summary.length - 1];

    if (latest?.temp != null && oldest?.temp != null) {
      const delta = latest.temp - oldest.temp;
      if (Math.abs(delta) >= 1.5) {
        insights.push({
          title: delta > 0 ? 'Temperatura em alta' : 'Temperatura em queda',
          description: `Variação de ${Math.abs(delta).toFixed(1)}°C nas últimas ${summary.length} medições.`,
          type: 'trend',
        });
      }
    }

    if (latest?.humidity != null) {
      insights.push({
        title: latest.humidity > 80 ? 'Umidade elevada' : 'Umidade normal',
        description: `Umidade em ${latest.humidity}% — ${latest.humidity > 80 ? 'possibilidade de chuva' : 'condições confortáveis'}.`,
        type: latest.humidity > 80 ? 'alert' : 'info',
      });
    }

    if (latest?.temp != null) {
      insights.push({
        title: 'Temperatura atual',
        description: `${latest.temp}°C registrados na última medição.`,
        type: 'info',
      });
    }

    return insights;
  }
}
