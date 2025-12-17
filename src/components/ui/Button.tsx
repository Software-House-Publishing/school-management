import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'default';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-classivo-blue text-white hover:bg-classivo-blue/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    default: 'bg-classivo-blue text-white hover:bg-classivo-blue/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5', // Alias for primary
    secondary: 'bg-classivo-lightblue/20 text-classivo-blue hover:bg-classivo-lightblue/30',
    outline: 'glass-button hover:bg-white border-white/60 text-classivo-blue shadow-sm',
    ghost: 'text-classivo-black/70 hover:bg-black/5 hover:text-classivo-black',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  };



  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}