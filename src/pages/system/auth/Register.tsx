import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { nameSchema, emailSchema, passwordSchema } from '@/utils/validators';
import { Mail, Lock, Building2, User, ArrowRight } from 'lucide-react';
import { getDefaultRoute } from '@/config/routes';
import AuthLayout from '@/components/layouts/AuthLayout';
import { UserRole } from '@/types/auth';

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
          role: 'school_administrator' as UserRole,
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
    } catch (error: unknown) {
      setLoading(false);
      if (typeof error === 'object' && error !== null && 'errors' in error) {
        const newErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
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
      </form>
    </AuthLayout>
  );
}
