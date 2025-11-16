import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { loginSchema } from '@/utils/validators';

interface SchoolLoginData {
  schoolName: string;
  logo?: string;
  primaryColor?: string;
  schoolId: string;
}

export default function SchoolLogin() {
  const { t } = useTranslation();
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const { login, isLoading, setLoading, isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [schoolData, setSchoolData] = useState<SchoolLoginData | null>(null);
  const [loadingSchool, setLoadingSchool] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultRoute = `/${schoolId}${getDefaultRoute(user.role)}`;
      navigate(defaultRoute);
    }
  }, [isAuthenticated, user, navigate, schoolId]);

  useEffect(() => {
    // TODO: Fetch school data from backend API
    const mockSchoolData: SchoolLoginData = {
      schoolName: "Example School",
      logo: "https://via.placeholder.com/150x150/0066cc/ffffff?text=ES",
      primaryColor: "#0066cc",
      schoolId: schoolId || "example-school"
    };

    setTimeout(() => {
      setSchoolData(mockSchoolData);
      setLoadingSchool(false);
    }, 1000);
  }, [schoolId]);

  const getDefaultRoute = (role: string): string => {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      default:
        return '/admin/dashboard';
    }
  };

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
        schoolId: schoolId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add small delay to simulate API call
      setTimeout(() => {
        login(mockUser, 'mock-token');
        setLoading(false);
        
        // Navigate to school-specific dashboard
        const defaultRoute = `/${schoolId}${getDefaultRoute(role)}`;
        navigate(defaultRoute);
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

  if (loadingSchool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">School Not Found</h2>
          <p className="text-gray-600">The school you're trying to access doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-16">
      <Container size="full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card variant="glass" className="w-[26rem] max-w-none mx-auto">
          {/* School Header */}
          <div className="text-center mb-6">
            {schoolData.logo && (
              <img 
                src={schoolData.logo} 
                alt={schoolData.schoolName}
                className="w-20 h-20 mx-auto mb-4 rounded-full"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {schoolData.schoolName}
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to access your account
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
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}