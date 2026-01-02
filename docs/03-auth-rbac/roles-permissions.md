# Roles & Permissions

Complete Role-Based Access Control (RBAC) specification for the School Management System.

---

## Overview

The system implements a comprehensive RBAC model with:
- 7 distinct user roles
- 4 protected portals
- Granular module-level permissions
- Invitation-based staff provisioning
- Automatic student provisioning

---

## User Roles

### Role Definitions

| Role | Code | Description | Access Level |
|------|------|-------------|--------------|
| **System Administrator** | `system_administrator` | Platform-wide executive authority | Platform owner |
| **School Administrator** | `school_administrator` | School-level management | School operations |
| **Manager** | `manager` | Academic operations lead | Academic operations |
| **Finance Officer** | `finance_officer` | Financial controller | Financial operations |
| **Help Desk** | `help_desk` | Support agent | Support operations |
| **Teacher** | `teacher` | Instructional staff | Course-level |
| **Student** | `student` | Learner | Personal data |

### Role Hierarchy

```
System Administrator (Platform Level)
    └── School Administrator (School Level)
            ├── Manager (Academic Operations)
            ├── Finance Officer (Financial Operations)
            └── Help Desk (Support Operations)

Teacher (Course Level) ← Invitation Required
Student (Personal Level) ← Self-Registration
```

---

## Portal Access

| Portal | Path | Allowed Roles |
|--------|------|---------------|
| System Admin | `/system-admin/*` | `system_administrator` |
| School Admin | `/school-admin/*` | `school_administrator`, `manager`, `finance_officer`, `help_desk` |
| Teacher | `/teacher/*` | `teacher` |
| Student | `/student/*` | `student` |

---

## Permission Matrix

### User Management

| Operation | Director | Admin | Manager | Finance | Help Desk | Teacher | Student |
|-----------|:--------:|:-----:|:-------:|:-------:|:---------:|:-------:|:-------:|
| User directory: list/search | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| User profile: create invite | ✅ | ✅ | ✅ | - | - | - | - |
| User profile: resend/revoke | ✅ | ✅ | ✅ | - | - | - | - |
| User role reassignment | ✅ | ✅ | - | - | - | - | - |
| User status suspend/restore | ✅ | ✅ | ✅ | - | ✅ | - | - |
| Self profile update | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Academic Operations

| Operation | Director | Admin | Manager | Finance | Help Desk | Teacher | Student |
|-----------|:--------:|:-----:|:-------:|:-------:|:---------:|:-------:|:-------:|
| Courses: create | ✅ | ✅ | ✅ | - | - | ✅ | - |
| Courses: read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Courses: update | ✅ | ✅ | ✅ | - | - | ✅* | - |
| Courses: archive/delete | ✅ | ✅ | - | - | - | - | - |
| Enrollment management | ✅ | ✅ | ✅ | - | - | ✅* | - |
| Teacher assignment | ✅ | ✅ | ✅ | - | - | - | - |

*Teachers only for their assigned courses

### Exam Management

| Operation | Director | Admin | Manager | Finance | Help Desk | Teacher | Student |
|-----------|:--------:|:-----:|:-------:|:-------:|:---------:|:-------:|:-------:|
| Exams: create/update | ✅ | ✅ | ✅ | - | - | ✅ | - |
| Exams: approve questions | ✅ | ✅ | ✅ | - | - | - | - |
| Exams: approve exams | ✅ | ✅ | ✅ | - | - | - | - |
| Exams: grade & publish | ✅ | ✅ | ✅ | - | - | ✅ | - |
| Exams: sit & view results | - | - | - | - | - | - | ✅ |

### Financial Operations

| Operation | Director | Admin | Manager | Finance | Help Desk | Teacher | Student |
|-----------|:--------:|:-----:|:-------:|:-------:|:---------:|:-------:|:-------:|
| Fees: create/update plans | ✅ | - | - | ✅ | - | - | - |
| Fees: read | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| Payments: record/update | ✅ | - | - | ✅ | - | - | - |
| Payments: read/export | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| Salaries: manage | ✅ | - | - | ✅ | - | - | - |
| Salaries: read | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |

### Communications

| Operation | Director | Admin | Manager | Finance | Help Desk | Teacher | Student |
|-----------|:--------:|:-----:|:-------:|:-------:|:---------:|:-------:|:-------:|
| Announcements: create/send | ✅ | ✅ | ✅ | - | ✅ | ✅ | - |
| Announcements: edit/delete | ✅ | ✅ | ✅ | - | ✅ | - | - |
| Announcements: view | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Support tickets: view | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Support tickets: resolve | ✅ | ✅ | ✅ | - | ✅ | - | - |

### System Administration

| Operation | Director | Admin | Manager | Finance | Help Desk | Teacher | Student |
|-----------|:--------:|:-----:|:-------:|:-------:|:---------:|:-------:|:-------:|
| Platform dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | - | - |
| Reports: export | ✅ | ✅ | ✅ | ✅ | - | - | - |
| System settings | ✅ | ✅ | - | - | - | - | - |
| Invitation policy config | ✅ | ✅ | - | - | - | - | - |

---

## Authentication Model

### Invitation-Only Staff

The following roles require invitations:
- System Administrator
- School Administrator
- Manager
- Finance Officer
- Help Desk
- Teacher

**Invitation Flow:**
```
Admin creates invitation → Email sent → User accepts → Google OAuth → Account activated
```

**API Endpoints:**
- `POST /api/invitations` - Issue invitation
- `POST /api/invitations/accept` - Accept and create account

### Universal Student Access

Students authenticate directly via Google OAuth:
- No invitation required
- Automatic student role assignment
- Immediate portal access

---

## Route Permissions

### Configuration

```typescript
// src/config/routes.ts
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // System Admin Portal
  '/system-admin': ['system_administrator'],
  '/system-admin/dashboard': ['system_administrator'],
  '/system-admin/schools': ['system_administrator'],
  '/system-admin/users': ['system_administrator'],
  '/system-admin/settings': ['system_administrator'],

  // School Admin Portal
  '/school-admin': [
    'school_administrator',
    'manager',
    'finance_officer',
    'help_desk'
  ],
  '/school-admin/dashboard': [
    'school_administrator',
    'manager',
    'finance_officer',
    'help_desk'
  ],
  '/school-admin/students': ['school_administrator', 'manager'],
  '/school-admin/teachers': ['school_administrator', 'manager'],
  '/school-admin/finance': ['school_administrator', 'finance_officer'],
  '/school-admin/invoices': ['school_administrator', 'finance_officer'],

  // Teacher Portal
  '/teacher': ['teacher'],
  '/teacher/dashboard': ['teacher'],
  '/teacher/courses': ['teacher'],
  '/teacher/exams': ['teacher'],

  // Student Portal
  '/student': ['student'],
  '/student/dashboard': ['student'],
  '/student/courses': ['student'],
  '/student/exams': ['student'],
};
```

### Default Routes by Role

```typescript
export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'system_administrator':
      return '/system-admin/dashboard';
    case 'school_administrator':
    case 'manager':
    case 'finance_officer':
    case 'help_desk':
      return '/school-admin/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/login';
  }
}
```

---

## Navigation by Role

### System Admin Navigation

```typescript
export const systemAdminNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/system-admin/dashboard', icon: <Home /> },
  { id: 'schools', label: 'Schools', href: '/system-admin/schools', icon: <Building2 /> },
  { id: 'school-admins', label: 'School Admins', href: '/system-admin/school-admins', icon: <UserCog /> },
  { id: 'users', label: 'Users', href: '/system-admin/users', icon: <Users /> },
  { id: 'roles', label: 'Roles & Permissions', href: '/system-admin/roles', icon: <KeyRound /> },
  { id: 'announcements', label: 'Announcements', href: '/system-admin/announcements', icon: <Megaphone /> },
  { id: 'reports', label: 'Reports', href: '/system-admin/reports', icon: <FileText /> },
  { id: 'integrations', label: 'Integrations', href: '/system-admin/integrations', icon: <Plug /> },
  { id: 'audit-logs', label: 'Audit Logs', href: '/system-admin/audit-logs', icon: <ScrollText /> },
  { id: 'settings', label: 'Settings', href: '/system-admin/settings', icon: <Wrench /> },
  { id: 'support', label: 'Support Center', href: '/system-admin/support', icon: <HeadphonesIcon /> },
  { id: 'security', label: 'Security', href: '/system-admin/security', icon: <Shield /> },
  { id: 'health', label: 'System Health', href: '/system-admin/health', icon: <Activity /> },
];
```

### School Admin Navigation

```typescript
export const adminNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/school-admin/dashboard', icon: <Home /> },
  { id: 'students', label: 'Students', href: '/school-admin/students', icon: <Users /> },
  { id: 'teachers', label: 'Teachers', href: '/school-admin/teachers', icon: <UserCog /> },
  { id: 'courses', label: 'Courses', href: '/school-admin/courses', icon: <BookOpen /> },
  { id: 'announcements', label: 'Announcements', href: '/school-admin/announcements', icon: <Megaphone /> },
  { id: 'exams', label: 'Exams', href: '/school-admin/exams', icon: <ClipboardCheck /> },
  { id: 'finance', label: 'Finance', href: '/school-admin/finance', icon: <DollarSign /> },
  { id: 'invoices', label: 'Invoices', href: '/school-admin/invoices', icon: <Receipt /> },
  { id: 'reports', label: 'Reports', href: '/school-admin/reports', icon: <FileText /> },
  { id: 'settings', label: 'Settings', href: '/school-admin/settings', icon: <Settings /> },
];
```

### Teacher Navigation

```typescript
export const teacherNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/teacher/dashboard', icon: <Home /> },
  { id: 'courses', label: 'My Courses', href: '/teacher/courses', icon: <BookOpen /> },
  { id: 'students', label: 'Students', href: '/teacher/students', icon: <Users /> },
  { id: 'exams', label: 'Exams', href: '/teacher/exams', icon: <ClipboardCheck /> },
  { id: 'announcements', label: 'Announcements', href: '/teacher/announcements', icon: <Megaphone /> },
  { id: 'profile', label: 'Profile', href: '/teacher/profile', icon: <User /> },
];
```

### Student Navigation

```typescript
export const studentNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/student/dashboard', icon: <Home /> },
  { id: 'qr-id', label: 'QR Virtual ID', href: '/student/qr-id', icon: <QrCode /> },
  { id: 'grades', label: 'Grades', href: '/student/grades', icon: <FileCheck2 /> },
  { id: 'schedule', label: 'Schedule', href: '/student/schedule', icon: <Calendar /> },
  { id: 'courses', label: 'Courses', href: '/student/courses', icon: <BookOpen /> },
  { id: 'advisor', label: 'Advisor', href: '/student/advisor', icon: <UserCircle /> },
  { id: 'assignments', label: 'Assignments', href: '/student/assignments', icon: <ClipboardList /> },
  { id: 'payments', label: 'Payments', href: '/student/fees', icon: <Receipt /> },
  { id: 'calendar', label: 'Calendar', href: '/student/calendar', icon: <CalendarDays /> },
  { id: 'profile', label: 'Profile', href: '/student/profile', icon: <User /> },
];
```

---

## Implementation Guidelines

### UI Permission Checks

```tsx
// Component-level permission check
function StudentCreateButton() {
  const { user } = useAuthStore();
  const canCreate = ['school_administrator', 'manager'].includes(user?.role);

  if (!canCreate) return null;

  return <Button onClick={handleCreate}>Add Student</Button>;
}
```

### Conditional Rendering

```tsx
// Enable/disable based on role
<Button
  onClick={handleDelete}
  disabled={!['school_administrator'].includes(user?.role)}
  title={!canDelete ? 'School Admin role required' : undefined}
>
  Delete
</Button>
```

### Backend Enforcement

All permission checks must also be enforced:
1. FastAPI endpoint dependencies
2. Supabase RLS policies
3. JWT role claims validation

---

## Auditing

### Recommended Audit Events

| Event | Data Recorded |
|-------|---------------|
| Invitation issued | `performed_by`, `target_role`, `target_email`, `timestamp` |
| Role reassignment | `performed_by`, `target_user`, `old_role`, `new_role` |
| Financial mutation | `performed_by`, `operation`, `amount`, `reference` |
| User suspension | `performed_by`, `target_user`, `reason` |
| System setting change | `performed_by`, `setting_key`, `old_value`, `new_value` |

---

## See Also

- [Frontend Architecture](../02-architecture/frontend.md) - Route protection implementation
- [Workflow & Routing](../02-architecture/workflow.md) - Portal navigation flows
- [API Integration](../02-architecture/api-integration.md) - Backend authorization
