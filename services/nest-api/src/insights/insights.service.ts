import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from '../weather/schemas/weather.schema';

@Injectable()
export class InsightsService {
  constructor(
    @InjectModel(Weather.name) private model: Model<WeatherDocument>,
  ) {}

  async generate() {
    const total = await this.model.countDocuments();
    const last = await this.model.findOne().sort({ createdAt: -1 }).lean();

    return {
      totalRecords: total,
      lastTemperature: last?.current?.temperature,
      mostCommonSource: 'open-meteo', // mock, pode melhorar
    };
  }
}
