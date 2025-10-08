# Debezium Bidirectional Database Synchronization

A comprehensive solution for real-time bidirectional synchronization between MySQL (CodeIgniter) and PostgreSQL (NestJS) databases using Debezium and Apache Kafka.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MySQL DB      │    │   Apache Kafka  │    │  PostgreSQL DB  │
│ (CodeIgniter)   │◄──►│   + Debezium    │◄──►│    (NestJS)     │
│   200+ Tables   │    │  Kafka Connect  │    │   New Project   │
│     50+ GB      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

- **Debezium MySQL Connector**: Captures changes from MySQL using binary logs
- **Debezium PostgreSQL Connector**: Captures changes from PostgreSQL using logical replication
- **Apache Kafka**: Message broker for reliable change event streaming
- **Kafka Connect**: Framework for running Debezium connectors
- **Custom Transformations**: Handle data type conversions and conflict resolution
- **Monitoring Stack**: Prometheus + custom health monitor for observability

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- At least 8GB RAM (recommended 16GB for production)
- 20GB free disk space

### 1. Clone and Setup

```bash
git clone <your-repo>
cd debezium-bidirectional-sync
chmod +x scripts/*.sh
```

### 2. Configure Database Connections

Edit the database connection settings in `docker-compose.yml` or set environment variables:

```bash
# MySQL Configuration
export MYSQL_HOST=your-mysql-host
export MYSQL_PORT=3306
export MYSQL_DATABASE=codeigniter_db
export MYSQL_USER=your-mysql-user
export MYSQL_PASSWORD=your-mysql-password

# PostgreSQL Configuration
export POSTGRES_HOST=your-postgres-host
export POSTGRES_PORT=5432
export POSTGRES_DATABASE=nestjs_db
export POSTGRES_USER=your-postgres-user
export POSTGRES_PASSWORD=your-postgres-password
```

### 3. Start the Infrastructure

```bash
./scripts/setup.sh
```

This script will:
- Start Kafka, Zookeeper, and Kafka Connect
- Configure MySQL for CDC (binary logging)
- Configure PostgreSQL for CDC (logical replication)
- Deploy Debezium source connectors
- Start monitoring services

### 4. Verify Setup

```bash
# Check connector status
./scripts/manage-connectors.sh list

# Monitor connector health
./scripts/manage-connectors.sh monitor

# Access Kafka UI
open http://localhost:8080
```

## 📊 Monitoring and Observability

### Kafka UI
- **URL**: http://localhost:8080
- **Features**: Topic browsing, connector management, message inspection

### Prometheus Metrics
- **URL**: http://localhost:9090
- **Custom Metrics**: Sync delays, data consistency, throughput

### Health Monitor
- **URL**: http://localhost:8084/metrics
- **Features**: Real-time sync health, conflict detection

## 🔧 Configuration

### MySQL Source Connector

Key configuration options in `connectors/mysql-source-connector.json`:

```json
{
  "database.hostname": "your-mysql-host",
  "database.include.list": "codeigniter_db",
  "snapshot.mode": "initial",
  "binlog.buffer.size": "32768",
  "max.batch.size": "2048"
}
```

### PostgreSQL Source Connector

Key configuration options in `connectors/postgres-source-connector.json`:

```json
{
  "database.hostname": "your-postgres-host",
  "schema.include.list": "public",
  "slot.name": "debezium_slot",
  "plugin.name": "pgoutput"
}
```

## 🔄 Data Flow and Transformations

### MySQL → PostgreSQL

1. **Change Capture**: Debezium MySQL connector reads binary logs
2. **Topic Routing**: Messages sent to `mysql-to-postgres.{table_name}` topics
3. **Transformation**: Data types converted (TINYINT → SMALLINT, etc.)
4. **Conflict Resolution**: Timestamp-based or priority-based resolution
5. **Sink**: JDBC sink connector writes to PostgreSQL

### PostgreSQL → MySQL

1. **Change Capture**: Debezium PostgreSQL connector reads WAL
2. **Topic Routing**: Messages sent to `postgres-to-mysql.{table_name}` topics
3. **Transformation**: Data types converted (JSONB → JSON, etc.)
4. **Conflict Resolution**: Same strategy as above
5. **Sink**: JDBC sink connector writes to MySQL

## 🛠️ Management Commands

### Connector Management

```bash
# List all connectors
./scripts/manage-connectors.sh list

# Check connector status
./scripts/manage-connectors.sh status mysql-source-connector

# Deploy a connector
./scripts/manage-connectors.sh deploy connectors/mysql-source-connector.json

# Restart a connector
./scripts/manage-connectors.sh restart postgres-source-connector

# Pause/Resume connectors
./scripts/manage-connectors.sh pause mysql-source-connector
./scripts/manage-connectors.sh resume mysql-source-connector
```

### Monitoring Commands

```bash
# Real-time connector monitoring
./scripts/manage-connectors.sh monitor

# Check Kafka topics
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# View topic messages
docker exec kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic mysql-to-postgres.users --from-beginning
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Connector Failed to Start

**Symptoms**: Connector status shows "FAILED"

**Solutions**:
```bash
# Check connector logs
docker logs kafka-connect

# Verify database connectivity
./scripts/manage-connectors.sh status mysql-source-connector

# Restart connector
./scripts/manage-connectors.sh restart mysql-source-connector
```

#### 2. High Sync Delay

**Symptoms**: Prometheus alerts for high sync delay

**Solutions**:
- Check Kafka consumer lag
- Increase connector `max.batch.size`
- Scale up Kafka Connect tasks
- Optimize database queries

#### 3. Data Inconsistency

**Symptoms**: Record count mismatch between databases

**Solutions**:
- Check for failed transactions
- Verify conflict resolution settings
- Run data reconciliation script
- Check for schema differences

#### 4. MySQL Binary Log Issues

**Symptoms**: MySQL connector fails to read binary logs

**Solutions**:
```sql
-- Check binary log configuration
SHOW VARIABLES LIKE 'log_bin';
SHOW VARIABLES LIKE 'binlog_format';

-- Enable binary logging
SET GLOBAL binlog_format = 'ROW';
```

#### 5. PostgreSQL Replication Slot Issues

**Symptoms**: PostgreSQL connector fails to create/use replication slot

**Solutions**:
```sql
-- Check replication slots
SELECT * FROM pg_replication_slots;

-- Create replication slot manually
SELECT pg_create_logical_replication_slot('debezium_slot', 'pgoutput');

-- Check WAL level
SHOW wal_level;
```

### Performance Tuning

#### For Large Databases (50GB+)

1. **Increase Kafka Resources**:
   ```yaml
   # In docker-compose.yml
   kafka:
     environment:
       KAFKA_NUM_NETWORK_THREADS: 16
       KAFKA_NUM_IO_THREADS: 32
       KAFKA_SOCKET_SEND_BUFFER_BYTES: 102400
   ```

2. **Optimize Connector Settings**:
   ```json
   {
     "max.batch.size": "4096",
     "max.queue.size": "16384",
     "snapshot.fetch.size": "10240"
   }
   ```

3. **Database Optimization**:
   - Ensure proper indexing on timestamp columns
   - Configure appropriate connection pooling
   - Monitor database performance metrics

## 🔐 Security Considerations

### Database Security

1. **Create dedicated sync users**:
   ```sql
   -- MySQL
   CREATE USER 'debezium'@'%' IDENTIFIED BY 'strong_password';
   GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'debezium'@'%';

   -- PostgreSQL
   CREATE USER debezium WITH REPLICATION LOGIN PASSWORD 'strong_password';
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO debezium;
   ```

2. **Use SSL connections**:
   ```json
   {
     "database.ssl.mode": "required",
     "database.ssl.keystore": "/path/to/keystore",
     "database.ssl.truststore": "/path/to/truststore"
   }
   ```

### Kafka Security

1. **Enable SASL/SSL**:
   ```yaml
   kafka:
     environment:
       KAFKA_SECURITY_INTER_BROKER_PROTOCOL: SASL_SSL
       KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL: PLAIN
   ```

2. **Configure ACLs** for topic access control

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Multiple Kafka Connect Workers**:
   ```bash
   docker-compose up --scale kafka-connect=3
   ```

2. **Kafka Cluster**:
   - Add more Kafka brokers
   - Increase topic partitions
   - Configure replication factor

3. **Database Read Replicas**:
   - Use read replicas for CDC
   - Reduce load on primary databases

### Vertical Scaling

1. **Increase Resources**:
   - More CPU cores for Kafka Connect
   - More RAM for Kafka brokers
   - Faster storage (SSD) for Kafka logs

## 🧪 Testing

### Test Data Synchronization

1. **Insert test data**:
   ```sql
   -- MySQL
   INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com');

   -- Check PostgreSQL
   SELECT * FROM mysql_users WHERE email = 'test@example.com';
   ```

2. **Monitor sync metrics**:
   ```bash
   curl http://localhost:8084/metrics | grep sync_delay
   ```

### Load Testing

Use the provided load testing script:
```bash
python scripts/load-test.py --records 10000 --concurrent 10
```

## 📚 Additional Resources

- [Debezium Documentation](https://debezium.io/documentation/)
- [Kafka Connect Documentation](https://kafka.apache.org/documentation/#connect)
- [MySQL Binary Log Configuration](https://dev.mysql.com/doc/refman/8.0/en/binary-log.html)
- [PostgreSQL Logical Replication](https://www.postgresql.org/docs/current/logical-replication.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Debezium community resources