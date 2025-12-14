import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Shield, Lock, Eye, Database, Users, CheckCircle } from 'lucide-react';

export default function Privacy() {
  const dataTypes = [
    {
      category: 'Student Information',
      examples: ['Names', 'Contact details', 'Academic records', 'Attendance data'],
      icon: Users,
    },
    {
      category: 'Institutional Data',
      examples: ['School information', 'Teacher records', 'Course schedules', 'Financial data'],
      icon: Database,
    },
    {
      category: 'Usage Analytics',
      examples: ['Login activity', 'Feature usage', 'Performance metrics', 'System logs'],
      icon: Eye,
    }
  ];

  const securityMeasures = [
    {
      title: 'Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard protocols.',
      icon: Lock,
    },
    {
      title: 'Access Controls',
      description: 'Role-based access controls ensure users only access data they need.',
      icon: Shield,
    },
    {
      title: 'Regular Audits',
      description: 'Security audits and vulnerability assessments are conducted regularly.',
      icon: CheckCircle,
    }
  ];

  return (
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-classivo-lightblue/30 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-classivo-blue/20 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      </div>

      <SystemHeader />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20">
        <Container>
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">Privacy Policy</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed">
              Your privacy is our priority. Learn how we collect, use, and protect your personal information.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Last Updated Notice */}
      <section className="border-y border-classivo-black/5 bg-white/30 backdrop-blur-sm">
        <Container>
          <div className="py-6 flex items-center justify-center space-x-3 text-classivo-black/60">
            <span className="text-sm font-medium">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <Container>
          <div className="max-w-4xl mx-auto space-y-24">
            
            {/* Data Collection */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-semibold text-classivo-black mb-6">Data We Collect</h2>
                <p className="text-lg text-classivo-black/60 leading-relaxed mb-12">
                  We collect information necessary to provide our educational management services. This data is handled with the utmost care and in strict compliance with global privacy regulations.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {dataTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <motion.div
                      key={type.category}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="glass-panel rounded-3xl p-8 hover:bg-white/40 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center mb-6 text-classivo-blue shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-classivo-black mb-4">{type.category}</h3>
                      <ul className="space-y-2">
                        {type.examples.map((example) => (
                          <li key={example} className="text-classivo-black/60 text-sm flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-classivo-lightblue mr-2"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Security Measures */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-semibold text-classivo-black mb-6">How We Protect Your Data</h2>
                <p className="text-lg text-classivo-black/60 leading-relaxed mb-12">
                  We employ enterprise-grade security measures to safeguard your information against unauthorized access, alteration, or destruction.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-1 gap-6">
                {securityMeasures.map((measure, index) => {
                  const Icon = measure.icon;
                  return (
                    <motion.div
                      key={measure.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="glass-panel rounded-2xl p-6 flex items-start space-x-6 hover:bg-white/40 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center shrink-0 text-classivo-blue shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-classivo-black mb-2">{measure.title}</h3>
                        <p className="text-classivo-black/60">{measure.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Contact for Privacy */}
            <div className="glass-panel rounded-3xl p-10 text-center">
              <h2 className="text-2xl font-semibold text-classivo-black mb-4">Questions about privacy?</h2>
              <p className="text-classivo-black/60 mb-8 max-w-xl mx-auto">
                If you have any questions or concerns about our privacy practices, please contact our Data Protection Officer.
              </p>
              <a 
                href="mailto:privacy@classivo.com" 
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-classivo-black text-white font-medium hover:bg-classivo-black/80 transition-colors shadow-lg"
              >
                Contact Privacy Team
              </a>
            </div>

          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
