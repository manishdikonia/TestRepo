import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './kafka.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaProducerService } from './kafka-producer.service';

@Module({
  imports: [ConfigModule],
  providers: [KafkaService, KafkaConsumerService, KafkaProducerService],
  exports: [KafkaService, KafkaConsumerService, KafkaProducerService],
})
export class KafkaModule {}