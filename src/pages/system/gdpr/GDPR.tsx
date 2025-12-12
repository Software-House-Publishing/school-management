import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

export default function GDPR() {
  const { t } = useTranslation();

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
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 mb-8">
               <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">GDPR Compliance</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Our commitment to protecting your data and privacy rights.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="max-w-4xl mx-auto grid gap-8">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
               <div className="flex items-start mb-6">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mr-6">
                   <Lock className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-semibold text-gray-900 mb-2">Data Protection</h2>
                   <p className="text-gray-500 leading-relaxed">
                     We implement robust security measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. Our systems are designed with privacy by default and by design.
                   </p>
                 </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
               <div className="flex items-start mb-6">
                 <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mr-6">
                   <Globe className="w-6 h-6 text-purple-600" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-semibold text-gray-900 mb-2">Data Processing</h2>
                   <p className="text-gray-500 leading-relaxed">
                     We process personal data only for specified, explicit, and legitimate purposes. We ensure that data processing is lawful, fair, and transparent to the data subject.
                   </p>
                 </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
               <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Rights</h2>
               <div className="grid md:grid-cols-2 gap-4">
                 {[
                   'Right to Access',
                   'Right to Rectification',
                   'Right to Erasure',
                   'Right to Restrict Processing',
                   'Right to Data Portability',
                   'Right to Object'
                 ].map((right) => (
                   <div key={right} className="flex items-center p-4 rounded-xl bg-gray-50">
                     <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                     <span className="font-medium text-gray-700">{right}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
