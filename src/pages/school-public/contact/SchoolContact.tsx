import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import SchoolHeader from '@/components/layouts/SchoolHeader';
import SchoolFooter from '@/components/layouts/SchoolFooter';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  User,
  MessageSquare
} from 'lucide-react';

interface SchoolContactData {
  schoolName: string;
  primaryColor?: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    officeHours?: string;
    principal?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function SchoolContact() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [schoolData, setSchoolData] = useState<SchoolContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    // TODO: Fetch school contact data from backend API
    const mockSchoolData: SchoolContactData = {
      schoolName: "Example School",
      primaryColor: "from-blue-600 to-blue-700",
      contactInfo: {
        email: "info@exampleschool.edu",
        phone: "+1 (555) 123-4567",
        address: "123 Education Street, Learning City, LC 12345",
        officeHours: "Monday - Friday: 8:00 AM - 4:00 PM",
        principal: "Dr. Jane Smith"
      },
      socialMedia: {
        facebook: "https://facebook.com/exampleschool",
        twitter: "https://twitter.com/exampleschool",
        instagram: "https://instagram.com/exampleschool"
      }
    };

    setTimeout(() => {
      setSchoolData(mockSchoolData);
      setLoading(false);
    }, 1000);
  }, [schoolId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!schoolData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">School Not Found</h2>
          <p className="text-gray-600">The school you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SchoolHeader />
      
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-r ${schoolData.primaryColor} text-white py-20`}>
        <div className="absolute inset-0 bg-black/20" />
        <Container className="relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              We're here to help! Reach out to our team for any questions, admissions, or support.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section className="py-16">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Us</h3>
                  <p className="text-gray-600 text-sm">{schoolData.contactInfo.email}</p>
                  <p className="text-gray-500 text-xs mt-2">Usually responds within 24 hours</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Call Us</h3>
                  <p className="text-gray-600 text-sm">{schoolData.contactInfo.phone}</p>
                  <p className="text-gray-500 text-xs mt-2">Mon-Fri, 8 AM - 4 PM</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Visit Us</h3>
                  <p className="text-gray-600 text-sm">{schoolData.contactInfo.address}</p>
                  <p className="text-gray-500 text-xs mt-2">Schedule a campus tour</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Office Hours</h3>
                  <p className="text-gray-600 text-sm">{schoolData.contactInfo.officeHours}</p>
                  <p className="text-gray-500 text-xs mt-2">Best time to visit</p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Contact Form Section */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-white to-gray-50">
                <div className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                    <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="What's this about?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </motion.button>
                  </form>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      <SchoolFooter />
    </div>
  );
}