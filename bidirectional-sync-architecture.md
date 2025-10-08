# Bidirectional Database Synchronization: MySQL ↔ PostgreSQL

## Architecture Overview

This solution uses Debezium and Kafka to achieve real-time bidirectional synchronization between:
- **Legacy System**: MySQL (50GB+, 200+ tables) with CodeIgniter backend
- **New System**: PostgreSQL with NestJS backend

## Key Components

1. **Apache Kafka**: Message broker for event streaming
2. **Debezium**: CDC (Change Data Capture) for both MySQL and PostgreSQL
3. **Kafka Connect**: Manages Debezium connectors
4. **Schema Registry**: Handles schema evolution
5. **Data Transformer Service**: Handles data mapping and conflict resolution

## Architecture Diagram

```
┌─────────────────┐                    ┌─────────────────┐
│   MySQL DB      │                    │  PostgreSQL DB  │
│  (CodeIgniter)  │                    │    (NestJS)     │
└────────┬────────┘                    └────────┬────────┘
         │                                      │
         │ CDC                                  │ CDC
         ▼                                      ▼
┌─────────────────┐                    ┌─────────────────┐
│Debezium MySQL   │                    │Debezium Postgres│
│   Connector     │                    │   Connector     │
└────────┬────────┘                    └────────┬────────┘
         │                                      │
         ▼                                      ▼
┌────────────────────────────────────────────────────────┐
│                    Apache Kafka                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │mysql.db.*    │  │postgres.db.* │  │sync.events  │ │
│  │(topics)      │  │(topics)      │  │(topic)      │ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
└────────────────────────────────────────────────────────┘
         │                                      │
         ▼                                      ▼
┌────────────────────────────────────────────────────────┐
│          Data Transformation & Sync Service            │
│  - Schema mapping                                      │
│  - Conflict resolution                                 │
│  - Data transformation                                 │
│  - Loop prevention                                     │
└────────────────────────────────────────────────────────┘
```

## Challenges & Solutions

### 1. Loop Prevention
- **Problem**: Changes from MySQL → PostgreSQL → MySQL creates infinite loop
- **Solution**: Add metadata to track event origin and skip processing

### 2. Schema Differences
- **Problem**: Different data types, constraints between MySQL and PostgreSQL
- **Solution**: Create mapping configuration for data type conversion

### 3. Conflict Resolution
- **Problem**: Simultaneous updates in both databases
- **Solution**: Implement timestamp-based or version-based conflict resolution

### 4. Performance at Scale
- **Problem**: 200+ tables, 50GB+ data
- **Solution**: 
  - Selective table synchronization
  - Batch processing for initial sync
  - Partitioned Kafka topics

## Implementation Steps

1. Set up Kafka ecosystem (Kafka, Zookeeper, Connect, Schema Registry)
2. Configure Debezium connectors for both databases
3. Implement data transformation service
4. Handle initial data synchronization
5. Set up monitoring and alerting
6. Test failover scenarios