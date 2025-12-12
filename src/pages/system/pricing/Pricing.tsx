import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Check, CheckCircle, Zap, Star } from 'lucide-react';

export default function Pricing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/mo',
      highlight: 'Best for small schools',
      features: [
        'Up to 300 students',
        'Core LMS features',
        'Basic reporting',
        'Email support'
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/mo',
      highlight: 'Most popular',
      features: [
        'Up to 2,000 students',
        'All LMS features',
        'Advanced analytics',
        'Priority support',
        'Custom branding'
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      highlight: 'For districts and chains',
      features: [
        'Unlimited students',
        'Multi-tenant setup',
        'SSO & compliance',
        'Dedicated success manager',
        '24/7 Phone support'
      ],
      popular: false,
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f]">
      <SystemHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20">
        <Container>
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-gray-900">
              Simple, transparent pricing.
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Choose a plan that fits your institution. Scale seamlessly as you grow.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32">
        <Container>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                <div 
                  className={`relative h-full p-8 rounded-3xl border transition-all duration-300 flex flex-col ${
                    plan.popular 
                      ? 'bg-white border-blue-500 shadow-xl scale-105 z-10' 
                      : 'bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mb-6">{plan.highlight}</p>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-900 tracking-tight">{plan.price}</span>
                      <span className="text-gray-500 ml-2">{plan.period}</span>
                    </div>
                  </div>

                  <div className="flex-grow mb-8 space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-500 shrink-0 mr-3" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full h-12 rounded-xl font-medium transition-all ${
                      plan.popular 
                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                    onClick={() => navigate('/register')}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ or Trust Section could go here */}
      <section className="py-24 border-t border-gray-200">
         <Container>
            <div className="text-center max-w-3xl mx-auto">
               <h2 className="text-3xl font-semibold text-gray-900 mb-6">Need a custom plan?</h2>
               <p className="text-lg text-gray-500 mb-8">
                  We offer tailored solutions for large districts and educational organizations with specific requirements.
               </p>
               <Button 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="h-12 px-8 rounded-full border-gray-300 text-gray-900 hover:bg-gray-50 font-medium"
               >
                  Talk to Sales
               </Button>
            </div>
         </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
