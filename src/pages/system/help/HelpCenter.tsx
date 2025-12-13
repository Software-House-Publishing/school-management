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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">How can we help?</h1>
            
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-6 top-5 w-6 h-6 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for answers..." 
                className="w-full pl-16 pr-6 py-5 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-gray-100 text-lg"
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
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cat.title}</h3>
                  <p className="text-gray-500 text-sm">{cat.count} articles</p>
                </motion.div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto">
             <h2 className="text-2xl font-semibold text-gray-900 mb-8">Popular Articles</h2>
             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                {[1, 2, 3, 4].map((i) => (
                  <a key={i} href="#" className="block p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                    <span className="text-gray-600 group-hover:text-gray-900 font-medium">How to reset your password</span>
                    <FileQuestion className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
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
