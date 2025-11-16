import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SchoolContactData {
  schoolName: string;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Contact {schoolData.schoolName}</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">School Name</h3>
                  <p className="text-gray-600">{schoolData.schoolName}</p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">{schoolData.contactInfo.email}</p>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-600">{schoolData.contactInfo.phone}</p>
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-gray-600">{schoolData.contactInfo.address}</p>
                </div>
                {schoolData.contactInfo.officeHours && (
                  <div>
                    <h3 className="font-medium">Office Hours</h3>
                    <p className="text-gray-600">{schoolData.contactInfo.officeHours}</p>
                  </div>
                )}
                {schoolData.contactInfo.principal && (
                  <div>
                    <h3 className="font-medium">Principal</h3>
                    <p className="text-gray-600">{schoolData.contactInfo.principal}</p>
                  </div>
                )}
                {schoolData.socialMedia && (
                  <div>
                    <h3 className="font-medium">Follow Us</h3>
                    <div className="flex space-x-3 mt-2">
                      {schoolData.socialMedia.facebook && (
                        <a href={schoolData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          Facebook
                        </a>
                      )}
                      {schoolData.socialMedia.twitter && (
                        <a href={schoolData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          Twitter
                        </a>
                      )}
                      {schoolData.socialMedia.instagram && (
                        <a href={schoolData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            <Card>
              <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}