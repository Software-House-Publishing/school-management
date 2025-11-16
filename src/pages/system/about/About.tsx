import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <Container>
        <Card className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Our School Management System</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Our comprehensive school management system is designed to streamline educational 
              administration, enhance learning experiences, and improve communication between 
              all stakeholders in the educational ecosystem.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To provide educational institutions with cutting-edge technology solutions that 
              simplify administrative tasks, enhance teaching effectiveness, and improve 
              student outcomes through data-driven insights.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Key Benefits</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Streamlined administrative processes</li>
              <li>Enhanced communication between teachers, students, and parents</li>
              <li>Comprehensive financial management</li>
              <li>Real-time academic tracking and reporting</li>
              <li>Secure and scalable cloud-based solution</li>
            </ul>
          </div>
        </Card>
      </Container>
    </div>
  );
}