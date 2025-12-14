import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Search, BookOpen, FileQuestion, LifeBuoy, Users, CreditCard } from 'lucide-react';

export default function HelpCenter() {
  const categories = [
    { title: 'Getting Started', icon: BookOpen, count: 12 },
    { title: 'Account Management', icon: Users, count: 8 },
    { title: 'Billing & Payments', icon: CreditCard, count: 5 },
    { title: 'Troubleshooting', icon: LifeBuoy, count: 15 },
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">How can we help?</h1>
            
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-6 top-5 w-6 h-6 text-classivo-black/40" />
              <input 
                type="text" 
                placeholder="Search for answers..." 
                className="w-full pl-16 pr-6 py-5 rounded-3xl border border-white/20 bg-white/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-classivo-blue shadow-lg shadow-classivo-blue/5 text-lg placeholder:text-classivo-black/40 text-classivo-black"
              />
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel p-8 rounded-3xl hover:bg-white/40 transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6 text-classivo-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-classivo-black mb-2">{cat.title}</h3>
                  <p className="text-classivo-black/60 text-sm">{cat.count} articles</p>
                </motion.div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto">
             <h2 className="text-2xl font-semibold text-classivo-black mb-8">Popular Articles</h2>
             <div className="glass-panel rounded-3xl divide-y divide-classivo-black/5">
                {[1, 2, 3, 4].map((i) => (
                  <a key={i} href="#" className="block p-6 hover:bg-white/40 transition-colors flex items-center justify-between group">
                    <span className="text-classivo-black/80 group-hover:text-classivo-black font-medium">How to reset your password</span>
                    <FileQuestion className="w-5 h-5 text-classivo-black/40 group-hover:text-classivo-blue" />
                  </a>
                ))}
             </div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
