# Component Library

Complete reference for all reusable UI components in the School Management System.

---

## Import Patterns

### Base UI Components

```typescript
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  StatusBadge,
  RoleBadge,
  ActiveStatus,
  DataTable,
  FormSection,
  InfoItem,
  DetailSection
} from '@/components/ui';
```

### Shared Components

```typescript
import {
  PageHeader,
  KpiCard,
  KpiCardsRow,
  IdentityCard,
  AnnouncementPanel,
  ActionItemsCard,
  EmptyState,
  LoadingState
} from '@/components/shared';
```

---

## Base UI Components

### Button

**Location**: `src/components/ui/Button.tsx`

Versatile button with variants, sizes, and loading state.

```tsx
<Button variant="primary" size="md" isLoading={false} onClick={handleClick}>
  Click Me
</Button>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Shows loading spinner |
| `children` | `ReactNode` | required | Button content |

**Variants:**
- `primary` - Blue background, main CTA
- `secondary` - Light blue background
- `outline` - Glass effect with border
- `ghost` - Transparent with hover
- `danger` - Red for destructive actions

---

### Card

**Location**: `src/components/ui/Card.tsx`

Flexible container with optional click handling.

```tsx
<Card padding="md" onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `variant` | `'default' \| 'glass'` | `'default'` | Card style |
| `onClick` | `() => void` | - | Click handler |

---

### Input

**Location**: `src/components/ui/Input.tsx`

Form input with label, error, and hint support. Uses `forwardRef` for React Hook Form.

```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="Enter email..."
  error="Invalid email format"
  hint="We'll never share your email"
  {...register('email')}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label text above input |
| `error` | `string` | Error message (red) |
| `hint` | `string` | Helper text below input |
| `...props` | `InputHTMLAttributes` | Standard input attributes |

---

### Select

**Location**: `src/components/ui/Select.tsx`

Dropdown with options array support.

```tsx
<Select
  label="Department"
  options={[
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
  ]}
  placeholder="Select department..."
  {...register('department')}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label text |
| `options` | `{ value: string; label: string }[]` | Option items |
| `placeholder` | `string` | First disabled option |
| `error` | `string` | Error message |

---

### Badge Components

**Location**: `src/components/ui/Badge.tsx`

#### StatusBadge

Automatic color based on status type.

```tsx
// Student status
<StatusBadge status="active" type="student" />      // Green
<StatusBadge status="graduated" type="student" />   // Blue

// Teacher status
<StatusBadge status="on_leave" type="teacher" />    // Amber

// Employment type
<StatusBadge status="full_time" type="employment" /> // Blue
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `status` | `string` | Status value |
| `type` | `'student' \| 'teacher' \| 'employment'` | Determines colors |
| `size` | `'xs' \| 'sm' \| 'md'` | Badge size |

#### RoleBadge

Role display with appropriate styling.

```tsx
<RoleBadge role="school_administrator" />  // Purple
<RoleBadge role="teacher" />               // Blue
<RoleBadge role="student" />               // Green
```

#### ActiveStatus

Simple active/inactive indicator.

```tsx
<ActiveStatus isActive={true} />  // Green dot + "Active"
<ActiveStatus isActive={false} /> // Gray dot + "Inactive"
```

---

### DataTable

**Location**: `src/components/ui/DataTable.tsx`

Generic table with pagination, search, filtering, and row actions.

```tsx
<DataTable<Student>
  data={students}
  columns={[
    { key: 'name', header: 'Name', render: (s) => s.name },
    { key: 'status', header: 'Status', render: (s) =>
      <StatusBadge status={s.status} type="student" />
    }
  ]}
  keyExtractor={(s) => s.id}
  searchPlaceholder="Search students..."
  searchFilter={(s, term) => s.name.toLowerCase().includes(term)}
  filters={[
    { key: 'status', label: 'Status', options: [
      { value: 'active', label: 'Active' }
    ]}
  ]}
  onView={(s) => navigate(`/students/${s.id}`)}
  onEdit={(s) => navigate(`/students/${s.id}/edit`)}
  onDelete={(s) => handleDelete(s)}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of data items |
| `columns` | `Column<T>[]` | Column definitions |
| `keyExtractor` | `(item: T) => string` | Unique key function |
| `searchFilter` | `(item: T, term: string) => boolean` | Search function |
| `filters` | `Filter[]` | Filter dropdowns |
| `onView` | `(item: T) => void` | View action |
| `onEdit` | `(item: T) => void` | Edit action |
| `onDelete` | `(item: T) => void` | Delete action |

**Column Type:**
```typescript
interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render: (item: T) => ReactNode;
}
```

---

### FormSection

**Location**: `src/components/ui/FormSection.tsx`

Groups form fields with title and description.

```tsx
<FormSection title="Personal Information" description="Basic details">
  <Input label="First Name" />
  <Input label="Last Name" />
</FormSection>
```

### InfoItem

Label-value pair for detail views.

```tsx
<InfoItem label="Email" value={student.email} />
<InfoItem label="Status" value={<StatusBadge status="active" />} />
```

### DetailSection

Groups InfoItems with title.

```tsx
<DetailSection title="Contact Information">
  <InfoItem label="Email" value={user.email} />
  <InfoItem label="Phone" value={user.phone} />
</DetailSection>
```

---

## Shared Components

### PageHeader

**Location**: `src/components/shared/PageHeader.tsx`

Consistent page headers with title, subtitle, actions, and optional back button.

```tsx
// List page
<PageHeader
  title="Students"
  subtitle="Manage student records"
  actions={<Button>Add Student</Button>}
/>

// Detail page with back
<PageHeader
  title="John Doe"
  subtitle="Student Profile"
  showBack
  backUrl="/students"
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title |
| `subtitle` | `string` | Optional subtitle |
| `actions` | `ReactNode` | Action buttons |
| `showBack` | `boolean` | Show back button |
| `backUrl` | `string` | Custom back URL |

---

### KpiCard

**Location**: `src/components/shared/data/KpiCard.tsx`

Dashboard metric cards with optional trend indicator.

```tsx
<KpiCardsRow columns={4}>
  <KpiCard
    icon={Users}
    label="Total Students"
    value={750}
    subtext="This semester"
    color="blue"
    trend={{ direction: 'up', value: '+5.2%', label: 'from last month' }}
    onClick={() => navigate('/students')}
  />
</KpiCardsRow>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `LucideIcon` | Metric icon |
| `label` | `string` | Metric label |
| `value` | `string \| number` | Metric value |
| `subtext` | `string` | Additional context |
| `color` | `'blue' \| 'green' \| 'amber' \| 'red' \| 'purple'` | Color theme |
| `trend` | `{ direction, value, label }` | Trend indicator |
| `onClick` | `() => void` | Click handler |

---

### IdentityCard

**Location**: `src/components/shared/dashboard/IdentityCard.tsx`

Unified Student/Teacher virtual ID card.

```tsx
// Student ID
<IdentityCard
  type="student"
  name="John Doe"
  id="STU-2400001"
  status="Active"
  actionLabel="Show for Attendance"
  onAction={() => {}}
/>

// Teacher ID
<IdentityCard
  type="teacher"
  name="Dr. Jane Smith"
  id="TCH-1001"
  status="Active"
  extraFields={[
    { label: 'Department', value: 'Computer Science' }
  ]}
  officeHours="Mon-Fri 2-4 PM"
  officeLocation="Room 305"
/>
```

---

### AnnouncementPanel

**Location**: `src/components/shared/dashboard/AnnouncementPanel.tsx`

Announcement list with optional tab filtering.

```tsx
<AnnouncementPanel
  items={announcements}
  tabs={[
    { id: 'university', label: 'University', icon: GraduationCap },
    { id: 'course', label: 'My Courses', icon: BookOpen }
  ]}
  filterFn={(item, tab) => item.scope === tab}
  maxItems={5}
  onViewAll={() => navigate('/announcements')}
/>
```

---

### ActionItemsCard

**Location**: `src/components/shared/dashboard/ActionItemsCard.tsx`

Pending tasks, alerts, and approvals.

```tsx
<ActionItemsCard
  title="Action Items"
  subtitle="5 tasks need attention"
  icon={AlertCircle}
  iconColor="red"
  items={[
    {
      id: '1',
      title: 'Grade submissions',
      description: 'CS101 - Final Exam',
      priority: 'high',
      dueDate: 'Tomorrow',
      onClick: () => navigate('/grades')
    }
  ]}
  onViewAll={() => navigate('/tasks')}
/>
```

---

### EmptyState

**Location**: `src/components/shared/feedback/EmptyState.tsx`

Empty state display with optional action.

```tsx
<EmptyState
  icon={<Users className="w-12 h-12" />}
  title="No students found"
  description="Get started by adding your first student"
  action={<Button>Add Student</Button>}
  size="md"
/>
```

**Size variants:** `sm`, `md`, `lg`

---

### LoadingState

**Location**: `src/components/shared/feedback/LoadingState.tsx`

Loading indicators in various formats.

```tsx
// Spinner
<LoadingState variant="spinner" message="Loading..." />

// Skeleton cards
<LoadingState variant="skeleton-cards" count={4} />

// Skeleton table
<LoadingState variant="skeleton-table" rows={5} />

// Full page
<LoadingState variant="page" message="Loading dashboard..." />
```

---

## Layout Components

### Container

**Location**: `src/components/layouts/Container.tsx`

Responsive content container.

```tsx
<Container size="lg" className="py-8">
  {/* Page content */}
</Container>
```

**Sizes:** `sm`, `md`, `lg`, `xl`, `full`

### ProtectedLayout

**Location**: `src/components/layouts/ProtectedLayout.tsx`

Base layout for all protected portals.

```tsx
<ProtectedLayout
  brandSubtitle="Admin Portal"
  navItems={adminNavItems}
  userInfoType="user"
/>
```

---

## Utility Functions

### formatters.ts

```typescript
import {
  fullName,
  getInitials,
  getStudentStatusClasses,
  formatRole,
  formatDate,
  formatCurrency,
  formatPercentage
} from '@/utils/formatters';

fullName({ firstName: 'John', lastName: 'Doe' }) // "John Doe"
getInitials({ firstName: 'John', lastName: 'Doe' }) // "JD"
formatDate('2025-01-15') // "Jan 15, 2025"
formatCurrency(1234.56) // "$1,234.56"
```

### cn Utility

```typescript
import { cn } from '@/utils';

<div className={cn('base-class', isActive && 'active-class', className)} />
```

---

## Styling Guidelines

### Color Palette

| Color | Usage |
|-------|-------|
| Blue (`classivo-blue`) | Primary actions |
| Emerald | Success, active |
| Amber | Warning, pending |
| Red | Error, danger |
| Slate | Neutral, text |

### Status Colors

| Status | Background | Text |
|--------|------------|------|
| Active | `emerald-100` | `emerald-800` |
| On Leave | `amber-100` | `amber-800` |
| Graduated | `blue-100` | `blue-800` |
| Withdrawn | `slate-200` | `slate-700` |

### Spacing

- Section gaps: `space-y-6` or `gap-6`
- Card padding: `p-5` or `p-6`
- Element gaps: `gap-2`, `gap-3`, `gap-4`

---

## See Also

- [UI Patterns](./patterns.md) - Standard usage patterns
- [Component Audit](./component-audit.md) - Extraction roadmap
- [Frontend Architecture](../02-architecture/frontend.md) - Technical details
