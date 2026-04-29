import React, { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, ChevronUp } from 'lucide-react';
import { analyticsService } from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebarStats = ({ isCollapsed }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await analyticsService.getSummary();
        setStats(data.data);
      } catch (err) {
        console.error('Sidebar stats failed');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (isCollapsed) return null;

  return (
    <div className="px-4 py-6 mt-4 border-t border-sidebar-border/50">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-text opacity-40">Live Intel</p>
        <div className="flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-brand-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-green"></span>
        </div>
      </div>

      <div className="space-y-4">
        {/* ACTIVE USERS */}
        <div className="group">
          <div className="flex items-center justify-between text-sidebar-text mb-1">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-brand-green-lt" />
              <span className="text-[11px] font-bold">Active Sessions</span>
            </div>
            <span className="text-xs font-black text-white">{stats?.customers?.activeNow || 0}</span>
          </div>
          <div className="h-1 w-full bg-sidebar-hover rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(((stats?.customers?.activeNow || 0) / 50) * 100, 100)}%` }}
              className="h-full bg-brand-green shadow-[0_0_8px_rgba(34,197,94,0.4)]"
            />
          </div>
        </div>

        {/* DAILY VISITS */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={14} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-sidebar-text opacity-60">Today's Traffic</p>
              <p className="text-xs font-black text-white">{stats?.visits?.today || 0} visits</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-[10px] font-black text-brand-green-lt">
              <ChevronUp size={10} />
              <span>12%</span>
            </div>
          </div>
        </div>

        {/* CUSTOMER GROWTH */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green-lt group-hover:scale-110 transition-transform">
              <Users size={14} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-sidebar-text opacity-60">New Node Deployment</p>
              <p className="text-xs font-black text-white">+{stats?.customers?.newToday || 0} users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebarStats;
