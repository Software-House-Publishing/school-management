import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { BookOpen, Users, Shield, Globe, Award, CheckCircle, Zap } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const values = [
    { icon: Shield, title: 'Security First', description: 'Enterprise-grade security with privacy compliance.' },
    { icon: Users, title: 'Human-Centered', description: 'Designed for educators, students, and parents alike.' },
    { icon: Globe, title: 'Global Scale', description: 'Multi-tenant architecture built to grow with you.' },
    { icon: Award, title: 'Excellence', description: 'Continuous improvement and measurable outcomes.' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f]">
      <SystemHeader />

      {/* Hero Section */}
      <section className="pt-40 pb-20">
        <Container>
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-1.5 mb-8 shadow-sm border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-gray-600">Our Mission</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-gray-900">
              Empowering the future of education.
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto mb-12">
              We build modern tools that help schools streamline operations, enhance learning, and connect communities.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Story & Values */}
      <section className="pb-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm h-full">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8">
                  <BookOpen className="w-7 h-7 text-gray-900" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Story</h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-6">
                  Founded with a mission to modernize education management, {t('app.name')} brings together best-in-class technology and thoughtful design to serve schools of all sizes.
                </p>
                <p className="text-lg text-gray-500 leading-relaxed">
                  From multi-portal access to advanced analytics, we focus on what truly matters: empowering educators and improving student outcomes.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid gap-4"
            >
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start space-x-5 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{value.title}</h3>
                      <p className="text-gray-500">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white border-t border-gray-100">
        <Container>
           <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-4xl font-semibold text-gray-900 mb-8">Join us on our journey.</h2>
             <div className="flex justify-center gap-4">
               <Button 
                 onClick={() => navigate('/contact')}
                 className="h-12 px-8 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium"
               >
                 Contact Us
               </Button>
               <Button 
                 variant="outline"
                 onClick={() => navigate('/careers')}
                 className="h-12 px-8 rounded-full border-gray-200 text-gray-900 font-medium"
               >
                 View Careers
               </Button>
             </div>
           </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
