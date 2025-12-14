import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { ArrowRight, Briefcase, MapPin, Clock } from 'lucide-react';
import { jobOpenings } from '@/data/system-content';

export default function Careers() {
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">Join our team.</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed mb-12">
              We're on a mission to transform education. Come build the future with us.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/careers/${job.slug}`)}
                className="glass-panel p-8 rounded-3xl hover:bg-white/40 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-classivo-black mb-2 group-hover:text-classivo-blue transition-colors">{job.title}</h3>
                  <div className="flex items-center space-x-6 text-sm text-classivo-black/60">
                    <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" />{job.department}</span>
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{job.location}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-2" />{job.type}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-classivo-blue/10 transition-colors">
                  <ArrowRight className="w-5 h-5 text-classivo-black/40 group-hover:text-classivo-blue" />
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
