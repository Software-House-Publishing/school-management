# Development Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

## Initial Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd school-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=School Management System
VITE_API_URL=http://localhost:3000/api
```

### 4. Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Workflow

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run TypeScript type checking
npm run check

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

### Code Quality

#### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/` for `src/`)
- Comprehensive type definitions

#### ESLint Configuration
- React and TypeScript rules
- Import/export validation
- Accessibility rules
- Security best practices

#### Pre-commit Hooks
- Automatic code formatting
- Type checking
- Lint validation

## Project Structure Guidelines

### Component Organization
```
components/
├── ui/           # Base UI components (Button, Card, etc.)
├── forms/        # Form-specific components
├── layouts/      # Layout components
└── shared/       # Shared business logic components
```

### Page Organization
```
pages/
├── public/       # Public-facing pages
├── student/      # Student portal pages
├── teacher/      # Teacher portal pages
├── admin/        # Admin portal pages
└── dashboard/    # Shared dashboard components
```

### Type Organization
```
types/
├── auth.ts       # Authentication types
├── school.ts     # School/institution types
├── academic.ts   # Academic types
└── finance.ts    # Financial types
```

## Coding Standards

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Types**: PascalCase (`UserRole`)

### File Organization
- One component per file
- Related components in same directory
- Index files for clean imports

### Code Style
- Use TypeScript for all files
- Prefer functional components
- Use custom hooks for reusable logic
- Implement proper error boundaries

## State Management

### Global State (Zustand)
```typescript
// Define store
interface AuthStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Use store
const { user, login } = useAuthStore();
```

### Local State (React)
```typescript
// Use useState for component state
const [loading, setLoading] = useState(false);

// Use useEffect for side effects
useEffect(() => {
  fetchData();
}, [dependency]);
```

## API Integration

### Service Layer
```typescript
// Create service
class UserService {
  async getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
}

// Use service
const user = await userService.getUser(userId);
```

### Error Handling
```typescript
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

## Testing Strategy

### Unit Tests
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e
```

## Internationalization

### Adding Translations
```json
// en.json
{
  "welcome": "Welcome {{name}}!",
  "dashboard": {
    "title": "Dashboard",
    "stats": "Statistics"
  }
}
```

### Using Translations
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

return (
  <h1>{t('welcome', { name: user.name })}</h1>
  <h2>{t('dashboard.title')}</h2>
);
```

## Debugging

### Development Tools
- React Developer Tools
- Redux DevTools (for Zustand)
- Browser DevTools Network tab
- Console logging with proper formatting

### Common Issues
1. **Type errors**: Run `npm run check` to identify TypeScript issues
2. **Import errors**: Check path aliases and file structure
3. **Build errors**: Check for circular dependencies
4. **Runtime errors**: Use error boundaries and proper error handling

## Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### Memoization
```typescript
// Memoize expensive computations
const memoizedValue = useMemo(() => 
  computeExpensiveValue(a, b), [a, b]
);

// Memoize components
const MemoizedComponent = memo(MyComponent);
```

### Virtual Scrolling
For large lists, implement virtual scrolling:
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={items.length}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeList>
```

## Deployment

### Build Process
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Ensure all required environment variables are set in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`

### Hosting Options
- **Vercel**: Automatic deployments from Git
- **Netlify**: Drag-and-drop or Git integration
- **AWS S3 + CloudFront**: For custom CDN setup

## Troubleshooting

### Common Development Issues

1. **Hot reload not working**: Restart the dev server
2. **TypeScript errors**: Check imports and type definitions
3. **Build failures**: Check for syntax errors and missing dependencies
4. **Performance issues**: Use React DevTools Profiler

### Getting Help
- Check existing documentation
- Review component examples
- Consult team members
- Create detailed issue reports

## Contributing Guidelines

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation if needed
4. Submit PR with detailed description
5. Address review feedback

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Components follow design patterns
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Accessibility standards met
- [ ] Performance considerations addressed