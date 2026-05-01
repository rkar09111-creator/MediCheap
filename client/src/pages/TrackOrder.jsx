import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { API_URL } from '../constants';
import { 
    Package, 
    CheckCircle2, 
    Truck, 
    MapPin, 
    Phone, 
    ArrowLeft, 
    Clock,
    User,
    ChevronRight,
    ShieldCheck,
    MessageSquare,
    Navigation,
    Activity
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../components/ui';
import { orderService } from '../services/api';
import toast from 'react-hot-toast';

// Custom Leaflet Icons (Enhanced with shadow and border)
const riderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
});

const storeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048329.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
});

const TrackOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [riderPos, setRiderPos] = useState(null);

    const storeLocation = [20.2961, 85.8245];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await orderService.getById(id);
                setOrder(data.data.order);
                if (data.data.order.rider && data.data.order.rider.location) {
                    setRiderPos([data.data.order.rider.location.lat, data.data.order.rider.location.lng]);
                }
            } catch (error) {
                console.error('Tracking error:', error);
                toast.error('Unable to retrieve tracking data. Please verify your link.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();

        const socket = io(API_URL);
        socket.emit('join:order', id);
        socket.on('rider:location-update', (data) => {
            setRiderPos([data.lat, data.lng]);
        });

        return () => socket.disconnect();
    }, [id, navigate]);

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
            <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Fetching Order Status...</p>
        </div>
    );
    
    if (!order) return null;

    const steps = [
        { label: 'Initialized', status: 'pending', icon: Package },
        { label: 'Validated', status: 'confirmed', icon: ShieldCheck },
        { label: 'Sterilized', status: 'packed', icon: Package },
        { label: 'In Transit', status: 'out_for_delivery', icon: Truck },
        { label: 'Delivered', status: 'delivered', icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    return (
        <div className="bg-neutral-50 min-h-screen pb-20 font-body">
            <div className="container-custom space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[3px] text-neutral-400">
                            <Link to="/orders" className="hover:text-brand-500 transition-colors flex items-center gap-1">
                                <ArrowLeft size={14} /> Back to Orders
                            </Link>
                            <ChevronRight size={14} />
                            <span className="text-neutral-900">Live Tracker</span>
                        </div>
                        <h1 className="text-5xl font-display font-extrabold text-neutral-900 tracking-tight leading-tight">
                            Order <span className="text-brand-500">#{order._id.slice(-8).toUpperCase()}</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm">
                        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Fleet Status</p>
                            <Badge variant="success" className="px-3 py-1 font-black text-[9px] uppercase tracking-widest bg-brand-50 text-brand-600 border-brand-100">Live Tracking</Badge>
                        </div>
                    </div>
                </div>

                {/* Status Progress Visualization */}
                <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-premium overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-neutral-50" />
                    <div 
                        className="absolute top-0 left-0 h-1 bg-brand-500 transition-all duration-1000 shadow-[0_0_15px_rgba(0,200,83,0.5)]"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
                        {steps.map((step, idx) => {
                            const isActive = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center space-y-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                                        isActive 
                                            ? "bg-brand-500 border-brand-500 text-white shadow-xl shadow-brand-500/20" 
                                            : "bg-white border-neutral-100 text-neutral-300",
                                        isCurrent && "animate-pulse ring-8 ring-brand-50"
                                    )}>
                                        <step.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest leading-none",
                                            isActive ? "text-neutral-900" : "text-neutral-300"
                                        )}>
                                            {step.label}
                                        </p>
                                        <p className={cn(
                                            "text-[9px] font-bold uppercase",
                                            isActive ? "text-brand-500" : "text-neutral-300"
                                        )}>
                                            {isCurrent ? 'Current Phase' : isActive ? 'Verified' : 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Live Map Terminal */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[3.5rem] border-8 border-white shadow-elite h-[600px] relative overflow-hidden group">
                            <MapContainer center={storeLocation} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false}>
                                <TileLayer url="https://{s}.tile.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                                <Marker position={storeLocation} icon={storeIcon}>
                                    <Popup><p className="font-bold">MediCheap Logistics Hub</p></Popup>
                                </Marker>
                                <Marker position={[order.deliveryAddress.coordinates?.lat || 20.3, order.deliveryAddress.coordinates?.lng || 85.8]}>
                                    <Popup><p className="font-bold">Patient Destination</p></Popup>
                                </Marker>
                                {riderPos && (
                                    <>
                                        <Marker position={riderPos} icon={riderIcon}>
                                            <Popup><p className="font-bold">Medical Fleet #392</p></Popup>
                                        </Marker>
                                        <Polyline positions={[storeLocation, riderPos]} color="#0EA5E9" weight={4} opacity={0.6} dashArray="10, 15" />
                                    </>
                                )}
                            </MapContainer>

                            {/* Map Floating UI */}
                            <div className="absolute bottom-8 left-8 right-8 z-[1000] flex justify-between items-end">
                                <div className="bg-neutral-900/90 backdrop-blur-xl text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center animate-bounce">
                                        <Navigation size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] leading-none mb-1">Estimated Arrival</p>
                                        <p className="text-2xl font-display font-extrabold tracking-tight">~12 - 18 Mins</p>
                                    </div>
                                </div>
                                <div className="bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white hidden md:block">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Live Tracking: Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Information Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-10 bg-neutral-900 text-white rounded-[3rem] border-0 shadow-elite relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            <h4 className="text-[11px] font-black uppercase tracking-[3px] text-brand-500 mb-8">Delivery Partner</h4>
                            
                            {order.rider ? (
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center relative group">
                                            <User size={32} className="text-brand-400" />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-neutral-900 flex items-center justify-center">
                                                <ShieldCheck size={10} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-display font-extrabold tracking-tight">{order.rider.name}</h3>
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Medical Delivery Partner</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="h-14 bg-white/10 hover:bg-white/20 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold text-sm">
                                            <Phone size={18} /> Call
                                        </button>
                                        <button className="h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl transition-all flex items-center justify-center gap-3 font-bold text-sm shadow-xl shadow-brand-500/20">
                                            <MessageSquare size={18} /> Chat
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] text-center space-y-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-white/20">
                                        <Clock size={24} />
                                    </div>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest px-6">Assigning Delivery Partner...</p>
                                </div>
                            )}
                        </Card>

                        <Card className="p-10 bg-white rounded-[3rem] border border-neutral-100 shadow-premium">
                            <h4 className="text-[11px] font-black uppercase tracking-[3px] text-neutral-400 mb-8">Delivery Terminal</h4>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 bg-neutral-50 rounded-[1.5rem] flex items-center justify-center shrink-0 text-neutral-300 border border-neutral-100">
                                    <MapPin size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-neutral-900 uppercase tracking-tight">{order.user?.name || 'Authorized Recipient'}</p>
                                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                                        {order.deliveryAddress.street}, {order.deliveryAddress.city}<br />
                                        Sector PIN: {order.deliveryAddress.pincode}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Security Disclaimer */}
                        <div className="p-8 bg-neutral-100/50 rounded-[2.5rem] border border-neutral-200 flex items-start gap-4">
                            <ShieldCheck size={20} className="text-neutral-400 shrink-0 mt-1" />
                            <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
                                This fleet operation is monitored by <strong className="text-neutral-900">MediCheap Clinical Protocol</strong>. Every stage is timestamped and sterilized for your safety.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
