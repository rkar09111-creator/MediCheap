import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  fullRadius = false,
  children, 
  loading, 
  icon: Icon, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-[#16A34A] text-white shadow-[0_4px_20px_rgba(22,163,74,0.25)] hover:bg-[#15803D] hover:translate-y-[-1px] hover:shadow-[0_8px_32px_rgba(22,163,74,0.40)]',
    secondary: 'bg-[#F8FAFB] text-[#243B53] border border-[#E4ECF2] hover:bg-[#F0F5F8] hover:border-[#C4D3DE]',
    ghost: 'bg-transparent text-[#4A6580] hover:bg-[#F4F8FA] hover:text-[#050E17]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]',
    premium: 'bg-linear-to-br from-[#F59E0B] to-[#D97706] text-white shadow-[0_4px_20px_rgba(245,158,11,0.30)] hover:translate-y-[-1px]',
    outline: 'border border-[#E4ECF2] bg-transparent text-[#243B53] hover:bg-[#F4F8FA]',
  };

  const sizes = {
    sm: 'h-[32px] px-[14px] text-[12px]',
    md: 'h-[40px] px-[18px] text-[13px]',
    lg: 'h-[48px] px-[24px] text-[15px]',
    xl: 'h-[56px] px-[32px] text-[16px]',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-display font-semibold tracking-[-0.01em] transition-all duration-120 cursor-pointer whitespace-nowrap active:scale-[0.98] active:translate-y-0 disabled:opacity-[0.75] disabled:pointer-events-none',
        fullRadius ? 'rounded-full' : 'rounded-[10px]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export const Card = ({ className, children, hover = false, ...props }) => (
  <div 
    className={cn(
      'bg-white border border-[#E4ECF2] rounded-[18px] shadow-[0_1px_4px_rgba(5,14,23,0.06),0_0_0_1px_rgba(5,14,23,0.04)] overflow-hidden',
      hover && 'transition-all duration-220 hover:shadow-[0_10px_28px_rgba(5,14,23,0.10),0_0_0_1px_rgba(22,163,74,0.16)] hover:border-[#A8F0C6] hover:translate-y-[-2px]',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, sub, children, className }) => (
  <div className={cn('px-5 py-4 border-b border-[#F4F8FA] flex items-center justify-between', className)}>
    <div>
      <h4 className="font-display font-semibold text-[15px] text-[#0D1B2A]">{title}</h4>
      {sub && <p className="font-body font-normal text-[12px] text-[#6B849D]">{sub}</p>}
    </div>
    {children}
  </div>
);

export const CardBody = ({ children, className }) => (
  <div className={cn('p-5', className)}>
    {children}
  </div>
);

export const Input = ({ label, helper, error, wrapperClassName, className, ...props }) => (
  <div className={cn('relative', wrapperClassName)}>
    {label && (
      <label className="font-body font-semibold text-[11px] text-[#4A6580] uppercase tracking-[0.07em] mb-1.5 block">
        {label}
      </label>
    )}
    <input
      className={cn(
        'w-full h-[46px] px-3.5 bg-[#F8FAFB] border-[1.5px] border-[#E4ECF2] rounded-[10px] font-body font-normal text-[14px] text-[#0D1B2A] transition-all duration-120 outline-none focus:border-[#16A34A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(22,163,74,0.10)] invalid:border-[#EF4444] invalid:shadow-[0_0_0_3px_rgba(239,68,68,0.08)] hover:border-[#C4D3DE] hover:bg-white',
        className
      )}
      {...props}
    />
    {error ? (
      <p className="font-body font-normal text-[11px] text-[#EF4444] mt-[5px]">{error}</p>
    ) : helper ? (
      <p className="font-body font-normal text-[11px] text-[#6B849D] mt-[5px]">{helper}</p>
    ) : null}
  </div>
);

export const Badge = ({ className, variant = 'info', children }) => {
  const variants = {
    info: 'bg-[#EFF6FF] text-[#3B82F6]',
    success: 'bg-[#EDFDF4] text-[#16A34A]',
    warning: 'bg-[#FFFBEB] text-[#F59E0B]',
    danger: 'bg-[#FFF1F1] text-[#EF4444]',
    ink: 'bg-[#E4ECF2] text-[#4A6580]',
  };
  return (
    <span className={cn(
      'inline-flex items-center gap-[5px] font-body font-semibold text-[10px] uppercase tracking-[0.06em] rounded-full px-[9px] py-[3px]', 
      variants[variant], 
      className
    )}>
      {children}
    </span>
  );
};

export const Skeleton = ({ className, ...props }) => (
  <div className={cn('animate-pulse bg-[#E4ECF2] rounded-md', className)} {...props} />
);
