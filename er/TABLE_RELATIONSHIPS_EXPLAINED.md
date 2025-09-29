# 🔗 Database Table Relationships - How & Why They're Linked

## 🎯 **Understanding Relationship Types**

- **One-to-Many (1:N)** - `||--o{` - One parent can have many children
- **Many-to-Many (M:N)** - Through junction tables
- **One-to-One (1:1)** - Rare, usually for data separation

---

## 🔐 **AUTHENTICATION & RBAC RELATIONSHIPS**

### **`roles` ↔ `permissions` (Many-to-Many)**
```
roles ||--o{ role_permissions : "has"
permissions ||--o{ role_permissions : "granted_to"
```

**How:** Through `role_permissions` junction table
**Why:** 
- One role needs multiple permissions (Admin has create, read, update, delete)
- One permission can be assigned to multiple roles (read_reports given to Admin, HR, Coach)
- Flexible security model - can create new roles by combining permissions

**Business Example:**
```
Coach Role = {
  create_batch,
  manage_participants, 
  view_assessment_results,
  upload_resources
}

HR Role = {
  create_user,
  view_reports,
  manage_employees
}
```

### **`roles` → `users` (One-to-Many)**
```
roles ||--o{ users : "assigned_to"
```

**How:** `users.role_id` references `roles.role_id`
**Why:**
- Each user has exactly ONE system role
- One role can be assigned to many users
- Determines what permissions user inherits

**Business Logic:** When user logs in, system checks their role to determine what they can access.

---

## 🏢 **ORGANIZATION RELATIONSHIPS**

### **`companies` → `users` (One-to-Many)**
```
companies ||--o{ users : "employs"
```

**How:** `users.company_id` references `companies.company_id`
**Why:**
- **Multi-tenancy:** Each user belongs to exactly one company
- **Data isolation:** Users can only see data from their company
- **Billing:** Company controls how many users they can have

**Business Example:**
```
TechCorp Inc. (company_id: 1)
├── John Smith (Admin)
├── Sarah Jones (HR Manager)  
└── Mike Wilson (Employee)

Healthcare Co. (company_id: 2)
├── Dr. Lisa Brown (Admin)
└── Nurse Tom Davis (Employee)
```

### **`companies` ↔ `users` (Many-to-Many for Coaches)**
```
companies ||--o{ company_coaches : "has_coaches"
users ||--o{ company_coaches : "coaches_for"
```

**How:** Through `company_coaches` junction table
**Why:**
- **External coaches** can work with multiple companies
- **One company** can have multiple coaches
- **Flexible assignment:** Coach can be assigned/unassigned without deleting user

**Business Example:**
```
Coach "Alex Turner" works for:
├── TechCorp (Leadership training)
├── Healthcare Co. (Communication skills)
└── Finance Ltd. (Team building)
```

### **`users` → `users` (Self-referencing)**
```
users ||--o{ users : "created_by"
```

**How:** `users.created_by` references another `users.user_id`
**Why:**
- **Audit trail:** Who created each user account
- **Accountability:** Track user creation responsibility
- **Hierarchy:** Understand organizational relationships

---

## 📚 **LEARNING & BATCH RELATIONSHIPS**

### **`companies` → `batches` (One-to-Many)**
```
companies ||--o{ batches : "creates"
```

**How:** `batches.company_id` references `companies.company_id`
**Why:**
- **Ownership:** Each batch belongs to one company
- **Isolation:** Companies can't see each other's batches
- **Billing:** Track usage per company

### **`users` → `batches` (One-to-Many - Coach Assignment)**
```
users ||--o{ batches : "coaches"
```

**How:** `batches.coach_id` references `users.user_id`
**Why:**
- **Responsibility:** Each batch has one primary coach
- **Accountability:** Know who's responsible for batch success
- **Workload:** Track how many batches each coach handles

### **`batches` ↔ `users` (Many-to-Many - Participants)**
```
batches ||--o{ batch_participants : "contains"
users ||--o{ batch_participants : "enrolled_in"
```

**How:** Through `batch_participants` junction table
**Why:**
- **Flexible enrollment:** Users can be in multiple batches
- **Batch capacity:** Track current vs maximum participants
- **Progress tracking:** Individual status per batch (ACTIVE, COMPLETED, DROPPED)

**Business Example:**
```
"Leadership Training Q1" batch contains:
├── John Smith (ACTIVE)
├── Sarah Jones (COMPLETED)
└── Mike Wilson (DROPPED)

John Smith is enrolled in:
├── Leadership Training Q1 (ACTIVE)
└── Technical Skills Q2 (ACTIVE)
```

---

## 🎯 **ASSESSMENT SYSTEM RELATIONSHIPS**

### **`assessment_tools` → `assessment_packages` (One-to-Many)**
```
assessment_tools ||--o{ assessment_packages : "packaged_as"
```

**How:** `assessment_packages.tool_id` references `assessment_tools.tool_id`
**Why:**
- **Product catalog:** Each package contains one type of assessment
- **Billing:** Companies buy specific assessment types
- **Usage tracking:** Monitor consumption per tool type

### **`companies` → `assessment_packages` (One-to-Many)**
```
companies ||--o{ assessment_packages : "purchases"
```

**How:** `assessment_packages.company_id` references `companies.company_id`
**Why:**
- **Licensing:** Each company buys their own assessment credits
- **Usage control:** Prevent companies from using each other's assessments
- **Billing:** Track purchases per company

### **`assessment_tools` → `assessments` (One-to-Many)**
```
assessment_tools ||--o{ assessments : "evaluated_with"
```

**How:** `assessments.tool_id` references `assessment_tools.tool_id`
**Why:**
- **Tool tracking:** Know which assessment was used
- **Results interpretation:** Different tools have different scoring
- **Reporting:** Group results by assessment type

### **`users` → `assessments` (One-to-Many)**
```
users ||--o{ assessments : "takes"
```

**How:** `assessments.user_id` references `users.user_id` (nullable)
**Why:**
- **Employee assessments:** Track which employee took which assessment
- **Progress tracking:** Monitor individual learning journey
- **Results ownership:** Link results to specific person

### **`interview_candidates` → `assessments` (One-to-Many)**
```
interview_candidates ||--o{ assessments : "takes"
```

**How:** `assessments.candidate_id` references `interview_candidates.candidate_id` (nullable)
**Why:**
- **Candidate evaluation:** Track job applicant assessments
- **Hiring process:** Link assessment results to hiring decisions
- **Separate workflow:** Candidates aren't employees yet

### **`batches` → `assessments` (One-to-Many)**
```
batches ||--o{ assessments : "includes"
```

**How:** `assessments.batch_id` references `batches.batch_id`
**Why:**
- **Context:** Know which training program assessment was part of
- **Batch reporting:** Analyze batch performance
- **Learning path:** Assessments are part of structured learning

**Critical Business Logic:**
```sql
-- An assessment record has EITHER user_id OR candidate_id, not both
assessments {
  user_id integer [nullable]      -- For employees
  candidate_id integer [nullable] -- For job candidates
  -- Business rule: Exactly one must be filled
}
```

---

## 📝 **ASSIGNMENT RELATIONSHIPS**

### **`assessment_tools` → `assignments` (One-to-Many)**
```
assessment_tools ||--o{ assignments : "includes"
```

**How:** `assignments.tool_id` references `assessment_tools.tool_id`
**Why:**
- **Structured learning:** Assignments are components of larger assessments
- **Tool packaging:** Each assessment tool can have multiple assignments
- **Reusability:** Same assignment can be used across different batches

### **`assignments` → `assignment_submissions` (One-to-Many)**
```
assignments ||--o{ assignment_submissions : "receives"
```

**How:** `assignment_submissions.assignment_id` references `assignments.assignment_id`
**Why:**
- **Submission tracking:** Multiple people submit to same assignment
- **Grading workflow:** Link submissions to original assignment requirements
- **Progress monitoring:** Track completion rates

### **`users` → `assignment_submissions` (One-to-Many)**
```
users ||--o{ assignment_submissions : "submits"
users ||--o{ assignment_submissions : "grades"
```

**How:** 
- `assignment_submissions.user_id` (who submitted)
- `assignment_submissions.graded_by` (who graded)

**Why:**
- **Ownership:** Know who submitted what
- **Accountability:** Track who graded submissions
- **Audit trail:** Complete workflow from submission to grading

---

## 📁 **CONTENT & RESOURCE RELATIONSHIPS**

### **`assessment_tools` → `resources` (One-to-Many)**
```
assessment_tools ||--o{ resources : "provides"
```

**How:** `resources.tool_id` references `assessment_tools.tool_id`
**Why:**
- **Content organization:** Group resources by assessment topic
- **Access control:** Resources linked to specific learning tools
- **Curriculum structure:** Materials support specific assessments

### **`batches` ↔ `resources` (Many-to-Many)**
```
batches ||--o{ batch_resource_access : "unlocks"
resources ||--o{ batch_resource_access : "accessed_via"
```

**How:** Through `batch_resource_access` junction table
**Why:**
- **Progressive access:** Resources unlocked as batch progresses
- **Flexible control:** Same resource can be used by multiple batches
- **Access management:** Control when learners get access to materials

**Business Example:**
```
"Leadership Handbook.pdf" is unlocked for:
├── Leadership Q1 Batch (unlocked Week 2)
├── Management Training (unlocked Week 1)
└── Executive Program (unlocked immediately)
```

---

## 👥 **INTERVIEW CANDIDATE RELATIONSHIPS**

### **`companies` → `interview_candidates` (One-to-Many)**
```
companies ||--o{ interview_candidates : "interviews"
```

**How:** `interview_candidates.company_id` references `companies.company_id`
**Why:**
- **Hiring ownership:** Each company manages their own candidates
- **Data isolation:** Companies can't see each other's candidates
- **Process tracking:** Link candidates to hiring company

### **`assessment_packages` → `interview_candidates` (One-to-Many)**
```
assessment_packages ||--o{ interview_candidates : "evaluates"
```

**How:** `interview_candidates.package_id` references `assessment_packages.package_id`
**Why:**
- **Resource allocation:** Use company's purchased assessments for candidates
- **Cost control:** Track assessment usage for hiring
- **Consistent evaluation:** Same tools used for employees and candidates

### **`interview_candidates` → `users` (One-to-One - Conversion)**
```
users ||--o{ interview_candidates : "converts_to"
```

**How:** `interview_candidates.converted_to_user_id` references `users.user_id`
**Why:**
- **Hiring workflow:** Track which candidates became employees
- **Data continuity:** Link candidate assessment history to employee record
- **ROI tracking:** Measure assessment effectiveness in hiring

---

## ❓ **QUIZ SYSTEM RELATIONSHIPS**

### **`users` → `quizzes` (One-to-Many)**
```
users ||--o{ quizzes : "creates"
```

**How:** `quizzes.created_by` references `users.user_id`
**Why:**
- **Content ownership:** Track who created each quiz
- **Quality control:** Know who to contact about quiz issues
- **Intellectual property:** Attribute quiz creation

### **`quizzes` → `quiz_sessions` (One-to-Many)**
```
quizzes ||--o{ quiz_sessions : "runs_as"
```

**How:** `quiz_sessions.quiz_id` references `quizzes.quiz_id`
**Why:**
- **Reusability:** Same quiz can be run multiple times
- **Session tracking:** Each session has unique access code and timing
- **Performance comparison:** Compare results across different sessions

### **`quiz_sessions` → `quiz_responses` (One-to-Many)**
```
quiz_sessions ||--o{ quiz_responses : "collects"
```

**How:** `quiz_responses.session_id` references `quiz_sessions.session_id`
**Why:**
- **Session grouping:** All responses belong to specific session
- **Real-time results:** Show live leaderboards during session
- **Session analysis:** Compare participant performance within session

**Business Flow:**
```
1. Coach creates "Leadership Quiz"
2. Coach starts "Morning Session" of that quiz
3. Participants join using access code
4. All responses recorded under that session
5. Results ranked and displayed
```

---

## ⚙️ **SYSTEM SETTINGS RELATIONSHIPS**

### **`users` → `system_settings` (One-to-Many)**
```
users ||--o{ system_settings : "configures"
```

**How:** `system_settings.updated_by` references `users.user_id`
**Why:**
- **Change tracking:** Know who modified system configuration
- **Accountability:** Trace configuration changes to specific admin
- **Audit compliance:** Required for enterprise systems

---

## 🔄 **COMPLETE BUSINESS WORKFLOW**

### **Typical Learning Journey:**
```
1. Company → buys assessment_packages
2. Coach → creates batches
3. HR → enrolls users in batch_participants
4. System → unlocks resources via batch_resource_access
5. Users → take assessments (linked to batch and tool)
6. Coach → creates assignments (part of assessment_tools)
7. Users → submit assignment_submissions
8. Coach → grades submissions
9. Coach → runs quiz_sessions
10. Users → submit quiz_responses
```

### **Interview Process:**
```
1. Company → has assessment_packages
2. HR → creates interview_candidates
3. Candidate → takes assessments (candidate_id filled)
4. HR → reviews results
5. If hired → candidate converted_to_user_id
```

## 🎯 **Why These Relationships Matter**

1. **Data Integrity:** Foreign keys prevent orphaned records
2. **Business Logic:** Relationships enforce business rules
3. **Scalability:** Normalized design reduces data duplication
4. **Flexibility:** Many-to-many relationships allow complex scenarios
5. **Audit Trail:** Self-referencing relationships track changes
6. **Multi-tenancy:** Company relationships ensure data isolation
7. **Workflow Support:** Relationships enable complete business processes

Every relationship serves a specific business purpose and ensures the system can handle real-world learning management scenarios! 🚀