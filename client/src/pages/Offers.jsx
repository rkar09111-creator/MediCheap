import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Percent, Zap, Clock, ShieldCheck, Gift,
    ChevronRight, ArrowRight, Pill, Check, Copy,
    Star, Crown, Heart, Flame, Ticket, LayoutGrid,
    ShoppingCart, Info, Award, ShoppingBag,
    CircleCheck as CheckCircle, CircleX as XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
        toast.success(`Code ${code} copied!`);
        setTimeout(() => setCopied(false), 2000);
    };

    const isExpiringSoon = expiry.includes('2 days');

    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden relative group"
        >
            {popular && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
                    POPULAR
                </div>
            )}

            <div className="p-6 pb-4">
                <div className={cn(
                    "font-head font-black text-[32px]",
                    discount.includes('%') ? "text-green-400" : "text-amber-400"
                )}>
                    {discount}
                </div>
                <h5 className="font-body font-semibold text-[14px] text-white mt-1">{title}</h5>
                <p className="font-body text-[12px] text-white/50">{minOrder}</p>
            </div>

            <div className="relative h-px border-t border-dashed border-white/20 mx-4" />

            <div className="p-4 px-6 pb-6">
                <div className="bg-black/20 border border-white/10 rounded-md p-3 flex justify-between items-center">
                    <span className="font-num font-bold text-[16px] text-green-400 tracking-widest">{code}</span>
                    <button onClick={handleCopy} className="text-white/40 hover:text-white transition-colors">
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                </div>
                <p className={cn("text-[10px] mt-2", isExpiringSoon ? "text-amber-400" : "text-white/30")}>
                    {isExpiringSoon ? `Expires in ${expiry}` : `Valid until ${expiry}`}
                </p>
            </div>
        </motion.div>
    );
};

// --- Membership Card ---
const MembershipCard = ({ tier, price, features, icon: Icon, color, recommended, delay }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className={cn(
            "rounded-xl p-8 relative overflow-hidden flex flex-col border-2",
            tier === 'FREE' ? "bg-white border-gray-100" :
                tier === 'SILVER' ? "bg-white border-gray-200" :
                    "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"
        )}
    >
        {recommended && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-600 text-white text-[10px] font-bold">
                RECOMMENDED
            </div>
        )}

        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-5", color)}>
            <Icon size={24} className={tier === 'GOLD' ? 'text-amber-600' : 'text-gray-600'} />
        </div>

        <h3 className="font-head font-extrabold text-[24px] text-gray-900">{tier}</h3>
        <p className="font-num font-bold text-[18px] text-gray-500 mt-1 mb-6">{price}</p>

        <div className="flex flex-col gap-3 flex-1 mb-8">
            {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                    {f.included ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-gray-300" />}
                    <span className={cn("font-body text-[14px]", f.included ? "text-gray-700" : "text-gray-400")}>{f.text}</span>
                </div>
            ))}
        </div>

        <Button className={cn(
            "w-full h-12 rounded-md font-head font-bold",
            tier === 'GOLD' ? "bg-amber-600 text-white" : tier === 'SILVER' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        )}>
            {tier === 'FREE' ? 'Active Plan' : 'Choose Plan'}
        </Button>
    </motion.div>
);

const Offers = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [timeLeft, setTimeLeft] = useState({ hrs: '00', min: '00', sec: '00' });
    const [products, setProducts] = useState([]);
    const [floatingProducts, setFloatingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [offersConfig, setOffersConfig] = useState(null);

    // Stats
    const activeDealsCount = useCountUp(248);
    const maxDiscount = useCountUp(40);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medRes, settingRes] = await Promise.all([
                    medicineService.getAll({
                        sort: '-discountPercentage',
                        limit: 4
                    }),
                    settingService.getAll()
                ]);
                setProducts(medRes.data.medicines || []);
                const config = settingRes.data.settings?.offers_config;
                if (config) {
                    setOffersConfig(config);
                    if (config.floatingProducts?.length > 0) {
                        const floatRes = await medicineService.getAll({ ids: config.floatingProducts.join(',') });
                        setFloatingProducts(floatRes.data.medicines || []);
                    }
                }
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

    const categories = ['All', 'Flat 20%', 'Buy 2 Get 1', 'New', 'Expiring', 'Vitamins'];

    const coupons = offersConfig?.coupons || [
        { discount: "20% OFF", title: "First Order", minOrder: "Above ₹499", expiry: "31 May", code: "FIRST20", popular: true },
        { discount: "₹50 OFF", title: "Chronic Care", minOrder: "Above ₹799", expiry: "2 days", code: "CARE50", popular: false },
        { discount: "B2G1", title: "Wellness Pack", minOrder: "Select items", expiry: "30 May", code: "B2G1W", popular: false }
    ];

    const membershipPlans = offersConfig?.membershipPlans || [
        { tier: 'FREE', price: '₹0 / month', features: [{text: 'Standard Discounts', included: true}, {text: 'Order Tracking', included: true}, {text: 'Free Delivery', included: false}, {text: 'Priority Support', included: false}] },
        { tier: 'SILVER', price: '₹99 / month', features: [{text: 'Extra 5% Discount', included: true}, {text: 'Free Delivery', included: true}, {text: 'Priority Support', included: true}, {text: 'Special Coupons', included: false}] },
        { tier: 'GOLD', price: '₹199 / month', features: [{text: 'Extra 10% Discount', included: true}, {text: 'Free Delivery', included: true}, {text: 'Priority Support', included: true}, {text: 'VIP Coupons', included: true}] }
    ];

    const FloatingProductNode = ({ product, index }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, index % 2 === 0 ? -15 : 15, 0],
                rotate: [index % 2 === 0 ? -2 : 2, index % 2 === 0 ? 2 : -2, index % 2 === 0 ? -2 : 2]
            }}
            transition={{ 
                opacity: { duration: 0.8, delay: index * 0.2 },
                y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative group cursor-pointer"
        >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all hover:border-green-500/30 w-40 md:w-48 shadow-2xl">
                <div className="aspect-square bg-white/5 rounded-xl mb-3 overflow-hidden p-3">
                    <img 
                        src={product.images?.[0]?.url || '/med-placeholder.png'} 
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                    />
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-green-400 uppercase tracking-widest">{product.brand}</p>
                    <h4 className="text-[12px] font-bold text-white truncate">{product.name}</h4>
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-black text-white">₹{product.sellingPrice}</span>
                        <div className="bg-green-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={12} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden pt-20">
            <Toaster position="top-right" />

            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10">
                {/* ── HERO SECTION ── */}
                <section className="pt-16 pb-12 px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-400 font-body font-bold text-[12px] uppercase tracking-wider">Flash Sale Active</span>
                    </motion.div>

                    <h1 className="font-head font-extrabold text-[clamp(32px,6vw,64px)] text-white tracking-tight leading-[1.05]">
                        Save Big on <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500">
                            Every Purchase
                        </span>
                    </h1>
                    <p className="text-slate-400 text-[18px] mt-5 mb-10 max-w-[540px] mx-auto">
                        High-quality medicines from verified pharmacies, delivered to your door with exclusive savings.
                    </p>

                    <div className="flex gap-4.5 justify-center overflow-x-auto pb-4 scrollbar-hide px-6">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full font-body text-[14px] font-semibold transition-all whitespace-nowrap",
                                    activeCategory === cat ? "bg-green-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── FLOATING SHOWCASE BOX ── */}
                <section className="max-w-[1200px] mx-auto px-6 pb-20 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* THE BOX / CONTAINER */}
                        <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)] pointer-events-none" />
                            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                            
                            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                                <div className="space-y-6 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mx-auto lg:mx-0">
                                        <Zap size={14} fill="currentColor" /> Premium Curations
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-head font-black text-white leading-tight">
                                        Clinical Excellence <br />
                                        <span className="text-green-400">Floating Showcase</span>
                                    </h2>
                                    <p className="text-slate-400 text-lg max-w-md mx-auto lg:mx-0">
                                        Hand-selected formulations and high-yield wellness nodes. These items are currently in high rotation.
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                                        <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                            <ShieldCheck size={18} className="text-green-400" />
                                            <span className="text-[12px] font-bold">Verified Supply</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                            <Clock size={18} className="text-amber-400" />
                                            <span className="text-[12px] font-bold">Priority Slot</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-[400px] flex items-center justify-center">
                                    {/* The "Box" Visual for products */}
                                    <div className="absolute inset-0 bg-green-500/5 rounded-[2rem] border border-green-500/10 backdrop-blur-sm" />
                                    
                                    <div className="relative w-full h-full">
                                        {floatingProducts.length > 0 ? (
                                            <>
                                                {/* Node 1 - Top Left */}
                                                <div className="absolute top-4 left-4 z-20">
                                                    <FloatingProductNode product={floatingProducts[0]} index={0} />
                                                </div>
                                                {/* Node 2 - Middle Right */}
                                                <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                                                    <FloatingProductNode product={floatingProducts[1]} index={1} />
                                                </div>
                                                {/* Node 3 - Bottom Left */}
                                                <div className="absolute bottom-4 left-10 z-30">
                                                    <FloatingProductNode product={floatingProducts[2]} index={2} />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-4">
                                                <LayoutGrid size={48} className="opacity-20" />
                                                <p className="text-xs font-black uppercase tracking-widest opacity-50">Showcase Nodes Pending...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ── FEATURED DEAL ── */}
                <section className="max-w-[1000px] mx-auto px-6 pb-16">
                    <motion.div
                        variants={fadeScale} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="bg-gradient-to-br from-green-500/20 to-emerald-500/5 border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-[220px] h-[220px] relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                                <img src={products[0]?.images?.[0]?.url || '/med-placeholder.png'} alt="Featured" className="w-full h-full object-contain relative z-10" />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <Badge className="bg-amber-500/20 text-amber-500 border-none mb-4">DEAL OF THE DAY</Badge>
                                <h2 className="font-head font-bold text-[28px] text-white leading-tight">{products[0]?.name || 'Loading Deal...'}</h2>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                    <span className="font-num font-black text-[40px] text-green-400">₹{products[0]?.sellingPrice || '0'}</span>
                                    <span className="font-num text-[20px] text-slate-500 line-through">₹{products[0]?.mrp || '0'}</span>
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-[12px] font-bold">-{products[0]?.discountPercentage || '0'}% OFF</span>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                                    <div className="bg-black/30 border border-white/10 rounded-xl p-3 px-6 flex items-center gap-3">
                                        <Clock size={20} className="text-green-400" />
                                        <div>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold">Ends in</p>
                                            <p className="font-num font-bold text-[20px] text-white tracking-widest">
                                                {timeLeft.hrs}:{timeLeft.min}:{timeLeft.sec}
                                            </p>
                                        </div>
                                    </div>
                                    <Button className="h-14 px-10 bg-white text-slate-950 hover:bg-slate-100 font-head font-bold text-[16px] rounded-xl">
                                        Grab Deal
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ── COUPONS ── */}
                <section className="bg-slate-900/50 py-20 px-6">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h2 className="font-head font-bold text-[32px] text-white">Coupon Codes</h2>
                                <p className="text-slate-500">Apply these at checkout for instant discount</p>
                            </div>
                            <Button variant="ghost" className="text-green-400 hover:text-green-300 p-0">View All <ArrowRight size={16} className="ml-2" /></Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {coupons.map((c, i) => <CouponCard key={i} {...c} />)}
                        </div>
                    </div>
                </section>

                {/* ── PRODUCTS ── */}
                <section className="bg-white rounded-t-[40px] py-20 px-6">
                    <div className="max-w-[1100px] mx-auto">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="font-head font-bold text-[32px] text-slate-900 tracking-tight">Best Price Medicines</h2>
                            <div className="hidden md:flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-full">Sort by: Discount</Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <Skeleton className="aspect-square rounded-2xl" />
                                        <Skeleton className="h-4 w-1/2 rounded-full" />
                                        <Skeleton className="h-6 w-3/4 rounded-full" />
                                        <Skeleton className="h-8 w-full rounded-xl" />
                                    </div>
                                ))
                            ) : products.length > 0 ? (
                                products.map((p, i) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        className="group"
                                    >
                                        <div className="aspect-square bg-slate-50 rounded-2xl p-6 relative overflow-hidden mb-4 border border-slate-100">
                                            <img src={p.images?.[0]?.url || '/med-placeholder.png'} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                {p.discountPercentage}% OFF
                                            </div>
                                        </div>
                                        <p className="text-green-600 font-bold text-[11px] uppercase tracking-widest">{p.brand}</p>
                                        <h4 className="font-body font-semibold text-slate-900 mt-1 line-clamp-1">{p.name}</h4>
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="font-num font-bold text-[20px] text-slate-900">₹{p.sellingPrice}</span>
                                            <span className="font-num text-[14px] text-slate-400 line-through">₹{p.mrp}</span>
                                        </div>
                                        <Button className="w-full mt-4 bg-slate-100 text-slate-900 hover:bg-green-600 hover:text-white border-none shadow-none">Add to Cart</Button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                                    No flash deals active at the moment.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── MEMBERSHIP ── */}
                <section className="bg-slate-50 py-24 px-6">
                    <div className="max-w-[900px] mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-head font-bold text-[36px] text-slate-900 tracking-tight">MediCheap Membership</h2>
                            <p className="text-slate-500 text-[18px] mt-2">Exclusive benefits for regular healthcare needs</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {membershipPlans.map((plan, i) => (
                                <MembershipCard
                                    key={plan.tier}
                                    tier={plan.tier}
                                    price={plan.price}
                                    icon={plan.tier === 'FREE' ? Star : plan.tier === 'SILVER' ? Award : Crown}
                                    color={plan.tier === 'FREE' ? 'bg-slate-100' : plan.tier === 'SILVER' ? 'bg-blue-50' : 'bg-amber-100'}
                                    recommended={plan.tier === 'SILVER'}
                                    delay={i * 0.1}
                                    features={plan.features}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
};

export default Offers;
