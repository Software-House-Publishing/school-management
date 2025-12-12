import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

export default function Status() {
  const { t } = useTranslation();

  const services = [
    { name: 'API', status: 'operational' },
    { name: 'Dashboard', status: 'operational' },
    { name: 'Database', status: 'operational' },
    { name: 'Authentication', status: 'operational' },
    { name: 'Storage', status: 'operational' },
    { name: 'Email Notifications', status: 'operational' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f]">
      <SystemHeader />
      
      <section className="pt-40 pb-20">
        <Container>
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-green-700">All systems operational</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">System Status</h1>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-100">
               <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
             </div>
             <div className="divide-y divide-gray-100">
               {services.map((service) => (
                 <div key={service.name} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                   <span className="font-medium text-gray-900">{service.name}</span>
                   <div className="flex items-center space-x-2 text-green-600">
                     <CheckCircle className="w-5 h-5" />
                     <span className="text-sm font-medium">Operational</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
          <div className="max-w-3xl mx-auto mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Past Incidents</h3>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-2">October 24, 2023</div>
                <h4 className="font-medium text-gray-900 mb-2">Scheduled Maintenance</h4>
                <p className="text-gray-500 text-sm">Completed scheduled database maintenance. No downtime observed.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
