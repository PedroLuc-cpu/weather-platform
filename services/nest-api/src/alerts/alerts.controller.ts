import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll(@Query('resolved') resolved?: string) {
    return this.alertsService.findAll(resolved);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.alertsService.resolve(id);
  }
}
