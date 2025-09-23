import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  custom_order_id: string; // This will link to OrderStatus.collect_id

  @Prop({ required: true })
  school_id: string;

  @Prop({ required: true })
  trustee_id: string;

  @Prop({ type: Object })
  student_info: {
    name: string;
    id: string;
    email: string;
  };
  
  @Prop()
  gateway_name: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = HydratedDocument<Order>;