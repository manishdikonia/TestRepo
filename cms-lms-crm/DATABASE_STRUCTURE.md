# Database Structure & Relationships Documentation

## 📊 Complete Database Schema Overview

This document provides a comprehensive overview of the database structure for the CMS/LMS/CRM system, including all tables, relationships, and data flow.

---

## 🗂️ **Core Tables Overview**

### **1. USER MANAGEMENT**

#### **USERS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR | UNIQUE, NOT NULL | User email address |
| password | VARCHAR | NOT NULL | Hashed password |
| firstName | VARCHAR | NOT NULL | User's first name |
| lastName | VARCHAR | NOT NULL | User's last name |
| phone | VARCHAR | NULL | User's phone number |
| role | ENUM | NOT NULL | User role (admin, internal_staff, partner, lead) |
| isActive | BOOLEAN | DEFAULT true | Account status |
| company | VARCHAR | NULL | User's company |
| designation | VARCHAR | NULL | User's job title |
| createdAt | TIMESTAMP | NOT NULL | Account creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

**User Roles:**
- `admin`: Full system access
- `internal_staff`: Contact and lead management
- `partner`: Restricted CRM access
- `lead`: Limited assessment access

---

### **2. CONTACT MANAGEMENT SYSTEM (CMS)**

#### **CONTACT_CATEGORIES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Category identifier |
| name | VARCHAR | UNIQUE, NOT NULL | Category name |
| description | TEXT | NULL | Category description |
| isActive | BOOLEAN | DEFAULT true | Category status |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **CONTACTS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Contact identifier |
| name | VARCHAR | NOT NULL | Contact's full name |
| contactNo | VARCHAR | UNIQUE, NOT NULL | Phone number |
| emailId | VARCHAR | UNIQUE, NOT NULL | Email address |
| location | VARCHAR | NOT NULL | Geographic location |
| type | ENUM | NOT NULL | Contact type (entrepreneur/employee) |
| company | VARCHAR | NULL | Company name |
| designation | VARCHAR | NULL | Job title |
| industry | VARCHAR | NULL | Industry sector |
| website | VARCHAR | NULL | Company website |
| innerDrives | TEXT | NULL | Assessment-based inner drives |
| baselines | TEXT | NULL | Assessment-based baselines |
| traits | TEXT | NULL | Assessment-based traits |
| personalityType | VARCHAR | NULL | Assessment-based personality type |
| categoryId | UUID | FOREIGN KEY | Reference to contact category |
| createdById | UUID | FOREIGN KEY | User who created the contact |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **CONTACT_NOTES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Note identifier |
| content | TEXT | NOT NULL | Note content |
| attachmentUrl | VARCHAR | NULL | File attachment URL |
| attachmentName | VARCHAR | NULL | Original file name |
| contactId | UUID | FOREIGN KEY | Reference to contact |
| createdById | UUID | FOREIGN KEY | User who created the note |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **CONTACT_ACTIVITIES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Activity identifier |
| type | ENUM | NOT NULL | Activity type (reminder, todo, meeting, call, email, other) |
| title | VARCHAR | NOT NULL | Activity title |
| description | TEXT | NULL | Activity description |
| scheduledAt | TIMESTAMP | NULL | Scheduled date/time |
| isCompleted | BOOLEAN | DEFAULT false | Completion status |
| contactId | UUID | FOREIGN KEY | Reference to contact |
| createdById | UUID | FOREIGN KEY | User who created the activity |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **CONTACT_SOCIAL_LINKS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Social link identifier |
| platform | ENUM | NOT NULL | Platform (facebook, linkedin, instagram, twitter, youtube, other) |
| url | VARCHAR | NOT NULL | Social media URL |
| username | VARCHAR | NULL | Username/handle |
| contactId | UUID | FOREIGN KEY | Reference to contact |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

---

### **3. LEAD MANAGEMENT SYSTEM (LMS/CRM)**

#### **CRM_TRACKERS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Tracker identifier |
| name | VARCHAR | NOT NULL | Tracker name |
| description | TEXT | NULL | Tracker description |
| isActive | BOOLEAN | DEFAULT true | Tracker status |
| createdById | UUID | FOREIGN KEY | User who created the tracker |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **CRM_FIELDS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Field identifier |
| name | VARCHAR | NOT NULL | Field name |
| label | VARCHAR | NOT NULL | Display label |
| type | ENUM | NOT NULL | Field type (text, number, email, phone, date, select, multi_select, textarea, boolean) |
| isRequired | BOOLEAN | DEFAULT false | Required field flag |
| options | JSON | NULL | Options for select fields |
| placeholder | TEXT | NULL | Input placeholder |
| helpText | TEXT | NULL | Help text |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| trackerId | UUID | FOREIGN KEY | Reference to CRM tracker |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **LEADS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Lead identifier |
| title | VARCHAR | NOT NULL | Lead title |
| description | TEXT | NULL | Lead description |
| status | ENUM | DEFAULT 'new' | Lead status (new, contacted, qualified, proposal, negotiation, closed_won, closed_lost, on_hold) |
| estimatedValue | DECIMAL(10,2) | NULL | Estimated deal value |
| expectedCloseDate | TIMESTAMP | NULL | Expected closing date |
| contactId | UUID | FOREIGN KEY | Reference to contact |
| trackerId | UUID | FOREIGN KEY | Reference to CRM tracker |
| assignedToId | UUID | FOREIGN KEY | Assigned user |
| createdById | UUID | FOREIGN KEY | User who created the lead |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **LEAD_FIELD_VALUES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Field value identifier |
| value | TEXT | NULL | Field value |
| leadId | UUID | FOREIGN KEY | Reference to lead |
| fieldId | UUID | FOREIGN KEY | Reference to CRM field |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **LEAD_NOTES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Note identifier |
| content | TEXT | NOT NULL | Note content |
| leadId | UUID | FOREIGN KEY | Reference to lead |
| createdById | UUID | FOREIGN KEY | User who created the note |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

---

### **4. ASSESSMENT SYSTEM**

#### **ASSESSMENTS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Assessment identifier |
| title | VARCHAR | NOT NULL | Assessment title |
| description | TEXT | NULL | Assessment description |
| trait | ENUM | NOT NULL | Assessment trait (sales, marketing, hr_management, people_management, leadership, communication, technical, creativity) |
| isActive | BOOLEAN | DEFAULT true | Assessment status |
| isPublic | BOOLEAN | DEFAULT false | Public access flag |
| publicUrl | VARCHAR | NULL | Public access URL |
| scoringLogic | JSON | NULL | Scoring rules and criteria |
| createdById | UUID | FOREIGN KEY | User who created the assessment |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **ASSESSMENT_QUESTIONS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Question identifier |
| question | TEXT | NOT NULL | Question text |
| type | ENUM | NOT NULL | Question type (multiple_choice, subjective, rating_scale, true_false) |
| points | INTEGER | DEFAULT 0 | Question points |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| assessmentId | UUID | FOREIGN KEY | Reference to assessment |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **ASSESSMENT_QUESTION_OPTIONS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Option identifier |
| text | TEXT | NOT NULL | Option text |
| points | INTEGER | DEFAULT 0 | Option points |
| isCorrect | BOOLEAN | DEFAULT false | Correct answer flag |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| questionId | UUID | FOREIGN KEY | Reference to question |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **ASSESSMENT_RESPONSES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Response identifier |
| totalScore | INTEGER | DEFAULT 0 | Total score achieved |
| maxScore | INTEGER | DEFAULT 0 | Maximum possible score |
| percentage | DECIMAL(5,2) | DEFAULT 0 | Score percentage |
| personalityType | VARCHAR | NULL | Assigned personality type |
| traits | VARCHAR | NULL | Assigned traits |
| ranking | VARCHAR | NULL | Assigned ranking |
| assessmentId | UUID | FOREIGN KEY | Reference to assessment |
| contactId | UUID | FOREIGN KEY | Reference to contact |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **ASSESSMENT_RESPONSE_ANSWERS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Answer identifier |
| answerText | TEXT | NULL | Text answer |
| points | INTEGER | DEFAULT 0 | Points earned |
| responseId | UUID | FOREIGN KEY | Reference to response |
| questionId | UUID | FOREIGN KEY | Reference to question |
| optionId | UUID | FOREIGN KEY | Reference to selected option |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

---

### **5. QUESTIONNAIRE SYSTEM**

#### **QUESTIONNAIRES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Questionnaire identifier |
| title | VARCHAR | NOT NULL | Questionnaire title |
| description | TEXT | NULL | Questionnaire description |
| isActive | BOOLEAN | DEFAULT true | Questionnaire status |
| createdById | UUID | FOREIGN KEY | User who created the questionnaire |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **QUESTIONNAIRE_QUESTIONS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Question identifier |
| question | TEXT | NOT NULL | Question text |
| type | ENUM | NOT NULL | Question type (multiple_choice, text, rating_scale, yes_no, checkbox) |
| isRequired | BOOLEAN | DEFAULT false | Required question flag |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| helpText | TEXT | NULL | Help text |
| questionnaireId | UUID | FOREIGN KEY | Reference to questionnaire |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **QUESTIONNAIRE_QUESTION_OPTIONS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Option identifier |
| text | TEXT | NOT NULL | Option text |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| questionId | UUID | FOREIGN KEY | Reference to question |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **QUESTIONNAIRE_RESPONSES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Response identifier |
| questionnaireId | UUID | FOREIGN KEY | Reference to questionnaire |
| contactId | UUID | FOREIGN KEY | Reference to contact |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **QUESTIONNAIRE_RESPONSE_ANSWERS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Answer identifier |
| answerText | TEXT | NULL | Text answer |
| responseId | UUID | FOREIGN KEY | Reference to response |
| questionId | UUID | FOREIGN KEY | Reference to question |
| optionId | UUID | FOREIGN KEY | Reference to selected option |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

---

### **6. MARKETING SYSTEM**

#### **MARKETING_CAMPAIGNS Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Campaign identifier |
| name | VARCHAR | NOT NULL | Campaign name |
| description | TEXT | NULL | Campaign description |
| type | ENUM | NOT NULL | Campaign type (email, whatsapp, sms) |
| status | ENUM | DEFAULT 'draft' | Campaign status (draft, scheduled, running, completed, cancelled) |
| subject | TEXT | NOT NULL | Email subject line |
| content | TEXT | NOT NULL | Campaign content |
| scheduledAt | TIMESTAMP | NULL | Scheduled send time |
| sentAt | TIMESTAMP | NULL | Actual send time |
| totalRecipients | INTEGER | DEFAULT 0 | Total recipients |
| sentCount | INTEGER | DEFAULT 0 | Messages sent |
| deliveredCount | INTEGER | DEFAULT 0 | Messages delivered |
| openedCount | INTEGER | DEFAULT 0 | Messages opened |
| clickedCount | INTEGER | DEFAULT 0 | Links clicked |
| createdById | UUID | FOREIGN KEY | User who created the campaign |
| categoryId | UUID | FOREIGN KEY | Target category |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

#### **MARKETING_MESSAGES Table**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Message identifier |
| status | ENUM | DEFAULT 'pending' | Message status (pending, sent, delivered, failed, opened, clicked) |
| sentAt | TIMESTAMP | NULL | Send time |
| deliveredAt | TIMESTAMP | NULL | Delivery time |
| openedAt | TIMESTAMP | NULL | Open time |
| clickedAt | TIMESTAMP | NULL | Click time |
| errorMessage | TEXT | NULL | Error message if failed |
| campaignId | UUID | FOREIGN KEY | Reference to campaign |
| contactId | UUID | FOREIGN KEY | Reference to contact |
| createdAt | TIMESTAMP | NOT NULL | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update date |

---

## 🔗 **Database Relationships**

### **Primary Relationships:**

1. **USERS → CONTACTS** (One-to-Many)
   - A user can create multiple contacts
   - Each contact has one creator

2. **CONTACT_CATEGORIES → CONTACTS** (One-to-Many)
   - A category can contain multiple contacts
   - Each contact belongs to one category

3. **CONTACTS → CONTACT_NOTES** (One-to-Many)
   - A contact can have multiple notes
   - Each note belongs to one contact

4. **CONTACTS → CONTACT_ACTIVITIES** (One-to-Many)
   - A contact can have multiple activities
   - Each activity belongs to one contact

5. **CONTACTS → CONTACT_SOCIAL_LINKS** (One-to-Many)
   - A contact can have multiple social links
   - Each social link belongs to one contact

6. **CONTACTS → LEADS** (One-to-Many)
   - A contact can generate multiple leads
   - Each lead belongs to one contact

7. **CRM_TRACKERS → CRM_FIELDS** (One-to-Many)
   - A tracker can have multiple fields
   - Each field belongs to one tracker

8. **CRM_TRACKERS → LEADS** (One-to-Many)
   - A tracker can track multiple leads
   - Each lead belongs to one tracker

9. **LEADS → LEAD_FIELD_VALUES** (One-to-Many)
   - A lead can have multiple field values
   - Each field value belongs to one lead

10. **CRM_FIELDS → LEAD_FIELD_VALUES** (One-to-Many)
    - A field can have multiple values across leads
    - Each field value references one field

11. **ASSESSMENTS → ASSESSMENT_QUESTIONS** (One-to-Many)
    - An assessment can have multiple questions
    - Each question belongs to one assessment

12. **ASSESSMENT_QUESTIONS → ASSESSMENT_QUESTION_OPTIONS** (One-to-Many)
    - A question can have multiple options
    - Each option belongs to one question

13. **ASSESSMENTS → ASSESSMENT_RESPONSES** (One-to-Many)
    - An assessment can have multiple responses
    - Each response belongs to one assessment

14. **CONTACTS → ASSESSMENT_RESPONSES** (One-to-Many)
    - A contact can take multiple assessments
    - Each response belongs to one contact

15. **QUESTIONNAIRES → QUESTIONNAIRE_QUESTIONS** (One-to-Many)
    - A questionnaire can have multiple questions
    - Each question belongs to one questionnaire

16. **QUESTIONNAIRE_QUESTIONS → QUESTIONNAIRE_QUESTION_OPTIONS** (One-to-Many)
    - A question can have multiple options
    - Each option belongs to one question

17. **MARKETING_CAMPAIGNS → MARKETING_MESSAGES** (One-to-Many)
    - A campaign can send multiple messages
    - Each message belongs to one campaign

18. **CONTACTS → MARKETING_MESSAGES** (One-to-Many)
    - A contact can receive multiple messages
    - Each message is sent to one contact

---

## 📊 **Data Flow Architecture**

### **Contact Management Flow:**
1. **User** creates **Contact** with basic information
2. **Contact** is assigned to a **Category**
3. **User** can add **Notes**, **Activities**, and **Social Links** to **Contact**
4. **Contact** can generate **Leads** through various channels

### **Lead Management Flow:**
1. **Contact** generates a **Lead**
2. **Lead** is assigned to a **CRM Tracker**
3. **Lead** gets **Field Values** based on tracker's **Fields**
4. **User** can add **Notes** and update **Lead Status**

### **Assessment Flow:**
1. **User** creates **Assessment** with **Questions** and **Options**
2. **Contact** takes **Assessment** and provides **Answers**
3. System calculates **Score** and assigns **Personality Type/Traits**
4. Results are stored in **Contact's** specific information fields

### **Marketing Flow:**
1. **User** creates **Marketing Campaign** targeting specific **Category**
2. System identifies **Contacts** in the **Category**
3. **Messages** are sent to each **Contact**
4. System tracks delivery, opens, and clicks

---

## 🎯 **Key Business Rules**

### **Contact Management:**
- Each contact must have a unique phone number and email
- Contacts can be categorized for better organization
- Duplicate contacts can be detected and merged
- All contact activities are tracked with timestamps

### **Lead Management:**
- Leads must be linked to a contact
- Each lead belongs to a specific CRM tracker
- Lead status follows a defined pipeline
- Custom fields can be added to trackers

### **Assessment System:**
- Assessments can be public or private
- Scoring logic is configurable per assessment
- Results automatically update contact's personality profile
- Multiple assessments can be taken by the same contact

### **Marketing System:**
- Campaigns can target specific contact categories
- Message delivery is tracked for analytics
- Failed messages are logged with error details
- Campaign performance metrics are maintained

---

## 🔒 **Security & Data Integrity**

### **Constraints:**
- All primary keys are UUIDs for security
- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate data
- NOT NULL constraints ensure required data

### **Audit Trail:**
- All tables have `createdAt` and `updatedAt` timestamps
- User actions are tracked through foreign key relationships
- Soft delete capabilities where appropriate

### **Data Validation:**
- Email format validation
- Phone number format validation
- Enum constraints for predefined values
- JSON validation for complex data structures

---

This database structure provides a comprehensive foundation for the CMS/LMS/CRM system, supporting all the requirements specified in the client document while maintaining data integrity, scalability, and security.