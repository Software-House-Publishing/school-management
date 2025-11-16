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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      registerSchema.parse(formData);
      setErrors({});
      setLoading(true);
      setTimeout(() => {
        const fullName = formData.name.trim();
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ') || 'User';
        const mockUser = {
          id: 'new-1',
          email: formData.email,
          role: 'administrator' as any,
          firstName,
          lastName,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        login(mockUser, 'mock-register-token');
        navigate(getDefaultRoute(mockUser.role));
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
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
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.school ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
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