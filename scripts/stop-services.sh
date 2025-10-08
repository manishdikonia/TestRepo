#!/bin/bash

echo "Stopping all services..."

# Stop monitoring services if running
if [ -d "monitoring" ]; then
    cd monitoring
    docker-compose -f docker-compose.monitoring.yml down
    cd ..
fi

# Stop main services
docker-compose down

echo "All services stopped."