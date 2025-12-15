import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import SystemHeader from '@/components/layouts/SystemHeader';
import SystemFooter from '@/components/layouts/SystemFooter';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export default function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-classivo-cream text-classivo-black relative overflow-hidden">
      {/* Dynamic Background */}
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-classivo-lightblue/30 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-classivo-blue/20 blur-[150px] rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-purple-200/20 blur-[150px] rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-4000" />
      </div>

      <SystemHeader />
      <div className="pt-32 pb-20 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md px-6"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-classivo-black mb-3 font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          <div className="glass-panel rounded-3xl p-8 bg-white/40 border border-white/60 shadow-xl backdrop-blur-xl">
            {children}
          </div>

          {footer && (
            <div className="text-center mt-8 text-gray-500 text-sm">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
      <SystemFooter />
    </div>
  );
}
