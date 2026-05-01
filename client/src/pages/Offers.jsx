import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Percent, Zap, Clock, ShieldCheck, Gift,
    ChevronRight, ArrowRight, Pill, Check, Copy,
    Star, Crown, Heart, Flame, Ticket, LayoutGrid,
    ShoppingCart, Info, Award, ShoppingBag, Plus,
    CircleCheck as CheckCircle, CircleX as XCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Badge, Skeleton, cn } from '../components/ui';
import { medicineService, settingService } from '../services/api';
import { fadeUp, fadeScale, springPop, stagger, slideUp } from '../utils/animations';

// --- Counter Hook for Stats ---
const useCountUp = (end, duration = 1500) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration]);
    return count;
};

// --- Coupon Card Component ---
const CouponCard = ({ discount, title, minOrder, expiry, code, popular }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success(`Code ${code} copied!`, {
            style: { background: '#024F3A', color: '#fff', borderRadius: '12px' }
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className="perforated-edge bg-white rounded-3xl overflow-hidden shadow-premium group relative"
        >
            <div className="p-8 lg:p-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "font-display font-black text-4xl",
                        discount.includes('%') ? "text-brand-600" : "text-amber-600"
                    )}>
                        {discount}
                    </div>
                    {popular && (
                        <div className="bg-brand-50 text-brand-600 text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase">
                            Trending
                        </div>
                    )}
                </div>
                <h5 className="font-display font-bold text-xl text-neutral-900 mb-2">{title}</h5>
                <p className="text-sm text-neutral-400 font-medium">{minOrder}</p>
            </div>

            <div className="px-8 pb-10">
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 flex justify-between items-center group/code hover:border-brand-500/20 transition-all">
                    <span className="font-display font-black text-lg text-brand-600 tracking-widest">{code}</span>
                    <button 
                        onClick={handleCopy} 
                        className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-brand-600 hover:border-brand-500/20 transition-all shadow-sm"
                    >
                        {copied ? <Check size={18} className="text-brand-600" /> : <Copy size={18} />}
                    </button>
                </div>
                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mt-4 flex items-center gap-2">
                    <Clock size={10} /> Valid until {expiry}
                </p>
            </div>

            {/* Perforation visual handled by CSS class .perforated-edge */}
        </motion.div>
    );
};

const Offers = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All');
    const [timeLeft, setTimeLeft] = useState({ hrs: '00', min: '00', sec: '00' });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offersConfig, setOffersConfig] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medRes, settingRes] = await Promise.all([
                    medicineService.getAll({
                        sort: '-discountPercentage',
                        limit: 8
                    }),
                    settingService.getAll()
                ]);
                setProducts(medRes.data.medicines || []);
                const config = settingRes.data.settings?.offers_config;
                if (config) setOffersConfig(config);
            } catch (error) {
                console.error("Failed to fetch deals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const timer = setInterval(() => {
            const now = new Date();
            const hrs = String(23 - now.getHours()).padStart(2, '0');
            const min = String(59 - now.getMinutes()).padStart(2, '0');
            const sec = String(59 - now.getSeconds()).padStart(2, '0');
            setTimeLeft({ hrs, min, sec });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const categories = ['All', 'Flat 20%', 'Buy 2 Get 1', 'Flash Deals', 'Members Only'];

    const coupons = offersConfig?.coupons || [
        { discount: "20% OFF", title: "New Clinical Account", minOrder: "Above ₹499", expiry: "31 May", code: "MED20", popular: true },
        { discount: "₹100 OFF", title: "Chronic Care Pack", minOrder: "Above ₹999", expiry: "2 days", code: "CARE100", popular: false },
        { discount: "FREE SHIP", title: "Express Logistics", minOrder: "Above ₹299", expiry: "30 May", code: "FREESHIP", popular: true }
    ];

    const membershipPlans = [
        { tier: 'CORE', price: '₹0 / year', features: ['Standard Discounts', 'Live Tracking', 'Basic Support'], icon: ShieldCheck, color: 'text-neutral-400' },
        { tier: 'SILVER', price: '₹499 / year', features: ['Extra 5% OFF', 'Priority Support', 'Early Access'], icon: Award, color: 'text-brand-500', recommended: true },
        { tier: 'GOLD', price: '₹999 / year', features: ['Extra 10% OFF', 'VIP Care Desk', 'Zero Delivery Fee'], icon: Crown, color: 'text-amber-500' }
    ];

    return (
        <div className="min-h-screen bg-neutral-950 pt-24 overflow-hidden relative">
            <Toaster position="top-right" />

            {/* ── AMBIENT BACKGROUND ── */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-500/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-brand-600/10 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            </div>

            <div className="relative z-10">
                {/* ── HERO SECTION ── */}
                <section className="pt-20 pb-24 px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-10"
                    >
                        <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                        <span className="text-brand-400 font-display font-black text-[10px] uppercase tracking-[0.3em]">Institutional Liquidation Protocol</span>
                    </motion.div>

                    <h1 className="font-display font-black text-[clamp(40px,10vw,100px)] text-white tracking-tighter leading-[0.9] mb-10">
                        STRATEGIC <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-brand-500">
                            YIELD CAPTURE.
                        </span>
                    </h1>
                    
                    <p className="text-neutral-400 text-lg md:text-xl font-medium mt-5 mb-16 max-w-2xl mx-auto text-balance">
                        Strategic acquisition opportunities on board-certified medical supplies. High-velocity liquidations active for a limited window.
                    </p>

                    {/* Category Filter */}
                    <div className="flex gap-4 justify-center overflow-x-auto pb-4 scrollbar-hide px-6">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-10 py-4 rounded-2xl font-display text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                    activeCategory === cat ? "bg-brand-500 text-white shadow-2xl shadow-brand-500/20" : "bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white border border-white/5"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── FEATURED FLASH DEAL ── */}
                <section className="max-w-7xl mx-auto px-6 pb-32">
                    <motion.div
                        variants={fadeScale} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="bg-gradient-to-br from-brand-500/20 to-neutral-900 border border-white/10 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px] -mr-[250px] -mt-[250px] group-hover:scale-125 transition-transform duration-1000" />
                        
                        <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
                            <div className="w-full lg:w-1/2 relative">
                                <div className="absolute inset-0 bg-brand-500/30 blur-[80px] rounded-full scale-75" />
                                <motion.div 
                                    animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 aspect-square rounded-[3rem] bg-white/5 backdrop-blur-xl border border-white/10 p-16"
                                >
                                    <img src={products[0]?.images?.[0]?.url || '/med-placeholder.png'} alt="Featured" className="w-full h-full object-contain" />
                                </motion.div>
                                
                                {/* Discount Badge */}
                                <div className="absolute top-8 right-8 w-24 h-24 bg-brand-500 rounded-full flex flex-col items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <span className="text-xs font-black text-white/60">SAVE</span>
                                    <span className="text-2xl font-black text-white">{products[0]?.discountPercentage || '25'}%</span>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 text-center lg:text-left">
                                <Badge className="bg-amber-500 text-white border-none mb-6 px-4 py-2 font-black text-[10px] tracking-[0.2em] uppercase">High Priority Acquisition</Badge>
                                <h2 className="font-display font-black text-5xl lg:text-7xl text-white tracking-tighter leading-[1] mb-8">{products[0]?.name || 'Loading Deal...'}</h2>
                                
                                <div className="flex items-center justify-center lg:justify-start gap-8 mb-12">
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Acquisition Price</p>
                                        <span className="font-display font-black text-6xl text-brand-400">₹{products[0]?.sellingPrice || '0'}</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1.5">Standard MRP</p>
                                        <span className="font-display font-black text-3xl text-neutral-600 line-through">₹{products[0]?.mrp || '0'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 px-8 flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400"><Clock size={24} /></div>
                                        <div className="text-left">
                                            <p className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1">Terminal Closure</p>
                                            <p className="font-display font-black text-2xl text-white tracking-widest">
                                                {timeLeft.hrs}:{timeLeft.min}:{timeLeft.sec}
                                            </p>
                                        </div>
                                    </div>
                                    <Button onClick={() => navigate(`/medicine/${products[0]?._id}`)} className="h-20 px-16 bg-white text-neutral-900 hover:bg-brand-500 hover:text-white font-display font-black text-lg rounded-2xl transition-all shadow-2xl active:scale-95">
                                        Secure Deal
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ── SCROLLING TICKER ── */}
                <div className="bg-brand-600 py-6 overflow-hidden border-y border-white/10 mb-32">
                    <div className="flex whitespace-nowrap animate-marquee">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex items-center gap-12 px-12">
                                <span className="text-white font-display font-black text-2xl uppercase tracking-tighter flex items-center gap-4">
                                    <Zap size={24} fill="white" className="animate-pulse" /> LIQUIDATION EVENT ACTIVE
                                </span>
                                <span className="text-brand-200 font-display font-bold text-2xl opacity-50">•</span>
                                <span className="text-white font-display font-black text-2xl uppercase tracking-tighter">NODE-WIDE SAVINGS TRIGGERED</span>
                                <span className="text-brand-200 font-display font-bold text-2xl opacity-50">•</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── COUPON GRID ── */}
                <section className="max-w-6xl mx-auto px-6 pb-40">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                        <div>
                            <h2 className="font-display font-black text-4xl text-white mb-4 tracking-tight uppercase">Decryption Codes</h2>
                            <p className="text-neutral-500 font-medium text-lg">Input these authorization protocols at the settlement terminal.</p>
                        </div>
                        <Button variant="ghost" className="text-brand-500 hover:text-brand-400 font-black text-[11px] uppercase tracking-widest p-0">
                            Protocol Ledger <ArrowRight size={16} className="ml-3" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {coupons.map((c, i) => <CouponCard key={i} {...c} />)}
                    </div>
                </section>

                {/* ── HIGH YIELD GRID ── */}
                <section className="bg-white rounded-t-[5rem] py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-20">
                            <div className="text-center md:text-left">
                                <h2 className="font-display font-black text-5xl text-neutral-900 tracking-tight mb-4">High Yield Formulations</h2>
                                <p className="text-neutral-400 text-lg font-medium">Acquisition nodes with maximum liquidation value.</p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="rounded-2xl h-14 px-8 border-neutral-200 font-black text-[10px] uppercase tracking-widest">Sort: Liquidity</Button>
                                <Button className="btn-primary h-14 px-10 text-[10px] font-black uppercase tracking-widest">Explore All</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {loading ? (
                                [...Array(8)].map((_, i) => (
                                    <div key={i} className="space-y-6">
                                        <Skeleton className="aspect-square rounded-[2rem]" />
                                        <Skeleton className="h-4 w-1/2 rounded-full" />
                                        <Skeleton className="h-10 w-full rounded-2xl" />
                                    </div>
                                ))
                            ) : products.length > 0 ? (
                                products.map((p, i) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        className="group cursor-pointer"
                                        onClick={() => navigate(`/medicine/${p._id}`)}
                                    >
                                        <div className="aspect-square bg-neutral-50 rounded-[2.5rem] p-10 relative overflow-hidden mb-6 border border-neutral-100 shadow-sm transition-all group-hover:shadow-premium group-hover:border-brand-500/10">
                                            <img src={p.images?.[0]?.url || '/med-placeholder.png'} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg rotate-[-4deg]">
                                                {p.discountPercentage}% OFF
                                            </div>
                                        </div>
                                        <p className="text-brand-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1.5 ml-1">{p.brand}</p>
                                        <h4 className="font-display font-black text-xl text-neutral-900 px-1 line-clamp-1 group-hover:text-brand-600 transition-colors">{p.name}</h4>
                                        <div className="flex items-baseline gap-4 mt-3 px-1">
                                            <span className="font-display font-black text-2xl text-neutral-900">₹{p.sellingPrice}</span>
                                            <span className="font-display font-bold text-sm text-neutral-400 line-through">₹{p.mrp}</span>
                                        </div>
                                        <Button className="w-full mt-6 h-14 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            Quick Acquisition
                                        </Button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-32 text-center text-neutral-300 font-display font-black uppercase tracking-[0.3em]">
                                    No liquidation nodes currently active.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── MEMBERSHIP PROTOCOL ── */}
                <section className="bg-neutral-50 py-40 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-24">
                            <Badge className="bg-brand-50 text-brand-600 border-none px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.3em] mb-6">Tiered Access</Badge>
                            <h2 className="font-display font-black text-5xl text-neutral-900 tracking-tight mb-4">Membership Registry</h2>
                            <p className="text-neutral-500 text-lg font-medium max-w-xl mx-auto">Elevate your clinical acquisition status for maximum yield and zero logistics friction.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {membershipPlans.map((plan, i) => (
                                <motion.div
                                    key={plan.tier}
                                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    className={cn(
                                        "rounded-[3rem] p-12 relative overflow-hidden flex flex-col border transition-all duration-500",
                                        plan.recommended ? "bg-white border-brand-500/20 shadow-premium scale-105 z-10" : "bg-white/50 border-neutral-100 hover:bg-white hover:border-brand-500/10"
                                    )}
                                >
                                    {plan.recommended && (
                                        <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-brand-600 text-white text-[9px] font-black tracking-widest uppercase">
                                            Strategic Choice
                                        </div>
                                    )}

                                    <div className={cn("w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mb-10 shadow-inner", plan.color)}>
                                        <plan.icon size={32} strokeWidth={1.5} />
                                    </div>

                                    <h3 className="font-display font-black text-3xl text-neutral-900 mb-2">{plan.tier}</h3>
                                    <p className="font-display font-black text-lg text-neutral-400 mb-10">{plan.price}</p>

                                    <div className="space-y-5 mb-12 flex-1">
                                        {plan.features.map((f, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <CheckCircle size={18} className="text-brand-500" />
                                                <span className="text-sm font-bold text-neutral-600">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button className={cn(
                                        "w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95",
                                        plan.recommended ? "bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20" : "bg-neutral-100 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                                    )}>
                                        {plan.tier === 'CORE' ? 'Current Plan' : 'Select Protocol'}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    display: flex;
                    width: fit-content;
                    animation: marquee 40s linear infinite;
                }
            `}} />
        </div>
    );
};

export default Offers;
