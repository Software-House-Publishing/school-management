import { motion } from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import { Users, MessageCircle, Heart } from 'lucide-react';

export default function Community() {
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
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8 text-classivo-black font-display">Community</h1>
            <p className="text-xl text-classivo-black/60 leading-relaxed">
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
              className="glass-panel p-8 rounded-3xl hover:bg-white/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-6 h-6 text-classivo-blue" />
              </div>
              <h3 className="text-xl font-semibold text-classivo-black mb-3">Forums</h3>
              <p className="text-classivo-black/60 mb-6">Join discussions, ask questions, and share your experiences with the community.</p>
              <button className="text-classivo-blue font-medium hover:underline">Visit Forums →</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8 rounded-3xl hover:bg-white/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center mb-6 shadow-sm">
                <MessageCircle className="w-6 h-6 text-classivo-blue" />
              </div>
              <h3 className="text-xl font-semibold text-classivo-black mb-3">Discord</h3>
              <p className="text-classivo-black/60 mb-6">Chat in real-time with other users and our team. Get instant help and updates.</p>
              <button className="text-classivo-blue font-medium hover:underline">Join Discord →</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 rounded-3xl hover:bg-white/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center mb-6 shadow-sm">
                <Heart className="w-6 h-6 text-classivo-blue" />
              </div>
              <h3 className="text-xl font-semibold text-classivo-black mb-3">Events</h3>
              <p className="text-classivo-black/60 mb-6">Participate in webinars, workshops, and meetups. Learn from the experts.</p>
              <button className="text-classivo-blue font-medium hover:underline">See Events →</button>
            </motion.div>
          </div>
        </Container>
      </section>

      <SystemFooter />
    </div>
  );
}
