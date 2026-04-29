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
    Trash2
} from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

const SubscriptionHub = () => {
    const { user, updateUser, isLoading: authLoading } = useAuthStore();
    
    if (authLoading || !user) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-4 border-neutral-100 border-t-brand-primary rounded-full animate-spin" />
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Synchronizing Refill Engine...</p>
            </div>
        );
    }

    const [subscriptions, setSubscriptions] = useState(user.subscriptions || []);
    const [isAdding, setIsAdding] = useState(false);

    const toggleStatus = async (subId) => {
        try {
            const { data } = await api.patch(`/api/users/subscriptions/${subId}/toggle`);
            updateUser(data.data.user);
            setSubscriptions(data.data.user.subscriptions);
            toast.success('Subscription updated');
        } catch (error) {
            toast.error('Failed to update subscription');
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Clinical Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Refill Center</h1>
                    <p className="text-slate-500 font-medium mt-1">Automated medication replenishment and therapeutic adherence tracking.</p>
                </div>
                <Button className="h-14 px-8 rounded-2xl bg-primary shadow-lg shadow-primary/20">
                    <Plus size={20} className="mr-2" /> New Subscription
                </Button>
            </div>

            {/* Active Subscriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence>
                    {subscriptions.length > 0 ? (
                        subscriptions.map((sub, i) => (
                            <motion.div
                                key={sub._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className={cn(
                                    "relative p-8 border-0 shadow-premium bg-white rounded-[3rem] overflow-hidden transition-all group",
                                    !sub.isActive && "opacity-60 grayscale-[0.5]"
                                )}>
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-primary border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                                                <Zap size={32} fill={sub.isActive ? "currentColor" : "none"} />
                                            </div>
                                            <div>
                                                <Badge variant={sub.isActive ? "success" : "secondary"} className="mb-2 px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                                                    {sub.isActive ? 'ACTIVE REFILL' : 'PAUSED'}
                                                </Badge>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{sub.medicine?.name || 'Medication'}</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                                    <RefreshCcw size={12} /> Every {sub.frequency} Days
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-2">
                                            <button 
                                                onClick={() => toggleStatus(sub._id)}
                                                className={cn(
                                                    "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-soft",
                                                    sub.isActive ? "bg-amber-50 text-amber-500 hover:bg-amber-100" : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                                                )}
                                            >
                                                {sub.isActive ? <Pause size={20} /> : <Play size={20} />}
                                            </button>
                                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-soft transition-all">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Cycle</p>
                                            <p className="font-bold text-slate-700">{new Date(sub.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Next Refill</p>
                                            <p className="font-black text-slate-900">{new Date(sub.nextRefillDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Adherence Mock */}
                                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <ShieldCheck size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">High Adherence Score</span>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <Card className="col-span-full py-24 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center justify-center space-y-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                                <RefreshCcw size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">No active subscriptions</h3>
                                <p className="text-slate-400 font-medium max-w-sm">Automate your chronic medication refills and never miss a dose.</p>
                            </div>
                            <Button className="h-14 px-10 font-black text-[10px] uppercase tracking-widest shadow-premium">Initialize Refill Logic</Button>
                        </Card>
                    )}
                </AnimatePresence>

                {/* Automation Insights */}
                <div className="space-y-8">
                    <Card className="p-10 border-0 shadow-premium bg-slate-900 text-white rounded-[3.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-20 -translate-y-20"></div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black tracking-tight leading-none mb-1">Refill Engine v2.0</h4>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Institutional Automation</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-xs font-bold text-white/60">Estimated Savings/Month</span>
                                    <span className="font-black text-primary">₹1,240</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-xs font-bold text-white/60">Automated Orders Processed</span>
                                    <span className="font-black">12 Total</span>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Upcoming Logistics</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-12 bg-primary rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-black">Dispatch Scheduled</p>
                                        <p className="text-xs text-white/60">Next batch in 4 days via Priority Fleet</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="p-10 bg-indigo-50 border border-indigo-100 rounded-[3.5rem] flex items-start gap-6">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-indigo-900 tracking-tight mb-2">Proactive Adherence</h4>
                            <p className="text-sm text-indigo-800/70 font-medium leading-relaxed">
                                Our clinical AI monitors your refill patterns. If we detect a missed refill, our pharmacist-led support team will reach out for a consultation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHub;
