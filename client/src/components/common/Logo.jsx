import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Plus, ShieldCheck } from 'lucide-react';
import { cn } from '../ui';

const Logo = ({ isScrolled, isHome, light, className, variant = 'client', size = 'md' }) => {
  // Determine if we should use light text (e.g., on dark backgrounds)
  const isLight = light || (isHome && !isScrolled);

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const containerSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <Link to={variant === 'admin' ? '/admin' : '/'} className={cn("flex items-center gap-2.5 group cursor-pointer", className)}>
      <div className="relative">
        <div className={cn(
          "flex items-center justify-center transition-all duration-500 shadow-lg",
          containerSizes[size],
          variant === 'admin' 
            ? "bg-gradient-to-br from-brand-500 to-brand-400 rotate-0 group-hover:rotate-3" 
            : "bg-brand-primary rotate-[-10deg] group-hover:rotate-0 shadow-brand-600/20"
        )}>
          {variant === 'admin' ? (
            <ShieldCheck className="text-white" size={iconSizes[size]} strokeWidth={3} />
          ) : (
            <Pill className="text-white" size={iconSizes[size]} strokeWidth={3} />
          )}
        </div>
        {variant !== 'admin' && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100">
            <Plus className="text-brand-primary" size={10} strokeWidth={4} />
          </div>
        )}
      </div>
      <div className={cn("flex items-baseline font-display tracking-tighter", textSizes[size])}>
        <span className={cn(
          "font-extrabold transition-colors duration-300",
          isLight ? "text-white" : variant === 'admin' ? "text-white" : "text-neutral-900"
        )}>Medi</span>
        <span className="font-extrabold text-brand-primary">Cheap</span>
        {variant === 'admin' && (
          <span className="ml-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden md:inline">Portal</span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
