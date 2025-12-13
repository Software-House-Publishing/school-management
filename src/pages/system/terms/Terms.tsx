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
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f]">
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">Terms of Service</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Please read these terms carefully before using our school management platform.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Last Updated Notice */}
      <section className="border-y border-gray-200 bg-white">
        <Container>
          <div className="py-6 flex items-center justify-center space-x-3 text-gray-500">
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
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Agreement to Terms</h2>
              <p className="text-lg text-gray-500 leading-relaxed">
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
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-gray-900" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{section.content}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Service Level Agreement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-900 text-white rounded-3xl p-10 shadow-xl"
            >
              <h2 className="text-2xl font-semibold mb-8">Service Level Commitments</h2>
              <ul className="space-y-4">
                {importantNotes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mr-4" />
                    <span className="text-gray-300 text-lg">{note}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
