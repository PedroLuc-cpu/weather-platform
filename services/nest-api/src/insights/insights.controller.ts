import { Controller, Get } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('weather')
export class InsightsController {
  constructor(private readonly insights: InsightsService) {}

  @Get('insights')
  async generateInsights() {
    return this.insights.generate();
  }
}
