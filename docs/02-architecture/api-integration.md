# API Integration Guide

Backend integration patterns, service layer architecture, and data fetching strategies.

---

## API Architecture

### Backend Services

| Service | Technology | Purpose |
|---------|------------|---------|
| API Server | FastAPI | REST endpoints |
| Authentication | Supabase Auth | User sessions |
| Database | PostgreSQL (Supabase) | Data persistence |
| Cache | Redis | Session and caching |
| File Storage | Supabase Storage | File uploads |

### Endpoint Structure

```
/api/v1/
├── auth/           # Authentication endpoints
├── users/          # User management
├── schools/        # School/institution management
├── courses/        # Course management
├── students/       # Student-specific operations
├── teachers/       # Teacher-specific operations
├── exams/          # Exam and assessment management
├── finance/        # Financial operations
├── announcements/  # Communication system
└── reports/        # Analytics and reporting
```

---

## Authentication

### Supabase Auth Configuration

```typescript
// src/services/auth.service.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};
```

### JWT Token Management

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  getAuthHeader: () => { Authorization?: string };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: null }),
      getAuthHeader: () => {
        const { token } = get();
        return token ? { Authorization: `Bearer ${token}` } : {};
      }
    }),
    { name: 'auth-token' }
  )
);
```

---

## HTTP Client

### Axios Configuration

```typescript
// src/services/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { getAuthHeader } = useAuthStore.getState();
    const authHeader = getAuthHeader();

    if (authHeader.Authorization) {
      config.headers.Authorization = authHeader.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { clearToken } = useAuthStore.getState();
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Service Layer Pattern

### Base Service Class

```typescript
// src/services/api/base.service.ts
import { apiClient } from './client';

export class BaseService<T> {
  constructor(protected endpoint: string) {}

  async getAll(params?: Record<string, any>): Promise<T[]> {
    const response = await apiClient.get(this.endpoint, { params });
    return response.data;
  }

  async getById(id: string): Promise<T> {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await apiClient.post(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await apiClient.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}
```

### Domain Service Example

```typescript
// src/services/user.service.ts
import { BaseService } from './base.service';
import { User, UserRole } from '@/types/user';

class UserService extends BaseService<User> {
  constructor() {
    super('/users');
  }

  async getStudents(params?: { grade?: string; courseId?: string }): Promise<User[]> {
    return this.getAll({ role: 'student', ...params });
  }

  async getTeachers(params?: { department?: string }): Promise<User[]> {
    return this.getAll({ role: 'teacher', ...params });
  }

  async inviteUser(email: string, role: UserRole): Promise<{ invitationToken: string }> {
    const response = await apiClient.post('/users/invitations', { email, role });
    return response.data;
  }

  async acceptInvitation(token: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.post(`/users/invitations/${token}/accept`, userData);
    return response.data;
  }
}

export const userService = new UserService();
```

---

## React Query Integration

### Query Client Configuration

```typescript
// src/services/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,     // 5 minutes
      cacheTime: 10 * 60 * 1000,    // 10 minutes
    },
  },
});
```

### Custom Data Hooks

```typescript
// src/hooks/api/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { User } from '@/types/user';

export function useUsers(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', updatedUser.id] });
    },
  });
}
```

---

## Error Handling

### Error Types

```typescript
// src/types/api.ts
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  statusCode: number;
}

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
```

### Global Error Handler

```typescript
// src/services/api/errorHandler.ts
import { toast } from 'sonner';
import { ApiException } from '@/types/api';

export function handleApiError(error: any): void {
  if (error instanceof ApiException) {
    switch (error.statusCode) {
      case 400:
        toast.error('Bad Request: ' + error.message);
        break;
      case 401:
        toast.error('Unauthorized: Please login again');
        break;
      case 403:
        toast.error('Forbidden: You don\'t have permission');
        break;
      case 404:
        toast.error('Not Found: ' + error.message);
        break;
      case 422:
        toast.error('Validation Error: ' + error.message);
        break;
      case 500:
        toast.error('Server Error: Please try again later');
        break;
      default:
        toast.error('An error occurred: ' + error.message);
    }
  } else if (error.message) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

---

## Real-time Features

### Supabase Subscriptions

```typescript
// src/services/realtime.service.ts
import { supabase } from './supabase';

export class RealtimeService {
  private subscriptions: Map<string, any> = new Map();

  subscribeToAnnouncements(callback: (announcement: Announcement) => void) {
    const subscription = supabase
      .channel('announcements')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => callback(payload.new as Announcement)
      )
      .subscribe();

    this.subscriptions.set('announcements', subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete('announcements');
    };
  }

  disconnectAll() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }
}

export const realtimeService = new RealtimeService();
```

---

## File Uploads

### Upload Service

```typescript
// src/services/upload.service.ts
import { supabase } from './supabase';

export class UploadService {
  async uploadFile(
    file: File,
    bucket: string,
    path: string
  ): Promise<{ data: { path: string }; error: any }> {
    const fileName = `${path}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    return { data, error };
  }

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    await supabase.storage.from(bucket).remove([path]);
  }
}

export const uploadService = new UploadService();
```

---

## Security Best Practices

### Input Sanitization

```typescript
// src/services/api/sanitizer.ts
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
```

### Request Validation

1. **Client-side**: Zod schemas for form validation
2. **Server-side**: FastAPI Pydantic models
3. **Database**: Supabase RLS policies

---

## Testing

### Mock Service Worker (MSW)

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }),

  http.post('/api/v1/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '3', ...body });
  }),
];
```

---

## Best Practices

### 1. Error Handling
- Always handle API errors gracefully
- Use consistent error formatting
- Provide user-friendly error messages

### 2. Loading States
- Implement proper loading indicators
- Handle loading, success, and error states
- Use skeleton screens for better UX

### 3. Caching Strategy
- Use React Query for server state
- Implement appropriate cache times
- Invalidate caches on mutations

### 4. Performance
- Implement request debouncing for search
- Use pagination for large datasets
- Compress request payloads

### 5. Security
- Sanitize all user inputs
- Validate on both client and server
- Use HTTPS for all API calls

---

## See Also

- [Frontend Architecture](./frontend.md) - Overall architecture
- [Workflow & Routing](./workflow.md) - Route structure
- [Roles & Permissions](../03-auth-rbac/roles-permissions.md) - Access control
