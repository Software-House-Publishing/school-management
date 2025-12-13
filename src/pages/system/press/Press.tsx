import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Download } from 'lucide-react';
import { pressItems } from '@/data/system-content';

export default function Press() {
  const navigate = useNavigate();

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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">Newsroom</h1>
            <p className="text-xl text-gray-500 leading-relaxed mb-12">
              Latest news, updates, and resources for the media.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900">Recent News</h2>
              {pressItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/press/${item.slug}`)}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm cursor-pointer group hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-400">{item.date}</span>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.source}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900">Brand Assets</h2>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                 <div>
                   <h3 className="font-semibold text-gray-900 mb-2">Logo Kit</h3>
                   <p className="text-sm text-gray-500 mb-4">Official logos in SVG and PNG formats.</p>
                   <button className="flex items-center text-sm font-medium text-blue-600 hover:underline">
                     <Download className="w-4 h-4 mr-2" /> Download
                   </button>
                 </div>
                 <hr className="border-gray-100" />
                 <div>
                   <h3 className="font-semibold text-gray-900 mb-2">Brand Guidelines</h3>
                   <p className="text-sm text-gray-500 mb-4">Usage rules for our brand assets.</p>
                   <button className="flex items-center text-sm font-medium text-blue-600 hover:underline">
                     <Download className="w-4 h-4 mr-2" /> Download PDF
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
