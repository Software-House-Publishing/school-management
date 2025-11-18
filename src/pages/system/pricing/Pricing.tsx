import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { CheckCircle, Zap, Star } from 'lucide-react';

export default function Pricing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: '$49/mo',
      highlight: 'Best for small schools',
      features: [
        'Up to 300 students',
        'Core LMS features',
        'Basic reporting',
        'Email support'
      ],
      popular: false,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Professional',
      price: '$99/mo',
      highlight: 'Most popular',
      features: [
        'Up to 2,000 students',
        'All LMS features',
        'Advanced analytics',
        'Priority support'
      ],
      popular: true,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      highlight: 'For districts and chains',
      features: [
        'Unlimited students',
        'Multi-tenant setup',
        'SSO & compliance',
        'Dedicated success manager'
      ],
      popular: false,
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SystemHeader />

      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <Container className="relative z-10 py-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Flexible pricing for every school</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Choose a plan that fits your institution. Scale seamlessly as you grow.
            </p>
            <div className="mt-8">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                Start Free Trial
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container>
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Plans</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">No hidden fees. Cancel anytime.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                  <div className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <Star className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                      <div className="text-xl font-bold text-blue-600">{plan.price}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-6">{plan.highlight}</div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                      onClick={() => navigate('/register')}
                    >
                      Choose Plan
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <Container>
          <Card>
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">All plans include</div>
                  <p className="text-gray-600">Core LMS, secure hosting, updates, and support.</p>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Student and teacher portals</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Communication tools</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Basic analytics</span></div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Role-based access</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>GDPR & privacy compliance</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Fast onboarding</span></div>
                </div>
              </div>
              <div className="mt-10 text-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                  onClick={() => navigate('/contact')}
                >
                  Talk to Sales
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}