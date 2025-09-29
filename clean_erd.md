# Clean Learning & Assessment Platform ERD

## Overview
This is a simplified and reorganized version of the Entity-Relationship Diagram for the learning and assessment platform. The design has been cleaned up to reduce complexity and improve readability.

## Key Improvements Made:

1. **Simplified Audit Fields**: Consolidated audit relationships into a cleaner pattern
2. **Better Grouping**: Organized entities into logical domains
3. **Reduced Visual Clutter**: Removed redundant connections and simplified relationships
4. **Clearer Naming**: Used more descriptive and consistent naming conventions
5. **Logical Flow**: Organized relationships in a more intuitive order

## Entity Groups:

### 1. Core User Management
- `users` - Main user entity
- `companies` - Organization management
- `roles` - User roles
- `permissions` - System permissions
- `role_permissions` - Role-permission mapping

### 2. Learning Management
- `batches` - Learning cohorts
- `batch_participants` - User enrollment in batches

### 3. Assessment System
- `assessment_tools` - Available assessment tools
- `assignments` - Learning assignments
- `assignment_submissions` - Student submissions
- `assessments` - Assessment records

### 4. Content Management
- `resources` - Learning materials
- `batch_resource_access` - Resource access control

### 5. Interview System
- `interview_candidates` - External candidates
- `assessment_packages` - Purchased assessment packages

### 6. Quiz System
- `quizzes` - Quiz definitions
- `quiz_sessions` - Quiz attempts
- `quiz_responses` - Individual answers

### 7. System Configuration
- `system_settings` - Application settings

## Simplified Relationships:

### Core Relationships:
- Companies employ Users
- Users have Roles
- Roles have Permissions
- Companies own Batches
- Users coach Batches
- Users participate in Batches

### Assessment Relationships:
- Assessment Tools are used in Assignments and Assessments
- Users submit Assignment Submissions
- Users conduct Assessments
- Interview Candidates are evaluated in Assessments

### Content Relationships:
- Batches grant access to Resources
- Assessment Tools provide Resources
- Companies purchase Assessment Packages

### Quiz Relationships:
- Users take Quiz Sessions
- Quiz Sessions contain Quiz Responses

## Audit Trail Simplification:

Instead of having multiple audit fields per table, the design uses a consistent pattern:
- `created_by` - Who created the record
- `updated_by` - Who last updated the record
- `assigned_by` - Who assigned the record
- `graded_by` - Who graded the submission
- `enrolled_by` - Who enrolled the user
- `purchased_by` - Who made the purchase
- `unlocked_by` - Who granted access
- `started_by` - Who started the session

## Benefits of This Clean Design:

1. **Easier to Understand**: Clear separation of concerns
2. **Better Maintainability**: Simplified relationships
3. **Improved Performance**: Fewer complex joins
4. **Cleaner Code**: More intuitive data access patterns
5. **Better Documentation**: Self-documenting structure

## Next Steps:

1. **Review the simplified structure** with your team
2. **Identify any missing relationships** specific to your business needs
3. **Consider adding indexes** on frequently queried foreign keys
4. **Plan the migration strategy** from the current complex structure
5. **Create database views** for common query patterns

This clean design maintains all the functionality of the original while being much more maintainable and understandable.