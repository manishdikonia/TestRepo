import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumerService } from '../kafka/kafka-consumer.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { MysqlDatabaseService } from '../database/mysql-database.service';
import { PostgresDatabaseService } from '../database/postgres-database.service';
import { DataMapperService } from './data-mapper.service';
import { ConflictResolverService } from './conflict-resolver.service';
import { TableMappingService } from './table-mapping.service';
import { SyncEvent } from '../common/interfaces/sync-event.interface';

@Injectable()
export class SyncService implements OnModuleInit {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private kafkaConsumer: KafkaConsumerService,
    private kafkaProducer: KafkaProducerService,
    private mysqlDb: MysqlDatabaseService,
    private postgresDb: PostgresDatabaseService,
    private dataMapper: DataMapperService,
    private conflictResolver: ConflictResolverService,
    private tableMapping: TableMappingService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.initialize();
    await this.registerEventHandlers();
    
    if (this.configService.get<boolean>('sync.enableInitialSync')) {
      await this.performInitialSync();
    }
  }

  private async registerEventHandlers() {
    // Handle MySQL events
    this.kafkaConsumer.registerHandler(
      'mysql\\.sync\\..*',
      this.handleMysqlEvent.bind(this),
    );

    // Handle PostgreSQL events
    this.kafkaConsumer.registerHandler(
      'postgres\\.sync\\..*',
      this.handlePostgresEvent.bind(this),
    );
  }

  private async handleMysqlEvent(event: SyncEvent) {
    try {
      this.logger.debug(`Processing MySQL event: ${event.op} on ${event.source.table}`);

      // Get table mapping
      const mapping = await this.tableMapping.getMappingForTable(
        'mysql',
        event.source.table,
      );

      if (!mapping) {
        this.logger.warn(`No mapping found for MySQL table: ${event.source.table}`);
        return;
      }

      // Map the data
      const mappedData = await this.dataMapper.mapData(
        event,
        mapping,
        'mysql-to-postgres',
      );

      // Check for conflicts
      const shouldSync = await this.conflictResolver.shouldSync(
        event,
        mappedData,
        'postgres',
      );

      if (!shouldSync) {
        this.logger.debug(`Skipping sync due to conflict resolution`);
        return;
      }

      // Apply to PostgreSQL
      await this.applyToPostgres(event, mappedData, mapping.target.table);

      // Publish success event
      await this.publishSyncSuccess(event, 'mysql-to-postgres');
    } catch (error) {
      this.logger.error(`Failed to sync MySQL event:`, error);
      await this.publishSyncError(event, error, 'mysql-to-postgres');
    }
  }

  private async handlePostgresEvent(event: SyncEvent) {
    try {
      this.logger.debug(`Processing PostgreSQL event: ${event.op} on ${event.source.table}`);

      // Get table mapping
      const mapping = await this.tableMapping.getMappingForTable(
        'postgres',
        event.source.table,
      );

      if (!mapping) {
        this.logger.warn(`No mapping found for PostgreSQL table: ${event.source.table}`);
        return;
      }

      // Map the data
      const mappedData = await this.dataMapper.mapData(
        event,
        mapping,
        'postgres-to-mysql',
      );

      // Check for conflicts
      const shouldSync = await this.conflictResolver.shouldSync(
        event,
        mappedData,
        'mysql',
      );

      if (!shouldSync) {
        this.logger.debug(`Skipping sync due to conflict resolution`);
        return;
      }

      // Apply to MySQL
      await this.applyToMysql(event, mappedData, mapping.target.table);

      // Publish success event
      await this.publishSyncSuccess(event, 'postgres-to-mysql');
    } catch (error) {
      this.logger.error(`Failed to sync PostgreSQL event:`, error);
      await this.publishSyncError(event, error, 'postgres-to-mysql');
    }
  }

  private async applyToPostgres(
    event: SyncEvent,
    data: Record<string, any>,
    table: string,
  ) {
    switch (event.op) {
      case 'c': // Create
        await this.postgresDb.insertData(table, data);
        break;
      case 'u': // Update
        const updateWhere = this.extractPrimaryKey(event, data);
        await this.postgresDb.updateData(table, data, updateWhere);
        break;
      case 'd': // Delete
        const deleteWhere = this.extractPrimaryKey(event, event.before);
        await this.postgresDb.deleteData(table, deleteWhere);
        break;
      case 'r': // Read (snapshot)
        await this.postgresDb.upsertData(table, data, ['id']);
        break;
    }
  }

  private async applyToMysql(
    event: SyncEvent,
    data: Record<string, any>,
    table: string,
  ) {
    switch (event.op) {
      case 'c': // Create
        await this.mysqlDb.insertData(table, data);
        break;
      case 'u': // Update
        const updateWhere = this.extractPrimaryKey(event, data);
        await this.mysqlDb.updateData(table, data, updateWhere);
        break;
      case 'd': // Delete
        const deleteWhere = this.extractPrimaryKey(event, event.before);
        await this.mysqlDb.deleteData(table, deleteWhere);
        break;
      case 'r': // Read (snapshot)
        await this.mysqlDb.upsertData(table, data, ['id']);
        break;
    }
  }

  private extractPrimaryKey(
    event: SyncEvent,
    data: Record<string, any>,
  ): Record<string, any> {
    // Simple implementation assuming 'id' as primary key
    // In production, this should be based on actual table schema
    return { id: data.id };
  }

  private async publishSyncSuccess(event: SyncEvent, direction: string) {
    await this.kafkaProducer.publishSyncEvent('sync.events', {
      ...event,
      sync_direction: direction,
      sync_status: 'success',
      sync_timestamp: Date.now(),
    });
  }

  private async publishSyncError(event: SyncEvent, error: any, direction: string) {
    await this.kafkaProducer.publishSyncEvent('sync.events', {
      ...event,
      sync_direction: direction,
      sync_status: 'error',
      sync_error: error.message,
      sync_timestamp: Date.now(),
    });
  }

  private async performInitialSync() {
    this.logger.log('Initial sync not implemented yet');
    // TODO: Implement initial data synchronization
  }
}