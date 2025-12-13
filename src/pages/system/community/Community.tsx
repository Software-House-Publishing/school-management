import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Users, MessageCircle, Heart } from 'lucide-react';

export default function Community() {
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-gray-900">Community</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Connect with educators, administrators, and developers. Share knowledge and grow together.
            </p>
          </motion.div>
        </Container>
      </section>

      <section className="pb-32">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Forums</h3>
              <p className="text-gray-500 mb-6">Join discussions, ask questions, and share your experiences with the community.</p>
              <button className="text-blue-600 font-medium hover:underline">Visit Forums →</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Discord</h3>
              <p className="text-gray-500 mb-6">Chat in real-time with other users and our team. Get instant help and updates.</p>
              <button className="text-purple-600 font-medium hover:underline">Join Discord →</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Events</h3>
              <p className="text-gray-500 mb-6">Participate in webinars, workshops, and meetups. Learn from the experts.</p>
              <button className="text-pink-600 font-medium hover:underline">See Events →</button>
            </motion.div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
