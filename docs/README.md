# School Management System Documentation

Welcome to the School Management System (Classivo) documentation. This guide covers everything you need to develop, deploy, and maintain the platform.

---

## Quick Navigation

### Getting Started
- [Overview](./00-overview/README.md) - Project introduction and architecture overview
- [Quickstart](./01-setup/quickstart.md) - Get up and running in minutes
- [Environment Setup](./01-setup/environment.md) - Detailed development environment configuration

### Architecture & Design
- [Frontend Architecture](./02-architecture/frontend.md) - React/TypeScript architecture and patterns
- [Workflow & Routing](./02-architecture/workflow.md) - Multi-tenant routing and portal flows
- [API Integration](./02-architecture/api-integration.md) - Backend API patterns and services

### Access Control
- [Roles & Permissions](./03-auth-rbac/roles-permissions.md) - Complete RBAC specification

### UI Development
- [Component Library](./04-ui/component-library.md) - Reusable UI components reference
- [UI Patterns](./04-ui/patterns.md) - Standard UI patterns and guidelines
- [Component Audit](./04-ui/component-audit.md) - Audit report and extraction roadmap

### Deployment
- [Deployment Guide](./05-deployment/README.md) - Production deployment instructions

---

## Documentation Map

```
docs/
├── README.md                      # This file - documentation entry point
├── 00-overview/
│   └── README.md                  # Project overview and introduction
├── 01-setup/
│   ├── quickstart.md              # Quick start guide
│   └── environment.md             # Environment configuration
├── 02-architecture/
│   ├── frontend.md                # Frontend architecture
│   ├── workflow.md                # Workflows, routing, multi-tenancy
│   └── api-integration.md         # API integration patterns
├── 03-auth-rbac/
│   └── roles-permissions.md       # Roles, permissions, access control
├── 04-ui/
│   ├── component-library.md       # Component documentation
│   ├── patterns.md                # UI patterns guide
│   └── component-audit.md         # Component audit report
├── 05-deployment/
│   └── README.md                  # Deployment guide
└── migrations/
    └── moved-docs-map.md          # Old → New path mappings
```

---

## Role-Specific Quick Links

### For Developers
1. [Quickstart](./01-setup/quickstart.md) - Set up your development environment
2. [Frontend Architecture](./02-architecture/frontend.md) - Understand the codebase structure
3. [Component Library](./04-ui/component-library.md) - Use and extend UI components

### For Architects
1. [Architecture Overview](./02-architecture/frontend.md) - System design decisions
2. [Workflow & Routing](./02-architecture/workflow.md) - Multi-tenant architecture
3. [Roles & Permissions](./03-auth-rbac/roles-permissions.md) - RBAC model

### For DevOps
1. [Environment Setup](./01-setup/environment.md) - Environment variables
2. [Deployment Guide](./05-deployment/README.md) - Production deployment

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Routing | React Router DOM v6 |
| Forms | React Hook Form + Zod |
| i18n | react-i18next |
| Backend | FastAPI + Supabase |

---

## User Roles

The system supports 7 user roles across 4 portals:

| Role | Portal | Description |
|------|--------|-------------|
| System Administrator | `/system-admin/*` | Platform-wide management |
| School Administrator | `/school-admin/*` | School-level management |
| Manager | `/school-admin/*` | Academic operations |
| Finance Officer | `/school-admin/*` | Financial operations |
| Help Desk | `/school-admin/*` | Support operations |
| Teacher | `/teacher/*` | Instruction and grading |
| Student | `/student/*` | Learning and enrollment |

See [Roles & Permissions](./03-auth-rbac/roles-permissions.md) for the complete permission matrix.

---

## Contributing to Documentation

When updating documentation:

1. Follow the established folder structure
2. Use consistent Markdown formatting
3. Update the navigation in this README if adding new files
4. Cross-reference related documents with relative links
5. Keep code examples up-to-date with the codebase

---

*Last updated: January 2026*
