import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WeatherModule } from './weather/weather.module';
import { InsightsModule } from './insights/insights.module';
import { AlertsModule } from './alerts/alerts.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://mongodb:27017/weatherdb',
    ),
    EventEmitterModule.forRoot(),
    WeatherModule,
    InsightsModule,
    AlertsModule,
    MetricsModule,
  ],
})
export class AppModule {}
