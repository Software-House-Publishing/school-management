import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { ArrowLeft, Briefcase, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { jobOpenings } from '@/data/system-content';

export default function CareerDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const job = jobOpenings.find(j => j.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!job) {
    return (
      <div className="min-h-screen bg-classivo-cream text-classivo-black flex flex-col relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-classivo-lightblue/30 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        </div>
        <SystemHeader />
        <Container className="flex-1 flex flex-col items-center justify-center py-20">
          <h1 className="text-3xl font-semibold mb-4 text-classivo-black">Job not found</h1>
          <Button onClick={() => navigate('/careers')} variant="outline" className="rounded-full">
            Back to Careers
          </Button>
        </Container>
        <SystemFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-classivo-lightblue/30 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-classivo-blue/20 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      </div>

      <SystemHeader />
      
      <main className="pt-32 pb-20">
        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button 
              onClick={() => navigate('/careers')}
              className="group flex items-center text-sm font-medium text-classivo-black/60 hover:text-classivo-black mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Careers
            </button>

            <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white/40 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-classivo-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-classivo-black mb-4 font-display">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-classivo-black/60">
                      <span className="flex items-center bg-white/40 px-3 py-1.5 rounded-full text-sm font-medium">
                        <Briefcase className="w-4 h-4 mr-2" />{job.department}
                      </span>
                      <span className="flex items-center bg-white/40 px-3 py-1.5 rounded-full text-sm font-medium">
                        <MapPin className="w-4 h-4 mr-2" />{job.location}
                      </span>
                      <span className="flex items-center bg-white/40 px-3 py-1.5 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4 mr-2" />{job.type}
                      </span>
                    </div>
                  </div>
                  <Button size="lg" className="shrink-0 rounded-full px-8 text-base shadow-lg shadow-classivo-blue/20 bg-classivo-black text-white hover:bg-classivo-black/80">
                    Apply Now
                  </Button>
                </div>

                <div className="prose prose-lg prose-gray max-w-none">
                  <h2 className="text-2xl font-semibold text-classivo-black mb-4">About the Role</h2>
                  <p className="text-classivo-black/70 leading-relaxed mb-8">
                    {job.description}
                  </p>

                  <h2 className="text-2xl font-semibold text-classivo-black mb-4">Requirements</h2>
                  <ul className="space-y-3 mb-8 list-none pl-0">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start text-classivo-black/70">
                        <CheckCircle2 className="w-5 h-5 text-classivo-blue mr-3 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-white/40 rounded-2xl p-6 md:p-8 mt-12 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-classivo-black mb-3">Why Join Classivo?</h3>
                    <p className="text-classivo-black/70 mb-6">
                      We offer a competitive salary, comprehensive benefits, and the opportunity to make a real impact on education globally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </main>

      <SystemFooter />
    </div>
  );
}
