# Component Library Documentation

## Overview

This document describes the reusable component library used throughout the School Management System. All components are built with TypeScript, Tailwind CSS, and follow consistent design patterns.

## Base Components

### Button
**Location**: `src/components/ui/Button.tsx`

A versatile button component with multiple variants and sizes.

```tsx
<Button 
  variant="primary" 
  size="md"
  loading={false}
  onClick={handleClick}
>
  Click Me
</Button>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean (shows loading spinner)
- All standard HTML button attributes

### Card
**Location**: `src/components/ui/Card.tsx`

A flexible container component for content sections.

```tsx
<Card padding="md" className="shadow-lg">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>
```

**Props**:
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `className`: Additional CSS classes

### Container
**Location**: `src/components/layouts/Container.tsx`

A responsive container component that centers content and provides consistent spacing.

```tsx
<Container size="lg" className="py-8">
  <h1>Page Title</h1>
  <p>Page content...</p>
</Container>
```

**Props**:
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `className`: Additional CSS classes

## Layout Components

### StudentLayout
**Location**: `src/components/layouts/StudentLayout.tsx`

Provides the main layout structure for the student portal with navigation.

### TeacherLayout
**Location**: `src/components/layouts/TeacherLayout.tsx`

Provides the main layout structure for the teacher portal with navigation.

### AdminLayout
**Location**: `src/components/layouts/AdminLayout.tsx`

Provides the main layout structure for the admin portal with navigation.

## Shared Components

### ProtectedRoute
**Location**: `src/components/shared/ProtectedRoute.tsx`

HOC that protects routes based on user roles and authentication status.

```tsx
<ProtectedRoute allowedRoles={['student']}>
  <StudentLayout />
</ProtectedRoute>
```

**Props**:
- `allowedRoles`: UserRole[]
- `children`: ReactNode

## Component Design Principles

### 1. Consistency
- All components follow the same naming conventions
- Consistent prop interfaces
- Uniform styling patterns

### 2. Type Safety
- Full TypeScript support
- Proper prop typing
- Runtime validation where appropriate

### 3. Accessibility
- ARIA attributes where needed
- Keyboard navigation support
- Screen reader compatibility

### 4. Performance
- Minimal re-renders
- Efficient styling with Tailwind
- Optimized bundle size

### 5. Customization
- Flexible prop interfaces
- CSS class extensibility
- Theme support preparation

## Styling Guidelines

### Color Palette
- Primary: Blue (#2563eb)
- Secondary: Gray (#6b7280)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

### Spacing Scale
- Consistent use of Tailwind spacing utilities
- Responsive spacing with breakpoint prefixes
- Component-specific spacing tokens

### Typography
- Consistent font families
- Hierarchical heading sizes
- Responsive text sizing

## Component Development Guidelines

### File Structure
```
ComponentName.tsx
ComponentName.test.tsx
ComponentName.stories.tsx
index.ts (for exports)
```

### Naming Conventions
- PascalCase for component files
- camelCase for utility functions
- Descriptive prop names

### Testing Requirements
- Unit tests for logic
- Integration tests for user interactions
- Visual regression tests for UI components

## Component Library Roadmap

### Planned Components
- **Form Components**: Input, Select, Checkbox, Radio
- **Data Display**: Table, List, Badge, Avatar
- **Navigation**: Breadcrumb, Pagination, Tabs
- **Feedback**: Alert, Modal, Progress, Skeleton
- **Layout**: Grid, Stack, Divider

### Enhancement Plans
- Dark mode support
- RTL language support
- Animation library integration
- Design system documentation
- Component playground/storybook

## Usage Examples

### Creating a Form
```tsx
<Container size="sm">
  <Card>
    <h2 className="text-xl font-semibold mb-4">Login Form</h2>
    <form onSubmit={handleSubmit}>
      <input type="email" className="w-full mb-4" />
      <input type="password" className="w-full mb-4" />
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  </Card>
</Container>
```

### Creating a Dashboard Card
```tsx
<Card className="hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold mb-2">Statistics</h3>
  <div className="text-3xl font-bold text-blue-600">1,234</div>
  <p className="text-gray-600">Total Students</p>
</Card>
```

### Portal Layout Structure
```tsx
// Each portal uses its specific layout component
<StudentLayout>
  <Container>
    <h1>Student Dashboard</h1>
    <Card>
      {/* Dashboard content */}
    </Card>
  </Container>
</StudentLayout>
```