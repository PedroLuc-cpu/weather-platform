// src/weather/weather.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  async create(@Body() dto: CreateWeatherDto) {
    return this.weatherService.create(dto);
  }

  @Get()
  async list(@Query('limit') limit?: string) {
    let l = 100;
    if (limit) {
      const ltmp = parseInt(limit);
      if (!isNaN(ltmp)) {
        l = ltmp;
      }
    }
    return this.weatherService.findAll(l);
  }
}
