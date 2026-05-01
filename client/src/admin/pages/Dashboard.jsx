import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    ShoppingBag, 
    DollarSign, 
    Pill, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    Activity,
    Clock,
    ClipboardList,
    Package,
    Loader2,
    Truck,
    ChevronRight,
    Bell,
    AlertCircle,
    Zap,
    ArrowRight,
    ArrowDown,
    Calendar,
    Target
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { adminService } from '../../services/api';
import { format } from 'date-fns';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('7d');

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data } = await adminService.getStats();
            setStats(data.data);
        } catch (error) {
            console.error('Error fetching dashboard stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading || !stats) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 size={32} className="text-brand-green animate-spin" />
            <p className="text-xs font-bold text-admin-text-tertiary uppercase tracking-[0.2em] animate-pulse">Loading Admin Dashboard...</p>
        </div>
    );

    const COLORS = ['#024F3A', '#059669', '#34D399', '#BBF7E2', '#DCFCEE'];

    return (
        <div className="space-y-6">
            {/* TOP HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-admin-text-primary tracking-tight">Admin Dashboard</h1>
                    <p className="text-xs text-admin-text-tertiary font-medium mt-0.5">Real-time overview of MediCheap operations</p>
                </div>
                <div className="flex items-center gap-2 bg-admin-surface p-1 rounded-lg border border-admin-border shadow-sm">
                    {['24h', '7d', '30d', 'All'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                                dateRange === range 
                                    ? 'bg-admin-text-primary text-white shadow-sm' 
                                    : 'text-admin-text-tertiary hover:text-admin-text-primary'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-admin-border mx-1" />
                    <button className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-admin-text-secondary hover:text-admin-text-primary transition-colors">
                        <Calendar size={12} />
                        Custom
                    </button>
                </div>
            </div>

            {/* QUICK ALERTS */}
            {(stats.pendingOrders > 0 || stats.pendingPrescriptions > 0 || stats.lowStockItems > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.pendingOrders > 0 && (
                        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                    <ShoppingBag size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-amber-900">{stats.pendingOrders} Orders Pending</p>
                                    <p className="text-[10px] text-amber-700 font-medium leading-none mt-0.5">Action required for dispatch</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-bold text-amber-700 hover:underline uppercase tracking-wider flex items-center gap-1">
                                View <ArrowRight size={10} />
                            </button>
                        </div>
                    )}
                    {stats.pendingPrescriptions > 0 && (
                        <div className="flex items-center justify-between bg-rose-50 border border-rose-200 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                                    <ClipboardList size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-rose-900">{stats.pendingPrescriptions} Rx to Verify</p>
                                    <p className="text-[10px] text-rose-700 font-medium leading-none mt-0.5">Clinical verification queue</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-bold text-rose-700 hover:underline uppercase tracking-wider flex items-center gap-1">
                                Review <ArrowRight size={10} />
                            </button>
                        </div>
                    )}
                    {stats.lowStockItems > 0 && (
                        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Package size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-900">{stats.lowStockItems} Low Stock Alerts</p>
                                    <p className="text-[10px] text-blue-700 font-medium leading-none mt-0.5">Inventory replenishment needed</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-bold text-blue-700 hover:underline uppercase tracking-wider flex items-center gap-1">
                                Restock <ArrowRight size={10} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* KEY STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    label="Total Revenue" 
                    value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} 
                    icon={DollarSign} 
                    trend="up" 
                    trendValue="14.2" 
                    subtitle="vs last period"
                    color="green"
                />
                <StatCard 
                    label="Active Orders" 
                    value={stats.activeOrders || 0} 
                    icon={ShoppingBag} 
                    trend="up" 
                    trendValue="8.4" 
                    subtitle="Currently being processed"
                    color="purple"
                    urgent={stats.pendingOrders > 10}
                />
                <StatCard 
                    label="Total Users" 
                    value={stats.totalUsers || 0} 
                    icon={Users} 
                    trend="up" 
                    trendValue="2.1" 
                    subtitle="Platform growth"
                    color="blue"
                />
                <StatCard 
                    label="Success Rate" 
                    value="98.4%" 
                    icon={Target} 
                    subtitle="Dispatch accuracy"
                    color="teal"
                />
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 page-card">
                    <div className="page-card-header">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-brand-green" />
                            <h3 className="text-sm font-bold text-admin-text-primary">Revenue Trends</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-brand-green" />
                                <span className="text-[10px] font-bold text-admin-text-tertiary uppercase">Current</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-brand-green/20" />
                                <span className="text-[10px] font-bold text-admin-text-tertiary uppercase">Target</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueChart || []}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#024F3A" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#024F3A" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#8B9AA8' }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 600, fill: '#8B9AA8' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: 'var(--shadow-lg)', 
                                        padding: '12px',
                                        fontSize: '12px',
                                        fontWeight: 600
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#024F3A" 
                                    strokeWidth={2} 
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="page-card">
                    <div className="page-card-header">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-brand-green" />
                            <h3 className="text-sm font-bold text-admin-text-primary">Status Distribution</h3>
                        </div>
                    </div>
                    <div className="p-5 h-[320px] flex flex-col">
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.ordersByStatus || []}>
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 9, fontWeight: 700, fill: '#8B9AA8' }}
                                        dy={5}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(5, 150, 105, 0.05)' }}
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        { (stats.ordersByStatus || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {(stats.ordersByStatus || []).slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-admin-bg">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-admin-text-primary uppercase truncate">{item.name}</p>
                                        <p className="text-[10px] font-medium text-admin-text-tertiary">{item.value} units</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT ORDERS TABLE */}
            <div className="page-card">
                <div className="page-card-header">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-brand-green" />
                        <h3 className="text-sm font-bold text-admin-text-primary">Recent Orders</h3>
                    </div>
                    <button className="btn-admin btn-admin-secondary h-8 px-3 text-[11px]">
                        View All Orders
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-admin-bg/50 border-b border-admin-border">
                                <th className="px-5 py-3 text-left text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">Order ID</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">Customer</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">Amount</th>
                                <th className="px-5 py-3 text-left text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-right text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border-2">
                            {(stats.recentOrders || []).map((order) => (
                                <tr key={order._id} className="hover:bg-admin-bg/30 transition-colors group">
                                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-admin-text-primary">
                                        #{order.orderId}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-brand-green/10 flex items-center justify-center text-[10px] font-bold text-brand-green">
                                                {order.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-admin-text-primary">{order.user?.name}</p>
                                                <p className="text-[10px] text-admin-text-tertiary">{order.user?.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 font-bold text-xs text-admin-text-primary">
                                        ₹{order.totalAmount?.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <StatusBadge status={order.status.toLowerCase()} />
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button className="p-1.5 rounded-md hover:bg-admin-bg text-admin-text-tertiary hover:text-admin-text-primary transition-all opacity-0 group-hover:opacity-100">
                                            <ChevronRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="page-card-footer flex justify-center">
                    <button className="text-[11px] font-bold text-brand-green hover:underline uppercase tracking-widest flex items-center gap-1.5">
                        View All Orders <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
