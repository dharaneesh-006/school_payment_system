import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const allowedOrigins = [
    'http://localhost:5173',                  
    'https://schoolpayment-system.netlify.app' 
  ];

  app.enableCors({
    origin: (origin, callback) => {

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('This origin is not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT || 4000); 
}

<<<<<<< HEAD
bootstrap();
=======
bootstrap();
>>>>>>> 7533f3742fe08adb5d92dbc520fcb1df8231ad29
