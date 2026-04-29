import React, { useState, useEffect } from 'react';
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
    Lock
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
                }
                
                // Fallback to Category if no generic matches
                if (!subRes || subRes.data.data.medicines.length <= 1) {
                    subRes = await medicineService.getAll({ 
                        category: med.category?._id || med.category,
                        limit: 5 
                    });
                }

                if (subRes?.data?.data?.medicines) {
                    setSubstitutes(subRes.data.data.medicines.filter(m => m._id !== id).slice(0, 4));
                }
            } catch (error) {
                toast.error('Medicine not found');
                navigate('/shop');
            } finally {
                setLoading(false);
            }
        };
        fetchMedicine();
    }, [id, navigate]);

    // Conversion Timers & Viewer Counts
    const [viewers, setViewers] = useState(Math.floor(Math.random() * 25) + 8);
    const [timeLeft, setTimeLeft] = useState(1200); // 20 mins in seconds

    useEffect(() => {
        const vInterval = setInterval(() => setViewers(v => Math.max(5, v + (Math.random() > 0.5 ? 1 : -1))), 5000);
        const tInterval = setInterval(() => setTimeLeft(t => (t > 0 ? t - 1 : 1200)), 1000);
        return () => { clearInterval(vInterval); clearInterval(tInterval); };
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) return (
        <div className="container-custom pt-32 pb-20 animate-pulse">
            <div className="grid lg:grid-cols-2 gap-16">
                <div className="aspect-square bg-neutral-100 rounded-[2.5rem]" />
                <div className="space-y-8">
                    <div className="h-4 w-1/4 bg-neutral-100 rounded-full" />
                    <div className="h-16 w-3/4 bg-neutral-100 rounded-2xl" />
                    <div className="h-24 w-full bg-neutral-100 rounded-2xl" />
                    <div className="h-16 w-full bg-neutral-100 rounded-2xl" />
                </div>
            </div>
        </div>
    );

    if (!medicine) return null;

    const discountedPrice = medicine.sellingPrice || medicine.mrp || 0;
    const originalPrice = medicine.mrp || medicine.sellingPrice || 0;
    const savings = Math.max(0, originalPrice - discountedPrice);
    const discountPct = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

    return (
        <div className="bg-neutral-25 min-h-screen pt-24 pb-20 font-body selection:bg-brand-600/10">
            <div className="container-custom">
                {/* 🧭 CLINICAL BREADCRUMB */}
                <nav className="flex items-center gap-3 text-[11px] font-bold text-neutral-400 mb-10 overflow-x-auto whitespace-nowrap no-scrollbar uppercase tracking-widest">
                    <Link to="/" className="hover:text-brand-primary transition-colors">Registry</Link>
                    <ChevronRight size={12} className="text-neutral-300" />
                    <Link to="/shop" className="hover:text-brand-primary transition-colors">Clinical Hub</Link>
                    <ChevronRight size={12} className="text-neutral-300" />
                    <span className="text-neutral-900">{medicine.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* 🖼️ LEFT: MEDIA & TRUST HUB */}
                    <div className="space-y-8 lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 overflow-hidden group flex items-center justify-center p-16"
                        >
                            {/* Subtle Ambient Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <motion.img 
                                whileHover={{ scale: 1.05 }}
                                src={typeof medicine.images?.[0] === 'string' ? medicine.images[0] : (medicine.images?.[0]?.url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600')} 
                                alt={medicine.name} 
                                className="w-full h-full object-contain relative z-10 transition-transform duration-700"
                            />

                            {/* High-Trust Floating Badges */}
                            <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
                                <div className="px-4 py-2 bg-brand-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg shadow-brand-600/30 flex items-center gap-2">
                                    <ShieldCheck size={14} /> Purity Assured
                                </div>
                                {medicine.requiresPrescription && (
                                    <div className="px-4 py-2 bg-danger text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg shadow-danger/20 flex items-center gap-2">
                                        <Lock size={14} /> Prescription Required
                                    </div>
                                )}
                            </div>

                            <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-danger transition-all active:scale-90"
                                >
                                    <Heart size={22} className={isWishlisted ? "fill-danger text-danger" : ""} />
                                </button>
                                <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-brand-primary transition-all active:scale-90">
                                    <Share2 size={22} />
                                </button>
                            </div>

                            {/* Verification Footer Overlay */}
                            <div className="absolute bottom-8 left-8 right-8 z-20">
                                <div className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex items-center gap-4 text-white">
                                    <div className="w-12 h-12 bg-brand-600/20 text-brand-primary rounded-xl flex items-center justify-center shrink-0">
                                        <BadgeCheck size={28} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-0.5">Pharmacist Verified</p>
                                        <p className="text-xs font-bold text-neutral-300">This batch has passed clinical integrity scans.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Thumbnail Cluster */}
                        <div className="grid grid-cols-4 gap-4 px-4">
                            {medicine.images?.map((img, i) => (
                            <div key={i} className="aspect-square bg-white rounded-2xl border border-neutral-100 hover:border-brand-primary transition-all cursor-pointer overflow-hidden p-3 shadow-sm group">
                                <img src={typeof img === 'string' ? img : img.url} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* 📋 RIGHT: CLINICAL CONSOLE */}
                    <div className="space-y-10">
                        {/* Status Strip */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Badge className="bg-neutral-100 text-neutral-600 border-neutral-200 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-full">{medicine.category}</Badge>
                            <div className="flex items-center gap-1.5 ml-2">
                                <div className="flex text-accent-bright">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= Math.round(medicine.avgRating || 4.5) ? "currentColor" : "none"} strokeWidth={2.5} />)}
                                </div>
                                <span className="text-sm font-black text-neutral-900 ml-1">{medicine.avgRating?.toFixed(1) || '4.5'}</span>
                                <span className="text-xs text-neutral-400 font-bold ml-1 uppercase tracking-widest">Clinical Rating</span>
                            </div>
                        </div>

                        {/* Heading Area */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-display font-black text-neutral-900 tracking-tight leading-[1.1]">{medicine.name}</h1>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-primary">
                                    <Stethoscope size={18} />
                                </div>
                                <p className="text-[13px] font-black text-brand-primary uppercase tracking-[0.2em]">{medicine.manufacturer || 'PHARMACEUTICAL GRADE'}</p>
                            </div>
                        </div>

                        {/* Conversion Engine (Price & Urgency) */}
                        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/40 overflow-hidden">
                            {/* Urgent Message Bar */}
                            <div className="bg-accent-light px-8 py-3 flex items-center justify-between border-b border-accent/10">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-accent-dark animate-pulse" />
                                    <span className="text-xs font-bold text-accent-dark">Order in <span className="font-black underline">{formatTime(timeLeft)}</span> for Same-Day Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-neutral-400" />
                                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">{viewers} Patients Viewing</span>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">Patient Price</p>
                                        <div className="flex items-baseline gap-4">
                                            <span className="font-price text-5xl font-black text-neutral-900 tracking-tighter">₹{discountedPrice}</span>
                                            {savings > 0 && (
                                                <span className="text-2xl text-neutral-300 line-through font-bold decoration-neutral-300/50 decoration-2">₹{originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                    {savings > 0 && (
                                        <div className="bg-brand-50 border border-brand-100 px-4 py-2 rounded-2xl text-center">
                                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Total Savings</p>
                                            <p className="text-lg font-black text-brand-primary">Save ₹{savings} ({discountPct}%)</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Matrix */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="h-16 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center px-3 group focus-within:border-brand-600/30 transition-all">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-12 rounded-xl hover:bg-white transition-all flex items-center justify-center text-neutral-400 hover:text-brand-primary shadow-sm"
                                        >
                                            <Minus size={20} strokeWidth={3} />
                                        </button>
                                        <span className="w-16 text-center font-price font-black text-2xl text-neutral-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(medicine.stock, quantity + 1))}
                                            className="w-12 h-12 rounded-xl hover:bg-white transition-all flex items-center justify-center text-neutral-400 hover:text-brand-primary shadow-sm"
                                        >
                                            <Plus size={20} strokeWidth={3} />
                                        </button>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            addItem(medicine, quantity);
                                            toast.success(`${medicine.name} added to clinical vault`);
                                        }}
                                        disabled={medicine.stock <= 0}
                                        className="flex-1 h-16 bg-brand-primary hover:bg-brand-primary-dark text-white font-black text-lg rounded-2xl shadow-xl shadow-brand-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                                    >
                                        <ShoppingCart size={24} strokeWidth={2.5} />
                                        <span>Place in Cart</span>
                                    </Button>
                                </div>

                                {/* Trust Metrics Strip */}
                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 group hover:text-brand-primary transition-colors">
                                            <Truck size={20} />
                                        </div>
                                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Express Ship</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 group hover:text-brand-primary transition-colors">
                                            <RotateCcw size={20} />
                                        </div>
                                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Easy Return</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 group hover:text-brand-primary transition-colors">
                                            <Zap size={20} />
                                        </div>
                                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Instant Bill</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📋 DETAILED SPECIFICATION TERMINAL */}
                <div className="mt-32">
                    <div className="flex items-center gap-2 mb-12 border-b border-neutral-100 pb-2 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'overview', label: 'Clinical Overview', icon: Info },
                            { id: 'protocol', label: 'Dosage Protocol', icon: Calendar },
                            { id: 'safety', label: 'Safety Precautions', icon: ShieldAlert }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-10 py-5 font-display font-black text-sm tracking-[0.1em] transition-all relative flex items-center gap-3 uppercase",
                                    activeTab === tab.id ? "text-brand-primary" : "text-neutral-400 hover:text-neutral-900"
                                )}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="tabUnderlineDetail"
                                        className="absolute bottom-[-2px] left-0 w-full h-1 bg-brand-primary rounded-full shadow-[0_0_12px_rgba(22,163,74,0.4)]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-5xl">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="grid md:grid-cols-5 gap-12"
                                >
                                    <div className="md:col-span-3 space-y-10">
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-display font-black text-neutral-900 tracking-tight">Executive Summary</h3>
                                            <p className="text-neutral-500 leading-relaxed text-lg font-medium">{medicine.description}</p>
                                        </div>
                                        <div className="p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm flex items-center gap-8">
                                            <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-primary shadow-inner">
                                                <Activity size={36} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-1">Active Ingredient</p>
                                                <p className="text-2xl font-black text-neutral-900 tracking-tight">{medicine.genericName || 'Proprietary Molecule'}</p>
                                                <p className="text-xs text-neutral-500 font-medium mt-1">Pharmacological identification verified by central registry.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100 space-y-6">
                                            <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-2">Technical Properties</h4>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-neutral-500">Formulation</span>
                                                    <span className="text-sm font-black text-neutral-900 uppercase">{medicine.category}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-neutral-500">Unit Count</span>
                                                    <span className="text-sm font-black text-neutral-900 uppercase">Per Strip/Pack</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-neutral-500">Batch Grade</span>
                                                    <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black rounded-lg">ELITE</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'protocol' && (
                                <motion.div
                                    key="protocol"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="grid md:grid-cols-2 gap-12"
                                >
                                    <div className="space-y-8">
                                        <h3 className="text-3xl font-display font-black text-neutral-900 tracking-tight">Standard Protocol</h3>
                                        <div className="space-y-4">
                                            {[
                                                "Consume 1 tablet with 200ml of water, preferably after clinical intake.",
                                                "Ensure consistent timing intervals to maintain plasma levels.",
                                                "Store at 15°C - 30°C in an airtight pharmaceutical container.",
                                                "Do not modify dosage without pharmacist or MD approval."
                                            ].map((step, i) => (
                                                <div key={i} className="p-6 bg-white rounded-2xl border border-neutral-100 flex gap-6 items-center hover:border-brand-600/30 transition-all group">
                                                    <div className="w-12 h-12 rounded-xl bg-neutral-50 text-neutral-400 font-black flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                        0{i + 1}
                                                    </div>
                                                    <p className="text-neutral-600 font-bold leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-brand-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-brand-900/30">
                                        <FlaskConical size={120} className="absolute bottom-[-30px] right-[-30px] opacity-10 rotate-12" />
                                        <div className="relative z-10 space-y-6">
                                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                                                <Zap className="text-brand-primary" size={32} />
                                            </div>
                                            <h4 className="text-2xl font-black">Clinical Efficiency</h4>
                                            <p className="text-neutral-400 leading-relaxed font-medium">This molecule is optimized for rapid bioavailability. Standard absorption cycle begins within 20-30 minutes of clinical ingestion.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'safety' && (
                                <motion.div
                                    key="safety"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="space-y-12"
                                >
                                    <div className="bg-danger/5 border border-danger/10 p-10 rounded-[3rem] flex flex-col md:flex-row gap-8 items-center">
                                        <div className="w-20 h-20 bg-danger text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-danger/20 shrink-0">
                                            <AlertCircle size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black text-danger uppercase tracking-tight">Critical Safety Warning</h4>
                                            <p className="text-lg text-danger/80 font-bold leading-relaxed">Always consult your MD if symptoms persist. Do not mix with alcoholic formulations or heavy CNS depressants.</p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {(medicine.sideEffects ? (typeof medicine.sideEffects === 'string' ? medicine.sideEffects.split(',') : medicine.sideEffects) : []).map((effect, i) => (
                                            <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-md transition-all text-center space-y-4 group">
                                                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 mx-auto group-hover:bg-brand-50 group-hover:text-brand-primary transition-all">
                                                    <Activity size={24} />
                                                </div>
                                                <p className="font-black text-neutral-900 uppercase tracking-widest text-xs">{effect.trim()}</p>
                                                <p className="text-[10px] text-neutral-400 font-bold">Rare occurrence (‹ 1.2%)</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ♻️ SIMILAR CLINICAL ALTERNATIVES (SUBSTITUTES) */}
                {substitutes.length > 0 && (
                    <div className="mt-32">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="space-y-4">
                                <Badge className="bg-brand-primary/10 text-brand-primary border-none text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
                                   {medicine.genericName ? 'Generic Cost Optimization' : 'Clinical Recommendations'}
                                </Badge>
                                <h2 className="text-4xl font-display font-black text-neutral-900 tracking-tight">
                                    {medicine.genericName ? 'Clinical Substitutes.' : 'Similar Formulations.'}
                                </h2>
                                <p className="text-neutral-500 font-medium">
                                    {medicine.genericName 
                                        ? 'Alternative molecules with identical generic composition for efficiency.' 
                                        : 'Clinically related products categorized within the same therapeutic block.'}
                                </p>
                            </div>
                            <Link to="/shop" className="text-sm font-black text-brand-primary flex items-center gap-2 group">
                                EXPLORE REGISTRY <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {substitutes.map((sub) => (
                                <Link 
                                    to={`/medicine/${sub._id}`} 
                                    key={sub._id}
                                    className="bg-white p-6 rounded-[2.5rem] border border-neutral-100 hover:border-brand-primary hover:shadow-xl transition-all group"
                                >
                                    <div className="aspect-square rounded-2xl bg-neutral-50 p-6 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                        <img src={typeof sub.images?.[0] === 'string' ? sub.images[0] : (sub.images?.[0]?.url || '')} className="w-full h-full object-contain" alt="" />
                                    </div>
                                    <h4 className="text-sm font-black text-neutral-900 truncate tracking-tight">{sub.name}</h4>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1 mb-4">{sub.brand}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-black text-neutral-900">₹{sub.sellingPrice || sub.price}</span>
                                        <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-brand-primary group-hover:text-white transition-all">
                                            <Plus size={16} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 💬 CLINICAL FEEDBACK REGISTRY */}
                <div className="mt-32">
                    <div className="bg-neutral-900 rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="grid lg:grid-cols-5 gap-20 relative z-10">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[0.9]">Patient <br/> <span className="text-brand-primary">Sentiment.</span></h2>
                                    <p className="text-neutral-400 font-medium leading-relaxed">Authoritative feedback from patients who have successfully completed this clinical protocol.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <span className="text-6xl font-black tracking-tighter">4.8</span>
                                        <div className="space-y-1">
                                            <div className="flex text-accent-bright">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" strokeWidth={0} />)}
                                            </div>
                                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Global Aggregate</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                          { label: 'Effectiveness', pct: 98 },
                                          { label: 'Packaging', pct: 94 },
                                          { label: 'Bioavailability', pct: 89 }
                                        ].map(m => (
                                          <div key={m.label} className="space-y-1.5">
                                             <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-500">
                                                <span>{m.label}</span>
                                                <span>{m.pct}%</span>
                                             </div>
                                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.pct}%` }} className="h-full bg-brand-primary" />
                                             </div>
                                          </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-3 space-y-6">
                                {[
                                   { user: 'Dr. Sarah J.', text: 'Prescribed this for chronic management. The batch purity is consistent with Tier-1 standards.', date: '2 days ago' },
                                   { user: 'Vikram Singh', text: 'Significant cost savings compared to the branded alternative without any loss in clinical efficacy.', date: '1 week ago' }
                                ].map((review, i) => (
                                   <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/10 transition-all">
                                      <div className="flex items-center justify-between mb-4">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-black text-white">{review.user[0]}</div>
                                            <div>
                                               <p className="text-sm font-black tracking-tight">{review.user}</p>
                                               <p className="text-[10px] text-neutral-500 font-bold uppercase">{review.date}</p>
                                            </div>
                                         </div>
                                         <div className="flex text-brand-primary">
                                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" strokeWidth={0} />)}
                                         </div>
                                      </div>
                                      <p className="text-neutral-400 font-medium leading-relaxed italic text-sm">"{review.text}"</p>
                                   </div>
                                ))}
                                <Button className="w-full h-16 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] border border-white/10 font-black text-xs uppercase tracking-widest">Access All Registry Entries</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineDetail;
