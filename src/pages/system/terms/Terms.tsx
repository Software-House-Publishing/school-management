import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <Card className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Welcome to our School Management System SaaS platform. By accessing and using our services, 
              you agree to be bound by these terms and conditions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">1. Service Description</h2>
            <p className="mb-4">
              We provide a comprehensive school management system that includes student information management, 
              course scheduling, financial management, and communication tools for educational institutions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">2. User Responsibilities</h2>
            <p className="mb-4">
              Schools and educational institutions are responsible for maintaining the accuracy of their data, 
              ensuring compliance with local educational regulations, and protecting student privacy in accordance 
              with applicable laws.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">3. Data Security and Privacy</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your data. However, users are responsible 
              for maintaining the confidentiality of their login credentials and ensuring proper access controls 
              within their organization.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">4. Payment and Subscription</h2>
            <p className="mb-4">
              Our services are provided on a subscription basis. Payment terms, pricing, and billing cycles 
              will be specified in your service agreement. Failure to maintain subscription payments may result 
              in service suspension or termination.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">5. Service Availability</h2>
            <p className="mb-4">
              We strive to maintain 99.9% uptime for our services. However, we do not guarantee uninterrupted 
              access and reserve the right to perform maintenance and updates as needed.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">6. Limitation of Liability</h2>
            <p className="mb-4">
              Our liability is limited to the amount paid for the service in the 12 months preceding any claim. 
              We are not liable for indirect, incidental, or consequential damages.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">7. Modifications to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Changes will be communicated to users 
              and continued use of the service constitutes acceptance of the modified terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">8. Contact Information</h2>
            <p className="mb-4">
              For questions about these terms, please contact us through our contact page or support channels.
            </p>
            
            <p className="mt-8 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}