<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sync_controller extends CI_Controller {
    
    private $kafka_consumer;
    private $log_file;
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->model('Sync_model');
        $this->log_file = APPPATH . 'logs/sync.log';
        
        // Initialize Kafka consumer
        $this->initKafkaConsumer();
    }
    
    private function initKafkaConsumer() {
        // This would typically use a PHP Kafka client like rdkafka
        // For this example, we'll simulate the consumer
        $this->kafka_consumer = true;
    }
    
    public function index() {
        echo "CodeIgniter Sync Service is running";
    }
    
    public function health() {
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode([
                'status' => 'ok',
                'service' => 'codeigniter-sync',
                'timestamp' => date('Y-m-d H:i:s')
            ]));
    }
    
    public function consume_events() {
        // This method would be called by a cron job or daemon
        $this->log_message('Starting event consumption');
        
        // Simulate consuming events from Kafka
        $events = $this->getKafkaEvents();
        
        foreach ($events as $event) {
            $this->processEvent($event);
        }
        
        $this->log_message('Finished processing events');
    }
    
    private function getKafkaEvents() {
        // In a real implementation, this would consume from Kafka
        // For now, we'll return empty array
        return [];
    }
    
    private function processEvent($event) {
        try {
            $topic = $event['topic'] ?? '';
            $data = $event['data'] ?? [];
            
            switch ($topic) {
                case 'postgres-source.users':
                    $this->handleUserEvent($data);
                    break;
                case 'postgres-source.products':
                    $this->handleProductEvent($data);
                    break;
                case 'postgres-source.orders':
                    $this->handleOrderEvent($data);
                    break;
                default:
                    $this->log_message("Unknown topic: $topic");
            }
        } catch (Exception $e) {
            $this->log_message("Error processing event: " . $e->getMessage());
        }
    }
    
    private function handleUserEvent($data) {
        $operation = $data['op'] ?? '';
        
        switch ($operation) {
            case 'c': // Create
                $this->Sync_model->createUser($data['after']);
                break;
            case 'u': // Update
                $this->Sync_model->updateUser($data['after']);
                break;
            case 'd': // Delete
                $this->Sync_model->deleteUser($data['before']);
                break;
        }
        
        $this->log_message("Processed user event: $operation");
    }
    
    private function handleProductEvent($data) {
        $operation = $data['op'] ?? '';
        
        switch ($operation) {
            case 'c': // Create
                $this->Sync_model->createProduct($data['after']);
                break;
            case 'u': // Update
                $this->Sync_model->updateProduct($data['after']);
                break;
            case 'd': // Delete
                $this->Sync_model->deleteProduct($data['before']);
                break;
        }
        
        $this->log_message("Processed product event: $operation");
    }
    
    private function handleOrderEvent($data) {
        $operation = $data['op'] ?? '';
        
        switch ($operation) {
            case 'c': // Create
                $this->Sync_model->createOrder($data['after']);
                break;
            case 'u': // Update
                $this->Sync_model->updateOrder($data['after']);
                break;
            case 'd': // Delete
                $this->Sync_model->deleteOrder($data['before']);
                break;
        }
        
        $this->log_message("Processed order event: $operation");
    }
    
    private function log_message($message) {
        $timestamp = date('Y-m-d H:i:s');
        $log_entry = "[$timestamp] $message" . PHP_EOL;
        file_put_contents($this->log_file, $log_entry, FILE_APPEND | LOCK_EX);
    }
}