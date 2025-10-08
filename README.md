# Bidirectional Database Synchronization: MySQL ↔ PostgreSQL

This project implements real-time bidirectional synchronization between a MySQL database (legacy system) and a PostgreSQL database (new system) using Debezium and Apache Kafka.

## 🏗️ Architecture

The solution uses:
- **Apache Kafka** for event streaming
- **Debezium** for Change Data Capture (CDC)
- **NestJS** sync service for data transformation and conflict resolution
- **Docker Compose** for easy deployment

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- At least 8GB RAM available
- 10GB+ free disk space

## 🚀 Quick Start

1. **Clone and setup**
   ```bash
   git clone <repository>
   cd <project-directory>
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**
   ```bash
   ./scripts/start-services.sh
   ```

4. **Check sync status**
   ```bash
   ./scripts/check-sync-status.sh
   ```

## 📊 Service URLs

- **Kafka UI**: http://localhost:8080
- **Kafka Connect**: http://localhost:8083
- **Sync Service**: http://localhost:3000
- **Grafana** (if monitoring enabled): http://localhost:3001 (admin/admin)
- **MySQL**: localhost:3306
- **PostgreSQL**: localhost:5432

## 🔧 Configuration

### Table Mappings

Edit `sync-service/src/sync/table-mapping.service.ts` to configure table mappings:

```typescript
{
  source: {
    database: 'legacy_db',
    table: 'users',
    columns: [
      { source: 'id', target: 'id', type: 'int' },
      { source: 'username', target: 'username', type: 'varchar' },
      // ... more columns
    ]
  },
  target: {
    database: 'new_db',
    table: 'users',
    columns: []
  }
}
```

### Conflict Resolution

Configure conflict resolution strategy in `.env`:
- `timestamp`: Latest timestamp wins
- `version`: Higher version number wins
- `custom`: Custom logic

## 🏃 Running in Production

### Performance Considerations

1. **For 200+ tables**: 
   - Use selective synchronization
   - Configure appropriate Kafka partitions
   - Increase connector tasks

2. **For 50GB+ data**:
   - Perform initial sync during off-peak hours
   - Use batch processing for initial load
   - Configure appropriate memory limits

### Scaling

```yaml
# Increase Kafka Connect workers
kafka-connect:
  scale: 3
  
# Configure connector tasks
"tasks.max": "10"
```

### Monitoring

Enable monitoring for production:
```bash
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

## 🛠️ Development

### Local Development

```bash
cd sync-service
npm install
npm run start:dev
```

### Testing

```bash
# Insert test data in MySQL
docker exec -it mysql mysql -uroot -prootpassword legacy_db -e "
INSERT INTO users (username, email, password_hash) 
VALUES ('testuser', 'test@example.com', 'hash123');"

# Check if data synced to PostgreSQL
docker exec -it postgres psql -U postgres new_db -c "
SELECT * FROM users WHERE username='testuser';"
```

## 🔍 Troubleshooting

### Check Kafka Connect Status
```bash
curl http://localhost:8083/connectors/mysql-source-connector/status | jq .
```

### View Kafka Topics
```bash
docker exec kafka kafka-topics --list --bootstrap-server kafka:9092
```

### Check Consumer Lag
```bash
docker exec kafka kafka-consumer-groups --describe \
  --group db-sync-service --bootstrap-server kafka:9092
```

### View Sync Service Logs
```bash
docker-compose logs -f sync-service
```

## 🚨 Common Issues

1. **Loop Prevention**: Events are tagged with `sync_id` to prevent infinite loops
2. **Schema Differences**: Configure proper data type mappings
3. **Performance**: Adjust batch sizes and parallelism based on load
4. **Conflicts**: Monitor conflict resolution logs

## 📈 Performance Tuning

### Kafka Configuration
```properties
# Increase for better throughput
batch.size=32768
linger.ms=10
compression.type=snappy
```

### Debezium Configuration
```json
{
  "snapshot.mode": "schema_only",
  "snapshot.locking.mode": "none",
  "binlog.buffer.size": "0",
  "max.batch.size": "2048",
  "max.queue.size": "8192"
}
```

## 🔐 Security

1. Use SSL/TLS for Kafka connections in production
2. Implement proper authentication for all services
3. Encrypt sensitive data in transit and at rest
4. Use secrets management for credentials

## 📝 License

[Your License]

## 🤝 Contributing

[Contributing Guidelines]