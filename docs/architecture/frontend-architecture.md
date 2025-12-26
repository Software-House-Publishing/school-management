# School Management System - Frontend Architecture

## Overview

This document outlines the frontend architecture for the School Management System (Classivo), a comprehensive multi-tenant platform designed for educational institutions including private schools, public schools, universities, private tuitions, language schools, and other teaching providers.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: react-i18next
- **UI Components**: Custom component library with Lucide React icons
- **Notifications**: Sonner (toast notifications)
- **Charts**: Recharts for data visualization
- **Authentication**: Mock authentication (Supabase Auth ready)

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components
│   │   ├── Badge.tsx        # StatusBadge, RoleBadge, ActiveStatus
│   │   ├── Button.tsx       # Button with variants and loading state
│   │   ├── Card.tsx         # Card container component
│   │   ├── DataTable.tsx    # Generic data table with pagination, search, filters
│   │   ├── FormSection.tsx  # FormSection, InfoItem, DetailSection
│   │   ├── Input.tsx        # Input wrapper with label/error support
│   │   ├── Select.tsx       # Select wrapper with options array
│   │   └── index.ts         # Centralized exports
│   ├── layouts/             # Layout components
│   │   ├── AdminLayout.tsx      # Admin portal wrapper (uses ProtectedLayout)
│   │   ├── AuthLayout.tsx       # Authentication page layout
│   │   ├── Container.tsx        # Responsive content container
│   │   ├── ProtectedLayout.tsx  # Unified protected route layout
│   │   ├── SchoolFooter.tsx     # School public page footer
│   │   ├── SchoolHeader.tsx     # School public page header
│   │   ├── StudentLayout.tsx    # Student portal wrapper (uses ProtectedLayout)
│   │   ├── SystemFooter.tsx     # System public page footer
│   │   ├── SystemHeader.tsx     # System public page header
│   │   └── TeacherLayout.tsx    # Teacher portal wrapper (uses ProtectedLayout)
│   └── shared/              # Shared components across portals
│       ├── ProtectedRoute.tsx   # Route guard with role-based access
│       └── Sidebar.tsx          # Navigation sidebar component
├── pages/                   # Page components organized by portal
│   ├── system/              # System provider pages (platform owner)
│   │   ├── home/            # Landing page
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── pricing/         # Pricing page
│   │   ├── terms/           # Terms of service
│   │   ├── privacy/         # Privacy policy
│   │   ├── help/            # Help center
│   │   ├── docs/            # Documentation
│   │   ├── status/          # System status
│   │   ├── careers/         # Careers page
│   │   ├── press/           # Press releases
│   │   ├── community/       # Community page
│   │   ├── gdpr/            # GDPR compliance
│   │   ├── cookies/         # Cookie policy
│   │   └── auth/            # Login, Register, ForgotPassword
│   ├── school-public/       # School tenant public pages
│   │   ├── home/            # School landing page
│   │   ├── about/           # School about page
│   │   ├── contact/         # School contact page
│   │   ├── pricing/         # School pricing page
│   │   ├── rules/           # School rules page
│   │   └── auth/            # School-branded login
│   ├── admin/               # School admin portal pages
│   │   ├── dashboard/       # AdminDashboard
│   │   ├── students/        # StudentList, StudentCreate, StudentDetail, StudentEdit
│   │   ├── teachers/        # TeacherList, TeacherCreate, TeacherDetail, TeacherEdit
│   │   ├── users/           # AdminUsers, UserCreate, UserDetail, UserEdit
│   │   ├── courses/         # AdminCourses
│   │   ├── exams/           # AdminExams
│   │   ├── finance/         # AdminFinance
│   │   ├── invoices/        # AdminInvoices
│   │   ├── reports/         # AdminReports
│   │   ├── announcement/    # AdminAnnouncement
│   │   └── settings/        # AdminSettings
│   ├── system-admin/        # System admin portal (platform owner)
│   │   └── dashboard/       # SystemDashboard
│   ├── student/             # Student portal pages
│   │   ├── dashboard/       # StudentDashboard
│   │   ├── courses/         # StudentCourses
│   │   ├── grades/          # StudentGrades
│   │   ├── schedule/        # StudentSchedule
│   │   ├── calendar/        # StudentCalendar
│   │   ├── assignments/     # StudentAssignments
│   │   ├── advisor/         # StudentAdvisor
│   │   ├── exams/           # StudentExams
│   │   ├── fees/            # StudentFees
│   │   ├── qr-id/           # StudentQRId (virtual ID card)
│   │   └── profile/         # StudentProfile
│   └── teacher/             # Teacher portal pages
│       ├── dashboard/       # TeacherDashboard
│       ├── courses/         # TeacherCourses
│       ├── students/        # TeacherStudents
│       ├── exams/           # TeacherExams
│       └── announcements/   # TeacherAnnouncements
├── stores/                  # Zustand state management
│   └── authStore.ts         # Authentication state
├── config/                  # Configuration files
│   ├── navigation.tsx       # Navigation items per role
│   └── routes.ts            # Route permissions and access control
├── types/                   # TypeScript type definitions
│   └── auth.ts              # User, Role, Authentication types
├── utils/                   # Utility functions
│   ├── index.ts             # Re-exports + cn, generateId, debounce
│   └── formatters.ts        # fullName, getInitials, status/role formatters
├── i18n/                    # Internationalization
│   ├── locales/             # Translation files
│   │   ├── en.json          # English translations
│   │   └── my.json          # Burmese translations
│   └── index.ts             # i18n configuration
└── lib/                     # External library wrappers
    └── utils.ts             # Tailwind merge utility (cn)
```

## Component Architecture

### Unified Layout System

All protected portals use `ProtectedLayout` as the base component:

```tsx
// AdminLayout.tsx - 20 lines (reduced from 55)
export default function AdminLayout() {
  const { user } = useAuthStore();
  const navItems = user?.role === 'system_administrator'
    ? directorNavItems
    : adminNavItems;

  return (
    <ProtectedLayout
      brandSubtitle="Admin Portal"
      navItems={navItems}
      userInfoType="user"
    />
  );
}
```

### Reusable DataTable Component

Generic table component with built-in features:
- Pagination with configurable page sizes
- Search with custom filter functions
- Multi-column filtering
- Row actions (view, edit, delete)
- Row click handling
- Empty state handling

```tsx
<DataTable<Student>
  data={students}
  columns={columns}
  keyExtractor={(s) => s.id}
  searchFilter={searchFilter}
  filters={filters}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Status Badge System

Unified badge components for consistent status display:

```tsx
// Student status badge
<StatusBadge status={student.enrollment.status} type="student" />

// Teacher status badge
<StatusBadge status={teacher.status} type="teacher" />

// Employment type badge
<StatusBadge status={teacher.employment.type} type="employment" />

// User role badge
<RoleBadge role={user.role} />
```

## Multi-Layered Architecture

### 1. Presentation Layer
- **Components**: Reusable UI components with consistent styling
- **Pages**: Route-specific page components
- **Layouts**: Portal-specific layout wrappers using ProtectedLayout

### 2. Business Logic Layer
- **Hooks**: Custom hooks for business logic and state management
- **Stores**: Zustand stores for global state management
- **Utils**: Consolidated helper functions (formatters.ts)

### 3. Data Access Layer
- **Types**: Strong TypeScript typing throughout
- **Validation**: Zod schemas for runtime validation
- **Mock Data**: LocalStorage-based data persistence for demo

## Portal Architecture

### System Provider Portal
- Platform landing and marketing pages
- System administrator dashboard
- User management across schools

### School Public Portal (per tenant)
- School-branded landing pages
- About, Contact, Pricing, Rules pages
- School-branded login

### School Admin Portal
- Dashboard with key metrics and quick actions
- Student management (CRUD operations)
- Teacher management (CRUD operations)
- Course, exam, finance, and reporting modules

### Student Portal
- Personal dashboard with academic overview
- Course enrollment and progress tracking
- Grade viewing and schedule management
- QR virtual ID card
- Fee payment history

### Teacher Portal
- Teaching dashboard with class overview
- Course content management
- Student progress monitoring
- Exam creation and grading

## Role-Based Access Control (RBAC)

### Roles Hierarchy
- **System Administrator**: Platform-wide access
- **School Administrator**: School-level management
- **Manager**: Academic operations
- **Finance Officer**: Financial operations
- **Teacher**: Course and student management
- **Student**: Learning portal access

### Route Protection
```tsx
<ProtectedRoute allowedRoles={['school_administrator', 'manager']}>
  <AdminLayout />
</ProtectedRoute>
```

### Navigation by Role
- `adminNavItems`: School admin/manager navigation
- `directorNavItems`: System admin navigation
- `teacherNavItems`: Teacher navigation
- `studentNavItems`: Student navigation

## State Management Strategy

### Global State (Zustand)
- Authentication state (user, token, isAuthenticated)
- Persisted to localStorage under `auth-storage`

### Local State (React useState)
- Form data and validation
- UI component state
- List data with localStorage persistence

### Mock Data Layer
- Student data: `loadStudents()`, `saveStudents()`
- Teacher data: `loadTeachers()`, `saveTeachers()`
- Stored in localStorage for demo purposes

## Utility Functions

### Consolidated in `utils/formatters.ts`

```typescript
// Name formatting
fullName({ firstName, lastName })  // "John Doe"
getInitials({ firstName, lastName }) // "JD"

// Status classes and labels
getStudentStatusClasses(status)  // "bg-emerald-100 text-emerald-800"
getStudentStatusLabel(status)    // "Active"
getTeacherStatusClasses(status)
getTeacherStatusLabel(status)
getEmploymentTypeClasses(type)
getEmploymentTypeLabel(type)
getRoleBadgeClasses(role)
formatRole(role)                 // "School Admin"

// Date/Number formatting
formatDate(date)                 // "Dec 26, 2025"
formatDateTime(date)             // "Dec 26, 2025, 10:30 AM"
formatCurrency(amount)           // "$1,234.56"
formatPercentage(value)          // "85.5%"

// String utilities
capitalize(str)
truncate(str, maxLength)
```

## Performance Optimization

### Code Splitting
- Route-based code splitting with React.lazy
- Dynamic imports for heavy components

### Component Optimization
- Memoization with useMemo for computed values
- Efficient re-renders with proper key usage

### Bundle Optimization
- Tree shaking with Vite
- Centralized component exports via index.ts
- Consolidated utilities to reduce duplication

## Security Considerations

### Authentication
- Mock authentication for demo
- JWT token structure ready for Supabase integration
- Session persistence in localStorage

### Authorization
- Role-based route protection
- Route-level access control
- Dynamic navigation based on role

### Data Protection
- Input validation with Zod schemas
- XSS prevention through React's built-in escaping

## Development Workflow

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Consistent component patterns

### Build Process
- Vite development server with HMR
- TypeScript compilation
- Production optimization with minification

## Future Enhancements

### Planned Features
- Backend API integration (Supabase/FastAPI)
- Real-time notifications
- Advanced analytics dashboard
- Mobile-responsive PWA
- Offline functionality

### Scalability Considerations
- Component library ready for extraction
- Modular architecture for feature additions
- Type-safe data layer for API migration
