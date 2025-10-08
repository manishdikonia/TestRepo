export interface SyncEvent {
  before?: Record<string, any>;
  after?: Record<string, any>;
  source: {
    version: string;
    connector: string;
    name: string;
    ts_ms: number;
    snapshot: boolean | string;
    db: string;
    table: string;
    server_id: number;
    file?: string;
    pos?: number;
    row?: number;
    thread?: number;
  };
  op: 'c' | 'u' | 'd' | 'r'; // create, update, delete, read
  ts_ms: number;
  transaction?: {
    id: string;
    total_order: number;
    data_collection_order: number;
  };
  sync_source?: 'mysql' | 'postgres';
  sync_id?: string;
  sync_timestamp?: number;
}

export interface TableMapping {
  source: {
    database: string;
    table: string;
    columns: ColumnMapping[];
  };
  target: {
    database: string;
    table: string;
    columns: ColumnMapping[];
  };
  transformations?: DataTransformation[];
  skipColumns?: string[];
  conflictResolution?: ConflictResolutionConfig;
}

export interface ColumnMapping {
  source: string;
  target: string;
  type: string;
  nullable?: boolean;
  transform?: string;
}

export interface DataTransformation {
  column: string;
  type: 'type_cast' | 'function' | 'constant' | 'lookup';
  config: any;
}

export interface ConflictResolutionConfig {
  strategy: 'timestamp' | 'version' | 'custom';
  timestampColumn?: string;
  versionColumn?: string;
  customResolver?: string;
}