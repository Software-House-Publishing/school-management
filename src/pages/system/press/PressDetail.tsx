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
      <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f] flex flex-col">
        <SystemHeader />
        <Container className="flex-1 flex flex-col items-center justify-center py-20">
          <h1 className="text-3xl font-semibold mb-4">Article not found</h1>
          <Button onClick={() => navigate('/press')} variant="outline">
            Back to Newsroom
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
              onClick={() => navigate('/press')}
              className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Newsroom
            </button>

            <article className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {news.source}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {news.date}
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-8 leading-tight">
                  {news.title}
                </h1>

                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="text-xl text-gray-500 leading-relaxed mb-8">
                    {news.content}
                  </p>
                  
                  {/* Placeholder for more content since our data is minimal */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>

                  <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-8 italic text-gray-700 bg-gray-50/50 rounded-r-lg">
                    "This is a significant milestone for our company and a testament to the hard work of our team."
                  </blockquote>

                  <p className="text-gray-600 leading-relaxed">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <ExternalLink className="w-4 h-4 mr-2" /> Read Original
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
