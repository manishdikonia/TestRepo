# Database Relationships Diagram

## 🗂️ **Visual Database Structure**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                USER MANAGEMENT                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│      USERS      │
├─────────────────┤
│ id (PK)         │
│ email (UK)      │
│ password        │
│ firstName       │
│ lastName        │
│ phone           │
│ role            │
│ isActive        │
│ company         │
│ designation     │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CONTACT MANAGEMENT SYSTEM                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│CONTACT_CATEGORIES│    │    CONTACTS     │    │  CONTACT_NOTES  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄───┤ id (PK)         │───►│ id (PK)         │
│ name (UK)       │ 1:N│ name            │ 1:N│ content         │
│ description     │    │ contactNo (UK)  │    │ attachmentUrl   │
│ isActive        │    │ emailId (UK)    │    │ attachmentName  │
│ createdAt       │    │ location        │    │ contactId (FK)  │
│ updatedAt       │    │ type            │    │ createdById (FK)│
└─────────────────┘    │ company         │    │ createdAt       │
                       │ designation     │    │ updatedAt       │
                       │ industry        │    └─────────────────┘
                       │ website         │
                       │ innerDrives     │    ┌─────────────────┐
                       │ baselines       │    │CONTACT_ACTIVITIES│
                       │ traits          │    ├─────────────────┤
                       │ personalityType │───►│ id (PK)         │
                       │ categoryId (FK) │ 1:N│ type            │
                       │ createdById (FK)│    │ title           │
                       │ createdAt       │    │ description     │
                       │ updatedAt       │    │ scheduledAt     │
                       └─────────────────┘    │ isCompleted     │
                                │             │ contactId (FK)  │
                                │             │ createdById (FK)│
                                │             │ createdAt       │
                                │             │ updatedAt       │
                                │             └─────────────────┘
                                │
                                │ 1:N
                                ▼
                       ┌─────────────────┐
                       │CONTACT_SOCIAL_  │
                       │     LINKS       │
                       ├─────────────────┤
                       │ id (PK)         │
                       │ platform        │
                       │ url             │
                       │ username        │
                       │ contactId (FK)  │
                       │ createdAt       │
                       │ updatedAt       │
                       └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            LEAD MANAGEMENT SYSTEM                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  CRM_TRACKERS   │    │     LEADS       │    │   CRM_FIELDS    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄───┤ id (PK)         │    │ id (PK)         │
│ name            │ 1:N│ title           │    │ name            │
│ description     │    │ description     │    │ label           │
│ isActive        │    │ status          │    │ type            │
│ createdById (FK)│    │ estimatedValue  │    │ isRequired      │
│ createdAt       │    │ expectedCloseDate│   │ options         │
│ updatedAt       │    │ contactId (FK)  │    │ placeholder     │
└─────────────────┘    │ trackerId (FK)  │    │ helpText        │
         │             │ assignedToId(FK)│    │ sortOrder       │
         │ 1:N         │ createdById (FK)│    │ trackerId (FK)  │
         ▼             │ createdAt       │    │ createdAt       │
┌─────────────────┐    │ updatedAt       │    │ updatedAt       │
│   CRM_FIELDS    │    └─────────────────┘    └─────────────────┘
├─────────────────┤             │                       │
│ id (PK)         │             │ 1:N                   │ 1:N
│ name            │             ▼                       ▼
│ label           │    ┌─────────────────┐    ┌─────────────────┐
│ type            │    │ LEAD_FIELD_     │    │ LEAD_FIELD_     │
│ isRequired      │    │    VALUES       │    │    VALUES       │
│ options         │    ├─────────────────┤    ├─────────────────┤
│ placeholder     │    │ id (PK)         │    │ id (PK)         │
│ helpText        │    │ value           │    │ value           │
│ sortOrder       │    │ leadId (FK)     │    │ leadId (FK)     │
│ trackerId (FK)  │    │ fieldId (FK)    │    │ fieldId (FK)    │
│ createdAt       │    │ createdAt       │    │ createdAt       │
│ updatedAt       │    │ updatedAt       │    │ updatedAt       │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ASSESSMENT SYSTEM                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  ASSESSMENTS    │    │ASSESSMENT_      │    │ASSESSMENT_      │
├─────────────────┤    │   QUESTIONS     │    │QUESTION_OPTIONS │
│ id (PK)         │◄───┤ id (PK)         │◄───┤ id (PK)         │
│ title           │ 1:N│ question        │ 1:N│ text            │
│ description     │    │ type            │    │ points          │
│ trait           │    │ points          │    │ isCorrect       │
│ isActive        │    │ sortOrder       │    │ sortOrder       │
│ isPublic        │    │ assessmentId(FK)│    │ questionId (FK) │
│ publicUrl       │    │ createdAt       │    │ createdAt       │
│ scoringLogic    │    │ updatedAt       │    │ updatedAt       │
│ createdById (FK)│    └─────────────────┘    └─────────────────┘
│ createdAt       │
│ updatedAt       │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐    ┌─────────────────┐
│ASSESSMENT_      │    │ASSESSMENT_      │
│  RESPONSES      │    │RESPONSE_ANSWERS │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄───┤ id (PK)         │
│ totalScore      │ 1:N│ answerText      │
│ maxScore        │    │ points          │
│ percentage      │    │ responseId (FK) │
│ personalityType │    │ questionId (FK) │
│ traits          │    │ optionId (FK)   │
│ ranking         │    │ createdAt       │
│ assessmentId(FK)│    │ updatedAt       │
│ contactId (FK)  │    └─────────────────┘
│ createdAt       │
│ updatedAt       │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            QUESTIONNAIRE SYSTEM                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ QUESTIONNAIRES  │    │QUESTIONNAIRE_   │    │QUESTIONNAIRE_   │
├─────────────────┤    │   QUESTIONS     │    │QUESTION_OPTIONS │
│ id (PK)         │◄───┤ id (PK)         │◄───┤ id (PK)         │
│ title           │ 1:N│ question        │ 1:N│ text            │
│ description     │    │ type            │    │ sortOrder       │
│ isActive        │    │ isRequired      │    │ questionId (FK) │
│ createdById (FK)│    │ sortOrder       │    │ createdAt       │
│ createdAt       │    │ helpText        │    │ updatedAt       │
│ updatedAt       │    │ questionnaireId │    └─────────────────┘
└─────────────────┘    │ createdAt       │
         │             │ updatedAt       │
         │ 1:N         └─────────────────┘
         ▼
┌─────────────────┐    ┌─────────────────┐
│QUESTIONNAIRE_   │    │QUESTIONNAIRE_   │
│  RESPONSES      │    │RESPONSE_ANSWERS │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄───┤ id (PK)         │
│ questionnaireId │ 1:N│ answerText      │
│ contactId (FK)  │    │ responseId (FK) │
│ createdAt       │    │ questionId (FK) │
│ updatedAt       │    │ optionId (FK)   │
└─────────────────┘    │ createdAt       │
                       │ updatedAt       │
                       └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MARKETING SYSTEM                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐
│MARKETING_       │    │MARKETING_       │
│  CAMPAIGNS      │    │   MESSAGES      │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄───┤ id (PK)         │
│ name            │ 1:N│ status          │
│ description     │    │ sentAt          │
│ type            │    │ deliveredAt     │
│ status          │    │ openedAt        │
│ subject         │    │ clickedAt       │
│ content         │    │ errorMessage    │
│ scheduledAt     │    │ campaignId (FK) │
│ sentAt          │    │ contactId (FK)  │
│ totalRecipients │    │ createdAt       │
│ sentCount       │    │ updatedAt       │
│ deliveredCount  │    └─────────────────┘
│ openedCount     │
│ clickedCount    │
│ createdById (FK)│
│ categoryId (FK) │
│ createdAt       │
│ updatedAt       │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              KEY RELATIONSHIPS                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

USERS (1) ──────────────── (N) CONTACTS
USERS (1) ──────────────── (N) LEADS
USERS (1) ──────────────── (N) ASSESSMENTS
USERS (1) ──────────────── (N) QUESTIONNAIRES
USERS (1) ──────────────── (N) CRM_TRACKERS
USERS (1) ──────────────── (N) MARKETING_CAMPAIGNS

CONTACT_CATEGORIES (1) ─── (N) CONTACTS
CONTACT_CATEGORIES (1) ─── (N) MARKETING_CAMPAIGNS

CONTACTS (1) ───────────── (N) CONTACT_NOTES
CONTACTS (1) ───────────── (N) CONTACT_ACTIVITIES
CONTACTS (1) ───────────── (N) CONTACT_SOCIAL_LINKS
CONTACTS (1) ───────────── (N) LEADS
CONTACTS (1) ───────────── (N) ASSESSMENT_RESPONSES
CONTACTS (1) ───────────── (N) QUESTIONNAIRE_RESPONSES
CONTACTS (1) ───────────── (N) MARKETING_MESSAGES

CRM_TRACKERS (1) ───────── (N) CRM_FIELDS
CRM_TRACKERS (1) ───────── (N) LEADS

CRM_FIELDS (1) ─────────── (N) LEAD_FIELD_VALUES
LEADS (1) ──────────────── (N) LEAD_FIELD_VALUES
LEADS (1) ──────────────── (N) LEAD_NOTES

ASSESSMENTS (1) ────────── (N) ASSESSMENT_QUESTIONS
ASSESSMENTS (1) ────────── (N) ASSESSMENT_RESPONSES

ASSESSMENT_QUESTIONS (1) ─ (N) ASSESSMENT_QUESTION_OPTIONS
ASSESSMENT_QUESTIONS (1) ─ (N) ASSESSMENT_RESPONSE_ANSWERS

ASSESSMENT_RESPONSES (1) ─ (N) ASSESSMENT_RESPONSE_ANSWERS

QUESTIONNAIRES (1) ─────── (N) QUESTIONNAIRE_QUESTIONS
QUESTIONNAIRES (1) ─────── (N) QUESTIONNAIRE_RESPONSES

QUESTIONNAIRE_QUESTIONS (1) ─ (N) QUESTIONNAIRE_QUESTION_OPTIONS
QUESTIONNAIRE_QUESTIONS (1) ─ (N) QUESTIONNAIRE_RESPONSE_ANSWERS

QUESTIONNAIRE_RESPONSES (1) ─ (N) QUESTIONNAIRE_RESPONSE_ANSWERS

MARKETING_CAMPAIGNS (1) ── (N) MARKETING_MESSAGES

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW SUMMARY                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

1. USER MANAGEMENT
   └── Users can have different roles (Admin, Internal Staff, Partner, Lead)

2. CONTACT MANAGEMENT
   └── Users create and manage contacts
   └── Contacts are categorized and can have notes, activities, and social links
   └── Duplicate contacts can be detected and merged

3. LEAD MANAGEMENT
   └── Contacts generate leads
   └── Leads are tracked in CRM trackers with custom fields
   └── Leads can be assigned to users and have status tracking

4. ASSESSMENT SYSTEM
   └── Users create assessments with questions and options
   └── Contacts take assessments and provide answers
   └── Results are scored and personality traits are assigned

5. QUESTIONNAIRE SYSTEM
   └── Users create questionnaires for research
   └── Contacts respond to questionnaires
   └── Responses are stored for analysis

6. MARKETING SYSTEM
   └── Users create campaigns targeting contact categories
   └── Messages are sent to contacts
   └── Delivery and engagement are tracked

This structure supports all the requirements specified in the client document while maintaining data integrity and scalability.