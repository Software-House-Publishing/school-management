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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">Privacy Policy</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Your privacy is our priority. Learn how we collect, use, and protect your personal information.
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
          <div className="max-w-4xl mx-auto space-y-24">
            
            {/* Data Collection */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Data We Collect</h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-12">
                  We collect information necessary to provide our educational management services. This data is handled with the utmost care and in strict compliance with global privacy regulations.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {dataTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <motion.div
                      key={type.category}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                        <Icon className="w-6 h-6 text-gray-900" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{type.category}</h3>
                      <ul className="space-y-3">
                        {type.examples.map((example) => (
                          <li key={example} className="flex items-center text-gray-500 text-sm">
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Security */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">How We Protect Your Data</h2>
                <p className="text-lg text-gray-500 leading-relaxed mb-12">
                  Security is built into every layer of our platform. We employ enterprise-grade security measures to ensure your data remains safe and confidential.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {securityMeasures.map((measure, index) => {
                  const Icon = measure.icon;
                  return (
                    <motion.div
                      key={measure.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="flex flex-col h-full"
                    >
                      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex-1">
                         <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                           <Icon className="w-6 h-6 text-gray-900" />
                         </div>
                         <h3 className="text-lg font-semibold text-gray-900 mb-3">{measure.title}</h3>
                         <p className="text-gray-500 text-sm leading-relaxed">{measure.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Contact for Privacy */}
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions about your privacy?</h2>
               <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
                 If you have any questions or concerns about how we handle your data, please don't hesitate to reach out to our Data Protection Officer.
               </p>
               <a 
                 href="mailto:privacy@schoolmanagement.com"
                 className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors"
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
