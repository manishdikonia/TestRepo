#!/bin/bash

set -e

echo "Starting bidirectional database synchronization services..."

# Create necessary directories
mkdir -p logs
mkdir -p mysql-init
mkdir -p postgres-init
mkdir -p monitoring/grafana/{provisioning,dashboards}
mkdir -p monitoring/alertmanager

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from .env.example. Please update with your configuration."
fi

# Start main services
echo "Starting Kafka ecosystem..."
docker-compose up -d zookeeper kafka schema-registry kafka-connect kafka-ui

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
sleep 30

# Start databases
echo "Starting databases..."
docker-compose up -d mysql postgres

# Wait for databases to be ready
echo "Waiting for databases to initialize..."
sleep 20

# Deploy Debezium connectors
echo "Deploying Debezium connectors..."
cd connectors && ./deploy-connectors.sh && cd ..

# Build and start sync service
echo "Building sync service..."
cd sync-service
npm install
npm run build
cd ..

echo "Starting sync service..."
docker-compose up -d sync-service

# Start monitoring (optional)
read -p "Do you want to start monitoring services? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting monitoring services..."
    cd monitoring
    docker-compose -f docker-compose.monitoring.yml up -d
    cd ..
    echo "Monitoring services started. Access Grafana at http://localhost:3001 (admin/admin)"
fi

echo "All services started successfully!"
echo ""
echo "Service URLs:"
echo "- Kafka UI: http://localhost:8080"
echo "- Kafka Connect: http://localhost:8083"
echo "- MySQL: localhost:3306"
echo "- PostgreSQL: localhost:5432"
echo "- Sync Service: http://localhost:3000"
echo ""
echo "To view logs: docker-compose logs -f [service-name]"
echo "To stop all services: ./scripts/stop-services.sh"