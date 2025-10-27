# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "internal_staff"
  }
}
```

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "company": "Example Corp",
  "designation": "Manager"
}
```

## Contact Management

### List Contacts
```http
GET /contacts?page=1&limit=10&search=john&category=entrepreneurs
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in name, email, company
- `category` (optional): Filter by category name
- `industry` (optional): Filter by industry
- `contactType` (optional): entrepreneur | employee

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "contactNumber": "+1234567890",
      "company": "Example Corp",
      "industry": "Technology",
      "contactType": "entrepreneur",
      "categories": [
        {
          "id": "uuid",
          "name": "High Priority",
          "color": "#ff0000"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Create Contact
```http
POST /contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "contactNumber": "+1234567890",
  "location": "New York, NY",
  "contactType": "entrepreneur",
  "company": "Example Corp",
  "designation": "CEO",
  "industry": "Technology",
  "website": "https://example.com",
  "categoryIds": ["uuid1", "uuid2"]
}
```

### Get Contact Details
```http
GET /contacts/{id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "contactNumber": "+1234567890",
  "location": "New York, NY",
  "contactType": "entrepreneur",
  "company": "Example Corp",
  "designation": "CEO",
  "industry": "Technology",
  "website": "https://example.com",
  "innerDrives": "Achievement, Recognition",
  "baselines": "High performance standards",
  "traits": "Leadership, Innovation",
  "personalityType": "ENTJ",
  "assessmentTrait": "Leadership",
  "assessmentScore": 85,
  "assessmentMaxScore": 100,
  "assessmentRanking": "Excellent",
  "categories": [...],
  "notes": [...],
  "activities": [...],
  "socialMediaProfiles": [...],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Update Contact
```http
PUT /contacts/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "lastName": "Doe",
  "designation": "CTO"
}
```

### Delete Contact
```http
DELETE /contacts/{id}
Authorization: Bearer <token>
```

### Add Contact Note
```http
POST /contacts/{id}/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Meeting Notes",
  "content": "Discussed project requirements...",
  "type": "meeting"
}
```

### Add Contact Activity
```http
POST /contacts/{id}/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Follow-up Call",
  "description": "Call to discuss proposal",
  "type": "call",
  "dueDate": "2024-01-15T10:00:00Z",
  "assignedToId": "uuid"
}
```

## CRM Management

### List CRM Trackers
```http
GET /crm/trackers
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Software Sales Tracker",
      "productName": "CRM Software",
      "description": "Track software sales leads",
      "isActive": true,
      "selectedFields": [
        {
          "id": "uuid",
          "name": "budget_range",
          "label": "Budget Range",
          "fieldType": "select",
          "options": ["< $1,000", "$1,000 - $5,000", "$5,000+"]
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create CRM Tracker
```http
POST /crm/trackers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Software Sales Tracker",
  "productName": "CRM Software",
  "description": "Track software sales leads",
  "selectedFieldIds": ["uuid1", "uuid2", "uuid3"],
  "assignedPartnerIds": ["uuid1", "uuid2"]
}
```

### List CRM Fields
```http
GET /crm/fields
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "budget_range",
      "label": "Budget Range",
      "fieldType": "select",
      "description": "Estimated budget range",
      "isRequired": false,
      "options": ["< $1,000", "$1,000 - $5,000", "$5,000+"],
      "sortOrder": 1
    }
  ]
}
```

### List Leads for Tracker
```http
GET /crm/trackers/{trackerId}/leads?status=new&assignedTo=uuid
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "contact": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "company": "Example Corp"
      },
      "status": "new",
      "priority": "high",
      "estimatedValue": 5000.00,
      "expectedCloseDate": "2024-02-01",
      "customFieldValues": {
        "budget_range": "$1,000 - $5,000",
        "decision_timeline": "Within 1 month"
      },
      "assignedTo": {
        "id": "uuid",
        "firstName": "Sales",
        "lastName": "Rep"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create CRM Lead
```http
POST /crm/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "contactId": "uuid",
  "trackerId": "uuid",
  "status": "new",
  "priority": "high",
  "estimatedValue": 5000.00,
  "expectedCloseDate": "2024-02-01",
  "notes": "Hot lead from website inquiry",
  "customFieldValues": {
    "budget_range": "$1,000 - $5,000",
    "decision_timeline": "Within 1 month",
    "pain_points": "Current system is too slow"
  },
  "assignedToId": "uuid"
}
```

### Update CRM Lead
```http
PUT /crm/leads/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "qualified",
  "estimatedValue": 7500.00,
  "notes": "Qualified during discovery call",
  "nextFollowUpDate": "2024-01-20"
}
```

### Add Lead Update
```http
POST /crm/leads/{id}/updates
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "status_change",
  "title": "Lead Qualified",
  "description": "Lead qualified after discovery call. Budget confirmed at $7,500.",
  "previousStatus": "contacted",
  "newStatus": "qualified"
}
```

## Assessment Management

### List Assessments
```http
GET /assessments
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Leadership Assessment",
      "description": "Evaluate leadership capabilities",
      "trait": "Leadership",
      "status": "published",
      "totalQuestions": 20,
      "maxScore": 100,
      "timeLimit": 30,
      "publicUrl": "leadership-assessment-abc123",
      "totalResponses": 45,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Assessment
```http
POST /assessments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Leadership Assessment",
  "description": "Evaluate leadership capabilities and potential",
  "trait": "Leadership",
  "instructions": "Please answer all questions honestly...",
  "timeLimit": 30,
  "scoringLogic": {
    "passingScore": 70,
    "weightings": {
      "decision_making": 0.3,
      "team_management": 0.4,
      "communication": 0.3
    }
  },
  "resultCriteria": {
    "excellent": { "min": 90, "max": 100 },
    "good": { "min": 75, "max": 89 },
    "average": { "min": 60, "max": 74 },
    "needs_improvement": { "min": 0, "max": 59 }
  }
}
```

### Get Assessment Details
```http
GET /assessments/{id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Leadership Assessment",
  "description": "Evaluate leadership capabilities",
  "trait": "Leadership",
  "instructions": "Please answer all questions honestly...",
  "totalQuestions": 20,
  "maxScore": 100,
  "timeLimit": 30,
  "status": "published",
  "publicUrl": "leadership-assessment-abc123",
  "questions": [
    {
      "id": "uuid",
      "questionText": "How do you handle conflict in your team?",
      "type": "multiple_choice",
      "sortOrder": 1,
      "isRequired": true,
      "points": 5,
      "options": [
        {
          "id": "uuid",
          "optionText": "Address it immediately",
          "isCorrect": true,
          "points": 5
        },
        {
          "id": "uuid",
          "optionText": "Ignore it and hope it resolves",
          "isCorrect": false,
          "points": 0
        }
      ]
    }
  ]
}
```

### Add Assessment Question
```http
POST /assessments/{id}/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionText": "How do you handle conflict in your team?",
  "type": "multiple_choice",
  "sortOrder": 1,
  "isRequired": true,
  "points": 5,
  "options": [
    {
      "optionText": "Address it immediately",
      "isCorrect": true,
      "points": 5,
      "explanation": "Direct communication is key to resolving conflicts"
    },
    {
      "optionText": "Ignore it and hope it resolves",
      "isCorrect": false,
      "points": 0,
      "explanation": "Ignoring conflict usually makes it worse"
    }
  ]
}
```

### Public Assessment Form
```http
GET /assessments/public/{publicUrl}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Leadership Assessment",
  "description": "Evaluate your leadership capabilities",
  "instructions": "Please provide your details and answer all questions...",
  "timeLimit": 30,
  "questions": [
    {
      "id": "uuid",
      "questionText": "How do you handle conflict in your team?",
      "type": "multiple_choice",
      "isRequired": true,
      "options": [
        {
          "id": "uuid",
          "optionText": "Address it immediately"
        },
        {
          "id": "uuid",
          "optionText": "Ignore it and hope it resolves"
        }
      ]
    }
  ]
}
```

### Submit Assessment Response
```http
POST /assessments/{id}/responses
Content-Type: application/json

{
  "contactInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "contactNumber": "+1234567890",
    "company": "Example Corp"
  },
  "answers": [
    {
      "questionId": "uuid",
      "selectedOptions": ["uuid1"],
      "textAnswer": null
    },
    {
      "questionId": "uuid2",
      "textAnswer": "I believe in collaborative leadership...",
      "selectedOptions": null
    }
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "totalScore": 85,
  "maxPossibleScore": 100,
  "completionPercentage": 100,
  "resultRanking": "Good",
  "resultDescription": "You demonstrate strong leadership capabilities with room for growth in certain areas.",
  "personalityType": "ENTJ",
  "traits": "Strategic thinking, Decision making, Team building",
  "contact": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

## Marketing Campaigns

### List Campaigns
```http
GET /marketing/campaigns
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Q1 Product Launch",
      "type": "email",
      "status": "completed",
      "totalRecipients": 500,
      "sentCount": 498,
      "deliveredCount": 485,
      "openedCount": 245,
      "clickedCount": 89,
      "scheduledAt": "2024-01-01T09:00:00Z",
      "createdAt": "2023-12-25T10:00:00Z"
    }
  ]
}
```

### Create Campaign
```http
POST /marketing/campaigns
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Q1 Product Launch",
  "description": "Announce our new product features",
  "type": "email",
  "subject": "Exciting New Features Available Now!",
  "messageContent": "We're thrilled to announce...",
  "emailTemplateId": "uuid",
  "scheduledAt": "2024-01-01T09:00:00Z",
  "targetCategoryIds": ["uuid1", "uuid2"],
  "filterCriteria": {
    "industry": ["Technology", "Healthcare"],
    "contactType": "entrepreneur",
    "excludeUnsubscribed": true
  }
}
```

### Send Campaign
```http
POST /marketing/campaigns/{id}/send
Authorization: Bearer <token>
```

### List Email Templates
```http
GET /marketing/templates
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Product Launch Template",
      "type": "email",
      "subject": "{{productName}} - Now Available!",
      "htmlContent": "<html><body>Hello {{firstName}}...</body></html>",
      "variables": ["firstName", "lastName", "productName", "companyName"],
      "isDefault": false,
      "isActive": true
    }
  ]
}
```

### Create Email Template
```http
POST /marketing/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Welcome Email Template",
  "type": "email",
  "subject": "Welcome to {{companyName}}, {{firstName}}!",
  "htmlContent": "<html><body><h1>Welcome {{firstName}}!</h1><p>Thank you for joining {{companyName}}...</p></body></html>",
  "textContent": "Welcome {{firstName}}! Thank you for joining {{companyName}}...",
  "variables": ["firstName", "lastName", "companyName", "productName"]
}
```

## Categories

### List Categories
```http
GET /categories
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "High Priority",
      "description": "High priority contacts requiring immediate attention",
      "color": "#ff0000",
      "isActive": true,
      "contactCount": 25,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "VIP Clients",
  "description": "Our most valuable clients",
  "color": "#gold"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "firstName should not be empty"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Contact not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **Assessment submissions**: 10 submissions per hour per IP
- **Campaign sends**: 5 campaigns per hour per user

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:

```json
{
  "data": [...],
  "meta": {
    "total": 250,
    "page": 1,
    "limit": 10,
    "totalPages": 25,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Filtering and Sorting

Most list endpoints support filtering and sorting:

### Filtering
- Use query parameters matching field names
- Multiple values: `?industry=Technology&industry=Healthcare`
- Date ranges: `?createdAfter=2024-01-01&createdBefore=2024-12-31`

### Sorting
- `?sortBy=createdAt&sortOrder=desc`
- Multiple fields: `?sortBy=lastName,firstName&sortOrder=asc,asc`

## File Uploads

File upload endpoints accept multipart/form-data with the following constraints:

- **Maximum file size**: 10MB
- **Allowed types**: Images (JPEG, PNG, GIF), Documents (PDF, DOC, DOCX)
- **File naming**: Files are renamed to prevent conflicts

Example:
```http
POST /contacts/{id}/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary data]
description: "Meeting notes from Q1 review"
```

This API documentation provides comprehensive coverage of all available endpoints in the CMS/LMS/CRM system. For interactive testing, use the Swagger UI available at `/api/docs` when the application is running.