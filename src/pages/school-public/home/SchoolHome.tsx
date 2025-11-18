import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SchoolHeader from '@/components/layouts/SchoolHeader';
import SchoolFooter from '@/components/layouts/SchoolFooter';
import { 
  BookOpen, 
  Users, 
  Award, 
  Shield, 
  TrendingUp, 
  Zap,
  Star,
  CheckCircle,
  Globe,
  Clock,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

interface SchoolHomeData {
  schoolName: string;
  tagline: string;
  description: string;
  logo?: string;
  heroImage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  features: Array<{
    title: string;
    description: string;
    icon?: string;
    color?: string;
  }>;
  stats?: Array<{
    number: string;
    label: string;
  }>;
  testimonials?: Array<{
    name: string;
    role: string;
    content: string;
    rating: number;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}

export default function SchoolHome() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const [schoolData, setSchoolData] = useState<SchoolHomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch school data from backend API
    // This will be replaced with actual API call when backend is ready
    const mockSchoolData: SchoolHomeData = {
      schoolName: "Example School",
      tagline: "Excellence in Education",
      description: "Welcome to our school management system. We provide quality education with modern facilities and experienced faculty.",
      primaryColor: "from-blue-600 to-blue-700",
      secondaryColor: "from-purple-600 to-purple-800",
      features: [
        {
          title: "Academic Excellence",
          description: "Comprehensive curriculum with experienced teachers and modern teaching methods.",
          color: "from-blue-500 to-blue-600"
        },
        {
          title: "Sports & Activities",
          description: "Wide range of sports facilities and extracurricular activities for holistic development.",
          color: "from-green-500 to-green-600"
        },
        {
          title: "Technology Integration",
          description: "State-of-the-art technology integration in classrooms and learning management.",
          color: "from-purple-500 to-purple-600"
        },
        {
          title: "Safe Environment",
          description: "Secure campus with 24/7 monitoring and comprehensive safety protocols.",
          color: "from-red-500 to-red-600"
        },
        {
          title: "Global Perspective",
          description: "International programs and cultural exchange opportunities for students.",
          color: "from-orange-500 to-orange-600"
        },
        {
          title: "Individual Attention",
          description: "Small class sizes and personalized learning plans for each student.",
          color: "from-yellow-500 to-yellow-600"
        }
      ],
      stats: [
        { number: "2,000+", label: "Students Enrolled" },
        { number: "150+", label: "Expert Faculty" },
        { number: "35+", label: "Years of Excellence" },
        { number: "99%", label: "Graduation Rate" }
      ],
      testimonials: [
        {
          name: "Sarah Johnson",
          role: "Parent",
          content: "The school's commitment to academic excellence and individual attention has helped my child thrive both academically and personally.",
          rating: 5
        },
        {
          name: "Michael Chen",
          role: "Alumni",
          content: "The comprehensive education I received prepared me exceptionally well for university and beyond. The teachers truly care about student success.",
          rating: 5
        },
        {
          name: "Emily Rodriguez",
          role: "Teacher",
          content: "Working here has been incredibly rewarding. The school's focus on innovation and student-centered learning creates an inspiring environment.",
          rating: 5
        }
      ],
      contactInfo: {
        email: "info@exampleschool.edu",
        phone: "+1 (555) 123-4567",
        address: "123 Education Street, Learning City, LC 12345"
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      setSchoolData(mockSchoolData);
      setLoading(false);
    }, 1000);
  }, [schoolId]);

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
    <div className="min-h-screen bg-gray-50">
      <SchoolHeader />
      
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${schoolData.primaryColor} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-slate-900/10 to-transparent" />
        </div>
        
        <Container className="relative z-10 py-32">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Excellence in Education Since 1985</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {schoolData.schoolName}
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-4 opacity-90 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {schoolData.tagline}
            </motion.p>

            <motion.p 
              className="text-lg mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {schoolData.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => navigate(`/school/${schoolId}/register`)}
              >
                Apply Now
              </Button>
              <button 
                onClick={() => navigate(`/school/${schoolId}/contact`)}
                className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg backdrop-blur-sm transition-all duration-200 shadow-lg"
              >
                Contact Us
              </button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      {schoolData.stats && (
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {schoolData.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {schoolData.schoolName}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide an exceptional learning environment that nurtures academic excellence and personal growth.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolData.features.map((feature, index) => {
              const IconComponent = [
                BookOpen, Users, Award, Shield, TrendingUp, Globe
              ][index % 6];
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="text-center p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      {schoolData.testimonials && (
        <section className="py-20 bg-white">
          <Container>
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Community 
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Says About Us
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hear from students, parents, and educators about their experience with our school.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {schoolData.testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <div className="p-8">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                      <div className="border-t pt-4">
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-white to-gray-50">
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    We'd love to hear from you. Reach out to us for admissions, inquiries, or any questions.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600">{schoolData.contactInfo.email}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600">{schoolData.contactInfo.phone}</p>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
                    <p className="text-gray-600">{schoolData.contactInfo.address}</p>
                  </motion.div>
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                    onClick={() => navigate(`/school/${schoolId}/contact`)}
                  >
                    Schedule a Visit
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>

      <SchoolFooter />
    </div>
  );
}