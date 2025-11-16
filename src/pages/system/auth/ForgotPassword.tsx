import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { emailSchema } from '@/utils/validators';
import { Mail, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SystemHeader />
      <Container size="full" className="py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-center">
          <Card variant="glass" className="w-[26rem] max-w-none mx-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-3">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Forgot Password</h2>
                <p className="text-gray-600 mt-1">Enter your email to receive a reset link</p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          error ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                  </div>

                  <Button type="submit" className="w-full" loading={submitting}>
                    Send reset link
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                    If an account exists for the provided email, a password reset link has been sent.
                  </div>
                  <Button type="button" className="w-full" onClick={() => navigate('/login')}>
                    Back to Sign In
                  </Button>
                </div>
              )}

              <p className="mt-6 text-center text-sm text-gray-600">
                Remembered your password?{' '}
                <button type="button" onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </Container>
      <SystemFooter />
    </div>
  );
}