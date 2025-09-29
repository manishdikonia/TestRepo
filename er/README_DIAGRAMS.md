# Auth & RBAC System Diagrams

## 📊 Overview

This directory contains multiple versions of the Auth & RBAC (Role-Based Access Control) system architecture diagrams. Each diagram provides a different perspective and level of detail for the system design.

## 🎨 Available Diagrams

### 1. **auth_rbac_simple.mmd** - High-Level Overview
- **Purpose**: Provides a bird's-eye view of the system components
- **Best For**: Executive presentations, initial system understanding
- **Features**: Clean icons, minimal detail, clear component relationships

### 2. **auth_rbac_structured.mmd** - Detailed Flow Diagram
- **Purpose**: Shows complete system architecture with module separation
- **Best For**: Technical documentation, developer reference
- **Features**: 
  - Grouped subsystems
  - Detailed entity attributes
  - Clear data flow relationships
  - Color-coded components

### 3. **auth_rbac_er.mmd** - Entity Relationship Diagram
- **Purpose**: Database schema visualization
- **Best For**: Database design, backend development
- **Features**:
  - Primary and foreign keys
  - Table relationships with cardinality
  - Complete field listings
  - Standard ER notation

### 4. **auth_rbac_clean.mmd** - Clean Architecture View
- **Purpose**: Balanced view between detail and clarity
- **Best For**: System documentation, architecture reviews
- **Features**: Organized layout with moderate detail level

## 🚀 How to Render Diagrams

### Option 1: Using the Provided Script
```bash
cd /workspace/er
./render_diagrams.sh
```

### Option 2: Manual Rendering with Mermaid CLI
```bash
# Install Mermaid CLI if not already installed
npm install -g @mermaid-js/mermaid-cli

# Render individual diagrams
mmdc -i auth_rbac_simple.mmd -o auth_rbac_simple.png
mmdc -i auth_rbac_structured.mmd -o auth_rbac_structured.png
mmdc -i auth_rbac_er.mmd -o auth_rbac_er.png
mmdc -i auth_rbac_clean.mmd -o auth_rbac_clean.png
```

### Option 3: Online Mermaid Editor
1. Visit [Mermaid Live Editor](https://mermaid.live)
2. Copy the content of any `.mmd` file
3. Paste into the editor
4. Export as PNG/SVG

## 📋 System Components

### Core Modules

1. **🔐 Authentication & RBAC**
   - Permissions management
   - Role definitions
   - Role-permission mappings

2. **🏢 Organization Management**
   - Company records
   - User-company associations
   - Role assignments per company

3. **👤 User Management**
   - User profiles
   - Authentication credentials
   - User relationships

4. **📚 Learning Platform**
   - Batch management
   - Participant enrollment
   - Learning progress tracking

5. **📝 Assessment System**
   - Assignments
   - Submissions
   - Grading workflow

6. **📂 Content & Resources**
   - Resource management
   - Access control
   - Assessment packages

7. **❓ Quiz System**
   - Quiz creation
   - Session management
   - Response tracking

8. **⚙️ System Settings**
   - Global configuration
   - System parameters

## 🔄 Key Relationships

- **Users** ← → **Companies**: Many-to-many through user_company
- **Roles** ← → **Permissions**: Many-to-many through role_permissions
- **Batches** ← → **Participants**: One-to-many enrollment
- **Assignments** ← → **Submissions**: One-to-many submissions
- **Resources** ← → **Batches**: Access control mapping
- **Quizzes** ← → **Sessions** ← → **Responses**: Hierarchical quiz structure

## 📝 Database Tables Summary

| Module | Main Tables | Purpose |
|--------|------------|---------|
| Auth | permissions, roles, role_permissions | Access control |
| Organization | companies, user_company | Organization structure |
| Users | users | User management |
| Learning | batches, batch_participants | Course management |
| Assessment | assignments, submissions, assessments | Evaluation system |
| Content | resources, resource_access, packages | Content delivery |
| Quiz | quizzes, quiz_sessions, quiz_responses | Quiz functionality |
| Config | system_settings | System configuration |

## 🎯 Usage Guidelines

1. **For New Developers**: Start with `auth_rbac_simple.mmd` for overview, then move to `auth_rbac_structured.mmd`
2. **For Database Work**: Use `auth_rbac_er.mmd` as reference
3. **For Documentation**: Include `auth_rbac_structured.png` in technical docs
4. **For Presentations**: Use `auth_rbac_simple.png` for clarity

## 🔧 Customization

To modify the diagrams:
1. Edit the `.mmd` files using any text editor
2. Follow [Mermaid syntax](https://mermaid-js.github.io/mermaid/#/) 
3. Re-render using the provided script
4. Test changes in the online editor first if unsure

## 📚 Additional Resources

- [Mermaid Documentation](https://mermaid-js.github.io/mermaid/#/)
- [Mermaid Live Editor](https://mermaid.live)
- [ER Diagram Best Practices](https://www.lucidchart.com/pages/er-diagrams)

---

*Generated diagrams provide multiple perspectives of the Auth & RBAC system to support different stakeholder needs and use cases.*