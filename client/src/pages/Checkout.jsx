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

// ─── Constants & Tokens ──────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Logistics', icon: MapPin, desc: 'Destination Hub' },
    { id: 2, label: 'Validation', icon: ClipboardList, desc: 'Manifest Review' },
    { id: 3, label: 'Settlement', icon: CreditCard, desc: 'Financial Clearance' },
];

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { items, clearCart, hasRxItems, calculateSubtotal, calculateTotal, coupon, discount, deliveryFee, prescriptionId } = useCartStore();
    
    // ─── State Management ─────────────────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [timeLeft, setTimeLeft] = useState(600); 

    // ─── Effects ─────────────────────────────────────────────────────────────
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

    // ─── Logic ───────────────────────────────────────────────────────────────
    const subtotal = calculateSubtotal();
    const finalTotal = calculateTotal();

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Logistics Terminal Required. Please select a destination.');
            return;
        }

        if (hasRxItems() && !prescriptionId) {
            toast.error('Clinical Bypass Denied. Prescription required for this manifest.');
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
                notes: '' // Optional notes
            };
            
            const response = await orderService.placeOrder(orderData);
            const orderId = response.data.order?._id || response.data._id;

            toast.success('Clinical Order Protocol Successfully Executed');
            clearCart();

            if (paymentMethod === 'upi') {
                navigate(`/payment/upi/${orderId}`);
            } else {
                navigate('/orders');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Protocol failure. Please re-initialize.');
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
        <div className="bg-neutral-25 min-h-screen pt-28 pb-32">
            <div className="container-custom">
                {/* ── Protocol Command Header ── */}
                <div className="flex flex-col items-center mb-12 space-y-4">
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-brand-primary/10 rounded-full border border-brand-primary/20">
                        <ShieldCheck size={14} className="text-brand-primary" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary">Institutional Transaction Protocol</span>
                    </div>
                    
                    <div className="text-center space-y-1">
                        <h1 className="text-4xl md:text-5xl font-display font-black text-neutral-900 tracking-tighter leading-none">
                            Checkout <span className="text-neutral-400 font-medium">Protocol.</span>
                        </h1>
                    </div>

                    {/* Protocol Timeline */}
                    <div className="w-full max-w-3xl pt-8">
                        <div className="flex items-center justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-7 left-10 right-10 h-[2px] bg-neutral-100 rounded-full z-0">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((step - 1) / 2) * 100}%` }}
                                    className="h-full bg-brand-primary shadow-[0_0_10px_rgba(22,163,74,0.3)]"
                                />
                            </div>

                            {STEPS.map((s, idx) => (
                                <div key={s.id} className="relative z-10 flex flex-col items-center gap-4 w-32">
                                    <motion.div
                                        animate={{ 
                                            scale: step === s.id ? [1, 1.1, 1] : 1,
                                            boxShadow: step === s.id ? "0 20px 40px -10px rgba(22,163,74,0.3)" : "none"
                                        }}
                                        className={cn(
                                            "w-14 h-14 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-700",
                                            step >= s.id ? "bg-brand-primary border-brand-primary text-white" : "bg-white border-neutral-100 text-neutral-300"
                                        )}
                                    >
                                        {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                                    </motion.div>
                                    <div className="text-center space-y-1">
                                        <p className={cn(
                                            "text-[11px] font-black uppercase tracking-[0.2em]",
                                            step >= s.id ? "text-neutral-900" : "text-neutral-300"
                                        )}>
                                            {s.label}
                                        </p>
                                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* ── Main Command Panel ── */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode='wait'>
                            {/* Step 1: Logistics Destination */}
                            {step === 1 && (
                                <motion.div 
                                    key="logistics"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-2xl shadow-neutral-900/5 space-y-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/5 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-display font-black text-neutral-900 tracking-tight">Hub Destination</h3>
                                                <p className="text-sm text-neutral-500 font-medium">Synchronize clinical logistics for secure dispatch.</p>
                                            </div>
                                            <div className="hidden md:flex flex-col items-end">
                                                <div className="flex items-center gap-2 text-brand-primary">
                                                    <Timer size={16} />
                                                    <span className="font-price font-black text-xl">{formatTime(timeLeft)}</span>
                                                </div>
                                                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">Session Expiry</p>
                                            </div>
                                        </div>
                                        
                                        <AddressSelector 
                                            selectedAddressId={selectedAddress?._id}
                                            onSelect={setSelectedAddress}
                                        />
                                    </div>

                                    <Button 
                                        onClick={() => setStep(2)} 
                                        disabled={!selectedAddress}
                                        className="w-full h-20 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                                    >
                                        Initiate Clinical Validation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            )}

                            {/* Step 2: Validation Manifest */}
                            {step === 2 && (
                                <motion.div 
                                    key="validation"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-2xl shadow-neutral-900/5 space-y-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/5 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                                        
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-display font-black text-neutral-900 tracking-tight">Manifest Integrity</h3>
                                            <p className="text-xs text-neutral-500 font-medium">Verify clinical assets before protocol finalization.</p>
                                        </div>

                                        <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-custom">
                                            {items.map(item => (
                                                <div key={item._id} className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-500">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-20 h-20 bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm relative group-hover:scale-110 transition-transform">
                                                            <img src={item.images?.[0]} className="w-full h-full object-contain" alt="" />
                                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-neutral-900 text-white text-[11px] font-black flex items-center justify-center rounded-lg shadow-xl">
                                                                {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-neutral-900 uppercase tracking-tight leading-tight">{item.name}</h4>
                                                            <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest mt-1">Institutional Clearance Active</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-2xl font-price font-black text-neutral-900 tracking-tighter">₹{item.price * item.quantity}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-8 border-t border-neutral-50 grid sm:grid-cols-2 gap-8">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-brand-600/10 rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
                                                    <MapPin size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Target Logistics</p>
                                                    <p className="text-xs font-bold text-neutral-800 leading-relaxed">
                                                        {selectedAddress?.streetArea}, {selectedAddress?.city} — {selectedAddress?.pincode}
                                                    </p>
                                                    <button onClick={() => setStep(1)} className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] mt-2 hover:underline">Change Destination</button>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-brand-600/10 rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
                                                    <Shield size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Pharmacist Seal</p>
                                                    {prescriptionFile ? (
                                                        <>
                                                            <p className="text-xs font-bold text-neutral-800">Rx Linked Successfully</p>
                                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                                                <Check size={10} /> Verified ID: {prescriptionFile._id?.slice(-8).toUpperCase()}
                                                            </p>
                                                        </>
                                                    ) : needsPrescription() ? (
                                                        <>
                                                            <p className="text-xs font-bold text-rose-500">Prescription Missing</p>
                                                            <button 
                                                                onClick={() => navigate('/upload-rx')}
                                                                className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] mt-2 hover:underline flex items-center gap-1"
                                                            >
                                                                Upload Now <ArrowRight size={10} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-xs font-bold text-neutral-800">Institutional Hub Verified</p>
                                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-2">Ready for Dispatch</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <Button 
                                            onClick={() => setStep(1)} 
                                            variant="outline" 
                                            className="h-20 px-10 rounded-[2.5rem] border-2 border-neutral-100 font-black text-[11px] uppercase tracking-[0.2em] text-neutral-400 hover:bg-neutral-50 transition-all"
                                        >
                                            <ArrowLeft size={16} className="mr-2" /> Adjust
                                        </Button>
                                        <Button 
                                            onClick={() => setStep(3)} 
                                            className="flex-1 h-20 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                                        >
                                            Finalize Financial Clearance <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Financial Settlement */}
                            {step === 3 && (
                                <motion.div 
                                    key="settlement"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-2xl shadow-neutral-900/5 space-y-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/5 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                                        
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-display font-black text-neutral-900 tracking-tight">Settlement Portal</h3>
                                            <p className="text-xs text-neutral-500 font-medium">Select authorized payment instrument for clearance.</p>
                                        </div>

                                        <div className="grid gap-6">
                                            {[
                                                { id: 'cod', label: 'Cash on Delivery', icon: Package, desc: 'Pay clinical courier upon asset arrival.' },
                                                { id: 'MediWallet', label: 'MediVault Wallet', icon: Wallet, desc: `Available Clinical Balance: ₹${user?.walletBalance || 0}` },
                                                { id: 'upi', label: 'UPI Command', icon: QrCode, desc: 'Execute instant digital clearance.' }
                                            ].map(method => (
                                                <div 
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={cn(
                                                        "p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer group flex items-center gap-8 relative overflow-hidden",
                                                        paymentMethod === method.id 
                                                            ? "bg-neutral-900 border-neutral-900 text-white shadow-2xl shadow-neutral-950/30" 
                                                            : "bg-neutral-50 border-neutral-100 hover:border-brand-600/30"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner",
                                                        paymentMethod === method.id ? "bg-brand-primary text-white scale-110" : "bg-white text-neutral-400"
                                                    )}>
                                                        <method.icon size={28} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-black text-lg uppercase tracking-tight leading-none">{method.label}</h4>
                                                        <p className={cn(
                                                            "text-[11px] font-medium mt-2 transition-colors",
                                                            paymentMethod === method.id ? "text-neutral-400" : "text-neutral-500"
                                                        )}>
                                                            {method.desc}
                                                        </p>
                                                    </div>
                                                    <div className={cn(
                                                        "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                                                        paymentMethod === method.id ? "border-brand-primary bg-brand-primary" : "border-neutral-200"
                                                    )}>
                                                        {paymentMethod === method.id && <CheckCircle2 size={14} className="text-white" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-brand-600/5 border border-brand-600/10 p-8 rounded-[2rem] flex gap-6 items-start">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm shrink-0">
                                                <ShieldCheck size={28} />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-neutral-900 text-sm uppercase tracking-tight">Institutional Encryption Active</h5>
                                                <p className="text-[11px] text-neutral-500 font-medium mt-1 leading-relaxed">
                                                    Financial settlement is isolated via AES-256 clinical-grade encryption. Your sensitive telemetry remains confidential.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <Button 
                                            onClick={() => setStep(2)} 
                                            variant="outline" 
                                            className="h-20 px-10 rounded-[2.5rem] border-2 border-neutral-100 font-black text-[11px] uppercase tracking-[0.2em] text-neutral-400 hover:bg-neutral-50 transition-all"
                                        >
                                            <ArrowLeft size={16} className="mr-2" /> Manifest
                                        </Button>
                                        <Button 
                                            onClick={handlePlaceOrder} 
                                            disabled={loading}
                                            className="flex-1 h-20 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-3">
                                                    <Loader2 className="animate-spin text-white" size={24} />
                                                    <span>Synchronizing HUB...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span>Place Clinical Order</span>
                                                    <Zap size={20} className="fill-white" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Clinical Manifest (Order Summary) ── */}
                    <div className="lg:col-span-4 sticky top-28">
                        <div className="bg-neutral-900 rounded-[3rem] p-10 text-white space-y-10 relative overflow-hidden shadow-2xl shadow-neutral-950/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                            
                            <div className="flex items-center justify-between relative z-10">
                                <h4 className="text-2xl font-display font-black text-white tracking-tight">Manifest 24A</h4>
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest text-neutral-400">
                                    Ref: #MC-HUB
                                </div>
                            </div>

                            <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 scrollbar-hide relative z-10">
                                {items.map(item => (
                                    <div key={item._id} className="flex justify-between items-start gap-6 group">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-white uppercase tracking-tight group-hover:text-brand-primary transition-colors truncate">{item.name}</p>
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Asset Allocation: {item.quantity}</p>
                                        </div>
                                        <p className="font-price font-black text-white text-lg whitespace-nowrap tracking-tighter group-hover:scale-110 transition-transform">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-white/10 relative z-10" />

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                                    <span>Prescription Clearance</span>
                                    <span className={prescriptionFile ? "text-brand-primary" : "text-neutral-500"}>
                                        {prescriptionFile ? 'Authenticated' : 'Registry Bypass'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                                    <span>Logistics Protocol</span>
                                    <span className={deliveryFee === 0 ? "text-brand-primary" : "text-white"}>
                                        {deliveryFee === 0 ? 'FREE DISPATCH' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end pt-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Institutional Total</p>
                                        <h3 className="font-price text-4xl font-black text-white tracking-tighter">₹{finalTotal}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Sync</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Trust Badges */}
                        <div className="mt-10 grid grid-cols-3 gap-6">
                            {[
                                { icon: ShieldCheck, label: 'Secure' },
                                { icon: Activity, label: 'Verified' },
                                { icon: Lock, label: 'Encrypted' }
                            ].map((badge, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-all duration-500 cursor-default grayscale hover:grayscale-0">
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
