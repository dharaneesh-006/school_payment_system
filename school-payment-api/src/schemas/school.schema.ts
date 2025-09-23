import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class School {
  @Prop({ required: true })
  name: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
export type SchoolDocument = HydratedDocument<School>;