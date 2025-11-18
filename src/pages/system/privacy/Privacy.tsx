import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Shield, Lock, Eye, Database, Users, AlertTriangle, CheckCircle, Mail } from 'lucide-react';

export default function Privacy() {
  const { t } = useTranslation();

  const dataTypes = [
    {
      category: 'Student Information',
      examples: ['Names', 'Contact details', 'Academic records', 'Attendance data'],
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'Institutional Data',
      examples: ['School information', 'Teacher records', 'Course schedules', 'Financial data'],
      icon: Database,
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'Usage Analytics',
      examples: ['Login activity', 'Feature usage', 'Performance metrics', 'System logs'],
      icon: Eye,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const securityMeasures = [
    {
      title: 'Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard protocols.',
      icon: Lock,
      color: 'text-blue-600'
    },
    {
      title: 'Access Controls',
      description: 'Role-based access controls ensure users only access data they need.',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      title: 'Regular Audits',
      description: 'Security audits and vulnerability assessments are conducted regularly.',
      icon: CheckCircle,
      color: 'text-purple-600'
    }
  ];

  const userRights = [
    'Access your personal data',
    'Correct inaccurate data',
    'Request data deletion',
    'Export your data',
    'Object to data processing',
    'Restrict data processing'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SystemHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <Container className="relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Your privacy is our priority. Learn how we collect, use, and protect your personal information.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Last Updated Notice */}
      <section className="py-8 bg-blue-50 border-b border-blue-200">
        <Container>
          <motion.div 
            className="flex items-center space-x-3 text-blue-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </motion.div>
        </Container>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Commitment to Privacy</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  This Privacy Policy describes how we collect, use, and protect your personal information 
                  when you use our School Management System SaaS platform. We are committed to protecting 
                  your privacy and ensuring the security of your data.
                </p>
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Data Types Section */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We collect information necessary to provide our services while maintaining your privacy.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {dataTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{type.category}</h3>
                      <div className="space-y-2">
                        {type.examples.map((example, i) => (
                          <div key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span>{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Security Measures */}
      <section className="py-16 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We implement industry-standard security measures to protect your data.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {securityMeasures.map((measure, index) => {
              const Icon = measure.icon;
              return (
                <motion.div
                  key={measure.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-full ${measure.color} bg-opacity-10 flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-6 h-6 ${measure.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{measure.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{measure.description}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* User Rights */}
      <section className="py-16 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Depending on your jurisdiction, you may have the following rights regarding your personal data. 
                  Schools can manage these requests through their administrative dashboard or by contacting our support team.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {userRights.map((right, index) => (
                    <motion.div
                      key={right}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700">{right}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="p-8 text-center">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Our Data Protection Officer</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  For privacy-related questions, data access requests, or concerns about how we handle your information, 
                  please contact our Data Protection Officer. We're committed to addressing your privacy concerns promptly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                    Contact DPO
                  </button>
                  <button className="px-6 py-3 border border-purple-300 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200">
                    Data Request Form
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}