import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    ArrowRight, 
    ArrowLeft, 
    Truck, 
    ClipboardList,
    ShieldCheck,
    FileCheck,
    Package,
    ChevronRight,
    Circle,
    Locate,
    Loader2,
    Lock,
    Wallet,
    Shield,
    Activity,
    Zap,
    Timer,
    Building2,
    Home,
    Briefcase,
    QrCode,
    Smartphone,
    Check
} from 'lucide-react';
import { Button, Badge, cn } from '../components/ui';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/api';
import toast from 'react-hot-toast';
import AddressSelector from '../components/checkout/AddressSelector';

// ─── Simplified Steps ──────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Address', icon: MapPin, desc: 'Where to deliver' },
    { id: 2, label: 'Review', icon: ClipboardList, desc: 'Check your items' },
    { id: 3, label: 'Payment', icon: CreditCard, desc: 'How to pay' },
];

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { items, clearCart, hasRxItems, calculateSubtotal, calculateTotal, coupon, discount, deliveryFee, prescriptionId, prescriptionFile } = useCartStore();
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [timeLeft, setTimeLeft] = useState(600); 

    useEffect(() => {
        if (items.length === 0) {
            navigate('/shop');
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [items, navigate]);

    const subtotal = calculateSubtotal();
    const finalTotal = calculateTotal();

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address.');
            return;
        }

        if (hasRxItems() && !prescriptionId) {
            toast.error('Prescription required for these medicines.');
            setStep(2);
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: items.map(i => ({ 
                    medicine: i.medicine, 
                    quantity: i.quantity,
                    price: i.sellingPrice
                })),
                deliveryAddress: {
                    addressId: selectedAddress._id,
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    flatNo: selectedAddress.flatNo,
                    buildingName: selectedAddress.buildingName,
                    streetArea: selectedAddress.streetArea,
                    landmark: selectedAddress.landmark,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    pincode: selectedAddress.pincode,
                    coordinates: selectedAddress.coordinates
                },
                paymentMethod: paymentMethod,
                pricing: {
                    subtotal,
                    deliveryFee,
                    discount,
                    total: finalTotal
                },
                couponCode: coupon?.code,
                notes: '' 
            };
            
            const response = await orderService.placeOrder(orderData);
            const orderId = response.data.order?._id || response.data._id;

            toast.success('Order placed successfully!');
            clearCart();

            if (paymentMethod === 'upi') {
                navigate(`/payment/upi/${orderId}`);
            } else {
                navigate('/orders');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="bg-neutral-50 min-h-screen pt-28 pb-32 font-body">
            <div className="container-custom">
                {/* ── Simple Header ── */}
                <div className="flex flex-col items-center mb-16 space-y-6">
                    <div className="flex items-center gap-2.5 px-4 py-1.5 bg-brand-500/10 rounded-full border border-brand-500/20">
                        <ShieldCheck size={14} className="text-brand-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-600">Secure Checkout</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight text-center leading-none">
                        Checkout.
                    </h1>

                    {/* Timeline */}
                    <div className="w-full max-w-2xl pt-4">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute top-6 left-10 right-10 h-0.5 bg-neutral-200 rounded-full z-0">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((step - 1) / 2) * 100}%` }}
                                    className="h-full bg-brand-500 shadow-lg shadow-brand-500/20"
                                />
                            </div>

                            {STEPS.map((s) => (
                                <div key={s.id} className="relative z-10 flex flex-col items-center gap-3 w-32">
                                    <motion.div
                                        animate={{ 
                                            scale: step === s.id ? 1.1 : 1,
                                            backgroundColor: step >= s.id ? '#f59e0b' : '#ffffff'
                                        }}
                                        className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm",
                                            step >= s.id ? "border-brand-500 text-white" : "border-neutral-100 text-neutral-300"
                                        )}
                                    >
                                        {step > s.id ? <Check size={20} /> : <s.icon size={20} />}
                                    </motion.div>
                                    <div className="text-center space-y-0.5">
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            step >= s.id ? "text-neutral-900" : "text-neutral-300"
                                        )}>
                                            {s.label}
                                        </p>
                                        <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        <AnimatePresence mode='wait'>
                            {/* Step 1: Address */}
                            {step === 1 && (
                                <motion.div 
                                    key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-[2.5rem] p-10 border border-neutral-100 shadow-sm space-y-10">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Delivery Address</h3>
                                                <p className="text-sm text-neutral-500 font-medium">Where should we deliver your medicine?</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2 text-brand-600">
                                                    <Timer size={16} />
                                                    <span className="font-black text-lg">{formatTime(timeLeft)}</span>
                                                </div>
                                                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">Hurry Up!</p>
                                            </div>
                                        </div>
                                        
                                        <AddressSelector 
                                            selectedAddressId={selectedAddress?._id}
                                            onSelect={setSelectedAddress}
                                        />
                                    </div>

                                    <Button 
                                        onClick={() => setStep(2)} disabled={!selectedAddress}
                                        className="w-full h-16 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-neutral-900/10 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                    >
                                        Review Items <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            )}

                            {/* Step 2: Review */}
                            {step === 2 && (
                                <motion.div 
                                    key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-[2.5rem] p-10 border border-neutral-100 shadow-sm space-y-10">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Review Your Order</h3>
                                            <p className="text-sm text-neutral-500 font-medium">Check your medicines before paying.</p>
                                        </div>

                                        <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                            {items.map(item => (
                                                <div key={item._id} className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100 flex items-center justify-between group transition-all">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-white rounded-xl p-2 border border-neutral-100 shadow-sm relative shrink-0">
                                                            <img src={item.images?.[0]} className="w-full h-full object-contain" alt="" />
                                                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-neutral-900 text-white text-[10px] font-black flex items-center justify-center rounded-lg">
                                                                {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-base font-black text-neutral-900 truncate uppercase tracking-tight">{item.name}</h4>
                                                            <p className="text-[10px] text-brand-500 font-black uppercase tracking-widest mt-1">Ready for Delivery</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xl font-black text-neutral-900 tracking-tighter ml-4">₹{item.price * item.quantity}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-8 border-t border-neutral-100 grid sm:grid-cols-2 gap-8">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shrink-0">
                                                    <MapPin size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Delivering To</p>
                                                    <p className="text-xs font-bold text-neutral-800 leading-relaxed">
                                                        {selectedAddress?.streetArea}, {selectedAddress?.city} — {selectedAddress?.pincode}
                                                    </p>
                                                    <button onClick={() => setStep(1)} className="text-[9px] font-black text-brand-500 uppercase tracking-widest mt-2 hover:underline">Change Address</button>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shrink-0">
                                                    <Shield size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Prescription Status</p>
                                                    {prescriptionFile ? (
                                                        <>
                                                            <p className="text-xs font-bold text-neutral-800">Verified Successfully</p>
                                                            <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                                                <Check size={10} /> ID: {prescriptionFile._id?.slice(-8).toUpperCase()}
                                                            </p>
                                                        </>
                                                    ) : hasRxItems() ? (
                                                        <>
                                                            <p className="text-xs font-bold text-rose-500">Missing File</p>
                                                            <button onClick={() => navigate('/upload-rx')} className="text-[9px] font-black text-brand-500 uppercase tracking-widest mt-1 hover:underline">Upload Now</button>
                                                        </>
                                                    ) : (
                                                        <p className="text-xs font-bold text-neutral-800">Not Required</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button 
                                            onClick={() => setStep(1)} variant="ghost" 
                                            className="h-16 px-10 rounded-2xl border border-neutral-100 font-black text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900"
                                        >
                                            Back
                                        </Button>
                                        <Button 
                                            onClick={() => setStep(3)} 
                                            className="flex-1 h-16 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 group"
                                        >
                                            Continue to Payment <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 3 && (
                                <motion.div 
                                    key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white rounded-[2.5rem] p-10 border border-neutral-100 shadow-sm space-y-10">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Payment Method</h3>
                                            <p className="text-sm text-neutral-500 font-medium">How would you like to pay for your order?</p>
                                        </div>

                                        <div className="grid gap-4">
                                            {[
                                                { id: 'cod', label: 'Cash on Delivery', icon: Package, desc: 'Pay when your medicine arrives.' },
                                                { id: 'MediWallet', label: 'MediVault Wallet', icon: Wallet, desc: `Available Balance: ₹${user?.walletBalance || 0}` },
                                                { id: 'upi', label: 'Pay via UPI', icon: QrCode, desc: 'Pay securely using your phone.' }
                                            ].map(method => (
                                                <div 
                                                    key={method.id} onClick={() => setPaymentMethod(method.id)}
                                                    className={cn(
                                                        "p-6 lg:p-8 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-6",
                                                        paymentMethod === method.id 
                                                            ? "bg-neutral-900 border-neutral-900 text-white shadow-xl" 
                                                            : "bg-neutral-50 border-neutral-100 hover:border-brand-500/30"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-14 h-14 rounded-xl flex items-center justify-center shadow-inner",
                                                        paymentMethod === method.id ? "bg-brand-500 text-white" : "bg-white text-neutral-400"
                                                    )}>
                                                        <method.icon size={24} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-lg uppercase tracking-tight leading-none">{method.label}</h4>
                                                        <p className={cn(
                                                            "text-[10px] font-medium mt-1.5",
                                                            paymentMethod === method.id ? "text-neutral-400" : "text-neutral-500"
                                                        )}>
                                                            {method.desc}
                                                        </p>
                                                    </div>
                                                    {paymentMethod === method.id && <CheckCircle2 size={20} className="text-brand-500 shrink-0" />}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-brand-50 border border-brand-100 p-6 rounded-2xl flex gap-5 items-center">
                                            <Lock size={28} className="text-brand-600 shrink-0" />
                                            <div>
                                                <h5 className="font-black text-neutral-900 text-[10px] uppercase tracking-widest">Your Payment is Secure</h5>
                                                <p className="text-[10px] text-neutral-500 font-bold leading-relaxed mt-1">
                                                    We use advanced encryption to protect your transaction. Your data is safe with us.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button 
                                            onClick={() => setStep(2)} variant="ghost" 
                                            className="h-16 px-10 rounded-2xl border border-neutral-100 font-black text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900"
                                        >
                                            Back
                                        </Button>
                                        <Button 
                                            onClick={handlePlaceOrder} disabled={loading}
                                            className="flex-1 h-16 bg-brand-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-500/20 flex items-center justify-center gap-4"
                                        >
                                            {loading ? "Placing Order..." : "Place Order Now"}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4 sticky top-28">
                        <div className="bg-neutral-900 rounded-[2.5rem] p-10 text-white space-y-10 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <h4 className="text-2xl font-black text-white tracking-tight">Order Summary</h4>

                            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {items.map(item => (
                                    <div key={item._id} className="flex justify-between items-start gap-6">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-white uppercase tracking-tight truncate">{item.name}</p>
                                            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-lg font-black text-white tracking-tighter">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-white/10" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                                    <span>Prescription</span>
                                    <span className={prescriptionFile ? "text-brand-400" : "text-neutral-400"}>
                                        {prescriptionFile ? 'Verified' : 'Not Required'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                                    <span>Delivery Charges</span>
                                    <span className={deliveryFee === 0 ? "text-brand-400" : "text-white"}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Grand Total</p>
                                        <h3 className="text-4xl font-black text-white tracking-tighter">₹{finalTotal}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Live</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 grid grid-cols-3 gap-6 opacity-30">
                            {[
                                { icon: ShieldCheck, label: 'Secure' },
                                { icon: Activity, label: 'Verified' },
                                { icon: Lock, label: 'Safe' }
                            ].map((badge, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-900 shadow-sm border border-neutral-100">
                                        <badge.icon size={18} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
