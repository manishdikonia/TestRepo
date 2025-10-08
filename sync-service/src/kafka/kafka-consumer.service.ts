import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { KafkaService } from './kafka.service';
import { SyncEvent } from '../common/interfaces/sync-event.interface';

@Injectable()
export class KafkaConsumerService {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumer: Consumer;
  private messageHandlers: Map<string, (event: SyncEvent) => Promise<void>> = new Map();

  constructor(
    private kafkaService: KafkaService,
    private configService: ConfigService,
  ) {}

  async initialize() {
    const groupId = this.configService.get<string>('kafka.consumerGroupId');
    this.consumer = await this.kafkaService.createConsumer(groupId, {
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      allowAutoTopicCreation: true,
    });

    await this.subscribeToTopics();
    await this.startConsumer();
  }

  private async subscribeToTopics() {
    const topics = [
      `${this.configService.get<string>('kafka.topics.mysqlPrefix')}.*`,
      `${this.configService.get<string>('kafka.topics.postgresPrefix')}.*`,
    ];

    await this.consumer.subscribe({
      topics,
      fromBeginning: false,
    });

    this.logger.log(`Subscribed to topics: ${topics.join(', ')}`);
  }

  private async startConsumer() {
    await this.consumer.run({
      autoCommit: false,
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  private async handleMessage({ topic, partition, message }: EachMessagePayload) {
    try {
      const event = this.parseMessage(message.value);
      
      // Skip processing if this event was created by our sync service
      if (event.sync_id && this.isOurSyncEvent(event)) {
        this.logger.debug(`Skipping our own sync event: ${event.sync_id}`);
        return;
      }

      const handler = this.getHandlerForTopic(topic);
      if (handler) {
        await handler(event);
      } else {
        this.logger.warn(`No handler registered for topic: ${topic}`);
      }

      // Commit offset after successful processing
      await this.consumer.commitOffsets([
        {
          topic,
          partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    } catch (error) {
      this.logger.error(`Error processing message from ${topic}:`, error);
      // Implement retry logic or dead letter queue here
    }
  }

  private parseMessage(value: Buffer): SyncEvent {
    try {
      return JSON.parse(value.toString());
    } catch (error) {
      this.logger.error('Failed to parse message:', error);
      throw error;
    }
  }

  private isOurSyncEvent(event: SyncEvent): boolean {
    // Check if this event was created by our sync service
    const ourServiceId = this.configService.get<string>('SYNC_SERVICE_ID', 'db-sync-service');
    return event.sync_id?.startsWith(ourServiceId);
  }

  registerHandler(topicPattern: string, handler: (event: SyncEvent) => Promise<void>) {
    this.messageHandlers.set(topicPattern, handler);
    this.logger.log(`Registered handler for pattern: ${topicPattern}`);
  }

  private getHandlerForTopic(topic: string): ((event: SyncEvent) => Promise<void>) | undefined {
    for (const [pattern, handler] of this.messageHandlers.entries()) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      if (regex.test(topic)) {
        return handler;
      }
    }
    return undefined;
  }

  async disconnect() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}