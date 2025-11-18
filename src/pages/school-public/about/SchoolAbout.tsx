import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import SchoolHeader from '@/components/layouts/SchoolHeader';
import SchoolFooter from '@/components/layouts/SchoolFooter';
import { 
  BookOpen, 
  Users, 
  Award, 
  Shield, 
  Globe, 
  Zap,
  CheckCircle,
  Star
} from 'lucide-react';

interface SchoolAboutData {
  schoolName: string;
  description: string;
  mission: string;
  vision: string;
  history?: string;
  facilities: string[];
  achievements: string[];
  leadership: Array<{
    name: string;
    position: string;
    bio?: string;
    image?: string;
  }>;
  primaryColor?: string;
  values?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export default function SchoolAbout() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [schoolData, setSchoolData] = useState<SchoolAboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch school about data from backend API
    const mockSchoolData: SchoolAboutData = {
      schoolName: "Example School",
      description: "Example School has been providing quality education since 1985. We are committed to nurturing young minds and preparing students for a successful future.",
      mission: "To provide a nurturing environment that fosters academic excellence, character development, and lifelong learning skills.",
      vision: "To be a leading educational institution that prepares students to become responsible global citizens and leaders of tomorrow.",
      history: "Founded in 1985, Example School has grown from a small community school to a renowned educational institution serving over 2,000 students.",
      primaryColor: "from-blue-600 to-blue-700",
      values: [
        {
          title: "Excellence",
          description: "We strive for excellence in all aspects of education and personal development."
        },
        {
          title: "Integrity",
          description: "We uphold the highest standards of honesty, ethics, and moral character."
        },
        {
          title: "Innovation",
          description: "We embrace creative thinking and innovative approaches to learning."
        },
        {
          title: "Community",
          description: "We foster a strong sense of community and social responsibility."
        }
      ],
      facilities: [
        "Modern classrooms with smart boards",
        "Science laboratories with latest equipment",
        "Computer labs with high-speed internet",
        "Library with extensive collection",
        "Sports facilities including gymnasium",
        "Music and arts studios",
        "Cafeteria with healthy meal options"
      ],
      achievements: [
        "99% pass rate in national examinations",
        "Award for Best Educational Institution 2023",
        "Green School Certification",
        "International School Partnership Program"
      ],
      leadership: [
        {
          name: "Dr. Jane Smith",
          position: "Principal",
          bio: "Dr. Smith has over 20 years of experience in education and holds a PhD in Educational Leadership."
        },
        {
          name: "Mr. John Doe",
          position: "Vice Principal - Academics",
          bio: "Mr. Doe specializes in curriculum development and has been with the school for 15 years."
        },
        {
          name: "Ms. Sarah Johnson",
          position: "Vice Principal - Administration",
          bio: "Ms. Johnson manages school operations and has extensive experience in educational administration."
        }
      ]
    };

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

      <section className={`relative bg-gradient-to-br ${schoolData.primaryColor} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <Container className="relative z-10 py-24">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Empowering education with excellence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About {schoolData.schoolName}</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              {schoolData.description}
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="h-full">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Our Mission</div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{schoolData.mission}</p>
                </div>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="h-full">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Our Vision</div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{schoolData.vision}</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      {schoolData.values && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <Container>
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Values
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {schoolData.values.map((value, index) => {
                const IconComponent = [Shield, Users, Award, Globe][index % 4];
                
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                      <div className="text-center p-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* History */}
      {schoolData.history && (
        <section className="py-20 bg-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <div className="p-8 md:p-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Our History</div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">{schoolData.history}</p>
                </div>
              </Card>
            </motion.div>
          </Container>
        </section>
      )}

      {/* Facilities */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card>
              <div className="p-8 md:p-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">Our Facilities</div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {schoolData.facilities.map((facility, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{facility}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card>
              <div className="p-8 md:p-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">Our Achievements</div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {schoolData.achievements.map((achievement, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{achievement}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Leadership Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals leading our institution
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolData.leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">{leader.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{leader.position}</p>
                    {leader.bio && (
                      <p className="text-sm text-gray-600 leading-relaxed">{leader.bio}</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <SchoolFooter />
    </div>
  );
}