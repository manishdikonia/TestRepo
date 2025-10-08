import { Injectable, Logger } from '@nestjs/common';
import { TableMapping } from '../common/interfaces/sync-event.interface';

@Injectable()
export class TableMappingService {
  private readonly logger = new Logger(TableMappingService.name);
  private tableMappings: Map<string, TableMapping> = new Map();

  constructor() {
    this.initializeMappings();
  }

  private initializeMappings() {
    // Example mappings - in production, load from configuration file or database
    
    // Users table mapping
    this.addMapping({
      source: {
        database: 'legacy_db',
        table: 'users',
        columns: [
          { source: 'id', target: 'id', type: 'int' },
          { source: 'username', target: 'username', type: 'varchar' },
          { source: 'email', target: 'email', type: 'varchar' },
          { source: 'password_hash', target: 'password_hash', type: 'varchar' },
          { source: 'created_date', target: 'created_at', type: 'timestamp' },
          { source: 'modified_date', target: 'updated_at', type: 'timestamp' },
          { source: 'is_active', target: 'is_active', type: 'tinyint' },
          { source: 'user_type', target: 'role', type: 'varchar', transform: 'mapUserType' },
        ],
      },
      target: {
        database: 'new_db',
        table: 'users',
        columns: [],
      },
      transformations: [
        {
          column: 'full_name',
          type: 'function',
          config: {
            function: 'concat',
            fields: ['first_name', 'last_name'],
            separator: ' ',
          },
        },
      ],
      conflictResolution: {
        strategy: 'timestamp',
        timestampColumn: 'updated_at',
      },
    });

    // Products table mapping
    this.addMapping({
      source: {
        database: 'legacy_db',
        table: 'products',
        columns: [
          { source: 'product_id', target: 'id', type: 'int' },
          { source: 'product_name', target: 'name', type: 'varchar' },
          { source: 'product_desc', target: 'description', type: 'text' },
          { source: 'price', target: 'price', type: 'decimal' },
          { source: 'stock_qty', target: 'stock_quantity', type: 'int' },
          { source: 'category_id', target: 'category_id', type: 'int' },
          { source: 'created_time', target: 'created_at', type: 'timestamp' },
          { source: 'updated_time', target: 'updated_at', type: 'timestamp' },
          { source: 'product_status', target: 'status', type: 'varchar' },
          { source: 'product_data', target: 'metadata', type: 'json' },
        ],
      },
      target: {
        database: 'new_db',
        table: 'products',
        columns: [],
      },
      skipColumns: ['internal_notes', 'legacy_code'],
    });

    // Orders table mapping
    this.addMapping({
      source: {
        database: 'legacy_db',
        table: 'orders',
        columns: [
          { source: 'order_id', target: 'id', type: 'int' },
          { source: 'customer_id', target: 'user_id', type: 'int' },
          { source: 'order_date', target: 'created_at', type: 'timestamp' },
          { source: 'total_amount', target: 'total', type: 'decimal' },
          { source: 'order_status', target: 'status', type: 'varchar' },
          { source: 'shipping_addr', target: 'shipping_address', type: 'json' },
          { source: 'billing_addr', target: 'billing_address', type: 'json' },
        ],
      },
      target: {
        database: 'new_db',
        table: 'orders',
        columns: [],
      },
      conflictResolution: {
        strategy: 'version',
        versionColumn: 'version',
      },
    });

    // Add reverse mappings for bidirectional sync
    this.createReverseMappings();
  }

  private addMapping(mapping: TableMapping) {
    const key = `${mapping.source.database}.${mapping.source.table}`;
    this.tableMappings.set(key, mapping);
    this.logger.log(`Added mapping for ${key}`);
  }

  private createReverseMappings() {
    const reverseMappings: TableMapping[] = [];

    for (const [key, mapping] of this.tableMappings.entries()) {
      const reverseMapping: TableMapping = {
        source: {
          database: mapping.target.database,
          table: mapping.target.table,
          columns: mapping.source.columns.map(col => ({
            source: col.target,
            target: col.source,
            type: col.type,
            transform: this.getReverseTransform(col.transform),
          })),
        },
        target: {
          database: mapping.source.database,
          table: mapping.source.table,
          columns: [],
        },
        transformations: this.getReverseTransformations(mapping.transformations),
        skipColumns: mapping.skipColumns,
        conflictResolution: mapping.conflictResolution,
      };

      reverseMappings.push(reverseMapping);
    }

    // Add reverse mappings
    for (const reverseMapping of reverseMappings) {
      this.addMapping(reverseMapping);
    }
  }

  private getReverseTransform(transform?: string): string | undefined {
    if (!transform) return undefined;

    const reverseTransformMap = {
      'mapUserType': 'reverseMapUserType',
      'uppercase': 'lowercase',
      'lowercase': 'uppercase',
    };

    return reverseTransformMap[transform] || transform;
  }

  private getReverseTransformations(transformations?: any[]): any[] | undefined {
    if (!transformations) return undefined;

    // For now, skip complex transformations in reverse
    // In production, implement proper reverse transformations
    return [];
  }

  async getMappingForTable(
    sourceDb: string,
    tableName: string,
  ): Promise<TableMapping | null> {
    // Try exact match first
    let key = `${sourceDb === 'mysql' ? 'legacy_db' : 'new_db'}.${tableName}`;
    let mapping = this.tableMappings.get(key);

    if (!mapping) {
      // Try with different database names
      const alternativeKeys = [
        `${sourceDb}.${tableName}`,
        `${tableName}`,
      ];

      for (const altKey of alternativeKeys) {
        mapping = this.tableMappings.get(altKey);
        if (mapping) break;
      }
    }

    return mapping || null;
  }

  async loadMappingsFromFile(filePath: string): Promise<void> {
    // TODO: Implement loading mappings from JSON/YAML file
    this.logger.log(`Loading mappings from ${filePath}`);
  }

  async saveMappingsToFile(filePath: string): Promise<void> {
    // TODO: Implement saving mappings to JSON/YAML file
    this.logger.log(`Saving mappings to ${filePath}`);
  }

  getAllMappings(): Map<string, TableMapping> {
    return this.tableMappings;
  }

  updateMapping(key: string, mapping: TableMapping): void {
    this.tableMappings.set(key, mapping);
    this.logger.log(`Updated mapping for ${key}`);
  }

  deleteMapping(key: string): boolean {
    const result = this.tableMappings.delete(key);
    if (result) {
      this.logger.log(`Deleted mapping for ${key}`);
    }
    return result;
  }
}