import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical, 
    Shield, 
    User, 
    Mail, 
    Phone, 
    Calendar,
    ChevronRight,
    Ban,
    CheckCircle2,
    Clock,
    Plus,
    Activity,
    TrendingUp,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/users');
            setUsers(data.data.users);
        } catch (error) {
            toast.error('Failed to load user directory');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            // Placeholder for status toggle logic if API exists
            toast.success('User status updated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const roleColors = {
        admin: 'bg-rose-50 text-rose-600 border-rose-100',
        rider: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        customer: 'bg-primary-50 text-primary-600 border-primary-100'
    };

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
            {/* Header Terminal */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-neutral-100 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                            <Users size={20} className="text-brand-primary animate-pulse" />
                        </div>
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Node Registry Command</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter leading-none">Patient <br/><span className="text-neutral-400">Registry.</span></h1>
                    <p className="text-sm text-neutral-400 font-medium tracking-tight">Managing institutional access and secure patient directories.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-brand-primary transition-colors" size={24} />
                        <input 
                            type="text" 
                            placeholder="Trace Identity or Email..."
                            className="pl-16 pr-8 h-20 bg-neutral-25 border-none rounded-[2rem] text-sm font-black w-[450px] focus:ring-8 focus:ring-brand-600/10 focus:bg-white transition-all shadow-inner placeholder:text-neutral-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Role Filter Pipeline */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-[2.5rem] w-fit border border-neutral-100 shadow-inner">
                {['all', 'customer', 'rider', 'admin'].map((role) => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-10 h-14 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${roleFilter === role ? 'bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20' : 'text-neutral-400 hover:text-neutral-900 hover:bg-white'}`}
                    >
                        {role}s
                    </button>
                ))}
            </div>

            {/* Registry Manifest */}
            <div className="bg-white rounded-[3.5rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 overflow-hidden">
                {loading ? (
                    <div className="py-52 flex flex-col items-center justify-center gap-8">
                        <Loader2 size={48} className="animate-spin text-brand-primary" />
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Accessing Master Registry...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Institutional Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Contact Node</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">System Role</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Joined Node</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] text-right">Terminal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filteredUsers.map((user, i) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03, duration: 0.6 }}
                                        key={user._id} 
                                        className="hover:bg-neutral-25/50 transition-all duration-500 group"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-50 flex items-center justify-center text-brand-primary border border-neutral-100 shadow-inner group-hover:bg-white transition-all duration-700">
                                                    <span className="font-display font-black text-xl">{user.name?.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-display font-black text-neutral-900 text-lg uppercase tracking-tighter">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">UID: {user._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1.5">
                                                <p className="text-sm font-black text-neutral-700 flex items-center gap-3 uppercase tracking-tight">
                                                    <Mail size={16} className="text-neutral-300" /> {user.email}
                                                </p>
                                                <p className="text-[10px] text-neutral-400 font-black flex items-center gap-3 uppercase tracking-widest">
                                                    <Phone size={16} className="text-neutral-300" /> {user.phone || 'NO SECURE LINK'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-700 ${roleColors[user.role] || 'bg-neutral-50 text-neutral-400 border-neutral-200'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-neutral-900 tracking-tighter uppercase">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest mt-1">Registry Initialized</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <button className="w-12 h-12 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl transition-all flex items-center justify-center">
                                                    <MoreVertical size={22} />
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleStatus(user._id, 'active')}
                                                    className="w-12 h-12 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all flex items-center justify-center"
                                                >
                                                    <Ban size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Analytics Glance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { label: 'Total Registry', value: users.length, icon: <Users size={32} />, color: 'text-brand-primary', bg: 'bg-brand-600/5' },
                    { label: 'Active Nodes', value: '142', icon: <Activity size={32} />, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Growth Vector', value: '+12%', icon: <TrendingUp size={32} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                        key={i} 
                        className="bg-white p-10 rounded-[3.5rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 flex items-center gap-8 group hover:border-brand-600/30 transition-all duration-700"
                    >
                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center ${stat.bg} ${stat.color} shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-transparent group-hover:border-current/10`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                            <p className="text-4xl font-display font-black text-neutral-900 leading-none tracking-tighter">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
