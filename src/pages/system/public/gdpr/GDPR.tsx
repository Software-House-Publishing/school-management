import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

export default function GDPR() {
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
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-classivo-blue shadow-lg shadow-classivo-blue/30 mb-8">
               <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">GDPR Compliance</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed">
              Our commitment to protecting your data and privacy rights.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="max-w-4xl mx-auto grid gap-8">
            <div className="glass-panel p-10 rounded-3xl">
               <div className="flex items-start mb-6">
                 <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center shrink-0 mr-6 text-classivo-blue shadow-sm">
                   <Lock className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-semibold text-classivo-black mb-2">Data Protection</h2>
                   <p className="text-classivo-black/70 leading-relaxed">
                     We implement robust security measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. Our systems are designed with privacy by default and by design.
                   </p>
                 </div>
               </div>
            </div>

            <div className="glass-panel p-10 rounded-3xl">
               <div className="flex items-start mb-6">
                 <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center shrink-0 mr-6 text-classivo-blue shadow-sm">
                   <Globe className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-semibold text-classivo-black mb-2">Data Processing</h2>
                   <p className="text-classivo-black/70 leading-relaxed">
                     We process personal data only for specified, explicit, and legitimate purposes. We ensure that data processing is lawful, fair, and transparent to the data subject.
                   </p>
                 </div>
               </div>
            </div>

            <div className="glass-panel p-10 rounded-3xl">
               <h2 className="text-2xl font-semibold text-classivo-black mb-6">Your Rights</h2>
               <div className="grid md:grid-cols-2 gap-4">
                 {[
                   'Right to Access',
                   'Right to Rectification',
                   'Right to Erasure',
                   'Right to Restrict Processing',
                   'Right to Data Portability',
                   'Right to Object'
                 ].map((right) => (
                   <div key={right} className="flex items-center p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-colors">
                     <div className="w-2 h-2 rounded-full bg-classivo-blue mr-3" />
                     <span className="font-medium text-classivo-black/80">{right}</span>
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
