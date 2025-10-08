export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  kafka: {
    brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:29092').split(','),
    schemaRegistry: process.env.SCHEMA_REGISTRY_URL || 'http://localhost:8081',
    consumerGroupId: process.env.SYNC_CONSUMER_GROUP_ID || 'db-sync-service',
    topics: {
      mysqlPrefix: 'mysql.sync.',
      postgresPrefix: 'postgres.sync.',
    },
  },
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'rootpassword',
    database: process.env.MYSQL_DATABASE || 'legacy_db',
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DATABASE || 'new_db',
  },
  sync: {
    batchSize: parseInt(process.env.SYNC_BATCH_SIZE, 10) || 1000,
    enableInitialSync: process.env.SYNC_ENABLE_INITIAL_SYNC === 'true',
    conflictResolutionStrategy: process.env.SYNC_CONFLICT_RESOLUTION_STRATEGY || 'timestamp',
    logLevel: process.env.SYNC_LOG_LEVEL || 'info',
  },
});