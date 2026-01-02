# Environment Configuration

Detailed guide for configuring development and production environments.

---

## Environment Files

| File | Purpose | Git Tracked |
|------|---------|-------------|
| `.env` | Local development | No |
| `.env.example` | Template with dummy values | Yes |
| `.env.production` | Production build values | No |
| `.env.local` | Local overrides | No |

---

## Environment Variables

### Required Variables

```env
# Application Identity
VITE_APP_NAME=School Management System
VITE_APP_URL=http://localhost:5173

# API Configuration
VITE_API_URL=http://localhost:8000/api/v1
```

### Supabase Configuration

```env
# Supabase Project
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Optional: Analytics & Monitoring

```env
# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true

# Sentry Error Tracking
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_ENABLE_ERROR_TRACKING=true
```

### Optional: Feature Flags

```env
# Feature Toggles
VITE_ENABLE_MOCK_AUTH=true
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_REALTIME=true
```

---

## Development Setup

### Minimal Configuration (Mock Mode)

Create `.env` with just:

```env
VITE_APP_NAME=School Management System
VITE_API_URL=http://localhost:8000/api/v1
VITE_ENABLE_MOCK_AUTH=true
```

This runs the app with:
- Mock authentication (email keyword-based roles)
- LocalStorage data persistence
- No backend required

### Full Configuration (With Backend)

```env
# Application
VITE_APP_NAME=School Management System
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000/api/v1

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Features
VITE_ENABLE_MOCK_AUTH=false
VITE_ENABLE_REALTIME=true
```

---

## Production Configuration

### Production Environment File

Create `.env.production`:

```env
# Application
VITE_APP_NAME=School Management System
VITE_APP_URL=https://app.yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api/v1

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true

# Error Tracking
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_ENABLE_ERROR_TRACKING=true

# Features
VITE_ENABLE_MOCK_AUTH=false
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_REALTIME=true
```

### Platform-Specific Variables

#### Vercel

Set in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_SUPABASE_URL = @supabase_url (secret reference)
VITE_SUPABASE_ANON_KEY = @supabase_anon_key (secret reference)
```

#### Netlify

Set in Netlify Dashboard → Site Settings → Build & Deploy → Environment:

```
VITE_API_URL = https://api.yourdomain.com/api/v1
VITE_SUPABASE_URL = https://your-project.supabase.co
```

---

## TypeScript Path Aliases

The project uses path aliases configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Use `@/` prefix for absolute imports:

```typescript
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { formatDate } from '@/utils/formatters';
```

---

## Code Quality Configuration

### ESLint

Configuration in `.eslintrc.cjs`:
- React and TypeScript rules
- Import/export validation
- Accessibility (a11y) rules
- Security best practices

### TypeScript

Configuration in `tsconfig.json`:
- Strict mode enabled
- ES2020 target
- React JSX transform

### Tailwind CSS

Configuration in `tailwind.config.js`:
- Custom color palette
- Extended spacing scale
- Custom animations

---

## Debugging Configuration

### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug in Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### React DevTools

Install the React Developer Tools browser extension for:
- Component tree inspection
- Props and state debugging
- Performance profiling

### Zustand DevTools

The auth store supports Redux DevTools:

```typescript
// Enable in development
import { devtools } from 'zustand/middleware';

const useAuthStore = create(
  devtools(
    persist((set) => ({ ... }))
  )
);
```

---

## Security Best Practices

### Environment Variables

1. **Never commit secrets**: Add `.env*` to `.gitignore`
2. **Use secret references**: On Vercel/Netlify, use secret references
3. **Rotate keys regularly**: Especially after team changes
4. **Separate environments**: Use different keys for dev/staging/prod

### Client-Side Exposure

All `VITE_*` variables are exposed to the browser. Never include:
- API secret keys
- Database credentials
- Private tokens
- Encryption keys

Use server-side API routes or backend services for sensitive operations.

---

## See Also

- [Quickstart Guide](./quickstart.md) - Get started quickly
- [Deployment Guide](../05-deployment/README.md) - Production deployment
- [API Integration](../02-architecture/api-integration.md) - Backend connection
