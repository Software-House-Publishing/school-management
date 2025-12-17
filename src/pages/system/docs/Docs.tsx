import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { FileText, Book, Code, Terminal, Search } from 'lucide-react';

export default function Docs() {
  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      items: ['Quick Start Guide', 'Installation', 'Configuration', 'Authentication']
    },
    {
      title: 'Core Concepts',
      icon: FileText,
      items: ['Architecture', 'Data Models', 'User Roles', 'Permissions']
    },
    {
      title: 'API Reference',
      icon: Code,
      items: ['REST API', 'GraphQL', 'Webhooks', 'SDKs']
    },
    {
      title: 'Developer Tools',
      icon: Terminal,
      items: ['CLI', 'Testing', 'Deployment', 'Security']
    }
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">Documentation</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed mb-12">
              Everything you need to build and integrate with our platform.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-4 w-5 h-5 text-classivo-black/40" />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/20 bg-white/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-classivo-blue shadow-sm text-classivo-black placeholder:text-classivo-black/40"
              />
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass-panel p-8 rounded-3xl hover:bg-white/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-5 h-5 text-classivo-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-classivo-black mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item}>
                        <a href="#" className="text-classivo-black/60 hover:text-classivo-blue transition-colors text-sm">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
