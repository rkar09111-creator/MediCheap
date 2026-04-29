import React, { useState, useEffect } from 'react';
import { 
    Truck, 
    Navigation, 
    CheckCircle2, 
    Phone, 
    MapPin, 
    Package, 
    DollarSign,
    Power,
    Map
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import NavigationMap from './NavigationMap';
import { useAuthStore } from '../../store/authStore';

const RiderDashboard = () => {
    const [isOnline, setIsOnline] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);
    const [stats, setStats] = useState({ completed: 12, earnings: 450 });
    const [showMap, setShowMap] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchActiveOrder = async () => {
            try {
                const { data } = await api.get('/api/orders/rider/active');
                if (data.data.orders.length > 0) {
                    setActiveOrder(data.data.orders[0]);
                }
            } catch (error) {
                console.error('Error fetching active order');
            }
        };
        fetchActiveOrder();
    }, []);

    const toggleOnline = async () => {
        try {
            const newStatus = !isOnline;
            await api.patch('/api/rider/toggle-status', { isOnline: newStatus });
            setIsOnline(newStatus);
            toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);
        } catch (error) {
            toast.error('Failed to change status');
        }
    };

    const handleDelivered = async (orderId) => {
        try {
            await api.patch(`/api/orders/${orderId}/delivered`);
            toast.success('Order marked as delivered!');
            setActiveOrder(null);
            setStats(prev => ({ ...prev, completed: prev.completed + 1 }));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 pb-10">
            {/* Online Toggle Card */}
            <div className={`card p-8 transition-all relative overflow-hidden ${isOnline ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black mb-1">Status: {isOnline ? 'Active' : 'Resting'}</h2>
                        <p className={isOnline ? 'text-primary font-bold' : 'text-slate-400 font-bold'}>
                           {isOnline ? 'Broadcasting live location' : 'Ready for duty? Go online!'}
                        </p>
                    </div>
                    <button 
                        onClick={toggleOnline}
                        className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-xl ${
                            isOnline 
                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30' 
                            : 'bg-primary text-white hover:bg-primary-hover shadow-primary/30'
                        }`}
                    >
                        <Power size={32} />
                    </button>
                </div>
                {isOnline && (
                    <div className="absolute top-0 right-0 p-2">
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                    </div>
                )}
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 gap-6">
                <div className="card p-6 border-0 shadow-lg bg-white flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-accent-light text-accent rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
                        <p className="text-2xl font-black text-slate-900">{stats.completed}</p>
                    </div>
                </div>
                <div className="card p-6 border-0 shadow-lg bg-white flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                        <DollarSign size={24} />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</p>
                        <p className="text-2xl font-black text-slate-900">${stats.earnings}</p>
                    </div>
                </div>
            </div>

            {/* Active Delivery Card */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        {showMap ? <Map size={16} className="text-primary" /> : <Truck size={16} className="text-primary" />} 
                        {showMap ? 'Live Navigation' : 'Active Task'}
                    </h3>
                    {activeOrder && (
                        <button 
                            onClick={() => setShowMap(!showMap)}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                            {showMap ? 'Show Task Details' : 'Show Map'}
                        </button>
                    )}
                </div>
                
                {activeOrder ? (
                    showMap ? (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <NavigationMap orderId={activeOrder._id} riderId={user._id} />
                            <button 
                                onClick={() => setShowMap(false)}
                                className="w-full mt-4 btn-outline py-3 bg-white"
                            >
                                Back to Details
                            </button>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-2xl bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-primary p-6 text-white flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Pick up from</p>
                                    <p className="font-bold text-lg leading-tight">MediCheap Store</p>
                                </div>
                                <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">Express</span>
                            </div>
                            
                            <div className="p-8 space-y-8">
                                {/* Address View */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 rounded-full border-4 border-slate-100 bg-primary flex items-center justify-center text-white shrink-0">
                                            <Package size={14} />
                                        </div>
                                        <div className="w-1 h-12 bg-slate-100 rounded-full"></div>
                                        <div className="w-8 h-8 rounded-full border-4 border-slate-100 bg-accent flex items-center justify-center text-white shrink-0">
                                            <MapPin size={14} />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-10 py-1">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Location</p>
                                            <p className="text-sm font-bold text-slate-800">Pharmacy Block B, 4th Cross, City Center</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop-off To</p>
                                            <p className="text-sm font-bold text-slate-800">{activeOrder.user.name}</p>
                                            <p className="text-xs text-slate-500">{activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.city}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Contact */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="btn-outline flex items-center justify-center gap-2 py-3 text-slate-600 bg-slate-50 border-slate-200">
                                        <Phone size={18} /> Call Customer
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(!isOnline) return toast.error('Go online to start navigation');
                                            setShowMap(true);
                                        }}
                                        className="btn-outline flex items-center justify-center gap-2 py-3 text-primary bg-primary-light/30 border-primary/20"
                                    >
                                        <Navigation size={18} /> Start Route
                                    </button>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Collect Payment</span>
                                        <span className="text-2xl font-black text-slate-900">${activeOrder.totalAmount} <span className="text-xs font-bold text-orange-500 ml-1">(COD)</span></span>
                                    </div>
                                    <button 
                                      onClick={() => handleDelivered(activeOrder._id)}
                                      className="w-full btn-accent flex items-center justify-center gap-3 py-4 text-lg font-bold shadow-xl shadow-accent/20"
                                    >
                                        <CheckCircle2 size={24} /> Mark as Delivered
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="card p-12 text-center bg-slate-50 border-dashed border-2 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                            <Truck size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No deliveries assigned to you right now.</p>
                        <p className="text-xs text-slate-400 mt-1">Stay online to receive new notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiderDashboard;
