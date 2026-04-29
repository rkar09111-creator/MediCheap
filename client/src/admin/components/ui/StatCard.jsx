import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  subtitle, 
  color = 'blue',
  urgent = false,
  onClick 
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    pink: 'bg-pink-50 text-pink-600',
    purple: 'bg-purple-50 text-purple-600',
    teal: 'bg-teal-50 text-teal-600',
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
      className={`page-card p-5 relative cursor-pointer group transition-all duration-200 ${urgent ? 'border-danger/20' : ''}`}
      onClick={onClick}
    >
      {urgent && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-danger rounded-t-xl" />
      )}

      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-admin-text-secondary tracking-tight">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-admin-text-primary font-mono tracking-tighter">
          {value}
        </h3>
        {trendValue && (
          <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            trend === 'up' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
          }`}>
            {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-admin-text-tertiary font-medium">
          {subtitle}
        </span>
        <ArrowRight size={14} className="text-admin-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
};

export default StatCard;
