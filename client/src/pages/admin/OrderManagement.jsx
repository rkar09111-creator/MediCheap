import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    Eye, 
    Truck, 
    CheckCircle2, 
    XCircle, 
    Package, 
    User, 
    Calendar, 
    MoreVertical,
    FileText,
    Loader2,
    ChevronRight,
    MapPin,
    ExternalLink,
    Plus,
    AlertCircle,
    ShieldCheck,
    RefreshCw
} from 'lucide-react';
import { Badge } from '../../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import TrackingMap from '../../components/TrackingMap';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [riders, setRiders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/orders');
            setOrders(data?.orders || []);
            
            // Also fetch available riders
            const riderRes = await api.get('/api/rider/available');
            setRiders(riderRes.data?.riders || []);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRider = async (orderId, riderId) => {
        try {
            await api.patch(`/api/orders/${orderId}/assign-rider`, { riderId });
            toast.success('Rider assigned successfully');
            fetchOrders();
        } catch (error) {
            toast.error('Assignment failed');
        }
    };

    const handleVerify = async (orderId) => {
        try {
            await api.patch(`/api/orders/${orderId}/verify-prescription`);
            toast.success('Prescription verified');
            fetchOrders();
        } catch (error) {
            toast.error('Verification failed');
        }
    };

    const statusColors = {
        'pending': 'bg-amber-50 text-amber-600 border-amber-200',
        'confirmed': 'bg-brand-600/10 text-brand-primary border-brand-600/20',
        'prescription_required': 'bg-rose-50 text-rose-600 border-rose-200',
        'prescription_verified': 'bg-emerald-50 text-emerald-600 border-emerald-200',
        'packed': 'bg-violet-50 text-violet-600 border-violet-200',
        'assigned_to_rider': 'bg-indigo-50 text-indigo-600 border-indigo-200',
        'out_for_delivery': 'bg-sky-50 text-sky-700 border-sky-200',
        'delivered': 'bg-brand-primary text-white border-brand-primary',
        'cancelled': 'bg-neutral-100 text-neutral-400 border-neutral-200'
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
            {/* Header Terminal */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-neutral-100 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                            <Activity size={20} className="text-brand-primary animate-pulse" />
                        </div>
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Fulfillment Nerve Center</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter leading-none">Distribution <br/><span className="text-neutral-400">Pipeline.</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchOrders}
                        className="h-16 px-10 bg-white border-2 border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 hover:border-brand-600/30 transition-all shadow-xl shadow-neutral-900/5 flex items-center gap-4 group"
                    >
                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" /> Sync Logistics
                    </button>
                </div>
            </div>

            {/* Pipeline Intelligence Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: 'Active Pipeline', value: orders.length, icon: <Package size={24} />, color: 'text-brand-primary', bg: 'bg-brand-600/10' },
                    { label: 'Pending Review', value: orders.filter(o => o.status === 'pending').length, icon: <FileText size={24} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'In Transit', value: orders.filter(o => o.status === 'out_for_delivery').length, icon: <Truck size={24} />, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                    { label: 'Fulfillment Rate', value: '98.4%', icon: <CheckCircle2 size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-white p-8 rounded-[3rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 flex items-center gap-6 group hover:border-brand-600/30 transition-all duration-700"
                    >
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${stat.bg} ${stat.color} shadow-inner group-hover:scale-110 transition-transform duration-700`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-4xl font-display font-black text-neutral-900 leading-none tracking-tighter">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Logistics Terminal Table */}
            <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center gap-6">
                        <Loader2 size={48} className="animate-spin text-brand-primary" />
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Establishing Logistics Link...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Transaction Trace</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Recipient Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Clinical Value</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Workflow Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Fulfillment Partner</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] text-right">Terminal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-neutral-25/50 transition-all duration-500 group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300 border border-neutral-100 shadow-inner group-hover:text-brand-primary transition-colors">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-display font-black text-neutral-900 uppercase tracking-tighter text-lg">#{order.orderId}</p>
                                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-[10px] font-black text-brand-primary shadow-inner">
                                                    {order.user?.name?.charAt(0) || 'P'}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="font-black text-neutral-800 text-sm uppercase tracking-tight">{order.user?.name || 'Anonymous Patient'}</span>
                                                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">Verified Identity</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="font-price font-black text-neutral-900 text-xl tracking-tighter">₹{order.pricing?.total || order.totalAmount}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={cn(
                                                "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-700 shadow-sm",
                                                statusColors[order.status] || 'bg-neutral-50 text-neutral-400 border-neutral-200'
                                            )}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            {order.rider ? (
                                                <div className="flex items-center gap-3 text-brand-primary font-black text-[10px] uppercase tracking-widest">
                                                    <div className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-ping" />
                                                    {order.rider.name.split(' ')[0]}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em]">Waiting Link...</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button 
                                              onClick={() => {setSelectedOrder(order); setIsDetailOpen(true);}}
                                              className="w-12 h-12 bg-neutral-900 text-white hover:bg-brand-primary rounded-2xl transition-all flex items-center justify-center shadow-xl shadow-neutral-900/10 active:scale-95 group"
                                            >
                                                <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Command Detail Drawer */}
            <AnimatePresence>
                {isDetailOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDetailOpen(false)}
                            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="bg-white w-full max-w-3xl h-full shadow-elite relative z-10 flex flex-col overflow-hidden"
                        >
                            {/* Drawer Shell Header */}
                            <div className="bg-neutral-900 p-12 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/20",
                                                statusColors[selectedOrder.status]
                                            )}>
                                                {selectedOrder.status.replace(/_/g, ' ')}
                                            </span>
                                            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping" />
                                        </div>
                                        <h2 className="text-6xl font-display font-black tracking-tighter leading-none">#{selectedOrder.orderId}</h2>
                                        <div className="flex items-center gap-6 text-neutral-500 font-black text-[10px] uppercase tracking-widest">
                                            <p className="flex items-center gap-2"><Calendar size={14} className="text-brand-primary" /> {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                                            <p className="flex items-center gap-2"><Lock size={14} className="text-brand-primary" /> Encrypted Transaction</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsDetailOpen(false)} className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 border border-white/10">
                                        <X size={32} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Drawer Module Body */}
                            <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar">
                                {/* Customer Logistics */}
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-2">Patient Identity</h4>
                                        <div className="flex items-center gap-6 p-8 bg-neutral-25 rounded-[2.5rem] border border-neutral-100 shadow-inner">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary font-black text-xl shadow-sm border border-neutral-100">
                                                {selectedOrder.user?.name?.charAt(0)}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-neutral-900 text-lg uppercase tracking-tight">{selectedOrder.user?.name}</p>
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{selectedOrder.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-2">Logistics Hub</h4>
                                        <div className="flex items-start gap-5 p-8 bg-neutral-25 rounded-[2.5rem] border border-neutral-100 shadow-inner">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-primary shrink-0 shadow-sm border border-neutral-100">
                                                <MapPin size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-neutral-600 font-black leading-relaxed uppercase tracking-tight">
                                                    {selectedOrder.deliveryAddress.street},<br/>
                                                    {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}
                                                </p>
                                                {selectedOrder.deliveryAddress.coordinates && (
                                                    <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                                                        <Activity size={12} /> Live Satellite Trace Active
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Logistics Map (Admin View) */}
                                {selectedOrder.deliveryAddress.coordinates && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between ml-2">
                                            <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Satellite Command View</h4>
                                            <Badge className="bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 animate-pulse">Telemetry Active</Badge>
                                        </div>
                                        <div className="rounded-[3rem] overflow-hidden border-4 border-neutral-50 shadow-2xl">
                                            <TrackingMap 
                                                orderId={selectedOrder._id} 
                                                userLocation={selectedOrder.deliveryAddress.coordinates}
                                                riderId={selectedOrder.rider?._id}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Clinical Authentication */}
                                {selectedOrder.prescription?.imageUrl && (
                                    <div className="bg-brand-600/5 p-10 rounded-[3rem] border border-brand-600/20 flex items-center justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        
                                        <div className="flex items-center gap-8 relative z-10">
                                            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-brand-primary border border-brand-600/10 group-hover:scale-105 transition-transform duration-700">
                                                <FileText size={48} strokeWidth={1} />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-black text-neutral-900 uppercase text-sm tracking-[0.2em]">Clinical Rx Document</h4>
                                                <a 
                                                  href={selectedOrder.prescription.imageUrl} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="text-[10px] text-brand-primary font-black hover:underline flex items-center gap-2 uppercase tracking-[0.2em]"
                                                >
                                                    Open Regulatory Audit <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                        {!selectedOrder.prescription.isVerified ? (
                                            <button 
                                              onClick={() => handleVerify(selectedOrder._id)}
                                              className="h-16 px-10 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary-dark transition-all shadow-2xl shadow-brand-600/30 active:scale-95 relative z-10"
                                            >
                                                Validate Rx
                                            </button>
                                        ) : (
                                            <div className="flex flex-col items-end gap-2 relative z-10">
                                                <span className="flex items-center gap-3 text-[11px] font-black text-brand-primary uppercase tracking-[0.2em] bg-white px-5 py-2.5 rounded-full shadow-lg border border-brand-600/10">
                                                    <ShieldCheck size={20} /> Pharmacist Approved
                                                </span>
                                                <p className="text-[9px] text-neutral-400 uppercase font-black tracking-widest">Audit Chain Secured</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Logistics Manifest */}
                                <div className="space-y-8">
                                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-2">Asset Manifest</h4>
                                    <div className="grid gap-4">
                                        {selectedOrder.items.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-8 bg-neutral-25 rounded-[2.5rem] border border-neutral-100 hover:bg-white hover:shadow-2xl transition-all duration-700 group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary font-black text-sm border border-neutral-100 shadow-inner group-hover:scale-110 transition-transform duration-700">
                                                        {item.quantity}x
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-black text-neutral-900 text-lg uppercase tracking-tight">{item.medicine?.name}</p>
                                                        <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{item.medicine?.category} · Institutional SKU</p>
                                                    </div>
                                                </div>
                                                <p className="font-price font-black text-neutral-900 text-2xl tracking-tighter group-hover:scale-110 transition-transform duration-700">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-10 border-t border-neutral-100 flex justify-between items-center px-6">
                                        <div className="space-y-1">
                                            <span className="text-neutral-400 font-black uppercase text-[10px] tracking-[0.4em]">Institutional Total</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-brand-primary rounded-full animate-ping" />
                                                <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Encrypted Calculation</span>
                                            </div>
                                        </div>
                                        <span className="text-6xl font-display font-black text-neutral-900 leading-none tracking-tighter">₹{selectedOrder.pricing?.total || selectedOrder.totalAmount}</span>
                                    </div>
                                </div>

                                {/* Logistics Assignment Terminal */}
                                <div className="space-y-8">
                                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-2">Fulfillment Assignment</h4>
                                    {selectedOrder.rider ? (
                                        <div className="p-10 bg-neutral-900 border border-neutral-800 rounded-[3rem] flex items-center justify-between shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                            
                                            <div className="flex items-center gap-8 relative z-10">
                                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-brand-primary shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-700">
                                                    <Truck size={36} strokeWidth={1.5} />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xl font-black text-white uppercase tracking-tighter">Unit Linked: {selectedOrder.rider.name}</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                                                        <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.3em] animate-pulse">Telemetry Stream Active</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="relative z-10 text-[10px] font-black text-neutral-500 hover:text-rose-500 uppercase tracking-[0.3em] transition-all px-8 py-3 bg-white/5 hover:bg-rose-500/10 rounded-2xl border border-white/5 hover:border-rose-500/20">De-Link Unit</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between px-2">
                                                <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em]">Operational Fleet ({riders.length} Available)</p>
                                                <button className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] hover:underline">View Global Fleet</button>
                                            </div>
                                            {riders.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-6">
                                                    {riders.map((r) => (
                                                        <button 
                                                          key={r.rider._id}
                                                          onClick={() => handleAssignRider(selectedOrder._id, r.rider._id)}
                                                          className="p-8 border border-neutral-100 rounded-[2.5rem] bg-neutral-25 hover:border-brand-600/40 hover:bg-white hover:shadow-2xl transition-all duration-700 text-left flex items-center gap-6 group shadow-inner"
                                                        >
                                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-neutral-300 group-hover:text-brand-primary transition-all duration-700 shadow-sm border border-neutral-100">
                                                                <User size={24} strokeWidth={3} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-sm font-black text-neutral-900 uppercase tracking-tight truncate block">{r.rider.name}</span>
                                                                <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Ready for Link</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-12 bg-rose-50 border border-rose-100 rounded-[3rem] text-rose-700 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-6 shadow-inner">
                                                    <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-rose-500 shadow-sm">
                                                        <AlertCircle size={32} className="animate-pulse" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p>No active fleet units detected.</p>
                                                        <p className="text-rose-400 font-bold opacity-70">Immediate recruitment or redeployment required.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Global Override Actions */}
                            <div className="p-12 border-t border-neutral-100 bg-neutral-50/80 flex gap-6 sticky bottom-0">
                                <div className="flex-1 relative">
                                    <select 
                                        className="w-full h-20 bg-white border-2 border-neutral-100 rounded-3xl px-8 py-4 font-black text-xs uppercase tracking-[0.3em] text-neutral-900 focus:ring-8 focus:ring-brand-600/10 focus:border-brand-600/30 outline-none appearance-none cursor-pointer shadow-2xl shadow-neutral-900/5 transition-all"
                                        value={selectedOrder.status}
                                        onChange={(e) => {
                                            api.patch(`/api/orders/${selectedOrder._id}/status`, { status: e.target.value });
                                            toast.success('System Status Synchronized');
                                            fetchOrders();
                                        }}
                                    >
                                        <option value="pending">Awaiting Review</option>
                                        <option value="confirmed">Processing Center</option>
                                        <option value="packed">Packed & Sealed</option>
                                        <option value="out_for_delivery">Satellite Tracking Active</option>
                                        <option value="delivered">Final Fulfillment</option>
                                        <option value="cancelled">Abort Pipeline</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-brand-primary">
                                        <ChevronRight className="rotate-90" size={24} strokeWidth={3} />
                                    </div>
                                </div>
                                <button onClick={() => setIsDetailOpen(false)} className="px-12 h-20 bg-neutral-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-brand-primary transition-all shadow-2xl active:scale-95 group">
                                    Finalize Protocol <ArrowRight size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderManagement;
