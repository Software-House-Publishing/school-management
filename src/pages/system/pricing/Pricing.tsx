import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Check, Star, Shield, Zap } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/mo',
      highlight: 'Best for small schools',
      icon: Star,
      features: [
        'Up to 300 students',
        'Core LMS features',
        'Basic reporting',
        'Email support'
      ],
      popular: false,
      color: 'bg-white/40'
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/mo',
      highlight: 'Most popular',
      icon: Zap,
      features: [
        'Up to 2,000 students',
        'All LMS features',
        'Advanced analytics',
        'Priority support',
        'Custom branding'
      ],
      popular: true,
      color: 'bg-white/60'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      highlight: 'For districts and chains',
      icon: Shield,
      features: [
        'Unlimited students',
        'Multi-tenant setup',
        'SSO & compliance',
        'Dedicated success manager',
        '24/7 Phone support'
      ],
      popular: false,
      color: 'bg-white/40'
    }
  ];

  return (
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-classivo-lightblue/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-classivo-blue/20 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
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
            <div className="inline-flex items-center px-4 py-1.5 rounded-full font-medium text-sm bg-white/40 backdrop-blur-md border border-white/60 text-classivo-blue mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-classivo-blue mr-2 animate-pulse" />
              Simple, transparent pricing
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-classivo-black font-display">
              Investment in your <br />
              <span className="text-classivo-blue">future.</span>
            </h1>
            <p className="text-xl md:text-2xl text-classivo-black/60 leading-relaxed max-w-2xl mx-auto font-light">
              Choose a plan that fits your institution today, and scale seamlessly as you grow tomorrow.
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
                className="relative group perspective"
              >
                <div
                  className={`relative h-full p-8 rounded-[2rem] transition-all duration-500 flex flex-col border border-white/60 backdrop-blur-xl ${plan.popular
                      ? 'shadow-2xl z-10 scale-105 bg-white/70'
                      : 'hover:bg-white/60 hover:-translate-y-2 shadow-lg bg-white/40' // Using explicit bg colors from plan object was option, but logic here is cleaner
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-classivo-black text-white text-sm font-medium rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${plan.popular ? 'bg-classivo-blue text-white' : 'bg-white text-classivo-blue'}`}>
                      <plan.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-classivo-black mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-classivo-black tracking-tight">{plan.price}</span>
                      <span className="text-classivo-black/50 font-medium">{plan.period}</span>
                    </div>
                    <p className="text-sm text-classivo-black/50 mt-4 font-medium">{plan.highlight}</p>
                  </div>

                  <div className="w-full h-px bg-classivo-black/5 mb-8" />

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-classivo-black/70 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className={`w-full rounded-xl py-6 font-medium text-base shadow-lg transition-all duration-300 ${plan.popular ? 'hover:scale-105' : ''}`}
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
          <div className="relative rounded-[3rem] p-12 overflow-hidden">
            <div className="absolute inset-0 bg-classivo-blue/5 backdrop-blur-sm border border-white/40 rounded-[3rem]" />
            {/* Decor */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-classivo-lightblue/30 rounded-full blur-3xl mix-blend-multiply" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-classivo-cream/50 rounded-full blur-3xl mix-blend-multiply" />

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-classivo-black mb-6">Need a custom solution?</h2>
              <p className="text-lg text-classivo-black/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                We offer tailored packages for large districts and international school chains.
                Let's talk about how Classivo can fit your specific requirements.
              </p>
              <Button
                onClick={() => navigate('/contact')}
                variant="default"
                size="lg"
                className="rounded-full px-10 shadow-xl"
              >
                Contact SalesTeam
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
