import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Aggregate } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';
import { WebhookLog, WebhookLogDocument } from '../schemas/webhook-log.schema';

// Interfaces for pagination
interface SimpleAggregatePaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
interface SimpleAggregatePaginateOptions {
  page?: number;
  limit?: number;
  [key: string]: any;
}
type OrderStatusModelWithPagination = Model<OrderStatusDocument> & {
  aggregatePaginate(
    query: Aggregate<any[]>,
    options?: SimpleAggregatePaginateOptions,
  ): Promise<SimpleAggregatePaginateResult<OrderStatusDocument>>;
};

@Injectable()
export class TransactionsService {
  private readonly pgKey: string;
  private readonly pgApiKey: string;
  private readonly schoolId: string;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: OrderStatusModelWithPagination,
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.pgKey = this.configService.get<string>('PG_KEY')!;
    this.pgApiKey = this.configService.get<string>('PG_API_KEY')!;
    this.schoolId = this.configService.get<string>('SCHOOL_ID')!;
  }

  async createPayment(paymentDto: any): Promise<{ redirectUrl: string }> {
    const custom_order_id = `ORD-${Date.now()}`;

    const newOrder = new this.orderModel({
      custom_order_id,
      school_id: this.schoolId,
      trustee_id: '65b0e552dd31950a9b41c5ba',
      student_info: {
        name: paymentDto.name,
        id: paymentDto.studentId,
        email: paymentDto.email,
        phone: paymentDto.phone, // Save the phone number
      },
      gateway_name: 'Easebuzz', 
    });
    await newOrder.save();

    const newOrderStatus = new this.orderStatusModel({
      collect_id: custom_order_id,
      order_amount: paymentDto.amount,
      status: 'Pending',
    });
    await newOrderStatus.save();

    const payload = {
      key: this.pgKey,
      txnid: custom_order_id,
      amount: paymentDto.amount.toFixed(2),
      productinfo: 'School Fees',
      firstname: paymentDto.name,
      email: paymentDto.email,
      phone: paymentDto.phone,
      udf1: '', udf2: '', udf3: '', udf4: '', udf5: '',
      school_id: this.schoolId,
      trustee_id: '65b0e552dd31950a9b41c5ba',
    };

    const signedPayload = jwt.sign(payload, this.pgApiKey);
    const apiUrl = 'https://api.edvanceskills.com/api/create-collect-request';

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, { payment_payload: signedPayload }),
      );
      
      if (!response.data || !response.data.payment_page_url) {
        throw new Error('Invalid response from payment gateway');
      }
      return { redirectUrl: response.data.payment_page_url };
    } catch (error) {
      console.warn(`⚠️ Payment Gateway is unavailable. Falling back to mock payment flow. Error: ${error.message}`);
      await this.orderModel.findOneAndUpdate(
          { custom_order_id },
          { $set: { gateway_name: 'Mock Gateway (Offline)' } },
      );
      const mockRedirectUrl = `http://localhost:5173/dashboard?status=mock_payment_created&orderId=${custom_order_id}`;
      return { redirectUrl: mockRedirectUrl };
    }
  }

  async handleWebhook(payload: any): Promise<void> {
    await new this.webhookLogModel(payload).save();
    const { order_info } = payload;
    if (!order_info || !order_info.order_id) return;
    const collect_id = order_info.order_id;
    await this.orderStatusModel.findOneAndUpdate(
      { collect_id },
      {
        $set: {
          order_amount: order_info.order_amount,
          transaction_amount: order_info.transaction_amount,
          payment_mode: order_info.payment_mode,
          payment_details: order_info.payemnt_details,
          bank_reference: order_info.bank_reference,
          payment_message: order_info.Payment_message,
          status: order_info.status === 'success' ? 'Success' : 'Failed',
          error_message: order_info.error_message,
          payment_time: new Date(order_info.payment_time),
        },
      },
      { new: true },
    );
  }

  // src/transactions/transactions.service.ts

  async findAll(params: any): Promise<any> {
    const { page = 1, limit = 10, sort_by, sort_order, status, school_id, q } = params;

    const pipeline: any[] = [];
    
    // This stage filters documents *before* the expensive join operation
    const preLookupMatchStage: any = {};

    // --- THIS IS THE CORRECTED LOGIC ---
    if (status && status.length > 0) {
      const statusArray = Array.isArray(status) ? status : [status];
      // Build an $or query to match any of the statuses case-insensitively
      preLookupMatchStage.$or = statusArray.map(s => ({
        status: { $regex: s, $options: 'i' }
      }));
    }
    // ------------------------------------

    if (Object.keys(preLookupMatchStage).length > 0) {
      pipeline.push({ $match: preLookupMatchStage });
    }
    
    // Join with the 'orders' collection
    pipeline.push(
      {
        $lookup: {
          from: 'orders',
          localField: 'collect_id',
          foreignField: 'custom_order_id',
          as: 'order_details',
        },
      },
      { $unwind: '$order_details' },
      {
        $project: {
          _id: 0,
          collect_id: '$collect_id',
          school_id: '$order_details.school_id',
          gateway: '$order_details.gateway_name',
          order_amount: '$order_amount',
          transaction_amount: '$transaction_amount',
          status: '$status',
          custom_order_id: '$collect_id',
          createdAt: '$createdAt',
          payment_method: '$payment_mode',
          student_name: '$order_details.student_info.name',
          student_id: '$order_details.student_info.id',
          phone_no: '$order_details.student_info.phone',
        },
      },
    );

    // This stage filters on fields that only exist *after* the join
    const postLookupMatchStage: any = {};
    if (school_id) {
        postLookupMatchStage.school_id = school_id;
    }
    if (q) {
        postLookupMatchStage.$or = [
            { collect_id: { $regex: q, $options: 'i' } },
            { custom_order_id: { $regex: q, $options: 'i' } },
            { student_name: { $regex: q, $options: 'i' } },
            { student_id: { $regex: q, $options: 'i' } },
        ];
    }
    if (Object.keys(postLookupMatchStage).length > 0) {
        pipeline.push({ $match: postLookupMatchStage });
    }
        
    if (sort_by) {
        pipeline.push({
            $sort: { [sort_by]: sort_order === 'desc' ? -1 : 1 }
        });
    }

    const aggregation = this.orderStatusModel.aggregate(pipeline);
    
    const paginatedResults = await this.orderStatusModel.aggregatePaginate(aggregation, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    return {
        data: paginatedResults.docs,
        total: paginatedResults.totalDocs,
        page: paginatedResults.page,
        limit: paginatedResults.limit,
    };
  }

  async findBySchool(schoolId: string): Promise<any> {
    const pipeline = [
      {
        $lookup: {
          from: 'orders',
          localField: 'collect_id',
          foreignField: 'custom_order_id',
          as: 'order_details',
        },
      },
      { $unwind: '$order_details' },
      { $match: { 'order_details.school_id': schoolId } },
      {
        $project: {
          _id: 0,
          collect_id: '$collect_id',
          gateway: '$order_details.gateway_name',
          order_amount: '$order_amount',
          transaction_amount: '$transaction_amount',
          status: '$status',
          custom_order_id: '$collect_id',
        },
      },
    ];
    return this.orderStatusModel.aggregate(pipeline).exec();
  }

  async checkStatus(customOrderId: string): Promise<OrderStatus> {
    const status = await this.orderStatusModel.findOne({ collect_id: customOrderId }).exec();
    if (!status) {
      throw new NotFoundException(`Transaction with ID ${customOrderId} not found.`);
    }
    return status;
  }
}