# Production Deployment Guide

This guide covers deploying the Debezium bidirectional synchronization system in a production environment.

## 🏭 Production Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Production Environment                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   MySQL     │  │   Kafka     │  │ PostgreSQL  │             │
│  │  Primary    │  │  Cluster    │  │  Primary    │             │
│  │             │  │ (3 nodes)   │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                │                │                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   MySQL     │  │   Kafka     │  │ PostgreSQL  │             │
│  │  Replica    │  │  Connect    │  │  Replica    │             │
│  │             │  │ (3 nodes)   │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                           │                                     │
│  ┌─────────────────────────────────────────────────────────────┤
│  │              Monitoring & Alerting                          │
│  │  Prometheus │ Grafana │ AlertManager │ ELK Stack           │
│  └─────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Pre-Deployment Checklist

### Infrastructure Requirements

- [ ] **Compute Resources**:
  - Kafka Cluster: 3 nodes, 8 CPU cores, 32GB RAM each
  - Kafka Connect: 3 nodes, 4 CPU cores, 16GB RAM each
  - Monitoring: 1 node, 4 CPU cores, 8GB RAM

- [ ] **Storage Requirements**:
  - Kafka: 1TB SSD per node (minimum)
  - Monitoring: 500GB SSD
  - Backup: 2TB for data retention

- [ ] **Network Requirements**:
  - Low latency between database and Kafka cluster (<10ms)
  - High bandwidth (1Gbps minimum)
  - Firewall rules configured

### Database Preparation

#### MySQL Configuration

1. **Enable Binary Logging**:
   ```sql
   -- Add to my.cnf
   [mysqld]
   server-id = 1
   log-bin = mysql-bin
   binlog-format = ROW
   binlog-row-image = FULL
   expire-logs-days = 7
   max-binlog-size = 1G
   
   -- Performance tuning
   innodb-buffer-pool-size = 16G
   innodb-log-file-size = 2G
   innodb-flush-log-at-trx-commit = 2
   ```

2. **Create Replication User**:
   ```sql
   CREATE USER 'debezium'@'%' IDENTIFIED BY 'SecurePassword123!';
   GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'debezium'@'%';
   GRANT SELECT ON mysql.* TO 'debezium'@'%';
   FLUSH PRIVILEGES;
   ```

3. **Verify Configuration**:
   ```sql
   SHOW VARIABLES LIKE 'log_bin';
   SHOW VARIABLES LIKE 'binlog_format';
   SHOW MASTER STATUS;
   ```

#### PostgreSQL Configuration

1. **Configure Logical Replication**:
   ```sql
   -- Add to postgresql.conf
   wal_level = logical
   max_wal_senders = 10
   max_replication_slots = 10
   max_logical_replication_workers = 10
   
   -- Performance tuning
   shared_buffers = 8GB
   effective_cache_size = 24GB
   maintenance_work_mem = 2GB
   checkpoint_completion_target = 0.9
   wal_buffers = 64MB
   ```

2. **Create Replication User**:
   ```sql
   CREATE USER debezium WITH REPLICATION LOGIN PASSWORD 'SecurePassword123!';
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO debezium;
   GRANT USAGE ON SCHEMA public TO debezium;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO debezium;
   ```

3. **Configure pg_hba.conf**:
   ```
   # Allow replication connections
   host replication debezium 0.0.0.0/0 md5
   host all debezium 0.0.0.0/0 md5
   ```

## 🐳 Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  zookeeper-1:
    image: confluentinc/cp-zookeeper:7.4.0
    hostname: zookeeper-1
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
      ZOOKEEPER_SERVER_ID: 1
      ZOOKEEPER_SERVERS: zookeeper-1:2888:3888;zookeeper-2:2888:3888;zookeeper-3:2888:3888
    volumes:
      - zookeeper-1-data:/var/lib/zookeeper/data
      - zookeeper-1-logs:/var/lib/zookeeper/log
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  zookeeper-2:
    image: confluentinc/cp-zookeeper:7.4.0
    hostname: zookeeper-2
    ports:
      - "2182:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
      ZOOKEEPER_SERVER_ID: 2
      ZOOKEEPER_SERVERS: zookeeper-1:2888:3888;zookeeper-2:2888:3888;zookeeper-3:2888:3888
    volumes:
      - zookeeper-2-data:/var/lib/zookeeper/data
      - zookeeper-2-logs:/var/lib/zookeeper/log
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  zookeeper-3:
    image: confluentinc/cp-zookeeper:7.4.0
    hostname: zookeeper-3
    ports:
      - "2183:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
      ZOOKEEPER_SERVER_ID: 3
      ZOOKEEPER_SERVERS: zookeeper-1:2888:3888;zookeeper-2:2888:3888;zookeeper-3:2888:3888
    volumes:
      - zookeeper-3-data:/var/lib/zookeeper/data
      - zookeeper-3-logs:/var/lib/zookeeper/log
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  kafka-1:
    image: confluentinc/cp-kafka:7.4.0
    hostname: kafka-1
    depends_on:
      - zookeeper-1
      - zookeeper-2
      - zookeeper-3
    ports:
      - "9092:9092"
      - "9101:9101"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: 'zookeeper-1:2181,zookeeper-2:2181,zookeeper-3:2181'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-1:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 2
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 3
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_JMX_PORT: 9101
      KAFKA_JMX_HOSTNAME: localhost
      # Production optimizations
      KAFKA_NUM_NETWORK_THREADS: 16
      KAFKA_NUM_IO_THREADS: 32
      KAFKA_SOCKET_SEND_BUFFER_BYTES: 102400
      KAFKA_SOCKET_RECEIVE_BUFFER_BYTES: 102400
      KAFKA_SOCKET_REQUEST_MAX_BYTES: 104857600
      KAFKA_LOG_RETENTION_HOURS: 168
      KAFKA_LOG_SEGMENT_BYTES: 1073741824
      KAFKA_LOG_RETENTION_CHECK_INTERVAL_MS: 300000
      KAFKA_COMPRESSION_TYPE: 'lz4'
      KAFKA_MIN_INSYNC_REPLICAS: 2
    volumes:
      - kafka-1-data:/var/lib/kafka/data
    deploy:
      resources:
        limits:
          memory: 16G
        reservations:
          memory: 8G

  # Similar configuration for kafka-2 and kafka-3...

  kafka-connect-1:
    image: debezium/connect:2.4
    hostname: kafka-connect-1
    depends_on:
      - kafka-1
      - kafka-2
      - kafka-3
    ports:
      - "8083:8083"
    environment:
      BOOTSTRAP_SERVERS: kafka-1:29092,kafka-2:29092,kafka-3:29092
      GROUP_ID: 1
      CONFIG_STORAGE_TOPIC: docker-connect-configs
      CONFIG_STORAGE_REPLICATION_FACTOR: 3
      OFFSET_FLUSH_INTERVAL_MS: 10000
      OFFSET_STORAGE_TOPIC: docker-connect-offsets
      OFFSET_STORAGE_REPLICATION_FACTOR: 3
      STATUS_STORAGE_TOPIC: docker-connect-status
      STATUS_STORAGE_REPLICATION_FACTOR: 3
      KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
      VALUE_CONVERTER: org.apache.kafka.connect.json.JsonConverter
      # Production optimizations
      CONNECT_PRODUCER_BATCH_SIZE: 32768
      CONNECT_PRODUCER_LINGER_MS: 10
      CONNECT_PRODUCER_BUFFER_MEMORY: 67108864
      CONNECT_CONSUMER_MAX_POLL_RECORDS: 1000
      CONNECT_TASK_SHUTDOWN_GRACEFUL_TIMEOUT_MS: 30000
    volumes:
      - ./connectors:/kafka/connect/debezium-connector-mysql
      - ./transforms:/kafka/connect/transforms
    deploy:
      resources:
        limits:
          memory: 8G
        reservations:
          memory: 4G

  # Monitoring stack
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/alert_rules.yml:/etc/prometheus/alert_rules.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning

  sync-health-monitor:
    build:
      context: ./monitoring
      dockerfile: Dockerfile
    ports:
      - "8084:8084"
    environment:
      MYSQL_HOST: ${MYSQL_HOST}
      MYSQL_PORT: ${MYSQL_PORT}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_PORT: ${POSTGRES_PORT}
      POSTGRES_DATABASE: ${POSTGRES_DATABASE}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      KAFKA_BOOTSTRAP_SERVERS: kafka-1:29092,kafka-2:29092,kafka-3:29092
      KAFKA_CONNECT_URL: http://kafka-connect-1:8083
    depends_on:
      - kafka-1
      - kafka-connect-1

volumes:
  zookeeper-1-data:
  zookeeper-1-logs:
  zookeeper-2-data:
  zookeeper-2-logs:
  zookeeper-3-data:
  zookeeper-3-logs:
  kafka-1-data:
  kafka-2-data:
  kafka-3-data:
  prometheus-data:
  grafana-data:
```

## 🔧 Production Configuration

### Environment Variables

Create `.env.prod`:

```bash
# Database Configuration
MYSQL_HOST=mysql.production.com
MYSQL_PORT=3306
MYSQL_DATABASE=codeigniter_db
MYSQL_USER=debezium
MYSQL_PASSWORD=SecurePassword123!

POSTGRES_HOST=postgres.production.com
POSTGRES_PORT=5432
POSTGRES_DATABASE=nestjs_db
POSTGRES_USER=debezium
POSTGRES_PASSWORD=SecurePassword123!

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=kafka-1:29092,kafka-2:29092,kafka-3:29092
KAFKA_CONNECT_URL=http://kafka-connect-1:8083

# Security
KAFKA_SECURITY_PROTOCOL=SASL_SSL
KAFKA_SASL_MECHANISM=PLAIN
KAFKA_SASL_USERNAME=kafka-user
KAFKA_SASL_PASSWORD=kafka-password

# Monitoring
PROMETHEUS_RETENTION_DAYS=30
GRAFANA_ADMIN_PASSWORD=SecureGrafanaPassword123!
```

### Production Connector Configurations

#### MySQL Source Connector (Production)

```json
{
  "name": "mysql-source-connector-prod",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "tasks.max": "8",
    "database.hostname": "${MYSQL_HOST}",
    "database.port": "${MYSQL_PORT}",
    "database.user": "${MYSQL_USER}",
    "database.password": "${MYSQL_PASSWORD}",
    "database.server.id": "184054",
    "database.server.name": "mysql-prod",
    "database.include.list": "${MYSQL_DATABASE}",
    "table.include.list": "codeigniter_db.users,codeigniter_db.orders,codeigniter_db.products",
    
    "database.history.kafka.bootstrap.servers": "${KAFKA_BOOTSTRAP_SERVERS}",
    "database.history.kafka.topic": "mysql.history.prod",
    "database.history.consumer.security.protocol": "SASL_SSL",
    "database.history.producer.security.protocol": "SASL_SSL",
    
    "snapshot.mode": "when_needed",
    "snapshot.locking.mode": "minimal",
    "snapshot.new.tables": "parallel",
    "incremental.snapshot.chunk.size": "2048",
    
    "binlog.buffer.size": "65536",
    "max.batch.size": "4096",
    "max.queue.size": "16384",
    "poll.interval.ms": "500",
    
    "heartbeat.interval.ms": "30000",
    "heartbeat.topics.prefix": "__debezium-heartbeat",
    
    "transforms": "route,unwrap,addMetadata",
    "transforms.route.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.route.regex": "([^.]+)\\.([^.]+)\\.([^.]+)",
    "transforms.route.replacement": "mysql-to-postgres.$3",
    
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "false",
    "transforms.unwrap.delete.handling.mode": "rewrite",
    "transforms.unwrap.add.fields": "op,source.ts_ms,source.db,source.table",
    
    "transforms.addMetadata.type": "org.apache.kafka.connect.transforms.InsertField$Value",
    "transforms.addMetadata.static.field": "sync_source",
    "transforms.addMetadata.static.value": "mysql-prod",
    
    "errors.tolerance": "all",
    "errors.log.enable": "true",
    "errors.log.include.messages": "true"
  }
}
```

## 🚀 Deployment Steps

### 1. Infrastructure Setup

```bash
# Create production environment
mkdir -p /opt/debezium-sync
cd /opt/debezium-sync

# Copy configuration files
cp docker-compose.prod.yml docker-compose.yml
cp .env.prod .env

# Create necessary directories
mkdir -p {connectors,transforms,monitoring,scripts,logs}
```

### 2. Security Setup

```bash
# Generate SSL certificates for Kafka
./scripts/generate-ssl-certs.sh

# Create Kafka SASL users
./scripts/create-kafka-users.sh

# Set up database SSL certificates
./scripts/setup-db-ssl.sh
```

### 3. Start Services

```bash
# Start infrastructure in order
docker-compose up -d zookeeper-1 zookeeper-2 zookeeper-3
sleep 30

docker-compose up -d kafka-1 kafka-2 kafka-3
sleep 60

docker-compose up -d schema-registry
sleep 30

docker-compose up -d kafka-connect-1 kafka-connect-2 kafka-connect-3
sleep 60

# Start monitoring
docker-compose up -d prometheus grafana sync-health-monitor
```

### 4. Deploy Connectors

```bash
# Wait for Kafka Connect to be ready
./scripts/wait-for-kafka-connect.sh

# Deploy source connectors
./scripts/manage-connectors.sh deploy connectors/mysql-source-connector-prod.json
./scripts/manage-connectors.sh deploy connectors/postgres-source-connector-prod.json

# Wait and deploy sink connectors
sleep 60
./scripts/manage-connectors.sh deploy connectors/mysql-sink-connector-prod.json
./scripts/manage-connectors.sh deploy connectors/postgres-sink-connector-prod.json
```

### 5. Verify Deployment

```bash
# Check all services
docker-compose ps

# Verify connectors
./scripts/manage-connectors.sh list
./scripts/manage-connectors.sh monitor

# Check topics
docker exec kafka-1 kafka-topics --bootstrap-server localhost:9092 --list

# Test data flow
./scripts/test-sync.sh
```

## 📊 Production Monitoring

### Grafana Dashboards

Import the following dashboards:

1. **Kafka Cluster Overview**
   - Broker health and performance
   - Topic metrics and consumer lag
   - Network and disk I/O

2. **Debezium Connector Health**
   - Connector status and throughput
   - Error rates and retry metrics
   - Snapshot progress

3. **Database Sync Metrics**
   - Sync delays and latency
   - Data consistency checks
   - Conflict resolution statistics

4. **Infrastructure Metrics**
   - CPU, memory, and disk usage
   - Network performance
   - Container health

### Alerting Rules

Key alerts to configure:

```yaml
# Critical Alerts
- ConnectorDown (2 minutes)
- DatabaseConnectionLost (1 minute)
- HighSyncDelay (5 minutes, >300 seconds)
- DataInconsistencyDetected (immediate)

# Warning Alerts
- HighConsumerLag (5 minutes, >10000 messages)
- ConflictResolutionFailures (5 minutes, >10 failures)
- HighMemoryUsage (5 minutes, >90%)
- LowDiskSpace (5 minutes, <10%)
```

## 🔐 Security Best Practices

### Network Security

1. **Firewall Configuration**:
   ```bash
   # Allow only necessary ports
   ufw allow 9092/tcp  # Kafka
   ufw allow 8083/tcp  # Kafka Connect
   ufw allow 9090/tcp  # Prometheus
   ufw allow 3000/tcp  # Grafana
   ```

2. **VPC/Network Segmentation**:
   - Separate subnets for databases, Kafka, and monitoring
   - Private networking between components
   - Bastion host for administrative access

### Authentication & Authorization

1. **Kafka SASL/SSL**:
   ```properties
   security.protocol=SASL_SSL
   sasl.mechanism=SCRAM-SHA-512
   sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required username="debezium" password="password";
   ```

2. **Database SSL**:
   ```json
   {
     "database.ssl.mode": "required",
     "database.ssl.keystore": "/etc/ssl/kafka.keystore.jks",
     "database.ssl.truststore": "/etc/ssl/kafka.truststore.jks"
   }
   ```

### Secrets Management

Use external secret management:

```yaml
# docker-compose.yml
services:
  kafka-connect:
    environment:
      MYSQL_PASSWORD_FILE: /run/secrets/mysql_password
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - mysql_password
      - postgres_password

secrets:
  mysql_password:
    external: true
  postgres_password:
    external: true
```

## 🔄 Backup and Recovery

### Kafka Data Backup

1. **Topic Backup**:
   ```bash
   # Backup Kafka topics
   kafka-mirror-maker --consumer.config consumer.properties \
     --producer.config producer.properties \
     --whitelist "mysql-to-postgres.*,postgres-to-mysql.*"
   ```

2. **Offset Backup**:
   ```bash
   # Export consumer group offsets
   kafka-consumer-groups --bootstrap-server localhost:9092 \
     --group debezium-group --describe --export > offsets-backup.csv
   ```

### Database Backup

1. **MySQL Backup**:
   ```bash
   mysqldump --single-transaction --routines --triggers \
     --master-data=2 codeigniter_db > backup.sql
   ```

2. **PostgreSQL Backup**:
   ```bash
   pg_dump -Fc nestjs_db > backup.dump
   ```

### Recovery Procedures

1. **Connector Recovery**:
   ```bash
   # Stop connectors
   ./scripts/manage-connectors.sh pause mysql-source-connector

   # Restore from backup
   ./scripts/restore-connector-state.sh

   # Resume connectors
   ./scripts/manage-connectors.sh resume mysql-source-connector
   ```

2. **Full System Recovery**:
   ```bash
   # Restore Kafka cluster
   ./scripts/restore-kafka-cluster.sh

   # Restore databases
   ./scripts/restore-databases.sh

   # Redeploy connectors
   ./scripts/deploy-all-connectors.sh
   ```

## 📈 Performance Optimization

### Kafka Tuning

1. **Broker Configuration**:
   ```properties
   # Increase throughput
   num.network.threads=16
   num.io.threads=32
   socket.send.buffer.bytes=102400
   socket.receive.buffer.bytes=102400
   
   # Optimize for large messages
   message.max.bytes=10485760
   replica.fetch.max.bytes=10485760
   
   # Compression
   compression.type=lz4
   ```

2. **Topic Configuration**:
   ```bash
   # Create topics with optimal settings
   kafka-topics --create --topic mysql-to-postgres.users \
     --partitions 12 --replication-factor 3 \
     --config compression.type=lz4 \
     --config segment.ms=86400000
   ```

### Database Optimization

1. **MySQL Tuning**:
   ```sql
   -- Binary log optimization
   SET GLOBAL sync_binlog = 0;
   SET GLOBAL innodb_flush_log_at_trx_commit = 2;
   
   -- Connection optimization
   SET GLOBAL max_connections = 1000;
   SET GLOBAL thread_cache_size = 100;
   ```

2. **PostgreSQL Tuning**:
   ```sql
   -- WAL optimization
   ALTER SYSTEM SET wal_buffers = '64MB';
   ALTER SYSTEM SET checkpoint_completion_target = 0.9;
   
   -- Connection optimization
   ALTER SYSTEM SET max_connections = 1000;
   ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
   ```

## 🧪 Testing in Production

### Smoke Tests

```bash
#!/bin/bash
# Production smoke test script

echo "Running production smoke tests..."

# Test 1: Connector health
./scripts/manage-connectors.sh list | grep RUNNING || exit 1

# Test 2: Topic creation
kafka-topics --list --bootstrap-server localhost:9092 | grep mysql-to-postgres || exit 1

# Test 3: Data flow
./scripts/test-data-flow.sh || exit 1

# Test 4: Monitoring endpoints
curl -f http://localhost:9090/-/healthy || exit 1
curl -f http://localhost:3000/api/health || exit 1

echo "All smoke tests passed!"
```

### Load Testing

```bash
# Generate test load
./scripts/generate-load.sh --duration 300 --rate 1000

# Monitor performance
./scripts/monitor-performance.sh --duration 300
```

## 📋 Maintenance Procedures

### Regular Maintenance

1. **Weekly Tasks**:
   - Review connector performance metrics
   - Check disk space usage
   - Verify backup integrity
   - Update security patches

2. **Monthly Tasks**:
   - Rotate log files
   - Review and tune performance settings
   - Update monitoring dashboards
   - Conduct disaster recovery tests

3. **Quarterly Tasks**:
   - Major version updates
   - Security audit
   - Capacity planning review
   - Documentation updates

### Troubleshooting Runbook

Common production issues and solutions:

1. **High Consumer Lag**:
   ```bash
   # Increase connector tasks
   ./scripts/scale-connector.sh mysql-source-connector 8
   
   # Check for slow consumers
   kafka-consumer-groups --describe --group debezium-group
   ```

2. **Connector Failures**:
   ```bash
   # Check connector logs
   docker logs kafka-connect-1 | grep ERROR
   
   # Restart failed connector
   ./scripts/manage-connectors.sh restart mysql-source-connector
   ```

3. **Database Connection Issues**:
   ```bash
   # Test database connectivity
   ./scripts/test-db-connection.sh mysql
   ./scripts/test-db-connection.sh postgres
   
   # Check connection pool status
   ./scripts/check-connection-pools.sh
   ```

This deployment guide provides a comprehensive approach to running Debezium bidirectional synchronization in production. Follow the steps carefully and adapt the configurations to your specific environment and requirements.