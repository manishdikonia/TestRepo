-- Training & Assessment Management Platform Database Schema
-- Version: 1.0
-- Database: MySQL 8.0+ / PostgreSQL 13+

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

-- Core users table for authentication
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_type ENUM('participant', 'coach', 'company_hr', 'admin') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role_type (role_type)
);

-- Participants (Employees/Individuals)
CREATE TABLE participants (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_id INT,
    batch_id INT,
    designation VARCHAR(100),
    department VARCHAR(100),
    employee_id VARCHAR(50),
    profile_type ENUM('employee', 'individual', 'interview_candidate') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE SET NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
    INDEX idx_company (company_id),
    INDEX idx_batch (batch_id)
);

-- Coaches/Trainers
CREATE TABLE coaches (
    coach_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    specialization VARCHAR(255),
    certification TEXT,
    experience_years INT DEFAULT 0,
    bio TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Companies
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    hr_contact_email VARCHAR(255),
    hr_contact_phone VARCHAR(20),
    address TEXT,
    contract_details JSON,
    max_employees INT DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_name (company_name)
);

-- Admin users
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    admin_level ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- BATCH MANAGEMENT TABLES
-- ============================================

-- Training batches
CREATE TABLE batches (
    batch_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    coach_id INT,
    batch_name VARCHAR(255) NOT NULL,
    batch_code VARCHAR(50) UNIQUE,
    max_size INT DEFAULT 50,
    current_size INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status ENUM('planned', 'active', 'completed', 'cancelled') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE SET NULL,
    INDEX idx_company_batch (company_id),
    INDEX idx_coach_batch (coach_id),
    INDEX idx_status (status)
);

-- Batch participants enrollment
CREATE TABLE batch_participants (
    batch_participant_id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id INT NOT NULL,
    participant_id INT NOT NULL,
    enrolled_date DATE DEFAULT (CURRENT_DATE),
    completion_status ENUM('enrolled', 'in_progress', 'completed', 'dropped') DEFAULT 'enrolled',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_batch_participant (batch_id, participant_id),
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    INDEX idx_batch_enrollment (batch_id),
    INDEX idx_participant_enrollment (participant_id)
);

-- ============================================
-- ASSESSMENT MANAGEMENT TABLES
-- ============================================

-- Assessment tools (Inner Drives, N1, etc.)
CREATE TABLE assessment_tools (
    tool_id INT AUTO_INCREMENT PRIMARY KEY,
    tool_name VARCHAR(255) NOT NULL,
    tool_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    question_count INT DEFAULT 0,
    duration_minutes INT DEFAULT 30,
    scoring_algorithm JSON,
    is_active BOOLEAN DEFAULT TRUE,
    version VARCHAR(20) DEFAULT '1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tool_code (tool_code),
    INDEX idx_active_tools (is_active)
);

-- Individual assessments taken
CREATE TABLE assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    tool_id INT NOT NULL,
    batch_id INT,
    assessment_type ENUM('training', 'interview', 'individual') DEFAULT 'training',
    status ENUM('not_started', 'in_progress', 'completed', 'expired') DEFAULT 'not_started',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    validity_period INT DEFAULT 365, -- days
    attempt_number INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE RESTRICT,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
    INDEX idx_participant_assessments (participant_id),
    INDEX idx_tool_assessments (tool_id),
    INDEX idx_status_assessments (status)
);

-- Assessment results (dual storage)
CREATE TABLE assessment_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT UNIQUE NOT NULL,
    raw_score JSON,
    calculated_result JSON, -- Auto-generated result
    final_result JSON, -- Editable result
    is_frozen BOOLEAN DEFAULT FALSE,
    freeze_date DATE,
    last_edited_by INT,
    edit_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (last_edited_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_frozen_results (is_frozen)
);

-- Questions for each assessment tool
CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'single_choice', 'text', 'rating', 'ranking') DEFAULT 'single_choice',
    options_json JSON,
    correct_answer TEXT,
    weight DECIMAL(5,2) DEFAULT 1.00,
    sequence_order INT DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE CASCADE,
    INDEX idx_tool_questions (tool_id),
    INDEX idx_question_order (sequence_order)
);

-- Participant answers to questions
CREATE TABLE participant_answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_value TEXT,
    answer_text TEXT,
    time_spent_seconds INT DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_assessment_question (assessment_id, question_id),
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    INDEX idx_assessment_answers (assessment_id)
);

-- ============================================
-- ASSIGNMENTS AND RESOURCES TABLES
-- ============================================

-- Assignments linked to assessment tools
CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    due_days INT DEFAULT 7, -- Days after assessment completion
    max_score DECIMAL(5,2) DEFAULT 100.00,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE CASCADE,
    INDEX idx_tool_assignments (tool_id)
);

-- Assignment submissions
CREATE TABLE assignment_submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    participant_id INT NOT NULL,
    assessment_id INT,
    submission_text TEXT,
    file_path VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score DECIMAL(5,2),
    feedback TEXT,
    graded_by INT,
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE SET NULL,
    FOREIGN KEY (graded_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_participant_submissions (participant_id),
    INDEX idx_assignment_submissions (assignment_id)
);

-- Resources linked to assessment tools
CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT,
    resource_name VARCHAR(255) NOT NULL,
    resource_type ENUM('pdf', 'ppt', 'doc', 'video', 'link', 'other') DEFAULT 'pdf',
    file_path VARCHAR(500),
    url VARCHAR(500),
    access_level ENUM('participant', 'management', 'both') DEFAULT 'both',
    is_downloadable BOOLEAN DEFAULT FALSE,
    sequence_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES assessment_tools(tool_id) ON DELETE CASCADE,
    INDEX idx_tool_resources (tool_id),
    INDEX idx_access_level (access_level)
);

-- Batch-wise resource access control
CREATE TABLE batch_resources (
    batch_resource_id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id INT NOT NULL,
    resource_id INT NOT NULL,
    coach_id INT,
    unlocked_at TIMESTAMP NULL,
    locked_at TIMESTAMP NULL,
    access_type ENUM('view_only', 'download', 'restricted') DEFAULT 'view_only',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_batch_resource (batch_id, resource_id),
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE SET NULL,
    INDEX idx_batch_resources (batch_id),
    INDEX idx_resource_access (resource_id)
);

-- ============================================
-- INTERVIEW MANAGEMENT TABLES
-- ============================================

-- Interview candidates
CREATE TABLE interview_candidates (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    position_applied VARCHAR(255),
    assessment_link VARCHAR(500) UNIQUE,
    link_expiry TIMESTAMP,
    status ENUM('invited', 'in_progress', 'completed', 'hired', 'rejected') DEFAULT 'invited',
    converted_to_participant INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    FOREIGN KEY (converted_to_participant) REFERENCES participants(participant_id) ON DELETE SET NULL,
    INDEX idx_company_candidates (company_id),
    INDEX idx_candidate_status (status),
    INDEX idx_candidate_email (email)
);

-- Assessment packages for interview candidates
CREATE TABLE assessment_packages (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    tool_quotas_json JSON, -- {"inner_drives": 25, "n1": 25}
    purchased_date DATE DEFAULT (CURRENT_DATE),
    expiry_date DATE,
    total_assessments INT DEFAULT 0,
    used_assessments INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    INDEX idx_company_packages (company_id),
    INDEX idx_package_expiry (expiry_date)
);

-- ============================================
-- QUIZ MANAGEMENT TABLES
-- ============================================

-- Quiz definitions
CREATE TABLE quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT NOT NULL,
    quiz_name VARCHAR(255) NOT NULL,
    quiz_code VARCHAR(50) UNIQUE,
    questions_json JSON,
    duration_minutes INT DEFAULT 10,
    is_live BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE CASCADE,
    INDEX idx_coach_quizzes (coach_id),
    INDEX idx_live_quizzes (is_live)
);

-- Quiz sessions
CREATE TABLE quiz_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    batch_id INT,
    access_code VARCHAR(50) UNIQUE,
    qr_code TEXT,
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE SET NULL,
    INDEX idx_quiz_sessions (quiz_id),
    INDEX idx_batch_sessions (batch_id)
);

-- Quiz responses (temporary storage)
CREATE TABLE quiz_responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    participant_name VARCHAR(255),
    participant_email VARCHAR(255),
    responses_json JSON,
    score DECIMAL(5,2),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
    INDEX idx_session_responses (session_id),
    INDEX idx_response_time (submitted_at)
);

-- ============================================
-- SUPPORTING TABLES
-- ============================================

-- Coach-Company assignments
CREATE TABLE coach_companies (
    coach_company_id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT NOT NULL,
    company_id INT NOT NULL,
    assigned_date DATE DEFAULT (CURRENT_DATE),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_coach_company (coach_id, company_id),
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    INDEX idx_coach_assignments (coach_id),
    INDEX idx_company_coaches (company_id)
);

-- System settings
CREATE TABLE system_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_setting_key (setting_key)
);

-- CRM sync log
CREATE TABLE crm_sync_log (
    sync_id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT,
    sync_type ENUM('create', 'update', 'delete') DEFAULT 'update',
    sync_data_json JSON,
    sync_status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    error_message TEXT,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    INDEX idx_participant_sync (participant_id),
    INDEX idx_sync_status (sync_status),
    INDEX idx_sync_time (synced_at)
);

-- Audit logs
CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_logs (user_id),
    INDEX idx_entity_logs (entity_type, entity_id),
    INDEX idx_log_time (created_at)
);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('freeze_period_days', '30', 'integer', 'Number of days after which results are frozen'),
('max_batch_size', '50', 'integer', 'Maximum number of participants per batch'),
('assessment_validity_days', '365', 'integer', 'Default validity period for assessments'),
('allow_downloads', 'false', 'boolean', 'Allow participants to download resources'),
('require_watermark', 'true', 'boolean', 'Add watermark to viewed documents'),
('quiz_auto_delete_days', '7', 'integer', 'Days after which quiz responses are deleted'),
('crm_api_endpoint', '', 'string', 'CRM API endpoint for integration'),
('crm_api_key', '', 'string', 'CRM API authentication key');

-- Insert sample assessment tools
INSERT INTO assessment_tools (tool_name, tool_code, description, question_count, duration_minutes) VALUES
('Inner Drives', 'INNER_DRIVES', 'Identify top inner drives and motivations', 50, 30),
('N1 Assessment', 'N1', 'Personality and behavioral assessment', 40, 25),
('Leadership Style', 'LEADERSHIP', 'Identify leadership style and capabilities', 35, 20),
('Communication Profile', 'COMMUNICATION', 'Assess communication preferences and styles', 30, 20),
('Team Dynamics', 'TEAM_DYNAMICS', 'Evaluate team collaboration abilities', 45, 25),
('Problem Solving', 'PROBLEM_SOLVING', 'Assess problem-solving approaches', 40, 30),
('Emotional Intelligence', 'EQ', 'Measure emotional intelligence quotient', 35, 20),
('Work Preferences', 'WORK_PREF', 'Identify work environment preferences', 25, 15);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_participant_company_batch ON participants(company_id, batch_id);
CREATE INDEX idx_assessment_participant_tool ON assessments(participant_id, tool_id);
CREATE INDEX idx_assessment_batch_status ON assessments(batch_id, status);
CREATE INDEX idx_result_frozen_date ON assessment_results(is_frozen, freeze_date);
CREATE INDEX idx_submission_participant_assignment ON assignment_submissions(participant_id, assignment_id);
CREATE INDEX idx_candidate_company_status ON interview_candidates(company_id, status);
CREATE INDEX idx_package_company_expiry ON assessment_packages(company_id, expiry_date);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for participant dashboard
CREATE VIEW participant_dashboard AS
SELECT 
    p.participant_id,
    u.first_name,
    u.last_name,
    u.email,
    c.company_name,
    b.batch_name,
    COUNT(DISTINCT a.assessment_id) as total_assessments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.assessment_id END) as completed_assessments,
    COUNT(DISTINCT asub.submission_id) as total_submissions,
    bp.progress_percentage
FROM participants p
JOIN users u ON p.user_id = u.user_id
LEFT JOIN companies c ON p.company_id = c.company_id
LEFT JOIN batches b ON p.batch_id = b.batch_id
LEFT JOIN batch_participants bp ON p.participant_id = bp.participant_id AND b.batch_id = bp.batch_id
LEFT JOIN assessments a ON p.participant_id = a.participant_id
LEFT JOIN assignment_submissions asub ON p.participant_id = asub.participant_id
GROUP BY p.participant_id;

-- View for company HR dashboard
CREATE VIEW company_dashboard AS
SELECT 
    c.company_id,
    c.company_name,
    COUNT(DISTINCT p.participant_id) as total_employees,
    COUNT(DISTINCT b.batch_id) as total_batches,
    COUNT(DISTINCT ic.candidate_id) as total_candidates,
    SUM(ap.total_assessments) as purchased_assessments,
    SUM(ap.used_assessments) as used_assessments
FROM companies c
LEFT JOIN participants p ON c.company_id = p.company_id
LEFT JOIN batches b ON c.company_id = b.company_id
LEFT JOIN interview_candidates ic ON c.company_id = ic.company_id
LEFT JOIN assessment_packages ap ON c.company_id = ap.company_id
GROUP BY c.company_id;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure to convert interview candidate to participant
CREATE PROCEDURE convert_candidate_to_participant(
    IN p_candidate_id INT,
    IN p_batch_id INT
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_participant_id INT;
    DECLARE v_company_id INT;
    DECLARE v_email VARCHAR(255);
    DECLARE v_full_name VARCHAR(255);
    
    -- Get candidate details
    SELECT company_id, email, full_name 
    INTO v_company_id, v_email, v_full_name
    FROM interview_candidates 
    WHERE candidate_id = p_candidate_id;
    
    -- Create user account
    INSERT INTO users (email, password_hash, first_name, last_name, role_type)
    VALUES (v_email, 'TEMP_PASSWORD_CHANGE_REQUIRED', 
            SUBSTRING_INDEX(v_full_name, ' ', 1),
            SUBSTRING_INDEX(v_full_name, ' ', -1),
            'participant');
    
    SET v_user_id = LAST_INSERT_ID();
    
    -- Create participant profile
    INSERT INTO participants (user_id, company_id, batch_id, profile_type)
    VALUES (v_user_id, v_company_id, p_batch_id, 'employee');
    
    SET v_participant_id = LAST_INSERT_ID();
    
    -- Update candidate record
    UPDATE interview_candidates 
    SET status = 'hired', converted_to_participant = v_participant_id
    WHERE candidate_id = p_candidate_id;
    
    -- Enroll in batch
    IF p_batch_id IS NOT NULL THEN
        INSERT INTO batch_participants (batch_id, participant_id)
        VALUES (p_batch_id, v_participant_id);
    END IF;
    
    SELECT v_participant_id as new_participant_id;
END //

-- Procedure to freeze assessment results after freeze period
CREATE PROCEDURE freeze_expired_results()
BEGIN
    DECLARE v_freeze_days INT DEFAULT 30;
    
    -- Get freeze period from settings
    SELECT CAST(setting_value AS UNSIGNED) INTO v_freeze_days
    FROM system_settings 
    WHERE setting_key = 'freeze_period_days';
    
    -- Freeze results that have exceeded the freeze period
    UPDATE assessment_results ar
    JOIN assessments a ON ar.assessment_id = a.assessment_id
    SET ar.is_frozen = TRUE,
        ar.freeze_date = CURRENT_DATE
    WHERE ar.is_frozen = FALSE
    AND a.completed_at IS NOT NULL
    AND DATEDIFF(CURRENT_DATE, a.completed_at) >= v_freeze_days;
END //

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

-- Trigger to update batch current size
CREATE TRIGGER update_batch_size_after_enrollment
AFTER INSERT ON batch_participants
FOR EACH ROW
BEGIN
    UPDATE batches 
    SET current_size = (
        SELECT COUNT(*) 
        FROM batch_participants 
        WHERE batch_id = NEW.batch_id 
        AND completion_status != 'dropped'
    )
    WHERE batch_id = NEW.batch_id;
END //

-- Trigger to log result edits
CREATE TRIGGER log_result_edit
AFTER UPDATE ON assessment_results
FOR EACH ROW
BEGIN
    IF NEW.final_result != OLD.final_result THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
        VALUES (NEW.last_edited_by, 'EDIT_FINAL_RESULT', 'assessment_results', NEW.result_id,
                JSON_OBJECT('final_result', OLD.final_result),
                JSON_OBJECT('final_result', NEW.final_result));
    END IF;
END //

DELIMITER ;

-- ============================================
-- GRANT PERMISSIONS (Example for MySQL)
-- ============================================

-- Create database users for different roles
-- CREATE USER 'app_participant'@'%' IDENTIFIED BY 'secure_password';
-- CREATE USER 'app_coach'@'%' IDENTIFIED BY 'secure_password';
-- CREATE USER 'app_company'@'%' IDENTIFIED BY 'secure_password';
-- CREATE USER 'app_admin'@'%' IDENTIFIED BY 'secure_password';

-- Grant appropriate permissions
-- GRANT SELECT, INSERT, UPDATE ON training_platform.* TO 'app_participant'@'%';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON training_platform.* TO 'app_coach'@'%';
-- GRANT SELECT, INSERT, UPDATE ON training_platform.* TO 'app_company'@'%';
-- GRANT ALL PRIVILEGES ON training_platform.* TO 'app_admin'@'%';

-- FLUSH PRIVILEGES;