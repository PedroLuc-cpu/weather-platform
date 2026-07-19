import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  create(@Body() dto: CreateWeatherDto) {
    return this.weatherService.create(dto);
  }

  @Get('stats')
  stats() {
    return this.weatherService.getStats();
  }

  @Get('stream')
  stream(@Res() res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const send = (data: object) =>
      res.write(`data: ${JSON.stringify(data)}\n\n`);

    send({ type: 'connected' });

    const handler = (payload: any) => send(payload);
    this.eventEmitter.on('weather.created', handler);

    const heartbeat = setInterval(() => send({ type: 'ping' }), 20_000);

    res.on('close', () => {
      this.eventEmitter.off('weather.created', handler);
      clearInterval(heartbeat);
    });
  }

  @Get()
  list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.weatherService.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      from,
      to,
    });
  }
}
