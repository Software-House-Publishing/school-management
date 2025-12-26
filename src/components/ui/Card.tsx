import { ReactNode } from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass';
  onClick?: () => void;
}

export function Card({ children, className, padding = 'md', variant = 'default', onClick }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        variant === 'glass'
          ? 'bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/60'
          : 'bg-white rounded-lg shadow-sm border border-gray-200',
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {children}
    </div>
  );
}