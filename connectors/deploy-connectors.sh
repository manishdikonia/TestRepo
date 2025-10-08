#!/bin/bash

# Wait for Kafka Connect to be ready
echo "Waiting for Kafka Connect to be ready..."
until curl -s -f http://localhost:8083/connector-plugins > /dev/null; do
  echo "Kafka Connect not ready yet, waiting..."
  sleep 5
done

echo "Kafka Connect is ready!"

# Deploy MySQL source connector
echo "Deploying MySQL source connector..."
curl -i -X POST -H "Accept:application/json" \
  -H "Content-Type:application/json" \
  http://localhost:8083/connectors/ \
  -d @mysql-source-connector.json

sleep 2

# Deploy PostgreSQL source connector
echo "Deploying PostgreSQL source connector..."
curl -i -X POST -H "Accept:application/json" \
  -H "Content-Type:application/json" \
  http://localhost:8083/connectors/ \
  -d @postgres-source-connector.json

echo "Connectors deployed successfully!"

# Check connector status
echo "Checking connector status..."
curl -s http://localhost:8083/connectors/mysql-source-connector/status | jq .
curl -s http://localhost:8083/connectors/postgres-source-connector/status | jq .