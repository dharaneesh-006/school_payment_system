import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Order } from './order.schema';
import aggregatePaginate = require('mongoose-aggregate-paginate-v2');

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ required: true, unique: true })
  collect_id: string; 

  @Prop()
  order_amount: number;

  @Prop()
  transaction_amount: number;

  @Prop()
  payment_mode: string;

  @Prop()
  payment_details: string;

  @Prop()
  bank_reference: string;

  @Prop()
  payment_message: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop()
  error_message: string;
  
  @Prop()
  payment_time: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
OrderStatusSchema.plugin(aggregatePaginate);
export type OrderStatusDocument = HydratedDocument<OrderStatus>;