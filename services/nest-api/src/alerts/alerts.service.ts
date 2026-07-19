import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert, AlertDocument } from './alert.schema';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
  ) {}

  async checkAndCreate(weather: any): Promise<any[]> {
    const toCreate: any[] = [];
    const temp = weather.current?.temperature;
    const wind = weather.current?.windspeed;
    const code = weather.current?.weathercode;
    const humidity = weather.raw?.hourly?.relativehumidity_2m?.[0];

    if (temp != null && temp > 35)
      toCreate.push({ type: 'HIGH_TEMP', message: `Temperatura elevada: ${temp}°C`, value: temp, threshold: 35 });
    if (temp != null && temp < 5)
      toCreate.push({ type: 'LOW_TEMP', message: `Temperatura baixa: ${temp}°C`, value: temp, threshold: 5 });
    if (humidity != null && humidity > 85)
      toCreate.push({ type: 'HIGH_HUMIDITY', message: `Umidade alta: ${humidity}%`, value: humidity, threshold: 85 });
    if (wind != null && wind > 50)
      toCreate.push({ type: 'STRONG_WIND', message: `Vento forte: ${wind} km/h`, value: wind, threshold: 50 });
    if (code != null && code >= 95)
      toCreate.push({ type: 'THUNDERSTORM', message: 'Tempestade detectada', value: code, threshold: 95 });

    if (toCreate.length) await this.alertModel.insertMany(toCreate);
    return toCreate;
  }

  async findAll(resolved?: string) {
    const filter: Record<string, any> = {};
    if (resolved === 'true') filter.resolved = true;
    if (resolved === 'false') filter.resolved = false;
    return this.alertModel.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  }

  async resolve(id: string) {
    return this.alertModel.findByIdAndUpdate(id, { resolved: true }, { new: true });
  }
}
