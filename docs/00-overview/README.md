# Project Overview

## What is Classivo?

The School Management System (Classivo) is a comprehensive, multi-tenant platform designed for educational institutions including private schools, public schools, universities, private tuitions, language schools, and other teaching providers.

The platform combines:
- **Campus Management** - Student/teacher lifecycle, enrollment, scheduling
- **Learning Management System (LMS)** - Course creation, content delivery, assessments
- **Financial Management** - Fee collection, invoicing, payroll, reporting

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      SYSTEM PROVIDER                            │
│  (Platform Owner - manages schools, global settings, billing)  │
├─────────────────────────────────────────────────────────────────┤
│                         TENANTS                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  School A   │  │  School B   │  │  School C   │  ...        │
│  │  (Tenant)   │  │  (Tenant)   │  │  (Tenant)   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                         PORTALS                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Student  │ │ Teacher  │ │  School  │ │  System  │           │
│  │ Portal   │ │ Portal   │ │  Admin   │ │  Admin   │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | User interface |
| **Build** | Vite | Fast development and bundling |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **State** | Zustand | Lightweight state management |
| **Routing** | React Router DOM v6 | Client-side routing |
| **Forms** | React Hook Form + Zod | Form handling and validation |
| **i18n** | react-i18next | Internationalization |
| **Backend** | FastAPI | REST API server |
| **Auth** | Supabase Auth | Authentication and sessions |
| **Database** | PostgreSQL (Supabase) | Primary data store |
| **Cache** | Redis | Session and cache management |

---

## Core Concepts

### Multi-Tenancy

Each school operates as an isolated tenant with:
- Branded public pages at `/school/:schoolId/*`
- Dedicated login at `/school/:schoolId/login`
- Isolated data and configurations
- Custom branding and settings

### Role-Based Access Control (RBAC)

Seven distinct roles with granular permissions:

| Role | Access Level | Portal |
|------|--------------|--------|
| System Administrator | Platform-wide | `/system-admin/*` |
| School Administrator | School-wide | `/school-admin/*` |
| Manager | Academic operations | `/school-admin/*` |
| Finance Officer | Financial operations | `/school-admin/*` |
| Help Desk | Support operations | `/school-admin/*` |
| Teacher | Course-level | `/teacher/*` |
| Student | Personal data | `/student/*` |

### Authentication Model

- **Staff (Invitation-only)**: Directors, Admins, Managers, Finance Officers, Help Desk, and Teachers receive invitations and authenticate via Google OAuth
- **Students (Self-registration)**: Students authenticate directly with Google and receive portal access automatically

---

## Key Modules

### Learning Management

```
┌─────────────────────────────────────────────────────────────┐
│                    COURSE LIFECYCLE                         │
│                                                             │
│  Create Course → Assign Teachers → Open Enrollment →       │
│  Add Content → Schedule Exams → Grade Students →           │
│  Generate Reports                                           │
└─────────────────────────────────────────────────────────────┘
```

- Course creation and management
- Student enrollment with codes
- Content delivery and resources
- Exam creation with approval workflow
- Grading and progress tracking
- Announcements and communications

### Exam Workflow

```
Teacher Creates Question → Admin Approves → Added to Pool
Teacher Creates Exam → Selects Questions → Admin Approves → Published
Student Takes Exam → Auto-grade (MCQ/T-F) + Manual grade (Essay)
```

### Financial Management

- Fee structure definition
- Invoice generation
- Payment recording
- Payroll management
- Financial reporting and exports

---

## Portal Features Matrix

| Feature | Student | Teacher | School Admin | System Admin |
|---------|:-------:|:-------:|:------------:|:------------:|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Profile | ✓ | ✓ | ✓ | ✓ |
| Courses (View) | ✓ | ✓ | ✓ | ✓ |
| Courses (Manage) | - | ✓ | ✓ | - |
| Exams (Take) | ✓ | - | - | - |
| Exams (Create) | - | ✓ | ✓ | - |
| Grades (View) | ✓ | ✓ | ✓ | ✓ |
| Grades (Assign) | - | ✓ | ✓ | - |
| Students (CRUD) | - | View | ✓ | ✓ |
| Teachers (CRUD) | - | - | ✓ | ✓ |
| Finance | View Fees | - | ✓ | View |
| Reports | - | Basic | ✓ | ✓ |
| Settings | Profile | Profile | School | System |

---

## Internationalization

### Supported Languages

| Language | Code | Status | RTL |
|----------|------|--------|-----|
| English | `en` | Primary | No |
| Burmese (Myanmar) | `my` | Secondary | Yes |

### Translation Coverage

- UI labels and messages
- Form validation errors
- Notification texts
- Help content

---

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base primitives (Button, Card, Input)
│   ├── shared/          # Business components (forms, data display)
│   └── layouts/         # Page layout wrappers
├── pages/               # Route components by portal
│   ├── system/          # Platform public pages
│   ├── school-public/   # School tenant public pages
│   ├── admin/           # School admin portal
│   ├── system-admin/    # System admin portal
│   ├── teacher/         # Teacher portal
│   └── student/         # Student portal
├── stores/              # Zustand state stores
├── config/              # Navigation and route configs
├── types/               # TypeScript definitions
├── utils/               # Utility functions
├── i18n/                # Translation files
└── services/            # API service layer
```

---

## See Also

- [Quickstart Guide](../01-setup/quickstart.md) - Get started in 5 minutes
- [Frontend Architecture](../02-architecture/frontend.md) - Detailed technical architecture
- [Roles & Permissions](../03-auth-rbac/roles-permissions.md) - Complete RBAC specification
