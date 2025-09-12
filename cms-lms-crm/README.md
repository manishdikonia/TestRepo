# CMS/LMS/CRM System

A comprehensive Contact Management System (CMS), Lead Management System (LMS/CRM), and Lead Generation Assessment Software built with NestJS, TypeORM, and MySQL.

## 🚀 Features

### Contact Management System (CMS)
- **Standard Information Management**: Name, contact details, company, industry, etc.
- **Specific Information Management**: Inner drives, baselines, traits, personality types from assessments
- **Categorization**: Customizable contact categories and tags
- **Activity Tracking**: Reminders, to-dos, meeting notes, calendar integration
- **Duplicate Management**: Automatic detection and merging of duplicate contacts
- **Social Media Integration**: Link Facebook, LinkedIn, Instagram, Twitter profiles
- **Audit Trail**: Complete history of who edited what and when

### Lead Management System (LMS/CRM)
- **Product-wise CRM Trackers**: Create customizable lead tracking sheets
- **CMS Integration**: Import contacts directly from CMS
- **Customizable Fields**: Pre-defined and custom field sets for different products
- **Lead Status Tracking**: Complete pipeline management
- **Partner Access**: Restricted access for external partners
- **Follow-up Management**: Automated reminders and meeting scheduling

### Assessment & Lead Generation
- **Assessment Builder**: Create unlimited assessments with multiple question types
- **Public Sharing**: Generate unique URLs for sharing via videos, podcasts, events
- **Automatic Scoring**: Pre-defined scoring logic and result criteria
- **Lead Capture**: Automatically create contacts from assessment responses
- **Trait Assignment**: Direct integration with CMS personality fields

### Research Questionnaires
- **Questionnaire Builder**: Create structured surveys for customer insights
- **Contact Association**: Link responses to specific contacts
- **Multiple Questionnaires**: Support for multiple questionnaires per contact

### Marketing Automation
- **Category-based Campaigns**: Filter and target by contact categories
- **Email Integration**: Bulk emailing with templates
- **WhatsApp Integration**: Direct messaging through WhatsApp Business API
- **Template Management**: Reusable email and message templates

### Partner Management
- **Role-based Access**: Restricted partner logins
- **Lead Assignment**: Assign specific leads to partners
- **Progress Tracking**: Partners can update lead status and notes

## 🛠 Technology Stack

- **Backend**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class Validator & Class Transformer
- **File Upload**: Multer
- **Configuration**: @nestjs/config

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd cms-lms-crm
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Update the `.env` file with your database and other service credentials:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=cms_lms_crm

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# WhatsApp API
WHATSAPP_API_URL=https://api.whatsapp.com
WHATSAPP_API_KEY=your-whatsapp-api-key
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE cms_lms_crm;"

# Run migrations (auto-run on start in development)
npm run migration:run

# Optional: Run seeds for initial data
npm run seed:run
```

### 4. Start the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at:
- **API**: http://localhost:3000/api/v1
- **Swagger Documentation**: http://localhost:3000/api/docs

## 📊 Database Schema

### Core Entities

#### Users
- **Role-based access**: Admin, Internal Staff, Partner, Client
- **Authentication**: JWT-based with password hashing
- **Profile management**: Company, designation, profile picture

#### Contacts
- **Standard fields**: Name, email, phone, company, industry
- **Assessment data**: Personality type, traits, inner drives, baselines
- **Social media**: Multiple platform profile links
- **Activity tracking**: Notes, meetings, reminders

#### Categories
- **Flexible tagging**: Customizable contact categories
- **Color coding**: Visual organization
- **Multi-assignment**: Contacts can have multiple categories

### CRM System

#### CRM Trackers
- **Product-specific**: Create trackers for different products/services
- **Field customization**: Select from predefined field sets
- **Partner assignment**: Assign trackers to external partners

#### CRM Fields
- **Multiple types**: Text, number, select, date, boolean, etc.
- **Validation**: Custom validation rules and messages
- **Reusable**: Fields can be used across multiple trackers

#### CRM Leads
- **Status tracking**: New, contacted, qualified, proposal, closed
- **Custom data**: Dynamic field values based on tracker configuration
- **Timeline**: Complete history of lead updates and interactions

### Assessment System

#### Assessments
- **Question builder**: Multiple choice, text, rating, boolean questions
- **Scoring logic**: Complex scoring rules and result criteria
- **Public URLs**: Shareable links for lead generation
- **Trait mapping**: Direct integration with contact personality fields

#### Assessment Responses
- **Complete tracking**: Start time, completion time, IP address
- **Automatic scoring**: Real-time calculation based on predefined rules
- **Contact creation**: Automatic contact creation from responses

### Marketing System

#### Campaigns
- **Multi-channel**: Email, WhatsApp, SMS support
- **Template-based**: Reusable templates with variable substitution
- **Category targeting**: Filter recipients by contact categories
- **Performance tracking**: Delivery, open, click, bounce rates

#### Email Templates
- **HTML/Text**: Rich HTML templates with plain text fallbacks
- **Variables**: Dynamic content insertion
- **Reusable**: Templates can be used across multiple campaigns

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - User logout

### Contacts
- `GET /api/v1/contacts` - List contacts with filtering
- `POST /api/v1/contacts` - Create new contact
- `GET /api/v1/contacts/:id` - Get contact details
- `PUT /api/v1/contacts/:id` - Update contact
- `DELETE /api/v1/contacts/:id` - Delete contact
- `POST /api/v1/contacts/:id/notes` - Add contact note
- `POST /api/v1/contacts/:id/activities` - Add contact activity

### CRM
- `GET /api/v1/crm/trackers` - List CRM trackers
- `POST /api/v1/crm/trackers` - Create CRM tracker
- `GET /api/v1/crm/trackers/:id/leads` - Get tracker leads
- `POST /api/v1/crm/leads` - Create new lead
- `PUT /api/v1/crm/leads/:id` - Update lead
- `POST /api/v1/crm/leads/:id/updates` - Add lead update

### Assessments
- `GET /api/v1/assessments` - List assessments
- `POST /api/v1/assessments` - Create assessment
- `GET /api/v1/assessments/:id` - Get assessment details
- `GET /api/v1/assessments/public/:url` - Public assessment form
- `POST /api/v1/assessments/:id/responses` - Submit assessment response

### Marketing
- `GET /api/v1/marketing/campaigns` - List campaigns
- `POST /api/v1/marketing/campaigns` - Create campaign
- `POST /api/v1/marketing/campaigns/:id/send` - Send campaign
- `GET /api/v1/marketing/templates` - List email templates

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user types
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Audit Logging**: Complete audit trail of all system actions

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📈 Performance Features

- **Database Indexing**: Optimized database queries
- **Pagination**: Efficient data loading for large datasets
- **Caching**: Redis-ready for caching frequently accessed data
- **File Upload**: Secure file handling with size and type restrictions
- **Background Jobs**: Queue system for heavy operations

## 🔧 Development

### Project Structure

```
src/
├── common/           # Shared utilities, guards, interceptors
├── config/          # Configuration files
├── database/        # Migrations and seeds
├── entities/        # TypeORM entities
├── modules/         # Feature modules
│   ├── auth/        # Authentication
│   ├── cms/         # Contact management
│   ├── crm/         # Lead management
│   ├── assessments/ # Assessment system
│   ├── marketing/   # Marketing campaigns
│   └── users/       # User management
└── main.ts          # Application entry point
```

### Adding New Features

1. Create entity in `src/entities/`
2. Generate module: `nest g module feature-name`
3. Generate service: `nest g service feature-name`
4. Generate controller: `nest g controller feature-name`
5. Add to main `AppModule`

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 📝 API Documentation

Complete API documentation is available at `/api/docs` when the application is running. The Swagger UI provides:

- Interactive API testing
- Request/response schemas
- Authentication testing
- Example requests and responses

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the database schema documentation

## 🚧 Roadmap

- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] Integration with more third-party services
- [ ] Advanced workflow automation
- [ ] Multi-tenant support