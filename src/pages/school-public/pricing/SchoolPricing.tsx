import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SchoolHeader from '@/components/layouts/SchoolHeader';
import SchoolFooter from '@/components/layouts/SchoolFooter';
import { CheckCircle, Star, BookOpen, Users, Award, Heart } from 'lucide-react';

interface SchoolPricingData {
  schoolName: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  pricingPlans?: PricingPlan[];
  contactEmail?: string;
  contactPhone?: string;
}

interface PricingPlan {
  name: string;
  price: string;
  highlight: string;
  features: string[];
  popular: boolean;
  gradient: string;
  description?: string;
}

// Mock data - will be replaced with API call
const mockSchoolData: SchoolPricingData = {
  schoolName: "Greenwood Academy",
  logo: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20school%20logo%20with%20tree%20and%20books%2C%20clean%20minimalist%20design%2C%20professional%20education%20branding&image_size=square",
  primaryColor: "#10b981",
  secondaryColor: "#3b82f6",
  pricingPlans: [
    {
      name: 'Elementary',
      price: '$2,500/semester',
      highlight: 'Grades K-5',
      features: [
        'Comprehensive curriculum',
        'Small class sizes (15:1 ratio)',
        'Arts & music programs',
        'Physical education',
        'Parent portal access'
      ],
      popular: false,
      gradient: 'from-green-500 to-green-600',
      description: 'Nurturing young minds with foundational education'
    },
    {
      name: 'Middle School',
      price: '$3,200/semester',
      highlight: 'Grades 6-8',
      features: [
        'Advanced curriculum',
        'STEM programs',
        'Extracurricular activities',
        'Counseling services',
        'Digital learning platforms'
      ],
      popular: true,
      gradient: 'from-blue-500 to-blue-600',
      description: 'Preparing students for high school success'
    },
    {
      name: 'High School',
      price: '$4,000/semester',
      highlight: 'Grades 9-12',
      features: [
        'College prep courses',
        'AP & honors classes',
        'Career guidance',
        'Internship programs',
        'College application support'
      ],
      popular: false,
      gradient: 'from-purple-500 to-purple-600',
      description: 'Excellence in education for future leaders'
    }
  ],
  contactEmail: "admissions@greenwoodacademy.edu",
  contactPhone: "(555) 123-4567"
};

export default function SchoolPricing() {
  const navigate = useNavigate();
  const { schoolId } = useParams<{ schoolId: string }>();

  // In a real app, this would be an API call based on schoolId
  const schoolData = mockSchoolData;

  const plans = schoolData.pricingPlans || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolHeader />

      <section className="relative bg-gradient-to-br from-green-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <Container className="relative z-10 py-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Transparent pricing for quality education</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tuition & Programs</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Invest in your child's future with our comprehensive educational programs.
            </p>
            <div className="mt-8">
              <Button 
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-200"
                onClick={() => navigate(`/school/${schoolId}/contact`)}
              >
                Schedule a Tour
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container>
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the program that best fits your child's educational journey.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="p-8">
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                      <div className="text-xl font-bold text-green-600">{plan.price}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-2">{plan.highlight}</div>
                    <div className="text-sm text-gray-600 mb-6">{plan.description}</div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90`}
                      onClick={() => navigate(`/school/${schoolId}/contact`)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <Container>
          <Card>
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">All programs include</div>
                  <p className="text-gray-600">Core educational services, facilities, and support.</p>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Certified teachers</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Library access</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Technology integration</span></div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Safe learning environment</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Parent-teacher conferences</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-green-500" /><span>Student support services</span></div>
                </div>
              </div>
              <div className="mt-10 text-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90 mr-4"
                  onClick={() => navigate(`/school/${schoolId}/contact`)}
                >
                  <Award className="w-5 h-5 mr-2" />
                  Apply for Admission
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => navigate(`/school/${schoolId}/contact`)}
                >
                  Request Information
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container>
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Financial Aid & Scholarships</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe quality education should be accessible to all families.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full">
                <div className="p-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Merit Scholarships</h3>
                  <p className="text-gray-600 mb-6">
                    Awarded based on academic excellence, leadership, and extracurricular achievements.
                    Scholarships range from 25% to 75% of tuition.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Academic Excellence Award</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Leadership Scholarship</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Arts & Athletics Scholarships</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full">
                <div className="p-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-6">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Need-Based Aid</h3>
                  <p className="text-gray-600 mb-6">
                    Financial assistance based on family income and circumstances.
                    We work with families to make education affordable.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Income-based assistance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Sibling discounts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Flexible payment plans</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:opacity-90"
              onClick={() => navigate(`/school/${schoolId}/contact`)}
            >
              Learn About Financial Aid
            </Button>
          </div>
        </Container>
      </section>

      <SchoolFooter />
    </div>
  );
}