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
    <div className="min-h-screen bg-gray-50">
      <SystemHeader />

      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <Container className="relative z-10 py-24">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Empowering education with technology</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About {t('app.name')}</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              We build modern tools that help schools streamline operations, enhance learning, and connect communities.
            </p>
            <div className="mt-8">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Our Story</div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Founded with a mission to modernize education management, {t('app.name')} brings together best-in-class technology and thoughtful design to serve schools of all sizes.
                    From multi-portal access to advanced analytics, we focus on what truly matters: empowering educators and improving student outcomes.
                  </p>
                </div>
              </Card>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <div className="p-8">
                  <div className="text-2xl font-bold text-gray-900 mb-4">Our Values</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {values.map((value) => {
                      const Icon = value.icon;
                      return (
                        <div key={value.title} className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{value.title}</div>
                            <div className="text-gray-600">{value.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container>
          <Card>
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">Impact</div>
                  <p className="text-gray-600">Trusted by schools worldwide with measurable, positive outcomes.</p>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Improved communication</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Streamlined operations</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Data-driven decisions</span></div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Secure and compliant</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Scales with growth</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Modern user experience</span></div>
                </div>
              </div>
              <div className="mt-10 text-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                  onClick={() => navigate('/pricing')}
                >
                  Explore Pricing
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