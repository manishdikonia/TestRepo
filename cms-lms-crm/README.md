# CMS/LMS/CRM System

A comprehensive Contact Management System (CMS), Lead Management System (LMS/CRM), and Lead Generation Assessments Software built with NestJS, TypeORM, and PostgreSQL.

## Features

### 🏢 Contact Management System (CMS)
- **Standard Information Management**: Name, Contact No., Email ID, Location, Entrepreneur/Employee, Company, Designation, Industry, Website
- **Specific Information Management**: Inner Drives, Baselines, Traits, Personality Type
- **Categorization**: Customizable contact categories
- **Activity Tracker**: Reminders, to-dos, and meeting notes with calendar integration
- **Duplicate Data Merging**: Detect and merge duplicates using Name + Mobile No.
- **Social Media Profile Linking**: Facebook, LinkedIn, Instagram, Twitter, etc.
- **Notes & Documents**: Unlimited notes and document attachments
- **Audit Trail**: Track "who edited what and when"

### 🎯 Lead Management System (LMS/CRM)
- **CRM Sheets (Trackers)**: Product-wise lead tracking
- **Custom Fields**: Pre-defined and custom field management
- **Lead Status Tracking**: Complete pipeline management
- **Partner Access**: Restricted CRM access for external collaborators
- **Integration with CMS**: Import contacts from CMS into CRM
- **Follow-up Management**: Notes, updates, and meeting details

### 📊 Assessment & Research Modules
- **Assessment Builder**: Create unlimited assessments with multiple-choice and subjective questions
- **Public Links**: Generate unique URLs for sharing
- **Auto-scoring**: Pre-defined scoring logic and result criteria
- **Research Questionnaires**: Structured insights collection from Ideal Customers (ICPs)
- **Result Processing**: Auto-assign personality types and traits to CMS fields

### 📧 Marketing Module
- **Category-Based Campaigns**: Filter contacts by category
- **Bulk Emailing**: Integration with email services (Mailchimp, SendGrid)
- **WhatsApp Messaging**: Integration with WhatsApp Business API
- **Template Management**: Predefined and custom email templates
- **Campaign Analytics**: Track delivery, opens, and clicks

### 👥 User Management
- **Role-Based Access Control**: Admin, Internal Staff, Partners, Leads
- **Authentication**: JWT-based secure authentication
- **Partner Logins**: Restricted access for external collaborators

## Technology Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator and class-transformer
- **Email**: Nodemailer
- **WhatsApp**: WhatsApp Business API integration

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cms-lms-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=cms_lms_crm

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # WhatsApp Configuration
   WHATSAPP_API_URL=https://api.whatsapp.com
   WHATSAPP_TOKEN=your-whatsapp-token

   # Application Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb cms_lms_crm
   
   # The application will automatically create tables on first run
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:
- **Local**: http://localhost:3000/api
- **Production**: https://your-domain.com/api

## Database Schema

### Core Entities

#### Users
- Authentication and authorization
- Role-based access control (Admin, Internal Staff, Partner, Lead)

#### Contacts
- Standard information (name, contact, email, location, etc.)
- Specific information (inner drives, baselines, traits, personality type)
- Categorization and social media links
- Notes and activities

#### Leads
- Product-wise tracking
- Custom field values
- Status management
- Partner assignments

#### Assessments
- Question management
- Scoring logic
- Public access links
- Response tracking

#### Questionnaires
- Research data collection
- Structured questions
- Response management

#### Marketing Campaigns
- Email and WhatsApp campaigns
- Template management
- Analytics and tracking

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `PUT /auth/change-password` - Change password

### Contacts
- `GET /contacts` - Get all contacts (with pagination and filters)
- `POST /contacts` - Create new contact
- `GET /contacts/:id` - Get contact by ID
- `PATCH /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact
- `GET /contacts/duplicates` - Find duplicate contacts
- `POST /contacts/merge` - Merge duplicate contacts

### Contact Management
- `POST /contacts/:id/notes` - Add note to contact
- `POST /contacts/:id/activities` - Add activity to contact
- `POST /contacts/:id/social-links` - Add social link to contact
- `GET /contacts/categories` - Get all categories
- `POST /contacts/categories` - Create category

### Leads (CRM)
- `GET /leads` - Get all leads
- `POST /leads` - Create new lead
- `GET /leads/:id` - Get lead by ID
- `PATCH /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead

### CRM Trackers
- `GET /trackers` - Get all trackers
- `POST /trackers` - Create new tracker
- `GET /trackers/:id` - Get tracker by ID
- `PATCH /trackers/:id` - Update tracker
- `DELETE /trackers/:id` - Delete tracker

### Assessments
- `GET /assessments` - Get all assessments
- `POST /assessments` - Create new assessment
- `GET /assessments/:id` - Get assessment by ID
- `PATCH /assessments/:id` - Update assessment
- `DELETE /assessments/:id` - Delete assessment
- `GET /assessments/:id/public` - Public assessment link

### Questionnaires
- `GET /questionnaires` - Get all questionnaires
- `POST /questionnaires` - Create new questionnaire
- `GET /questionnaires/:id` - Get questionnaire by ID
- `PATCH /questionnaires/:id` - Update questionnaire
- `DELETE /questionnaires/:id` - Delete questionnaire

### Marketing
- `GET /marketing/campaigns` - Get all campaigns
- `POST /marketing/campaigns` - Create new campaign
- `GET /marketing/campaigns/:id` - Get campaign by ID
- `PATCH /marketing/campaigns/:id` - Update campaign
- `DELETE /marketing/campaigns/:id` - Delete campaign
- `POST /marketing/campaigns/:id/send` - Send campaign

## User Roles

### Admin
- Full system access
- User management
- System configuration
- All CRUD operations

### Internal Staff
- Contact management
- Lead management
- Assessment creation
- Marketing campaigns
- Cannot manage users

### Partner
- Restricted CRM access
- Assigned leads only
- Update lead status
- Cannot view other contacts

### Lead
- Limited access
- Take assessments
- View own responses

## Development

### Project Structure
```
src/
├── entities/           # Database entities
├── modules/           # Feature modules
│   ├── auth/         # Authentication
│   ├── contacts/     # Contact Management
│   ├── leads/        # Lead Management
│   ├── assessments/  # Assessment System
│   ├── questionnaires/ # Research Questionnaires
│   ├── marketing/    # Marketing Module
│   └── partners/     # Partner Management
├── common/           # Shared utilities
│   ├── guards/       # Authentication guards
│   ├── decorators/   # Custom decorators
│   └── interfaces/   # TypeScript interfaces
└── config/           # Configuration files
```

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations
```bash
# Generate migration
npm run typeorm:migration:generate -- -n MigrationName

# Run migrations
npm run typeorm:migration:run

# Revert migration
npm run typeorm:migration:revert
```

## Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t cms-lms-crm .

# Run with Docker Compose
docker-compose up -d
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure SSL for database connections
- Set up proper email and WhatsApp API credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.