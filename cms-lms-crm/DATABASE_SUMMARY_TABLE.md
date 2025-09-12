# Database Summary - Quick Reference for Client

## 📊 **Database Tables Overview**

| **Module** | **Table Name** | **Purpose** | **Key Fields** | **Relationships** |
|------------|----------------|-------------|----------------|-------------------|
| **User Management** | `users` | User authentication & roles | id, email, role, isActive | Creates contacts, leads, assessments |
| **Contact Management** | `contact_categories` | Contact categorization | id, name, description | 1:N with contacts |
| | `contacts` | Main contact information | id, name, contactNo, emailId, type | 1:N with notes, activities, leads |
| | `contact_notes` | Contact notes & attachments | id, content, attachmentUrl | N:1 with contacts |
| | `contact_activities` | Reminders & activities | id, type, title, scheduledAt | N:1 with contacts |
| | `contact_social_links` | Social media profiles | id, platform, url | N:1 with contacts |
| **Lead Management** | `crm_trackers` | Product-wise tracking | id, name, description | 1:N with fields, leads |
| | `crm_fields` | Custom field definitions | id, name, type, options | N:1 with trackers |
| | `leads` | Lead information | id, title, status, estimatedValue | N:1 with contacts, trackers |
| | `lead_field_values` | Custom field values | id, value | N:1 with leads, fields |
| | `lead_notes` | Lead notes | id, content | N:1 with leads |
| **Assessment System** | `assessments` | Assessment definitions | id, title, trait, scoringLogic | 1:N with questions, responses |
| | `assessment_questions` | Assessment questions | id, question, type, points | N:1 with assessments |
| | `assessment_question_options` | Question options | id, text, isCorrect | N:1 with questions |
| | `assessment_responses` | Assessment results | id, totalScore, personalityType | N:1 with assessments, contacts |
| | `assessment_response_answers` | Individual answers | id, answerText, points | N:1 with responses, questions |
| **Questionnaire System** | `questionnaires` | Research questionnaires | id, title, description | 1:N with questions, responses |
| | `questionnaire_questions` | Questionnaire questions | id, question, type | N:1 with questionnaires |
| | `questionnaire_question_options` | Question options | id, text | N:1 with questions |
| | `questionnaire_responses` | Questionnaire responses | id | N:1 with questionnaires, contacts |
| | `questionnaire_response_answers` | Individual answers | id, answerText | N:1 with responses, questions |
| **Marketing System** | `marketing_campaigns` | Marketing campaigns | id, name, type, status | 1:N with messages |
| | `marketing_messages` | Individual messages | id, status, sentAt | N:1 with campaigns, contacts |

---

## 🔗 **Key Relationships Summary**

### **Primary Relationships (1:N)**

| **Parent Table** | **Child Table** | **Relationship** | **Business Logic** |
|------------------|-----------------|------------------|-------------------|
| `users` | `contacts` | User creates contacts | Each contact has one creator |
| `users` | `leads` | User manages leads | Leads can be assigned to users |
| `users` | `assessments` | User creates assessments | Each assessment has one creator |
| `users` | `questionnaires` | User creates questionnaires | Each questionnaire has one creator |
| `users` | `crm_trackers` | User creates trackers | Each tracker has one creator |
| `users` | `marketing_campaigns` | User creates campaigns | Each campaign has one creator |
| `contact_categories` | `contacts` | Category contains contacts | Each contact belongs to one category |
| `contacts` | `contact_notes` | Contact has notes | Each note belongs to one contact |
| `contacts` | `contact_activities` | Contact has activities | Each activity belongs to one contact |
| `contacts` | `contact_social_links` | Contact has social links | Each social link belongs to one contact |
| `contacts` | `leads` | Contact generates leads | Each lead belongs to one contact |
| `contacts` | `assessment_responses` | Contact takes assessments | Each response belongs to one contact |
| `contacts` | `questionnaire_responses` | Contact responds to questionnaires | Each response belongs to one contact |
| `contacts` | `marketing_messages` | Contact receives messages | Each message is sent to one contact |
| `crm_trackers` | `crm_fields` | Tracker has fields | Each field belongs to one tracker |
| `crm_trackers` | `leads` | Tracker tracks leads | Each lead belongs to one tracker |
| `crm_fields` | `lead_field_values` | Field stores values | Each value belongs to one field |
| `leads` | `lead_field_values` | Lead has field values | Each value belongs to one lead |
| `leads` | `lead_notes` | Lead has notes | Each note belongs to one lead |
| `assessments` | `assessment_questions` | Assessment has questions | Each question belongs to one assessment |
| `assessments` | `assessment_responses` | Assessment receives responses | Each response belongs to one assessment |
| `assessment_questions` | `assessment_question_options` | Question has options | Each option belongs to one question |
| `assessment_responses` | `assessment_response_answers` | Response has answers | Each answer belongs to one response |
| `questionnaires` | `questionnaire_questions` | Questionnaire has questions | Each question belongs to one questionnaire |
| `questionnaires` | `questionnaire_responses` | Questionnaire receives responses | Each response belongs to one questionnaire |
| `questionnaire_questions` | `questionnaire_question_options` | Question has options | Each option belongs to one question |
| `questionnaire_responses` | `questionnaire_response_answers` | Response has answers | Each answer belongs to one response |
| `marketing_campaigns` | `marketing_messages` | Campaign sends messages | Each message belongs to one campaign |

---

## 📈 **Data Flow Architecture**

### **1. Contact Management Flow**
```
User → Creates → Contact → Assigned to → Category
Contact → Can have → Notes, Activities, Social Links
Contact → Can generate → Leads
```

### **2. Lead Management Flow**
```
Contact → Generates → Lead → Assigned to → CRM Tracker
CRM Tracker → Contains → Custom Fields
Lead → Has → Field Values (based on tracker fields)
Lead → Can be assigned to → User
```

### **3. Assessment Flow**
```
User → Creates → Assessment → Contains → Questions → Have → Options
Contact → Takes → Assessment → Provides → Answers → Results in → Response
Response → Contains → Individual Answers → Calculates → Score & Personality Type
```

### **4. Questionnaire Flow**
```
User → Creates → Questionnaire → Contains → Questions → Have → Options
Contact → Responds to → Questionnaire → Provides → Answers → Results in → Response
Response → Contains → Individual Answers → Stored for → Analysis
```

### **5. Marketing Flow**
```
User → Creates → Marketing Campaign → Targets → Contact Category
Campaign → Sends → Messages → To → Contacts in Category
System → Tracks → Delivery, Opens, Clicks → For → Analytics
```

---

## 🎯 **Business Rules Implementation**

### **Contact Management**
- ✅ **Unique Constraints**: Phone number and email must be unique
- ✅ **Categorization**: Every contact must belong to a category
- ✅ **Audit Trail**: All changes tracked with timestamps and user info
- ✅ **Duplicate Detection**: System can find and merge duplicate contacts

### **Lead Management**
- ✅ **Pipeline Tracking**: Leads follow defined status progression
- ✅ **Custom Fields**: Each tracker can have different field sets
- ✅ **Assignment**: Leads can be assigned to specific users
- ✅ **Value Tracking**: Estimated deal values and close dates

### **Assessment System**
- ✅ **Scoring Logic**: Configurable scoring rules per assessment
- ✅ **Public Access**: Assessments can be made public with unique URLs
- ✅ **Personality Profiling**: Results automatically update contact profiles
- ✅ **Multiple Attempts**: Contacts can take multiple assessments

### **Marketing System**
- ✅ **Category Targeting**: Campaigns can target specific contact categories
- ✅ **Multi-Channel**: Support for email, WhatsApp, SMS
- ✅ **Analytics**: Track delivery, opens, clicks, failures
- ✅ **Scheduling**: Campaigns can be scheduled for future delivery

---

## 🔒 **Security & Data Integrity**

### **Primary Keys**
- All tables use UUID primary keys for security
- No sequential IDs that could be guessed

### **Foreign Key Constraints**
- All relationships enforced at database level
- Cascading deletes where appropriate
- Referential integrity maintained

### **Unique Constraints**
- Email addresses must be unique across users
- Phone numbers must be unique across contacts
- Category names must be unique

### **Data Validation**
- Email format validation
- Phone number format validation
- Enum constraints for predefined values
- JSON validation for complex data structures

### **Audit Trail**
- All tables have `createdAt` and `updatedAt` timestamps
- User actions tracked through foreign key relationships
- Complete history of changes maintained

---

## 📊 **Performance Considerations**

### **Indexing Strategy**
- Primary keys automatically indexed
- Foreign keys indexed for join performance
- Unique constraints create indexes
- Search fields (name, email, phone) indexed

### **Query Optimization**
- Proper foreign key relationships for efficient joins
- Pagination support for large datasets
- Selective field loading to reduce data transfer

### **Scalability Features**
- UUID primary keys support distributed systems
- JSON fields for flexible data storage
- Normalized structure reduces data redundancy

---

This database structure provides a solid foundation for the CMS/LMS/CRM system, supporting all business requirements while maintaining data integrity, security, and performance.