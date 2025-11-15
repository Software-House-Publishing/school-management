import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/layouts/Container';
import { loginSchema } from '@/utils/validators';
import { getDefaultRoute } from '@/config/routes';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, setLoading, isAuthenticated, user } = useAuthStore();
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
      loginSchema.parse(formData);
      setErrors({});
      setLoading(true);
      
      // Mock login - replace with actual API call
      let role: any = 'student';
      let firstName = 'Demo';
      let lastName = 'User';
      
      // Demo credentials mapping
      if (formData.email.includes('director')) {
        role = 'director';
        firstName = 'Director';
      } else if (formData.email.includes('admin')) {
        role = 'administrator';
        firstName = 'Admin';
      } else if (formData.email.includes('manager')) {
        role = 'manager';
        firstName = 'Manager';
      } else if (formData.email.includes('finance')) {
        role = 'finance_officer';
        firstName = 'Finance';
      } else if (formData.email.includes('help')) {
        role = 'help_desk';
        firstName = 'Help Desk';
      } else if (formData.email.includes('teacher')) {
        role = 'teacher';
        firstName = 'Teacher';
      } else if (formData.email.includes('student')) {
        role = 'student';
        firstName = 'Student';
      }
      
      const mockUser = {
        id: '1',
        email: formData.email,
        role: role,
        firstName: firstName,
        lastName: lastName,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add small delay to simulate API call
      setTimeout(() => {
        login(mockUser, 'mock-token');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <Container size="sm">
        <Card className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('auth.login.title')}
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.login.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.login.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
            >
              {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
            </Button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Director:</strong> director@example.com</p>
              <p><strong>Administrator:</strong> admin@example.com</p>
              <p><strong>Manager:</strong> manager@example.com</p>
              <p><strong>Finance Officer:</strong> finance@example.com</p>
              <p><strong>Help Desk:</strong> help@example.com</p>
              <p><strong>Teacher:</strong> teacher@example.com</p>
              <p><strong>Student:</strong> student@example.com</p>
              <p className="mt-2"><em>Password: Any 8+ character password</em></p>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Mock Google login
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
          </div>
        </Card>
      </Container>
    </div>
  );
}