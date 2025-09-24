import { Controller, Post, Body, Get, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('create-payment')
  createPayment(@Body() paymentDto: any) {
    return this.transactionsService.createPayment(paymentDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  handleWebhook(@Body() payload: any) {
    return this.transactionsService.handleWebhook(payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('transactions')
  findAll(@Query() query: any) {
    return this.transactionsService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('transactions/school/:schoolId')
  findBySchool(@Param('schoolId') schoolId: string) {
    return this.transactionsService.findBySchool(schoolId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check-status')
  checkStatus(@Query('custom_order_id') customOrderId: string) {
    return this.transactionsService.checkStatus(customOrderId);
  }
}