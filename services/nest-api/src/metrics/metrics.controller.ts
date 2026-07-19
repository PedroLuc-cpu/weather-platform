import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { register, collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics({ prefix: 'weather_' });

@Controller('metrics')
export class MetricsController {
  @Get()
  async metrics(@Res() res: Response) {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  }
}
