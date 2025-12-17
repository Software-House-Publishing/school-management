import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Cookie } from 'lucide-react';

export default function Cookies() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/50 shadow-sm mb-8">
               <Cookie className="w-8 h-8 text-classivo-blue" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">Cookie Policy</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed">
              How we use cookies to improve your experience.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="glass-panel p-10 rounded-3xl">
              <h2 className="text-2xl font-semibold text-classivo-black mb-4">What are cookies?</h2>
              <p className="text-classivo-black/70 leading-relaxed mb-6">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
              </p>
              
              <h2 className="text-2xl font-semibold text-classivo-black mb-4">How we use cookies</h2>
              <p className="text-classivo-black/70 leading-relaxed mb-6">
                We use cookies for several purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-classivo-black/70 mb-6">
                <li><strong className="text-classivo-black">Essential Cookies:</strong> Required for the website to function properly.</li>
                <li><strong className="text-classivo-black">Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                <li><strong className="text-classivo-black">Functional Cookies:</strong> Remember your preferences and settings.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-classivo-black mb-4">Managing cookies</h2>
              <p className="text-classivo-black/70 leading-relaxed">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
