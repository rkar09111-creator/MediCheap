import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Truck, ChevronDown, MapPin, 
    Calendar, Box, Navigation, FileText,
    ArrowRight, ShoppingBag, Eye,
    CheckCircle2, Clock, AlertCircle,
    Copy, MessageCircle, Phone, Map, 
    ClipboardCheck, CheckCircle, X,
    Banknote, XCircle, Info
} from 'lucide-react';
import { orderService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Card, Badge, Skeleton, cn } from '../components/ui';

const STATUS_CONFIG = {
    pending: { label: 'Order Placed', color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]', accent: '#F59E0B', icon: ShoppingBag },
    confirmed: { label: 'Confirmed', color: 'text-[#3B82F6]', bg: 'bg-[#EFF6FF]', accent: '#3B82F6', icon: ClipboardCheck },
    packed: { label: 'Packed', color: 'text-[#8B5CF6]', bg: 'bg-[#F5F3FF]', accent: '#8B5CF6', icon: Package },
    prescription_verified: { label: 'Rx Verified', color: 'text-[#16A34A]', bg: 'bg-[#EDFDF4]', accent: '#16A34A', icon: FileText },
    assigned_to_rider: { label: 'Out for Delivery', color: 'text-[#16A34A]', bg: 'bg-[#EDFDF4]', accent: '#16A34A', icon: Truck },
    out_for_delivery: { label: 'Out for Delivery', color: 'text-[#F97316]', bg: 'bg-[#FFF7ED]', accent: '#F97316', icon: Truck },
    delivered: { label: 'Delivered', color: 'text-[#16A34A]', bg: 'bg-[#EDFDF4]', accent: '#16A34A', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'text-[#EF4444]', bg: 'bg-[#FFF1F1]', accent: '#EF4444', icon: XCircle }
};

const MyOrders = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('All');

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
            setOrders(data?.data?.orders || data?.orders || []);
        } catch {
            toast.error('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['All', 'Active', 'Delivering', 'Delivered', 'Cancelled'];

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Active') return !['delivered', 'cancelled'].includes(order.status);
        if (activeTab === 'Delivering') return ['assigned_to_rider', 'out_for_delivery'].includes(order.status);
        if (activeTab === 'Delivered') return order.status === 'delivered';
        if (activeTab === 'Cancelled') return order.status === 'cancelled';
        return true;
    });

    const OrderCard = ({ order, index }) => {
        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
        const isPrescriptionOnly = order.items.length === 0 && order.prescription;
        const isExpanded = expandedOrder === order._id;

        const timelineSteps = [
            { id: 'pending', label: 'Placed', icon: ShoppingBag },
            { id: 'confirmed', label: 'Confirmed', icon: ClipboardCheck },
            { id: 'packed', label: 'Packed', icon: Package },
            { id: 'out_for_delivery', label: 'Delivery', icon: Truck },
            { id: 'delivered', label: 'Received', icon: CheckCircle }
        ];

        const getProgress = () => {
            const statusMap = { pending: 0, confirmed: 25, packed: 50, assigned_to_rider: 75, out_for_delivery: 75, delivered: 100 };
            return statusMap[order.status] || 0;
        };

        const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text);
            toast.success('ID Copied', { position: 'top-center' });
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-white border border-[#E4ECF2] rounded-[22px] overflow-hidden shadow-[0_1px_4px_rgba(5,14,23,0.06),0_0_0_1px_rgba(5,14,23,0.04)] hover:shadow-[0_6px_16px_rgba(5,14,23,0.08)] transition-all"
            >
                {/* STATUS ACCENT BAR */}
                <div 
                    className={cn(
                        "h-1 w-full",
                        order.status === 'out_for_delivery' ? "bg-linear-to-r from-[#00C853] to-[#EF4444] bg-[length:200%_100%] animate-marquee" : ""
                    )} 
                    style={{ backgroundColor: status.accent }} 
                />

                <div className="p-5 md:px-6 md:py-5 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-[#00C853] mb-2">
                            <ShieldCheck size={14} />
                            <span className="font-body font-bold text-[11px] uppercase tracking-wider">Clinical Protocol Secured</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-[15px] text-[#0D1B2A]">
                                #{(order.orderId || order._id).slice(-8).toUpperCase()}
                            </h3>
                            <button onClick={() => copyToClipboard(order.orderId || order._id)} className="text-[#96ADBF] hover:text-[#00C853] transition-colors active:scale-90">
                                <Copy size={13} />
                            </button>
                        </div>
                        <p className="font-body font-normal text-[12px] text-[#6B849D]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        
                        <div className="mt-3 flex items-center gap-2">
                            <Badge variant={order.paymentMethod === 'cod' ? 'warning' : 'success'} className="h-5 px-2.5">
                                {order.paymentMethod === 'cod' ? <Banknote size={11} className="mr-1" /> : <CheckCircle size={11} className="mr-1" />}
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid ✓'}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                        <Badge variant="success" className="bg-[#E5FFF2] text-[#00C853] border-[#85FFC1] px-4 py-1.5 font-display font-bold text-[10px] uppercase tracking-widest">
                            LIVE STATUS: {status.label}
                        </Badge>

                        <div className="flex items-center gap-6 md:gap-8 justify-between w-full md:w-auto">
                            <div className="text-right">
                                <p className="font-body font-normal text-[11px] text-[#6B849D] uppercase tracking-wider mb-0.5">Total Paid</p>
                                <p className="font-num font-extrabold text-[19px] text-[#050E17]">₹{order.totalAmount || 'TBD'}</p>
                            </div>
                            
                            <Button 
                                variant="secondary" size="md" fullRadius
                                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                            >
                                {isExpanded ? 'Hide Details' : 'Show Details'}
                                <ChevronDown size={14} className={cn("ml-1.5 transition-transform duration-300", isExpanded && "rotate-180")} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* TRACKING TIMELINE */}
                {order.status !== 'cancelled' && (
                    <div className="px-5 md:px-6 pb-6">
                        {/* DESKTOP HORIZONTAL */}
                        <div className="hidden md:flex relative pt-4.5 pb-7">
                            <div className="absolute top-[22px] left-2.5 right-2.5 h-[2px] bg-[#E4ECF2] z-0" />
                            <motion.div 
                                className="absolute top-[22px] left-2.5 h-[2px] bg-linear-to-r from-[#3DCB78] to-[#00C853] z-10"
                                initial={{ width: 0 }} animate={{ width: `${getProgress()}%` }} transition={{ duration: 1.4, delay: 0.3 }}
                            />
                            
                            {timelineSteps.map((step, i) => {
                                const stepIdx = { pending: 0, confirmed: 1, packed: 2, out_for_delivery: 3, delivered: 4 }[step.id];
                                const currentIdx = { pending: 0, confirmed: 1, packed: 2, assigned_to_rider: 3, out_for_delivery: 3, delivered: 4 }[order.status];
                                const isDone = currentIdx > stepIdx;
                                const isActive = currentIdx === stepIdx;

                                return (
                                    <div key={step.id} className="flex-1 flex flex-col items-center relative z-20">
                                        <div className={cn(
                                            "w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all duration-400",
                                            isDone ? "bg-[#00C853] shadow-[0_4px_20px_rgba(0,200,83,0.25)]" :
                                            isActive ? "bg-white border-[2.5px] border-[#00C853] shadow-[0_0_0_4px_rgba(0,200,83,0.15)]" :
                                            "bg-white border-2 border-[#E4ECF2]"
                                        )}>
                                            {isDone ? <Check size={15} className="text-white" /> : <step.icon size={15} className={cn(isActive ? "text-[#00C853]" : "text-[#96ADBF]")} />}
                                        </div>
                                        <div className="text-center mt-2.5">
                                            <p className={cn("font-body font-semibold text-[11px]", isActive || isDone ? "text-[#243B53]" : "text-[#96ADBF]")}>{step.label}</p>
                                            {isActive && step.id === 'out_for_delivery' && (
                                                <div className="mt-1 bg-[#FFFBEB] border border-[#FFE085] rounded-full px-2 py-0.5 font-body font-semibold text-[10px] text-[#B45309]">
                                                    ETA 12:15 PM
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* MOBILE VERTICAL */}
                        <div className="md:hidden flex flex-col gap-0 mt-2">
                            {timelineSteps.map((step, i) => {
                                const stepIdx = { pending: 0, confirmed: 1, packed: 2, out_for_delivery: 3, delivered: 4 }[step.id];
                                const currentIdx = { pending: 0, confirmed: 1, packed: 2, assigned_to_rider: 3, out_for_delivery: 3, delivered: 4 }[order.status];
                                const isDone = currentIdx > stepIdx;
                                const isActive = currentIdx === stepIdx;

                                return (
                                    <div key={step.id} className="flex gap-3.5 min-h-[54px]">
                                        <div className="flex flex-col items-center w-[30px] shrink-0">
                                            <div className={cn(
                                                "w-[28px] h-[28px] rounded-full flex items-center justify-center border",
                                                isDone ? "bg-[#00C853] border-[#00C853]" :
                                                isActive ? "bg-white border-[2px] border-[#00C853] shadow-[0_0_0_3px_rgba(0,200,83,0.10)]" :
                                                "bg-white border-[#E4ECF2]"
                                            )}>
                                                {isDone ? <Check size={13} className="text-white" /> : <step.icon size={13} className={cn(isActive ? "text-[#00C853]" : "text-[#96ADBF]")} />}
                                            </div>
                                            {i < 4 && <div className={cn("w-[2px] flex-1 min-h-[20px] my-1", isDone ? "bg-[#00C853]" : "bg-[#E4ECF2]")} />}
                                        </div>
                                        <div className="pb-3.5 pt-0.5">
                                            <p className={cn("font-body font-semibold text-[13px]", isActive || isDone ? "text-[#243B53]" : "text-[#96ADBF]")}>{step.label}</p>
                                            {isActive && (
                                                <p className="font-body font-normal text-[11px] text-[#6B849D] mt-0.5">Current Phase</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* DETAILS EXPANSION */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#FAFCFD] border-t border-[#F4F8FA]"
                        >
                            <div className="p-5 md:p-6 space-y-6">
                                {/* ETA BAR */}
                                {!['delivered', 'cancelled'].includes(order.status) && (
                                    <div className="bg-[#EDFDF4] border border-[#A8F0C6] rounded-[14px] p-3 px-4 flex justify-between items-center">
                                        <div className="flex items-center gap-2 font-body font-medium text-[13px] text-[#344E65]">
                                            <Truck size={16} className="text-[#00C853]" />
                                            Estimated Delivery
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display font-bold text-[14px] text-[#00A344]">Today by 12:15 PM</p>
                                        </div>
                                    </div>
                                )}

                                {/* RIDER CARD */}
                                {order.status === 'out_for_delivery' && (
                                    <div className="bg-white border border-[#E4ECF2] rounded-[14px] p-3.5 flex items-center gap-3.5 shadow-sm">
                                        <div className="w-[44px] h-[44px] rounded-full bg-linear-to-br from-[#E5FFF2] to-[#C2FFE0] flex items-center justify-center font-display font-bold text-[18px] text-[#00C853]">
                                            RP
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-body font-normal text-[11px] text-[#6B849D]">Your delivery partner</p>
                                            <p className="font-display font-semibold text-[15px] text-[#0D1B2A]">Ramesh Patel</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="w-[38px] h-[38px] rounded-full bg-[#EDFDF4] text-[#00C853] flex items-center justify-center hover:scale-105 transition-transform"><Phone size={15} /></button>
                                            <button className="w-[38px] h-[38px] rounded-full bg-[#F4F8FA] text-[#4A6580] flex items-center justify-center hover:scale-105 transition-transform"><Map size={15} /></button>
                                        </div>
                                    </div>
                                )}

                                {/* ITEMS */}
                                <div>
                                    <h4 className="font-display font-semibold text-[13px] text-[#344E65] mb-3 flex items-center gap-2">
                                        Items in this order <span className="text-[#96ADBF]">({order.items.length})</span>
                                    </h4>
                                    <div className="space-y-0">
                                        {isPrescriptionOnly ? (
                                            <div className="flex gap-4 p-4 bg-white border border-[#E4ECF2] rounded-[14px]">
                                                <div className="w-[50px] h-[64px] rounded-md overflow-hidden border border-[#E4ECF2] shrink-0">
                                                    <img src={order.prescription?.imageUrl} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div>
                                                    <p className="font-body font-semibold text-[13px] text-[#243B53]">Prescription Fulfillment</p>
                                                    <p className="font-body font-normal text-[12px] text-[#6B849D] mt-0.5">Digitally verified by pharmacist</p>
                                                </div>
                                            </div>
                                        ) : (
                                            order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3.5 py-3 border-b border-[#F4F8FA] last:border-0">
                                                    <div className="w-[46px] h-[46px] rounded-[10px] bg-[#F4F8FA] border border-[#E4ECF2] p-1.5 flex items-center justify-center shrink-0">
                                                        <img src={item.medicine?.images?.[0]} className="max-w-full max-h-full object-contain" alt="" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-body font-medium text-[13px] text-[#243B53] truncate">{item.medicine?.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                                                            <p className="font-body font-semibold text-[13px] text-[#6B849D]">Qty: {item.quantity}</p>
                                                            <p className="font-body font-normal text-[12px] text-[#96ADBF]">× ₹{item.price} each</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-num font-semibold text-[15px] text-[#0D1B2A]">₹{item.price * item.quantity}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* SUMMARY */}
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="p-4 bg-white border border-[#E4ECF2] rounded-[18px] space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin size={14} className="text-[#96ADBF]" />
                                            <span className="font-body font-semibold text-[11px] text-[#4A6580] uppercase tracking-wide">Delivery Address</span>
                                        </div>
                                        <p className="font-body font-medium text-[13px] text-[#243B53]">{order.deliveryAddress?.fullName}</p>
                                        <p className="font-body font-normal text-[13px] text-[#6B849D] leading-[1.55]">
                                            {order.deliveryAddress?.flatNo}, {order.deliveryAddress?.streetArea}<br/>
                                            {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}
                                        </p>
                                    </div>

                                    <div className="bg-[#FAFCFD] border border-[#E4ECF2] rounded-[18px] overflow-hidden flex flex-col">
                                        <div className="p-4 flex-1 space-y-2">
                                            <div className="flex justify-between items-center text-[12px]">
                                                <span className="text-[#6B849D]">Subtotal</span>
                                                <span className="font-medium text-[#243B53]">₹{order.totalAmount - (order.deliveryCharge || 0)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[12px]">
                                                <span className="text-[#6B849D]">Delivery Fee</span>
                                                <span className="font-medium text-[#00C853]">{order.deliveryCharge > 0 ? `₹${order.deliveryCharge}` : 'FREE'}</span>
                                            </div>
                                            <div className="h-[1px] border-t border-dashed border-[#E4ECF2] my-1" />
                                            <div className="flex justify-between items-center pt-1">
                                                <span className="font-display font-bold text-[15px] text-[#050E17]">Total Amount</span>
                                                <span className="font-num font-extrabold text-[19px] text-[#050E17]">₹{order.totalAmount}</span>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 bg-[#E5FFF2] border-t border-[#C2FFE0] flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-[#00C853]" />
                                            <span className="font-body font-semibold text-[12px] text-[#008035]">Payment Confirmed</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 pt-2">
                                    <Button fullRadius className="flex-1">Live Track</Button>
                                    <Button variant="outline" fullRadius className="flex-1">Help & Support</Button>
                                    <button className="w-11 h-11 border border-[#E4ECF2] rounded-full flex items-center justify-center text-[#4A6580] hover:bg-[#F4F8FA] transition-colors"><FileText size={16} /></button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFB] pt-[120px] pb-20 px-6">
                <div className="max-w-[1000px] mx-auto space-y-4">
                    <Skeleton className="h-20 w-48 rounded-[14px]" />
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-[180px] w-full rounded-[22px]" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFB] pb-[100px]">
            <Toaster position="top-right" />
            
            {/* STICKY HEADER */}
            <div className="sticky top-[var(--navbar-height)] z-40 bg-white border-b border-[#E4ECF2] shadow-[0_1px_0_rgba(244,248,250,1)]">
            <div className="w-full px-6 md:px-12 py-5.5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                        <div>
                            <h1 className="font-display font-extrabold text-[24px] text-[#050E17] tracking-[-0.03em]">My Orders</h1>
                            <p className="font-body font-normal text-[13px] text-[#6B849D] mt-0.5">Placed {orders.length} orders so far</p>
                        </div>
                        <Button variant="secondary" size="sm" fullRadius>
                            <MessageCircle size={14} className="mr-2" /> Get Help
                        </Button>
                    </div>

                    <div className="flex gap-0 mt-6 overflow-x-auto scrollbar-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "relative px-5 py-2.5 font-body font-semibold text-[13px] whitespace-nowrap transition-all",
                                    activeTab === tab ? "text-[#050E17]" : "text-[#96ADBF] hover:text-[#4A6580]"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#050E17] rounded-full" />
                                )}
                                <span className={cn(
                                    "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-colors",
                                    activeTab === tab ? "bg-[#050E17] text-white" : "bg-[#F4F8FA] text-[#96ADBF]"
                                )}>
                                    {tab === 'All' ? orders.length : orders.filter(o => {
                                        if (tab === 'Active') return !['delivered', 'cancelled'].includes(o.status);
                                        if (tab === 'Delivering') return ['assigned_to_rider', 'out_for_delivery'].includes(o.status);
                                        if (tab === 'Delivered') return o.status === 'delivered';
                                        if (tab === 'Cancelled') return o.status === 'cancelled';
                                        return false;
                                    }).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full px-6 md:px-12 py-8">
                {filteredOrders.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {filteredOrders.map((order, i) => (
                            <OrderCard key={order._id} order={order} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <div className="w-[120px] h-[120px] rounded-full bg-[#E4ECF2]/20 flex items-center justify-center mx-auto mb-6">
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                <ShoppingBag size={52} className="text-[#C4D3DE]" />
                            </motion.div>
                        </div>
                        <h2 className="font-display font-bold text-[20px] text-[#243B53] mb-1.5">No orders here</h2>
                        <p className="font-body font-normal text-[14px] text-[#6B849D] mb-8">Your purchases will appear once you place an order</p>
                        <Button size="lg" onClick={() => navigate('/shop')}>Shop Now</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
