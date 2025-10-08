import { Injectable, Logger } from '@nestjs/common';
import { SyncEvent, TableMapping } from '../common/interfaces/sync-event.interface';

@Injectable()
export class DataMapperService {
  private readonly logger = new Logger(DataMapperService.name);

  async mapData(
    event: SyncEvent,
    mapping: TableMapping,
    direction: 'mysql-to-postgres' | 'postgres-to-mysql',
  ): Promise<Record<string, any>> {
    const sourceData = event.after || event.before;
    if (!sourceData) {
      return {};
    }

    const mappedData: Record<string, any> = {};

    // Map columns based on mapping configuration
    for (const columnMapping of mapping.source.columns) {
      const sourceValue = sourceData[columnMapping.source];
      
      if (sourceValue !== undefined) {
        const targetColumn = columnMapping.target;
        let targetValue = sourceValue;

        // Apply type transformations
        if (columnMapping.transform) {
          targetValue = await this.applyTransformation(
            sourceValue,
            columnMapping.transform,
            direction,
          );
        } else {
          targetValue = this.convertDataType(
            sourceValue,
            columnMapping.type,
            direction,
          );
        }

        mappedData[targetColumn] = targetValue;
      }
    }

    // Apply table-level transformations
    if (mapping.transformations) {
      for (const transformation of mapping.transformations) {
        mappedData[transformation.column] = await this.applyComplexTransformation(
          mappedData,
          transformation,
        );
      }
    }

    return mappedData;
  }

  private convertDataType(
    value: any,
    type: string,
    direction: string,
  ): any {
    if (value === null || value === undefined) {
      return null;
    }

    // MySQL to PostgreSQL conversions
    if (direction === 'mysql-to-postgres') {
      switch (type.toLowerCase()) {
        case 'tinyint':
          return Boolean(value);
        case 'datetime':
        case 'timestamp':
          return value ? new Date(value).toISOString() : null;
        case 'json':
          return typeof value === 'string' ? JSON.parse(value) : value;
        case 'decimal':
        case 'numeric':
          return parseFloat(value);
        default:
          return value;
      }
    }

    // PostgreSQL to MySQL conversions
    if (direction === 'postgres-to-mysql') {
      switch (type.toLowerCase()) {
        case 'boolean':
          return value ? 1 : 0;
        case 'jsonb':
        case 'json':
          return typeof value === 'object' ? JSON.stringify(value) : value;
        case 'uuid':
          return value.replace(/-/g, '');
        case 'timestamptz':
          return value ? new Date(value).toISOString().slice(0, 19).replace('T', ' ') : null;
        default:
          return value;
      }
    }

    return value;
  }

  private async applyTransformation(
    value: any,
    transform: string,
    direction: string,
  ): Promise<any> {
    // Custom transformation logic
    switch (transform) {
      case 'uppercase':
        return value?.toString().toUpperCase();
      case 'lowercase':
        return value?.toString().toLowerCase();
      case 'trim':
        return value?.toString().trim();
      case 'uuid_to_binary':
        return value?.replace(/-/g, '');
      case 'binary_to_uuid':
        return value?.match(/.{1,8}/g)?.join('-');
      default:
        return value;
    }
  }

  private async applyComplexTransformation(
    data: Record<string, any>,
    transformation: any,
  ): Promise<any> {
    switch (transformation.type) {
      case 'constant':
        return transformation.config.value;
      case 'function':
        return this.executeFunctionTransformation(data, transformation.config);
      case 'lookup':
        return this.executeLookupTransformation(data, transformation.config);
      default:
        return null;
    }
  }

  private executeFunctionTransformation(
    data: Record<string, any>,
    config: any,
  ): any {
    // Example function transformations
    switch (config.function) {
      case 'concat':
        return config.fields.map(field => data[field]).join(config.separator || ' ');
      case 'hash':
        // Implement hashing logic
        return data[config.field];
      default:
        return null;
    }
  }

  private async executeLookupTransformation(
    data: Record<string, any>,
    config: any,
  ): Promise<any> {
    // Implement lookup logic
    // This would query a mapping table or cache
    return data[config.sourceField];
  }
}