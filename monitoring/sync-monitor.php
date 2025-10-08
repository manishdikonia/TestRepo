<?php

class SyncMonitor {
    
    private $log_file;
    private $metrics_file;
    private $alert_thresholds;
    
    public function __construct() {
        $this->log_file = __DIR__ . '/logs/sync-monitor.log';
        $this->metrics_file = __DIR__ . '/logs/metrics.json';
        $this->alert_thresholds = [
            'error_rate' => 0.05, // 5% error rate
            'latency_ms' => 5000,  // 5 seconds
            'queue_size' => 1000   // 1000 messages
        ];
    }
    
    /**
     * Monitor synchronization health
     */
    public function monitorHealth() {
        $metrics = $this->collectMetrics();
        $this->saveMetrics($metrics);
        $this->checkAlerts($metrics);
        
        return $metrics;
    }
    
    private function collectMetrics() {
        return [
            'timestamp' => time(),
            'mysql_connector_status' => $this->checkMysqlConnector(),
            'postgres_connector_status' => $this->checkPostgresConnector(),
            'kafka_status' => $this->checkKafka(),
            'error_count' => $this->getErrorCount(),
            'success_count' => $this->getSuccessCount(),
            'queue_size' => $this->getQueueSize(),
            'latency' => $this->getAverageLatency(),
            'memory_usage' => memory_get_usage(true),
            'disk_usage' => $this->getDiskUsage()
        ];
    }
    
    private function checkMysqlConnector() {
        // Check if MySQL Debezium connector is running
        $url = 'http://localhost:8083/connectors/mysql-source-connector/status';
        $response = $this->makeHttpRequest($url);
        
        if ($response && isset($response['connector']['state'])) {
            return $response['connector']['state'] === 'RUNNING';
        }
        
        return false;
    }
    
    private function checkPostgresConnector() {
        // Check if PostgreSQL Debezium connector is running
        $url = 'http://localhost:8083/connectors/postgres-source-connector/status';
        $response = $this->makeHttpRequest($url);
        
        if ($response && isset($response['connector']['state'])) {
            return $response['connector']['state'] === 'RUNNING';
        }
        
        return false;
    }
    
    private function checkKafka() {
        // Check if Kafka is accessible
        $url = 'http://localhost:8080/api/clusters';
        $response = $this->makeHttpRequest($url);
        
        return $response !== false;
    }
    
    private function getErrorCount() {
        // Count errors in the last hour
        $log_file = __DIR__ . '/logs/sync.log';
        if (!file_exists($log_file)) {
            return 0;
        }
        
        $one_hour_ago = time() - 3600;
        $error_count = 0;
        
        $handle = fopen($log_file, 'r');
        while (($line = fgets($handle)) !== false) {
            if (strpos($line, 'ERROR') !== false) {
                $timestamp = $this->extractTimestamp($line);
                if ($timestamp && $timestamp > $one_hour_ago) {
                    $error_count++;
                }
            }
        }
        fclose($handle);
        
        return $error_count;
    }
    
    private function getSuccessCount() {
        // Count successful operations in the last hour
        $log_file = __DIR__ . '/logs/sync.log';
        if (!file_exists($log_file)) {
            return 0;
        }
        
        $one_hour_ago = time() - 3600;
        $success_count = 0;
        
        $handle = fopen($log_file, 'r');
        while (($line = fgets($handle)) !== false) {
            if (strpos($line, 'Processed') !== false || strpos($line, 'Created') !== false || 
                strpos($line, 'Updated') !== false || strpos($line, 'Deleted') !== false) {
                $timestamp = $this->extractTimestamp($line);
                if ($timestamp && $timestamp > $one_hour_ago) {
                    $success_count++;
                }
            }
        }
        fclose($handle);
        
        return $success_count;
    }
    
    private function getQueueSize() {
        // Get Kafka queue size (simplified)
        $url = 'http://localhost:8080/api/clusters/local/topics';
        $response = $this->makeHttpRequest($url);
        
        if ($response && is_array($response)) {
            $total_messages = 0;
            foreach ($response as $topic) {
                if (isset($topic['partitions'])) {
                    foreach ($topic['partitions'] as $partition) {
                        $total_messages += $partition['size'] ?? 0;
                    }
                }
            }
            return $total_messages;
        }
        
        return 0;
    }
    
    private function getAverageLatency() {
        // Calculate average processing latency
        $metrics_file = $this->metrics_file;
        if (!file_exists($metrics_file)) {
            return 0;
        }
        
        $metrics = json_decode(file_get_contents($metrics_file), true);
        if (!$metrics || !isset($metrics['latency_history'])) {
            return 0;
        }
        
        $latencies = array_slice($metrics['latency_history'], -100); // Last 100 measurements
        return array_sum($latencies) / count($latencies);
    }
    
    private function getDiskUsage() {
        $bytes = disk_free_space(__DIR__);
        return $bytes !== false ? $bytes : 0;
    }
    
    private function checkAlerts($metrics) {
        $alerts = [];
        
        // Check error rate
        $total_operations = $metrics['error_count'] + $metrics['success_count'];
        if ($total_operations > 0) {
            $error_rate = $metrics['error_count'] / $total_operations;
            if ($error_rate > $this->alert_thresholds['error_rate']) {
                $alerts[] = "High error rate: " . round($error_rate * 100, 2) . "%";
            }
        }
        
        // Check latency
        if ($metrics['latency'] > $this->alert_thresholds['latency_ms']) {
            $alerts[] = "High latency: " . round($metrics['latency'], 2) . "ms";
        }
        
        // Check queue size
        if ($metrics['queue_size'] > $this->alert_thresholds['queue_size']) {
            $alerts[] = "Large queue size: " . $metrics['queue_size'] . " messages";
        }
        
        // Check connector status
        if (!$metrics['mysql_connector_status']) {
            $alerts[] = "MySQL connector is not running";
        }
        
        if (!$metrics['postgres_connector_status']) {
            $alerts[] = "PostgreSQL connector is not running";
        }
        
        if (!$metrics['kafka_status']) {
            $alerts[] = "Kafka is not accessible";
        }
        
        // Send alerts
        if (!empty($alerts)) {
            $this->sendAlerts($alerts);
        }
    }
    
    private function sendAlerts($alerts) {
        $message = "Sync Monitor Alert:\n" . implode("\n", $alerts);
        $this->log("ALERT: " . $message);
        
        // In a real implementation, you would send emails, Slack notifications, etc.
        // For now, we'll just log the alert
    }
    
    private function saveMetrics($metrics) {
        $existing_metrics = [];
        if (file_exists($this->metrics_file)) {
            $existing_metrics = json_decode(file_get_contents($this->metrics_file), true) ?: [];
        }
        
        // Keep only last 1000 measurements
        if (isset($existing_metrics['history'])) {
            $existing_metrics['history'] = array_slice($existing_metrics['history'], -999);
        }
        
        $existing_metrics['history'][] = $metrics;
        $existing_metrics['last_updated'] = time();
        
        file_put_contents($this->metrics_file, json_encode($existing_metrics, JSON_PRETTY_PRINT));
    }
    
    private function makeHttpRequest($url) {
        $context = stream_context_create([
            'http' => [
                'timeout' => 5,
                'method' => 'GET'
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        return $response ? json_decode($response, true) : false;
    }
    
    private function extractTimestamp($log_line) {
        // Extract timestamp from log line format: [2024-01-01 12:00:00] message
        if (preg_match('/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/', $log_line, $matches)) {
            return strtotime($matches[1]);
        }
        return null;
    }
    
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        $log_entry = "[$timestamp] $message" . PHP_EOL;
        file_put_contents($this->log_file, $log_entry, FILE_APPEND | LOCK_EX);
    }
    
    /**
     * Generate health report
     */
    public function generateReport() {
        $metrics = $this->collectMetrics();
        
        $report = [
            'timestamp' => date('Y-m-d H:i:s'),
            'overall_status' => $this->getOverallStatus($metrics),
            'connectors' => [
                'mysql' => $metrics['mysql_connector_status'] ? 'RUNNING' : 'STOPPED',
                'postgres' => $metrics['postgres_connector_status'] ? 'RUNNING' : 'STOPPED'
            ],
            'kafka' => $metrics['kafka_status'] ? 'RUNNING' : 'STOPPED',
            'performance' => [
                'error_count' => $metrics['error_count'],
                'success_count' => $metrics['success_count'],
                'queue_size' => $metrics['queue_size'],
                'latency_ms' => round($metrics['latency'], 2)
            ],
            'system' => [
                'memory_usage_mb' => round($metrics['memory_usage'] / 1024 / 1024, 2),
                'disk_free_gb' => round($metrics['disk_usage'] / 1024 / 1024 / 1024, 2)
            ]
        ];
        
        return $report;
    }
    
    private function getOverallStatus($metrics) {
        if (!$metrics['mysql_connector_status'] || !$metrics['postgres_connector_status'] || !$metrics['kafka_status']) {
            return 'CRITICAL';
        }
        
        $total_operations = $metrics['error_count'] + $metrics['success_count'];
        if ($total_operations > 0) {
            $error_rate = $metrics['error_count'] / $total_operations;
            if ($error_rate > $this->alert_thresholds['error_rate']) {
                return 'WARNING';
            }
        }
        
        if ($metrics['latency'] > $this->alert_thresholds['latency_ms']) {
            return 'WARNING';
        }
        
        return 'HEALTHY';
    }
}