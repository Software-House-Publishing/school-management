import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { nameSchema, emailSchema, passwordSchema } from '@/utils/validators';
import { Mail, Lock, Building2, User, ArrowRight } from 'lucide-react';
import { getDefaultRoute } from '@/config/routes';
import AuthLayout from '@/components/layouts/AuthLayout';
import { UserRole } from '@/types/auth';

// Backend base URL (Vite env)
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const registerSchema = z.object({
  school: z.string().min(3, 'School name must be at least 3 characters'),
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export default function Register() {
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ school: '', name: '', email: '', password: '' });
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
        // navigate to default route for the role
        try {
          const defaultRoute = getDefaultRoute(mappedUser.role);
          navigate(defaultRoute);
        } catch (navErr) {
          console.warn('Failed to navigate after OAuth login', navErr);
        }
        // remove token param from URL
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
      registerSchema.parse(formData);
      setErrors({});
      setLoading(true);

      // Build payload - include administrator role explicitly so new users are admins by default
      const payload = {
        email: formData.email,
        password: formData.password,
        roles: ['administrator'],
        // optional fields the backend may ignore
        name: formData.name,
        school: formData.school,
        createdAt: new Date().toISOString(),
      };

      // Call backend register endpoint
      const regRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let regData: any = {};
      try { regData = await regRes.json(); } catch {}

      if (!regRes.ok) {
        setErrors({ general: regData.error || regData.message || 'Registration failed' });
        setLoading(false);
        return;
      }

      // After successful registration, perform login to obtain access token
      const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      let loginData: any = {};
      try { loginData = await loginRes.json(); } catch {}

      if (!loginRes.ok) {
        setErrors({ general: loginData.error || loginData.message || 'Registration succeeded but automatic login failed' });
        setLoading(false);
        return;
      }

      const token = loginData.accessToken || loginData.token;
      if (!token) {
        setErrors({ general: 'registration succeeded but no access token returned' });
        setLoading(false);
        return;
      }

      // Fetch /me to get canonical profile
      const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });

      let apiUser: any = {};
      try { apiUser = await meRes.json(); } catch {}

      if (!meRes.ok) {
        setErrors({ general: apiUser.error || apiUser.message || 'failed to fetch user profile' });
        setLoading(false);
        return;
      }

      // Map roles -> frontend role enums (similar to Login.tsx)
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

      const fullName = formData.name.trim();
      const [firstName, ...rest] = fullName.split(' ');
      const lastName = rest.join(' ') || '';

      const mappedUser = {
        id: apiUser.id || regData.id || 'new-1',
        email: apiUser.email || formData.email,
        role: appRole,
        firstName: firstName || '',
        lastName: lastName || '',
        isActive: apiUser.status ? apiUser.status === 'active' : true,
        createdAt: apiUser.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schoolName: formData.school || 'St. Mary’s High School',
      };

      // Persist login in store and navigate
      login(mappedUser, token);
      navigate(getDefaultRoute(mappedUser.role));
      setLoading(false);

    } catch (error: unknown) {
      setLoading(false);
      if (typeof error === 'object' && error !== null && 'errors' in error) {
        const newErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: error instanceof Error ? error.message : String(error) });
      }
    }
  };

  return (
    <AuthLayout
      title="Start your free trial."
      subtitle="Join thousands of schools transforming education everyday."
      footer={
        <p>
          Already have an account?{' '}
          <a href="/login" className="font-medium text-classivo-blue hover:text-classivo-blue/80 hover:underline transition-colors">
            Sign in here
          </a>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 ml-1 mb-1.5">
              School Name
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-classivo-black/40 absolute left-4 top-3.5" />
              <input
                id="school"
                name="school"
                type="text"
                value={formData.school}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl glass-input placeholder:text-gray-400 focus:ring-0 ${errors.school ? 'border-red-400 bg-red-50/30' : ''
                  }`}
                placeholder="Lincoln High School"
              />
            </div>
            {errors.school && (
              <p className="ml-1 mt-1 text-sm text-red-500 font-medium">
                {errors.school}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 ml-1 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-classivo-black/40 absolute left-4 top-3.5" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl glass-input placeholder:text-gray-400 focus:ring-0 ${errors.name ? 'border-red-400 bg-red-50/30' : ''
                  }`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="ml-1 mt-1 text-sm text-red-500 font-medium">
                {errors.name}
              </p>
            )}
          </div>

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
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl glass-input placeholder:text-gray-400 focus:ring-0 ${errors.email ? 'border-red-400 bg-red-50/30' : ''
                  }`}
                placeholder="name@school.com"
              />
            </div>
            {errors.email && (
              <p className="ml-1 mt-1 text-sm text-red-500 font-medium">
                {errors.email}
              </p>
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
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl glass-input placeholder:text-gray-400 focus:ring-0 ${errors.password ? 'border-red-400 bg-red-50/30' : ''
                  }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="ml-1 mt-1 text-sm text-red-500 font-medium">
                {errors.password}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          isLoading={isLoading}
          className="w-full h-14 rounded-2xl text-lg shadow-xl"
        >
          Create Account
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
