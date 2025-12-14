import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      details: ['support@classivo.com', 'help@classivo.com'],
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
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-classivo-black font-display">Get in touch.</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed max-w-2xl mx-auto">
              We're here to help! Reach out to our support team for any questions, concerns, or feedback about Classivo.
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
                  <div className="h-full glass-panel rounded-3xl p-8 hover:bg-white/40 transition-all duration-300 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 text-classivo-blue">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-classivo-black mb-4">{info.title}</h3>
                    <div className="space-y-2 mb-6">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-classivo-black/80 text-sm font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-classivo-black/50 text-xs leading-relaxed font-light">{info.description}</p>
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
