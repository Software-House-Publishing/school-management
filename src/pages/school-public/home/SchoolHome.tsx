import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SchoolHomeData {
  schoolName: string;
  tagline: string;
  description: string;
  logo?: string;
  heroImage?: string;
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
}

export default function SchoolHome() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [schoolData, setSchoolData] = useState<SchoolHomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch school data from backend API
    // This will be replaced with actual API call when backend is ready
    const mockSchoolData: SchoolHomeData = {
      schoolName: "Example School",
      tagline: "Excellence in Education",
      description: "Welcome to our school management system. We provide quality education with modern facilities and experienced faculty.",
      features: [
        {
          title: "Academic Excellence",
          description: "Comprehensive curriculum with experienced teachers and modern teaching methods."
        },
        {
          title: "Sports & Activities",
          description: "Wide range of sports facilities and extracurricular activities for holistic development."
        },
        {
          title: "Technology Integration",
          description: "State-of-the-art technology integration in classrooms and learning management."
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {schoolData.schoolName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {schoolData.tagline}
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {schoolData.description}
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-blue-600 bg-white hover:bg-gray-100"
                onClick={() => window.location.href = `/${schoolId}/login`}
              >
                Student Login
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = `/${schoolId}/contact`}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {schoolData.features.map((feature, index) => (
              <Card key={index} className="text-center">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <Card className="text-center">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">{schoolData.contactInfo.email}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">{schoolData.contactInfo.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600">{schoolData.contactInfo.address}</p>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}