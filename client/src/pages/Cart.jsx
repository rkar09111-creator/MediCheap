import React, { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trash2, 
    Minus, 
    Plus, 
    ShieldAlert, 
    Upload, 
    FileText, 
    X, 
    ArrowRight, 
    ShoppingBag,
    CheckCircle2,
    ShieldCheck,
    Lock,
    ChevronLeft,
    Truck,
    CreditCard,
    Pill,
    Activity,
    Zap
} from 'lucide-react';
import { Button, Badge, cn } from '../components/ui';
import { useCartStore } from '../store/cartStore';
import { prescriptionService } from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
    const navigate = useNavigate();
    const { items, updateQty, removeItem, calculateSubtotal, totalItems, needsPrescription, setPrescription, prescriptionFile } = useCartStore();
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async acceptedFiles => {
        setIsUploading(true);
        const tid = toast.loading('Checking prescription...');
        try {
            const formData = new FormData();
            formData.append('prescription', acceptedFiles[0]);
            const { data } = await prescriptionService.upload(formData);
            setPrescription(data.data.prescription);
            toast.success('Prescription verified', { id: tid });
        } catch (error) {
            toast.error('Failed to upload', { id: tid });
        } finally {
            setIsUploading(false);
        }
    }, [setPrescription]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'], 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    if (items.length === 0) return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6 font-body">
            <div className="max-w-6xl mx-auto space-y-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8 max-w-xl mx-auto"
                >
                    <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-200">
                        <ShoppingBag size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-neutral-900 tracking-tight">Your cart is empty.</h2>
                        <p className="text-neutral-500 font-medium text-lg">Your clinical registry is currently inactive. Initialize your first fulfillment protocol to begin.</p>
                    </div>
                    <Button onClick={() => navigate('/shop')} size="xl" fullRadius className="h-16 px-12 bg-neutral-950 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform">
                        Explore Medical Catalog
                    </Button>
                </motion.div>

                {/* Discovery Section */}
                <div className="space-y-10 border-t border-neutral-100 pt-20">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Clinical Essentials.</h3>
                        <Link to="/shop" className="text-xs font-black text-brand-primary uppercase tracking-widest hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Dolo 650 Tablet', brand: 'Micro Labs', price: 32, icon: Pill, tag: 'Fever' },
                            { name: 'Shelcal 500mg', brand: 'Torrent', price: 124, icon: ShieldCheck, tag: 'Vitamin' },
                            { name: 'Allegra 120mg', brand: 'Sanofi', price: 215, icon: Activity, tag: 'Allergy' },
                            { name: 'Volini Gel 75g', brand: 'Sun Pharma', price: 185, icon: Zap, tag: 'Pain' }
                        ].map((item, i) => (
                            <motion.div 
                                key={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="group cursor-pointer"
                                onClick={() => navigate('/shop')}
                            >
                                <div className="aspect-square bg-neutral-50 rounded-[2.5rem] border border-neutral-100 mb-6 flex items-center justify-center group-hover:bg-white group-hover:border-brand-primary/30 group-hover:shadow-xl transition-all duration-500">
                                    <item.icon size={48} className="text-neutral-200 group-hover:text-brand-primary transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{item.tag}</span>
                                    <h4 className="font-display font-black text-[15px] text-neutral-900 uppercase tracking-tight line-clamp-1">{item.name}</h4>
                                    <p className="font-num font-black text-lg text-neutral-400">₹{item.price}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const subtotal = calculateSubtotal();
    const deliveryFee = subtotal > 499 ? 0 : 49;
    const finalTotal = subtotal + deliveryFee;

    const handleCheckout = () => {
        // needsPrescription check
        const needsRx = items.some(i => i.requiresPrescription);
        if (needsRx && !prescriptionFile) {
            toast.error('Please upload your prescription first');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="bg-white min-h-screen pb-20 font-body">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <span className="text-brand-500 font-black text-[10px] uppercase tracking-widest">Order Summary</span>
                        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">Shopping Cart</h1>
                    </div>
                    <button 
                        onClick={() => navigate('/shop')}
                        className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest hover:text-brand-500 transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Continue Shopping
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        {items.some(i => i.requiresPrescription) && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-900 rounded-[2.5rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert size={20} className="text-brand-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Prescription Required</span>
                                        </div>
                                        <h4 className="text-2xl font-black tracking-tight">Upload Prescription</h4>
                                        <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-medium">Some items in your cart require a valid prescription from a doctor.</p>
                                    </div>
                                    
                                    <div {...getRootProps()} className={cn(
                                        "px-8 py-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer text-center min-w-[240px]",
                                        isDragActive ? "bg-white/10 border-brand-primary" : "bg-white/5 border-white/10 hover:border-white/30"
                                    )}>
                                        <input {...getInputProps()} />
                                        {prescriptionFile ? (
                                            <div className="flex flex-col items-center gap-2 text-brand-primary">
                                                <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Received</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <Upload size={24} className={isDragActive ? "text-brand-primary" : "text-neutral-600"} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Upload PDF / JPG</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <AnimatePresence mode='popLayout'>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.medicine} layout initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-[2rem] border border-neutral-100 p-6 lg:p-8 flex flex-col sm:flex-row gap-8 items-center hover:shadow-lg transition-all"
                                    >
                                        <div className="w-24 h-24 rounded-2xl bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100 p-3">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        
                                        <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{item.category || 'Clinical'}</span>
                                                <h3 className="text-xl font-black text-neutral-900 truncate tracking-tight">{item.name}</h3>
                                                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">{item.manufacturer || 'System Verified'}</p>
                                            </div>
                                            
                                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                                <Badge className="px-2.5 py-0.5 bg-brand-primary/5 text-brand-primary border-none text-[9px] font-black uppercase tracking-widest">In Stock</Badge>
                                                {item.requiresPrescription && <Badge className="px-2.5 py-0.5 bg-amber-50 text-amber-600 border-none text-[9px] font-black uppercase tracking-widest">Prescription Needed</Badge>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center sm:items-end gap-6">
                                            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 rounded-xl p-1.5 shadow-inner">
                                                <button onClick={() => updateQty(item.medicine, item.quantity - 1)} className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm transition-all flex items-center justify-center text-neutral-400 hover:text-neutral-900">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-black text-neutral-900 text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQty(item.medicine, item.quantity + 1)} className="w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm transition-all flex items-center justify-center text-neutral-400 hover:text-neutral-900">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <p className="text-2xl font-black text-neutral-900 tracking-tighter">₹{item.sellingPrice * item.quantity}</p>
                                                <button onClick={() => removeItem(item.medicine)} className="text-neutral-200 hover:text-rose-500 transition-colors p-2">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4 sticky top-28">
                        <div className="bg-neutral-50 rounded-[2.5rem] p-10 border border-neutral-100 space-y-10 relative overflow-hidden shadow-sm">
                            <h4 className="text-2xl font-black text-neutral-900 tracking-tight">Order Total</h4>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-widest">Cart Total</span>
                                    <span className="font-black text-neutral-900">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-widest">Clinical Dispatch</span>
                                    <span className="font-black text-emerald-600 uppercase text-[11px]">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                                </div>
                                <div className="pt-5 border-t border-neutral-200 flex justify-between items-center">
                                    <span className="font-black text-neutral-950 uppercase text-[12px] tracking-[0.2em]">Final Total</span>
                                    <span className="text-3xl font-black text-neutral-950 tracking-tighter">₹{finalTotal}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Button 
                                    onClick={handleCheckout}
                                    size="xl" fullRadius className="w-full h-16 bg-brand-primary text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Proceed to Checkout <ArrowRight size={18} className="ml-2" />
                                </Button>
                                <p className="text-[10px] text-neutral-400 text-center font-bold uppercase tracking-widest">Secure 256-bit SSL encrypted checkout</p>
                            </div>
                        </div>

                        {/* Extra Trust Badge */}
                        <div className="mt-8 p-8 bg-white rounded-[2rem] border border-neutral-100 flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h5 className="font-black text-sm text-neutral-900 uppercase tracking-tight">Buyer Protection</h5>
                                <p className="text-[11px] text-neutral-400 font-medium">100% genuine medicine guarantee.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
