import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { Weather, WeatherSchema } from './schemas/weather.schema';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    AlertsModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService, MongooseModule],
})
export class WeatherModule {}
