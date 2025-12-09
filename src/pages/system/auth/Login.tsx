import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { loginSchema } from '@/utils/validators';
import { getDefaultRoute } from '@/config/routes';
import { LogIn, Mail, Lock } from 'lucide-react';

// 🔑 Backend base URL (change VITE_API_URL in .env if you want)
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, setLoading, isAuthenticated, user } =
    useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDemo, setShowDemo] = useState(false);

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
        // backend sends { message: "Invalid email or password" }
        setLoading(false);
        setErrors((prev) => ({
          ...prev,
          general: data.message || 'Login failed',
        }));
        return;
      }

      const apiUser = data.user;

      // map backend roles to frontend roles
      let appRole: string;
      switch (apiUser.role) {
        case 'admin':
          appRole = 'director';        // highest power
          break;
        case 'school_admin':
          appRole = 'administrator';   // school-level admin
          break;
        default:
          appRole = apiUser.role;      // teacher, student stay the same
      }

      const [firstName, ...rest] = (apiUser.name || '').split(' ');
      const lastName = rest.join(' ');

      const mappedUser = {
        id: apiUser.id,
        email: apiUser.email,
        role: appRole, // 👈 use mapped role here
        firstName: firstName || '',
        lastName: lastName || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // ✅ save to global auth store (token + user)
      login(mappedUser as any, data.token);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);

      // Zod validation errors
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: 'Unexpected error, please try again.',
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SystemHeader />
      <Container size="full" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          <Card variant="glass" className="w-[26rem] max-w-none mx-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-3">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t('auth.login.title')}
                </h2>
                <p className="text-gray-600 mt-1">
                  Sign in to your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* optional general error */}
                {errors.general && (
                  <p className="text-sm text-red-600 text-center">
                    {errors.general}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t('auth.login.email')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t('auth.login.password')}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" className="w-full" loading={isLoading}>
                  {isLoading
                    ? t('auth.login.loading')
                    : t('auth.login.submit')}
                </Button>
              </form>

              {/* Google/demo stuff below left mostly as-is */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const mockUser = {
                        id: '1',
                        email: 'student@example.com',
                        role: 'student' as any,
                        firstName: 'Student',
                        lastName: 'User',
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };
                      login(mockUser, 'mock-google-token');
                    }}
                  >
                    {t('auth.login.google')}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => setShowDemo((v) => !v)}
                >
                  {showDemo
                    ? 'Hide demo credentials'
                    : 'Show demo credentials'}
                </Button>

                <AnimatePresence>
                  {showDemo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden mt-4"
                    >
                      <Card className="bg-blue-50">
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-blue-900 mb-2">
                            Demo Credentials
                          </h3>
                          <div className="text-xs text-blue-800 grid grid-cols-2 gap-x-6 gap-y-1">
                            <p>
                              <strong>Director:</strong>{' '}
                              director@example.com
                            </p>
                            <p>
                              <strong>Administrator:</strong>{' '}
                              admin@example.com
                            </p>
                            <p>
                              <strong>Manager:</strong>{' '}
                              manager@example.com
                            </p>
                            <p>
                              <strong>Finance Officer:</strong>{' '}
                              finance@example.com
                            </p>
                            <p>
                              <strong>Help Desk:</strong>{' '}
                              help@example.com
                            </p>
                            <p>
                              <strong>Teacher:</strong>{' '}
                              teacher@example.com
                            </p>
                            <p>
                              <strong>Student:</strong>{' '}
                              student@example.com
                            </p>
                          </div>
                          <p className="mt-3 text-xs text-blue-900">
                            <em>Password: Any 8+ character password</em>
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-blue-600 hover:underline"
                  >
                    Get started
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
      <SystemFooter />
    </div>
  );
}
