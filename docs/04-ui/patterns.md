# UI Patterns Guide

Standard UI patterns and layouts for consistent user experience across all portals.

---

## Page Patterns

### 1. Dashboard Layout

Standard layout for all role dashboards.

```tsx
<div className="w-full">
  {/* Header */}
  <PageHeader
    title={`Welcome back, ${userName}!`}
    subtitle="Your dashboard overview"
    className="mb-8"
  />

  {/* Two-column layout */}
  <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
    {/* Left - ID Card (1 column) */}
    <div className="xl:col-span-1">
      <IdentityCard type="student" {...props} />
    </div>

    {/* Right - Main content (2 columns) */}
    <div className="xl:col-span-2 space-y-8">
      {/* KPI Cards */}
      <KpiCardsRow columns={4}>
        <KpiCard icon={Users} label="Students" value={750} color="blue" />
        <KpiCard icon={BookOpen} label="Courses" value={28} color="green" />
      </KpiCardsRow>

      {/* Primary content */}
      <TodayScheduleCard />

      {/* Secondary content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActionItemsCard {...} />
        <RecentSubmissionsCard {...} />
      </div>

      {/* Announcements */}
      <AnnouncementPanel {...} />
    </div>
  </div>
</div>
```

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│ PageHeader (Welcome + Context)          │
├─────────────────────────────────────────┤
│ ┌─────────┐ ┌───────────────────────┐   │
│ │ ID Card │ │ KPI Cards Row         │   │
│ │  (1/3)  │ │                       │   │
│ └─────────┘ ├───────────────────────┤   │
│             │ Primary Content Card  │   │
│             │ (Schedule/Actions)    │   │
│             ├───────────────────────┤   │
│             │ Secondary Content     │   │
│             │ (Two-column grid)     │   │
│             ├───────────────────────┤   │
│             │ Announcements         │   │
│             └───────────────────────┘   │
└─────────────────────────────────────────┘
```

---

### 2. List Page Layout

Standard layout for data tables with CRUD operations.

```tsx
<div className="space-y-6">
  {/* Page Header with Actions */}
  <PageHeader
    title="Students"
    subtitle="Manage student records and enrollment"
    actions={
      <Button className="gap-2">
        <Plus className="w-4 h-4" />
        Add Student
      </Button>
    }
  />

  {/* Data Table */}
  <DataTable<Student>
    data={students}
    columns={columns}
    keyExtractor={(s) => s.id}
    searchPlaceholder="Search students..."
    searchFilter={searchFilter}
    filters={filters}
    onView={(s) => navigate(`/students/${s.id}`)}
    onEdit={(s) => navigate(`/students/${s.id}/edit`)}
    onDelete={(s) => handleDelete(s)}
    emptyTitle="No students found"
    emptyDescription="Get started by adding your first student"
  />
</div>
```

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│ PageHeader (Title + Add Button)         │
├─────────────────────────────────────────┤
│ FilterToolbar (Search + Filters)        │
├─────────────────────────────────────────┤
│ DataTable                               │
│ ┌─────────────────────────────────────┐ │
│ │ Table Headers                       │ │
│ ├─────────────────────────────────────┤ │
│ │ Table Rows                          │ │
│ ├─────────────────────────────────────┤ │
│ │ Pagination                          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### 3. Detail Page Layout

Standard layout for entity detail views.

```tsx
<div className="space-y-6">
  {/* Header with Back and Actions */}
  <PageHeader
    title="John Doe"
    subtitle="Student Profile"
    showBack
    actions={<Button variant="outline">Edit</Button>}
  />

  {/* Profile Card + Primary Info */}
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <Card className="lg:col-span-1">
      {/* Avatar + Basic Info */}
      <div className="text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
          {getInitials(student)}
        </div>
        <h2 className="mt-4 text-xl font-semibold">{fullName(student)}</h2>
        <p className="text-sm text-gray-500">{student.studentId}</p>
        <StatusBadge status={student.status} type="student" className="mt-2" />
      </div>
    </Card>

    <Card className="lg:col-span-2">
      <DetailSection title="Contact Information">
        <InfoItem label="Email" value={student.email} />
        <InfoItem label="Phone" value={student.phone} />
      </DetailSection>
    </Card>
  </div>

  {/* Additional Sections */}
  <Card>
    <DetailSection title="Enrollment Details">
      <InfoItem label="Grade" value={student.grade} />
      <InfoItem label="Section" value={student.section} />
    </DetailSection>
  </Card>
</div>
```

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│ PageHeader (Back + Title + Actions)     │
├─────────────────────────────────────────┤
│ ┌─────────┐ ┌───────────────────────┐   │
│ │ Profile │ │ Primary Info Section  │   │
│ │  Card   │ │                       │   │
│ └─────────┘ └───────────────────────┘   │
├─────────────────────────────────────────┤
│ Additional Info Sections                │
│ ┌─────────────────────────────────────┐ │
│ │ Section 1                           │ │
│ ├─────────────────────────────────────┤ │
│ │ Section 2                           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### 4. Form Page Layout

Standard layout for create/edit forms.

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  {/* Header */}
  <PageHeader
    title="Create Student"
    subtitle="Add a new student to the system"
    showBack
  />

  {/* Form Sections */}
  <Card>
    <FormSection title="Personal Information" description="Basic student details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" {...register('firstName')} />
        <Input label="Last Name" {...register('lastName')} />
      </div>
      <Input label="Email" type="email" {...register('email')} />
    </FormSection>
  </Card>

  <Card>
    <FormSection title="Enrollment Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Grade" options={grades} {...register('grade')} />
        <Select label="Section" options={sections} {...register('section')} />
      </div>
    </FormSection>
  </Card>

  {/* Form Actions */}
  <div className="flex justify-end gap-4">
    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
      Cancel
    </Button>
    <Button type="submit" isLoading={isSubmitting}>
      Create Student
    </Button>
  </div>
</form>
```

**Visual Structure:**
```
┌─────────────────────────────────────────┐
│ PageHeader (Create/Edit + Entity)       │
├─────────────────────────────────────────┤
│ Form                                    │
│ ┌─────────────────────────────────────┐ │
│ │ FormSection: Personal Info          │ │
│ ├─────────────────────────────────────┤ │
│ │ FormSection: Enrollment             │ │
│ ├─────────────────────────────────────┤ │
│ │ FormSection: Additional             │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Form Actions (Cancel + Submit)          │
└─────────────────────────────────────────┘
```

---

## Component Patterns

### KPI Card Pattern

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
  <KpiCard
    icon={DollarSign}
    label="Revenue"
    value="$125,000"
    color="green"
    trend={{ direction: 'up', value: '+4.2%' }}
  />
  <KpiCard
    icon={Calendar}
    label="Attendance"
    value="92.5%"
    color="amber"
    trend={{ direction: 'down', value: '-1.3%' }}
  />
  <KpiCard
    icon={CheckCircle2}
    label="Active Courses"
    value={28}
    color="emerald"
    subtext="this term"
  />
</KpiCardsRow>
```

**Color Guidelines:**
- `blue` - Primary metrics, navigation
- `green` / `emerald` - Positive, success, active
- `amber` - Warning, pending, attention
- `purple` - Special metrics (exams, etc.)
- `red` - Critical, errors, urgent
- `gray` - Neutral, inactive

---

### Empty State Pattern

```tsx
<EmptyState
  icon={<Users className="w-12 h-12" />}
  title="No students found"
  description="Get started by adding your first student to the system"
  action={<Button>Add Student</Button>}
/>
```

**Size Variants:**
- `sm` - For inline/small containers (card sections)
- `md` - Default, for tables/lists
- `lg` - For full page empty states

---

### Loading State Pattern

```tsx
// Inline spinner
<LoadingState variant="spinner" message="Loading..." />

// Skeleton cards (for dashboard grids)
<LoadingState variant="skeleton-cards" count={4} />

// Skeleton table (for data tables)
<LoadingState variant="skeleton-table" rows={5} />

// Full page loading
<LoadingState variant="page" message="Loading dashboard..." />
```

---

### Status Badge Pattern

```tsx
// Entity status
<StatusBadge status="active" type="student" />
<StatusBadge status="on_leave" type="teacher" />
<StatusBadge status="full_time" type="employment" />

// Role badge
<RoleBadge role="school_administrator" />

// Active indicator
<ActiveStatus isActive={true} />
```

---

## Action Patterns

### Primary Actions (Page Header)

```tsx
// Create/Add - Blue primary button
<Button className="gap-2">
  <Plus className="w-4 h-4" />
  Add Student
</Button>

// Export/Download - Outline button
<Button variant="outline" className="gap-2">
  <Download className="w-4 h-4" />
  Export CSV
</Button>
```

### Row Actions (DataTable)

Consistent order: View → Edit → Delete

```tsx
<DataTable
  onView={(item) => navigate(`/entity/${item.id}`)}
  onEdit={(item) => navigate(`/entity/${item.id}/edit`)}
  onDelete={(item) => handleDelete(item)}
/>
```

Icons used:
- View: `Eye` (violet)
- Edit: `Pencil` (blue)
- Delete: `Trash2` (red)

### Destructive Actions

Always use confirmation:
```tsx
const handleDelete = (item) => {
  if (confirm('Are you sure you want to delete this item?')) {
    deleteItem(item.id);
  }
};
```

---

## Styling Rules

### Typography

| Element | Classes |
|---------|---------|
| Page title | `text-2xl font-bold` or `text-3xl font-bold` |
| Section title | `text-base font-semibold` or `text-lg font-semibold` |
| Labels | `text-sm font-medium text-gray-600` |
| Body | `text-sm text-gray-600` |
| Small text | `text-xs text-gray-500` |

### Spacing

| Context | Classes |
|---------|---------|
| Section gaps | `space-y-6` or `gap-6` |
| Card padding | `p-5` or `p-6` |
| Element gaps | `gap-2`, `gap-3`, `gap-4` |
| Form fields | `gap-4` between fields |

### Border Radius

| Element | Classes |
|---------|---------|
| Cards | `rounded-lg` or `rounded-2xl` |
| Buttons | `rounded-lg` or `rounded-xl` |
| Badges | `rounded-full` |
| Icon containers | `rounded-xl` |

### Shadows

| State | Classes |
|-------|---------|
| Default | `shadow-sm` |
| Hover | `hover:shadow-md` |
| Elevated | `shadow-lg` |

### Colors

| Usage | Classes |
|-------|---------|
| Primary actions | `bg-blue-600 hover:bg-blue-700` |
| Success | `bg-emerald-600` or `text-emerald-700` |
| Warning | `bg-amber-600` or `text-amber-700` |
| Danger | `bg-red-600` or `text-red-700` |

---

## Responsive Breakpoints

```
sm:  640px  - Mobile landscape
md:  768px  - Tablets
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large
```

**Common Patterns:**
```tsx
// Grid columns by breakpoint
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Sidebar layout
<div className="grid grid-cols-1 xl:grid-cols-3">
  <div className="xl:col-span-1">Sidebar</div>
  <div className="xl:col-span-2">Content</div>
</div>
```

---

## See Also

- [Component Library](./component-library.md) - Component reference
- [Component Audit](./component-audit.md) - Extraction roadmap
- [Frontend Architecture](../02-architecture/frontend.md) - Technical details
