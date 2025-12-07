import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { nameSchema, emailSchema, passwordSchema } from '@/utils/validators';
import { LogIn, Mail, Lock, Building2, User } from 'lucide-react';
import { getDefaultRoute } from '@/config/routes';

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

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      console.log('API_BASE:', API_BASE); // Debug log

      // 1) Call register endpoint
      const registerResp = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // backend expects at minimum email + password
          email: formData.email,
          password: formData.password,
          // include name/school in case you extend backend to store them
          name: formData.name,
          school: formData.school,
        }),
      });

      if (!registerResp.ok) {
        const errBody = await registerResp.json().catch(() => null);
        setLoading(false);
        // If backend returns validation errors, map them
        if (errBody && errBody.error) {
          setErrors({ ...errors, form: String(errBody.error) });
        } else {
          setErrors({ ...errors, form: `Registration failed (${registerResp.status})` });
        }
        return;
      }

      const registered = await registerResp.json();
      // registered should include id, email, roles, status, createdAt per backend README

      // 2) Immediately login to get access token
      const loginResp = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!loginResp.ok) {
        const errBody = await loginResp.json().catch(() => null);
        setLoading(false);
        setErrors({ ...errors, form: 'Login after register failed. Try logging in manually.' });
        return;
      }

      const loginData = await loginResp.json();
      const token = loginData?.accessToken;

      // Build a User object matching your frontend types
      const fullName = formData.name.trim();
      const [firstName, ...rest] = fullName.split(' ');
      const lastName = rest.join(' ') || 'User';

      const user = {
        id: registered.id ?? registered._id ?? 'new',
        email: registered.email ?? formData.email,
        role: (registered.roles && registered.roles[0]) ? registered.roles[0] : ('administrator' as any),
        firstName,
        lastName,
        isActive: registered.status ? registered.status === 'active' : true,
        createdAt: registered.createdAt ?? new Date().toISOString(),
        updatedAt: registered.createdAt ?? new Date().toISOString(),
      };

      // update store and navigate
      login(user as any, token ?? '');
      navigate(getDefaultRoute((user as any).role));
    } catch (error: any) {
      console.error('Registration error:', error); // Debug log
      if (error?.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ form: `Unexpected error: ${error?.message || error?.toString() || 'Please try again.'}` });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SystemHeader />
      <Container size="full" className="py-16">
        <div className="flex items-center justify-center">
          <Card variant="glass" className="w-[26rem] max-w-none mx-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-3">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Get Started</h2>
                <p className="text-gray-600 mt-1">Create your administrator account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && (
                  <div className="text-sm text-red-600 mb-2">{errors.form}</div>
                )}
                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="school"
                      name="school"
                      type="text"
                      value={formData.school}
                      onChange={handleChange}
                      autoComplete="organization"
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.school ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="e.g., Lincoln High School"
                    />
                  </div>
                  {errors.school && <p className="mt-1 text-sm text-red-600">{errors.school}</p>}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="e.g., Sarah Johnson"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full" loading={isLoading}>
                  Create account
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          </Card>
        </div>
      </Container>
      <SystemFooter />
    </div>
  );
}