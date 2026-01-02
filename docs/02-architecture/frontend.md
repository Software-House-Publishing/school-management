# Frontend Architecture

Comprehensive technical architecture documentation for the School Management System frontend.

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React | 18.x | UI library |
| Language | TypeScript | 5.x | Type safety |
| Build Tool | Vite | 5.x | Development and bundling |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| State | Zustand | 4.x | Global state management |
| Routing | React Router DOM | 6.x | Client-side routing |
| Forms | React Hook Form | 7.x | Form handling |
| Validation | Zod | 3.x | Schema validation |
| i18n | react-i18next | 13.x | Internationalization |
| Icons | Lucide React | Latest | Icon library |
| Toasts | Sonner | Latest | Notifications |
| Charts | Recharts | 2.x | Data visualization |

---

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI primitives
│   │   ├── Badge.tsx        # StatusBadge, RoleBadge, ActiveStatus
│   │   ├── Button.tsx       # Button with variants and loading
│   │   ├── Card.tsx         # Card container component
│   │   ├── DataTable.tsx    # Generic table with pagination
│   │   ├── FormSection.tsx  # FormSection, InfoItem, DetailSection
│   │   ├── Input.tsx        # Input with label/error support
│   │   ├── Select.tsx       # Select dropdown
│   │   └── index.ts         # Centralized exports
│   ├── layouts/             # Layout wrappers
│   │   ├── AdminLayout.tsx      # School admin portal
│   │   ├── AuthLayout.tsx       # Authentication pages
│   │   ├── Container.tsx        # Responsive container
│   │   ├── ProtectedLayout.tsx  # Unified protected layout
│   │   ├── StudentLayout.tsx    # Student portal
│   │   └── TeacherLayout.tsx    # Teacher portal
│   └── shared/              # Business components
│       ├── dashboard/       # Dashboard components
│       ├── finance/         # Finance components
│       ├── invoices/        # Invoice components
│       ├── users/           # User form components
│       ├── ProtectedRoute.tsx
│       └── Sidebar.tsx
├── pages/                   # Route components
│   ├── system/              # Platform public pages
│   ├── school-public/       # School tenant pages
│   ├── admin/               # School admin portal
│   ├── system-admin/        # System admin portal
│   ├── student/             # Student portal
│   └── teacher/             # Teacher portal
├── stores/                  # Zustand stores
│   └── authStore.ts         # Authentication state
├── config/                  # Configuration
│   ├── navigation.tsx       # Nav items per role
│   └── routes.ts            # Route permissions
├── types/                   # TypeScript definitions
│   └── auth.ts              # User, Role types
├── utils/                   # Utility functions
│   ├── index.ts             # cn, generateId, debounce
│   └── formatters.ts        # Formatting utilities
├── i18n/                    # Internationalization
│   ├── locales/
│   │   ├── en.json
│   │   └── my.json
│   └── index.ts
└── services/                # API layer (planned)
```

---

## Component Architecture

### Layered Component System

```
┌─────────────────────────────────────────────────────────────┐
│                    PAGE COMPONENTS                          │
│  (StudentDashboard, TeacherList, AdminSettings, etc.)      │
├─────────────────────────────────────────────────────────────┤
│                    LAYOUT COMPONENTS                        │
│  (ProtectedLayout, AdminLayout, StudentLayout)             │
├─────────────────────────────────────────────────────────────┤
│                    SHARED COMPONENTS                        │
│  (DataTable, IdentityCard, AnnouncementPanel)              │
├─────────────────────────────────────────────────────────────┤
│                    UI PRIMITIVES                            │
│  (Button, Card, Input, Select, Badge)                      │
└─────────────────────────────────────────────────────────────┘
```

### Unified Layout System

All protected portals use `ProtectedLayout` as the base:

```tsx
// AdminLayout.tsx - Thin wrapper
export default function AdminLayout() {
  const { user } = useAuthStore();
  const navItems = user?.role === 'system_administrator'
    ? systemAdminNavItems
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

Layout hierarchy:

```
ProtectedLayout
├── Sidebar
│   ├── Brand Logo
│   ├── User/Student Info Card
│   ├── Primary Navigation
│   ├── Secondary Navigation
│   └── Sign Out Button
└── Main Content
    └── Container
        └── <Outlet /> (Page Component)
```

---

## State Management

### Authentication Store (Zustand)

```typescript
// src/stores/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

### State Strategy

| State Type | Solution | Example |
|------------|----------|---------|
| Global Auth | Zustand + persist | User session |
| Server State | React Query (planned) | API data |
| Form State | React Hook Form | Form inputs |
| UI State | React useState | Modals, tabs |
| URL State | React Router | Filters, pagination |

---

## Routing Architecture

### Route Structure

```typescript
// Route hierarchy
<Routes>
  {/* Public routes */}
  <Route path="/" element={<SystemHome />} />
  <Route path="/login" element={<SystemLogin />} />
  <Route path="/school/:schoolId/*" element={<SchoolRoutes />} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute allowedRoles={['student']} />}>
    <Route path="/student/*" element={<StudentLayout />}>
      <Route path="dashboard" element={<StudentDashboard />} />
      {/* ... */}
    </Route>
  </Route>

  <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
    <Route path="/teacher/*" element={<TeacherLayout />}>
      {/* ... */}
    </Route>
  </Route>

  <Route element={<ProtectedRoute allowedRoles={adminRoles} />}>
    <Route path="/school-admin/*" element={<AdminLayout />}>
      {/* ... */}
    </Route>
  </Route>
</Routes>
```

### Route Protection Flow

```
Request Route → Check isAuthenticated?
    │
    ├─ No  → Redirect to /login
    │
    └─ Yes → Check role in allowedRoles?
              │
              ├─ No  → Redirect to getDefaultRoute(role)
              │
              └─ Yes → Render Component
```

---

## Utility Functions

### Formatters (`src/utils/formatters.ts`)

```typescript
// Name formatting
fullName({ firstName, lastName })     // "John Doe"
getInitials({ firstName, lastName })  // "JD"

// Status formatting
getStudentStatusClasses(status)  // "bg-emerald-100 text-emerald-800"
getStudentStatusLabel(status)    // "Active"
getTeacherStatusClasses(status)
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

### Class Name Utility

```typescript
import { cn } from '@/utils';

// Merge Tailwind classes conditionally
<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

---

## Performance Optimization

### Code Splitting

```typescript
// Route-based lazy loading
const StudentDashboard = lazy(() => import('@/pages/student/dashboard'));

<Suspense fallback={<LoadingState />}>
  <StudentDashboard />
</Suspense>
```

### Memoization

```typescript
// Expensive computations
const memoizedValue = useMemo(() =>
  computeExpensiveValue(a, b), [a, b]
);

// Stable callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Component memoization
const MemoizedList = memo(StudentList);
```

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'sonner'],
        },
      },
    },
  },
});
```

---

## Security Considerations

### Authentication

- JWT tokens stored in localStorage (via Zustand persist)
- Token included in API request headers
- Automatic redirect on 401 responses

### Authorization

- Route-level protection via `ProtectedRoute`
- Role-based navigation filtering
- Component-level permission checks

### Input Validation

- Zod schemas for form validation
- Server-side validation (backend)
- XSS prevention via React's built-in escaping

---

## Code Quality

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Coding Standards

| Area | Convention |
|------|------------|
| Components | PascalCase (`UserProfile.tsx`) |
| Functions | camelCase (`getUserData()`) |
| Constants | UPPER_SNAKE_CASE (`API_ENDPOINTS`) |
| Types | PascalCase (`UserRole`) |
| Files | One component per file |

---

## See Also

- [Workflow & Routing](./workflow.md) - Multi-tenant routing
- [API Integration](./api-integration.md) - Backend patterns
- [Component Library](../04-ui/component-library.md) - UI components
