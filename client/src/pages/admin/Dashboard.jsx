import React, { useState, useEffect } from 'react';
import { 
    Users, 
    ShoppingBag, 
    DollarSign, 
    Pill, 
    AlertCircle, 
    FileText, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/api/dashboard/stats');
                setStats(data.data);
            } catch (error) {
                console.error('Error fetching dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-brand-500/20 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Initializing Command Deck...</p>
        </div>
    );

    const cards = [
        { title: 'Gross Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: 'text-brand-primary', bg: 'bg-brand-600/5', trend: '+12.5%', isUp: true },
        { title: 'Clinical Orders', value: stats.totalOrders, icon: <ShoppingBag />, color: 'text-brand-primary', bg: 'bg-brand-600/5', trend: '+5.2%', isUp: true },
        { title: 'Patient Registry', value: stats.totalUsers, icon: <Users />, color: 'text-brand-primary', bg: 'bg-brand-600/5', trend: '+2.1%', isUp: true },
        { title: 'Pharma Stock', value: stats.totalMedicines, icon: <Pill />, color: 'text-brand-primary', bg: 'bg-brand-600/5', trend: 'Optimal', isUp: true },
    ];

    return (
        <div className="space-y-16 animate-in fade-in duration-1000">
            {/* Header Terminal */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-100 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                            <Activity size={20} className="text-brand-primary animate-pulse" />
                        </div>
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Node Operational</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter leading-none">Command <br/><span className="text-neutral-400">Deck.</span></h1>
                    <p className="text-sm text-neutral-400 font-medium tracking-tight">Institutional Logistics Node #4012 — 24-hour sync complete.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="h-16 px-8 bg-white border-2 border-neutral-100 rounded-2xl text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] hover:border-brand-600/30 transition-all shadow-xl shadow-neutral-900/5">
                        Export Logs
                    </button>
                    <button className="h-16 px-10 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary transition-all shadow-2xl shadow-neutral-900/10 flex items-center gap-3 group">
                        <TrendingUp size={18} className="group-hover:scale-125 transition-transform" /> Strategic Reports
                    </button>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        key={card.title} 
                        className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 relative overflow-hidden group hover:border-brand-600/30 transition-all duration-700"
                    >
                        <div className="relative z-10">
                            <div className={`w-16 h-16 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-8 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border border-transparent group-hover:border-brand-600/20`}>
                                {React.cloneElement(card.icon, { size: 32, strokeWidth: 2.5 })}
                            </div>
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">{card.title}</p>
                            <h3 className="text-4xl font-display font-black text-neutral-900 leading-none">{card.value}</h3>
                            
                            <div className={`mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${card.isUp ? 'text-brand-primary' : 'text-rose-500'}`}>
                                <span className={`flex items-center px-3 py-1.5 rounded-full ${card.isUp ? 'bg-brand-600/10 border border-brand-600/10' : 'bg-rose-50'}`}>
                                    {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {card.trend}
                                </span>
                                <span className="text-neutral-300 font-bold">period delta</span>
                            </div>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-neutral-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-1000 ease-out" />
                    </motion.div>
                ))}
            </div>

            {/* Main Intelligence Grid */}
            <div className="grid lg:grid-cols-3 gap-10 pb-20">
                {/* Revenue Intelligence */}
                <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-display font-black text-neutral-900 tracking-tighter">Revenue Intelligence</h3>
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em]">Real-time fulfillment value analysis</p>
                        </div>
                        <select className="bg-neutral-50 border-none rounded-xl px-6 py-3 text-[10px] font-black text-neutral-600 uppercase tracking-widest outline-none hover:bg-neutral-100 transition-colors cursor-pointer shadow-inner">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Fiscal Quarter</option>
                        </select>
                    </div>

                    <div className="h-[450px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00C853" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    dy={15}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', padding: '20px' }}
                                    itemStyle={{ fontWeight: 900, color: '#00C853', fontSize: '14px', textTransform: 'uppercase' }}
                                    labelStyle={{ fontWeight: 900, color: '#111827', marginBottom: '8px' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#00C853" 
                                    strokeWidth={5} 
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                    animationDuration={2500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Strategic Pulse */}
                <div className="space-y-10">
                    {/* Critical Alerts */}
                    <div className="bg-neutral-900 p-10 rounded-[3.5rem] text-white shadow-elite relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-brand-primary">Strategic Pulse</h3>
                                    <p className="text-[10px] text-neutral-500 font-bold">Action required on active nodes</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl text-rose-500 animate-pulse border border-white/5">
                                    <AlertCircle size={24} />
                                </div>
                            </div>
                            
                            <div className="space-y-5">
                                {[
                                    { label: 'Pending Verifications', count: stats.pendingPrescriptions, color: 'bg-brand-600/20 text-brand-primary' },
                                    { label: 'Restock Required', count: stats.lowStockItems, color: 'bg-rose-500/20 text-rose-400' },
                                    { label: 'Active Dispatches', count: stats.pendingOrders, color: 'bg-amber-500/20 text-amber-400' },
                                ].map((alert, i) => (
                                    <div key={alert.label} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group/item hover:bg-white/10 duration-500">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 group-hover/item:text-neutral-300 transition-colors">{alert.label}</p>
                                            <p className="text-3xl font-display font-black">{alert.count}</p>
                                        </div>
                                        <div className={`w-12 h-12 ${alert.color} rounded-[1.25rem] flex items-center justify-center font-black text-sm group-hover/item:scale-110 transition-transform duration-500`}>
                                            <ArrowUpRight size={22} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Background Pulse Effect */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    </div>

                    {/* Operational Shortcuts */}
                    <div className="bg-white p-10 rounded-[3.5rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-8">Operations Quick-Node</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <button className="h-32 rounded-3xl bg-neutral-25 hover:bg-brand-primary hover:text-white transition-all duration-700 flex flex-col items-center justify-center gap-4 group shadow-inner">
                                <div className="p-3 bg-white rounded-xl text-brand-primary group-hover:bg-white/20 group-hover:text-white transition-all shadow-xl shadow-neutral-900/5 group-hover:scale-110">
                                    <Pill size={28} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Inventory</span>
                            </button>
                            <button className="h-32 rounded-3xl bg-neutral-25 hover:bg-neutral-900 hover:text-white transition-all duration-700 flex flex-col items-center justify-center gap-4 group shadow-inner">
                                <div className="p-3 bg-white rounded-xl text-neutral-900 group-hover:bg-white/20 group-hover:text-white transition-all shadow-xl shadow-neutral-900/5 group-hover:scale-110">
                                    <ShoppingBag size={28} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Orders</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AdminDashboard;
