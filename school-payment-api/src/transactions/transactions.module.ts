import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Order, OrderSchema } from '../schemas/order.schema';
import { OrderStatus, OrderStatusSchema } from '../schemas/order-status.schema';
import { WebhookLog, WebhookLogSchema } from '../schemas/webhook-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema },
    ]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}