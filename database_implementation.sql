-- Training & Assessment Management Platform Database Implementation
-- Database: MySQL 8.0+ / PostgreSQL 13+

-- =====================================================
-- 1. CREATE DATABASE
-- =====================================================
CREATE DATABASE IF NOT EXISTS training_assessment_platform
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE training_assessment_platform;

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- User Management Tables
-- ----------------------

-- Base Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type ENUM('participant', 'coach', 'admin', 'management') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Companies Table
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    hr_contact_email VARCHAR(255),
    hr_contact_phone VARCHAR(20),
    address TEXT,
    max_employees INT DEFAULT 50,
    contract_start_date DATE,
    contract_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_company_name (company_name),
    INDEX idx_contract_dates (contract_start_date, contract_end_date)
) ENGINE=InnoDB;

-- Admins Table
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    role_level ENUM('super_admin', 'admin', 'support') DEFAULT 'admin',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Coaches Table
CREATE TABLE coaches (
    coach_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    specialization VARCHAR(255),
    experience_years INT,
    certification TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Batches Table (before participants due to FK)
CREATE TABLE batches (
    batch_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    coach_id INT,
    batch_name VARCHAR(255) NOT NULL,
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE,
    end_date DATE,
    max_participants INT DEFAULT 50,
    status ENUM('planned', 'active', 'completed', 'cancelled') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE SET NULL,
    INDEX idx_company (company_id),
    INDEX idx_coach (coach_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB;

-- Participants Table
CREATE TABLE participants (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_id INT,
    batch_id INT,
    designation VARCHAR(100),
    department VARCHAR(100),
    employee_id VARCHAR(50),
    participant_type ENUM('employee', 'individual', 'interview_candidate') DEFAULT 'employee',
    joining_date DATE,
    is_interview_candidate BOOLEAN DEFAULT FALSE,
    hired_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE SET NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_company_id (company_id),
    INDEX idx_batch_id (batch_id),
    INDEX idx_participant_type (participant_type),
    INDEX idx_interview_candidate (is_interview_candidate)
) ENGINE=InnoDB;

-- Assessment Tables
-- -----------------

-- Assessment Tools Table
CREATE TABLE assessment_tools (
    tool_id INT AUTO_INCREMENT PRIMARY KEY,
    tool_name VARCHAR(255) NOT NULL,
    tool_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    version VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tool_code (tool_code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Questions Table
CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'single_choice', 'text', 'scale', 'boolean') NOT NULL,
    options_json JSON,
    order_index INT DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE CASCADE,
    INDEX idx_tool_id (tool_id),
    INDEX idx_order (tool_id, order_index)
) ENGINE=InnoDB;

-- Assessments Table
CREATE TABLE assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    tool_id INT NOT NULL,
    batch_id INT,
    assessment_date DATE,
    status ENUM('pending', 'in_progress', 'completed', 'locked') DEFAULT 'pending',
    start_time DATETIME,
    end_time DATETIME,
    assessment_score DECIMAL(5,2),
    is_locked BOOLEAN DEFAULT FALSE,
    locked_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE RESTRICT,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
    INDEX idx_participant (participant_id),
    INDEX idx_tool (tool_id),
    INDEX idx_batch (batch_id),
    INDEX idx_status (status),
    INDEX idx_date (assessment_date)
) ENGINE=InnoDB;

-- Assessment Results Table
CREATE TABLE assessment_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    result_type ENUM('calculated', 'final') NOT NULL,
    calculated_result JSON,
    final_result JSON,
    edited_by INT,
    edit_date DATETIME,
    freeze_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (edited_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_assessment (assessment_id),
    INDEX idx_type (result_type),
    UNIQUE KEY unique_assessment_type (assessment_id, result_type)
) ENGINE=InnoDB;

-- Assessment Responses Table
CREATE TABLE assessment_responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    response_value TEXT,
    response_time INT, -- seconds taken to answer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE RESTRICT,
    INDEX idx_assessment (assessment_id),
    INDEX idx_question (question_id),
    UNIQUE KEY unique_assessment_question (assessment_id, question_id)
) ENGINE=InnoDB;

-- Assignment Tables
-- -----------------

-- Assignments Table
CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_days INT DEFAULT 7, -- days after unlock
    max_score INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE CASCADE,
    INDEX idx_tool (tool_id)
) ENGINE=InnoDB;

-- Participant Assignments Table
CREATE TABLE participant_assignments (
    participant_assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    participant_id INT NOT NULL,
    batch_id INT,
    assigned_date DATETIME,
    due_date DATETIME,
    submission_date DATETIME,
    submission_file VARCHAR(500),
    score DECIMAL(5,2),
    status ENUM('pending', 'submitted', 'graded', 'overdue') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
    INDEX idx_assignment (assignment_id),
    INDEX idx_participant (participant_id),
    INDEX idx_batch (batch_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB;

-- Resource Tables
-- ---------------

-- Resources Table
CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type ENUM('pdf', 'ppt', 'doc', 'video', 'link', 'other') NOT NULL,
    file_path VARCHAR(500),
    url VARCHAR(500),
    is_downloadable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE CASCADE,
    INDEX idx_tool (tool_id),
    INDEX idx_type (resource_type)
) ENGINE=InnoDB;

-- Batch Resources Table
CREATE TABLE batch_resources (
    batch_resource_id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id INT NOT NULL,
    resource_id INT NOT NULL,
    unlocked_date DATETIME,
    unlocked_by INT,
    access_level ENUM('view', 'download') DEFAULT 'view',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE,
    FOREIGN KEY (unlocked_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_batch (batch_id),
    INDEX idx_resource (resource_id),
    UNIQUE KEY unique_batch_resource (batch_id, resource_id)
) ENGINE=InnoDB;

-- Quiz Tables
-- -----------

-- Quizzes Table
CREATE TABLE quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 30,
    total_questions INT,
    access_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_access_code (access_code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Quiz Questions Table
CREATE TABLE quiz_questions (
    quiz_question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    options_json JSON,
    correct_answer VARCHAR(500),
    points INT DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id),
    INDEX idx_order (quiz_id, order_index)
) ENGINE=InnoDB;

-- Quiz Sessions Table
CREATE TABLE quiz_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    batch_id INT,
    coach_id INT,
    start_time DATETIME,
    end_time DATETIME,
    access_link VARCHAR(500),
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE SET NULL,
    INDEX idx_quiz (quiz_id),
    INDEX idx_batch (batch_id),
    INDEX idx_coach (coach_id),
    INDEX idx_time (start_time, end_time)
) ENGINE=InnoDB;

-- Quiz Responses Table (Temporary storage)
CREATE TABLE quiz_responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    participant_id INT NOT NULL,
    quiz_question_id INT NOT NULL,
    response VARCHAR(500),
    is_correct BOOLEAN,
    response_time INT, -- seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_question_id) REFERENCES quiz_questions(quiz_question_id) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_participant (participant_id),
    UNIQUE KEY unique_session_participant_question (session_id, participant_id, quiz_question_id)
) ENGINE=InnoDB;

-- Administrative Tables
-- ---------------------

-- Company Packages Table
CREATE TABLE company_packages (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    tool_id INT NOT NULL,
    total_assessments INT NOT NULL,
    used_assessments INT DEFAULT 0,
    package_type ENUM('standard', 'premium', 'enterprise', 'custom') DEFAULT 'standard',
    purchase_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE RESTRICT,
    INDEX idx_company (company_id),
    INDEX idx_tool (tool_id),
    INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB;

-- Coach Assignments Table
CREATE TABLE coach_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT NOT NULL,
    company_id INT NOT NULL,
    assigned_date DATE,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    INDEX idx_coach (coach_id),
    INDEX idx_company (company_id),
    INDEX idx_status (status),
    UNIQUE KEY unique_coach_company (coach_id, company_id)
) ENGINE=InnoDB;

-- System Settings Table
CREATE TABLE system_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json', 'date') DEFAULT 'string',
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_key (setting_key)
) ENGINE=InnoDB;

-- Audit Logs Table
CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action)
) ENGINE=InnoDB;

-- CRM Sync Log Table
CREATE TABLE crm_sync_log (
    sync_id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT,
    sync_type ENUM('create', 'update', 'delete') NOT NULL,
    sync_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    sync_data JSON,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    INDEX idx_participant (participant_id),
    INDEX idx_status (sync_status),
    INDEX idx_timestamp (sync_timestamp)
) ENGINE=InnoDB;

-- =====================================================
-- 3. INSERT DEFAULT DATA
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('freeze_period_days', '30', 'integer', 'Number of days after which assessment results are frozen'),
('max_batch_size', '50', 'integer', 'Maximum number of participants per batch'),
('assessment_validity_days', '365', 'integer', 'Number of days an assessment remains valid'),
('allow_resource_download', 'false', 'boolean', 'Global setting for resource downloads'),
('quiz_auto_end', 'true', 'boolean', 'Automatically end quiz at duration limit'),
('crm_sync_enabled', 'true', 'boolean', 'Enable CRM synchronization'),
('crm_api_endpoint', '', 'string', 'CRM API endpoint URL'),
('session_timeout_minutes', '30', 'integer', 'User session timeout in minutes');

-- Insert default assessment tools
INSERT INTO assessment_tools (tool_name, tool_code, description, version, is_active) VALUES
('Inner Drives', 'INNER_DRIVES', 'Assess personal motivations and drivers', '1.0', TRUE),
('N1 Assessment', 'N1', 'Comprehensive personality assessment', '1.0', TRUE),
('Leadership Style', 'LEADERSHIP', 'Identify leadership characteristics', '1.0', TRUE),
('Communication Profile', 'COMMUNICATION', 'Assess communication preferences', '1.0', TRUE),
('Team Dynamics', 'TEAM_DYNAMICS', 'Evaluate team working style', '1.0', TRUE),
('Emotional Intelligence', 'EQ', 'Measure emotional quotient', '1.0', TRUE),
('Problem Solving', 'PROBLEM_SOLVING', 'Assess problem-solving approach', '1.0', TRUE),
('Work Values', 'WORK_VALUES', 'Identify core work values', '1.0', TRUE);

-- Insert default admin user (password: Admin@123 - should be hashed in production)
INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, is_active)
VALUES ('admin@platform.com', '$2b$10$YourHashedPasswordHere', 'System', 'Administrator', '+1234567890', 'admin', TRUE);

INSERT INTO admins (user_id, role_level, permissions)
VALUES (LAST_INSERT_ID(), 'super_admin', '{"all": true}');

-- =====================================================
-- 4. CREATE VIEWS FOR REPORTING
-- =====================================================

-- View for participant assessment summary
CREATE VIEW vw_participant_assessment_summary AS
SELECT 
    p.participant_id,
    u.first_name,
    u.last_name,
    u.email,
    c.company_name,
    b.batch_name,
    at.tool_name,
    a.assessment_date,
    a.status,
    ar.final_result
FROM participants p
JOIN users u ON p.user_id = u.user_id
LEFT JOIN companies c ON p.company_id = c.company_id
LEFT JOIN batches b ON p.batch_id = b.batch_id
LEFT JOIN assessments a ON p.participant_id = a.participant_id
LEFT JOIN assessment_tools at ON a.tool_id = at.tool_id
LEFT JOIN assessment_results ar ON a.assessment_id = ar.assessment_id AND ar.result_type = 'final';

-- View for company assessment usage
CREATE VIEW vw_company_assessment_usage AS
SELECT 
    c.company_id,
    c.company_name,
    cp.tool_id,
    at.tool_name,
    cp.total_assessments,
    cp.used_assessments,
    (cp.total_assessments - cp.used_assessments) AS remaining_assessments,
    cp.expiry_date
FROM companies c
JOIN company_packages cp ON c.company_id = cp.company_id
JOIN assessment_tools at ON cp.tool_id = at.tool_id;

-- View for batch progress
CREATE VIEW vw_batch_progress AS
SELECT 
    b.batch_id,
    b.batch_name,
    b.batch_code,
    c.company_name,
    CONCAT(coach_user.first_name, ' ', coach_user.last_name) AS coach_name,
    COUNT(DISTINCT p.participant_id) AS total_participants,
    COUNT(DISTINCT a.assessment_id) AS total_assessments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.assessment_id END) AS completed_assessments
FROM batches b
JOIN companies c ON b.company_id = c.company_id
LEFT JOIN coaches coach ON b.coach_id = coach.coach_id
LEFT JOIN users coach_user ON coach.user_id = coach_user.user_id
LEFT JOIN participants p ON b.batch_id = p.batch_id
LEFT JOIN assessments a ON p.participant_id = a.participant_id
GROUP BY b.batch_id;

-- =====================================================
-- 5. CREATE STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to convert interview candidate to employee
CREATE PROCEDURE sp_convert_candidate_to_employee(
    IN p_participant_id INT,
    IN p_company_id INT,
    IN p_batch_id INT,
    IN p_employee_id VARCHAR(50)
)
BEGIN
    UPDATE participants 
    SET 
        participant_type = 'employee',
        company_id = p_company_id,
        batch_id = p_batch_id,
        employee_id = p_employee_id,
        is_interview_candidate = FALSE,
        hired_date = CURDATE()
    WHERE participant_id = p_participant_id
    AND participant_type = 'interview_candidate';
END //

-- Procedure to unlock batch resources
CREATE PROCEDURE sp_unlock_batch_resources(
    IN p_batch_id INT,
    IN p_resource_id INT,
    IN p_unlocked_by INT
)
BEGIN
    INSERT INTO batch_resources (batch_id, resource_id, unlocked_date, unlocked_by)
    VALUES (p_batch_id, p_resource_id, NOW(), p_unlocked_by)
    ON DUPLICATE KEY UPDATE 
        unlocked_date = NOW(),
        unlocked_by = p_unlocked_by;
END //

DELIMITER ;

-- =====================================================
-- 6. CREATE TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger to update company package usage
CREATE TRIGGER trg_update_package_usage
AFTER INSERT ON assessments
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE company_packages cp
        JOIN participants p ON NEW.participant_id = p.participant_id
        SET cp.used_assessments = cp.used_assessments + 1
        WHERE cp.company_id = p.company_id 
        AND cp.tool_id = NEW.tool_id
        AND cp.used_assessments < cp.total_assessments;
    END IF;
END //

-- Trigger for audit logging
CREATE TRIGGER trg_audit_user_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, new_value)
    VALUES (
        NEW.user_id,
        'UPDATE',
        'users',
        NEW.user_id,
        JSON_OBJECT('email', OLD.email, 'first_name', OLD.first_name, 'last_name', OLD.last_name),
        JSON_OBJECT('email', NEW.email, 'first_name', NEW.first_name, 'last_name', NEW.last_name)
    );
END //

DELIMITER ;

-- =====================================================
-- 7. GRANT PERMISSIONS (Example for different roles)
-- =====================================================

-- Create database users
-- CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
-- CREATE USER 'readonly_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant permissions
-- GRANT SELECT, INSERT, UPDATE, DELETE ON training_assessment_platform.* TO 'app_user'@'localhost';
-- GRANT SELECT ON training_assessment_platform.* TO 'readonly_user'@'localhost';

-- =====================================================
-- End of Database Implementation Script
-- =====================================================