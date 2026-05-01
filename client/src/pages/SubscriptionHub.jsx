import React, { useState, useEffect } from 'react';
import { 
    Calendar, 
    Clock, 
    RefreshCcw, 
    Plus, 
    Zap, 
    ShieldCheck, 
    AlertCircle,
    ChevronRight,
    Play,
    Pause,
    Trash2,
    Activity,
    Target,
    Sparkles,
    Gem,
    ArrowUpRight,
    CheckCircle2
} from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SubscriptionHub = () => {
    const { user, updateUser, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    
    if (authLoading || !user) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-[3px] border-neutral-100 border-t-brand-primary rounded-full animate-spin" />
                <p className="font-body font-black text-[11px] text-neutral-400 uppercase tracking-[0.25em]">Syncing Refill Nodes...</p>
            </div>
        );
    }

    const [subscriptions, setSubscriptions] = useState(user.subscriptions || []);

    const toggleStatus = async (subId) => {
        const toastId = toast.loading('Modifying Protocol...');
        try {
            const { data } = await api.patch(`/api/users/subscriptions/${subId}/toggle`);
            updateUser(data.data.user);
            setSubscriptions(data.data.user.subscriptions);
            toast.success('Protocol Adjusted', { id: toastId });
        } catch (error) {
            toast.error('Modification Failed', { id: toastId });
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 py-6">
            <Toaster position="top-right" />
            
            {/* ── INSTITUTIONAL HEADER ── */}
            <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-neutral-100 pb-12 px-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                            <Activity size={20} className="text-brand-primary animate-pulse" />
                        </div>
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Autonomous Supply Chain</span>
                    </div>
                    <h1 className="font-display font-black text-[42px] lg:text-[56px] text-neutral-950 leading-[0.9] tracking-[-0.05em] uppercase">
                        Auto-Refill <br/><span className="text-neutral-400">Protocols.</span>
                    </h1>
                    <p className="font-body font-bold text-[15px] text-neutral-500 max-w-xl leading-relaxed">
                        Establishing persistent fulfillment nodes for your chronic care requirements. Zero-latency healthcare deployment.
                    </p>
                </div>
                
                <Button 
                    size="xl" 
                    fullRadius 
                    className="h-20 px-12 bg-neutral-950 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    onClick={() => navigate('/shop')}
                >
                    <Plus size={24} className="mr-3" /> Initialize New Node
                </Button>
            </section>

            {/* ── CORE SUBSCRIPTION MESH ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Active Refill Mesh</h4>
                        <Badge className="bg-brand-primary/10 text-brand-primary border-none px-4 py-1 font-black text-[9px] uppercase tracking-widest">{subscriptions.length} Nodes Active</Badge>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {subscriptions.length > 0 ? (
                            <div className="grid gap-6">
                                {subscriptions.map((sub, i) => (
                                    <motion.div
                                        key={sub._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div className={cn(
                                            "relative p-10 bg-white border border-neutral-200 rounded-[40px] shadow-sm overflow-hidden group hover:border-brand-primary/30 hover:shadow-xl transition-all duration-700",
                                            !sub.isActive && "opacity-60 bg-neutral-50 border-neutral-100"
                                        )}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-primary/10 transition-colors" />
                                            
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                                <div className="flex items-center gap-8">
                                                    <div className={cn(
                                                        "w-20 h-20 rounded-[28px] flex items-center justify-center transition-all duration-700 shadow-inner border border-neutral-100",
                                                        sub.isActive ? "bg-neutral-950 text-brand-primary" : "bg-neutral-100 text-neutral-300"
                                                    )}>
                                                        <Zap size={32} fill={sub.isActive ? "currentColor" : "none"} strokeWidth={sub.isActive ? 2 : 2.5} className={sub.isActive ? "animate-pulse" : ""} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-2xl font-display font-black text-neutral-950 tracking-tight uppercase">{sub.medicine?.name || 'Formulation Node'}</h3>
                                                            {sub.isActive ? (
                                                                <div className="w-2 h-2 bg-brand-primary rounded-full animate-ping" />
                                                            ) : (
                                                                <Badge className="bg-neutral-200 text-neutral-400 border-none text-[8px] font-black uppercase tracking-widest">SUSPENDED</Badge>
                                                            )}
                                                        </div>
                                                        <p className="font-body font-black text-[11px] text-neutral-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                                            <RefreshCcw size={14} className="text-brand-primary" /> Every {sub.frequency} Cycles · {sub.medicine?.category}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-4">
                                                    <button 
                                                        onClick={() => toggleStatus(sub._id)}
                                                        className={cn(
                                                            "w-16 h-16 flex items-center justify-center rounded-2xl transition-all shadow-sm border",
                                                            sub.isActive 
                                                                ? "bg-amber-50 text-amber-500 border-amber-100 hover:bg-amber-500 hover:text-white" 
                                                                : "bg-brand-primary text-neutral-950 border-transparent hover:scale-105"
                                                        )}
                                                    >
                                                        {sub.isActive ? <Pause size={24} strokeWidth={2.5} /> : <Play size={24} fill="currentColor" />}
                                                    </button>
                                                    <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400 border border-neutral-100 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all shadow-sm">
                                                        <Trash2 size={24} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mt-10">
                                                <div className="p-6 bg-neutral-50 rounded-[24px] border border-neutral-100 shadow-inner group-hover:bg-white transition-colors">
                                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Previous Deployment</p>
                                                    <p className="font-display font-black text-lg text-neutral-800 tracking-tight">{new Date(sub.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                                <div className="p-6 bg-brand-primary/5 rounded-[24px] border border-brand-primary/10 shadow-inner group-hover:bg-white transition-colors">
                                                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2">Scheduled Sync</p>
                                                    <p className="font-display font-black text-lg text-neutral-950 tracking-tight">{new Date(sub.nextRefillDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-8 border-t border-neutral-50 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                                        <ShieldCheck size={16} strokeWidth={3} />
                                                    </div>
                                                    <span className="font-body font-black text-[10px] text-neutral-400 uppercase tracking-[0.2em]">Clinical Guard Active</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 rounded-full border border-neutral-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                                    <span className="font-num font-black text-[11px] text-neutral-700 tracking-widest uppercase">Node Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-40 bg-white rounded-[48px] border-2 border-dashed border-neutral-100 text-center flex flex-col items-center justify-center space-y-8 shadow-sm">
                                <div className="w-24 h-24 bg-neutral-50 rounded-[32px] flex items-center justify-center text-neutral-200 shadow-inner">
                                    <RefreshCcw size={48} className="animate-spin-slow" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-display font-black text-3xl text-neutral-900 tracking-tighter uppercase">No Active Subscriptions</h3>
                                    <p className="font-body font-bold text-[14px] text-neutral-400 max-w-xs mx-auto">No persistent fulfillment protocols detected in your Medical Registry.</p>
                                </div>
                                <Button size="xl" fullRadius onClick={() => navigate('/shop')} className="h-16 px-12 bg-neutral-950 text-white font-black text-[12px] uppercase tracking-widest shadow-2xl">Initialize Shop Uplink</Button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── SIDEBAR: MESH INTELLIGENCE ── */}
                <div className="space-y-8">
                    <Card className="p-10 border-none shadow-2xl bg-neutral-950 text-white rounded-[48px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full translate-x-20 -translate-y-20 blur-[80px] group-hover:bg-brand-primary/30 transition-colors"></div>
                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[22px] flex items-center justify-center text-brand-primary shadow-inner">
                                    <Target size={32} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="font-display font-black text-2xl tracking-tighter uppercase leading-none mb-2">Registry Intelligence</h4>
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Persistent Logistics</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Cycle Optimization</span>
                                    <span className="font-num font-black text-brand-primary text-xl tracking-tight">₹1,240 <span className="text-[9px] text-white/30 tracking-normal ml-1">SAVE</span></span>
                                </div>
                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Protocol Velocity</span>
                                    <span className="font-num font-black text-white text-xl tracking-tight">12 <span className="text-[9px] text-white/30 tracking-normal ml-1">UNITS</span></span>
                                </div>
                            </div>

                            <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 shadow-inner relative group/item overflow-hidden">
                                <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6 relative z-10">Upcoming Manifest</p>
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-2.5 h-12 bg-brand-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(0,200,83,0.4)]"></div>
                                    <div>
                                        <p className="font-display font-black text-lg uppercase tracking-tight">Priority Dispatch</p>
                                        <p className="text-[11px] text-white/50 font-medium uppercase tracking-widest">Autonomous Sync Imminent</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* ── TRUST NOTIFICATION ── */}
                    <div className="p-10 bg-brand-primary/5 border border-brand-primary/10 rounded-[48px] space-y-6 group hover:bg-brand-primary/10 transition-colors duration-700 shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-brand-primary text-neutral-950 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/20 group-hover:rotate-6 transition-transform">
                                <CheckCircle2 size={28} strokeWidth={2.5} />
                            </div>
                            <h4 className="font-display font-black text-xl text-neutral-900 tracking-tight uppercase">Audit Guard</h4>
                        </div>
                        <p className="font-body font-bold text-[14px] text-neutral-500 leading-relaxed">
                            Our clinical mesh monitors your refill patterns. Any anomalies in dosage or frequency will be flagged for pharmacist review.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHub;
