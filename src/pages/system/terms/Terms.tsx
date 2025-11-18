import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Shield, FileText, Users, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Terms() {
  const { t } = useTranslation();

  const sections = [
    {
      title: 'Service Description',
      icon: FileText,
      content: 'We provide a comprehensive school management system that includes student information management, course scheduling, financial management, and communication tools for educational institutions.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'User Responsibilities',
      icon: Users,
      content: 'Schools and educational institutions are responsible for maintaining the accuracy of their data, ensuring compliance with local educational regulations, and protecting student privacy in accordance with applicable laws.',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Data Security and Privacy',
      icon: Shield,
      content: 'We implement industry-standard security measures to protect your data. However, users are responsible for maintaining the confidentiality of their login credentials and ensuring proper access controls within their organization.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Payment and Subscription',
      icon: CreditCard,
      content: 'Our services are provided on a subscription basis. Payment terms, pricing, and billing cycles will be specified in your service agreement. Failure to maintain subscription payments may result in service suspension or termination.',
      color: 'from-orange-500 to-orange-600'
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms and Conditions</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Please read these terms carefully before using our school management platform.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Last Updated Notice */}
      <section className="py-8 bg-yellow-50 border-b border-yellow-200">
        <Container>
          <motion.div 
            className="flex items-center space-x-3 text-yellow-800"
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

      {/* Main Content */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Agreement Overview</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Welcome to our School Management System SaaS platform. By accessing and using our services, 
                    you agree to be bound by these terms and conditions. This agreement governs your use of our 
                    educational technology platform and services.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Main Sections */}
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <div className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg">{section.content}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            {/* Additional Legal Sections */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="space-y-8">
                <Card>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Service Availability</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We strive to maintain 99.9% uptime for our services. However, we do not guarantee uninterrupted 
                      access and reserve the right to perform maintenance and updates as needed. Scheduled maintenance 
                      will be communicated in advance whenever possible.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>99.9% uptime guarantee</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Limitation of Liability</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Our liability is limited to the amount paid for the service in the 12 months preceding any claim. 
                      We are not liable for indirect, incidental, or consequential damages. This limitation applies 
                      to all claims, whether based on warranty, contract, tort, or any other legal theory.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-yellow-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Please read this section carefully</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Modifications to Terms</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We reserve the right to modify these terms at any time. Changes will be communicated to users 
                      via email and through our platform. Continued use of the service constitutes acceptance of the 
                      modified terms. Material changes will be highlighted and users will have the opportunity to review them.
                    </p>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Users will be notified of significant changes</span>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Key Benefits Included</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {importantNotes.map((note, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Questions About These Terms?</h3>
                  <p className="text-gray-700 mb-6">
                    For questions about these terms or any legal concerns, please contact us through our 
                    support channels. We're here to help clarify any aspects of our service agreement.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                      Contact Support
                    </button>
                    <button className="px-6 py-3 border border-purple-300 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200">
                      Legal Inquiries
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}