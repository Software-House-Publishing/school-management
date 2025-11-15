# School Management System - Frontend Architecture

## Overview

This document outlines the frontend architecture for the School Management System, a comprehensive multi-tenant platform designed for educational institutions including private schools, public schools, universities, private tuitions, language schools, and other teaching providers.

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
- **Authentication**: Supabase Auth integration

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Card, etc.)
│   ├── forms/           # Form-specific components
│   ├── layouts/         # Layout components (Container, etc.)
│   └── shared/          # Shared components across portals
├── pages/               # Page components organized by portal
│   ├── public/          # Public-facing pages
│   │   ├── home/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── rules/
│   │   └── auth/
│   ├── student/         # Student portal pages
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── exams/
│   │   ├── profile/
│   │   └── fees/
│   ├── teacher/         # Teacher portal pages
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── students/
│   │   ├── exams/
│   │   └── announcements/
│   ├── admin/           # Admin portal pages
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── finance/
│   │   ├── reports/
│   │   └── settings/
│   └── dashboard/       # Shared dashboard components
├── hooks/               # Custom React hooks
│   ├── auth/           # Authentication hooks
│   ├── api/            # API interaction hooks
│   └── ui/             # UI-related hooks
├── stores/              # Zustand state management
├── services/            # API service layers
├── types/               # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   ├── school.ts       # School/institution types
│   ├── academic.ts     # Academic types (courses, exams)
│   └── finance.ts      # Financial types (fees, payments)
├── utils/               # Utility functions
│   ├── validators.ts   # Form validation schemas
│   └── formatters.ts   # Data formatting utilities
├── i18n/                # Internationalization
│   ├── locales/        # Translation files
│   │   ├── en.json     # English translations
│   │   └── my.json     # Burmese translations
│   └── index.ts        # i18n configuration
├── config/              # Configuration files
│   └── routes.ts       # Route permissions and access control
└── constants/           # Application constants
```

## Multi-Layered Architecture

### 1. Presentation Layer
- **Components**: Reusable UI components with consistent styling
- **Pages**: Route-specific page components
- **Layouts**: Portal-specific layout wrappers

### 2. Business Logic Layer
- **Hooks**: Custom hooks for business logic and state management
- **Stores**: Zustand stores for global state management
- **Services**: API service abstractions

### 3. Data Access Layer
- **Types**: Strong TypeScript typing throughout
- **Validation**: Zod schemas for runtime validation
- **API Integration**: Supabase client integration

## Portal Architecture

### Public Portal
- Landing page with hero section
- About, Contact, and School Rules pages
- Authentication (login with Google)
- Multi-language support (English/Burmese)

### Student Portal
- Dashboard with academic overview
- Course enrollment and progress tracking
- Exam scheduling and results
- Fee management and payment history
- Profile management

### Teacher Portal
- Dashboard with teaching overview
- Course management and content creation
- Student progress monitoring
- Exam creation and grading
- Announcement management

### Admin Portal
- System dashboard with analytics
- User management (students, teachers, staff)
- Course and curriculum management
- Financial management (fees, payments, salaries)
- Reporting and analytics
- System configuration

## Role-Based Access Control (RBAC)

Based on the RBAC specification in `/docs/rbac.md`:

### Roles Hierarchy
- **Director**: Executive authority across all modules
- **Administrator**: Platform operator with system-wide access
- **Manager**: Academic operations lead
- **Finance Officer**: Financial controller
- **Help Desk**: Support agent
- **Teacher**: Instructional staff
- **Student**: Learner

### Route Protection
- Role-based route access using `ProtectedRoute` component
- Dynamic route permissions defined in `config/routes.ts`
- Automatic redirection to appropriate portals

## Internationalization (i18n)

### Language Support
- **English** (primary)
- **Burmese** (secondary)

### Implementation
- react-i18next for translation management
- JSON-based translation files
- Language detection and persistence
- RTL support for Burmese language

## Component Design Patterns

### 1. Compound Components
- Layout components (Container, Card) with flexible props
- Form components with validation integration

### 2. Render Props
- Higher-order components for shared functionality
- Custom hooks for reusable logic

### 3. Controlled Components
- Form inputs with React Hook Form integration
- State management with Zustand stores

## State Management Strategy

### Global State (Zustand)
- Authentication state
- User profile data
- Application-wide settings

### Local State (React)
- Form data and validation
- UI component state
- Temporary data caching

### Server State (Supabase)
- User authentication
- Database queries
- Real-time subscriptions

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Dynamic imports for heavy components

### Caching Strategy
- React Query for server state caching
- Local storage for persistent data
- Memoization for expensive computations

### Bundle Optimization
- Tree shaking with Vite
- Dynamic imports
- Image optimization

## Security Considerations

### Authentication
- Supabase Auth integration
- JWT token management
- Session handling

### Authorization
- Role-based access control
- Route-level protection
- API request authorization

### Data Protection
- Input validation with Zod
- XSS prevention
- CSRF protection

## Development Workflow

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Pre-commit hooks

### Testing Strategy
- Unit tests for utilities
- Integration tests for components
- E2E tests for critical flows

### Build Process
- Vite development server
- TypeScript compilation
- Production optimization

## Deployment Strategy

### Environment Configuration
- Environment-specific builds
- Feature flags for gradual rollout
- Monitoring and analytics integration

### Hosting
- Static site hosting (Vercel/Netlify)
- CDN for global distribution
- SSL/TLS encryption

## Future Enhancements

### Planned Features
- Mobile-responsive PWA
- Offline functionality
- Advanced analytics dashboard
- Integration with third-party tools
- AI-powered recommendations

### Scalability Considerations
- Micro-frontend architecture
- Module federation
- Progressive enhancement