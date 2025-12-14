import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import {
  BookOpen,
  Users,
  CreditCard,
  Shield,
  TrendingUp,
  Award,
  ArrowRight,
  Star
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Learning Management',
      description: 'Comprehensive course management, student tracking, and academic tools.',
    },
    {
      icon: Users,
      title: 'Multi-Portal Access',
      description: 'Dedicated portals for students, teachers, and administrators.',
    },
    {
      icon: CreditCard,
      title: 'Financial Management',
      description: 'Fee management, salary processing, and financial reporting.',
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with GDPR and privacy compliance.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Reports',
      description: 'Real-time insights and comprehensive reporting tools.',
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Student performance monitoring and achievement recognition.',
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Schools' },
    { number: '1M+', label: 'Students Managed' },
    { number: '50K+', label: 'Teachers Supported' },
    { number: '99.9%', label: 'Uptime Guarantee' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Principal, Lincoln High School',
      content: 'Classivo has transformed how we manage our school. The intuitive interface and comprehensive features make daily operations seamless.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'IT Director, Riverside District',
      content: 'The multi-tenant architecture and security features give us confidence in managing multiple schools efficiently.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Teacher, Oakwood Elementary',
      content: 'I love how easy it is to track student progress and communicate with parents. It has made my job so much easier.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-classivo-lightblue/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-classivo-blue/20 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-purple-200/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
      </div>

      <SystemHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <Container>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full glass-panel text-sm font-medium text-classivo-blue mb-8 border border-white/60">
                <span className="flex w-2 h-2 bg-classivo-blue rounded-full mr-2 animate-pulse" />
                New: AI-Powered Analytics 2.0
              </span>
              <h1 className="text-6xl lg:text-8xl font-semibold tracking-tight leading-[1.05] mb-8 text-classivo-black font-display">
                Classivo.
                <span className="block text-4xl lg:text-6xl text-gray-500 mt-2 font-normal">Education Reimagined.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
                A liquid-smooth, intuitive platform designed to streamline administration, enhance learning, and connect your entire school community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => navigate('/register')}
                  className="h-14 px-10 rounded-full bg-classivo-blue hover:bg-classivo-blue/90 text-white text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-14 px-10 rounded-full glass-button text-classivo-blue text-lg backdrop-blur-md w-full sm:w-auto hover:bg-white"
                >
                  View Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="mt-24 relative mx-auto max-w-6xl"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl glass-panel p-2">
              <div className="aspect-[16/9] bg-white/50 rounded-xl overflow-hidden flex items-center justify-center text-gray-400 relative">
                {/* Placeholder for dashboard screenshot - Ideal place for a real screenshot later */}
                <div className="absolute inset-0 bg-gradient-to-tr from-classivo-cream to-white opacity-50" />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-3xl glass-button flex items-center justify-center shadow-lg">
                    <BookOpen className="w-10 h-10 text-classivo-blue" />
                  </div>
                  <p className="font-medium text-lg text-classivo-blue">Classivo Dashboard</p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -right-12 -bottom-12 w-72 p-5 rounded-3xl glass-panel shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Growth</p>
                  <p className="text-xl font-bold text-gray-900">+24% Enrollment</p>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-green-500 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 glass-panel rounded-3xl hover:bg-white/40 transition-colors duration-300"
              >
                <p className="text-4xl lg:text-5xl font-bold text-classivo-blue mb-2">{stat.number}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-semibold text-classivo-black mb-6 tracking-tight">Everything you need.</h2>
            <p className="text-xl text-gray-600">
              A comprehensive suite of tools designed to help you manage every aspect of your educational institution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl glass-panel hover:bg-white/80 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm text-classivo-blue">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-semibold text-classivo-black mb-6 tracking-tight">Trusted by educators.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl glass-panel bg-white/30 border-white/60"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-800 mb-8 leading-relaxed font-medium">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-classivo-black" />
        <div className="absolute inset-0 bg-classivo-blue/20 blur-[100px]" />
        <Container>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-8 tracking-tight">
              Ready to transform your school?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
              Join thousands of schools that trust Classivo to power their education journey. Start your free trial today.
            </p>
            <Button
              onClick={() => navigate('/contact')}
              className="h-16 px-12 rounded-full bg-white hover:bg-gray-100 text-classivo-black text-lg font-medium shadow-2xl hover:shadow-white/10 transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
