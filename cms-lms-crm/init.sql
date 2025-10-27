-- Initialize database with default data
-- This script runs when the PostgreSQL container starts for the first time

-- Create default contact categories
INSERT INTO contact_categories (id, name, description, "isActive", "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'Entrepreneurs', 'Business owners and entrepreneurs', true, NOW(), NOW()),
(gen_random_uuid(), 'Employees', 'Corporate employees', true, NOW(), NOW()),
(gen_random_uuid(), 'Partners', 'Business partners and collaborators', true, NOW(), NOW()),
(gen_random_uuid(), 'Leads', 'Potential customers and prospects', true, NOW(), NOW()),
(gen_random_uuid(), 'Clients', 'Existing customers', true, NOW(), NOW());

-- Create default admin user (password: admin123)
-- Note: In production, change this password immediately
INSERT INTO users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K8K8K8', 'Admin', 'User', 'admin', true, NOW(), NOW());

-- Create default CRM fields
-- These will be used as templates for CRM trackers
-- Note: This is just a placeholder - actual fields will be created through the API