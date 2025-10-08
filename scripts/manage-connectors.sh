#!/bin/bash

# Connector Management Script
set -e

KAFKA_CONNECT_URL="http://localhost:8083"

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
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Function to check if Kafka Connect is running
check_kafka_connect() {
    if ! curl -s "$KAFKA_CONNECT_URL/connectors" > /dev/null 2>&1; then
        print_error "Kafka Connect is not running or not accessible at $KAFKA_CONNECT_URL"
        exit 1
    fi
}

# List all connectors
list_connectors() {
    print_header "📋 Listing all connectors:"
    curl -s "$KAFKA_CONNECT_URL/connectors" | jq -r '.[]' | while read connector; do
        status=$(curl -s "$KAFKA_CONNECT_URL/connectors/$connector/status" | jq -r '.connector.state')
        echo -e "  • $connector: ${status}"
    done
}

# Get connector status
get_connector_status() {
    local connector_name=$1
    if [ -z "$connector_name" ]; then
        print_error "Connector name is required"
        return 1
    fi
    
    print_header "📊 Status for connector: $connector_name"
    curl -s "$KAFKA_CONNECT_URL/connectors/$connector_name/status" | jq '.'
}

# Create or update a connector
deploy_connector() {
    local config_file=$1
    if [ -z "$config_file" ] || [ ! -f "$config_file" ]; then
        print_error "Valid connector config file is required"
        return 1
    fi
    
    local connector_name=$(jq -r '.name' "$config_file")
    print_status "Deploying connector: $connector_name"
    
    # Check if connector already exists
    if curl -s "$KAFKA_CONNECT_URL/connectors/$connector_name" > /dev/null 2>&1; then
        print_warning "Connector $connector_name already exists. Updating..."
        curl -X PUT "$KAFKA_CONNECT_URL/connectors/$connector_name/config" \
            -H "Content-Type: application/json" \
            -d "$(jq '.config' "$config_file")"
    else
        print_status "Creating new connector: $connector_name"
        curl -X POST "$KAFKA_CONNECT_URL/connectors" \
            -H "Content-Type: application/json" \
            -d @"$config_file"
    fi
    
    echo ""
    print_status "Connector $connector_name deployed successfully"
}

# Delete a connector
delete_connector() {
    local connector_name=$1
    if [ -z "$connector_name" ]; then
        print_error "Connector name is required"
        return 1
    fi
    
    print_warning "Deleting connector: $connector_name"
    curl -X DELETE "$KAFKA_CONNECT_URL/connectors/$connector_name"
    print_status "Connector $connector_name deleted"
}

# Restart a connector
restart_connector() {
    local connector_name=$1
    if [ -z "$connector_name" ]; then
        print_error "Connector name is required"
        return 1
    fi
    
    print_status "Restarting connector: $connector_name"
    curl -X POST "$KAFKA_CONNECT_URL/connectors/$connector_name/restart"
    print_status "Connector $connector_name restarted"
}

# Pause a connector
pause_connector() {
    local connector_name=$1
    if [ -z "$connector_name" ]; then
        print_error "Connector name is required"
        return 1
    fi
    
    print_status "Pausing connector: $connector_name"
    curl -X PUT "$KAFKA_CONNECT_URL/connectors/$connector_name/pause"
    print_status "Connector $connector_name paused"
}

# Resume a connector
resume_connector() {
    local connector_name=$1
    if [ -z "$connector_name" ]; then
        print_error "Connector name is required"
        return 1
    fi
    
    print_status "Resuming connector: $connector_name"
    curl -X PUT "$KAFKA_CONNECT_URL/connectors/$connector_name/resume"
    print_status "Connector $connector_name resumed"
}

# Deploy all source connectors
deploy_all_sources() {
    print_header "🚀 Deploying all source connectors"
    
    if [ -f "connectors/mysql-source-connector.json" ]; then
        deploy_connector "connectors/mysql-source-connector.json"
    else
        print_warning "MySQL source connector config not found"
    fi
    
    if [ -f "connectors/postgres-source-connector.json" ]; then
        deploy_connector "connectors/postgres-source-connector.json"
    else
        print_warning "PostgreSQL source connector config not found"
    fi
}

# Deploy all sink connectors
deploy_all_sinks() {
    print_header "🎯 Deploying all sink connectors"
    
    if [ -f "connectors/mysql-sink-connector.json" ]; then
        deploy_connector "connectors/mysql-sink-connector.json"
    else
        print_warning "MySQL sink connector config not found"
    fi
    
    if [ -f "connectors/postgres-sink-connector.json" ]; then
        deploy_connector "connectors/postgres-sink-connector.json"
    else
        print_warning "PostgreSQL sink connector config not found"
    fi
}

# Monitor connector health
monitor_connectors() {
    print_header "🔍 Monitoring connector health"
    
    while true; do
        clear
        echo "=== Connector Health Monitor ==="
        echo "Press Ctrl+C to exit"
        echo ""
        
        curl -s "$KAFKA_CONNECT_URL/connectors" | jq -r '.[]' | while read connector; do
            status_json=$(curl -s "$KAFKA_CONNECT_URL/connectors/$connector/status")
            connector_state=$(echo "$status_json" | jq -r '.connector.state')
            task_count=$(echo "$status_json" | jq -r '.tasks | length')
            
            case $connector_state in
                "RUNNING")
                    echo -e "✅ $connector: ${GREEN}$connector_state${NC} ($task_count tasks)"
                    ;;
                "FAILED")
                    echo -e "❌ $connector: ${RED}$connector_state${NC} ($task_count tasks)"
                    ;;
                "PAUSED")
                    echo -e "⏸️  $connector: ${YELLOW}$connector_state${NC} ($task_count tasks)"
                    ;;
                *)
                    echo -e "⚠️  $connector: $connector_state ($task_count tasks)"
                    ;;
            esac
        done
        
        sleep 5
    done
}

# Show help
show_help() {
    echo "Debezium Connector Management Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  list                          List all connectors"
    echo "  status <connector-name>       Get connector status"
    echo "  deploy <config-file>          Deploy/update a connector"
    echo "  delete <connector-name>       Delete a connector"
    echo "  restart <connector-name>      Restart a connector"
    echo "  pause <connector-name>        Pause a connector"
    echo "  resume <connector-name>       Resume a connector"
    echo "  deploy-sources               Deploy all source connectors"
    echo "  deploy-sinks                 Deploy all sink connectors"
    echo "  monitor                      Monitor connector health"
    echo "  help                         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 status mysql-source-connector"
    echo "  $0 deploy connectors/mysql-source-connector.json"
    echo "  $0 restart postgres-source-connector"
}

# Main execution
main() {
    check_kafka_connect
    
    case "${1:-help}" in
        "list")
            list_connectors
            ;;
        "status")
            get_connector_status "$2"
            ;;
        "deploy")
            deploy_connector "$2"
            ;;
        "delete")
            delete_connector "$2"
            ;;
        "restart")
            restart_connector "$2"
            ;;
        "pause")
            pause_connector "$2"
            ;;
        "resume")
            resume_connector "$2"
            ;;
        "deploy-sources")
            deploy_all_sources
            ;;
        "deploy-sinks")
            deploy_all_sinks
            ;;
        "monitor")
            monitor_connectors
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function
main "$@"