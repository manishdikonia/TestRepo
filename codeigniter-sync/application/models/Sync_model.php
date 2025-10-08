<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sync_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function createUser($data) {
        $user_data = [
            'id' => $data['id'],
            'name' => $data['name'],
            'email' => $data['email'],
            'created_at' => $data['created_at'],
            'updated_at' => $data['updated_at']
        ];
        
        $this->db->insert('users', $user_data);
        return $this->db->insert_id();
    }
    
    public function updateUser($data) {
        $user_data = [
            'name' => $data['name'],
            'email' => $data['email'],
            'updated_at' => $data['updated_at']
        ];
        
        $this->db->where('id', $data['id']);
        $this->db->update('users', $user_data);
        return $this->db->affected_rows();
    }
    
    public function deleteUser($data) {
        $this->db->where('id', $data['id']);
        $this->db->delete('users');
        return $this->db->affected_rows();
    }
    
    public function createProduct($data) {
        $product_data = [
            'id' => $data['id'],
            'name' => $data['name'],
            'price' => $data['price'],
            'description' => $data['description'],
            'created_at' => $data['created_at'],
            'updated_at' => $data['updated_at']
        ];
        
        $this->db->insert('products', $product_data);
        return $this->db->insert_id();
    }
    
    public function updateProduct($data) {
        $product_data = [
            'name' => $data['name'],
            'price' => $data['price'],
            'description' => $data['description'],
            'updated_at' => $data['updated_at']
        ];
        
        $this->db->where('id', $data['id']);
        $this->db->update('products', $product_data);
        return $this->db->affected_rows();
    }
    
    public function deleteProduct($data) {
        $this->db->where('id', $data['id']);
        $this->db->delete('products');
        return $this->db->affected_rows();
    }
    
    public function createOrder($data) {
        $order_data = [
            'id' => $data['id'],
            'user_id' => $data['user_id'],
            'product_id' => $data['product_id'],
            'quantity' => $data['quantity'],
            'total_amount' => $data['total_amount'],
            'status' => $data['status'],
            'created_at' => $data['created_at'],
            'updated_at' => $data['updated_at']
        ];
        
        $this->db->insert('orders', $order_data);
        return $this->db->insert_id();
    }
    
    public function updateOrder($data) {
        $order_data = [
            'user_id' => $data['user_id'],
            'product_id' => $data['product_id'],
            'quantity' => $data['quantity'],
            'total_amount' => $data['total_amount'],
            'status' => $data['status'],
            'updated_at' => $data['updated_at']
        ];
        
        $this->db->where('id', $data['id']);
        $this->db->update('orders', $order_data);
        return $this->db->affected_rows();
    }
    
    public function deleteOrder($data) {
        $this->db->where('id', $data['id']);
        $this->db->delete('orders');
        return $this->db->affected_rows();
    }
    
    public function getUserById($id) {
        $query = $this->db->get_where('users', ['id' => $id]);
        return $query->row_array();
    }
    
    public function getProductById($id) {
        $query = $this->db->get_where('products', ['id' => $id]);
        return $query->row_array();
    }
    
    public function getOrderById($id) {
        $query = $this->db->get_where('orders', ['id' => $id]);
        return $query->row_array();
    }
}