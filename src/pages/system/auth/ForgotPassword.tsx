import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { emailSchema } from '@/utils/validators';
import { Mail, ArrowRight, KeyRound } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(email);
      setError('');
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Invalid email');
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We have sent a password reset link to your email address."
      >
        <div className="text-center space-y-6">
           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
             <Mail className="w-8 h-8 text-blue-600" />
           </div>
           <p className="text-sm text-gray-600">
             Did not receive the email? Check your spam filter, or{' '}
             <button onClick={() => setSubmitted(false)} className="text-blue-600 hover:underline">
               try another email address
             </button>
             .
           </p>
           <Button 
             onClick={() => navigate('/login')}
             className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300"
           >
             Back to Sign In
           </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll send you reset instructions."
      footer={
        <>
          <a href="/login" className="font-medium text-gray-900 hover:underline flex items-center justify-center">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Sign In
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 ml-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all ${
                error ? 'border-red-500 bg-red-50/50' : 'border-transparent'
              }`}
              placeholder="name@school.com"
            />
          </div>
          {error && <p className="ml-1 text-sm text-red-600">{error}</p>}
        </div>

        <Button
          type="submit"
          isLoading={submitting}
          className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  );
}
