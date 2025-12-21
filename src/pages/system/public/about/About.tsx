import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { BookOpen, Users, Shield, Globe, Award, Sparkles, Target, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-classivo-lightblue/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-classivo-blue/20 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] left-[30%] w-[50vw] h-[50vw] bg-purple-200/20 blur-[150px] rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-4000" />
      </div>

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
            <div className="inline-flex items-center px-4 py-1.5 rounded-full font-medium text-sm bg-white/40 backdrop-blur-md border border-white/60 text-classivo-blue mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Empowering Education
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-classivo-black font-display">
              We are building the <br />
              <span className="text-classivo-blue">future of learning.</span>
            </h1>
            <p className="text-xl md:text-2xl text-classivo-black/60 leading-relaxed max-w-3xl mx-auto mb-12 font-light">
              We provide modern tools that help schools streamline operations, enhance learning experiences, and foster meaningful connections within their communities.
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
              <div className="glass-panel rounded-[2.5rem] p-12 h-full relative overflow-hidden group bg-white/60 border-white/60">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Target className="w-64 h-64 text-classivo-blue" />
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-10 shadow-sm text-classivo-blue">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold text-classivo-black mb-6 font-display">Our Story</h2>
                  <div className="space-y-6 text-lg text-classivo-black/70 leading-relaxed font-light">
                    <p>
                      Founded with a mission to modernize education management, {t('app.name')} brings together best-in-class technology and thoughtful design to serve schools of all sizes.
                    </p>
                    <p>
                      We believe that technology should fade into the background, allowing educators to focus on what they do best: inspiring the next generation. From multi-portal access to advanced analytics, every feature we build is centered around this core belief.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid gap-6"
            >
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="glass-panel rounded-3xl p-8 flex items-start gap-6 hover:bg-white/80 transition-all hover:scale-[1.02] duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-classivo-blue/10 flex items-center justify-center shrink-0 text-classivo-blue">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-classivo-black mb-2">{value.title}</h3>
                      <p className="text-classivo-black/60 leading-relaxed">{value.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-32 relative">
        <Container>
          <div className="max-w-5xl mx-auto text-center glass-panel p-16 rounded-[3rem] relative overflow-hidden bg-classivo-blue text-white shadow-2xl border-none">
            {/* Decorative Circles */}
            <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
            <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] bg-classivo-lightblue/20 rounded-full blur-3xl mix-blend-overlay" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl text-classivo-blue font-bold mb-8 font-display">Join us on our journey.</h2>
              <p className="text-xl text-classivo-black/80 mb-10 max-w-2xl mx-auto font-light">
                Whether you're looking to transform your school's administration or want to join our team of innovators, we'd love to connect.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => navigate('/contact')}
                  className="h-14 px-10 rounded-2xl bg-white text-classivo-blue hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/careers')}
                  className="h-14 px-10 rounded-2xl border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 font-medium text-lg"
                >
                  View Careers
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
