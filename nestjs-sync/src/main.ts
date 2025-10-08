import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Create microservice for Kafka
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'nestjs-sync-service',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'nestjs-sync-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
  
  console.log('NestJS Sync Service is running on port 3001');
  console.log('Kafka consumer is connected');
}

bootstrap();