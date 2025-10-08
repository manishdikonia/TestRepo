<?php

class ConflictResolver {
    
    private $log_file;
    
    public function __construct() {
        $this->log_file = __DIR__ . '/logs/conflict.log';
    }
    
    /**
     * Resolve conflicts between MySQL and PostgreSQL data
     */
    public function resolveConflict($table, $mysqlData, $postgresData, $operation) {
        $this->log("Resolving conflict for table: $table, operation: $operation");
        
        switch ($table) {
            case 'users':
                return $this->resolveUserConflict($mysqlData, $postgresData, $operation);
            case 'products':
                return $this->resolveProductConflict($mysqlData, $postgresData, $operation);
            case 'orders':
                return $this->resolveOrderConflict($mysqlData, $postgresData, $operation);
            default:
                return $this->resolveGenericConflict($mysqlData, $postgresData, $operation);
        }
    }
    
    private function resolveUserConflict($mysqlData, $postgresData, $operation) {
        // Last-write-wins strategy based on updated_at timestamp
        if ($operation === 'update') {
            $mysqlTime = strtotime($mysqlData['updated_at'] ?? '1970-01-01');
            $postgresTime = strtotime($postgresData['updated_at'] ?? '1970-01-01');
            
            if ($mysqlTime > $postgresTime) {
                $this->log("MySQL data is newer for user ID: " . $mysqlData['id']);
                return $mysqlData;
            } else {
                $this->log("PostgreSQL data is newer for user ID: " . $postgresData['id']);
                return $postgresData;
            }
        }
        
        return $mysqlData; // Default to MySQL data
    }
    
    private function resolveProductConflict($mysqlData, $postgresData, $operation) {
        // For products, prioritize data integrity
        if ($operation === 'update') {
            // Check if price has changed significantly (more than 10%)
            $mysqlPrice = floatval($mysqlData['price'] ?? 0);
            $postgresPrice = floatval($postgresData['price'] ?? 0);
            
            if ($mysqlPrice > 0 && $postgresPrice > 0) {
                $priceDiff = abs($mysqlPrice - $postgresPrice) / $mysqlPrice;
                if ($priceDiff > 0.1) {
                    $this->log("Significant price difference detected for product ID: " . $mysqlData['id']);
                    // In a real scenario, you might want to flag this for manual review
                }
            }
            
            // Use last-write-wins for products
            $mysqlTime = strtotime($mysqlData['updated_at'] ?? '1970-01-01');
            $postgresTime = strtotime($postgresData['updated_at'] ?? '1970-01-01');
            
            return $mysqlTime > $postgresTime ? $mysqlData : $postgresData;
        }
        
        return $mysqlData;
    }
    
    private function resolveOrderConflict($mysqlData, $postgresData, $operation) {
        // For orders, be more careful about status changes
        if ($operation === 'update') {
            $mysqlStatus = $mysqlData['status'] ?? 'pending';
            $postgresStatus = $postgresData['status'] ?? 'pending';
            
            // If one is completed and the other is not, prioritize completed
            if ($mysqlStatus === 'completed' && $postgresStatus !== 'completed') {
                $this->log("MySQL order is completed, prioritizing it for order ID: " . $mysqlData['id']);
                return $mysqlData;
            } elseif ($postgresStatus === 'completed' && $mysqlStatus !== 'completed') {
                $this->log("PostgreSQL order is completed, prioritizing it for order ID: " . $postgresData['id']);
                return $postgresData;
            }
            
            // Otherwise, use last-write-wins
            $mysqlTime = strtotime($mysqlData['updated_at'] ?? '1970-01-01');
            $postgresTime = strtotime($postgresData['updated_at'] ?? '1970-01-01');
            
            return $mysqlTime > $postgresTime ? $mysqlData : $postgresData;
        }
        
        return $mysqlData;
    }
    
    private function resolveGenericConflict($mysqlData, $postgresData, $operation) {
        // Generic conflict resolution - last-write-wins
        if ($operation === 'update') {
            $mysqlTime = strtotime($mysqlData['updated_at'] ?? '1970-01-01');
            $postgresTime = strtotime($postgresData['updated_at'] ?? '1970-01-01');
            
            return $mysqlTime > $postgresTime ? $mysqlData : $postgresData;
        }
        
        return $mysqlData;
    }
    
    /**
     * Transform data between MySQL and PostgreSQL formats
     */
    public function transformData($data, $fromDb, $toDb) {
        if ($fromDb === 'mysql' && $toDb === 'postgres') {
            return $this->transformMysqlToPostgres($data);
        } elseif ($fromDb === 'postgres' && $toDb === 'mysql') {
            return $this->transformPostgresToMysql($data);
        }
        
        return $data;
    }
    
    private function transformMysqlToPostgres($data) {
        // Convert MySQL specific formats to PostgreSQL
        $transformed = $data;
        
        // Convert MySQL datetime to PostgreSQL timestamp
        if (isset($data['created_at'])) {
            $transformed['created_at'] = $this->convertDateTime($data['created_at']);
        }
        if (isset($data['updated_at'])) {
            $transformed['updated_at'] = $this->convertDateTime($data['updated_at']);
        }
        
        // Convert MySQL decimal to PostgreSQL numeric
        if (isset($data['price'])) {
            $transformed['price'] = floatval($data['price']);
        }
        if (isset($data['total_amount'])) {
            $transformed['total_amount'] = floatval($data['total_amount']);
        }
        
        return $transformed;
    }
    
    private function transformPostgresToMysql($data) {
        // Convert PostgreSQL specific formats to MySQL
        $transformed = $data;
        
        // Convert PostgreSQL timestamp to MySQL datetime
        if (isset($data['created_at'])) {
            $transformed['created_at'] = $this->convertDateTime($data['created_at']);
        }
        if (isset($data['updated_at'])) {
            $transformed['updated_at'] = $this->convertDateTime($data['updated_at']);
        }
        
        // Convert PostgreSQL numeric to MySQL decimal
        if (isset($data['price'])) {
            $transformed['price'] = number_format(floatval($data['price']), 2, '.', '');
        }
        if (isset($data['total_amount'])) {
            $transformed['total_amount'] = number_format(floatval($data['total_amount']), 2, '.', '');
        }
        
        return $transformed;
    }
    
    private function convertDateTime($datetime) {
        // Convert between MySQL and PostgreSQL datetime formats
        if (empty($datetime)) {
            return null;
        }
        
        try {
            $dt = new DateTime($datetime);
            return $dt->format('Y-m-d H:i:s');
        } catch (Exception $e) {
            $this->log("Error converting datetime: " . $e->getMessage());
            return $datetime;
        }
    }
    
    private function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        $log_entry = "[$timestamp] $message" . PHP_EOL;
        file_put_contents($this->log_file, $log_entry, FILE_APPEND | LOCK_EX);
    }
}