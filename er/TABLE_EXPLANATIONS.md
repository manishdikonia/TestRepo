# 📚 Complete Table Explanations - LMS Database

## 🔐 **AUTHENTICATION & RBAC SECTION**

### 1. **`roles`** - System Roles Definition
**Purpose:** Defines all available roles in the system (global, not company-specific)

```sql
roles {
  role_id integer [PK]           -- Unique role identifier
  role_name varchar(50)          -- "Admin", "Coach", "HR Manager", "Employee"
  description text               -- What this role can do
  is_system_role boolean         -- System roles cannot be deleted
  created_at timestamp
  updated_at timestamp
}
```

**Examples:**
- Admin: Full system access
- Coach: Can manage batches and assessments
- HR Manager: Can manage employees and view reports
- Employee: Can take assessments and view resources

---

### 2. **`permissions`** - System Permissions
**Purpose:** Defines what actions can be performed on what resources

```sql
permissions {
  permission_id integer [PK]     -- Unique permission ID
  permission_name varchar(100)   -- "create_batch", "view_reports", "edit_user"
  description text               -- What this permission allows
  resource varchar(50)           -- "batch", "user", "assessment", "report"
  action varchar(20)             -- "create", "read", "update", "delete"
  created_at timestamp
}
```

**Examples:**
- create_batch: Can create new training batches
- view_assessment_results: Can see assessment outcomes
- manage_users: Can add/edit/remove users

---

### 3. **`role_permissions`** - Links Roles to Permissions
**Purpose:** Junction table that assigns permissions to roles

```sql
role_permissions {
  role_id integer [FK → roles]        -- Which role
  permission_id integer [FK → permissions]  -- Gets which permission
  assigned_at timestamp                -- When permission was granted
}
```

**Example:** Admin role gets ALL permissions, Coach role gets only batch and assessment permissions

---

## 🏢 **ORGANIZATION MANAGEMENT SECTION**

### 4. **`companies`** - Client Organizations
**Purpose:** Multi-tenant system - each company is a separate client

```sql
companies {
  company_id integer [PK]        -- Unique company identifier
  company_name varchar(200)      -- "TechCorp Inc", "Healthcare Solutions"
  contact_person varchar(100)    -- Primary contact name
  contact_email varchar(100)     -- Business email
  contact_phone varchar(20)      -- Business phone
  address text                   -- Company address
  contract_start_date date       -- When service started
  contract_end_date date         -- When contract expires
  max_batch_size integer         -- Maximum learners per batch
  max_employees integer          -- Maximum employees allowed
  subscription_status enum       -- ACTIVE, INACTIVE, SUSPENDED
  created_at timestamp
  updated_at timestamp
}
```

**Business Logic:** Controls licensing limits and access for each client organization

---

### 5. **`users`** - All System Users
**Purpose:** Everyone who uses the system (employees, coaches, admins)

```sql
users {
  user_id integer [PK]           -- Unique user identifier
  company_id integer [FK → companies]  -- Which company they belong to
  role_id integer [FK → roles]   -- Their system role
  name varchar(100)              -- Full name
  email varchar(100) [UNIQUE]    -- Login email
  password_hash varchar(255)     -- Encrypted password
  phone varchar(20)              -- Contact number
  designation varchar(100)       -- Job title
  company_role enum              -- ADMIN, HR, EMPLOYEE (company-specific role)
  is_active boolean              -- Can they log in?
  last_login timestamp           -- When they last accessed system
  created_by integer [FK → users]  -- Who created this user
  created_at timestamp
  updated_at timestamp
}
```

**Key Relationships:**
- Belongs to one company
- Has one system role (with permissions)
- Can be created by another user (audit trail)

---

### 6. **`company_coaches`** - External Coaches Assignment
**Purpose:** Links external coaches to companies (many-to-many relationship)

```sql
company_coaches {
  company_id integer [FK → companies]  -- Which company
  coach_id integer [FK → users]        -- Which coach (user with coach role)
  assigned_at timestamp                -- When assignment started
  assigned_by integer [FK → users]     -- Who made the assignment
  is_active boolean                    -- Is assignment currently active?
}
```

**Business Logic:** A coach can work with multiple companies, and a company can have multiple coaches

---

## 📚 **LEARNING & ASSESSMENTS SECTION**

### 7. **`batches`** - Training Groups
**Purpose:** Groups of learners going through training together

```sql
batches {
  batch_id integer [PK]          -- Unique batch identifier
  company_id integer [FK → companies]  -- Which company owns this batch
  batch_name varchar(100)        -- "Leadership Training Q1 2024"
  coach_id integer [FK → users]  -- Who is coaching this batch
  max_participants integer       -- Maximum learners allowed
  current_participants integer   -- How many are currently enrolled
  start_date date                -- When training begins
  end_date date                  -- When training ends
  status enum                    -- ACTIVE, COMPLETED, SUSPENDED
  created_by integer [FK → users]  -- Who created the batch
  created_at timestamp
  updated_at timestamp
}
```

**Business Logic:** Core learning unit - everything revolves around batches

---

### 8. **`batch_participants`** - Who's in Each Batch
**Purpose:** Links users to batches (many-to-many relationship)

```sql
batch_participants {
  batch_id integer [FK → batches]      -- Which batch
  user_id integer [FK → users]         -- Which participant
  enrolled_at timestamp                -- When they joined
  enrolled_by integer [FK → users]     -- Who enrolled them
  status enum                          -- ACTIVE, COMPLETED, DROPPED
}
```

**Business Logic:** Tracks who is taking what training and their progress status

---

### 9. **`assessment_tools`** - Types of Assessments
**Purpose:** Different assessment instruments available in the system

```sql
assessment_tools {
  tool_id integer [PK]           -- Unique tool identifier
  tool_name varchar(100)         -- "Personality Assessment", "Skills Test"
  description text               -- What this tool measures
  algorithm_version varchar(20)  -- Version for tracking changes
  question_count integer         -- How many questions
  time_limit_minutes integer     -- How long to complete
  is_active boolean              -- Currently available?
  created_at timestamp
  updated_at timestamp
}
```

**Examples:**
- Personality Assessment (45 questions, 30 minutes)
- Technical Skills Test (25 questions, 60 minutes)
- Leadership Evaluation (35 questions, 40 minutes)

---

### 10. **`assessment_packages`** - Purchased Assessment Credits
**Purpose:** Companies buy packages of assessments to use

```sql
assessment_packages {
  package_id integer [PK]        -- Unique package identifier
  company_id integer [FK → companies]  -- Which company bought it
  package_name varchar(100)      -- "Annual Leadership Package"
  tool_id integer [FK → assessment_tools]  -- Which assessment tool
  total_assessments integer      -- How many assessments purchased
  used_assessments integer       -- How many have been used
  remaining_assessments integer  -- How many left (calculated field)
  purchase_date date             -- When purchased
  expiry_date date               -- When package expires
  package_type enum              -- EMPLOYEE or INTERVIEW_CANDIDATE
  purchased_by integer [FK → users]  -- Who made the purchase
  created_at timestamp
}
```

**Business Logic:** Controls assessment usage and billing

---

### 11. **`assessments`** - Individual Assessment Records
**Purpose:** Records of actual assessments taken by users or candidates

```sql
assessments {
  assessment_id integer [PK]     -- Unique assessment record
  user_id integer [FK → users]   -- Employee who took it (nullable)
  candidate_id integer [FK → interview_candidates]  -- OR candidate who took it (nullable)
  tool_id integer [FK → assessment_tools]  -- Which assessment tool used
  batch_id integer [FK → batches]  -- Which batch context (if applicable)
  assessment_result json         -- Raw assessment data/answers
  final_result json              -- Processed results/scores
  freeze_period_end timestamp    -- When results become final
  is_result_locked boolean       -- Can results still be edited?
  completed_at timestamp         -- When assessment was finished
  last_edited_by integer [FK → users]  -- Who last modified results
  last_edited_at timestamp       -- When last modified
  created_at timestamp
  updated_at timestamp
}
```

**Key Business Logic:**
- **EITHER** user_id OR candidate_id is filled (mutually exclusive)
- Results can be edited during freeze period
- After freeze period, results are locked

---

### 12. **`assignments`** - Learning Assignments
**Purpose:** Tasks/projects that are part of assessment tools

```sql
assignments {
  assignment_id integer [PK]     -- Unique assignment identifier
  tool_id integer [FK → assessment_tools]  -- Part of which assessment
  assignment_name varchar(200)   -- "Leadership Case Study"
  description text               -- What the assignment is about
  instructions text              -- How to complete it
  submission_format enum         -- PDF, DOC, TEXT
  max_file_size_mb integer       -- Upload limit
  due_date_offset_days integer   -- Days after batch start
  is_mandatory boolean           -- Must be completed?
  created_at timestamp
  updated_at timestamp
}
```

**Business Logic:** Assignments are components of larger assessment tools

---

### 13. **`assignment_submissions`** - Assignment Responses
**Purpose:** What participants submit for assignments

```sql
assignment_submissions {
  submission_id integer [PK]     -- Unique submission identifier
  assignment_id integer [FK → assignments]  -- Which assignment
  user_id integer [FK → users]   -- Who submitted it
  batch_id integer [FK → batches]  -- In which batch context
  submission_file_path varchar(500)  -- File location if uploaded
  submission_text text           -- Text response if applicable
  submitted_at timestamp         -- When submitted
  graded_by integer [FK → users]  -- Who graded it
  grade varchar(10)              -- Grade received
  feedback text                  -- Grader's comments
  graded_at timestamp            -- When graded
}
```

**Business Logic:** Complete assignment workflow from submission to grading

---

## 📁 **CONTENT & ACCESS SECTION**

### 14. **`resources`** - Learning Materials
**Purpose:** Documents, videos, presentations used in training

```sql
resources {
  resource_id integer [PK]       -- Unique resource identifier
  tool_id integer [FK → assessment_tools]  -- Associated with which tool
  resource_name varchar(200)     -- "Leadership Handbook.pdf"
  description text               -- What this resource contains
  file_path varchar(500)         -- Where file is stored
  file_type enum                 -- PDF, PPT, DOC, VIDEO
  file_size_mb decimal(10,2)     -- File size for storage management
  access_level enum              -- PARTICIPANT, MANAGEMENT, COACH
  is_downloadable boolean        -- Can users download it?
  watermark_required boolean     -- Should it be watermarked?
  created_by integer [FK → users]  -- Who uploaded it
  created_at timestamp
  updated_at timestamp
}
```

**Business Logic:** Controls who can access what learning materials

---

### 15. **`batch_resource_access`** - Resource Permissions per Batch
**Purpose:** Controls which resources are available to which batches

```sql
batch_resource_access {
  batch_id integer [FK → batches]    -- Which batch
  resource_id integer [FK → resources]  -- Gets access to which resource
  unlocked_by integer [FK → users]   -- Who granted access
  unlocked_at timestamp              -- When access was granted
  access_expires_at timestamp        -- When access expires (optional)
}
```

**Business Logic:** Resources are unlocked for batches as they progress through training

---

## 👥 **INTERVIEW CANDIDATES SECTION**

### 16. **`interview_candidates`** - Job Applicants
**Purpose:** People being evaluated for potential employment

```sql
interview_candidates {
  candidate_id integer [PK]      -- Unique candidate identifier
  company_id integer [FK → companies]  -- Which company is interviewing them
  package_id integer [FK → assessment_packages]  -- Which assessment package to use
  name varchar(100)              -- Candidate's name
  email varchar(100)             -- Contact email
  phone varchar(20)              -- Contact phone
  position_applied varchar(100)  -- What job they want
  assessment_link varchar(500)   -- Unique link to take assessment
  status enum                    -- PENDING, COMPLETED, HIRED, REJECTED
  converted_to_user_id integer [FK → users]  -- If hired, their user account
  assigned_by integer [FK → users]  -- Who created this candidate record
  created_at timestamp
  updated_at timestamp
}
```

**Business Logic:** Separate from employees - these are potential hires being evaluated

---

## ❓ **QUIZZES SECTION**

### 17. **`quizzes`** - Interactive Quizzes
**Purpose:** Quick knowledge checks and interactive learning

```sql
quizzes {
  quiz_id integer [PK]           -- Unique quiz identifier
  quiz_name varchar(200)         -- "Leadership Fundamentals Quiz"
  description text               -- What the quiz covers
  question_count integer         -- How many questions
  time_limit_minutes integer     -- Time to complete
  is_active boolean              -- Currently available?
  created_by integer [FK → users]  -- Who created it
  created_at timestamp
  updated_at timestamp
}
```

**Business Logic:** Different from formal assessments - more for learning reinforcement

---

### 18. **`quiz_sessions`** - Quiz Events
**Purpose:** Specific instances when quizzes are run (like live sessions)

```sql
quiz_sessions {
  session_id integer [PK]        -- Unique session identifier
  quiz_id integer [FK → quizzes] -- Which quiz
  session_name varchar(200)      -- "Morning Leadership Quiz Session"
  access_code varchar(20)        -- Code participants enter to join
  qr_code_path varchar(500)      -- QR code image for easy access
  started_by integer [FK → users]  -- Who started the session
  started_at timestamp           -- When session began
  ended_at timestamp             -- When session ended
  status enum                    -- ACTIVE, COMPLETED
}
```

**Business Logic:** Enables live, group quiz sessions with access codes

---

### 19. **`quiz_responses`** - Quiz Answers
**Purpose:** Individual participant responses to quiz sessions

```sql
quiz_responses {
  response_id integer [PK]       -- Unique response identifier
  session_id integer [FK → quiz_sessions]  -- Which session
  participant_name varchar(100)  -- Who responded (may not be a user)
  participant_email varchar(100) -- Contact info
  responses json                 -- All their answers
  score integer                  -- Points earned
  completed_at timestamp         -- When they finished
  rank integer                   -- Their ranking in the session
}
```

**Business Logic:** Allows anonymous participation - participants don't need user accounts

---

## ⚙️ **SYSTEM SETTINGS SECTION**

### 20. **`system_settings`** - Configuration
**Purpose:** System-wide configuration parameters

```sql
system_settings {
  setting_id integer [PK]        -- Unique setting identifier
  setting_key varchar(100) [UNIQUE]  -- "max_file_upload_size", "session_timeout"
  setting_value text             -- The actual value
  description text               -- What this setting controls
  data_type enum                 -- INTEGER, STRING, BOOLEAN, JSON
  updated_by integer [FK → users]  -- Who last changed it
  updated_at timestamp           -- When last changed
}
```

**Examples:**
- max_file_upload_size: "50" (MB)
- session_timeout_minutes: "120"
- enable_email_notifications: "true"

---

## 🔄 **HOW IT ALL WORKS TOGETHER**

### **Typical User Journey:**

1. **Company signs up** → Record in `companies`
2. **Users are created** → Records in `users` with `roles`
3. **Coach creates batch** → Record in `batches`
4. **Employees enrolled** → Records in `batch_participants`
5. **Company buys assessments** → Record in `assessment_packages`
6. **Participants take assessments** → Records in `assessments`
7. **Resources unlocked** → Records in `batch_resource_access`
8. **Assignments given** → Records in `assignments` and `assignment_submissions`
9. **Quizzes conducted** → Records in `quiz_sessions` and `quiz_responses`

### **Interview Process:**
1. **Candidate created** → Record in `interview_candidates`
2. **Assessment assigned** → Uses `assessment_packages`
3. **Candidate takes assessment** → Record in `assessments` (with candidate_id)
4. **If hired** → Converted to `users` record

This system supports a complete learning and assessment ecosystem! 🎯