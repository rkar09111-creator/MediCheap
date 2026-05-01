import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Percent, Zap, Clock, ShieldCheck, Gift,
    ChevronRight, ArrowRight, Pill, Check, Copy,
    Star, Crown, Heart, Flame, Ticket, LayoutGrid,
    ShoppingCart, Info, Award, ShoppingBag, Plus,
    CircleCheck as CheckCircle, CircleX as XCircle,
    Sparkles, Gem, BadgeCheck, Coffee,
    Smartphone, Headphones, Truck, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Badge, Skeleton, cn } from '../components/ui';
import { medicineService } from '../services/api';
import { fadeUp, fadeScale, stagger } from '../utils/animations';

// ─── Coupon Ticket Component ──────────────────────────────────────────────
const CouponTicket = ({ discount, title, minOrder, expiry, code, popular }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success(`Code ${code} Copied`, {
            icon: <BadgeCheck className="text-[#16A34A]" />,
            style: { borderRadius: '14px', background: '#050E17', color: '#fff', fontWeight: 'bold' }
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="relative bg-white rounded-[22px] shadow-[0_1px_4px_rgba(5,14,23,0.06)] border border-[#E4ECF2] overflow-hidden group"
        >
            {/* Perforation line */}
            <div className="absolute top-[60%] left-0 right-0 h-[1px] border-t-2 border-dashed border-[#F4F8FA] z-10" />
            <div className="absolute top-[60%] -left-[10px] w-5 h-5 bg-[#F8FAFB] rounded-full -translate-y-1/2 border border-[#E4ECF2] z-20" />
            <div className="absolute top-[60%] -right-[10px] w-5 h-5 bg-[#F8FAFB] rounded-full -translate-y-1/2 border border-[#E4ECF2] z-20" />

            <div className="p-6 pb-12">
                <div className="flex justify-between items-start mb-5">
                    <div className="space-y-0.5">
                        <span className="font-body font-bold text-[10px] text-[#00C853] uppercase tracking-[0.15em]">Flash Protocol</span>
                        <h4 className="font-num font-extrabold text-[32px] text-[#050E17] tracking-tight">{discount}</h4>
                    </div>
                    {popular && (
                        <div className="bg-[#E5FFF2] text-[#00C853] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#85FFC1]">
                            MOST USED
                        </div>
                    )}
                </div>
                <h5 className="font-display font-bold text-[15px] text-[#0D1B2A] mb-1">{title}</h5>
                <p className="font-body font-medium text-[11px] text-[#6B849D] uppercase tracking-wide">{minOrder}</p>
            </div>

            <div className="p-6 pt-12 bg-[#FAFCFD]">
                <div className="flex items-center gap-2.5">
                    <div className="flex-1 bg-white border border-[#E4ECF2] rounded-[12px] px-4 py-3 flex items-center justify-between shadow-sm group/code hover:border-[#00C853]/30 transition-all">
                        <span className="font-num font-extrabold text-[17px] text-[#050E17] tracking-[0.15em]">{code}</span>
                        <button 
                            onClick={handleCopy}
                            className="p-1.5 rounded-md hover:bg-[#F4F8FA] text-[#96ADBF] hover:text-[#00C853] transition-colors"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 font-body font-bold text-[9px] text-[#96ADBF] uppercase tracking-wider">
                    <Clock size={11} /> VALID UNTIL {expiry}
                </div>
            </div>
        </motion.div>
    );
};

const Offers = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ hrs: '24', min: '00', sec: '00' });

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const { data } = await medicineService.getAll({ sort: '-discountPercentage', limit: 4 });
                setProducts(data.medicines || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();

        const timer = setInterval(() => {
            const now = new Date();
            setTimeLeft({
                hrs: String(23 - now.getHours()).padStart(2, '0'),
                min: String(59 - now.getMinutes()).padStart(2, '0'),
                sec: String(59 - now.getSeconds()).padStart(2, '0')
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const coupons = [
        { discount: "20% OFF", title: "Patient Welcome", minOrder: "Above ₹499", expiry: "31 MAY", code: "MCNEW20", popular: true },
        { discount: "₹150 OFF", title: "Chronic Care", minOrder: "Above ₹1299", expiry: "2 DAYS", code: "CARE150", popular: false },
        { discount: "FREE SHIP", title: "Priority Logistics", minOrder: "Above ₹399", expiry: "30 MAY", code: "FASTDEL", popular: true }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Toaster position="top-center" />
            
            {/* ── HERO SECTION: INSTITUTIONAL HUB ── */}
            <section className="relative pt-[110px] pb-[100px] px-6 overflow-hidden bg-neutral-950">
                {/* Advanced Gradient Mesh */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                
                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center">
                        <motion.div 
                            initial={{ x: -30, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }} 
                            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                            className="space-y-10"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                                <Sparkles size={16} className="text-brand-primary animate-pulse" />
                                <span className="font-body font-black text-[11px] text-brand-primary uppercase tracking-[0.25em]">Clinical Privileges Active</span>
                            </div>
                            
                            <h1 className="font-display font-black text-[clamp(48px,8vw,96px)] leading-[0.85] text-white tracking-[-0.06em] uppercase">
                                Exclusive <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-emerald-400">Benefits.</span>
                            </h1>
                            
                            <p className="font-body font-medium text-[20px] text-neutral-400 max-w-xl leading-[1.6]">
                                Deploying specialized pricing protocols for our medical community. Access institutional-grade savings on all verified formulations.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {['Flash Supply', 'Global Registry', 'Priority Node'].map((tag) => (
                                    <div key={tag} className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 font-body font-bold text-[12px] text-neutral-500 uppercase tracking-widest hover:border-brand-primary/50 hover:text-white transition-all cursor-default">
                                        {tag}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 flex flex-wrap gap-6 items-center">
                                <Button size="xl" fullRadius className="px-12 h-16 text-[16px] shimmer-sweep shadow-2xl shadow-brand-primary/20">
                                    Initialize All Savings
                                </Button>
                                <div className="flex items-center gap-4 px-8 py-4 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-md">
                                    <Clock size={20} className="text-amber-400" />
                                    <div className="flex flex-col">
                                        <span className="font-body font-black text-[10px] text-neutral-500 uppercase tracking-[0.2em] leading-tight">Cycle Reset</span>
                                        <span className="font-num font-black text-[22px] text-white tracking-widest">{timeLeft.hrs}:{timeLeft.min}:{timeLeft.sec}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* HERO VISUAL: FLOATING CARDS */}
                        <div className="hidden lg:grid grid-cols-2 gap-6 relative">
                            <div className="absolute inset-0 bg-brand-primary/5 blur-[100px] rounded-full" />
                            {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-[32px] bg-white/5" />) :
                                products.map((p, i) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: 0.2 + (i * 0.1), duration: 0.8 }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        className="aspect-square bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 relative group cursor-pointer overflow-hidden shadow-2xl"
                                        onClick={() => navigate(`/medicine/${p._id}`)}
                                    >
                                        <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img src={p.images?.[0]?.url || '/med-placeholder.png'} className="w-full h-full object-contain relative z-10" alt="" />
                                        <div className="absolute top-6 right-6 bg-brand-primary text-neutral-950 text-[10px] font-black px-3 py-1.5 rounded-full z-20 shadow-lg">
                                            -{p.discountPercentage}%
                                        </div>
                                        <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all z-20">
                                            <div className="bg-white rounded-full py-2.5 px-4 flex items-center justify-between shadow-2xl">
                                                <span className="font-body font-black text-[11px] text-neutral-950 uppercase truncate">{p.name}</span>
                                                <ArrowUpRight size={14} className="text-brand-primary" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>

            {/* ── COUPON GRID: TICKET UI ── */}
            <section className="container-custom px-6 -mt-[60px] relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {coupons.map((c, i) => <CouponTicket key={i} {...c} />)}
                </div>
            </section>

            {/* ── FLASH REWARDS: PREMIUM BENTO ── */}
            <section className="container-custom px-6 mt-[120px] mb-[120px]">
                <div className="bg-neutral-50 rounded-[48px] border border-neutral-200 p-12 lg:p-24 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-brand-primary/10 transition-colors duration-1000" />
                    
                    <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
                        <div className="w-full lg:w-1/2 space-y-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
                                <Flame size={14} className="text-brand-primary" />
                                <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Priority Access</span>
                            </div>
                            
                            <h2 className="font-display font-black text-[56px] lg:text-[72px] text-neutral-950 leading-[0.9] tracking-[-0.05em] uppercase">
                                Real-Time <br/><span className="text-brand-primary">Supply Deals.</span>
                            </h2>
                            
                            <p className="font-body font-medium text-[18px] text-neutral-500 leading-[1.6] max-w-lg">
                                Optimized for chronic care requirements. These verified formulations feature our highest subsidy rates this quarter.
                            </p>
                            
                            <div className="flex items-center gap-5 pt-6">
                                <Button size="xl" fullRadius className="px-12 h-16 shadow-xl">Explore Supply Node</Button>
                                <Button variant="secondary" size="xl" fullRadius className="w-16 h-16 p-0 flex items-center justify-center border-neutral-200"><LayoutGrid size={24} /></Button>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
                            {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-[32px] bg-white" />) :
                                products.map((p, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white border border-neutral-200 rounded-[32px] p-8 group cursor-pointer shadow-sm hover:shadow-xl hover:border-brand-primary/30 transition-all"
                                    >
                                        <div className="aspect-square mb-6 flex items-center justify-center">
                                            <img src={p.images?.[0]?.url || '/med-placeholder.png'} className="max-w-full max-h-full object-contain" alt="" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-body font-black text-[14px] text-neutral-900 truncate uppercase tracking-tight">{p.name}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-num font-black text-[20px] text-neutral-950">₹{p.discountPrice}</p>
                                                <Badge variant="success" className="h-6 px-2.5 bg-brand-primary/10 text-brand-primary border-none text-[10px] font-black">-{p.discountPercentage}%</Badge>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MEMBERSHIP TIERS: FLOATING PANEL ── */}
            <section className="bg-neutral-950 py-[140px] px-6">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto space-y-6 mb-[100px]">
                        <h2 className="font-display font-black text-[56px] text-white tracking-[-0.04em] uppercase">Membership Protocol</h2>
                        <p className="font-body font-medium text-[18px] text-neutral-500 leading-relaxed">
                            Upgrade your health registry status to unlock automated refills, priority logistics, and clinical desk support.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
                        {[
                            { name: 'Standard', price: '₹0', icon: Coffee, benefits: ['Standard Rewards', 'Email Support', 'Monthly Logs'], color: 'neutral' },
                            { name: 'Priority', price: '₹499', icon: Gem, benefits: ['Extra 5% Rewards', 'Priority Dispatch', 'Expert Health Desk', 'Zero Node Fee'], color: 'green', recommended: true },
                            { name: 'Elite', price: '₹1299', icon: Crown, benefits: ['Extra 10% Rewards', 'Unlimited Priority Log', 'VIP Health Manager', 'Home Sample Collection'], color: 'gold' }
                        ].map((tier, i) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "rounded-[40px] p-12 border flex flex-col relative transition-all duration-500",
                                    tier.recommended 
                                        ? "bg-white border-brand-primary shadow-[0_40px_80px_rgba(0,200,83,0.15)] scale-[1.05] z-10" 
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                )}
                            >
                                {tier.recommended && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-primary text-neutral-950 font-body font-black text-[10px] px-6 py-2 rounded-full uppercase tracking-[0.25em] shadow-xl">Most Verified</div>
                                )}
                                
                                <div className={cn(
                                    "w-[64px] h-[64px] rounded-[20px] flex items-center justify-center mb-10 shadow-lg",
                                    tier.color === 'green' ? "bg-brand-primary/10 text-brand-primary" : tier.color === 'gold' ? "bg-amber-500/10 text-amber-500" : "bg-white/10 text-white"
                                )}>
                                    <tier.icon size={32} />
                                </div>

                                <h3 className={cn("font-display font-black text-[28px] mb-2 uppercase tracking-tight", tier.recommended ? "text-neutral-950" : "text-white")}>{tier.name}</h3>
                                <div className="flex items-baseline gap-2 mb-10">
                                    <span className={cn("font-num font-black text-[42px]", tier.recommended ? "text-neutral-950" : "text-white")}>{tier.price}</span>
                                    <span className="font-body font-bold text-[11px] text-neutral-500 uppercase tracking-widest">/ Cycle</span>
                                </div>
                                
                                <div className="space-y-5 mb-12 flex-1">
                                    {tier.benefits.map((b) => (
                                        <div key={b} className="flex items-center gap-4">
                                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", tier.recommended ? "bg-brand-primary/10 text-brand-primary" : "bg-white/10 text-brand-primary")}>
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                            <span className={cn("font-body font-bold text-[14px]", tier.recommended ? "text-neutral-700" : "text-neutral-400")}>{b}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button size="xl" fullRadius className={cn(
                                    "w-full h-16 font-display font-black text-[16px] uppercase tracking-widest",
                                    !tier.recommended && "bg-white/10 hover:bg-white/20 border-white/10 text-white"
                                )}>
                                    {tier.recommended ? 'Authorize Priority' : 'Start Protocol'}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TRUST NODES ── */}
            <section className="bg-white py-[120px] px-6">
                <div className="container-custom grid md:grid-cols-3 gap-16">
                    {[
                        { title: 'Global Logistics', desc: 'Orders move through our cold-chain supply nodes within minutes of verification.', icon: Truck },
                        { title: 'AES-256 Secure', desc: 'Your health registry and Rx data are encrypted using military-grade protocols.', icon: ShieldCheck },
                        { title: 'Clinical Desk', desc: '24/7 direct uplink to our licensed pharmacist network for dosage guidance.', icon: Headphones }
                    ].map((item) => (
                        <div key={item.title} className="space-y-6 text-center md:text-left group">
                            <div className="w-[64px] h-[64px] rounded-[22px] bg-neutral-50 border border-neutral-100 flex items-center justify-center text-brand-primary shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                                <item.icon size={28} />
                            </div>
                            <h4 className="font-display font-black text-[20px] text-neutral-950 uppercase tracking-tight">{item.title}</h4>
                            <p className="font-body font-medium text-[16px] text-neutral-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Offers;
