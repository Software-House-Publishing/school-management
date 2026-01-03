import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { emailSchema, passwordSchema } from '@/utils/validators';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { getDefaultRoute } from '@/config/routes';
import AuthLayout from '@/components/layouts/AuthLayout';
import { UserRole } from '@/types/auth';

// Backend base URL (Vite env)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export default function Login() {
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If redirected back from OAuth provider with token in URL, consume it
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (!tokenFromUrl) return;

    (async () => {
      try {
        setLoading(true);
        const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenFromUrl}`,
          },
        });
        if (!meRes.ok) {
          console.error('Failed to fetch profile after OAuth callback', await meRes.text());
          setLoading(false);
          return;
        }
        const apiUser = await meRes.json();

        let primaryRole = 'system_administrator';
        if (Array.isArray(apiUser.roles) && apiUser.roles.length > 0) {
          primaryRole = apiUser.roles[0];
        }

        let appRole: UserRole;
        switch (primaryRole) {
          case 'admin':
          case 'administrator':
            appRole = 'system_administrator';
            break;
          case 'school_admin':
            appRole = 'school_administrator';
            break;
          default:
            appRole = primaryRole as UserRole;
        }

        const nameParts = (apiUser.name || '').split(' ');
        const [firstName, ...rest] = nameParts;
        const lastName = rest.join(' ');

        const mappedUser = {
          id: apiUser.id,
          email: apiUser.email,
          role: appRole,
          firstName: firstName || '',
          lastName: lastName || '',
          isActive: apiUser.status ? apiUser.status === 'active' : true,
          createdAt: apiUser.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          schoolName: apiUser.schoolName || (appRole === 'system_administrator' ? 'Central Administration' : 'St. Mary’s High School')
        };

        login(mappedUser, tokenFromUrl);
        try {
          const defaultRoute = getDefaultRoute(mappedUser.role);
          navigate(defaultRoute);
        } catch (navErr) {
          console.warn('Failed to navigate after OAuth login', navErr);
        }
        params.delete('token');
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, document.title, newUrl);
        setLoading(false);
      } catch (err) {
        console.error('OAuth token handling failed', err);
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse(formData);
      setErrors({});
      setLoading(true);

      // Perform login
      const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      let loginData: any = {};
      try { loginData = await loginRes.json(); } catch { }

      if (!loginRes.ok) {
        // surface backend message if provided
        if (loginRes.status === 401 || loginRes.status === 400) {
          setErrors({ general: 'Invalid email or password' });
        } else {
          // Other errors (server, unexpected)
          setErrors({ general: 'Something went wrong. Please try again later.' });
        }
        setLoading(false);
        return;
      }

      const token = loginData.accessToken || loginData.token;
      if (!token) {
        setErrors({ general: 'Login succeeded but no access token returned' });
        setLoading(false);
        return;
      }

      // Fetch /me for user profile
      const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });

      let apiUser: any = {};
      try { apiUser = await meRes.json(); } catch { }

      if (!meRes.ok) {
        setErrors({ general: apiUser.error || apiUser.message || 'Failed to fetch user profile' });
        setLoading(false);
        return;
      }

      let primaryRole = 'system_administrator';
      if (Array.isArray(apiUser.roles) && apiUser.roles.length > 0) {
        primaryRole = apiUser.roles[0];
      }

      let appRole: UserRole;
      switch (primaryRole) {
        case 'admin':
        case 'administrator':
          appRole = 'system_administrator';
          break;
        case 'school_admin':
          appRole = 'school_administrator';
          break;
        default:
          appRole = primaryRole as UserRole;
      }

      const nameParts = (apiUser.name || '').split(' ');
      const [firstName, ...rest] = nameParts;

      const mappedUser = {
        id: apiUser.id || apiUser._id || 'unknown',
        email: apiUser.email,
        role: appRole,
        firstName: firstName || '',
        lastName: rest.join(' ') || '',
        isActive: apiUser.status ? apiUser.status === 'active' : true,
        createdAt: apiUser.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schoolName: apiUser.schoolName || 'St. Mary’s High School',
      };

      login(mappedUser, token);
      try {
        navigate(getDefaultRoute(mappedUser.role));
      } catch (navErr) {
        console.warn('Failed to navigate after login', navErr);
      }

      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);

      // Any validation error → generic login message
      if (typeof error === 'object' && error !== null && 'errors' in error) {
        setErrors({ general: 'Invalid email or password' });
        return;
      }

      setErrors({
        general: error instanceof Error
          ? 'Something went wrong. Please try again.'
          : 'Login failed. Please try again.',
      });
    }

  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard."
      footer={
        <p>
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-classivo-blue hover:text-classivo-blue/80 hover:underline transition-colors">
            Create one
          </a>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 ml-1 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-classivo-black/40 absolute left-4 top-3.5" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl glass-input placeholder:text-gray-400 focus:ring-0 ${errors.email ? 'border-red-400 bg-red-50/30' : ''}`}
                placeholder="name@school.com"
              />
            </div>
            {errors.email && (
              <p className="ml-1 mt-1 text-sm text-red-500 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 ml-1 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-classivo-black/40 absolute left-4 top-3.5" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl glass-input placeholder:text-gray-400 focus:ring-0 ${errors.password ? 'border-red-400 bg-red-50/30' : ''}`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="ml-1 mt-1 text-sm text-red-500 font-medium">{errors.password}</p>
            )}
          </div>
        </div>

        {errors.general && (
          <p className="text-sm text-red-600 font-medium">{errors.general}</p>
        )}

        <Button type="submit" variant="default" isLoading={isLoading} className="w-full h-14 rounded-2xl text-lg shadow-xl">
          Sign in
          {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 mb-2">or</p>
          <button
            type="button"
            onClick={() => { window.location.href = `${API_BASE_URL}/api/auth/google/login`; }}
            className="inline-flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-2xl bg-white hover:bg-gray-50 text-sm"
          >
            Continue with Google
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}