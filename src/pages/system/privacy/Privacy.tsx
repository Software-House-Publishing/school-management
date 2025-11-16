import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <Container>
        <Card className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              This Privacy Policy describes how we collect, use, and protect your personal information 
              when you use our School Management System SaaS platform.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information necessary to provide our services, including student data, teacher information, 
              academic records, and administrative data. This includes personal information such as names, 
              contact details, academic performance, and attendance records.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">2. How We Use Your Information</h2>
            <p className="mb-4">
              Your information is used to provide and improve our services, manage user accounts, 
              process payments, communicate with users, and ensure the security of our platform. 
              We do not sell personal information to third parties.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">3. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures including encryption, secure data storage, 
              access controls, and regular security audits. All data is transmitted over encrypted connections 
              and stored in secure data centers.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">4. Data Retention</h2>
            <p className="mb-4">
              We retain data as long as necessary to provide our services or as required by law. 
              Schools can request data deletion when they terminate their subscription, subject to 
              legal and regulatory requirements.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">5. Third-Party Services</h2>
            <p className="mb-4">
              We may use third-party services for payment processing, analytics, and infrastructure. 
              These services are carefully vetted and only receive the minimum necessary information 
              to perform their functions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">6. Your Rights</h2>
            <p className="mb-4">
              Depending on your jurisdiction, you may have rights to access, correct, delete, or 
              export your personal data. Schools can manage these requests through their administrative 
              dashboard or by contacting our support team.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">7. Children's Privacy</h2>
            <p className="mb-4">
              We comply with applicable laws regarding children's privacy, including COPPA and GDPR-K. 
              We only collect information necessary for educational purposes and maintain appropriate 
              parental consent where required.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">8. Contact Us</h2>
            <p className="mb-4">
              For privacy-related questions or concerns, please contact our Data Protection Officer 
              through our contact page or support channels.
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