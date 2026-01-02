# Quickstart Guide

Get the School Management System running locally in 5 minutes.

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** or yarn package manager
- **Git** for version control
- **VS Code** (recommended editor)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd school-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
# Application
VITE_APP_NAME=School Management System
VITE_API_URL=http://localhost:8000/api/v1

# Supabase (optional for mock mode)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: The app runs in mock mode by default. Supabase configuration is optional for local development.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:5173**

---

## Demo Login

The mock authentication system uses email keywords to assign roles:

| Email Contains | Assigned Role | Portal URL |
|----------------|---------------|------------|
| `student` | Student | `/student/dashboard` |
| `teacher` | Teacher | `/teacher/dashboard` |
| `admin` | School Administrator | `/school-admin/dashboard` |
| `system` | System Administrator | `/system-admin/dashboard` |

**Example logins:**
- `john.student@school.edu` → Student portal
- `jane.teacher@school.edu` → Teacher portal
- `admin@school.edu` → School admin portal
- `system@classivo.com` → System admin portal

Use any password (min 6 characters) for demo login.

---

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# TypeScript type checking
npm run check

# ESLint linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Project Navigation

After starting the dev server, explore these key areas:

### Public Pages
- **/** - Platform landing page
- **/school/:schoolId** - School-specific landing
- **/login** - System login
- **/school/:schoolId/login** - School-branded login

### Student Portal (`/student/*`)
- Dashboard with virtual ID card
- Course enrollment and schedule
- Grade viewing and exam taking
- Fee payment history

### Teacher Portal (`/teacher/*`)
- Dashboard with teaching schedule
- Course and student management
- Exam creation and grading
- Announcements

### School Admin Portal (`/school-admin/*`)
- Overview dashboard with KPIs
- Student and teacher CRUD
- Financial management
- Reports and settings

### System Admin Portal (`/system-admin/*`)
- Platform-wide dashboard
- School management
- User management
- System settings

---

## Next Steps

1. **Explore the codebase**: Start with `src/pages/` to see route components
2. **Read the architecture**: [Frontend Architecture](../02-architecture/frontend.md)
3. **Use components**: [Component Library](../04-ui/component-library.md)
4. **Understand RBAC**: [Roles & Permissions](../03-auth-rbac/roles-permissions.md)

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <pid> /F

# Or use a different port
npm run dev -- --port 3000
```

### Module Not Found

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Run type checking to see all errors
npm run check
```

### Build Failures

```bash
# Check for linting issues
npm run lint

# Check for type errors
npm run check
```

---

## See Also

- [Environment Configuration](./environment.md) - Detailed environment setup
- [Frontend Architecture](../02-architecture/frontend.md) - Technical deep-dive
- [Deployment Guide](../05-deployment/README.md) - Production deployment
