import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Check } from 'lucide-react';

export default function Pricing() {
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
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-classivo-lightblue/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-classivo-blue/20 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      </div>

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
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-classivo-black font-display">
              Simple, transparent pricing.
            </h1>
            <p className="text-xl md:text-2xl text-classivo-black/60 leading-relaxed max-w-2xl mx-auto">
              Choose a plan that fits your institution. Scale seamlessly as you grow.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32">
        <Container>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
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
                  className={`relative h-full p-8 rounded-3xl transition-all duration-300 flex flex-col ${
                    plan.popular 
                      ? 'glass-panel border-classivo-blue/30 shadow-2xl scale-105 z-10 bg-white/70' 
                      : 'glass-panel hover:bg-white/60'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-classivo-blue text-white text-sm font-medium rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-classivo-black/70 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-classivo-black">{plan.price}</span>
                      <span className="text-classivo-black/50">{plan.period}</span>
                    </div>
                    <p className="text-sm text-classivo-black/50 mt-2">{plan.highlight}</p>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-classivo-blue shrink-0" />
                        <span className="text-classivo-black/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.popular ? 'default' : 'outline'}
                    className={`w-full rounded-full py-6 font-medium ${
                      plan.popular 
                        ? 'bg-classivo-black text-white hover:bg-classivo-black/80' 
                        : 'border-classivo-black/20 text-classivo-black hover:bg-classivo-black/5'
                    }`}
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="glass-panel rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-classivo-black mb-4">Need a custom solution?</h2>
            <p className="text-lg text-classivo-black/60 mb-8 max-w-2xl mx-auto">
              We offer tailored packages for large districts and international school chains. Let's talk about your specific requirements.
            </p>
            <Button 
              onClick={() => navigate('/contact')}
              className="rounded-full px-8 py-6 bg-classivo-blue hover:bg-classivo-blue/90 text-white font-medium"
            >
              Contact Sales
            </Button>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
