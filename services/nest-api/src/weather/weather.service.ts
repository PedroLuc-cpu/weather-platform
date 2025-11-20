import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
  ) {}

  async create(dto: CreateWeatherDto): Promise<Weather> {
    const created = new this.weatherModel(dto);
    return created.save();
  }

  async findAll(limit = 100) {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }
}
