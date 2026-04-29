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
    CreditCard
} from 'lucide-react';
import { Button, Badge, cn } from '../components/ui';
import { useCartStore } from '../store/cartStore';
import { prescriptionService } from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
    const navigate = useNavigate();
    const { items, updateQty, removeItem, totalPrice, totalItems, needsPrescription, setPrescription, prescriptionFile } = useCartStore();
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async acceptedFiles => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('prescription', acceptedFiles[0]);
            const { data } = await prescriptionService.upload(formData);
            setPrescription(data.data.prescription);
            toast.success('Clinical document verified');
        } catch (error) {
            toast.error('Failed to process document');
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
        <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-24">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 max-w-sm"
            >
                <div className="w-32 h-32 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-200">
                    <ShoppingBag size={56} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">Your vault is empty</h2>
                    <p className="text-neutral-500 font-medium">Initialize your clinical selection to begin your health journey.</p>
                </div>
                <Button onClick={() => navigate('/shop')} className="w-full h-14 bg-primary-500 hover:bg-primary-700 text-white rounded-xl font-bold shadow-xl shadow-brand-500/20">
                    Start Shopping
                </Button>
            </motion.div>
        </div>
    );

    const subtotal = totalPrice();
    const deliveryFee = subtotal > 499 ? 0 : 49;
    const finalTotal = subtotal + deliveryFee;

    const handleCheckout = () => {
        if (needsPrescription() && !prescriptionFile) {
            toast.error('Clinical verification required (Upload Prescription)');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="bg-white min-h-screen pt-24 pb-20 font-body">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <span className="text-primary-500 font-bold text-xs uppercase tracking-[3px]">Order Protocol</span>
                        <h1 className="text-4xl font-display font-extrabold text-neutral-900 tracking-tight">Your Clinical Vault</h1>
                    </div>
                    <button 
                        onClick={() => navigate('/shop')}
                        className="flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-primary-500 transition-colors"
                    >
                        <ChevronLeft size={18} />
                        Continue Shopping
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-8">
                        {needsPrescription() && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-900 rounded-2xl p-8 text-white relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert size={20} className="text-primary-500" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Action Required</span>
                                        </div>
                                        <h4 className="text-2xl font-display font-extrabold tracking-tight">Prescription Upload</h4>
                                        <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">This order contains items that require a valid doctor's prescription for fulfillment.</p>
                                    </div>
                                    
                                    <div {...getRootProps()} className={cn(
                                        "px-8 py-8 border-2 border-dashed rounded-xl transition-all cursor-pointer text-center min-w-[240px]",
                                        isDragActive ? "bg-white/10 border-primary-500" : "bg-white/5 border-white/10 hover:border-white/30"
                                    )}>
                                        <input {...getInputProps()} />
                                        {prescriptionFile ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">File Received</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <Upload size={24} className={isDragActive ? "text-primary-500" : "text-neutral-600"} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Upload PDF / Image</span>
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
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-primary-200 transition-colors"
                                    >
                                        <div className="w-24 h-24 rounded-xl bg-neutral-50 overflow-hidden shrink-0 border border-neutral-50 p-2">
                                            <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        
                                        <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{item.category}</span>
                                                <h3 className="text-xl font-display font-extrabold text-neutral-900 truncate tracking-tight">{item.name}</h3>
                                                <p className="text-xs text-neutral-400 font-medium">{item.manufacturer}</p>
                                            </div>
                                            
                                            <div className="flex items-center justify-center sm:justify-start gap-2">
                                                <Badge className="px-2 py-0.5 bg-success/10 text-success border-success/20 text-[10px] font-bold">In Stock</Badge>
                                                {item.requiresPrescription && <Badge className="px-2 py-0.5 bg-accent-100 text-accent-500 border-accent-200 text-[10px] font-bold">Rx</Badge>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center sm:items-end gap-4">
                                            <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-100 rounded-lg p-1">
                                                <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-8 h-8 rounded-md hover:bg-white transition-colors flex items-center justify-center text-neutral-400">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-display font-bold text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-8 h-8 rounded-md hover:bg-white transition-colors flex items-center justify-center text-neutral-400">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-price text-xl font-bold text-neutral-900">₹{item.price * item.quantity}</p>
                                                <button onClick={() => removeItem(item._id)} className="text-neutral-200 hover:text-danger transition-colors p-2">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Premium Summary Sidebar */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <h4 className="text-2xl font-display font-extrabold text-neutral-900 tracking-tight">Order Summary</h4>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-neutral-500">Vault Subtotal</span>
                                    <span className="font-bold text-neutral-900">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-neutral-500">Logistics Fee</span>
                                    <span className={cn("font-bold", deliveryFee === 0 ? "text-success" : "text-neutral-900")}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                {deliveryFee > 0 && (
                                    <p className="text-[11px] text-primary-500 font-bold bg-primary-50 p-3 rounded-lg border border-primary-100">
                                        💡 Add ₹{500 - subtotal} more for FREE delivery!
                                    </p>
                                )}
                                <div className="h-px bg-neutral-200" />
                                <div className="flex justify-between items-end pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[2px]">Total Payable</p>
                                        <h3 className="font-price text-4xl font-bold text-neutral-900 tracking-tighter">₹{finalTotal}</h3>
                                    </div>
                                    <div className="flex items-center gap-1 text-success mb-1">
                                        <Lock size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                onClick={handleCheckout} 
                                className="w-full h-14 bg-primary-500 hover:bg-primary-700 text-white rounded-xl font-bold text-base shadow-xl shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={20} />
                            </Button>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-widest justify-center">
                                    <ShieldCheck size={16} /> 100% Genuine Medicines
                                </div>
                                <div className="grid grid-cols-4 gap-2 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                                    <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" className="h-4 mx-auto" alt="Visa" />
                                    <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" className="h-4 mx-auto" alt="Mastercard" />
                                    <img src="https://cdn-icons-png.flaticon.com/512/196/196559.png" className="h-4 mx-auto" alt="Paypal" />
                                    <CreditCard className="h-4 mx-auto" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-primary-50 rounded-2xl p-6 border border-primary-100 flex gap-4">
                            <Truck className="text-primary-500 shrink-0" size={24} />
                            <div className="space-y-1">
                                <h5 className="font-bold text-primary-900 text-sm">Same Day Delivery</h5>
                                <p className="text-xs text-primary-700 font-medium">Order within the next <span className="font-bold">2h 14m</span> to get your medicine by today evening.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
