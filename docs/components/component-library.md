# Component Library Documentation

## Overview

This document describes the reusable component library used throughout the School Management System. All components are built with TypeScript, Tailwind CSS, and follow consistent design patterns.

## Base UI Components

All base UI components are exported from `@/components/ui` via the centralized `index.ts` file:

```typescript
import { Button, Card, Input, Select, DataTable, StatusBadge } from '@/components/ui';
```

---

### Button

**Location**: `src/components/ui/Button.tsx`

A versatile button component with multiple variants, sizes, and loading state.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" isLoading={false} onClick={handleClick}>
  Click Me
</Button>
```

**Props** (`ButtonProps`):
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'default'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Shows loading spinner |
| `children` | `ReactNode` | required | Button content |
| `...props` | `ButtonHTMLAttributes` | - | All standard button attributes |

**Variant Styles**:
- `primary`: Blue background with shadow, hover lift effect
- `secondary`: Light blue background
- `outline`: Glass effect with border
- `ghost`: Transparent with hover background
- `danger`: Red background for destructive actions

---

### Card

**Location**: `src/components/ui/Card.tsx`

A flexible container component for content sections with optional click handling.

```tsx
import { Card } from '@/components/ui';

<Card padding="md" className="hover:shadow-lg" onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `() => void` | - | Click handler (adds cursor-pointer) |
| `children` | `ReactNode` | required | Card content |

---

### Input

**Location**: `src/components/ui/Input.tsx`

A form input wrapper with label, error, and hint support. Uses `forwardRef` for React Hook Form compatibility.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email Address"
  type="email"
  placeholder="Enter email..."
  error="Invalid email format"
  hint="We'll never share your email"
  {...register('email')}
/>
```

**Props** (`InputProps`):
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text above input |
| `error` | `string` | - | Error message (shows in red) |
| `hint` | `string` | - | Helper text below input |
| `...props` | `InputHTMLAttributes` | - | All standard input attributes |

---

### Select

**Location**: `src/components/ui/Select.tsx`

A form select wrapper with options array support. Uses `forwardRef` for React Hook Form compatibility.

```tsx
import { Select } from '@/components/ui';

<Select
  label="Department"
  options={[
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
  ]}
  placeholder="Select department..."
  error={errors.department?.message}
  {...register('department')}
/>
```

**Props** (`SelectProps`):
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text above select |
| `options` | `SelectOption[]` | required | Array of { value, label } |
| `placeholder` | `string` | - | First disabled option text |
| `error` | `string` | - | Error message |
| `...props` | `SelectHTMLAttributes` | - | All standard select attributes |

**SelectOption Type**:
```typescript
interface SelectOption {
  value: string;
  label: string;
}
```

---

### Badge Components

**Location**: `src/components/ui/Badge.tsx`

Unified badge system for status and role display.

#### Badge (Base)
```tsx
import { Badge } from '@/components/ui';

<Badge size="sm" className="bg-blue-100 text-blue-800">
  Custom Badge
</Badge>
```

#### StatusBadge
Automatically applies correct colors based on status type.

```tsx
import { StatusBadge } from '@/components/ui';

// Student status
<StatusBadge status="active" type="student" />      // Green
<StatusBadge status="graduated" type="student" />   // Blue
<StatusBadge status="transferred" type="student" /> // Yellow
<StatusBadge status="withdrawn" type="student" />   // Gray

// Teacher status
<StatusBadge status="active" type="teacher" />      // Green
<StatusBadge status="on_leave" type="teacher" />    // Amber
<StatusBadge status="resigned" type="teacher" />    // Gray

// Employment type
<StatusBadge status="full_time" type="employment" />  // Blue
<StatusBadge status="part_time" type="employment" />  // Purple
<StatusBadge status="visiting" type="employment" />   // Indigo
```

**Props** (`StatusBadgeProps`):
| Prop | Type | Description |
|------|------|-------------|
| `status` | `string` | Status value |
| `type` | `'student' \| 'teacher' \| 'employment'` | Determines color scheme |
| `size` | `'xs' \| 'sm' \| 'md'` | Badge size (default: 'sm') |

#### RoleBadge
Displays user role with appropriate styling.

```tsx
import { RoleBadge } from '@/components/ui';

<RoleBadge role="system_administrator" />   // Red
<RoleBadge role="school_administrator" />   // Purple
<RoleBadge role="manager" />                // Orange
<RoleBadge role="finance_officer" />        // Yellow
<RoleBadge role="teacher" />                // Blue
<RoleBadge role="student" />                // Green
```

#### ActiveStatus
Simple active/inactive indicator with dot.

```tsx
import { ActiveStatus } from '@/components/ui';

<ActiveStatus isActive={true} />  // Green dot + "Active"
<ActiveStatus isActive={false} /> // Gray dot + "Inactive"
```

---

### DataTable

**Location**: `src/components/ui/DataTable.tsx`

A powerful generic data table component with built-in pagination, search, filtering, and row actions.

```tsx
import { DataTable, Column, Filter } from '@/components/ui';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  enrollment: { status: string };
}

const columns: Column<Student>[] = [
  {
    key: 'name',
    header: 'Student Name',
    width: '30%',
    render: (s) => `${s.firstName} ${s.lastName}`,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    render: (s) => <StatusBadge status={s.enrollment.status} type="student" />,
  },
];

const filters: Filter[] = [
  {
    key: 'enrollment.status',  // Supports dot notation
    label: 'All Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'graduated', label: 'Graduated' },
    ],
  },
];

<DataTable<Student>
  data={students}
  columns={columns}
  keyExtractor={(s) => s.id}
  searchPlaceholder="Search students..."
  searchFilter={(student, term) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(term)
  }
  filters={filters}
  entityName="students"
  onView={(student) => navigate(`/students/${student.id}`)}
  onEdit={(student) => navigate(`/students/${student.id}/edit`)}
  onDelete={(student) => handleDelete(student)}
  onRowClick={(student) => navigate(`/students/${student.id}`)}
  emptyTitle="No students found"
  emptyDescription="Try adjusting your search"
/>
```

**Props** (`DataTableProps<T>`):
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | required | Array of data items |
| `columns` | `Column<T>[]` | required | Column definitions |
| `keyExtractor` | `(item: T) => string` | required | Unique key function |
| `searchPlaceholder` | `string` | - | Search input placeholder |
| `searchFilter` | `(item: T, term: string) => boolean` | - | Custom search function |
| `filters` | `Filter[]` | - | Filter dropdown definitions |
| `entityName` | `string` | `'items'` | Name for count display |
| `onView` | `(item: T) => void` | - | View action handler |
| `onEdit` | `(item: T) => void` | - | Edit action handler |
| `onDelete` | `(item: T) => void` | - | Delete action handler |
| `onRowClick` | `(item: T) => void` | - | Row click handler |
| `emptyTitle` | `string` | - | Empty state title |
| `emptyDescription` | `string` | - | Empty state description |

**Column Type**:
```typescript
interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render: (item: T) => ReactNode;
}
```

**Filter Type**:
```typescript
interface Filter {
  key: string;           // Object path (e.g., 'enrollment.status')
  label: string;         // Dropdown label when no selection
  options: FilterOption[];
}

interface FilterOption {
  value: string;
  label: string;
}
```

**Features**:
- Pagination with 10/25/50/100 items per page
- Search with custom filter function
- Multi-column filtering with dot notation for nested objects
- Action icons (Eye, Pencil, Trash2 from lucide-react)
- Row click navigation
- Empty state with customizable message
- Responsive design

---

### FormSection

**Location**: `src/components/ui/FormSection.tsx`

Layout components for forms and detail views.

#### FormSection
Groups form fields with a title and optional description.

```tsx
import { FormSection } from '@/components/ui';

<FormSection title="Personal Information" description="Basic student details">
  <div className="grid grid-cols-2 gap-4">
    <Input label="First Name" {...register('firstName')} />
    <Input label="Last Name" {...register('lastName')} />
  </div>
</FormSection>
```

**Props** (`FormSectionProps`):
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Section heading |
| `description` | `string` | Optional subheading |
| `children` | `ReactNode` | Form fields |

#### InfoItem
Displays a label-value pair for detail views.

```tsx
import { InfoItem } from '@/components/ui';

<InfoItem label="Email" value={student.email} />
<InfoItem label="Status" value={<StatusBadge status="active" type="student" />} />
```

**Props** (`InfoItemProps`):
| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Field label |
| `value` | `ReactNode` | Field value (string or component) |

#### DetailSection
Groups InfoItems with a section title.

```tsx
import { DetailSection, InfoItem } from '@/components/ui';

<DetailSection title="Contact Information">
  <InfoItem label="Email" value={student.email} />
  <InfoItem label="Phone" value={student.phone} />
  <InfoItem label="Address" value={student.address} />
</DetailSection>
```

**Props** (`DetailSectionProps`):
| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Section heading |
| `children` | `ReactNode` | InfoItem components |

---

## Layout Components

### Container

**Location**: `src/components/layouts/Container.tsx`

A responsive container that centers content with consistent max-width.

```tsx
import { Container } from '@/components/layouts/Container';

<Container size="lg" className="py-8">
  <h1>Page Title</h1>
</Container>
```

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Max width |
| `className` | `string` | - | Additional classes |

### ProtectedLayout

**Location**: `src/components/layouts/ProtectedLayout.tsx`

Unified layout wrapper for all protected portals. Handles sidebar, navigation, and content structure.

```tsx
import ProtectedLayout from '@/components/layouts/ProtectedLayout';

<ProtectedLayout
  brandSubtitle="Admin Portal"
  navItems={adminNavItems}
  userInfoType="user"
/>
```

**Props** (`ProtectedLayoutProps`):
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `brandSubtitle` | `string` | required | Portal name in sidebar |
| `navItems` | `NavItem[]` | required | Navigation items |
| `userInfoType` | `'user' \| 'student'` | `'user'` | User card type |
| `studentInfo` | `Omit<StudentInfo, 'name'>` | - | Student-specific info |

### Portal Layouts

Each portal has a thin wrapper that configures `ProtectedLayout`:

#### AdminLayout
**Location**: `src/components/layouts/AdminLayout.tsx`

Admin portal with role-based navigation (switches between admin and director nav items).

```tsx
// AdminLayout.tsx (20 lines)
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

#### StudentLayout
**Location**: `src/components/layouts/StudentLayout.tsx`

Student portal with student info card.

```tsx
// StudentLayout.tsx (19 lines)
export default function StudentLayout() {
  return (
    <ProtectedLayout
      brandSubtitle="Student Portal"
      navItems={studentNavItems}
      userInfoType="student"
      studentInfo={{
        department: 'Computer Science',
        faculty: 'Science and Technology',
        studentId: 'STU-2400001',
        gpa: 3.85,
        credits: 115,
      }}
    />
  );
}
```

#### TeacherLayout
**Location**: `src/components/layouts/TeacherLayout.tsx`

Teacher portal layout.

```tsx
// TeacherLayout.tsx (12 lines)
export default function TeacherLayout() {
  return (
    <ProtectedLayout
      brandSubtitle="Teacher Portal"
      navItems={teacherNavItems}
      userInfoType="user"
    />
  );
}
```

---

## Shared Components

### ProtectedRoute

**Location**: `src/components/shared/ProtectedRoute.tsx`

HOC that protects routes based on user roles and authentication status.

```tsx
import ProtectedRoute from '@/components/shared/ProtectedRoute';

<ProtectedRoute allowedRoles={['school_administrator', 'manager']}>
  <AdminLayout />
</ProtectedRoute>
```

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `allowedRoles` | `UserRole[]` | Roles that can access |
| `children` | `ReactNode` | Protected content |

**Behavior**:
- Unauthenticated users → redirect to `/login`
- Authenticated but wrong role → redirect to `getDefaultRoute(role)`
- Authorized users → render children

### Sidebar

**Location**: `src/components/shared/Sidebar.tsx`

Navigation sidebar with branding, user info card, and navigation items.

```tsx
import Sidebar, { NavItem, UserInfo, StudentInfo } from '@/components/shared/Sidebar';

<Sidebar
  brandName="Classivo"
  brandSubtitle="Admin Portal"
  user={userInfo}
  studentInfo={studentInfo}  // For student portal only
  items={navItems}
  onSignOut={handleLogout}
/>
```

**NavItem Type**:
```typescript
interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  section: 'primary' | 'secondary';
}
```

---

## Utility Functions

### Formatters (`src/utils/formatters.ts`)

All formatting utilities are consolidated in this file:

```typescript
import {
  fullName,
  getInitials,
  getStudentStatusClasses,
  getStudentStatusLabel,
  getTeacherStatusClasses,
  getTeacherStatusLabel,
  getEmploymentTypeClasses,
  getEmploymentTypeLabel,
  getRoleBadgeClasses,
  formatRole,
  formatDate,
  formatDateTime,
  formatCurrency,
  formatPercentage,
  capitalize,
  truncate,
} from '@/utils/formatters';
```

**Name Formatting**:
```typescript
fullName({ firstName: 'John', lastName: 'Doe' }); // "John Doe"
getInitials({ firstName: 'John', lastName: 'Doe' }); // "JD"
```

**Status Formatting**:
```typescript
getStudentStatusClasses('active'); // "bg-emerald-100 text-emerald-800"
getStudentStatusLabel('active');   // "Active"
getTeacherStatusClasses('on_leave'); // "bg-amber-100 text-amber-800"
formatRole('school_administrator'); // "School Admin"
```

**Date/Number Formatting**:
```typescript
formatDate('2025-01-15');      // "Jan 15, 2025"
formatDateTime('2025-01-15T10:30:00'); // "Jan 15, 2025, 10:30 AM"
formatCurrency(1234.56);       // "$1,234.56"
formatPercentage(85.5);        // "85.5%"
```

### Class Name Utility (`src/utils/index.ts`)

```typescript
import { cn } from '@/utils';

// Merge Tailwind classes with clsx
<div className={cn('base-class', isActive && 'active-class', className)} />
```

---

## Design Principles

### 1. Consistency
- All components follow the same naming conventions
- Consistent prop interfaces across similar components
- Uniform styling patterns using Tailwind

### 2. Type Safety
- Full TypeScript support with exported types
- Generic components where applicable (`DataTable<T>`)
- Proper prop typing with interfaces

### 3. Accessibility
- ARIA attributes where needed
- Keyboard navigation support
- Semantic HTML elements

### 4. Performance
- `forwardRef` for input components (React Hook Form compatibility)
- Minimal re-renders with proper hooks
- Efficient styling with Tailwind utility classes

### 5. Customization
- `className` prop for style extension on all components
- Flexible render props in DataTable columns
- Composable layout components

---

## Styling Guidelines

### Color Palette
- **Primary**: Blue (classivo-blue)
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Slate grays

### Status Colors
| Status | Background | Text |
|--------|------------|------|
| Active | emerald-100 | emerald-800 |
| On Leave | amber-100 | amber-800 |
| Graduated | blue-100 | blue-800 |
| Transferred | yellow-100 | yellow-800 |
| Withdrawn/Resigned | slate-200 | slate-700 |

### Role Colors
| Role | Background | Text |
|------|------------|------|
| System Admin | red-100/50 | red-700 |
| School Admin | purple-100/50 | purple-700 |
| Manager | orange-100/50 | orange-700 |
| Finance Officer | yellow-100/50 | yellow-700 |
| Teacher | blue-100/50 | blue-700 |
| Student | green-100/50 | green-700 |

### Spacing Scale
- Consistent use of Tailwind spacing (p-2, p-4, p-6, etc.)
- Form sections use gap-6 between fields
- Cards use p-4 to p-6 padding

---

## Usage Examples

### Creating a List Page

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { fullName, getInitials } from '@/utils/formatters';
import { Plus } from 'lucide-react';

export default function StudentList() {
  const [students] = useState<Student[]>(() => loadStudents());
  const navigate = useNavigate();

  const columns: Column<Student>[] = [
    {
      key: 'student',
      header: 'Student',
      width: '30%',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
            {getInitials(s)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{fullName(s)}</p>
            <p className="text-xs text-gray-500">{s.studentId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (s) => <StatusBadge status={s.enrollment.status} type="student" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Students Management</h1>
          <p className="text-sm text-muted-foreground">Manage student information.</p>
        </div>
        <Button onClick={() => navigate('/school-admin/students/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>
      <DataTable
        data={students}
        columns={columns}
        keyExtractor={(s) => s.id}
        searchPlaceholder="Search students..."
        onView={(s) => navigate(`/school-admin/students/${s.id}`)}
        onEdit={(s) => navigate(`/school-admin/students/${s.id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

### Creating a Form Page

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormSection } from '@/components/ui/FormSection';
import { Card } from '@/components/ui/Card';

export default function StudentCreate() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(studentSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <FormSection title="Personal Information" description="Basic student details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <Input
            label="Email"
            type="email"
            placeholder="student@school.edu"
            error={errors.email?.message}
            {...register('email')}
          />
        </FormSection>
      </Card>

      <Card>
        <FormSection title="Enrollment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Grade"
              options={gradeOptions}
              placeholder="Select grade"
              {...register('grade')}
            />
            <Select
              label="Section"
              options={sectionOptions}
              placeholder="Select section"
              {...register('section')}
            />
          </div>
        </FormSection>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit">Create Student</Button>
      </div>
    </form>
  );
}
```

### Creating a Detail Page

```tsx
import { Card } from '@/components/ui/Card';
import { DetailSection, InfoItem } from '@/components/ui/FormSection';
import { StatusBadge } from '@/components/ui/Badge';
import { fullName, formatDate } from '@/utils/formatters';

export default function StudentDetail() {
  return (
    <div className="space-y-6">
      <Card>
        <DetailSection title="Personal Information">
          <InfoItem label="Full Name" value={fullName(student)} />
          <InfoItem label="Email" value={student.email} />
          <InfoItem label="Phone" value={student.phone || '-'} />
          <InfoItem label="Date of Birth" value={formatDate(student.dateOfBirth)} />
        </DetailSection>
      </Card>

      <Card>
        <DetailSection title="Enrollment">
          <InfoItem label="Student ID" value={student.studentId} />
          <InfoItem label="Grade" value={student.enrollment.grade} />
          <InfoItem label="Section" value={student.enrollment.section} />
          <InfoItem
            label="Status"
            value={<StatusBadge status={student.enrollment.status} type="student" />}
          />
        </DetailSection>
      </Card>

      <Card>
        <DetailSection title="Academic Performance">
          <InfoItem label="GPA" value={student.academics.gpa.toFixed(2)} />
          <InfoItem label="Credits Completed" value={student.academics.creditsCompleted} />
          <InfoItem label="Attendance" value={`${student.academics.attendance}%`} />
        </DetailSection>
      </Card>
    </div>
  );
}
```
