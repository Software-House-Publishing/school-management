# Component Audit Report

Audit of UI component duplication and extraction roadmap for the School Management System.

---

## Executive Summary

This audit identifies duplicated UI patterns across the codebase and provides a prioritized extraction roadmap for creating reusable shared components.

**Key Findings:**
- 8 high-priority components identified for extraction
- 4 dashboards share ~60% duplicated patterns
- Significant code reduction possible (estimated 40% for dashboard pages)

---

## Current State

### Existing Reusable Components

**Base UI (`src/components/ui/`):**
- ✅ `Button` - Variants, sizes, loading state
- ✅ `Card` - Container with padding options
- ✅ `Badge` - StatusBadge, RoleBadge, ActiveStatus
- ✅ `Input` - Form input with label/error
- ✅ `Select` - Dropdown component
- ✅ `DataTable` - Table with search, filter, pagination
- ✅ `FormSection` - Form layout grouping

**Shared (`src/components/shared/`):**
- ✅ `PageHeader` - Page title and actions
- ✅ `KpiCard` - Dashboard metric cards
- ✅ `IdentityCard` - Student/Teacher ID cards
- ✅ `AnnouncementPanel` - Announcement list with tabs
- ✅ `ActionItemsCard` - Pending tasks display
- ✅ `EmptyState` - Empty state component
- ✅ `LoadingState` - Loading indicators
- ✅ `Sidebar` - Navigation sidebar
- ✅ `ProtectedRoute` - Route guard
- ✅ Finance components
- ✅ Invoice components
- ✅ User form components

---

## Component Extraction Candidates

### HIGH PRIORITY (Completed ✅)

| Component | Status | Files Merged | Code Reduction |
|-----------|--------|--------------|----------------|
| `PageHeader` | ✅ Done | 15+ pages | ~20 lines/page |
| `KpiCard` | ✅ Done | 4 dashboards | ~50 lines/dashboard |
| `IdentityCard` | ✅ Done | Student + Teacher | ~80 lines |
| `AnnouncementPanel` | ✅ Done | 3 dashboards | ~60 lines |
| `EmptyState` | ✅ Done | 10+ pages | ~15 lines/page |
| `LoadingState` | ✅ Done | 10+ pages | ~20 lines/page |
| `ActionItemsCard` | ✅ Done | 2 dashboards | ~40 lines |

### MEDIUM PRIORITY (Pending)

| Component | Pages Found In | What Varies | Proposed Props |
|-----------|----------------|-------------|----------------|
| `TodayScheduleCard` | StudentDashboard, TeacherDashboard | Items, view mode | `items`, `viewMode`, `onViewAll` |
| `SectionCard` | All dashboards, detail pages | Title, icon, content | `title`, `icon?`, `actions?`, `children` |
| `TabNavigation` | StudentGrades, StudentCourses, AdminFinance | Tabs, active tab | `tabs`, `activeTab`, `onChange` |
| `FilterToolbar` | All list pages | Filters, search | `filters`, `searchPlaceholder`, callbacks |
| `ConfirmDialog` | Delete actions across pages | Title, message | `title`, `message`, `onConfirm` |

### LOW PRIORITY

| Component | Notes |
|-----------|-------|
| `TrendIndicator` | Currently inline in KpiCard |
| `AvatarInitials` | Simple utility, may not need extraction |
| `PriorityBadge` | Could extend StatusBadge |
| `TimelineItem` | Schedule-specific component |

---

## Duplication Analysis

### Dashboard Pages

All 4 dashboards share these patterns:

| Pattern | Student | Teacher | School Admin | System Admin |
|---------|:-------:|:-------:|:------------:|:------------:|
| Welcome header | ✅ | ✅ | ✅ | ✅ |
| KPI cards row | ❌ | ✅ | ✅ | ✅ |
| Virtual ID card | ✅ | ✅ | ❌ | ❌ |
| Today's schedule | Timeline | List | Summary | ❌ |
| Announcements | Tab Panel | List | ❌ | ❌ |
| Action items | ❌ | ✅ | ✅ | ❌ |
| Quick actions | ❌ | ❌ | ✅ | ❌ |

**Recommendation:** Create `DashboardShell` with slots for role-specific content.

### List Pages

All admin list pages share:
1. Page header with title + Add button → ✅ `PageHeader`
2. DataTable with search + filters → ✅ `DataTable`
3. Empty state display → ✅ `EmptyState`
4. Row actions (View, Edit, Delete) → ✅ Built into `DataTable`

**Status:** Mostly complete, using existing components.

### Detail Pages

Shared patterns:
1. Header with back + edit → ✅ `PageHeader`
2. Profile card with avatar → Pending extraction
3. Info sections with key-value → ✅ `DetailSection`

### Form Pages

Shared patterns:
1. Page header → ✅ `PageHeader`
2. Form sections → ✅ `FormSection`
3. Submit/Cancel buttons → Inline (simple)

---

## Folder Structure

### Current Structure

```
src/components/
├── ui/                    # Base UI primitives
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── DataTable.tsx
│   ├── FormSection.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   └── index.ts
├── layouts/               # Page layout wrappers
│   ├── AdminLayout.tsx
│   ├── ProtectedLayout.tsx
│   ├── StudentLayout.tsx
│   └── TeacherLayout.tsx
└── shared/               # Business components
    ├── dashboard/
    │   ├── IdentityCard.tsx
    │   ├── AnnouncementPanel.tsx
    │   └── ActionItemsCard.tsx
    ├── data/
    │   └── KpiCard.tsx
    ├── feedback/
    │   ├── EmptyState.tsx
    │   └── LoadingState.tsx
    ├── finance/
    ├── invoices/
    ├── users/
    ├── PageHeader.tsx
    └── index.ts
```

### Recommended Additions

```
src/components/shared/
├── schedule/              # NEW
│   └── TodayScheduleCard.tsx
├── navigation/            # NEW
│   └── TabNavigation.tsx
└── dialogs/               # NEW
    └── ConfirmDialog.tsx
```

---

## CSS/Styling Patterns

### Consistent Patterns (Keep)

- `cn()` utility for className merging
- Tailwind color classes for states
- Card shadows: `shadow-sm` default, `shadow-md` hover
- Border radius: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Icon sizing: `w-4 h-4`, `w-5 h-5`, `w-8 h-8`

### Inconsistencies Found (Fixed)

| Issue | Resolution |
|-------|------------|
| Local `cn()` definitions | Import from `@/utils` |
| Varying status badge colors | Centralized in `StatusBadge` |
| Dashboard card padding (p-5 vs p-6) | Standardized to p-5 |
| Inconsistent accent borders | Optional `accentBorder` prop |

---

## Implementation Phases

### Phase 1: High-Impact (✅ Complete)

1. ✅ `PageHeader` - All page headers standardized
2. ✅ `KpiCard` + `KpiCardsRow` - Dashboard metrics unified
3. ✅ `EmptyState` - Consistent empty states
4. ✅ `LoadingState` - Loading indicators
5. ✅ `IdentityCard` - Student/Teacher ID merged
6. ✅ `AnnouncementPanel` - Announcements with tabs
7. ✅ `ActionItemsCard` - Pending tasks

### Phase 2: Dashboard Unification (In Progress)

8. `TodayScheduleCard` - Unified schedule display
9. Dashboard refactoring to use shared components

### Phase 3: Layout Patterns

10. `SectionCard` - Card with header and actions
11. `TabNavigation` - Consistent tab switching
12. `FilterToolbar` - Search and filter bar

### Phase 4: Dialogs & Feedback

13. `ConfirmDialog` - Delete confirmations
14. Additional feedback components as needed

---

## Migration Status

### Pages Using Shared Components

| Page | Components Used | Status |
|------|-----------------|--------|
| StudentDashboard | PageHeader, IdentityCard, AnnouncementPanel | ✅ Migrated |
| TeacherDashboard | PageHeader, KpiCard, IdentityCard, AnnouncementPanel, ActionItemsCard | ✅ Migrated |
| AdminDashboard | PageHeader, KpiCard | ✅ Partial |
| StudentList | DataTable, StatusBadge | ✅ Using existing |
| TeacherList | DataTable, StatusBadge | ✅ Using existing |

### Pending Migrations

- SystemDashboard
- Remaining admin pages
- Form pages (using FormSection)

---

## Best Practices

### Component Development

1. Use TypeScript with proper interfaces
2. Export types alongside components
3. Include JSDoc for complex props
4. Use barrel exports (`index.ts`)

### Migration Guidelines

1. Don't break existing pages - migrate incrementally
2. Test each component in isolation
3. Verify with all 4 roles after migration
4. Update imports to use `@/components/shared`

### Code Quality

1. Follow existing Tailwind patterns
2. Use `cn()` from utils for conditional classes
3. Keep components focused and composable
4. Document edge cases and variants

---

## See Also

- [Component Library](./component-library.md) - Component reference
- [UI Patterns](./patterns.md) - Usage patterns
- [Frontend Architecture](../02-architecture/frontend.md) - Technical details
