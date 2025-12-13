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
      <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f] flex flex-col">
        <SystemHeader />
        <Container className="flex-1 flex flex-col items-center justify-center py-20">
          <h1 className="text-3xl font-semibold mb-4">Job not found</h1>
          <Button onClick={() => navigate('/careers')} variant="outline">
            Back to Careers
          </Button>
        </Container>
        <SystemFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f]">
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
              className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Careers
            </button>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-gray-500">
                      <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full text-sm font-medium">
                        <Briefcase className="w-4 h-4 mr-2" />{job.department}
                      </span>
                      <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full text-sm font-medium">
                        <MapPin className="w-4 h-4 mr-2" />{job.location}
                      </span>
                      <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4 mr-2" />{job.type}
                      </span>
                    </div>
                  </div>
                  <Button size="lg" className="shrink-0 rounded-full px-8 text-base shadow-lg shadow-blue-500/20">
                    Apply Now
                  </Button>
                </div>

                <div className="prose prose-lg prose-gray max-w-none">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">About the Role</h2>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {job.description}
                  </p>

                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-3 mb-8 list-none pl-0">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Join AcademiaOS?</h3>
                    <p className="text-gray-600 mb-6">
                      We offer a competitive salary, comprehensive benefits, and the opportunity to make a real impact on education globally.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <span className="block font-medium text-gray-900 mb-1">Health & Wellness</span>
                        <span className="text-sm text-gray-500">Top-tier medical, dental, and vision coverage.</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <span className="block font-medium text-gray-900 mb-1">Remote-First</span>
                        <span className="text-sm text-gray-500">Work from anywhere with a flexible schedule.</span>
                      </div>
                    </div>
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
