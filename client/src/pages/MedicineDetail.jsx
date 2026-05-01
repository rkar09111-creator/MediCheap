import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronRight,
    Star,
    ShieldAlert,
    Truck,
    Clock,
    Minus,
    Plus,
    ShoppingCart,
    ArrowLeft,
    ShieldCheck,
    RotateCcw,
    AlertCircle,
    Info,
    Calendar,
    BadgeCheck,
    Heart,
    Share2,
    Activity,
    Eye,
    Zap,
    FlaskConical,
    Stethoscope,
    Lock,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, Skeleton, cn } from '../components/ui';
import api, { medicineService } from '../services/api';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const MedicineDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('overview');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [substitutes, setSubstitutes] = useState([]);

    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const { data } = await medicineService.getById(id);
                const med = data.data.medicine;
                setMedicine(med);
                
                // Fetch Substitutes (Same generic name)
                let subRes;
                if (med.genericName) {
                    subRes = await medicineService.getAll({ 
                        search: med.genericName, 
                        limit: 5 
                    });
                    setSubstitutes(subRes.data.data.medicines.filter(m => m._id !== id));
                }
            } catch (error) {
                console.error(error);
                toast.error('Medicine not found');
            } finally {
                setLoading(false);
            }
        };
        fetchMedicine();
    }, [id]);

    const handleAddToCart = () => {
        if (medicine.stock <= 0) {
            toast.error('Medicine out of stock');
            return;
        }
        addItem(medicine, quantity);
        toast.success(`${medicine.name} added to cart`);
    };

    if (loading) return (
        <div className="container-custom py-12 space-y-12">
            <div className="grid lg:grid-cols-2 gap-12">
                <Skeleton className="aspect-square rounded-[3rem]" />
                <div className="space-y-8">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-48" />
                </div>
            </div>
        </div>
    );

    if (!medicine) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-200">
                <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Medicine Not Found</h2>
            <Button onClick={() => navigate('/shop')} variant="ghost" className="font-bold text-brand-primary">Return to Catalog</Button>
        </div>
    );

    const discount = Math.round(((medicine.mrp - medicine.sellingPrice) / medicine.mrp) * 100);

    return (
        <div className="bg-white min-h-screen pb-20 font-body">
            <Helmet>
                <title>{medicine.name} | MediCheap Pharmacy</title>
            </Helmet>

            {/* Breadcrumbs */}
            <div className="container-custom py-8">
                <div className="flex items-center gap-3 text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                    <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/shop" className="hover:text-brand-primary transition-colors">Pharmacy</Link>
                    <ChevronRight size={12} />
                    <Link to={`/shop?category=${medicine.category}`} className="hover:text-brand-primary transition-colors">{medicine.category}</Link>
                    <ChevronRight size={12} />
                    <span className="text-neutral-900 truncate max-w-[150px]">{medicine.name}</span>
                </div>
            </div>

            <div className="container-custom grid lg:grid-cols-2 gap-16 xl:gap-24">
                {/* Left: Visuals */}
                <div className="space-y-8">
                    <div className="aspect-square bg-neutral-50 rounded-[3rem] border border-neutral-100 p-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent" />
                        <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={medicine.images?.[0]?.url || medicine.images?.[0]}
                            alt={medicine.name}
                            className="w-full h-full object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                        />
                        {discount > 0 && (
                            <div className="absolute top-8 left-8 bg-brand-primary text-white text-xs font-black px-4 py-1.5 rounded-full shadow-xl shadow-brand-primary/20 z-20 uppercase tracking-widest">
                                Save {discount}%
                            </div>
                        )}
                        <button 
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className="absolute top-8 right-8 w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-all z-20 group/heart"
                        >
                            <Heart size={24} className={cn("transition-transform group-active/heart:scale-125", isWishlisted && "fill-rose-500 text-rose-500")} />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {(medicine.images || []).map((img, i) => (
                            <div key={i} className="aspect-square rounded-2xl bg-neutral-50 border border-neutral-100 p-3 hover:border-brand-primary transition-all cursor-pointer">
                                <img src={img.url || img} className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Intelligence */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Badge className="bg-brand-primary/10 text-brand-primary border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                {medicine.category}
                            </Badge>
                            {medicine.requiresPrescription && (
                                <Badge className="bg-amber-50 text-amber-600 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2">
                                    <ShieldAlert size={14} /> Prescription Req.
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-neutral-950 tracking-tighter leading-tight uppercase">
                            {medicine.name}
                        </h1>
                        <p className="text-lg text-neutral-500 font-bold uppercase tracking-tight">{medicine.brand} · {medicine.dosageForm}</p>
                        
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2">
                                <div className="flex text-amber-500">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill={s <= 4.8 ? "currentColor" : "none"} />)}
                                </div>
                                <span className="font-black text-neutral-900 text-lg">4.8</span>
                            </div>
                            <div className="w-px h-6 bg-neutral-100" />
                            <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">1,240 Certified Reviews</span>
                        </div>
                    </div>

                    <div className="p-10 bg-neutral-950 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-[56px] font-black text-white tracking-tighter leading-none">₹{medicine.sellingPrice}</span>
                                {discount > 0 && <span className="text-2xl text-neutral-600 font-bold line-through">₹{medicine.mrp}</span>}
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl hover:bg-white/10 flex items-center justify-center text-neutral-400 transition-all">
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-black text-xl">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl hover:bg-white/10 flex items-center justify-center text-neutral-400 transition-all">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <Button 
                                    onClick={handleAddToCart}
                                    size="xl" fullRadius className="flex-1 h-[76px] bg-brand-primary text-white font-black text-[14px] uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Add to Vault <ShoppingCart size={22} className="ml-4" />
                                </Button>
                            </div>
                            
                            <div className="pt-4 flex flex-wrap gap-x-8 gap-y-4">
                                <div className="flex items-center gap-3">
                                    <Truck size={18} className="text-brand-primary" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Same Day Delivery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RotateCcw size={18} className="text-brand-primary" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Easy Returns</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} className="text-brand-primary" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">Certified Batch</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100 flex items-center gap-6 group hover:bg-white transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                <BadgeCheck size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-neutral-900 uppercase text-xs tracking-tight">Verified Source</h4>
                                <p className="text-[11px] text-neutral-400 font-medium">100% genuine formulation.</p>
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100 flex items-center gap-6 group hover:bg-white transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                <Lock size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-neutral-900 uppercase text-xs tracking-tight">Safe Packaging</h4>
                                <p className="text-[11px] text-neutral-400 font-medium">Tamper-proof medical grade.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clinical Tabs */}
            <div className="container-custom mt-24">
                <div className="border-b border-neutral-100 flex gap-12 overflow-x-auto no-scrollbar">
                    {['overview', 'composition', 'side-effects', 'usage'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap",
                                activeTab === tab ? "text-neutral-950" : "text-neutral-300 hover:text-neutral-500"
                            )}
                        >
                            {tab.replace('-', ' ')}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="py-16 max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            {activeTab === 'overview' && (
                                <div className="grid md:grid-cols-2 gap-16">
                                    <div className="space-y-6">
                                        <h4 className="flex items-center gap-3 text-sm font-black text-neutral-900 uppercase tracking-widest">
                                            <Info size={18} className="text-brand-primary" /> Indications
                                        </h4>
                                        <p className="text-[15px] text-neutral-500 leading-relaxed font-medium">
                                            {medicine.description || "Clinical documentation pending for this specific formulation. Contact our expert pharmacist for detailed guidance."}
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="flex items-center gap-3 text-sm font-black text-neutral-900 uppercase tracking-widest">
                                            <ShieldCheck size={18} className="text-brand-primary" /> Quick Facts
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between border-b border-neutral-50 pb-3">
                                                <span className="text-xs font-bold text-neutral-400 uppercase">Drug Class</span>
                                                <span className="text-xs font-black text-neutral-900 uppercase">{medicine.category}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-neutral-50 pb-3">
                                                <span className="text-xs font-bold text-neutral-400 uppercase">Generic Name</span>
                                                <span className="text-xs font-black text-neutral-900 uppercase">{medicine.genericName || 'System Ref.'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'composition' && (
                                <div className="space-y-8">
                                    <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Chemical Composition</h4>
                                    <div className="p-10 bg-neutral-50 rounded-[3rem] border border-neutral-100 flex items-center gap-10">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-brand-primary shadow-sm">
                                            <FlaskConical size={40} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-neutral-900 tracking-tight uppercase">{medicine.genericName}</p>
                                            <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">Primary Molecule Node</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'side-effects' && (
                                <div className="space-y-8">
                                    <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Reported Side Effects</h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {(Array.isArray(medicine.sideEffects) ? medicine.sideEffects : (typeof medicine.sideEffects === 'string' ? medicine.sideEffects.split(',').filter(Boolean) : [])).map((effect, i) => (
                                            <div key={i} className="flex items-center gap-4 p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                                <span className="text-sm font-bold text-rose-900 uppercase tracking-tight">{effect}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'usage' && (
                                <div className="space-y-8">
                                    <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Clinical Usage Protocol</h4>
                                    <div className="p-10 bg-neutral-50 rounded-[3rem] border border-neutral-100 space-y-6">
                                        <div className="flex items-center gap-4 text-brand-primary">
                                            <Calendar size={24} />
                                            <p className="font-black uppercase tracking-widest text-sm">Suggested Frequency</p>
                                        </div>
                                        <p className="text-lg text-neutral-700 font-medium leading-relaxed">
                                            {medicine.indications || "Usage protocol should be strictly followed as per the instructions on your physician's prescription."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Substitutes Section */}
            {substitutes.length > 0 && (
                <div className="container-custom mt-32 space-y-12">
                    <div className="flex items-end justify-between">
                        <div className="space-y-4">
                            <span className="text-brand-primary font-black text-[11px] uppercase tracking-[0.4em]">Alternative Solutions</span>
                            <h2 className="text-4xl font-black text-neutral-950 tracking-tighter uppercase">Clinical Substitutes.</h2>
                        </div>
                        <Button onClick={() => navigate('/shop')} variant="ghost" className="font-black text-xs uppercase tracking-widest">View More <ChevronRight size={16} className="ml-2" /></Button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {substitutes.map(sub => (
                            <motion.div 
                                key={sub._id}
                                onClick={() => navigate(`/medicine/${sub._id}`)}
                                className="group cursor-pointer space-y-6"
                            >
                                <div className="aspect-square bg-neutral-50 rounded-[3rem] border border-neutral-100 p-8 flex items-center justify-center group-hover:bg-white group-hover:border-brand-primary/30 group-hover:shadow-2xl transition-all duration-700">
                                    <img src={sub.images?.[0]?.url || sub.images?.[0]} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="px-2 space-y-1">
                                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{sub.brand}</p>
                                    <h4 className="text-lg font-black text-neutral-900 uppercase tracking-tight truncate">{sub.name}</h4>
                                    <p className="text-xl font-black text-neutral-400 tracking-tighter">₹{sub.sellingPrice}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineDetail;
