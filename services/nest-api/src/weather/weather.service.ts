import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Counter } from 'prom-client';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { AlertsService } from '../alerts/alerts.service';

const weatherCreatedCounter = new Counter({
  name: 'weather_records_created_total',
  help: 'Total de registros climáticos criados',
});

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
    private readonly eventEmitter: EventEmitter2,
    private readonly alertsService: AlertsService,
  ) {}

  async create(dto: CreateWeatherDto): Promise<Weather> {
    const created = new this.weatherModel(dto);
    const saved = await created.save();
    const record = (saved as any).toObject();
    const alerts = await this.alertsService.checkAndCreate(record);
    this.eventEmitter.emit('weather.created', { record, alerts });
    weatherCreatedCounter.inc();
    return saved;
  }

  async findAll(opts: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
  }) {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
    const filter: Record<string, any> = {};

    if (opts.from || opts.to) {
      filter.createdAt = {};
      if (opts.from) filter.createdAt.$gte = new Date(opts.from);
      if (opts.to) filter.createdAt.$lte = new Date(opts.to);
    }

    const [data, total] = await Promise.all([
      this.weatherModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.weatherModel.countDocuments(filter),
    ]);

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getStats() {
    const result = await this.weatherModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          avgTemp: { $avg: '$current.temperature' },
          minTemp: { $min: '$current.temperature' },
          maxTemp: { $max: '$current.temperature' },
          avgWind: { $avg: '$current.windspeed' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);

    return result.map((r) => ({
      date: r._id,
      temperature: {
        avg: +(r.avgTemp?.toFixed(1) ?? 0),
        min: r.minTemp ?? 0,
        max: r.maxTemp ?? 0,
      },
      wind: { avg: +(r.avgWind?.toFixed(1) ?? 0) },
      count: r.count,
    }));
  }

  async findRecent(limit = 24) {
    return this.weatherModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }
}
