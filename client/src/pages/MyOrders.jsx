import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Clock, Truck, CircleCheck, CircleX,
    ChevronDown, Search, ShoppingBag, MapPin, 
    Calendar, CreditCard, Loader2, RotateCcw, 
    ShieldCheck, Printer, Zap, Star, ArrowRight,
    Pill, LayoutGrid, Info, MessageCircle, Copy,
    Banknote, ShoppingCart, ClipboardCheck, Phone, X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { orderService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Badge, cn } from '../components/ui';
import { fadeUp, fadeScale, springPop, stagger, slideUp } from '../utils/animations';

// --- Leaflet Fix for React ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const storeIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619153.png', iconSize: [32, 32] });
const riderIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', iconSize: [32, 32] });
const homeIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', iconSize: [32, 32] });

// --- Tracking Map Fit Bounds Helper ---
const FitBounds = ({ points }) => {
    const map = useMap();
    useEffect(() => {
        if (points && points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [points, map]);
    return null;
};

// --- Live Tracking Bottom Sheet ---
const TrackingSheet = ({ order, isOpen, onClose }) => {
    const [riderPos, setRiderPos] = useState([20.2961, 85.8245]); // Simulated/Socket initial
    
    // Simulate rider movement
    useEffect(() => {
        if (isOpen) {
            const interval = setInterval(() => {
                setRiderPos(prev => [prev[0] + 0.0001, prev[1] + 0.0001]);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const storePos = [20.2961, 85.8189];
    const destPos = order.deliveryAddress?.coordinates ? [order.deliveryAddress.coordinates.lat, order.deliveryAddress.coordinates.lng] : [20.3012, 85.8301];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        variants={slideUp}
                        initial="hidden" animate="visible" exit="exit"
                        className="fixed bottom-0 left-0 right-0 h-[86vh] bg-white rounded-t-[24px] overflow-hidden z-[201]"
                    >
                        <div className="w-10 h-[5px] bg-gray-200 rounded-full mx-auto mt-3 cursor-grab" />
                        
                        <div className="p-4 px-5 flex justify-between items-center border-b border-gray-100">
                            <h3 className="font-head font-bold text-[16px] text-gray-900">Live Tracking · #{order.orderId || 'MED-1024'}</h3>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 active:scale-90 transition-transform">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="h-[55%] relative">
                            <MapContainer center={riderPos} zoom={15} className="w-full h-full">
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={storePos} icon={storeIcon} />
                                <Marker position={riderPos} icon={riderIcon} />
                                <Marker position={destPos} icon={homeIcon} />
                                <Polyline positions={[storePos, riderPos, destPos]} color="#16A34A" weight={3} dashArray="8, 6" />
                                <FitBounds points={[storePos, riderPos, destPos]} />
                            </MapContainer>
                        </div>

                        <div className="p-5 px-5 pb-8 overflow-y-auto">
                            <div className="bg-green-50 rounded-md p-3.5 px-4.5 flex justify-between items-center">
                                <div className="flex gap-2.5 items-center">
                                    <Truck size={18} className="text-green-600" />
                                    <span className="font-body font-medium text-[14px] text-gray-700">Estimated Arrival</span>
                                </div>
                                <span className="text-green-600 font-bold text-[16px]">12:15 PM</span>
                            </div>

                            <div className="mt-3.5 bg-white border border-gray-200 rounded-md p-3.5 px-4 flex items-center gap-3.5 shadow-sm">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-600 font-head font-bold text-[18px]">
                                    R
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-400 font-body text-[11px] uppercase tracking-wider">Your Rider</p>
                                    <p className="font-body font-semibold text-[15px] text-gray-900">Rahul Sharma</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 hover:scale-105 active:scale-90 transition-all"><Phone size={16} /></button>
                                </div>
                            </div>

                            <Button onClick={onClose} variant="ghost" className="w-full h-11.5 mt-4 border-gray-200 text-gray-600">Close Tracking</Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- Order Item Detail ---
const OrderItem = ({ item }) => (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
        <div className="w-12 h-12 rounded-[10px] bg-gray-50 border border-gray-200 p-2 flex items-center justify-center shrink-0">
            <img src={item.medicine?.imageUrl || '/med-placeholder.png'} alt={item.medicine?.name} className="max-w-full max-h-full object-contain" />
        </div>
        <div className="flex-1">
            <p className="font-body font-medium text-[14px] text-gray-900 line-clamp-1">{item.medicine?.name}</p>
            <p className="font-body text-[12px] text-gray-500">{item.quantity} × ₹{item.price} each</p>
        </div>
        <p className="font-num font-semibold text-[15px] text-gray-900">₹{item.price * item.quantity}</p>
    </div>
);

// --- Timeline Step ---
const TimelineStep = ({ step, index, status, isMobile }) => {
    const statuses = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    const isCompleted = index < currentIndex;
    const isActive = index === currentIndex;
    const isFuture = index > currentIndex;

    const Icons = [ShoppingCart, ClipboardCheck, Package, Truck, CircleCheck];
    const Icon = Icons[index];

    if (isMobile) {
        return (
            <div className="flex gap-3.5 min-h-[64px]">
                <div className="w-8 flex flex-col items-center">
                    <div className={cn(
                        "w-[30px] h-[30px] rounded-full flex items-center justify-center relative shrink-0",
                        isCompleted ? "bg-gradient-to-br from-green-500 to-green-600 shadow-md" : 
                        isActive ? "bg-white border-[2.5px] border-green-600 shadow-[0_0_0_5px_rgba(22,163,74,0.15)] animate-pulse" : 
                        "bg-white border-2 border-gray-200"
                    )}>
                        <Icon size={14} className={isCompleted ? "text-white" : isActive ? "text-green-600" : "text-gray-300"} />
                    </div>
                    {index < 4 && (
                        <div className={cn(
                            "w-0.5 flex-1 min-h-[32px] my-1",
                            isCompleted ? "bg-green-500" : "bg-gray-200"
                        )} />
                    )}
                </div>
                <div className="pt-0.5 pb-4">
                    <p className={cn("font-body font-semibold text-[14px]", isFuture ? "text-gray-400" : "text-gray-900")}>{step}</p>
                    <p className="font-body text-[12px] text-gray-500">{isCompleted ? '10:15 AM' : isActive ? 'Processing...' : ''}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center z-[2]">
            <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center relative transition-all duration-500",
                isCompleted ? "bg-gradient-to-br from-green-500 to-green-600 shadow-[0_4px_12px_rgba(22,163,74,0.35)]" : 
                isActive ? "bg-white border-[2.5px] border-green-600 shadow-[0_0_0_5px_rgba(22,163,74,0.15)]" : 
                "bg-white border-2 border-gray-200"
            )}>
                <Icon size={16} className={isCompleted ? "text-white" : isActive ? "text-green-600" : "text-gray-300"} />
                {isActive && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-25 bg-green-500" style={{ animationDuration: '2s' }} />
                )}
            </div>
            <div className="mt-2.5 text-center px-1">
                <p className={cn("font-body font-semibold text-[11px] uppercase tracking-tight", isFuture ? "text-gray-400" : "text-gray-900")}>{step}</p>
                {isCompleted && <p className="font-body text-[10px] text-gray-500 mt-0.5">10:15 AM</p>}
                {isActive && index < 4 && <p className="font-body font-medium text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-[4px] mt-0.5">ETA 12:15 PM</p>}
            </div>
        </div>
    );
};

// --- Order Card Component ---
const OrderCard = ({ order, index, onRefresh }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [trackingOpen, setTrackingOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState('1h 24m');
    const navigate = useNavigate();
    const addItem = useCartStore(state => state.addItem);

    const STATUS_COLORS = {
        pending: '#F59E0B',
        confirmed: '#3B82F6',
        packed: '#8B5CF6',
        out_for_delivery: 'linear-gradient(90deg, #F97316, #EF4444)',
        delivered: '#16A34A',
        cancelled: '#EF4444'
    };

    const steps = ['Order Placed', 'Pharmacist Confirmed', 'Packed & Ready', 'Out for Delivery', 'Delivered'];
    const currentStatusIndex = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered'].indexOf(order.status);

    const handleCopy = () => {
        navigator.clipboard.writeText(order.orderId || order._id);
        toast.success('Order ID copied!');
    };

    const handleReorder = () => {
        order.items.forEach(item => addItem({ ...item.medicine, quantity: item.quantity, price: item.price }));
        toast.success('Items added to cart!');
        navigate('/cart');
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-green-100 transition-all duration-300"
        >
            {/* Status Stripe */}
            <div className={cn("h-[5px]", order.status === 'out_for_delivery' && "bg-[length:200%_100%] animate-[gradientSlide_2s_linear_infinite]")} 
                style={{ background: STATUS_COLORS[order.status] || '#F59E0B' }} />

            {/* Header */}
            <div className="p-5.5 px-5.5 pb-3.5 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-head font-bold text-[16px] text-gray-900">#MED-{(order.orderId || order._id).slice(-4).toUpperCase()}</span>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={handleCopy} className="text-gray-400 hover:text-gray-600"><Copy size={14} /></motion.button>
                    </div>
                    <p className="font-body text-[13px] text-gray-500 mt-1">Tuesday, 22 April 2025 · 10:15 AM</p>
                    <div className={cn(
                        "mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                        order.paymentMethod === 'cod' ? "bg-neutral-100 text-neutral-600" : 
                        order.paymentStatus === 'verified' ? "bg-green-100 text-green-600" :
                        order.paymentStatus === 'screenshot_uploaded' ? "bg-blue-100 text-blue-600" :
                        "bg-amber-100 text-amber-600"
                    )}>
                        {order.paymentMethod === 'cod' ? <Banknote size={11} /> : <CreditCard size={11} />}
                        {order.paymentMethod === 'cod' ? "Cash on Delivery" : 
                         order.paymentStatus === 'verified' ? "Payment Verified" :
                         order.paymentStatus === 'screenshot_uploaded' ? "Verification Pending" :
                         order.paymentStatus === 'rejected' ? "Payment Rejected" :
                         "Settlement Required"}
                    </div>
                </div>
                <div className={cn(
                    "px-3.5 py-2 rounded-md font-body font-bold text-[12px] uppercase tracking-wider flex items-center gap-1.5",
                    order.status === 'delivered' ? "bg-green-100 text-green-700" : 
                    order.status === 'cancelled' ? "bg-red-100 text-red-600" : 
                    order.paymentStatus === 'rejected' ? "bg-red-100 text-red-600" :
                    "bg-amber-100 text-amber-600"
                )}>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && order.paymentStatus !== 'rejected' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    )}
                    {order.status === 'delivered' && <CircleCheck size={14} />}
                    {order.status === 'cancelled' && <CircleX size={14} />}
                    {order.paymentStatus === 'rejected' && <Info size={14} />}
                    {order.paymentStatus === 'rejected' ? "PAYMENT REJECTED" : order.status.replace(/_/g, ' ')}
                </div>
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' && (
                <div className="p-5.5 px-5.5 pt-0">
                    {/* Desktop Horizontal */}
                    <div className="hidden sm:flex relative items-start py-5 pb-7">
                        <div className="absolute top-[26px] left-[18px] right-[18px] h-0.5 bg-gray-200 rounded-full z-0" />
                        <motion.div 
                            initial={{ width: '0%' }}
                            animate={{ width: `${(currentStatusIndex / 4) * 100}%` }}
                            transition={{ duration: 1.4, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute top-[26px] left-[18px] h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full z-[1]"
                        />
                        {steps.map((step, i) => <TimelineStep key={i} step={step} index={i} status={order.status} isMobile={false} />)}
                    </div>
                    {/* Mobile Vertical */}
                    <div className="flex sm:hidden flex-col py-4 pb-5">
                        {steps.slice(0, currentStatusIndex + 1).map((step, i) => <TimelineStep key={i} step={step} index={i} status={order.status} isMobile={true} />)}
                    </div>
                </div>
            )}

            {/* ETA Bar */}
            {['pending', 'confirmed', 'packed', 'out_for_delivery'].includes(order.status) && (
                <div className="mx-5.5 mb-4.5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-md p-3.5 px-4.5 flex justify-between items-center">
                    <div className="flex gap-2.5 items-center">
                        <Truck size={18} className="text-green-600" />
                        <span className="font-body font-medium text-[14px] text-gray-700">Estimated Delivery</span>
                    </div>
                    <div className="text-right">
                        <span className="font-head font-bold text-[15px] text-green-600">Today by 12:15 PM</span>
                        {order.status === 'out_for_delivery' && (
                            <p className="text-[10px] text-amber-600 font-bold flex items-center justify-end gap-1 animate-pulse">
                                <Clock size={10} /> Arriving in {timeLeft}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Rider Card */}
            {order.status === 'out_for_delivery' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mx-5.5 mb-4 bg-white border border-gray-200 rounded-md p-3.5 px-4 flex items-center gap-3.5 shadow-sm">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-600 font-head font-bold text-[18px]">R</div>
                    <div className="flex-1">
                        <p className="text-gray-400 font-body text-[11px] uppercase tracking-wider">Your Rider</p>
                        <p className="font-body font-semibold text-[15px] text-gray-900">Rahul Sharma</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 hover:scale-105 active:scale-90 transition-all"><Phone size={16} /></button>
                        <button onClick={() => setTrackingOpen(true)} className="w-9 h-9 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 hover:scale-105 active:scale-90 transition-all"><MapPin size={16} /></button>
                    </div>
                </motion.div>
            )}

            {/* Expandable Section */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-5.5 pt-0">
                            <div className="flex justify-between items-center mb-3">
                                <h5 className="font-head font-semibold text-[15px] text-gray-900">Order Items</h5>
                                <span className="text-gray-500 font-body text-[13px]">({order.items.length} items)</span>
                            </div>
                            <div className="space-y-1">
                                {order.items.map((item, i) => <OrderItem key={i} item={item} />)}
                            </div>
                        </div>
                        <div className="bg-gray-50 border-t-[1.5px] border-gray-200 p-4 px-5.5">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-gray-500 font-body">Subtotal</span>
                                    <span className="text-gray-700 font-medium">₹{order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-gray-500 font-body">Delivery</span>
                                    <span className="text-green-600 font-semibold tracking-wide">FREE</span>
                                </div>
                                <div className="h-[1.5px] border-t border-dashed border-gray-300 my-2" />
                                <div className="flex justify-between items-baseline">
                                    <span className="font-head font-bold text-[17px] text-gray-900">Total Paid</span>
                                    <span className="font-num font-extrabold text-[20px] text-gray-900">₹{order.pricing?.total || order.totalAmount}</span>
                                </div>
                                <div className={cn(
                                    "mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border",
                                    order.paymentStatus === 'paid' ? "bg-green-100 text-green-600 border-green-200" : "bg-amber-100 text-amber-600 border-amber-200"
                                )}>
                                    {order.paymentStatus === 'paid' ? <CircleCheck size={14} /> : <Banknote size={14} />}
                                    {order.paymentStatus === 'paid' ? "Payment Confirmed" : "Pay on Delivery"}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Bar */}
            <div className="p-5.5 py-3.5 flex gap-2.5">
                {order.paymentMethod === 'upi' && (order.paymentStatus === 'pending' || order.paymentStatus === 'rejected') ? (
                    <>
                        <Button 
                            onClick={() => navigate(`/payment/upi/${order._id}`)} 
                            className="flex-1 h-11 bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold text-[14px] rounded-md shadow-md gap-2"
                        >
                            <Zap size={16} /> Execute Payment
                        </Button>
                        <Button variant="ghost" className="h-11 px-6 border-gray-200 text-gray-700 rounded-md">Support</Button>
                    </>
                ) : ['pending', 'confirmed', 'packed', 'out_for_delivery'].includes(order.status) ? (
                    <>
                        <Button onClick={() => setTrackingOpen(true)} className="flex-1 h-11 bg-gradient-to-br from-green-600 to-green-700 text-white font-semibold text-[14px] rounded-md shadow-md">Live Track</Button>
                        <Button variant="ghost" className="h-11 px-6 border-gray-200 text-gray-700 rounded-md">Support</Button>
                    </>
                ) : order.status === 'delivered' ? (
                    <>
                        <Button className="flex-1 h-11 bg-gradient-to-br from-green-600 to-green-700 text-white font-semibold text-[14px] rounded-md shadow-md">Rate & Review</Button>
                        <Button onClick={handleReorder} variant="ghost" className="h-11 px-6 border-gray-200 text-gray-700 rounded-md">Buy Again</Button>
                        <button className="w-11 h-11 rounded-md border-[1.5px] border-gray-200 flex items-center justify-center text-gray-700 hover:border-green-200"><Printer size={18} /></button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleReorder} className="flex-1 h-11 bg-gradient-to-br from-green-600 to-green-700 text-white font-semibold text-[14px] rounded-md shadow-md">Reorder</Button>
                        <Button variant="ghost" className="h-11 px-6 border-gray-200 text-gray-700 rounded-md">Support</Button>
                    </>
                )}
            </div>

            {/* Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-2.5 flex items-center justify-center gap-1.5 text-gray-400 font-body text-[13px] hover:text-gray-600"
            >
                {isOpen ? 'Show Less' : 'Show More'}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={16} /></motion.div>
            </button>

            <TrackingSheet order={order} isOpen={trackingOpen} onClose={() => setTrackingOpen(false)} />
        </motion.div>
    );
};

// --- Main My Orders Page ---
const MyOrders = () => {
    const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Orders');

    if (authLoading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
            <div className="w-12 h-12 border-4 border-neutral-100 border-t-brand-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Loading Order Matrix...</p>
        </div>
    );

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await orderService.getMyOrders();
            setOrders(data?.orders || []);
        } catch { toast.error('Failed to load orders.'); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        else fetchOrders();
    }, [isAuthenticated]);

    const tabs = ['All Orders', 'Active', 'Out for Delivery', 'Delivered', 'Cancelled'];
    
    const filtered = orders.filter(o => {
        if (activeTab === 'All Orders') return true;
        if (activeTab === 'Active') return ['pending', 'confirmed', 'packed'].includes(o.status);
        if (activeTab === 'Out for Delivery') return o.status === 'out_for_delivery';
        if (activeTab === 'Delivered') return o.status === 'delivered';
        if (activeTab === 'Cancelled') return o.status === 'cancelled';
        return true;
    });

    if (loading) return (
        <div className="min-h-screen bg-gray-50 pt-32 px-6">
            <div className="max-w-[900px] mx-auto space-y-5">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-white rounded-xl animate-pulse flex flex-col p-6 space-y-4">
                        <div className="h-6 w-1/3 bg-gray-200 rounded" />
                        <div className="h-4 w-1/4 bg-gray-100 rounded" />
                        <div className="h-2 w-full bg-gray-200 rounded mt-auto" />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32">
            <Toaster position="top-right" />
            
            {/* Sticky Header */}
            <header className="bg-white border-b border-gray-200 pt-24 pb-0 sticky top-0 z-40">
                <div className="max-w-[1000px] px-6 mx-auto">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="font-head font-extrabold text-[28px] text-gray-900 tracking-tight">My Orders</h1>
                            <p className="font-body text-[14px] text-gray-500 mt-0.5">Track deliveries and view history</p>
                        </div>
                        <Button variant="ghost" className="rounded-full h-10 px-5 border-gray-200 text-gray-600 gap-1.5"><MessageCircle size={14} /> Need Help?</Button>
                    </div>

                    <div className="flex mt-5 overflow-x-auto scrollbar-hidden">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4.5 py-3 font-body text-[14px] transition-all relative shrink-0",
                                    activeTab === tab ? "text-green-600 font-semibold" : "text-gray-500 hover:text-gray-800"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto mt-8 px-6 space-y-5">
                <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                        filtered.map((order, i) => <OrderCard key={order._id} order={order} index={i} onRefresh={fetchOrders} />)
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="inline-block"><Package size={80} className="text-green-100" /></motion.div>
                            <h2 className="font-head font-bold text-[22px] text-gray-900 mt-5">No orders yet</h2>
                            <p className="font-body text-[15px] text-gray-500 mt-2">Your orders will appear here after your first purchase.</p>
                            <Button onClick={() => navigate('/shop')} className="mt-6 h-12 bg-green-600 text-white rounded-md px-10">Shop Now</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hidden::-webkit-scrollbar { display: none; }
                @keyframes gradientSlide {
                    0%   { background-position: 0% 0% }
                    100% { background-position: 200% 0% }
                }
            `}} />
        </div>
    );
};

export default MyOrders;
