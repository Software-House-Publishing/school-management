import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { ArrowRight, Briefcase, MapPin, Clock } from 'lucide-react';

export default function Careers() {
  const { t } = useTranslation();

  const openings = [
    { title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Product Designer', department: 'Design', location: 'New York, NY', type: 'Full-time' },
    { title: 'Customer Success Manager', department: 'Sales', location: 'London, UK', type: 'Full-time' },
    { title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Contract' },
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">Join our team.</h1>
            <p className="text-xl text-gray-500 leading-relaxed mb-12">
              We're on a mission to transform education. Come build the future with us.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            {openings.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{job.department}</span>
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{job.location}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-2" />{job.type}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
