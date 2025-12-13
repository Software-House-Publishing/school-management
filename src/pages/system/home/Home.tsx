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
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f]">
      <SystemHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-100/20 blur-[120px] rounded-full pointer-events-none" />
        
        <Container>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/50 border border-black/5 backdrop-blur-sm text-sm font-medium text-gray-600 mb-6">
                <span className="flex w-2 h-2 bg-green-500 rounded-full mr-2" />
                New: AI-Powered Analytics 2.0
              </span>
              <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-10 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
                School Management,<br />Reimagined.
              </h1>
              <p className="text-xl lg:text-2xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
                A powerful, intuitive platform designed to streamline administration, enhance learning, and connect your entire school community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={() => navigate('/contact')}
                  className="h-14 px-8 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-14 px-8 rounded-full border-gray-200 bg-white/50 hover:bg-white text-gray-900 text-lg font-medium backdrop-blur-sm w-full sm:w-auto"
                >
                  View Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-6xl"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/40 bg-white/40 backdrop-blur-xl">
              <div className="aspect-[16/9] bg-gray-50/50 flex items-center justify-center text-gray-400">
                 {/* Placeholder for dashboard screenshot */}
                 <div className="text-center">
                   <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner flex items-center justify-center">
                     <BookOpen className="w-10 h-10 text-gray-400" />
                   </div>
                   <p className="font-medium">Dashboard Preview</p>
                 </div>
              </div>
            </div>
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-8 -bottom-8 w-64 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Growth</p>
                  <p className="text-lg font-semibold text-gray-900">+24% Enrollment</p>
                </div>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-green-500 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-2">{stat.number}</p>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-6">Everything you need to run your school.</h2>
            <p className="text-xl text-gray-500">
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
                className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-white overflow-hidden">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-6">Trusted by educators worldwide.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-[#F5F5F7] border border-transparent hover:border-gray-200 transition-colors"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-900 mb-8 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1d1d1f] relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px]" />
        <Container>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-8">
              Ready to transform your school?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of schools that trust us to power their education journey. Start your free trial today.
            </p>
            <Button 
              onClick={() => navigate('/contact')}
              className="h-16 px-10 rounded-full bg-white hover:bg-gray-100 text-[#1d1d1f] text-lg font-medium shadow-2xl hover:shadow-white/10 transition-all duration-300"
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
