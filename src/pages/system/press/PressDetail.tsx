import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { ArrowLeft, Calendar, ExternalLink, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { pressItems } from '@/data/system-content';

export default function PressDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const news = pressItems.find(item => item.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!news) {
    return (
      <div className="min-h-screen bg-classivo-cream text-classivo-black flex flex-col relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-classivo-lightblue/30 blur-[120px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        </div>
        <SystemHeader />
        <Container className="flex-1 flex flex-col items-center justify-center py-20">
          <h1 className="text-3xl font-semibold mb-4 text-classivo-black">Article not found</h1>
          <Button onClick={() => navigate('/press')} variant="outline" className="rounded-full">
            Back to Newsroom
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
              onClick={() => navigate('/press')}
              className="group flex items-center text-sm font-medium text-classivo-black/60 hover:text-classivo-black mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Newsroom
            </button>

            <article className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white/40 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-classivo-blue/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="inline-flex items-center text-sm font-medium text-classivo-blue bg-classivo-blue/10 px-3 py-1 rounded-full">
                    {news.source}
                  </span>
                  <span className="flex items-center text-sm text-classivo-black/60">
                    <Calendar className="w-4 h-4 mr-2" />
                    {news.date}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-classivo-black mb-8 leading-tight font-display">
                  {news.title}
                </h1>

                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-xl text-classivo-black/70 leading-relaxed mb-8">
                    {news.content}
                  </p>
                  
                  {/* Placeholder for more content since our data is minimal */}
                  <p className="text-classivo-black/70 leading-relaxed mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  
                  <p className="text-classivo-black/70 leading-relaxed mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>

                  <blockquote className="border-l-4 border-classivo-blue pl-6 py-2 my-8 italic text-classivo-black/80 bg-white/40 rounded-r-lg">
                    "This is a significant milestone for our company and a testament to the hard work of our team."
                  </blockquote>

                  <p className="text-classivo-black/70 leading-relaxed">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-classivo-black/10 flex items-center justify-between">
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="rounded-full border-classivo-black/20 text-classivo-black hover:bg-classivo-black/5">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full border-classivo-black/20 text-classivo-black hover:bg-classivo-black/5">
                      <ExternalLink className="w-4 h-4 mr-2" /> Original Source
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </motion.div>
        </Container>
      </main>

      <SystemFooter />
    </div>
  );
}
