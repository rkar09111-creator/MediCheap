import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ className, variant = 'primary', size = 'md', children, loading, icon: Icon, ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-soft',
    secondary: 'bg-accent text-white hover:bg-accent-dark shadow-soft',
    outline: 'border border-border bg-transparent text-text-primary hover:bg-slate-50',
    ghost: 'bg-transparent text-text-secondary hover:bg-slate-100 hover:text-text-primary',
    danger: 'bg-danger text-white hover:opacity-90 shadow-soft',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-btn font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export const Card = ({ className, children, ...props }) => (
  <div className={cn('bg-surface border border-border rounded-card shadow-soft overflow-hidden', className)} {...props}>
    {children}
  </div>
);

export const Badge = ({ className, variant = 'info', children }) => {
  const variants = {
    info: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest', variants[variant], className)}>
      {children}
    </span>
  );
};

export const Skeleton = ({ className, ...props }) => (
  <div className={cn('animate-pulse bg-slate-200 rounded-md', className)} {...props} />
);
