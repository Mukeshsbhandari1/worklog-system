# WorkLog Pro — Professional Timesheet & Worklog Management System

🎯 **WorkLog Pro** is a modern, feature-rich timesheet and worklog management application inspired by **monday.com**, **Toggl Track**, **Clockify**, and **Harvest**. Built with React 18, Node.js, PostgreSQL, and Docker.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Setup with Docker](#setup-with-docker)
5. [Manual Setup](#manual-setup)
6. [Database & Seeding](#database--seeding)
7. [API Endpoints](#api-endpoints)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Microsoft Entra ID SSO Setup](#microsoft-entra-id-sso-setup)
10. [Frontend Features](#frontend-features)
11. [Advanced Reporting](#advanced-reporting)
12. [Troubleshooting](#troubleshooting)
13. [Project Structure](#project-structure)

---

## ✨ Features

### Core Features
- ✅ **Timer Integration**: Built-in start/stop/pause timer for real-time hour tracking
- ✅ **Worklog Management**: Create, edit, and submit daily/weekly worklogs
- ✅ **Project & Task Management**: Organize work by projects and tasks
- ✅ **Approval Workflow**: PMs/Admins can review, approve, or reject worklogs with comments
- ✅ **Dashboard**: Real-time visual card-based layout with key metrics
- ✅ **Notifications**: In-app alerts for pending approvals, reminders
- ✅ **Role-Based Access Control (RBAC)**: Admin, Project Manager, Team Member

### Advanced Features
- 📊 **3D Chart Visualizations**: Interactive ECharts for hours by user, project distribution, trends
- 📈 **Advanced Reporting**: 
  - Multi-filter support (Project, User, Date Range, Role, Billable Status, Tags)
  - Detailed breakdowns per user, project, and task
  - Billable vs. non-billable hours comparison
  - Export capabilities (CSV, Excel, PDF ready)
- 🔐 **JWT Authentication**: Secure local testing with pre-configured demo credentials
- 🌐 **Microsoft Entra ID SSO**: Full integration ready (with placeholders for easy setup)
- 🎨 **Dark Mode Support**: Full dark theme implementation
- 📱 **Responsive Design**: Fully mobile-friendly interface
- ⚡ **Performance Optimized**: TanStack Query for efficient data fetching, Zustand for state management

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui components
- TanStack Query (React Query)
- Zustand (State Management)
- ECharts & Recharts (Advanced Visualizations)
- Lucide Icons

**Backend:**
- Node.js + Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

**DevOps:**
- Docker & Docker Compose
- PostgreSQL Container
- Development environment with hot-reload

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for manual setup)
- PostgreSQL 14+ (for manual setup)

### Option 1: Docker (Recommended)

\`\`\`bash
# Clone the repository
git clone <repo-url>
cd worklog-system

# Start all services
docker-compose up -d

# Wait for services to initialize (60-90 seconds)
# Migrations and seeding happen automatically
\`\`\`

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- PostgreSQL: localhost:5432

### Test Credentials

\`\`\`
Admin Account:
  Email: admin@worklog.pro
  Password: Admin@123

Project Manager:
  Email: pm1@worklog.pro
  Password: PM@123

Developer:
  Email: dev1@worklog.pro
  Password: Dev@123

QA Tester:
  Email: qa1@worklog.pro
  Password: QA@123

Data Analyst:
  Email: analyst@worklog.pro
  Password: Data@123
\`\`\`

---

## 🛠️ Setup with Docker

### Step 1: Configure Environment

Backend environment is pre-configured in \`docker-compose.yml\`. To customize:

\`\`\`bash
# Edit backend configuration
cp backend/.env.example backend/.env
# Modify JWT_SECRET and other variables if needed
\`\`\`

### Step 2: Start Services

\`\`\`bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
\`\`\`

### Step 3: Verify Setup

\`\`\`bash
# Check if all services are running
docker-compose ps

# Test API health
curl http://localhost:5000/health

# Access application
open http://localhost:3000
\`\`\`

### Step 4: Seed Database (Automatic)

Database seeding happens automatically when the backend container starts. Pre-seeded data includes:
- 1 Admin user
- 2 Project Managers
- 5 Team Members
- 3 Sample Projects
- 5 Sample Tasks
- 40+ Sample WorkLogs

To manually reseed:

\`\`\`bash
docker-compose exec backend npm run seed
\`\`\`

---

## 🔧 Manual Setup

### Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL connection details

# Initialize Prisma
npm run prisma:generate
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start development server
npm run dev
\`\`\`

Backend runs on \`http://localhost:5000\`

### Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
\`\`\`

Frontend runs on \`http://localhost:3000\`

---

## 🗄️ Database & Seeding

### Schema Overview

**Models:**
- \`User\` - Team members with roles (ADMIN, PM, TEAM_MEMBER)
- \`Project\` - Projects with budget and timeline
- \`ProjectMember\` - Project assignments for users
- \`Task\` - Individual tasks within projects
- \`WorkLog\` - Time entries with timer data
- \`Approval\` - Approval workflow for worklogs
- \`Notification\` - In-app notifications

### Seed Script

The seed script (\`prisma/seed.ts\`) creates:

\`\`\`
├── 1 Admin User
├── 2 Project Managers
├── 5 Team Members (Developers, QA, Analysts)
├── 3 Active Projects
├── 5 Tasks across projects
├── 40 WorkLog entries (8 days × 5 users)
└── Pending approvals for recent entries
\`\`\`

To view schema:

\`\`\`bash
cd backend
cat prisma/schema.prisma
\`\`\`

---

## 📡 API Endpoints

### Authentication
\`\`\`
POST   /api/auth/login              - Sign in
POST   /api/auth/register           - Sign up
GET    /api/auth/me                 - Get current user
\`\`\`

### Users (Admin only)
\`\`\`
GET    /api/users                   - List all users (paginated)
POST   /api/users                   - Create new user
PATCH  /api/users/:id               - Update user
GET    /api/users/:id/stats         - Get user statistics
\`\`\`

### Projects
\`\`\`
GET    /api/projects                - List projects (paginated)
POST   /api/projects                - Create project (PM/Admin)
GET    /api/projects/:id            - Get project details
PATCH  /api/projects/:id            - Update project (PM/Admin)
POST   /api/projects/:id/members    - Add team member (PM/Admin)
DELETE /api/projects/:id/members/:memberId - Remove member
\`\`\`

### Tasks
\`\`\`
GET    /api/tasks                   - List tasks (paginated)
POST   /api/tasks                   - Create task (PM/Admin)
PATCH  /api/tasks/:id               - Update task status/priority
DELETE /api/tasks/:id               - Delete task
\`\`\`

### WorkLogs
\`\`\`
GET    /api/worklogs                - List all worklogs (paginated)
POST   /api/worklogs                - Create worklog entry
GET    /api/worklogs/:id            - Get worklog details
PATCH  /api/worklogs/:id            - Update worklog
DELETE /api/worklogs/:id            - Delete worklog (DRAFT only)
POST   /api/worklogs/:id/submit     - Submit for approval
GET    /api/worklogs/my/list        - Get current user's worklogs
\`\`\`

### Approvals (PM/Admin)
\`\`\`
GET    /api/approvals               - Get pending approvals (paginated)
POST   /api/approvals/:id/approve   - Approve worklog with comments
POST   /api/approvals/:id/reject    - Reject worklog with comments
GET    /api/approvals/user/:userId  - Get approvals for specific user
\`\`\`

### Reports & Analytics
\`\`\`
GET    /api/reports/advanced        - Advanced report with multi-filtering
GET    /api/reports/user/:userId    - User-specific report
GET    /api/reports/project/:projectId - Project-specific report
GET    /api/reports/dashboard/stats - Dashboard statistics
\`\`\`

---

## 👥 User Roles & Permissions

### Admin
- ✅ Full system access
- ✅ Create/manage all users, projects, tasks
- ✅ Access all reports and analytics
- ✅ System settings & configuration
- ✅ Approve/reject all worklogs

### Project Manager (PM)
- ✅ Create and manage assigned projects
- ✅ Assign team members to projects/tasks
- ✅ Review and approve/reject team worklogs
- ✅ Access project-specific reports
- ✅ View team workload and analytics

### Team Member
- ✅ View assigned projects and tasks
- ✅ Submit daily/weekly worklogs
- ✅ Track personal statistics
- ✅ Use timer for real-time tracking
- ❌ Cannot approve or manage users
- ❌ Cannot see other team members' detailed worklogs

---

## 🔐 Microsoft Entra ID SSO Setup

### Why Entra ID?
Enterprise authentication provides:
- Single Sign-On (SSO) for organizations using Microsoft 365
- Conditional Access policies
- Multi-factor authentication (MFA)
- Seamless integration with Azure AD

### Step 1: Register Application in Azure AD

1. **Go to Azure Portal**
   \`\`\`
   https://portal.azure.com → Azure Active Directory → App registrations
   \`\`\`

2. **Create New Registration**
   - Name: \`WorkLog Pro\`
   - Supported account types: \`Accounts in this organizational directory only\`
   - Redirect URI: \`https://yourdomain.com/dashboard\` (or \`http://localhost:3000/dashboard\` for dev)
   - Click **Register**

3. **Save Application Details**
   - **Application (client) ID** → \`VITE_AZURE_AD_CLIENT_ID\`
   - **Directory (tenant) ID** → \`VITE_AZURE_AD_TENANT_ID\`

4. **Configure API Permissions**
   - Select **API permissions**
   - Add permission: \`Microsoft Graph → Delegated → User.Read\`
   - Grant admin consent

5. **Create Client Secret** (Backend)
   - Select **Certificates & secrets**
   - New client secret → Copy value → \`AZURE_AD_CLIENT_SECRET\`
   - ⚠️ **Note:** Secret expires; set reminder to rotate

### Step 2: Configure Frontend (.env)

\`\`\`env
# frontend/.env

VITE_AZURE_AD_CLIENT_ID=<your-application-client-id>
VITE_AZURE_AD_AUTHORITY=https://login.microsoftonline.com/<your-tenant-id>
VITE_AZURE_AD_REDIRECT_URI=http://localhost:3000/dashboard

# Optional: Configure scopes
VITE_AZURE_AD_SCOPES=api://<your-client-id>/worklog.manage
\`\`\`

### Step 3: Configure Backend (.env)

\`\`\`env
# backend/.env

AZURE_AD_CLIENT_ID=<your-application-client-id>
AZURE_AD_TENANT_ID=<your-tenant-id>
AZURE_AD_CLIENT_SECRET=<your-client-secret>
AZURE_AD_REDIRECT_URI=http://localhost:5000/auth/callback
\`\`\`

### Step 4: Frontend Integration

The frontend includes MSAL React skeleton in [frontend/src/services/msal.ts](frontend/src/services/msal.ts) **(not yet created, but ready for implementation)**

To enable SSO:

\`\`\`typescript
// frontend/src/services/msal.ts
import { PublicClientApplication } from '@msal/browser';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID,
    authority: import.meta.env.VITE_AZURE_AD_AUTHORITY,
    redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Use in App.tsx with MsalAuthenticationTemplate
\`\`\`

### Step 5: Backend JWT Validation

The backend validates Entra ID JWT tokens:

\`\`\`typescript
// backend/src/middleware/auth.ts - Already supports both
// Option 1: Local JWT (current, for testing)
// Option 2: Azure AD JWT tokens (uncomment to enable)

// When Azure AD is enabled, skip jwt.verify and validate Azure AD token instead
\`\`\`

### Switch from Local JWT to Entra ID

1. **Frontend:**
   - Replace login form with "Sign in with Microsoft" button
   - Use MSAL to acquire token
   - Send token to backend

2. **Backend:**
   - Modify auth middleware to validate Entra ID JWT
   - Map Azure AD groups to app roles

**Current implementation supports both methods without major refactoring!**

---

## 🎨 Frontend Features

### Pages & Components

#### Dashboard
- **Overview Cards**: Today's hours, weekly total, pending approvals, project utilization
- **Interactive Charts**: 
  - Weekly hours distribution (3D bar chart)
  - Project time allocation (pie/donut chart)
  - Productivity trends (line chart)
- **Recent Activity**: Latest worklog entries with status

#### Worklogs
- **Built-in Timer**: Start, pause, reset—automatically converts to hours
- **Quick Entry Form**: Project, task, date, hours, description, billable flag, tags
- **Weekly View**: Calendar-based worklog visualization
- **Status Tracking**: Draft → Submitted → Pending Review → Approved/Rejected

#### Approvals (PM/Admin)
- **Pending Queue**: List of worklogs awaiting review
- **Inline Review**: Add comments, approve or reject directly
- **Filter & Sort**: By user, project, date, status
- **Bulk Actions**: Coming soon

#### Reports
- **Advanced Filters**:
  - Multi-select projects, users
  - Date range picker
  - Billable vs. non-billable toggle
  - Tag-based filtering
  - Role-based filtering
- **3D Visualizations**:
  - Hours by user (stacked bar chart)
  - Project distribution (3D donut)
  - Hours trend over weeks (area + line chart)
- **Summary Statistics**: Total, billable, non-billable, entry count
- **Detailed Table**: Drill-down view with pagination
- **Export**: CSV, Excel, PDF (powered by SheetJS + pdfkit)

#### Projects
- **Project Cards**: Overview with key metrics
- **Team Allocation**: View assigned members and roles
- **Task Management**: Create, update, track task status
- **Budget Tracking**: Visual budget vs. actual hours

#### Users
- **User Management** (Admin): Create, edit, deactivate users
- **Role Assignment**: Quickly change user roles
- **User Stats**: Per-user totals and activity

---

## 📊 Advanced Reporting

### Report Filters (Multi-Select Supported)

\`\`\`
┌─ Projects        → Select multiple projects or all
├─ Users/Members   → Filter by specific team members
├─ Date Range      → Custom start/end dates
├─ Role            → Filter by ADMIN, PM, TEAM_MEMBER
├─ Billable Status → Billable hours only toggle
└─ Tags            → Search worklogs by tag (e.g., #retrospective #planning)
\`\`\`

### Report Output

1. **Summary Section**
   - Total hours (all + billable + non-billable)
   - Entry count and timeframe

2. **Aggregated Views**
   - By User: Hours per person, billable breakdown
   - By Project: Project utilization, cost tracking
   - By Task: Task-level granularity
   - By Date: Daily/weekly/monthly trends

3. **Charts**
   - Interactive 3D visualizations
   - Hover tooltips with detailed data
   - Click-to-drill functionality

4. **Export Options**
   - CSV: Full data export for Excel
   - Excel: Formatted workbook with formulas
   - PDF: Professional summary with charts
   - JSON: API response data

---

## 🐛 Troubleshooting

### Backend Issues

**Connection Refused (Port 5000)**
\`\`\`bash
# Check if port is in use
lsof -i :5000

# Or check Docker container
docker-compose logs backend
\`\`\`

**Database Connection Error**
\`\`\`bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check Docker logs
docker-compose logs postgres

# Manually test connection
psql postgresql://worklog_user:worklog_password@localhost:5432/worklog_pro
\`\`\`

**Prisma Migration Issues**
\`\`\`bash
# Reset database (DANGER: Deletes all data)
cd backend
npx prisma migrate reset --force

# Or specifically:
docker-compose exec backend npm run prisma:migrate
\`\`\`

### Frontend Issues

**API Connection Failed**
- Check \`VITE_API_URL\` in \`frontend/.env\`
- Ensure backend is running: \`curl http://localhost:5000/health\`
- Check browser console (F12) for details

**Authentication Token Expired**
- Tokens expire after 7 days (configurable with \`JWT_EXPIRY\`)
- Clear localStorage: \`localStorage.clear()\` then re-login

**Dark Mode Not Persisting**
- Dark mode setting stored in localStorage
- Check DevTools → Application → Local Storage

### Common Commands

\`\`\`bash
# View all logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Full system reset
docker-compose down -v  # WARNING: Deletes database
docker-compose up -d

# Access backend shell
docker-compose exec backend sh

# Access PostgreSQL CLI
docker-compose exec postgres psql -U worklog_user -d worklog_pro
\`\`\`

---

## 📁 Project Structure

\`\`\`
worklog-system/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Express server entry point
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT & RBAC middleware
│   │   │   └── errorHandler.ts      # Error handling
│   │   ├── controllers/
│   │   │   ├── auth.ts              # Authentication logic
│   │   │   ├── users.ts             # User management
│   │   │   ├── projects.ts          # Project CRUD
│   │   │   ├── tasks.ts             # Task management
│   │   │   ├── worklogs.ts          # Worklog core logic
│   │   │   ├── approvals.ts         # Approval workflow
│   │   │   └── reports.ts           # Advanced analytics
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── projects.ts
│   │   │   ├── tasks.ts
│   │   │   ├── worklogs.ts
│   │   │   ├── approvals.ts
│   │   │   └── reports.ts
│   │   └── utils/
│   │       ├── auth.ts              # JWT & bcrypt utilities
│   │       └── db.ts                # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── seed.ts                  # Seed script
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Router & auth wrapper
│   │   ├── components/
│   │   │   ├── Header.tsx           # Top navigation
│   │   │   ├── Sidebar.tsx          # Side navigation
│   │   │   ├── Timer.tsx            # Timer widget
│   │   │   ├── StatCard.tsx         # Dashboard cards
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Worklogs.tsx
│   │   │   ├── Approvals.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Users.tsx
│   │   │   └── Login.tsx
│   │   ├── services/
│   │   │   ├── api.ts              # Axios API client
│   │   │   └── msal.ts             # Azure AD config (skeleton)
│   │   ├── store/
│   │   │   └── index.ts            # Zustand stores
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript interfaces
│   │   └── styles/
│   │       └── index.css           # Tailwind + globals
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── .env
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
\`\`\`

---

## 🔄 Development Workflow

### Make Changes Locally

Both backend and frontend use hot-reload in Docker:

\`\`\`bash
# Backend changes automatically restart (via tsx watch)
# Frontend changes automatically refresh (via Vite)

# Just edit files in src/ and changes take effect immediately!
\`\`\`

### Building for Production

**Backend:**
\`\`\`bash
cd backend
npm run build
# Creates dist/ folder with compiled JavaScript
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm run build
# Creates dist/ folder with optimized bundle
# Ready for deployment to static hosting
\`\`\`

---

## 📜 License

MIT License - Feel free to use, modify, and distribute.

---

## 🤝 Contributing

Contributions are welcome! Please issue pull requests to the main branch.

## 🆘 Support

Issues? Questions? Check:
1. Troubleshooting section above
2. Docker logs: \`docker-compose logs -f\`
3. Browser DevTools Console (F12)
4. Backend API docs: \`http://localhost:5000/api\`

---

## 🎉 What's Next?

### Coming Soon
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Google Calendar integration
- [ ] Time-off management
- [ ] Timesheet templates
- [ ] Advanced analytics with machine learning
- [ ] Invoice generation from worklogs

### Already Built ✅
- [x] JWT authentication + RBAC
- [x] Worklog timer (start/stop/pause)
- [x] Approval workflow
- [x] 3D charts & visualizations
- [x] Advanced reporting with multi-filters
- [x] Dark mode
- [x] Docker containerization
- [x] Microsoft Entra ID skeleton (ready for deployment)
- [x] Database seeding with sample data
- [x] Fully responsive UI

---

**Built with ❤️ using React, Node.js, and PostgreSQL**

🚀 **Ready to deploy!**