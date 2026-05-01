import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Clock, Truck, CheckCircle2, XCircle,
    ChevronDown, ShoppingBag, MapPin, 
    Calendar, CreditCard, ArrowRight,
    Search, Filter, Box, Trash2, 
    History, ExternalLink, Receipt,
    Info, Phone, Printer, AlertCircle,
    ShieldCheck, Zap, MoreVertical,
    Navigation, CheckCircle
} from 'lucide-react';
import { orderService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Badge, cn } from '../components/ui';
import { fadeUp, stagger, springPop, fadeScale } from '../utils/animations';

// ─── Status Config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    pending: { label: 'Processing', color: 'text-amber-600', bg: 'bg-amber-50', stripe: 'bg-amber-500' },
    confirmed: { label: 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-50', stripe: 'bg-blue-500' },
    packed: { label: 'Packed', color: 'text-purple-600', bg: 'bg-purple-50', stripe: 'bg-purple-500' },
    out_for_delivery: { label: 'Out for Delivery', color: 'text-brand-600', bg: 'bg-brand-50', stripe: 'bg-brand-500', pulse: true },
    delivered: { label: 'Delivered', color: 'text-brand-600', bg: 'bg-brand-50', stripe: 'bg-brand-600' },
    cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', stripe: 'bg-red-500' }
};

// ─── Component ────────────────────────────────────────────────────────────

const MyOrders = () => {
    const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, authLoading]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await orderService.getMyOrders();
            setOrders(data?.orders || []);
        } catch {
            toast.error('Failed to load your orders.');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return ['pending', 'confirmed', 'packed', 'out_for_delivery'].includes(order.status);
        if (activeTab === 'completed') return order.status === 'delivered';
        if (activeTab === 'cancelled') return order.status === 'cancelled';
        return true;
    });

    if (authLoading || loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-8 bg-neutral-0">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-brand-50 rounded-full" />
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                </div>
                <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em] animate-pulse">Initializing Logistics Ledger</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-32">
            <Toaster position="bottom-right" />
            
            {/* ── STICKY HEADER ── */}
            <div className="bg-white border-b border-neutral-100 pt-32 pb-12 px-6 sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <div className="space-y-3">
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-brand-500" />
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Authenticated Account</span>
                            </motion.div>
                            <h1 className="text-5xl font-black text-neutral-900 tracking-tight font-display text-balance uppercase">Logistics <br/><span className="text-brand-500">Command Center.</span></h1>
                            <p className="text-sm text-neutral-400 font-medium max-w-sm">Detailed telemetry and archival records of your clinical acquisitions.</p>
                        </div>

                        {/* Status Tabs */}
                        <div className="flex bg-neutral-100 p-1 rounded-2xl">
                            {['all', 'active', 'completed', 'cancelled'].map((tab) => (
                                <button 
                                    key={tab} 
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all relative",
                                        activeTab === tab ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                                    )}
                                >
                                    {activeTab === tab && (
                                        <motion.div layoutId="active-tab" className="absolute inset-0 bg-white rounded-xl shadow-sm -z-0" />
                                    )}
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-16">
                <div className="space-y-10">
                    {filteredOrders.length > 0 ? (
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
                            {filteredOrders.map((order) => {
                                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                return (
                                    <motion.div
                                        key={order._id}
                                        variants={fadeUp}
                                        className={cn(
                                            "bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden transition-all duration-500 group relative",
                                            expandedOrder === order._id ? "shadow-premium border-brand-500/20" : "hover:shadow-xl hover:border-brand-500/10"
                                        )}
                                    >
                                        {/* Status Stripe */}
                                        <div className={cn("absolute top-0 left-0 bottom-0 w-1.5 transition-all duration-500", status.stripe)} />

                                        {/* Order Summary */}
                                        <div 
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            className="p-8 lg:p-12 cursor-pointer relative z-10"
                                        >
                                            <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                                                <div className="flex items-center gap-8 flex-1 w-full lg:w-auto">
                                                    <div className={cn(
                                                        "w-20 h-20 rounded-3xl flex items-center justify-center transition-all group-hover:scale-105 shadow-inner",
                                                        status.bg, status.color
                                                    )}>
                                                        <Package size={32} strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-4 mb-2">
                                                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight font-display">
                                                                #{ (order.orderId || order._id).slice(-6).toUpperCase() }
                                                            </h3>
                                                            <div className={cn(
                                                                "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border flex items-center gap-2",
                                                                status.bg, status.color, `border-${status.color.split('-')[1]}-100`
                                                            )}>
                                                                {status.pulse && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                                                {status.label}
                                                            </div>
                                                        </div>
                                                        <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2.5">
                                                            <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            <span className="text-neutral-200">/</span>
                                                            <Box size={12} /> {order.items.length} {order.items.length === 1 ? 'Medical Unit' : 'Medical Units'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-10 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-8 lg:pt-0 border-neutral-50">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1.5">Value</p>
                                                        <h4 className="text-3xl font-black text-neutral-900 tracking-tight font-display">₹{order.totalAmount}</h4>
                                                    </div>
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 transition-all duration-500 shadow-sm",
                                                        expandedOrder === order._id ? "rotate-180 bg-neutral-900 text-white" : "group-hover:bg-brand-50 group-hover:text-brand-600"
                                                    )}>
                                                        <ChevronDown size={20} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Progress Indicator (shown when collapsed) */}
                                            <AnimatePresence>
                                                {expandedOrder !== order._id && order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                        className="mt-8 pt-8 border-t border-neutral-50 flex items-center gap-6"
                                                    >
                                                        <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }} animate={{ width: order.status === 'out_for_delivery' ? '75%' : order.status === 'packed' ? '50%' : '25%' }}
                                                                className="h-full bg-brand-500" 
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest whitespace-nowrap">Node Sync in Progress</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Detailed Expansion */}
                                        <AnimatePresence>
                                            {expandedOrder === order._id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-neutral-50 bg-neutral-50/20 overflow-hidden"
                                                >
                                                    <div className="p-10 lg:p-14 space-y-16">
                                                        
                                                        {/* 1. Itemized Manifest */}
                                                        <div className="space-y-8">
                                                            <div className="flex items-center justify-between">
                                                                <h5 className="text-[11px] font-black text-neutral-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                                                    <Box size={14} className="text-brand-500" /> Unit Manifest
                                                                </h5>
                                                                <Badge className="bg-brand-50 text-brand-600 border-none font-black text-[9px] uppercase tracking-widest">Verified Content</Badge>
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-6">
                                                                {order.items.map((item, idx) => (
                                                                    <div key={idx} className="flex items-center gap-6 p-6 bg-white rounded-[1.5rem] border border-neutral-100 shadow-sm group/item hover:border-brand-500/20 transition-all">
                                                                        <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center p-3 group-hover/item:scale-105 transition-transform">
                                                                            <img src={item.medicine?.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-base font-black text-neutral-900 truncate font-display">{item.medicine?.name}</p>
                                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                                <span className="text-[11px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-md">Qty: {item.quantity}</span>
                                                                                <span className="text-[11px] font-bold text-neutral-400">₹{item.price} per unit</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="grid lg:grid-cols-2 gap-12">
                                                            {/* 2. Destination Terminal */}
                                                            <div className="space-y-8">
                                                                <h5 className="text-[11px] font-black text-neutral-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                                                    <MapPin size={14} className="text-brand-500" /> Destination Terminal
                                                                </h5>
                                                                <div className="p-8 bg-white rounded-[2rem] border border-neutral-100 shadow-premium relative overflow-hidden">
                                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/30 rounded-full -mr-16 -mt-16 blur-2xl" />
                                                                    <div className="flex items-start gap-5 relative z-10">
                                                                        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm"><Navigation size={20} strokeWidth={2} /></div>
                                                                        <div className="min-w-0">
                                                                            <p className="text-lg font-black text-neutral-900 mb-1.5 font-display">{order.deliveryAddress?.buildingName || 'Home Node'}</p>
                                                                            <p className="text-[13px] font-medium text-neutral-500 leading-relaxed">
                                                                                {order.deliveryAddress?.flatNo}, {order.deliveryAddress?.streetArea}<br/>
                                                                                {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}
                                                                            </p>
                                                                            <div className="flex items-center gap-2 mt-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-50 w-fit px-3 py-1.5 rounded-full">
                                                                                <Phone size={10} /> {user?.phone || 'N/A'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* 3. Transaction Summary */}
                                                            <div className="space-y-8">
                                                                <h5 className="text-[11px] font-black text-neutral-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                                                    <CreditCard size={14} className="text-brand-500" /> Transaction Summary
                                                                </h5>
                                                                <div className="p-8 bg-neutral-900 rounded-[2rem] shadow-premium text-white relative overflow-hidden">
                                                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16 blur-2xl" />
                                                                    <div className="space-y-5 relative z-10">
                                                                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Protocol</span>
                                                                            <span className="text-[11px] font-black text-brand-400 uppercase tracking-widest">{order.paymentMethod?.toUpperCase()}</span>
                                                                        </div>
                                                                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Ledger Status</span>
                                                                            <Badge className={cn(
                                                                                "px-3 py-1 text-[9px] font-black uppercase rounded-lg border-none",
                                                                                order.paymentStatus === 'paid' ? "bg-brand-500 text-white" : "bg-amber-500 text-white"
                                                                            )}>
                                                                                {order.paymentStatus}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="flex justify-between items-end pt-2">
                                                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Settled Amount</span>
                                                                            <span className="text-3xl font-black text-white tracking-tight font-display">₹{order.totalAmount}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* 4. Footer Actions */}
                                                        <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-t border-neutral-100 pt-10">
                                                            <div className="flex gap-4">
                                                                <Button variant="ghost" className="h-12 px-8 border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:bg-white shadow-sm">
                                                                    <Printer size={16} /> Archive PDF
                                                                </Button>
                                                                <Button variant="ghost" className="h-12 px-8 border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:bg-white shadow-sm">
                                                                    <Receipt size={16} /> Get Invoice
                                                                </Button>
                                                            </div>
                                                            <div className="flex gap-4 w-full md:w-auto">
                                                                <Button variant="ghost" className="flex-1 md:flex-initial h-12 px-10 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 border-rose-100 rounded-2xl">
                                                                    Dispute Order
                                                                </Button>
                                                                <Button onClick={() => navigate('/shop')} className="flex-1 md:flex-initial h-14 px-12 bg-brand-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-brand-500/20 hover:bg-brand-700 active:scale-95 transition-all">
                                                                    One-Tap Reorder
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div 
                            variants={fadeScale} initial="hidden" animate="visible"
                            className="text-center py-40 bg-white rounded-[3rem] shadow-premium border border-neutral-100 space-y-10"
                        >
                            <div className="w-32 h-32 bg-neutral-50 rounded-[2.5rem] flex items-center justify-center text-neutral-200 mx-auto shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-brand-500/5 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full blur-xl" />
                                <ShoppingBag size={56} strokeWidth={1} className="relative z-10" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-neutral-900 tracking-tight font-display">No Acquisitions Found</h2>
                                <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                                    Your clinical acquisition history is currently empty.
                                </p>
                            </div>
                            <Button 
                                onClick={() => navigate('/shop')} 
                                className="btn-primary h-16 px-12 text-[11px] uppercase tracking-[0.2em] font-black shadow-2xl mx-auto"
                            >
                                Begin Shopping <ArrowRight size={20} />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
