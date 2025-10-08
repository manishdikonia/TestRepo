#!/bin/bash

# Database Synchronization Setup Script
# This script sets up the complete bidirectional sync environment

set -e

echo "🚀 Setting up Database Synchronization Environment..."

# Create necessary directories
mkdir -p logs
mkdir -p monitoring/logs
mkdir -p conflict-resolution/logs

# Start Docker services
echo "📦 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if Kafka is ready
echo "🔍 Checking Kafka status..."
until curl -s http://localhost:8080/api/clusters > /dev/null; do
    echo "Waiting for Kafka UI..."
    sleep 5
done

# Check if Debezium Connect is ready
echo "🔍 Checking Debezium Connect status..."
until curl -s http://localhost:8083/connectors > /dev/null; do
    echo "Waiting for Debezium Connect..."
    sleep 5
done

# Register MySQL connector
echo "📝 Registering MySQL connector..."
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d @debezium-mysql-connector.json

# Wait a bit for MySQL connector to initialize
sleep 10

# Register PostgreSQL connector
echo "📝 Registering PostgreSQL connector..."
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d @debezium-postgres-connector.json

# Install NestJS dependencies
echo "📦 Installing NestJS dependencies..."
cd nestjs-sync
npm install
cd ..

# Create PostgreSQL tables
echo "🗄️ Creating PostgreSQL tables..."
docker exec -i postgres-target psql -U postgres -d target_db << EOF
-- Create tables that match MySQL structure
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
EOF

# Set up monitoring cron job
echo "⏰ Setting up monitoring cron job..."
(crontab -l 2>/dev/null; echo "*/5 * * * * php $(pwd)/monitoring/sync-monitor.php") | crontab -

# Create environment files
echo "📝 Creating environment files..."
cat > nestjs-sync/.env << EOF
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=target_db
KAFKA_BROKERS=localhost:9092
EOF

# Build NestJS application
echo "🔨 Building NestJS application..."
cd nestjs-sync
npm run build
cd ..

echo "✅ Setup completed successfully!"
echo ""
echo "🌐 Services available at:"
echo "  - Kafka UI: http://localhost:8080"
echo "  - Debezium Connect: http://localhost:8083"
echo "  - NestJS Sync Service: http://localhost:3001"
echo ""
echo "📊 To start monitoring:"
echo "  php monitoring/sync-monitor.php"
echo ""
echo "🚀 To start NestJS service:"
echo "  cd nestjs-sync && npm run start:dev"
echo ""
echo "📝 To test synchronization:"
echo "  - Insert/update/delete data in MySQL (port 3306)"
echo "  - Check PostgreSQL (port 5432) for synchronized data"
echo "  - Monitor logs in the logs/ directory"