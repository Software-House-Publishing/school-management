import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
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
  Globe, 
  Zap,
  Star,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Learning Management',
      description: 'Comprehensive course management, student tracking, and academic tools.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Multi-Portal Access',
      description: 'Dedicated portals for students, teachers, and administrators.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: CreditCard,
      title: 'Financial Management',
      description: 'Fee management, salary processing, and financial reporting.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with GDPR and privacy compliance.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Reports',
      description: 'Real-time insights and comprehensive reporting tools.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Student performance monitoring and achievement recognition.',
      color: 'from-yellow-500 to-yellow-600'
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
      content: 'This system has transformed how we manage our school. The intuitive interface and comprehensive features make daily operations seamless.',
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
    <div className="min-h-screen bg-gray-50">
      <SystemHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-slate-900/10 to-transparent" />
        </div>
        
        <Container className="relative z-10 py-32">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Trusted by 10,000+ Schools Worldwide</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Transform Your School with
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {t('app.tagline')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                Start Free Trial
              </Button>
              <button 
                onClick={() => navigate('/demo')}
                className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg backdrop-blur-sm transition-all duration-200 shadow-lg"
              >
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manage Your School
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for educational institutions to streamline operations and enhance learning.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="text-center p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Schools
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what educators and administrators are saying about our platform.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <div className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-800 text-white">
        <Container>
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your School?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of schools already using our platform to enhance education and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                Start Your Free Trial
              </Button>
              <button 
                onClick={() => navigate('/schedule-demo')}
                className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg backdrop-blur-sm transition-all duration-200"
              >
                Schedule a Demo
              </button>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}