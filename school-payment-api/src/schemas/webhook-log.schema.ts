import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, strict: false }) // strict: false to accept any payload shape
export class WebhookLog {}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
export type WebhookLogDocument = HydratedDocument<WebhookLog>;