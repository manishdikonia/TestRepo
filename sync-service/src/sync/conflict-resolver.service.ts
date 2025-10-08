import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MysqlDatabaseService } from '../database/mysql-database.service';
import { PostgresDatabaseService } from '../database/postgres-database.service';
import { SyncEvent } from '../common/interfaces/sync-event.interface';

@Injectable()
export class ConflictResolverService {
  private readonly logger = new Logger(ConflictResolverService.name);
  private readonly strategy: string;

  constructor(
    private configService: ConfigService,
    private mysqlDb: MysqlDatabaseService,
    private postgresDb: PostgresDatabaseService,
  ) {
    this.strategy = this.configService.get<string>('sync.conflictResolutionStrategy');
  }

  async shouldSync(
    event: SyncEvent,
    mappedData: Record<string, any>,
    targetDb: 'mysql' | 'postgres',
  ): Promise<boolean> {
    try {
      // If it's a delete operation, always sync
      if (event.op === 'd') {
        return true;
      }

      // For create operations, check if record already exists
      if (event.op === 'c') {
        const exists = await this.checkRecordExists(
          event.source.table,
          mappedData,
          targetDb,
        );
        if (exists) {
          this.logger.warn(
            `Record already exists in ${targetDb} for table ${event.source.table}`,
          );
          // Convert to update operation
          event.op = 'u';
        }
        return true;
      }

      // For update operations, apply conflict resolution strategy
      if (event.op === 'u') {
        return await this.resolveUpdateConflict(
          event,
          mappedData,
          targetDb,
        );
      }

      return true;
    } catch (error) {
      this.logger.error('Error in conflict resolution:', error);
      // In case of error, allow sync to prevent data loss
      return true;
    }
  }

  private async checkRecordExists(
    table: string,
    data: Record<string, any>,
    targetDb: 'mysql' | 'postgres',
  ): Promise<boolean> {
    const db = targetDb === 'mysql' ? this.mysqlDb : this.postgresDb;
    const idColumn = 'id'; // Assuming 'id' as primary key
    
    if (!data[idColumn]) {
      return false;
    }

    const query = targetDb === 'mysql'
      ? `SELECT 1 FROM ${table} WHERE ${idColumn} = ? LIMIT 1`
      : `SELECT 1 FROM ${table} WHERE ${idColumn} = $1 LIMIT 1`;

    const result = await db.executeQuery(query, [data[idColumn]]);
    return result.length > 0;
  }

  private async resolveUpdateConflict(
    event: SyncEvent,
    mappedData: Record<string, any>,
    targetDb: 'mysql' | 'postgres',
  ): Promise<boolean> {
    switch (this.strategy) {
      case 'timestamp':
        return await this.resolveByTimestamp(event, mappedData, targetDb);
      case 'version':
        return await this.resolveByVersion(event, mappedData, targetDb);
      default:
        // Default: last write wins
        return true;
    }
  }

  private async resolveByTimestamp(
    event: SyncEvent,
    mappedData: Record<string, any>,
    targetDb: 'mysql' | 'postgres',
  ): Promise<boolean> {
    const db = targetDb === 'mysql' ? this.mysqlDb : this.postgresDb;
    const table = event.source.table;
    const idColumn = 'id';
    const timestampColumn = 'updated_at'; // Assuming this column exists

    if (!mappedData[idColumn]) {
      return true;
    }

    // Get current record from target database
    const query = targetDb === 'mysql'
      ? `SELECT ${timestampColumn} FROM ${table} WHERE ${idColumn} = ?`
      : `SELECT ${timestampColumn} FROM ${table} WHERE ${idColumn} = $1`;

    const result = await db.executeQuery(query, [mappedData[idColumn]]);

    if (result.length === 0) {
      // Record doesn't exist, allow sync
      return true;
    }

    const targetTimestamp = new Date(result[0][timestampColumn]).getTime();
    const sourceTimestamp = event.ts_ms;

    // Only sync if source is newer
    if (sourceTimestamp > targetTimestamp) {
      return true;
    } else {
      this.logger.debug(
        `Skipping update: target record is newer (${targetTimestamp} > ${sourceTimestamp})`,
      );
      return false;
    }
  }

  private async resolveByVersion(
    event: SyncEvent,
    mappedData: Record<string, any>,
    targetDb: 'mysql' | 'postgres',
  ): Promise<boolean> {
    const db = targetDb === 'mysql' ? this.mysqlDb : this.postgresDb;
    const table = event.source.table;
    const idColumn = 'id';
    const versionColumn = 'version'; // Assuming this column exists

    if (!mappedData[idColumn]) {
      return true;
    }

    // Get current version from target database
    const query = targetDb === 'mysql'
      ? `SELECT ${versionColumn} FROM ${table} WHERE ${idColumn} = ?`
      : `SELECT ${versionColumn} FROM ${table} WHERE ${idColumn} = $1`;

    const result = await db.executeQuery(query, [mappedData[idColumn]]);

    if (result.length === 0) {
      // Record doesn't exist, allow sync
      return true;
    }

    const targetVersion = result[0][versionColumn] || 0;
    const sourceVersion = mappedData[versionColumn] || 0;

    // Only sync if source version is higher
    if (sourceVersion > targetVersion) {
      return true;
    } else {
      this.logger.debug(
        `Skipping update: target version is higher (${targetVersion} >= ${sourceVersion})`,
      );
      return false;
    }
  }

  async resolveSchemaConflict(
    sourceSchema: any[],
    targetSchema: any[],
  ): Promise<Map<string, string>> {
    const columnMapping = new Map<string, string>();

    // Simple schema mapping based on column names
    for (const sourceCol of sourceSchema) {
      const targetCol = targetSchema.find(
        tc => tc.column_name.toLowerCase() === sourceCol.COLUMN_NAME.toLowerCase(),
      );

      if (targetCol) {
        columnMapping.set(sourceCol.COLUMN_NAME, targetCol.column_name);
      }
    }

    return columnMapping;
  }
}