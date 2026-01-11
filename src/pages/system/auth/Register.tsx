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

const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log('api: ', API_BASE_URL);


export default function Register() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // validate
      loginSchema.parse(formData);
      setErrors({});
      setLoading(true);

      // First: register
      const regRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      let regData: any = {};
      try { regData = await regRes.json(); } catch {}

      if (!regRes.ok) {
        // Surface server error (don't fall back to mock for invalid input)
        setErrors({ general: regData.error || regData.message || 'Registration failed' });
        setLoading(false);
        return;
      }

      // After registration, perform login to obtain token
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

      // Map roles -> frontend role enums
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
        id: apiUser.id || regData.id || 'new-1',
        email: apiUser.email || formData.email,
        role: appRole,
        firstName: firstName || '',
        lastName: rest.join(' ') || '',
        isActive: apiUser.status ? apiUser.status === 'active' : true,
        createdAt: apiUser.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schoolName: apiUser.schoolName || 'St. Mary’s High School',
      };

      // Persist login in store and navigate
      login(mappedUser, token);
      navigate(getDefaultRoute(mappedUser.role));
      setLoading(false);

    } catch (error: unknown) {
      setLoading(false);
      // Zod validation errors
      if (typeof error === 'object' && error !== null && 'errors' in error) {
        const newErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allErrs: any[] = (error as any).errors || [];
        allErrs.forEach((err: any) => {
          const key = err?.path?.[0] || 'general';
          if (!newErrors[key]) newErrors[key] = err.message;
        });

        // collapse password messages into a single friendly message
        const pwErrCount = allErrs.filter((e) => e?.path?.[0] === 'password').length;
        if (pwErrCount > 0) {
          newErrors['password'] = 'Password must include an uppercase letter, a number and a special character';
        }

        setErrors(newErrors);
      } else {
        console.error('Registration error:', error);
        setErrors({ general: error instanceof Error ? error.message : String(error) });
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