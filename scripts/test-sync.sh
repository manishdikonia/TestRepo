#!/bin/bash

# Test Script for Bidirectional Database Synchronization
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

# Configuration
MYSQL_HOST=${MYSQL_HOST:-localhost}
MYSQL_PORT=${MYSQL_PORT:-3306}
MYSQL_DB=${MYSQL_DATABASE:-codeigniter_db}
MYSQL_USER=${MYSQL_USER:-mysql}
MYSQL_PASS=${MYSQL_PASSWORD:-mysql}

POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_DB=${POSTGRES_DATABASE:-nestjs_db}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_PASS=${POSTGRES_PASSWORD:-postgres}

KAFKA_BOOTSTRAP=${KAFKA_BOOTSTRAP_SERVERS:-localhost:9092}
KAFKA_CONNECT_URL=${KAFKA_CONNECT_URL:-http://localhost:8083}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    print_header "Running test: $test_name"
    
    if eval "$test_command"; then
        print_status "✅ PASSED: $test_name"
        ((TESTS_PASSED++))
    else
        print_error "❌ FAILED: $test_name"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 1: Check if services are running
test_services_running() {
    print_status "Checking if Docker services are running..."
    
    # Check Kafka
    if ! docker ps | grep -q kafka; then
        print_error "Kafka container is not running"
        return 1
    fi
    
    # Check Kafka Connect
    if ! docker ps | grep -q kafka-connect; then
        print_error "Kafka Connect container is not running"
        return 1
    fi
    
    # Check if Kafka Connect API is accessible
    if ! curl -s "$KAFKA_CONNECT_URL/connectors" > /dev/null; then
        print_error "Kafka Connect API is not accessible"
        return 1
    fi
    
    print_status "All services are running"
    return 0
}

# Test 2: Check connector status
test_connector_status() {
    print_status "Checking connector status..."
    
    local connectors=$(curl -s "$KAFKA_CONNECT_URL/connectors" | jq -r '.[]' 2>/dev/null)
    
    if [ -z "$connectors" ]; then
        print_error "No connectors found"
        return 1
    fi
    
    for connector in $connectors; do
        local status=$(curl -s "$KAFKA_CONNECT_URL/connectors/$connector/status" | jq -r '.connector.state' 2>/dev/null)
        if [ "$status" != "RUNNING" ]; then
            print_error "Connector $connector is in state: $status"
            return 1
        fi
        print_status "Connector $connector is RUNNING"
    done
    
    return 0
}

# Test 3: Check database connectivity
test_database_connectivity() {
    print_status "Testing database connectivity..."
    
    # Test MySQL connection
    if ! docker exec mysql mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASS" -e "SELECT 1;" > /dev/null 2>&1; then
        print_error "Cannot connect to MySQL database"
        return 1
    fi
    print_status "MySQL connection successful"
    
    # Test PostgreSQL connection
    if ! docker exec postgres psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1;" > /dev/null 2>&1; then
        print_error "Cannot connect to PostgreSQL database"
        return 1
    fi
    print_status "PostgreSQL connection successful"
    
    return 0
}

# Test 4: Check Kafka topics
test_kafka_topics() {
    print_status "Checking Kafka topics..."
    
    local topics=$(docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list 2>/dev/null)
    
    if ! echo "$topics" | grep -q "mysql"; then
        print_error "No MySQL topics found"
        return 1
    fi
    
    if ! echo "$topics" | grep -q "postgres"; then
        print_error "No PostgreSQL topics found"
        return 1
    fi
    
    print_status "Required Kafka topics exist"
    return 0
}

# Test 5: Test MySQL to PostgreSQL sync
test_mysql_to_postgres_sync() {
    print_status "Testing MySQL to PostgreSQL synchronization..."
    
    # Generate unique test data
    local test_id=$(date +%s)
    local test_name="TestUser_${test_id}"
    local test_email="test_${test_id}@example.com"
    
    # Insert data into MySQL
    docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
        INSERT INTO users (name, email) VALUES ('$test_name', '$test_email');
    " 2>/dev/null
    
    if [ $? -ne 0 ]; then
        print_error "Failed to insert test data into MySQL"
        return 1
    fi
    
    print_status "Inserted test data into MySQL: $test_email"
    
    # Wait for synchronization
    print_status "Waiting for synchronization (30 seconds)..."
    sleep 30
    
    # Check if data exists in PostgreSQL
    local pg_result=$(docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "
        SELECT COUNT(*) FROM mysql_users WHERE email = '$test_email';
    " 2>/dev/null | tr -d ' ')
    
    if [ "$pg_result" != "1" ]; then
        print_error "Test data not found in PostgreSQL. Expected: 1, Found: $pg_result"
        return 1
    fi
    
    print_status "Test data successfully synchronized to PostgreSQL"
    
    # Cleanup
    docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
        DELETE FROM users WHERE email = '$test_email';
    " 2>/dev/null
    
    return 0
}

# Test 6: Test PostgreSQL to MySQL sync
test_postgres_to_mysql_sync() {
    print_status "Testing PostgreSQL to MySQL synchronization..."
    
    # Generate unique test data
    local test_id=$(date +%s)
    local test_name="TestUser_PG_${test_id}"
    local test_email="test_pg_${test_id}@example.com"
    
    # Insert data into PostgreSQL
    docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
        INSERT INTO users (name, email) VALUES ('$test_name', '$test_email');
    " > /dev/null 2>&1
    
    if [ $? -ne 0 ]; then
        print_error "Failed to insert test data into PostgreSQL"
        return 1
    fi
    
    print_status "Inserted test data into PostgreSQL: $test_email"
    
    # Wait for synchronization
    print_status "Waiting for synchronization (30 seconds)..."
    sleep 30
    
    # Check if data exists in MySQL
    local mysql_result=$(docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -se "
        SELECT COUNT(*) FROM postgres_users WHERE email = '$test_email';
    " 2>/dev/null)
    
    if [ "$mysql_result" != "1" ]; then
        print_error "Test data not found in MySQL. Expected: 1, Found: $mysql_result"
        return 1
    fi
    
    print_status "Test data successfully synchronized to MySQL"
    
    # Cleanup
    docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
        DELETE FROM users WHERE email = '$test_email';
    " > /dev/null 2>&1
    
    return 0
}

# Test 7: Test update synchronization
test_update_sync() {
    print_status "Testing update synchronization..."
    
    # Generate unique test data
    local test_id=$(date +%s)
    local test_name="UpdateTest_${test_id}"
    local test_email="update_test_${test_id}@example.com"
    local updated_name="UpdatedTest_${test_id}"
    
    # Insert data into MySQL
    docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
        INSERT INTO users (name, email) VALUES ('$test_name', '$test_email');
    " 2>/dev/null
    
    # Wait for initial sync
    sleep 15
    
    # Update the record
    docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
        UPDATE users SET name = '$updated_name' WHERE email = '$test_email';
    " 2>/dev/null
    
    # Wait for update sync
    sleep 15
    
    # Check if update is synchronized to PostgreSQL
    local pg_name=$(docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "
        SELECT name FROM mysql_users WHERE email = '$test_email';
    " 2>/dev/null | tr -d ' ')
    
    if [ "$pg_name" != "$updated_name" ]; then
        print_error "Update not synchronized. Expected: $updated_name, Found: $pg_name"
        return 1
    fi
    
    print_status "Update successfully synchronized"
    
    # Cleanup
    docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
        DELETE FROM users WHERE email = '$test_email';
    " 2>/dev/null
    
    return 0
}

# Test 8: Test delete synchronization
test_delete_sync() {
    print_status "Testing delete synchronization..."
    
    # Generate unique test data
    local test_id=$(date +%s)
    local test_name="DeleteTest_${test_id}"
    local test_email="delete_test_${test_id}@example.com"
    
    # Insert data into MySQL
    docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
        INSERT INTO users (name, email) VALUES ('$test_name', '$test_email');
    " 2>/dev/null
    
    # Wait for initial sync
    sleep 15
    
    # Delete the record
    docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
        DELETE FROM users WHERE email = '$test_email';
    " 2>/dev/null
    
    # Wait for delete sync
    sleep 15
    
    # Check if delete is synchronized to PostgreSQL
    local pg_count=$(docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "
        SELECT COUNT(*) FROM mysql_users WHERE email = '$test_email';
    " 2>/dev/null | tr -d ' ')
    
    if [ "$pg_count" != "0" ]; then
        print_error "Delete not synchronized. Expected: 0, Found: $pg_count"
        return 1
    fi
    
    print_status "Delete successfully synchronized"
    return 0
}

# Test 9: Check monitoring endpoints
test_monitoring_endpoints() {
    print_status "Testing monitoring endpoints..."
    
    # Check Kafka UI
    if ! curl -s http://localhost:8080 > /dev/null; then
        print_warning "Kafka UI is not accessible (this is optional)"
    else
        print_status "Kafka UI is accessible"
    fi
    
    # Check sync health monitor
    if ! curl -s http://localhost:8084/metrics > /dev/null; then
        print_warning "Sync health monitor is not accessible (this is optional)"
    else
        print_status "Sync health monitor is accessible"
    fi
    
    return 0
}

# Test 10: Performance test
test_performance() {
    print_status "Running basic performance test..."
    
    local start_time=$(date +%s)
    local record_count=100
    
    # Insert multiple records
    for i in $(seq 1 $record_count); do
        local test_email="perf_test_${start_time}_${i}@example.com"
        docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
            INSERT INTO users (name, email) VALUES ('PerfTest_${i}', '$test_email');
        " 2>/dev/null
    done
    
    local insert_end_time=$(date +%s)
    local insert_duration=$((insert_end_time - start_time))
    
    print_status "Inserted $record_count records in $insert_duration seconds"
    
    # Wait for synchronization
    sleep 30
    
    # Check synchronized count
    local pg_count=$(docker exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "
        SELECT COUNT(*) FROM mysql_users WHERE email LIKE 'perf_test_${start_time}_%';
    " 2>/dev/null | tr -d ' ')
    
    local sync_end_time=$(date +%s)
    local total_duration=$((sync_end_time - start_time))
    
    if [ "$pg_count" -eq "$record_count" ]; then
        print_status "All $record_count records synchronized in $total_duration seconds"
        print_status "Average sync rate: $(echo "scale=2; $record_count / $total_duration" | bc) records/second"
    else
        print_error "Performance test failed. Expected: $record_count, Synchronized: $pg_count"
        return 1
    fi
    
    # Cleanup
    docker exec mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -e "
        DELETE FROM users WHERE email LIKE 'perf_test_${start_time}_%';
    " 2>/dev/null
    
    return 0
}

# Main test execution
main() {
    print_header "🧪 Starting Debezium Bidirectional Sync Tests"
    echo ""
    
    # Run all tests
    run_test "Services Running" "test_services_running"
    run_test "Connector Status" "test_connector_status"
    run_test "Database Connectivity" "test_database_connectivity"
    run_test "Kafka Topics" "test_kafka_topics"
    run_test "MySQL to PostgreSQL Sync" "test_mysql_to_postgres_sync"
    run_test "PostgreSQL to MySQL Sync" "test_postgres_to_mysql_sync"
    run_test "Update Synchronization" "test_update_sync"
    run_test "Delete Synchronization" "test_delete_sync"
    run_test "Monitoring Endpoints" "test_monitoring_endpoints"
    run_test "Performance Test" "test_performance"
    
    # Print summary
    echo ""
    print_header "📊 Test Summary"
    echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
    echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
    echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo ""
        print_status "🎉 All tests passed! Your bidirectional sync is working correctly."
        exit 0
    else
        echo ""
        print_error "❌ Some tests failed. Please check the logs and fix the issues."
        exit 1
    fi
}

# Check if bc is available for calculations
if ! command -v bc &> /dev/null; then
    print_warning "bc command not found. Installing..."
    apt-get update && apt-get install -y bc 2>/dev/null || yum install -y bc 2>/dev/null || true
fi

# Check if jq is available for JSON parsing
if ! command -v jq &> /dev/null; then
    print_warning "jq command not found. Installing..."
    apt-get update && apt-get install -y jq 2>/dev/null || yum install -y jq 2>/dev/null || true
fi

# Run main function
main "$@"