# Database Schema Documentation

## Overview

The CMS/LMS/CRM system uses a MySQL database with 20+ interconnected tables to manage contacts, leads, assessments, and marketing campaigns. The schema is designed for scalability, data integrity, and efficient querying.

## Entity Relationship Diagram

```
Users (1) -----> (N) Contacts
Users (1) -----> (N) CrmTrackers
Users (1) -----> (N) Assessments
Users (1) -----> (N) Campaigns

Contacts (N) <----> (N) Categories (via contact_categories)
Contacts (1) -----> (N) ContactNotes
Contacts (1) -----> (N) ContactActivities
Contacts (1) -----> (N) SocialMediaProfiles
Contacts (1) -----> (N) CrmLeads
Contacts (1) -----> (N) AssessmentResponses

CrmTrackers (N) <----> (N) CrmFields (via crm_tracker_fields)
CrmTrackers (1) -----> (N) CrmLeads
CrmTrackers (N) <----> (N) Users as Partners (via crm_tracker_partners)

Assessments (1) -----> (N) AssessmentQuestions
AssessmentQuestions (1) -----> (N) AssessmentQuestionOptions
AssessmentResponses (1) -----> (N) AssessmentAnswers

Campaigns (N) <----> (N) Categories (via campaign_categories)
Campaigns (N) <----> (N) Contacts (via campaign_recipients)
Campaigns (1) -----> (N) CampaignMessages
```

## Table Definitions

### Core Tables

#### users
Primary user management table supporting role-based access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| firstName | VARCHAR(100) | NOT NULL | User's first name |
| lastName | VARCHAR(100) | NOT NULL | User's last name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| phoneNumber | VARCHAR(20) | NULL | Contact number |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | NOT NULL | admin, internal_staff, partner, client |
| status | ENUM | NOT NULL | active, inactive, suspended |
| company | VARCHAR(255) | NULL | Company name |
| designation | VARCHAR(100) | NULL | Job title |
| profilePicture | TEXT | NULL | Profile image URL |
| isEmailVerified | BOOLEAN | DEFAULT FALSE | Email verification status |
| lastLoginAt | DATETIME | NULL | Last login timestamp |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE KEY (email)
- INDEX (role, status)

#### contacts
Central contact repository with standard and assessment-derived information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| firstName | VARCHAR(100) | NOT NULL | Contact's first name |
| lastName | VARCHAR(100) | NOT NULL | Contact's last name |
| contactNumber | VARCHAR(20) | NOT NULL | Phone number |
| email | VARCHAR(255) | NOT NULL | Email address |
| location | VARCHAR(255) | NULL | Geographic location |
| contactType | ENUM | NULL | entrepreneur, employee |
| company | VARCHAR(255) | NULL | Company name |
| designation | VARCHAR(100) | NULL | Job title |
| industry | VARCHAR(100) | NULL | Industry sector |
| website | VARCHAR(255) | NULL | Company website |
| innerDrives | TEXT | NULL | Assessment-derived inner drives |
| baselines | TEXT | NULL | Assessment-derived baselines |
| traits | TEXT | NULL | Assessment-derived traits |
| personalityType | VARCHAR(100) | NULL | Assessment-derived personality type |
| assessmentTrait | VARCHAR(100) | NULL | Primary trait assessed |
| assessmentScore | INT | NULL | Assessment score achieved |
| assessmentMaxScore | INT | NULL | Maximum possible score |
| assessmentRanking | VARCHAR(50) | NULL | Performance ranking |
| isDuplicate | BOOLEAN | DEFAULT FALSE | Duplicate flag |
| mergedWithContactId | VARCHAR(36) | NULL | Reference to merged contact |
| createdById | VARCHAR(36) | NOT NULL | FK to users |
| updatedById | VARCHAR(36) | NULL | FK to users |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (email)
- INDEX (contactNumber)
- INDEX (company)
- INDEX (createdById)
- INDEX (isDuplicate)

#### categories
Flexible categorization system for contacts and campaigns.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| description | TEXT | NULL | Category description |
| color | VARCHAR(7) | NULL | Hex color code |
| isActive | BOOLEAN | DEFAULT TRUE | Active status |
| createdById | VARCHAR(36) | NOT NULL | FK to users |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

### CRM Tables

#### crm_trackers
Product-specific lead tracking configurations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| name | VARCHAR(100) | NOT NULL | Tracker name |
| description | TEXT | NULL | Tracker description |
| productName | VARCHAR(100) | NOT NULL | Associated product |
| isActive | BOOLEAN | DEFAULT TRUE | Active status |
| createdById | VARCHAR(36) | NOT NULL | FK to users |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

#### crm_fields
Reusable field definitions for CRM trackers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| name | VARCHAR(100) | NOT NULL | Field name (technical) |
| label | VARCHAR(100) | NOT NULL | Field label (display) |
| fieldType | ENUM | NOT NULL | text, number, email, select, etc. |
| description | TEXT | NULL | Field description |
| isRequired | BOOLEAN | DEFAULT FALSE | Required field flag |
| options | JSON | NULL | Options for select fields |
| defaultValue | TEXT | NULL | Default field value |
| placeholder | VARCHAR(255) | NULL | Input placeholder |
| minLength | INT | NULL | Minimum length validation |
| maxLength | INT | NULL | Maximum length validation |
| validationRegex | TEXT | NULL | Custom validation pattern |
| validationMessage | VARCHAR(255) | NULL | Validation error message |
| sortOrder | INT | DEFAULT 0 | Display order |
| isActive | BOOLEAN | DEFAULT TRUE | Active status |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

#### crm_leads
Individual lead records within trackers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| contactId | VARCHAR(36) | NOT NULL | FK to contacts |
| trackerId | VARCHAR(36) | NOT NULL | FK to crm_trackers |
| status | ENUM | NOT NULL | Lead pipeline status |
| priority | ENUM | DEFAULT 'medium' | Lead priority level |
| estimatedValue | DECIMAL(10,2) | NULL | Potential deal value |
| expectedCloseDate | DATE | NULL | Expected closing date |
| notes | TEXT | NULL | General notes |
| customFieldValues | JSON | NULL | Dynamic field values |
| lastContactDate | DATE | NULL | Last contact date |
| nextFollowUpDate | DATE | NULL | Next follow-up date |
| assignedToId | VARCHAR(36) | NULL | FK to users (assigned user) |
| createdById | VARCHAR(36) | NOT NULL | FK to users (creator) |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (contactId)
- INDEX (trackerId)
- INDEX (status)
- INDEX (assignedToId)
- INDEX (expectedCloseDate)

### Assessment Tables

#### assessments
Assessment definitions and configurations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| title | VARCHAR(255) | NOT NULL | Assessment title |
| description | TEXT | NOT NULL | Assessment description |
| trait | VARCHAR(100) | NOT NULL | Primary trait being assessed |
| instructions | TEXT | NULL | Assessment instructions |
| totalQuestions | INT | DEFAULT 0 | Number of questions |
| maxScore | INT | DEFAULT 0 | Maximum possible score |
| timeLimit | INT | NULL | Time limit in minutes |
| status | ENUM | DEFAULT 'draft' | Assessment status |
| scoringLogic | JSON | NULL | Complex scoring rules |
| resultCriteria | JSON | NULL | Result mapping criteria |
| publicUrl | VARCHAR(255) | UNIQUE, NOT NULL | Public sharing URL |
| totalResponses | INT | DEFAULT 0 | Response count |
| createdById | VARCHAR(36) | NOT NULL | FK to users |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

#### assessment_questions
Individual questions within assessments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| assessmentId | VARCHAR(36) | NOT NULL | FK to assessments |
| questionText | TEXT | NOT NULL | Question content |
| type | ENUM | NOT NULL | Question type |
| sortOrder | INT | DEFAULT 0 | Question order |
| isRequired | BOOLEAN | DEFAULT FALSE | Required flag |
| description | TEXT | NULL | Question description |
| hint | TEXT | NULL | Help text |
| points | INT | DEFAULT 0 | Points for correct answer |
| minRating | INT | NULL | Min rating (for rating questions) |
| maxRating | INT | NULL | Max rating (for rating questions) |
| ratingLabel | VARCHAR(100) | NULL | Rating scale label |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

#### assessment_responses
Individual assessment submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| assessmentId | VARCHAR(36) | NOT NULL | FK to assessments |
| contactId | VARCHAR(36) | NULL | FK to contacts (if registered) |
| status | ENUM | DEFAULT 'in_progress' | Response status |
| totalScore | INT | DEFAULT 0 | Total score achieved |
| maxPossibleScore | INT | DEFAULT 0 | Maximum possible score |
| completionPercentage | DECIMAL(5,2) | NULL | Completion percentage |
| startedAt | DATETIME | NULL | Start timestamp |
| completedAt | DATETIME | NULL | Completion timestamp |
| timeTaken | INT | NULL | Time taken in minutes |
| resultRanking | VARCHAR(50) | NULL | Performance ranking |
| resultDescription | TEXT | NULL | Result description |
| personalityType | VARCHAR(100) | NULL | Derived personality type |
| traits | TEXT | NULL | Derived traits |
| innerDrives | TEXT | NULL | Derived inner drives |
| baselines | TEXT | NULL | Derived baselines |
| ipAddress | VARCHAR(45) | NULL | User IP address |
| userAgent | TEXT | NULL | User agent string |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

### Marketing Tables

#### campaigns
Marketing campaign definitions and tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| name | VARCHAR(255) | NOT NULL | Campaign name |
| description | TEXT | NULL | Campaign description |
| type | ENUM | NOT NULL | email, whatsapp, sms |
| status | ENUM | DEFAULT 'draft' | Campaign status |
| subject | VARCHAR(255) | NULL | Email subject line |
| messageContent | TEXT | NULL | Message content |
| scheduledAt | DATETIME | NULL | Scheduled send time |
| startedAt | DATETIME | NULL | Actual start time |
| completedAt | DATETIME | NULL | Completion time |
| totalRecipients | INT | DEFAULT 0 | Total recipient count |
| sentCount | INT | DEFAULT 0 | Successfully sent count |
| deliveredCount | INT | DEFAULT 0 | Delivered count |
| openedCount | INT | DEFAULT 0 | Opened count (email) |
| clickedCount | INT | DEFAULT 0 | Clicked count (email) |
| bounceCount | INT | DEFAULT 0 | Bounce count |
| unsubscribeCount | INT | DEFAULT 0 | Unsubscribe count |
| filterCriteria | JSON | NULL | Advanced filtering rules |
| emailTemplateId | VARCHAR(36) | NULL | FK to email_templates |
| createdById | VARCHAR(36) | NOT NULL | FK to users |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

#### email_templates
Reusable email and message templates.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| name | VARCHAR(255) | NOT NULL | Template name |
| description | TEXT | NULL | Template description |
| type | ENUM | DEFAULT 'email' | Template type |
| subject | VARCHAR(255) | NULL | Email subject template |
| htmlContent | TEXT | NOT NULL | HTML content |
| textContent | TEXT | NULL | Plain text version |
| variables | JSON | NULL | Available variables |
| isDefault | BOOLEAN | DEFAULT FALSE | Default template flag |
| isActive | BOOLEAN | DEFAULT TRUE | Active status |
| createdById | VARCHAR(36) | NOT NULL | FK to users |
| createdAt | DATETIME | NOT NULL | Record creation time |
| updatedAt | DATETIME | NOT NULL | Last update time |

### Junction Tables

#### contact_categories
Many-to-many relationship between contacts and categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| contactId | VARCHAR(36) | NOT NULL | FK to contacts |
| categoryId | VARCHAR(36) | NOT NULL | FK to categories |

**Indexes:**
- PRIMARY KEY (contactId, categoryId)
- INDEX (categoryId)

#### crm_tracker_fields
Many-to-many relationship between CRM trackers and fields.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| trackerId | VARCHAR(36) | NOT NULL | FK to crm_trackers |
| fieldId | VARCHAR(36) | NOT NULL | FK to crm_fields |

#### crm_tracker_partners
Many-to-many relationship between CRM trackers and partner users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| trackerId | VARCHAR(36) | NOT NULL | FK to crm_trackers |
| partnerId | VARCHAR(36) | NOT NULL | FK to users |

#### campaign_categories
Many-to-many relationship between campaigns and target categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| campaignId | VARCHAR(36) | NOT NULL | FK to campaigns |
| categoryId | VARCHAR(36) | NOT NULL | FK to categories |

#### campaign_recipients
Many-to-many relationship between campaigns and recipient contacts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| campaignId | VARCHAR(36) | NOT NULL | FK to campaigns |
| contactId | VARCHAR(36) | NOT NULL | FK to contacts |

### Audit and Logging

#### audit_logs
Complete audit trail of all system actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PRIMARY KEY | UUID |
| userId | VARCHAR(36) | NULL | FK to users (actor) |
| action | ENUM | NOT NULL | Action type |
| entityType | ENUM | NOT NULL | Entity type affected |
| entityId | VARCHAR(36) | NULL | Entity ID affected |
| entityName | TEXT | NULL | Human-readable entity name |
| oldValues | JSON | NULL | Previous values (updates) |
| newValues | JSON | NULL | New values (creates/updates) |
| description | TEXT | NULL | Human-readable description |
| ipAddress | VARCHAR(45) | NULL | User IP address |
| userAgent | TEXT | NULL | User agent string |
| createdAt | DATETIME | NOT NULL | Action timestamp |

**Indexes:**
- PRIMARY KEY (id)
- INDEX (userId)
- INDEX (entityType, entityId)
- INDEX (action)
- INDEX (createdAt)

## Data Relationships

### Key Relationships

1. **Users → Contacts**: One user can create/manage many contacts
2. **Contacts → Categories**: Many-to-many relationship for flexible tagging
3. **Contacts → CRM Leads**: One contact can have multiple leads in different trackers
4. **CRM Trackers → CRM Fields**: Many-to-many for customizable field sets
5. **Assessments → Assessment Responses**: One assessment can have many responses
6. **Assessment Responses → Contacts**: Responses can create or link to contacts
7. **Campaigns → Contacts**: Many-to-many for recipient targeting

### Cascade Rules

- **Contact deletion**: Cascades to notes, activities, social profiles, but preserves CRM leads
- **Assessment deletion**: Cascades to questions and options, but preserves responses for historical data
- **Campaign deletion**: Cascades to campaign messages
- **User deletion**: Restricted if they have created contacts or other critical data

### Data Integrity Constraints

- **Email uniqueness**: Enforced at contact level with duplicate detection
- **Assessment URLs**: Must be unique for public sharing
- **User roles**: Enforced through application logic and database constraints
- **Required fields**: Enforced at both database and application levels

## Performance Considerations

### Indexing Strategy

1. **Primary keys**: All tables use UUID primary keys
2. **Foreign keys**: All foreign key columns are indexed
3. **Search fields**: Email, phone, company name are indexed
4. **Date fields**: Creation and update timestamps are indexed
5. **Status fields**: Enumerated status fields are indexed

### Query Optimization

1. **Contact searches**: Optimized for name, email, company searches
2. **Lead filtering**: Indexed by status, assigned user, dates
3. **Assessment responses**: Indexed by assessment and completion status
4. **Campaign performance**: Indexed by type, status, and dates
5. **Audit queries**: Indexed by user, entity type, and date ranges

### Partitioning Recommendations

For large-scale deployments:

1. **Audit logs**: Partition by month/quarter
2. **Assessment responses**: Partition by assessment or date
3. **Campaign messages**: Partition by campaign or date
4. **Contact activities**: Partition by date

This schema design provides a robust foundation for the CMS/LMS/CRM system with excellent scalability, data integrity, and query performance characteristics.