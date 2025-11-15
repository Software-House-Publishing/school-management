import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('app.name')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t('app.tagline')}
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-blue-600 bg-white hover:bg-gray-100"
                onClick={() => navigate('/login')}
              >
                {t('navigation.login')}
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/contact')}
              >
                {t('navigation.contact')}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <h3 className="text-xl font-semibold mb-4">Learning Management</h3>
              <p className="text-gray-600">Comprehensive course management, student tracking, and academic tools.</p>
            </Card>
            <Card className="text-center">
              <h3 className="text-xl font-semibold mb-4">Financial Management</h3>
              <p className="text-gray-600">Fee management, salary processing, and financial reporting.</p>
            </Card>
            <Card className="text-center">
              <h3 className="text-xl font-semibold mb-4">Multi-Portal Access</h3>
              <p className="text-gray-600">Dedicated portals for students, teachers, and administrators.</p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}