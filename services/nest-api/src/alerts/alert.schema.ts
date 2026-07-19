import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Alert {
  @Prop({ required: true }) type: string;
  @Prop({ required: true }) message: string;
  @Prop({ type: Number }) value: number;
  @Prop({ type: Number }) threshold: number;
  @Prop({ default: false }) resolved: boolean;
  createdAt: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
