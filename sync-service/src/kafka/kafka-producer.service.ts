import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Producer } from 'kafkajs';
import { KafkaService } from './kafka.service';
import { SyncEvent } from '../common/interfaces/sync-event.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KafkaProducerService {
  private readonly logger = new Logger(KafkaProducerService.name);
  private producer: Producer;

  constructor(
    private kafkaService: KafkaService,
    private configService: ConfigService,
  ) {
    this.producer = this.kafkaService.getProducer();
  }

  async publishSyncEvent(
    topic: string,
    event: SyncEvent,
    key?: string,
  ): Promise<void> {
    try {
      // Add sync metadata to prevent loops
      const enrichedEvent: SyncEvent = {
        ...event,
        sync_id: `db-sync-service-${uuidv4()}`,
        sync_timestamp: Date.now(),
      };

      await this.producer.send({
        topic,
        messages: [
          {
            key: key || this.generateKey(event),
            value: JSON.stringify(enrichedEvent),
            headers: {
              'sync-source': event.sync_source || 'unknown',
              'sync-id': enrichedEvent.sync_id,
              'content-type': 'application/json',
            },
          },
        ],
      });

      this.logger.debug(`Published event to ${topic} with sync_id: ${enrichedEvent.sync_id}`);
    } catch (error) {
      this.logger.error(`Failed to publish event to ${topic}:`, error);
      throw error;
    }
  }

  async publishBatch(
    topic: string,
    events: SyncEvent[],
  ): Promise<void> {
    try {
      const messages = events.map(event => ({
        key: this.generateKey(event),
        value: JSON.stringify({
          ...event,
          sync_id: `db-sync-service-${uuidv4()}`,
          sync_timestamp: Date.now(),
        }),
      }));

      await this.producer.sendBatch({
        topicMessages: [
          {
            topic,
            messages,
          },
        ],
      });

      this.logger.debug(`Published batch of ${events.length} events to ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to publish batch to ${topic}:`, error);
      throw error;
    }
  }

  private generateKey(event: SyncEvent): string {
    // Generate a consistent key based on the event data
    const { source, after } = event;
    const table = source.table;
    
    // Try to extract primary key from the event
    if (after && after.id) {
      return `${table}-${after.id}`;
    }
    
    // Fallback to timestamp-based key
    return `${table}-${event.ts_ms}`;
  }
}