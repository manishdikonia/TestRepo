# Training & Assessment Management Platform - Database Schema Documentation

## Overview
This document provides a comprehensive overview of the database schema for the Training & Assessment Management Platform. The schema is designed to support a multi-tenant system with role-based access control, assessment management, training batch management, and integration capabilities.

## Core Design Principles
1. **Normalization**: The schema follows 3NF (Third Normal Form) to minimize data redundancy
2. **Scalability**: Designed to handle multiple companies, unlimited participants, and various assessment tools
3. **Flexibility**: Supports multiple assessment types and can be extended with new tools
4. **Audit Trail**: Comprehensive logging for all critical operations
5. **Data Integrity**: Foreign key constraints ensure referential integrity

## Entity Categories

### 1. User Management Entities
- **USERS**: Base table for all system users
- **PARTICIPANTS**: Employees and individual participants
- **COACHES**: Trainers and coaches
- **ADMINS**: System administrators
- **COMPANIES**: Organizations using the platform

### 2. Assessment Entities
- **ASSESSMENT_TOOLS**: Available assessment types (Inner Drives, N1, etc.)
- **QUESTIONS**: Questions for each assessment tool
- **ASSESSMENTS**: Individual assessment instances
- **ASSESSMENT_RESULTS**: Both calculated and final results
- **ASSESSMENT_RESPONSES**: Individual question responses

### 3. Training Management Entities
- **BATCHES**: Training batches for companies
- **ASSIGNMENTS**: Tasks linked to assessments
- **PARTICIPANT_ASSIGNMENTS**: Assignment tracking for participants
- **RESOURCES**: Learning materials and documents
- **BATCH_RESOURCES**: Resource access control per batch

### 4. Quiz Management Entities
- **QUIZZES**: Quiz definitions
- **QUIZ_QUESTIONS**: Questions for each quiz
- **QUIZ_SESSIONS**: Live quiz instances
- **QUIZ_RESPONSES**: Temporary response storage

### 5. Administrative Entities
- **COACH_ASSIGNMENTS**: Coach-to-company mappings
- **COMPANY_PACKAGES**: Assessment purchase packages
- **SYSTEM_SETTINGS**: Global configuration
- **AUDIT_LOGS**: System activity tracking
- **CRM_SYNC_LOG**: External system integration logs

## Detailed Entity Specifications

### USERS Table
Primary entity for authentication and user management.

**Columns:**
- `user_id` (PK): Unique identifier
- `email`: Login email (unique)
- `password_hash`: Encrypted password
- `first_name`, `last_name`: User's name
- `phone`: Contact number
- `user_type`: ENUM('participant', 'coach', 'admin', 'management')
- `is_active`: Account status
- `created_at`, `updated_at`: Timestamps

**Relationships:**
- One-to-Zero/One with PARTICIPANTS, COACHES, ADMINS
- One-to-Many with AUDIT_LOGS

### COMPANIES Table
Organizations using the platform.

**Columns:**
- `company_id` (PK): Unique identifier
- `company_name`: Organization name
- `industry`: Industry sector
- `hr_contact_email`, `hr_contact_phone`: HR contact details
- `address`: Company address
- `max_employees`: Contract limit
- `contract_start_date`, `contract_end_date`: Contract period
- `created_at`: Registration date

**Relationships:**
- One-to-Many with PARTICIPANTS, BATCHES, COMPANY_PACKAGES
- One-to-Many with COACH_ASSIGNMENTS

### PARTICIPANTS Table
Employees and individual participants.

**Columns:**
- `participant_id` (PK): Unique identifier
- `user_id` (FK): Links to USERS
- `company_id` (FK): Links to COMPANIES (nullable for individuals)
- `batch_id` (FK): Current batch assignment
- `designation`, `department`: Job details
- `employee_id`: Company's employee ID
- `participant_type`: ENUM('employee', 'individual', 'interview_candidate')
- `joining_date`: Enrollment date
- `is_interview_candidate`: Boolean flag
- `hired_date`: Conversion date if hired

**Relationships:**
- Many-to-One with USERS, COMPANIES, BATCHES
- One-to-Many with ASSESSMENTS, PARTICIPANT_ASSIGNMENTS, QUIZ_RESPONSES, CRM_SYNC_LOG

### ASSESSMENT_TOOLS Table
Available assessment types in the system.

**Columns:**
- `tool_id` (PK): Unique identifier
- `tool_name`: Display name (e.g., "Inner Drives")
- `tool_code`: System code (e.g., "INNER_DRIVES")
- `description`: Tool description
- `version`: Tool version
- `is_active`: Availability status
- `created_at`: Addition date

**Relationships:**
- One-to-Many with QUESTIONS, ASSESSMENTS, ASSIGNMENTS, RESOURCES

### ASSESSMENTS Table
Individual assessment instances taken by participants.

**Columns:**
- `assessment_id` (PK): Unique identifier
- `participant_id` (FK): Who took the assessment
- `tool_id` (FK): Which assessment tool
- `batch_id` (FK): Associated batch (nullable)
- `assessment_date`: Completion date
- `status`: ENUM('pending', 'in_progress', 'completed', 'locked')
- `start_time`, `end_time`: Duration tracking
- `assessment_score`: Calculated score
- `is_locked`: Freeze status
- `locked_date`: When locked

**Relationships:**
- Many-to-One with PARTICIPANTS, ASSESSMENT_TOOLS, BATCHES
- One-to-Many with ASSESSMENT_RESULTS, ASSESSMENT_RESPONSES

### BATCHES Table
Training batches for organized learning.

**Columns:**
- `batch_id` (PK): Unique identifier
- `company_id` (FK): Owning company
- `coach_id` (FK): Assigned coach
- `batch_name`: Display name
- `batch_code`: Unique code
- `start_date`, `end_date`: Batch duration
- `max_participants`: Size limit
- `status`: ENUM('planned', 'active', 'completed', 'cancelled')

**Relationships:**
- Many-to-One with COMPANIES, COACHES
- One-to-Many with PARTICIPANTS, ASSESSMENTS, BATCH_RESOURCES, QUIZ_SESSIONS

## Key Design Decisions

### 1. User Role Management
- Single USERS table with role-specific extension tables
- Allows users to have multiple roles if needed
- Simplifies authentication while maintaining role-specific data

### 2. Assessment Results Storage
- Separate tables for results and responses
- Supports both auto-calculated and manually edited final results
- Implements freeze period logic at application level

### 3. Resource Access Control
- Resources linked to assessment tools
- Batch-level unlocking through BATCH_RESOURCES
- View-only enforcement at application level

### 4. Interview Candidate Handling
- Uses same PARTICIPANTS table with type flag
- Conversion to employee updates the type and links to company
- Maintains assessment history through conversion

### 5. Quiz Management
- Temporary storage for live quiz responses
- Session-based access control
- Results displayed real-time but not permanently stored

## Indexes and Performance Considerations

### Recommended Indexes:
1. **USERS**: Index on `email` (unique), `user_type`
2. **PARTICIPANTS**: Index on `user_id`, `company_id`, `batch_id`, `participant_type`
3. **ASSESSMENTS**: Index on `participant_id`, `tool_id`, `status`, `assessment_date`
4. **ASSESSMENT_RESULTS**: Index on `assessment_id`, `result_type`
5. **BATCHES**: Index on `company_id`, `coach_id`, `status`
6. **AUDIT_LOGS**: Index on `user_id`, `timestamp`, `entity_type`

### Query Optimization:
- Use composite indexes for frequently joined columns
- Partition AUDIT_LOGS by date for better performance
- Consider read replicas for reporting queries

## Data Migration and Integration

### CRM Integration Points:
1. **Participant Creation**: Sync new participants to CRM
2. **Assessment Completion**: Push results to CRM
3. **Batch Updates**: Sync batch assignments
4. **Status Changes**: Update participant status

### API Endpoints Required:
- `/api/participants/sync` - Participant data sync
- `/api/assessments/results` - Assessment results push
- `/api/batches/updates` - Batch information sync

## Security Considerations

1. **Data Encryption**:
   - Encrypt sensitive fields (passwords, personal data)
   - Use column-level encryption for PII

2. **Access Control**:
   - Row-level security for multi-tenant isolation
   - Role-based access at application level

3. **Audit Requirements**:
   - Log all data modifications
   - Track user sessions and access patterns

4. **Data Retention**:
   - Assessment results: Permanent
   - Quiz responses: Temporary (session-based)
   - Audit logs: Configurable retention period

## Backup and Recovery Strategy

1. **Backup Schedule**:
   - Daily full backups
   - Hourly incremental backups
   - Real-time replication to standby server

2. **Recovery Points**:
   - RPO (Recovery Point Objective): 1 hour
   - RTO (Recovery Time Objective): 4 hours

3. **Critical Data**:
   - ASSESSMENTS and ASSESSMENT_RESULTS
   - PARTICIPANTS and COMPANIES
   - SYSTEM_SETTINGS

## Future Enhancements

1. **Planned Features**:
   - Multi-language support (add language columns)
   - Advanced analytics tables
   - Notification system tables
   - Payment integration tables

2. **Scalability Considerations**:
   - Sharding by company_id for horizontal scaling
   - Separate read/write databases
   - Caching layer for frequently accessed data

## Database Implementation Script Structure

```sql
-- 1. Create database
CREATE DATABASE training_assessment_platform;

-- 2. Create tables in order (respecting foreign key dependencies)
-- 3. Add indexes
-- 4. Add constraints
-- 5. Insert default data (system settings, admin user)
-- 6. Create views for reporting
-- 7. Set up triggers for audit logging
```

## Conclusion

This database schema provides a robust foundation for the Training & Assessment Management Platform. It supports all required functionality including:
- Multi-tenant architecture
- Role-based access control
- Comprehensive assessment management
- Training batch organization
- Resource sharing with access control
- Live quiz functionality
- External system integration
- Audit trail and compliance

The schema is designed to be maintainable, scalable, and secure, with clear separation of concerns and proper normalization.