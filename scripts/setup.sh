#!/bin/bash

# Debezium Bidirectional Sync Setup Script
set -e

echo "🚀 Setting up Debezium Bidirectional Database Synchronization"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Dependencies check passed ✓"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p connectors
    mkdir -p transforms
    mkdir -p scripts
    mkdir -p monitoring
    mkdir -p logs
    
    print_status "Directories created ✓"
}

# Start the infrastructure
start_infrastructure() {
    print_status "Starting Kafka infrastructure..."
    
    # Start Zookeeper, Kafka, and Kafka Connect
    docker-compose up -d zookeeper kafka schema-registry
    
    print_status "Waiting for Kafka to be ready..."
    sleep 30
    
    # Start Kafka Connect
    docker-compose up -d kafka-connect
    
    print_status "Waiting for Kafka Connect to be ready..."
    sleep 60
    
    # Start monitoring tools
    docker-compose up -d kafka-ui
    
    print_status "Infrastructure started ✓"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for Kafka Connect to be ready
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8083/connectors > /dev/null 2>&1; then
            print_status "Kafka Connect is ready ✓"
            break
        fi
        
        print_warning "Attempt $attempt/$max_attempts: Kafka Connect not ready yet..."
        sleep 10
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        print_error "Kafka Connect failed to start within expected time"
        exit 1
    fi
}

# Configure MySQL for CDC
configure_mysql() {
    print_status "Configuring MySQL for CDC..."
    
    # Wait for MySQL to be ready
    sleep 20
    
    docker exec mysql mysql -uroot -pmysql -e "
        CREATE USER IF NOT EXISTS 'debezium'@'%' IDENTIFIED BY 'debezium';
        GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'debezium'@'%';
        FLUSH PRIVILEGES;
        
        -- Enable binary logging if not already enabled
        SET GLOBAL binlog_format = 'ROW';
        SET GLOBAL binlog_row_image = 'FULL';
        
        -- Create sample table for testing
        USE codeigniter_db;
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    "
    
    print_status "MySQL configured ✓"
}

# Configure PostgreSQL for CDC
configure_postgresql() {
    print_status "Configuring PostgreSQL for CDC..."
    
    # Wait for PostgreSQL to be ready
    sleep 20
    
    docker exec postgres psql -U postgres -d nestjs_db -c "
        -- Create replication slot
        SELECT pg_create_logical_replication_slot('debezium_slot', 'pgoutput');
        
        -- Create publication for all tables
        CREATE PUBLICATION dbz_publication FOR ALL TABLES;
        
        -- Create sample table for testing
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create trigger for updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS \$\$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        \$\$ language 'plpgsql';
        
        CREATE TRIGGER update_users_updated_at 
            BEFORE UPDATE ON users 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    "
    
    print_status "PostgreSQL configured ✓"
}

# Deploy connectors
deploy_connectors() {
    print_status "Deploying Debezium connectors..."
    
    # Deploy MySQL source connector
    curl -X POST http://localhost:8083/connectors \
        -H "Content-Type: application/json" \
        -d @connectors/mysql-source-connector.json
    
    sleep 5
    
    # Deploy PostgreSQL source connector
    curl -X POST http://localhost:8083/connectors \
        -H "Content-Type: application/json" \
        -d @connectors/postgres-source-connector.json
    
    sleep 5
    
    # Note: Sink connectors would be deployed after JDBC connectors are available
    print_warning "Sink connectors need JDBC connectors to be installed separately"
    
    print_status "Source connectors deployed ✓"
}

# Main execution
main() {
    print_status "Starting Debezium Bidirectional Sync Setup..."
    
    check_dependencies
    create_directories
    start_infrastructure
    wait_for_services
    
    # Start databases if they don't exist
    docker-compose up -d mysql postgres
    
    configure_mysql
    configure_postgresql
    deploy_connectors
    
    print_status "Setup completed successfully! 🎉"
    print_status "Access Kafka UI at: http://localhost:8080"
    print_status "Kafka Connect REST API at: http://localhost:8083"
    
    echo ""
    print_warning "Next steps:"
    echo "1. Install JDBC sink connectors for bidirectional sync"
    echo "2. Configure your existing applications to connect to the databases"
    echo "3. Monitor the sync through Kafka UI"
    echo "4. Test with sample data"
}

# Run main function
main "$@"