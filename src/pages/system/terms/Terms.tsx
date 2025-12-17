import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Shield, FileText, Users, CreditCard, CheckCircle } from 'lucide-react';

export default function Terms() {
  const sections = [
    {
      title: 'Service Description',
      icon: FileText,
      content: 'We provide a comprehensive school management system that includes student information management, course scheduling, financial management, and communication tools for educational institutions.',
    },
    {
      title: 'User Responsibilities',
      icon: Users,
      content: 'Schools and educational institutions are responsible for maintaining the accuracy of their data, ensuring compliance with local educational regulations, and protecting student privacy in accordance with applicable laws.',
    },
    {
      title: 'Data Security and Privacy',
      icon: Shield,
      content: 'We implement industry-standard security measures to protect your data. However, users are responsible for maintaining the confidentiality of their login credentials and ensuring proper access controls within their organization.',
    },
    {
      title: 'Payment and Subscription',
      icon: CreditCard,
      content: 'Our services are provided on a subscription basis. Payment terms, pricing, and billing cycles will be specified in your service agreement. Failure to maintain subscription payments may result in service suspension or termination.',
    }
  ];

  const importantNotes = [
    'Service availability is guaranteed at 99.9% uptime',
    'Data backup and recovery services are included',
    'Regular security updates and maintenance',
    'Compliance with educational data protection laws',
    '24/7 customer support for critical issues'
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">Terms of Service</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed">
              Please read these terms carefully before using our school management platform.
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
          <div className="max-w-4xl mx-auto space-y-20">
            
            {/* Agreement Intro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-semibold text-classivo-black mb-6">Agreement to Terms</h2>
              <p className="text-lg text-classivo-black/60 leading-relaxed">
                By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
              </p>
            </motion.div>

            {/* Terms Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="glass-panel rounded-3xl p-8 hover:bg-white/40 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center mb-6 text-classivo-blue shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-classivo-black mb-4">{section.title}</h3>
                    <p className="text-classivo-black/70 leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-panel rounded-3xl p-10"
            >
              <h3 className="text-2xl font-semibold text-classivo-black mb-8">Service Level Agreement</h3>
              <div className="grid md:grid-cols-1 gap-4">
                {importantNotes.map((note) => (
                  <div key={note} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-classivo-blue shrink-0" />
                    <span className="text-classivo-black/80">{note}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
