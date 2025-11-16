import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';

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
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* School Overview */}
          <Card>
            <h1 className="text-3xl font-bold mb-4">About {schoolData.schoolName}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {schoolData.description}
            </p>
          </Card>

          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">{schoolData.mission}</p>
            </Card>
            <Card>
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="text-gray-600">{schoolData.vision}</p>
            </Card>
          </div>

          {/* History */}
          {schoolData.history && (
            <Card>
              <h2 className="text-2xl font-semibold mb-4">Our History</h2>
              <p className="text-gray-600">{schoolData.history}</p>
            </Card>
          )}

          {/* Facilities */}
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Our Facilities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {schoolData.facilities.map((facility, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">{facility}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Our Achievements</h2>
            <div className="space-y-3">
              {schoolData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">{achievement}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Leadership */}
          <Card>
            <h2 className="text-2xl font-semibold mb-6">Our Leadership Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schoolData.leadership.map((leader, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{leader.name}</h3>
                  <p className="text-blue-600 mb-2">{leader.position}</p>
                  {leader.bio && (
                    <p className="text-sm text-gray-600">{leader.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}