import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@classivo.io',
      description: 'We usually respond within 24 hours.'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (555) 000-0000',
      description: 'Mon-Fri from 9am to 6pm EST.'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'San Francisco, CA',
      description: '100 Smith Street, Suite 500'
    }
  ];

  return (
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-classivo-lightblue/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-classivo-blue/20 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      </div>

      <SystemHeader />

      <section className="pt-40 pb-20">
        <Container>
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full font-medium text-sm bg-white/40 backdrop-blur-md border border-white/60 text-classivo-blue mb-8 shadow-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              We'd love to hear from you
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-classivo-black font-display">
              Get in touch
            </h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed font-light">
              Have questions about our platform? Need a custom demo?
              Our team is ready to help you transform your educational institution.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel p-6 rounded-2xl flex items-start gap-4 hover:bg-white/60 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-classivo-blue">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-classivo-black mb-1">{item.title}</h3>
                    <p className="text-classivo-blue font-medium mb-1">{item.content}</p>
                    <p className="text-sm text-classivo-black/50">{item.description}</p>
                  </div>
                </motion.div>
              ))}

              <div className="glass-panel p-8 rounded-3xl mt-8 bg-classivo-blue/5 border-classivo-blue/10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-classivo-blue" />
                  <h3 className="font-semibold text-lg">Support Hours</h3>
                </div>
                <p className="text-classivo-black/70 mb-2">Our support team is available:</p>
                <ul className="space-y-2 text-sm text-classivo-black/60">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <form className="glass-panel p-8 md:p-12 rounded-[2.5rem] space-y-8 bg-white/60">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-classivo-black/70 ml-1">First Name</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl glass-input bg-white/50 focus:ring-0 placeholder:text-gray-400"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-classivo-black/70 ml-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl glass-input bg-white/50 focus:ring-0 placeholder:text-gray-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-classivo-black/70 ml-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-6 py-4 rounded-2xl glass-input bg-white/50 focus:ring-0 placeholder:text-gray-400"
                    placeholder="jane@school.edu"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-classivo-black/70 ml-1">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-6 py-4 rounded-2xl glass-input bg-white/50 focus:ring-0 placeholder:text-gray-400 resize-none"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full md:w-auto px-12 h-14 rounded-xl text-lg shadow-xl" variant="default">
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
