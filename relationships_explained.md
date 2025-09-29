# 🔗 Database Relationships & Uses Explained

## 📌 What are Relationships?

Think of relationships like **connections between different lists**. 

**Simple Example:**
- You have a list of STUDENTS
- You have a list of CLASSES
- The relationship tells us "which student is in which class"

---

## 🎯 Types of Relationships

### 1️⃣ **One-to-One (1:1)**
**Meaning:** One thing connects to exactly one other thing

**Example in your system:**
```
USERS ←→ PARTICIPANTS
One login account = One employee profile
```

**Real-world example:** 
- One person = One passport
- One car = One license plate

**Use:** When you need to split information but keep it connected
- USERS table: login info (email, password)
- PARTICIPANTS table: employee details (department, designation)

---

### 2️⃣ **One-to-Many (1:N)**
**Meaning:** One thing connects to many things

**Example in your system:**
```
COMPANIES → PARTICIPANTS
One company has many employees
```

**Real-world example:**
- One mother → Many children
- One teacher → Many students
- One company → Many employees

**Use:** When one parent has multiple children
- One COMPANY has many EMPLOYEES
- One BATCH has many PARTICIPANTS
- One ASSESSMENT_TOOL used for many ASSESSMENTS

---

### 3️⃣ **Many-to-Many (N:N)**
**Meaning:** Many things connect to many other things

**Example in your system:**
```
COACHES ←→ COMPANIES (through COACH_COMPANIES table)
Many coaches can work with many companies
```

**Real-world example:**
- Students ←→ Subjects (students take many subjects, subjects have many students)
- Actors ←→ Movies (actors in many movies, movies have many actors)

**Use:** When both sides can have multiple connections
- Coaches teach at multiple companies
- Companies hire multiple coaches

---

## 📊 Key Relationships in Your System

### 🔵 **USER MANAGEMENT RELATIONSHIPS**

```
USERS (Main Login Table)
    ↓
    ├── PARTICIPANTS (1:1) - If user is employee
    ├── COACHES (1:1) - If user is trainer  
    └── ADMINS (1:1) - If user is admin
```

**Why this design?**
- Everyone logs in through ONE system (USERS)
- But different roles need different information
- Keeps login separate from role-specific data

**How it's used:**
```sql
When John logs in:
1. Check USERS table (email/password)
2. Find role_type = "participant"
3. Get details from PARTICIPANTS table
4. Show employee dashboard
```

---

### 🟢 **TRAINING BATCH RELATIONSHIPS**

```
COMPANIES
    ↓ (1:N)
BATCHES
    ↓ (1:N)
BATCH_PARTICIPANTS
    ↑ (N:1)
PARTICIPANTS
```

**Real Use Case:**
```
TechCorp (COMPANY)
    → Creates "January-2024-Batch" (BATCHES)
    → Adds 25 employees (BATCH_PARTICIPANTS)
    → Each employee is a PARTICIPANT
```

**Why separate BATCH_PARTICIPANTS table?**
- Tracks WHO is in WHICH batch
- Stores enrollment date
- Tracks individual progress
- Allows moving employees between batches

---

### 🟠 **ASSESSMENT RELATIONSHIPS**

```
ASSESSMENT_TOOLS (The test template)
    ↓ (1:N)
ASSESSMENTS (When someone takes the test)
    ↓ (1:1)
ASSESSMENT_RESULTS (The scores)
```

**How it works:**
```
1. ASSESSMENT_TOOLS: "Leadership Test" template
2. John takes it → Creates ASSESSMENT record
3. Scores stored → ASSESSMENT_RESULTS
   - calculated_result: 75% (computer)
   - final_result: 78% (coach adjusted)
```

**Why two results?**
- Computer gives automatic score
- Human coach can adjust if needed
- Both are saved for transparency

---

### 🟣 **RESOURCE ACCESS RELATIONSHIPS**

```
RESOURCES (PDFs, Documents)
    ↓
BATCH_RESOURCES (Who can access what)
    ↑
BATCHES (Which group)
```

**Real Example:**
```
"Leadership-Guide.pdf" (RESOURCES)
    → Linked to "Batch-A" (BATCH_RESOURCES)
    → Coach unlocks on Day 3
    → All Batch-A students can now view
    → But cannot download (view only!)
```

---

## 💡 Practical Examples of Relationships

### Example 1: "Show all employees of TechCorp"
```
COMPANIES table
    ↓ (company_id)
PARTICIPANTS table (WHERE company_id = TechCorp's ID)
```

### Example 2: "Find John's test results"
```
USERS (John's login)
    ↓ (user_id)
PARTICIPANTS (John's employee profile)
    ↓ (participant_id)
ASSESSMENTS (All tests John took)
    ↓ (assessment_id)
ASSESSMENT_RESULTS (John's scores)
```

### Example 3: "Which coach teaches Batch-A?"
```
BATCHES (Batch-A)
    ↓ (coach_id)
COACHES (Coach details)
    ↓ (user_id)
USERS (Coach's name and email)
```

---

## 🔑 Foreign Keys Explained

**What is a Foreign Key (FK)?**
- It's like a "pointer" to another table
- Links records together

**Example:**
```
PARTICIPANTS table has:
- participant_id (PK) = Own ID
- user_id (FK) = Points to USERS table
- company_id (FK) = Points to COMPANIES table
- batch_id (FK) = Points to BATCHES table
```

**Visual Example:**
```
John's record:
participant_id: 101 (his unique ID)
user_id: 5 → Points to USERS table record #5
company_id: 3 → Points to TechCorp in COMPANIES
batch_id: 7 → Points to "Batch-A" in BATCHES
```

---

## 🎯 Why These Relationships Matter

### 1. **Data Integrity**
- Can't have employee without company
- Can't have assessment without participant
- Can't have result without assessment

### 2. **No Duplication**
- Company info stored once, used many times
- User login stored once, linked to role

### 3. **Easy Updates**
- Change company name in one place
- Updates everywhere automatically

### 4. **Flexible Queries**
- "Show all employees in Batch-A"
- "Find all assessments taken by TechCorp employees"
- "List coaches teaching in January"

---

## 📊 Common Relationship Patterns

### **Parent-Child Pattern**
```
COMPANY (Parent)
    ↓
EMPLOYEES (Children)
```
- Delete company = Delete all employees
- One company, many employees

### **Junction Table Pattern**
```
COACHES ←→ COACH_COMPANIES ←→ COMPANIES
```
- Handles many-to-many relationships
- Stores additional info (assignment date)

### **Status Tracking Pattern**
```
ASSESSMENTS → ASSESSMENT_RESULTS
```
- Main record (assessment taken)
- Status record (scores, frozen status)

---

## 🚀 Real Use Cases

### **Use Case 1: Employee Dashboard**
```
Relationships used:
USERS → PARTICIPANTS → ASSESSMENTS → RESULTS
                    ↓
                COMPANIES
                    ↓
                BATCHES
```

Shows:
- Personal info (USERS + PARTICIPANTS)
- Company name (COMPANIES)
- Current batch (BATCHES)
- Test scores (ASSESSMENTS + RESULTS)

### **Use Case 2: HR Report**
```
Relationships used:
COMPANIES → PARTICIPANTS → ASSESSMENTS
         ↓
      BATCHES → BATCH_PARTICIPANTS
```

Shows:
- Total employees
- Employees per batch
- Assessment completion rates
- Overall progress

### **Use Case 3: Coach View**
```
Relationships used:
COACHES → BATCHES → BATCH_PARTICIPANTS
       ↓         ↓
COACH_COMPANIES  PARTICIPANTS → ASSESSMENTS
```

Shows:
- Assigned batches
- Student list
- Assessment results to review
- Resources to unlock

---

## ✅ Summary

**Relationships help us:**
1. **Connect** related information
2. **Avoid** data duplication  
3. **Maintain** data consistency
4. **Query** complex information easily
5. **Scale** the system efficiently

**Remember:**
- **1:1** = One-to-one (unique pairs)
- **1:N** = One-to-many (parent with children)
- **N:N** = Many-to-many (multiple connections)
- **FK** = Foreign Key (pointer to another table)
- **PK** = Primary Key (unique identifier)

The relationships make your database smart - it knows how everything connects together!