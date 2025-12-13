import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Cookie } from 'lucide-react';

export default function Cookies() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-8">
               <Cookie className="w-8 h-8 text-gray-900" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">Cookie Policy</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              How we use cookies to improve your experience.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What are cookies?</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How we use cookies</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                We use cookies for several purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-500 mb-6">
                <li><strong className="text-gray-900">Essential Cookies:</strong> Required for the website to function properly.</li>
                <li><strong className="text-gray-900">Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                <li><strong className="text-gray-900">Functional Cookies:</strong> Remember your preferences and settings.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing cookies</h2>
              <p className="text-gray-500 leading-relaxed">
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
