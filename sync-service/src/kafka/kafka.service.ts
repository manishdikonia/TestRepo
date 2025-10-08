import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, ConsumerConfig, ProducerConfig } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();

  constructor(private configService: ConfigService) {
    const brokers = this.configService.get<string[]>('kafka.brokers');
    
    this.kafka = new Kafka({
      clientId: 'db-sync-service',
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
  }

  async onModuleInit() {
    await this.initializeProducer();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async initializeProducer() {
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      transactionalId: 'sync-service-producer',
      maxInFlightRequests: 1,
      idempotent: true,
    } as ProducerConfig);

    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async createConsumer(groupId: string, config?: Partial<ConsumerConfig>): Promise<Consumer> {
    const consumer = this.kafka.consumer({
      groupId,
      ...config,
    });

    await consumer.connect();
    this.consumers.set(groupId, consumer);
    this.logger.log(`Kafka consumer created for group: ${groupId}`);
    
    return consumer;
  }

  getProducer(): Producer {
    return this.producer;
  }

  async disconnect() {
    if (this.producer) {
      await this.producer.disconnect();
    }

    for (const [groupId, consumer] of this.consumers.entries()) {
      await consumer.disconnect();
      this.logger.log(`Disconnected consumer: ${groupId}`);
    }
  }
}