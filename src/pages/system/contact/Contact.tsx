import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
} from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      details: ['support@schoolmanagement.com', 'help@schoolmanagement.com'],
      description: 'Get help via email, usually responds within 24 hours'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Available Mon-Fri, 9 AM - 6 PM EST'
    },
    {
      icon: MapPin,
      title: 'Office Address',
      details: ['123 Education Street', 'Learning City, LC 12345', 'United States'],
      description: 'Visit our headquarters for in-person support'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9 AM - 6 PM', 'Saturday: 10 AM - 4 PM', 'Sunday: Closed'],
      description: 'Support available during business hours'
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">Get in touch.</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              We're here to help! Reach out to our support team for any questions, concerns, or feedback.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section className="pb-32">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="h-full bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-gray-900" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{info.title}</h3>
                    <div className="space-y-2 mb-6">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 text-sm font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{info.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Map or additional info could go here */}

      <SystemFooter />
    </div>
  );
}
