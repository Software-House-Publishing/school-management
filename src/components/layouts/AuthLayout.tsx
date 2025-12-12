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
    <div className="min-h-screen bg-[#F5F5F7] text-[#1d1d1f]">
      <SystemHeader />
      <div className="pt-32 pb-20 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md px-6"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_24px_rgba(0,0,0,0.04)] border border-gray-100">
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
