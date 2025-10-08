#!/bin/bash

echo "Checking synchronization status..."
echo "================================"

# Check Kafka Connect status
echo "Kafka Connectors Status:"
curl -s http://localhost:8083/connectors | jq . || echo "Kafka Connect not available"
echo ""

# Check MySQL connector
echo "MySQL Connector Status:"
curl -s http://localhost:8083/connectors/mysql-source-connector/status | jq . || echo "MySQL connector not found"
echo ""

# Check PostgreSQL connector
echo "PostgreSQL Connector Status:"
curl -s http://localhost:8083/connectors/postgres-source-connector/status | jq . || echo "PostgreSQL connector not found"
echo ""

# Check Kafka topics
echo "Kafka Topics:"
docker exec kafka kafka-topics --list --bootstrap-server kafka:9092 | grep -E "(mysql|postgres|sync)" || echo "No sync topics found"
echo ""

# Check consumer lag
echo "Consumer Group Lag:"
docker exec kafka kafka-consumer-groups --bootstrap-server kafka:9092 --describe --group db-sync-service || echo "Consumer group not found"