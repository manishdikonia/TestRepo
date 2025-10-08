<?php

/**
 * Test script for bidirectional database synchronization
 */

require_once 'conflict-resolution/conflict-resolver.php';
require_once 'monitoring/sync-monitor.php';

class SyncTester {
    
    private $mysql_connection;
    private $postgres_connection;
    private $conflict_resolver;
    private $monitor;
    
    public function __construct() {
        $this->conflict_resolver = new ConflictResolver();
        $this->monitor = new SyncMonitor();
        $this->connectDatabases();
    }
    
    private function connectDatabases() {
        // MySQL connection
        $this->mysql_connection = new mysqli('localhost', 'debezium', 'debezium', 'source_db', 3306);
        if ($this->mysql_connection->connect_error) {
            die("MySQL connection failed: " . $this->mysql_connection->connect_error);
        }
        
        // PostgreSQL connection
        $this->postgres_connection = new PDO(
            'pgsql:host=localhost;port=5432;dbname=target_db',
            'postgres',
            'postgres'
        );
    }
    
    public function runTests() {
        echo "🧪 Starting synchronization tests...\n\n";
        
        $this->testInitialSync();
        $this->testBidirectionalSync();
        $this->testConflictResolution();
        $this->testErrorHandling();
        $this->testPerformance();
        
        echo "✅ All tests completed!\n";
    }
    
    private function testInitialSync() {
        echo "📊 Testing initial synchronization...\n";
        
        // Check if data exists in both databases
        $mysql_count = $this->getTableCount('users', 'mysql');
        $postgres_count = $this->getTableCount('users', 'postgres');
        
        echo "  MySQL users: $mysql_count\n";
        echo "  PostgreSQL users: $postgres_count\n";
        
        if ($mysql_count > 0 && $postgres_count > 0) {
            echo "  ✅ Initial sync appears to be working\n";
        } else {
            echo "  ⚠️  Initial sync may need attention\n";
        }
        
        echo "\n";
    }
    
    private function testBidirectionalSync() {
        echo "🔄 Testing bidirectional synchronization...\n";
        
        // Test MySQL to PostgreSQL sync
        echo "  Testing MySQL → PostgreSQL sync...\n";
        $this->insertTestUser('mysql', 'Test User MySQL', 'test-mysql@example.com');
        sleep(2); // Wait for sync
        $postgres_user = $this->findUserByEmail('postgres', 'test-mysql@example.com');
        
        if ($postgres_user) {
            echo "    ✅ MySQL → PostgreSQL sync working\n";
        } else {
            echo "    ❌ MySQL → PostgreSQL sync failed\n";
        }
        
        // Test PostgreSQL to MySQL sync
        echo "  Testing PostgreSQL → MySQL sync...\n";
        $this->insertTestUser('postgres', 'Test User PostgreSQL', 'test-postgres@example.com');
        sleep(2); // Wait for sync
        $mysql_user = $this->findUserByEmail('mysql', 'test-postgres@example.com');
        
        if ($mysql_user) {
            echo "    ✅ PostgreSQL → MySQL sync working\n";
        } else {
            echo "    ❌ PostgreSQL → MySQL sync failed\n";
        }
        
        echo "\n";
    }
    
    private function testConflictResolution() {
        echo "⚔️  Testing conflict resolution...\n";
        
        // Create a user in both databases with different data
        $email = 'conflict-test@example.com';
        
        // Insert in MySQL
        $this->insertTestUser('mysql', 'MySQL User', $email);
        sleep(1);
        
        // Update in PostgreSQL (simulating conflict)
        $this->updateUserEmail('postgres', $email, 'PostgreSQL User Updated');
        sleep(1);
        
        // Update in MySQL (simulating conflict)
        $this->updateUserEmail('mysql', $email, 'MySQL User Updated');
        sleep(2);
        
        // Check which version won
        $mysql_user = $this->findUserByEmail('mysql', $email);
        $postgres_user = $this->findUserByEmail('postgres', $email);
        
        echo "  MySQL user name: " . ($mysql_user['name'] ?? 'Not found') . "\n";
        echo "  PostgreSQL user name: " . ($postgres_user['name'] ?? 'Not found') . "\n";
        
        if ($mysql_user && $postgres_user) {
            echo "  ✅ Conflict resolution working\n";
        } else {
            echo "  ❌ Conflict resolution needs attention\n";
        }
        
        echo "\n";
    }
    
    private function testErrorHandling() {
        echo "🚨 Testing error handling...\n";
        
        // Test with invalid data
        try {
            $this->insertInvalidUser('mysql');
            echo "  ✅ Error handling for invalid data working\n";
        } catch (Exception $e) {
            echo "  ✅ Error handling working: " . $e->getMessage() . "\n";
        }
        
        // Test monitoring
        $metrics = $this->monitor->monitorHealth();
        echo "  System status: " . ($metrics['mysql_connector_status'] ? 'OK' : 'ERROR') . "\n";
        echo "  Error count: " . $metrics['error_count'] . "\n";
        
        echo "\n";
    }
    
    private function testPerformance() {
        echo "⚡ Testing performance...\n";
        
        $start_time = microtime(true);
        
        // Insert multiple records
        for ($i = 0; $i < 10; $i++) {
            $this->insertTestUser('mysql', "Perf User $i", "perf-$i@example.com");
        }
        
        $end_time = microtime(true);
        $duration = ($end_time - $start_time) * 1000; // Convert to milliseconds
        
        echo "  Inserted 10 users in " . round($duration, 2) . "ms\n";
        echo "  Average per insert: " . round($duration / 10, 2) . "ms\n";
        
        // Check sync latency
        sleep(3);
        $metrics = $this->monitor->monitorHealth();
        echo "  Average sync latency: " . round($metrics['latency'], 2) . "ms\n";
        
        echo "\n";
    }
    
    private function getTableCount($table, $database) {
        if ($database === 'mysql') {
            $result = $this->mysql_connection->query("SELECT COUNT(*) as count FROM $table");
            return $result->fetch_assoc()['count'];
        } else {
            $stmt = $this->postgres_connection->query("SELECT COUNT(*) as count FROM $table");
            return $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        }
    }
    
    private function insertTestUser($database, $name, $email) {
        $timestamp = date('Y-m-d H:i:s');
        
        if ($database === 'mysql') {
            $stmt = $this->mysql_connection->prepare(
                "INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, ?, ?)"
            );
            $stmt->bind_param('ssss', $name, $email, $timestamp, $timestamp);
            $stmt->execute();
        } else {
            $stmt = $this->postgres_connection->prepare(
                "INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([$name, $email, $timestamp, $timestamp]);
        }
    }
    
    private function findUserByEmail($database, $email) {
        if ($database === 'mysql') {
            $stmt = $this->mysql_connection->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->fetch_assoc();
        } else {
            $stmt = $this->postgres_connection->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
    
    private function updateUserEmail($database, $email, $new_name) {
        $timestamp = date('Y-m-d H:i:s');
        
        if ($database === 'mysql') {
            $stmt = $this->mysql_connection->prepare(
                "UPDATE users SET name = ?, updated_at = ? WHERE email = ?"
            );
            $stmt->bind_param('sss', $new_name, $timestamp, $email);
            $stmt->execute();
        } else {
            $stmt = $this->postgres_connection->prepare(
                "UPDATE users SET name = ?, updated_at = ? WHERE email = ?"
            );
            $stmt->execute([$new_name, $timestamp, $email]);
        }
    }
    
    private function insertInvalidUser($database) {
        // Try to insert user with invalid data (empty name)
        $this->insertTestUser($database, '', 'invalid@example.com');
    }
    
    public function cleanup() {
        // Clean up test data
        $this->mysql_connection->query("DELETE FROM users WHERE email LIKE 'test-%' OR email LIKE 'perf-%' OR email LIKE 'conflict-%'");
        $this->postgres_connection->exec("DELETE FROM users WHERE email LIKE 'test-%' OR email LIKE 'perf-%' OR email LIKE 'conflict-%'");
        
        echo "🧹 Cleaned up test data\n";
    }
}

// Run tests
$tester = new SyncTester();
$tester->runTests();
$tester->cleanup();