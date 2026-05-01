import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Calendar, 
  Download, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart as PieIcon,
  Map as MapIcon,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 42000, orders: 120, users: 45 },
  { name: 'Feb', revenue: 38000, orders: 110, users: 52 },
  { name: 'Mar', revenue: 54000, orders: 160, users: 89 },
  { name: 'Apr', revenue: 48000, orders: 142, users: 76 },
  { name: 'May', revenue: 62000, orders: 190, users: 110 },
  { name: 'Jun', revenue: 59000, orders: 175, users: 124 },
];

const categorySales = [
  { name: 'Tablets', value: 45 },
  { name: 'Syrups', value: 25 },
  { name: 'Capsules', value: 20 },
  { name: 'Injections', value: 10 },
];

const COLORS = ['#00C853', '#00A344', '#34D399', '#BBF7E2', '#DCFCEE'];

import { adminService } from '../../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('This Week');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getStats();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <Activity size={40} className="text-brand-primary animate-pulse" />
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Aggregating Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-brand-primary" />
            Business Intelligence
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Deep-dive insights into sales, growth, and operational efficiency.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-btn-ghost border border-admin-border flex items-center gap-2 h-11 hover:text-brand-primary transition-all"><Calendar className="w-4 h-4" /> <span>{range}</span> <ChevronDown className="w-4 h-4" /></button>
          <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"><Download className="w-4 h-4" /> <span>Export Report</span></button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, trend: '+0%', icon: DollarSign, color: 'text-brand-primary', bg: 'bg-brand-50' },
          { label: 'Avg Order Value', value: `₹${stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}`, trend: '+0%', icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Customers', value: stats.totalUsers || 0, trend: '+0%', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Success Rate', value: '100%', trend: '+0%', icon: Activity, color: 'text-brand-primary', bg: 'bg-brand-50' },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-6 relative overflow-hidden group hover:border-brand-primary transition-all">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all`}><stat.icon className="w-6 h-6" /></div>
            <p className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end gap-3 mt-1">
              <h3 className="text-2xl font-display font-bold text-admin-text-primary group-hover:text-brand-primary transition-colors">{stat.value}</h3>
              <span className={`text-xs font-bold flex items-center mb-1 ${stat.trend.startsWith('+') ? 'text-brand-primary' : 'text-rose-500'}`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-7 admin-card p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-display font-bold text-admin-text-primary">Revenue & Order Trends</h3>
              <p className="text-xs text-admin-text-secondary font-medium uppercase tracking-widest mt-1">Monthly performance distribution</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-primary" /> <span className="text-[10px] font-bold text-admin-text-secondary uppercase">Revenue</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400" /> <span className="text-[10px] font-bold text-admin-text-secondary uppercase">Orders</span></div>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C853" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748B', fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748B', fontWeight: 600}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#00C853" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="orders" stroke="#00A344" strokeWidth={4} fillOpacity={0.1} fill="#00A344" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="lg:col-span-3 admin-card p-8">
          <h3 className="text-lg font-display font-bold text-admin-text-primary mb-10">Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.ordersByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {(stats.ordersByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-10">
            {(stats.ordersByStatus || []).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs font-bold text-admin-text-secondary uppercase">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-admin-text-primary">{item.value} Units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECONDARY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth */}
        <div className="admin-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-display font-bold text-admin-text-primary">New Registrations</h3>
            <span className="text-[10px] font-bold text-brand-primary bg-brand-50 px-2 py-1 rounded-lg">+24% vs Prev. Year</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.userGrowthChart || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748B', fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748B', fontWeight: 600}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="users" fill="#00C853" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="admin-card p-8">
          <h3 className="text-lg font-display font-bold text-admin-text-primary mb-8">Delivery Performance</h3>
          <div className="space-y-8">
            {[
              { label: 'Avg. Delivery Time', value: '42 mins', status: 'Excellent', color: 'text-brand-primary', progress: 85 },
              { label: 'Order Cancellation Rate', value: '1.2%', status: 'Low', color: 'text-brand-primary', progress: 12 },
              { label: 'Rider Fulfillment Rate', value: '98.4%', status: 'Target Met', color: 'text-emerald-500', progress: 98 },
              { label: 'Support Resolution Time', value: '12 mins', status: 'Improving', color: 'text-amber-500', progress: 65 },
            ].map((metric, i) => (
              <div key={i} className="space-y-3 group">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest group-hover:text-brand-primary transition-colors">{metric.label}</p>
                    <h4 className="text-lg font-bold text-admin-text-primary mt-1 group-hover:text-brand-primary transition-colors">{metric.value}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${metric.color}`}>{metric.status}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${metric.color === 'text-amber-500' ? 'bg-amber-500' : 'bg-brand-primary'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
