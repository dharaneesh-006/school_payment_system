// src/app.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SchoolsModule } from './schools/schools.module';
import { DatabaseService } from './database.service'; // <-- 1. Import the new service

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PG_KEY: Joi.string().required(),
        PG_API_KEY: Joi.string().required(),
        SCHOOL_ID: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TransactionsModule,
    SchoolsModule,
  ],
  controllers: [],
  providers: [DatabaseService], // <-- 2. Add the service to providers
})
export class AppModule {}