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
                <div className="w-12 h-12 border-4 border-neutral-100 border-t-brand-500 rounded-full animate-spin" />
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading your subscriptions...</p>
            </div>
        );
    }

    const [subscriptions, setSubscriptions] = useState(user.subscriptions || []);

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
            {/* Simple Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Auto-Refills</h1>
                    <p className="text-neutral-500 font-medium max-w-lg">Set up automatic orders so you never run out of your regular medicines.</p>
                </div>
                <Button onClick={() => toast.error('Please visit the medicine page to subscribe.')} className="h-14 px-8 rounded-2xl bg-neutral-900 text-white shadow-xl shadow-neutral-900/10 font-bold uppercase text-[10px] tracking-widest">
                    <Plus size={20} className="mr-2" /> New Subscription
                </Button>
            </div>

            {/* Subscriptions List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence>
                    {subscriptions.length > 0 ? (
                        subscriptions.map((sub, i) => (
                            <motion.div
                                key={sub._id}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className={cn(
                                    "relative p-8 border-0 shadow-sm bg-white rounded-[2.5rem] overflow-hidden transition-all group",
                                    !sub.isActive && "opacity-60 grayscale-[0.5]"
                                )}>
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-brand-500 border border-neutral-100 group-hover:scale-105 transition-transform">
                                                <Zap size={28} fill={sub.isActive ? "currentColor" : "none"} />
                                            </div>
                                            <div>
                                                <Badge className={cn(
                                                    "mb-2 px-3 py-0.5 font-black text-[8px] uppercase tracking-widest rounded-md border-none",
                                                    sub.isActive ? "bg-brand-500 text-white" : "bg-neutral-100 text-neutral-500"
                                                )}>
                                                    {sub.isActive ? 'ACTIVE REFILL' : 'PAUSED'}
                                                </Badge>
                                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">{sub.medicine?.name || 'Medication'}</h3>
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                                    <RefreshCcw size={12} /> Every {sub.frequency} Days
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-2">
                                            <button 
                                                onClick={() => toggleStatus(sub._id)}
                                                className={cn(
                                                    "w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm",
                                                    sub.isActive ? "bg-amber-50 text-amber-500 hover:bg-amber-100" : "bg-brand-50 text-brand-500 hover:bg-brand-100"
                                                )}
                                            >
                                                {sub.isActive ? <Pause size={18} /> : <Play size={18} />}
                                            </button>
                                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-sm transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Last Delivery</p>
                                            <p className="text-sm font-bold text-neutral-700">{new Date(sub.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100">
                                            <p className="text-[9px] font-black text-brand-600 uppercase tracking-widest mb-1">Next Refill</p>
                                            <p className="text-sm font-black text-neutral-900">{new Date(sub.nextRefillDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-neutral-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-brand-500">
                                            <ShieldCheck size={16} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Trusted Schedule</span>
                                        </div>
                                        <div className="flex -space-x-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-5 h-5 rounded-full bg-white border border-neutral-100 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <Card className="col-span-full py-24 bg-white rounded-[3rem] border-2 border-dashed border-neutral-100 text-center flex flex-col items-center justify-center space-y-6">
                            <div className="w-20 h-20 bg-neutral-50 rounded-3xl flex items-center justify-center text-neutral-200">
                                <RefreshCcw size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight uppercase">No active subscriptions</h3>
                                <p className="text-sm text-neutral-400 font-medium max-w-xs mx-auto">Automate your medicine refills and never miss a dose.</p>
                            </div>
                            <Button onClick={() => navigate('/shop')} className="h-14 px-10 bg-neutral-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl">Browse Medicines</Button>
                        </Card>
                    )}
                </AnimatePresence>

                {/* Automation Summary */}
                <div className="space-y-8">
                    <Card className="p-10 border-0 shadow-2xl bg-neutral-900 text-white rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-x-20 -translate-y-20 blur-3xl"></div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black tracking-tight leading-none mb-1">Subscription Summary</h4>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Reliable & Fast</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-xs font-bold text-white/60">Estimated Monthly Savings</span>
                                    <span className="font-black text-emerald-400">₹1,240</span>
                                </div>
                                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-xs font-bold text-white/60">Total Orders Processed</span>
                                    <span className="font-black">12 Orders</span>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Next Delivery</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-10 bg-emerald-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-black">Dispatch Scheduled</p>
                                        <p className="text-xs text-white/60 font-medium">Coming soon via Priority Delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-[3rem] flex items-start gap-6">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-emerald-900 tracking-tight mb-2">Refill Reminders</h4>
                            <p className="text-sm text-emerald-800/70 font-medium leading-relaxed">
                                Our system tracks your refill patterns. If we notice a missed refill, our support team will reach out to help you stay on track with your medication.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHub;
