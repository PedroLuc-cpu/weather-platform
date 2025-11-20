import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherDocument = Weather & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class Weather {
  @Prop({ required: true })
  source: string;

  @Prop({ type: Number })
  latitude: number;

  @Prop({ type: Number })
  longitude: number;

  @Prop()
  timezone: string;

  @Prop({ type: Object })
  current: Record<string, any>;

  @Prop({ type: Object })
  raw: Record<string, any>;

  @Prop()
  fetchedAtISO: string;

  @Prop({ type: Object })
  meta: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
