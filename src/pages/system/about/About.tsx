import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { BookOpen, Users, Shield, Globe, Award } from 'lucide-react';

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
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-classivo-lightblue/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-classivo-blue/20 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-purple-200/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
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
            <div className="inline-flex items-center space-x-2 glass-panel rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-classivo-blue"></span>
              <span className="text-sm font-medium text-classivo-black/70">Our Mission</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-classivo-black font-display">
              Empowering the future of education.
            </h1>
            <p className="text-xl md:text-2xl text-classivo-black/60 leading-relaxed max-w-3xl mx-auto mb-12">
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
              <div className="glass-panel rounded-3xl p-10 h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center mb-8 shadow-sm">
                  <BookOpen className="w-7 h-7 text-classivo-blue" />
                </div>
                <h2 className="text-3xl font-semibold text-classivo-black mb-6">Our Story</h2>
                <p className="text-lg text-classivo-black/70 leading-relaxed mb-6">
                  Founded with a mission to modernize education management, {t('app.name')} brings together best-in-class technology and thoughtful design to serve schools of all sizes.
                </p>
                <p className="text-lg text-classivo-black/70 leading-relaxed">
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
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="glass-panel rounded-2xl p-6 flex items-start space-x-5 hover:bg-white/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="w-6 h-6 text-classivo-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-classivo-black mb-1">{value.title}</h3>
                      <p className="text-classivo-black/60">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <Container>
           <div className="max-w-4xl mx-auto text-center glass-panel p-12 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-classivo-lightblue via-classivo-blue to-classivo-lightblue" />
             <h2 className="text-4xl font-semibold text-classivo-black mb-8">Join us on our journey.</h2>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Button 
                 onClick={() => navigate('/contact')}
                 className="h-12 px-8 rounded-full bg-classivo-black hover:bg-classivo-black/80 text-white font-medium shadow-lg hover:shadow-xl transition-all"
               >
                 Contact Us
               </Button>
               <Button 
                 variant="outline"
                 onClick={() => navigate('/careers')}
                 className="h-12 px-8 rounded-full border-classivo-black/20 text-classivo-black font-medium hover:bg-classivo-black/5"
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
