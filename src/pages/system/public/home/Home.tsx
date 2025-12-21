import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate
} from 'framer-motion';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';
import {
  Users,
  CreditCard,
  Shield,
  TrendingUp,
  ArrowRight,
  Activity,
  Zap,
  Layout,
  Globe,
  LucideIcon,
  Star
} from 'lucide-react';

// --- Components ---

const Hero3DCard = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });
  const sheenGradient = useMotionTemplate`linear-gradient(${useTransform(mouseX, [-0.5, 0.5], [110, 250])}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)`;

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="relative w-full max-w-4xl mx-auto mt-16 lg:mt-24"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="w-full aspect-[16/10] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden relative group"
      >
        {/* Glossy Sheen Overlay */}
        <motion.div
          style={{ background: sheenGradient }}
          className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 will-change-[opacity]"
        />

        {/* Abstract UI Content */}
        <div className="absolute inset-0 p-8 flex flex-col">
          {/* Header Bar */}
          <div className="h-14 w-full rounded-2xl bg-white/20 backdrop-blur-md flex items-center px-6 justify-between mb-8 border border-white/30">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#E58383]" />
              <div className="w-3 h-3 rounded-full bg-[#E5C083]" />
              <div className="w-3 h-3 rounded-full bg-[#83E59D]" />
            </div>
            <div className="h-2 w-32 bg-white/30 rounded-full" />
          </div>

          <div className="flex-1 flex gap-6">
            {/* Sidebar */}
            <div className="w-64 hidden md:flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-full rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors" />
              ))}
              <div className="flex-1" />
              <div className="h-32 w-full rounded-xl bg-gradient-to-br from-classivo-blue/20 to-classivo-lightblue/20 border border-white/20 p-4">
                <div className="w-8 h-8 rounded-lg bg-classivo-blue mb-2" />
                <div className="h-2 w-16 bg-white/30 rounded-full mb-2" />
                <div className="h-2 w-10 bg-white/20 rounded-full" />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 p-5 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-classivo-blue/20 rounded-full blur-xl" />
                  <Activity className="text-classivo-black mb-4 w-6 h-6" />
                  <div className="text-2xl font-bold text-classivo-black">98%</div>
                  <div className="text-xs text-black/60 font-medium">Attendance Rate</div>
                </div>
                <div className="h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 p-5 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-classivo-lightblue/30 rounded-full blur-xl" />
                  <Users className="text-classivo-black mb-4 w-6 h-6" />
                  <div className="text-2xl font-bold text-classivo-black">1.2k</div>
                  <div className="text-xs text-black/60 font-medium">Students Active</div>
                </div>
                <div className="h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 p-5 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#E58383]/20 rounded-full blur-xl" />
                  <TrendingUp className="text-classivo-black mb-4 w-6 h-6" />
                  <div className="text-2xl font-bold text-classivo-black">+15%</div>
                  <div className="text-xs text-black/60 font-medium">Performance</div>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-white/10 border border-white/20 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-4 w-32 bg-white/30 rounded-full" />
                  <div className="h-8 w-8 rounded-full bg-white/20" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white/20" />
                      <div className="flex-1 h-10 rounded-lg bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Icons/Badges */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-8 top-1/2 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center z-30"
        >
          <Zap className="text-yellow-500 fill-current" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -right-6 bottom-20 px-6 py-3 rounded-xl bg-classivo-black text-white shadow-xl z-30 flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium">System Optimal</span>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-classivo-lightblue/30 to-classivo-blue/10 rounded-3xl transform group-hover:scale-105 transition-transform duration-500" />
      <div className="relative p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden">

        <div className="absolute top-0 right-0 w-32 h-32 bg-classivo-blue/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-classivo-blue/20" />

        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 text-classivo-blue shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10">
          <Icon className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-classivo-black mb-3 relative z-10">{title}</h3>
        <p className="text-gray-600 leading-relaxed relative z-10">
          {description}
        </p>

        <div className="mt-auto pt-6 flex items-center text-classivo-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
          Learn more <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const features = [
    {
      icon: Layout,
      title: 'Modern Dashboard',
      description: 'A liquid-smooth interface that gives you a bird\'s eye view of your entire institution.',
    },
    {
      icon: Users,
      title: 'Student & Staff Portal',
      description: 'Dedicated spaces for everyone. Connect students, teachers, and parents in one unified hub.',
    },
    {
      icon: Globe,
      title: 'LMS Connect',
      description: 'Seamlessly integrated learning management tools for the modern digital classroom.',
    },
    {
      icon: Shield,
      title: 'Ironclad Security',
      description: 'Enterprise-grade encryption and privacy compliance keeping your sensitive data safe.',
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'AI-driven insights that help you make data-backed decisions for better outcomes.',
    },
    {
      icon: CreditCard,
      title: 'Finance & Fees',
      description: 'Automated fee collection and financial reporting that saves you hours every week.',
    }
  ];

  return (
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-x-hidden selection:bg-classivo-lightblue selection:text-classivo-black">

      {/* --- Liquid Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-classivo-lightblue/20 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
          <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] bg-purple-200/30 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-classivo-blue/10 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
        </motion.div>

        {/* Grain overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <SystemHeader />

      <main className="relative z-10 pt-32 pb-20">

        {/* --- Hero Section --- */}
        <Container className="mb-32">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-white/60 backdrop-blur-md mb-8 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-classivo-blue animate-pulse" />
              <span className="text-sm font-medium text-classivo-black/70 tracking-wide uppercase">Introducing Classivo 2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-semibold tracking-tight leading-[1.1] mb-8 font-display"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-classivo-black to-classivo-black/70">
                Manage your school
              </span>
              <br />
              <span className="text-classivo-blue italic relative inline-block">
                fluidly.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-classivo-lightblue/40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99996C20.6715 3.39003 52.8876 1.8383 198.001 2.00003" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Experience the future of education management. A system so intuitive, it feels like it reads your mind.
              Beautiful, powerful, and built for everyone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={() => navigate('/register')}
                className="h-14 px-8 rounded-full bg-classivo-black text-white hover:bg-gray-800 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                Get Started for Free
              </Button>
              <Button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="h-14 px-8 rounded-full border-2 border-white/50 bg-white/30 backdrop-blur-md text-classivo-black hover:bg-white/60 text-lg w-full sm:w-auto"
              >
                Live Demo
              </Button>
            </motion.div>
          </div>

          <Hero3DCard />
        </Container>


        {/* --- Stats Banner --- */}
        <div className="w-full border-y border-classivo-black/5 bg-white/20 backdrop-blur-sm py-12 mb-32 overflow-hidden">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Active Learners', value: '1.2M+' },
                { label: 'Institutions', value: '4,000+' },
                { label: 'Daily Activities', value: '15M+' },
                { label: 'Uptime', value: '99.99%' },
              ].map((stat, i) => (
                <div key={i} className="text-center relative">
                  <div className="text-4xl md:text-5xl font-bold text-classivo-blue mb-2 tracking-tight">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.label}</div>
                  {i !== 3 && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-classivo-black/10" />}
                </div>
              ))}
            </div>
          </Container>
        </div>


        {/* --- Features --- */}
        <section id="features" className="mb-32">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-semibold mb-6">Designed for <span className="text-classivo-blue">everything</span> you do.</h2>
              <p className="text-xl text-gray-600">Complex problems solved with simple, elegant solutions.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, i) => (
                <FeatureCard key={i} {...feature} index={i} />
              ))}
            </div>
          </Container>
        </section>


        {/* --- Testimonial / Trust --- */}
        <Container className="mb-32">
          <div className="relative rounded-[3rem] overflow-hidden bg-classivo-black text-white p-12 lg:p-24">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-classivo-blue/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-classivo-lightblue/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
                </div>
                <blockquote className="text-3xl md:text-4xl font-medium leading-[1.3] mb-8">
                  "Classivo didn't just digitize our school; it gave us back the time to focus on what matters most — our students."
                </blockquote>
                <div>
                  <div className="text-xl font-bold">Sarah Jenkins</div>
                  <div className="text-gray-400">Principal, Westover Academy</div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <div className="text-3xl font-bold mb-1">40%</div>
                    <div className="text-sm text-gray-400">Admin time saved</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 translate-y-8">
                    <div className="text-3xl font-bold mb-1">Zero</div>
                    <div className="text-sm text-gray-400">Paper usage</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <div className="text-3xl font-bold mb-1">24/7</div>
                    <div className="text-sm text-gray-400">Support access</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 translate-y-8">
                    <div className="text-3xl font-bold mb-1">100%</div>
                    <div className="text-sm text-gray-400">Compliance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* --- Call to Action --- */}
        <Container>
          <div className="text-center py-20 relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[300px] bg-gradient-to-r from-transparent via-classivo-blue/10 to-transparent blur-3xl pointer-events-none" />

            <h2 className="text-5xl md:text-7xl font-bold mb-8 relative z-10">
              Ready to <span className="text-classivo-blue">dive in?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of forward-thinking institutions. Start your 14-day free trial today.
            </p>
            <div className="relative z-10">
              <Button
                onClick={() => navigate('/register')}
                className="h-16 px-12 rounded-full bg-classivo-blue text-white text-xl font-medium shadow-2xl hover:bg-classivo-blue/90 hover:scale-105 transition-all duration-300"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </Container>

      </main>

      <SystemFooter />
    </div>
  );
}
