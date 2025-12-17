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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">Newsroom</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed mb-12">
              Latest news, updates, and resources for the media.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <h2 className="text-2xl font-semibold text-classivo-black">Recent News</h2>
              {pressItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/press/${item.slug}`)}
                  className="glass-panel p-8 rounded-3xl cursor-pointer group hover:bg-white/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-classivo-black/50">{item.date}</span>
                    <span className="text-sm font-medium text-classivo-blue bg-classivo-blue/10 px-3 py-1 rounded-full">{item.source}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-classivo-black mb-2 group-hover:text-classivo-blue transition-colors">{item.title}</h3>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-classivo-black">Brand Assets</h2>
              <div className="glass-panel p-8 rounded-3xl space-y-6">
                 <div>
                   <h3 className="font-semibold text-classivo-black mb-2">Logo Kit</h3>
                   <p className="text-sm text-classivo-black/60 mb-4">Official logos in SVG and PNG formats.</p>
                   <button className="flex items-center text-sm font-medium text-classivo-blue hover:underline">
                     <Download className="w-4 h-4 mr-2" /> Download
                   </button>
                 </div>
                 <hr className="border-classivo-black/5" />
                 <div>
                   <h3 className="font-semibold text-classivo-black mb-2">Brand Guidelines</h3>
                   <p className="text-sm text-classivo-black/60 mb-4">Usage rules for our brand assets.</p>
                   <button className="flex items-center text-sm font-medium text-classivo-blue hover:underline">
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
