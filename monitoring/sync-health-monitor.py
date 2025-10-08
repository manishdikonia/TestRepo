#!/usr/bin/env python3
"""
Sync Health Monitor - Custom monitoring service for Debezium bidirectional sync
Exposes Prometheus metrics for sync health, delays, and inconsistencies
"""

import time
import json
import logging
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import requests
import psycopg2
import mysql.connector
from prometheus_client import start_http_server, Gauge, Counter, Histogram
from kafka import KafkaConsumer
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Prometheus metrics
sync_delay_gauge = Gauge('sync_delay_seconds', 'Sync delay between databases', ['source_db', 'target_db', 'table'])
data_inconsistency_gauge = Gauge('data_inconsistency_count', 'Number of data inconsistencies detected', ['table'])
conflict_resolution_counter = Counter('conflict_resolution_failures_total', 'Total conflict resolution failures', ['table'])
database_connection_gauge = Gauge('database_connection_status', 'Database connection status', ['database'])
sync_throughput_gauge = Gauge('sync_throughput_records_per_second', 'Sync throughput in records per second', ['direction'])
connector_status_gauge = Gauge('kafka_connect_connector_status', 'Kafka Connect connector status', ['connector', 'state'])

class DatabaseConfig:
    def __init__(self, db_type: str, host: str, port: int, database: str, username: str, password: str):
        self.db_type = db_type
        self.host = host
        self.port = port
        self.database = database
        self.username = username
        self.password = password

class SyncHealthMonitor:
    def __init__(self):
        self.mysql_config = DatabaseConfig(
            db_type='mysql',
            host=os.getenv('MYSQL_HOST', 'localhost'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            database=os.getenv('MYSQL_DATABASE', 'codeigniter_db'),
            username=os.getenv('MYSQL_USER', 'mysql'),
            password=os.getenv('MYSQL_PASSWORD', 'mysql')
        )
        
        self.postgres_config = DatabaseConfig(
            db_type='postgres',
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            port=int(os.getenv('POSTGRES_PORT', 5432)),
            database=os.getenv('POSTGRES_DATABASE', 'nestjs_db'),
            username=os.getenv('POSTGRES_USER', 'postgres'),
            password=os.getenv('POSTGRES_PASSWORD', 'postgres')
        )
        
        self.kafka_bootstrap_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
        self.kafka_connect_url = os.getenv('KAFKA_CONNECT_URL', 'http://localhost:8083')
        
        self.running = True
        self.last_sync_times = {}
        self.throughput_counters = {'mysql_to_postgres': 0, 'postgres_to_mysql': 0}
        
    def get_mysql_connection(self):
        """Get MySQL database connection"""
        try:
            connection = mysql.connector.connect(
                host=self.mysql_config.host,
                port=self.mysql_config.port,
                database=self.mysql_config.database,
                user=self.mysql_config.username,
                password=self.mysql_config.password
            )
            database_connection_gauge.labels(database='mysql').set(1)
            return connection
        except Exception as e:
            logger.error(f"Failed to connect to MySQL: {e}")
            database_connection_gauge.labels(database='mysql').set(0)
            return None
    
    def get_postgres_connection(self):
        """Get PostgreSQL database connection"""
        try:
            connection = psycopg2.connect(
                host=self.postgres_config.host,
                port=self.postgres_config.port,
                database=self.postgres_config.database,
                user=self.postgres_config.username,
                password=self.postgres_config.password
            )
            database_connection_gauge.labels(database='postgres').set(1)
            return connection
        except Exception as e:
            logger.error(f"Failed to connect to PostgreSQL: {e}")
            database_connection_gauge.labels(database='postgres').set(0)
            return None
    
    def check_connector_status(self):
        """Check Kafka Connect connector status"""
        try:
            response = requests.get(f"{self.kafka_connect_url}/connectors")
            if response.status_code == 200:
                connectors = response.json()
                
                for connector in connectors:
                    status_response = requests.get(f"{self.kafka_connect_url}/connectors/{connector}/status")
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        connector_state = status_data.get('connector', {}).get('state', 'UNKNOWN')
                        
                        # Set metric based on state
                        state_value = 1 if connector_state == 'RUNNING' else 0
                        connector_status_gauge.labels(connector=connector, state=connector_state).set(state_value)
                        
                        logger.info(f"Connector {connector}: {connector_state}")
            
        except Exception as e:
            logger.error(f"Failed to check connector status: {e}")
    
    def monitor_sync_delay(self):
        """Monitor synchronization delay between databases"""
        try:
            mysql_conn = self.get_mysql_connection()
            postgres_conn = self.get_postgres_connection()
            
            if not mysql_conn or not postgres_conn:
                return
            
            # Check common tables (you'll need to adapt this to your schema)
            common_tables = ['users']  # Add your table names here
            
            for table in common_tables:
                try:
                    # Get latest update time from MySQL
                    mysql_cursor = mysql_conn.cursor()
                    mysql_cursor.execute(f"SELECT MAX(updated_at) FROM {table}")
                    mysql_latest = mysql_cursor.fetchone()[0]
                    
                    # Get latest update time from PostgreSQL
                    postgres_cursor = postgres_conn.cursor()
                    postgres_cursor.execute(f"SELECT MAX(updated_at) FROM mysql_{table}")
                    postgres_latest = postgres_cursor.fetchone()[0]
                    
                    if mysql_latest and postgres_latest:
                        delay = abs((mysql_latest - postgres_latest).total_seconds())
                        sync_delay_gauge.labels(source_db='mysql', target_db='postgres', table=table).set(delay)
                        logger.info(f"Sync delay for {table}: {delay} seconds")
                    
                    mysql_cursor.close()
                    postgres_cursor.close()
                    
                except Exception as e:
                    logger.error(f"Failed to check sync delay for table {table}: {e}")
            
            mysql_conn.close()
            postgres_conn.close()
            
        except Exception as e:
            logger.error(f"Failed to monitor sync delay: {e}")
    
    def check_data_consistency(self):
        """Check for data inconsistencies between databases"""
        try:
            mysql_conn = self.get_mysql_connection()
            postgres_conn = self.get_postgres_connection()
            
            if not mysql_conn or not postgres_conn:
                return
            
            common_tables = ['users']  # Add your table names here
            
            for table in common_tables:
                try:
                    # Count records in MySQL
                    mysql_cursor = mysql_conn.cursor()
                    mysql_cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    mysql_count = mysql_cursor.fetchone()[0]
                    
                    # Count records in PostgreSQL
                    postgres_cursor = postgres_conn.cursor()
                    postgres_cursor.execute(f"SELECT COUNT(*) FROM mysql_{table}")
                    postgres_count = postgres_cursor.fetchone()[0]
                    
                    inconsistency_count = abs(mysql_count - postgres_count)
                    data_inconsistency_gauge.labels(table=table).set(inconsistency_count)
                    
                    if inconsistency_count > 0:
                        logger.warning(f"Data inconsistency in {table}: MySQL={mysql_count}, PostgreSQL={postgres_count}")
                    
                    mysql_cursor.close()
                    postgres_cursor.close()
                    
                except Exception as e:
                    logger.error(f"Failed to check consistency for table {table}: {e}")
            
            mysql_conn.close()
            postgres_conn.close()
            
        except Exception as e:
            logger.error(f"Failed to check data consistency: {e}")
    
    def monitor_kafka_throughput(self):
        """Monitor Kafka message throughput"""
        try:
            consumer = KafkaConsumer(
                bootstrap_servers=self.kafka_bootstrap_servers,
                auto_offset_reset='latest',
                enable_auto_commit=True,
                group_id='sync-monitor',
                value_deserializer=lambda x: json.loads(x.decode('utf-8')) if x else None
            )
            
            # Subscribe to sync topics
            consumer.subscribe(['mysql-to-postgres.*', 'postgres-to-mysql.*'])
            
            start_time = time.time()
            message_count = {'mysql_to_postgres': 0, 'postgres_to_mysql': 0}
            
            for message in consumer:
                if not self.running:
                    break
                
                topic = message.topic
                if 'mysql-to-postgres' in topic:
                    message_count['mysql_to_postgres'] += 1
                elif 'postgres-to-mysql' in topic:
                    message_count['postgres_to_mysql'] += 1
                
                # Calculate throughput every 60 seconds
                current_time = time.time()
                if current_time - start_time >= 60:
                    for direction, count in message_count.items():
                        throughput = count / 60.0
                        sync_throughput_gauge.labels(direction=direction).set(throughput)
                        logger.info(f"Throughput {direction}: {throughput:.2f} records/sec")
                    
                    # Reset counters
                    message_count = {'mysql_to_postgres': 0, 'postgres_to_mysql': 0}
                    start_time = current_time
            
            consumer.close()
            
        except Exception as e:
            logger.error(f"Failed to monitor Kafka throughput: {e}")
    
    def run_monitoring_loop(self):
        """Main monitoring loop"""
        logger.info("Starting sync health monitoring...")
        
        while self.running:
            try:
                # Check connector status
                self.check_connector_status()
                
                # Monitor sync delay
                self.monitor_sync_delay()
                
                # Check data consistency
                self.check_data_consistency()
                
                # Wait before next check
                time.sleep(30)
                
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                time.sleep(10)
    
    def start(self):
        """Start the monitoring service"""
        logger.info("Starting Sync Health Monitor...")
        
        # Start Prometheus metrics server
        start_http_server(8084)
        logger.info("Prometheus metrics server started on port 8084")
        
        # Start monitoring threads
        monitoring_thread = threading.Thread(target=self.run_monitoring_loop)
        monitoring_thread.daemon = True
        monitoring_thread.start()
        
        # Start Kafka throughput monitoring
        kafka_thread = threading.Thread(target=self.monitor_kafka_throughput)
        kafka_thread.daemon = True
        kafka_thread.start()
        
        try:
            # Keep the main thread alive
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Shutting down...")
            self.running = False

if __name__ == "__main__":
    monitor = SyncHealthMonitor()
    monitor.start()