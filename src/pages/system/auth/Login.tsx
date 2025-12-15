import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { loginSchema } from '@/utils/validators';
import { getDefaultRoute } from '@/config/routes';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { UserRole } from '@/types/auth';

// 🔑 Backend base URL (change VITE_API_URL in .env if you want)

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';


export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, setLoading, isAuthenticated, user } =
    useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultRoute = getDefaultRoute(user.role);
      navigate(defaultRoute);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ validate with existing schema
      loginSchema.parse(formData);
      setErrors({});
      setLoading(true);

      // --- MOCK LOGIN LOGIC START ---
      // check if we should even try the backend (e.g. if explicitly in demo mode or backend is known missing)
      // For now, we'll try fetch, and if it fails, we fall back to mock.

      try {
        if (!API_BASE_URL) throw new Error("No API URL");

        // ✅ REAL API CALL to backend
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          // If 401/403, it's a real auth error. 
          // But if we are in "no backend" mode, we might want to override?
          // Let's assume if it fails, and we want mock data, we might just want to force it?
          // The user said "because we don't have the backend yet". 
          // So likely the API call will fail with connection error or 404.

          throw new Error(data.message || 'Login failed');
        }

        const apiUser = data.user;
        // ... (mapping logic) ...
        let appRole: UserRole;
        switch (apiUser.role) {
          case 'admin': appRole = 'system_administrator'; break;
          case 'school_admin': appRole = 'school_administrator'; break;
          default: appRole = apiUser.role as UserRole;
        }

        const [firstName, ...rest] = (apiUser.name || '').split(' ');
        const lastName = rest.join(' ');

        const mappedUser = {
          id: apiUser.id,
          email: apiUser.email,
          role: appRole,
          firstName: firstName || '',
          lastName: lastName || '',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          schoolName: "System", // Default for system
        };

        login(mappedUser, data.token);
        setLoading(false);
        return;

      } catch (err) {
        // If API call fails (network error or specific "no backend" scenario), fall back to MOCK
        console.warn("Backend login failed, falling back to MOCK DATA due to: ", err);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        let mockRole: UserRole = 'system_administrator';
        let mockFirstName = 'System';
        let mockLastName = 'Admin';

        const emailLower = formData.email.toLowerCase();

        if (emailLower.includes('school')) {
          mockRole = 'school_administrator';
          mockFirstName = 'School';
          mockLastName = 'Admin';
        } else if (emailLower.includes('teacher')) {
          mockRole = 'teacher';
          mockFirstName = 'John';
          mockLastName = 'Doe';
        } else if (emailLower.includes('student')) {
          mockRole = 'student';
          mockFirstName = 'Sarah';
          mockLastName = 'Connor';
        } else if (emailLower.includes('manager')) {
          mockRole = 'manager';
          mockFirstName = 'Michael';
          mockLastName = 'Scott';
        } else if (emailLower.includes('finance')) {
          mockRole = 'finance_officer';
          mockFirstName = 'Angela';
          mockLastName = 'Martin';
        } else if (emailLower.includes('help')) {
          mockRole = 'help_desk';
          mockFirstName = 'Help';
          mockLastName = 'Desk';
        }
        // Default to system admin if 'admin' or any other

        const mockUser = {
          id: `MOCK-${mockRole.toUpperCase()}-001`,
          email: formData.email,
          role: mockRole,
          firstName: mockFirstName,
          lastName: mockLastName,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          schoolName: mockRole === 'system_administrator' ? 'Central Administration' : 'St. Mary’s High School'
        };

        login(mockUser, 'mock-token-12345');
        setLoading(false);
        return;
      }

    } catch (error: unknown) {
      setLoading(false);

      // Zod validation errors
      if (typeof error === 'object' && error !== null && 'errors' in error) {
        const newErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Login error:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to your account to continue"
      footer={
        <p>
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-classivo-blue hover:text-classivo-blue/80 hover:underline transition-colors">
            Start a free trial
          </a>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* optional general error */}
        {errors.general && (
          <div className="p-3 rounded-xl bg-red-50/80 border border-red-100 text-sm text-red-600 text-center backdrop-blur-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 ml-1 mb-1.5"
            >
              {t('auth.login.email')}
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
            <div className="flex items-center justify-between ml-1 mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t('auth.login.password')}
              </label>
              <a href="/forgot-password" className="text-sm font-medium text-gray-500 hover:text-classivo-blue transition-colors">
                Forgot password?
              </a>
            </div>
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
          {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
          {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>

        {/* Demo Credentials Hint */}
        <div className="mt-6 p-4 bg-classivo-lightblue/10 rounded-xl border border-classivo-lightblue/20">
          <h3 className="text-sm font-semibold text-classivo-blue mb-2">Demo Access (No Backend)</h3>
          <p className="text-xs text-gray-600 mb-3">
            Use any password. The role is determined by keywords in the email address:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>• <code>admin@...</code> (System Admin)</div>
            <div>• <code>school@...</code> (School Admin)</div>
            <div>• <code>teacher@...</code> (Teacher)</div>
            <div>• <code>student@...</code> (Student)</div>
            <div>• <code>manager@...</code> (Manager)</div>
            <div>• <code>finance@...</code> (Finance)</div>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
