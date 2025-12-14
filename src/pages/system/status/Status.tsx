import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { CheckCircle } from 'lucide-react';

export default function Status() {
  const services = [
    { name: 'API', status: 'operational' },
    { name: 'Dashboard', status: 'operational' },
    { name: 'Database', status: 'operational' },
    { name: 'Authentication', status: 'operational' },
    { name: 'Storage', status: 'operational' },
    { name: 'Email Notifications', status: 'operational' },
  ];

  return (
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-classivo-lightblue/30 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-classivo-blue/20 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      </div>

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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">System Status</h1>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="max-w-3xl mx-auto glass-panel rounded-3xl overflow-hidden">
             <div className="p-8 border-b border-classivo-black/5">
               <h2 className="text-xl font-semibold text-classivo-black">Current Status</h2>
             </div>
             <div className="divide-y divide-classivo-black/5">
               {services.map((service) => (
                 <div key={service.name} className="p-6 flex items-center justify-between hover:bg-white/40 transition-colors">
                   <span className="font-medium text-classivo-black">{service.name}</span>
                   <div className="flex items-center space-x-2 text-green-600">
                     <CheckCircle className="w-5 h-5" />
                     <span className="text-sm font-medium">Operational</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          
          <div className="max-w-3xl mx-auto mt-12">
            <h3 className="text-lg font-semibold text-classivo-black mb-6">Past Incidents</h3>
            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-2xl">
                <div className="text-sm text-classivo-black/50 mb-2">October 24, 2023</div>
                <h4 className="font-medium text-classivo-black mb-2">Scheduled Maintenance</h4>
                <p className="text-classivo-black/60 text-sm">Completed scheduled database maintenance. No downtime observed.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
