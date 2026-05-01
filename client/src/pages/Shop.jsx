import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
    Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight,
    X, Pill, Leaf, Droplets, Sun, Activity, ShoppingBag, Clock, RotateCcw, 
    ShieldCheck, BadgeCheck, Zap, Lock, Star, Truck, LayoutGrid, List, 
    Heart, FileText, Store, Building2, Salad, Stethoscope, Dumbbell, Sparkles, 
    Check, Headphones, Award, Tag, ArrowUpDown, Plus, Minus, SearchX, Eye, Bell,
    Loader2, Baby, Trash2
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { medicineService, categoryService } from '../services/api';
import toast from 'react-hot-toast';
import { fadeUp, stagger, springScale, collapseAnim, filterChipAnim, autocompleteAnim, drawerAnim, backdropAnim } from '../animations/shopAnimations';
import './Shop.css';

// ━━━ TOAST CONFIG ━━━
const notify = {
    success: (msg) => toast.success(msg, {
        style: { background: 'white', border: '1px solid var(--gray-200)', borderRadius: '14px', padding: '12px 16px', fontSize: '13px', fontFamily: 'Inter', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
        iconTheme: { primary: 'var(--green-600)', secondary: 'white' }
    }),
    error: (msg) => toast.error(msg, {
        style: { background: 'white', border: '1px solid var(--gray-200)', borderRadius: '14px', padding: '12px 16px', fontSize: '13px', fontFamily: 'Inter', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
    }),
    info: (msg) => toast(msg, {
        icon: 'ℹ️', style: { background: 'white', border: '1px solid var(--gray-200)', borderRadius: '14px', padding: '12px 16px', fontSize: '13px', fontFamily: 'Inter', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
    })
};

// ━━━ STATIC DATA ━━━
const TRUST_ITEMS = [
    { icon: ShieldCheck, title: "Licensed", sub: "Govt. Drug Lic." },
    { icon: BadgeCheck, title: "100% Genuine", sub: "Source verified" },
    { icon: Zap, title: "Same Day", sub: "Before 6 PM" },
    { icon: Lock, title: "Secure Pay", sub: "SSL encrypted" },
    { icon: Headphones, title: "Expert Support", sub: "Free consultation" }
];

const SPOTLIGHTS = [
    { id: 'diabetes', name: 'Diabetes Care', sub: 'Complete Diabetes Management', bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', icon: Activity, accent: '#2563EB' },
    { id: 'cardiac', name: 'Cardiac Care', sub: 'Heart Health Essentials', bg: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)', icon: Heart, accent: '#DC2626' },
    { id: 'mother-baby', name: 'Mother & Baby', sub: 'Everything for Mom & Baby', bg: 'linear-gradient(135deg,#FAF5FF,#EDE9FE)', icon: Baby, accent: '#9333EA' },
    { id: 'wellness', name: 'Wellness & Fitness', sub: 'Fitness & Active Lifestyle', bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', icon: Dumbbell, accent: '#024F3A' },
    { id: 'vitamins', name: 'Vitamins & Supplements', sub: 'Daily Nutrition Essentials', bg: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', icon: Sun, accent: '#F59E0B' },
    { id: 'skincare', name: 'Skincare', sub: 'Dermatologist Tested', bg: 'linear-gradient(135deg,#F0FDFA,#CCFBF1)', icon: Sparkles, accent: '#0D9488' }
];

// ━━━ SUB-COMPONENTS ━━━

const AnimatedCounter = ({ value, label }) => {
    const [count, setCount] = useState(0);
    const target = parseInt(value.replace(/,/g, '').replace('+', '')) || 0;
    
    useEffect(() => {
        let start = null;
        const duration = 1500;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }, [target]);

    return (
        <div className="banner-stat-card">
            <div className="font-mono text-[22px] font-bold text-white leading-none mb-1">
                {count.toLocaleString()}{value.includes('+') ? '+' : ''}{value.includes('★') ? ' ★' : ''}
            </div>
            <div className="font-body text-[11px] text-white/50">{label}</div>
        </div>
    );
};

// Custom Checkbox
const CustomCheckbox = ({ checked, onChange, label, count }) => (
    <label className="custom-checkbox">
        <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
        <div className="checkbox-box">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="checkbox-icon">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <span className="font-body text-[13px] text-[var(--gray-700)] flex-1">{label}</span>
        {count !== undefined && <span className="font-body text-[11px] text-[var(--gray-400)]">({count})</span>}
    </label>
);

// Toggle Switch
const CustomToggle = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between py-2 cursor-pointer" onClick={onChange}>
        <span className="font-body text-[13px] text-[var(--gray-700)]">{label}</span>
        <div className={`w-10 h-[22px] rounded-full p-[2px] transition-colors duration-200 ease-in-out ${checked ? 'bg-[var(--green-600)]' : 'bg-[var(--gray-200)]'}`}>
            <motion.div transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-[18px] h-[18px] bg-white rounded-full shadow-sm" style={{ x: checked ? 18 : 0 }} />
        </div>
    </div>
);

// Price Dual Slider
const PriceSlider = ({ min, max, value, onChange }) => {
    // simplified single slider for now for perfect UI matching
    return (
        <div className="pt-2 pb-4">
            <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[10px] text-[var(--gray-400)] uppercase tracking-widest">Max Price</span>
                <span className="font-mono text-[14px] font-bold text-[var(--gray-900)]">₹{value}</span>
            </div>
            <div className="relative h-1 bg-[var(--gray-200)] rounded-full">
                <div className="absolute h-full bg-gradient-to-r from-[var(--green-500)] to-[var(--green-600)] rounded-full" style={{ width: `${(value/5000)*100}%` }} />
                <input type="range" min="0" max="5000" step="100" value={value} onChange={e => onChange(parseInt(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[var(--green-600)] rounded-full shadow-sm pointer-events-none" style={{ left: `${(value/5000)*100}%`, transform: 'translate(-50%, -50%)' }} />
            </div>
            <div className="flex gap-2 mt-4">
                <input type="number" value={0} readOnly className="w-full h-[34px] border border-[var(--gray-200)] rounded-md px-2 text-right font-mono text-[13px]" />
                <div className="text-[var(--gray-300)] flex items-center">–</div>
                <input type="number" value={value} onChange={e=>onChange(parseInt(e.target.value))} className="w-full h-[34px] border border-[var(--gray-200)] rounded-md px-2 text-right font-mono text-[13px]" />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
                {[100, 500, 1000, 5000].map(p => (
                    <button key={p} onClick={() => onChange(p)} className="px-2 py-1 text-[11px] font-body bg-[var(--gray-50)] hover:bg-[var(--green-50)] text-[var(--gray-600)] hover:text-[var(--green-700)] rounded border border-[var(--gray-200)] transition-colors">≤ ₹{p}</button>
                ))}
            </div>
        </div>
    );
};

// ━━━ PRODUCT CARD ━━━
const ProductCard = ({ product, viewMode }) => {
    const navigate = useNavigate();
    const { addItem, items, updateQty, removeItem } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    const cartItem = items.find(i => i.medicine === product?._id);
    const quantity = cartItem?.quantity || 0;
    
    if (!product) return null;

    const discount = product.discountPercentage || Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) || 0;
    const savings = product.mrp - product.sellingPrice;
    const imgUrl = typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url || 'https://via.placeholder.com/300');

    const handleAdd = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (product.requiresPrescription) {
            notify.error("Prescription needed. Upload Rx first.");
            navigate('/upload-prescription');
            return;
        }
        setIsAdding(true);
        setTimeout(() => {
            addItem(product, 1);
            setIsAdding(false);
            notify.success("Added to cart!");
        }, 300);
    };

    const handleQty = (e, delta) => {
        e.preventDefault(); e.stopPropagation();
        const newQty = quantity + delta;
        if (newQty <= 0) {
            removeItem(product._id);
        } else {
            updateQty(product._id, newQty);
        }
    };

    const toggleWishlist = (e) => {
        e.preventDefault(); e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        if(!isWishlisted) notify.success("Saved to wishlist");
        else notify.info("Removed from wishlist");
        // implement API call here
    };

    if (viewMode === 'list') {
        return (
            <motion.div variants={fadeUp} className="bg-white border border-[var(--gray-200)] rounded-[var(--r-xl)] p-4 flex gap-4 items-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 hover:border-[var(--green-200)] transition-all duration-260 ease-[var(--ease)] cursor-pointer group" onClick={() => navigate(`/medicine/${product._id}`)}>
                <div className="w-[130px] h-[130px] rounded-[var(--r-lg)] bg-[var(--gray-50)] p-2.5 flex-shrink-0 relative overflow-hidden">
                    <img src={imgUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-body text-[11px] font-semibold text-[var(--green-700)] uppercase tracking-widest mb-1 truncate">{product.brand}</p>
                    <h3 className="font-display text-[15px] font-black text-[var(--gray-900)] leading-snug mb-2 line-clamp-2 uppercase tracking-tight">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center"><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><Star size={12} className="text-[var(--gray-200)] fill-[var(--gray-200)]" /></div>
                        <span className="font-body text-[12px] font-semibold text-[var(--gray-700)]">4.8</span>
                    </div>
                </div>
                <div className="w-[160px] flex-shrink-0 text-right space-y-3">
                    <div>
                        <div className="font-mono text-[22px] font-extrabold text-[var(--gray-900)]">₹{product.sellingPrice}</div>
                        {discount > 0 && <div className="font-mono text-[13px] text-[var(--gray-400)] line-through">₹{product.mrp}</div>}
                    </div>
                    {/* Add Button logic... (same as grid, simplified for list) */}
                    <button onClick={handleAdd} className="w-full h-[36px] bg-gradient-to-br from-[var(--green-600)] to-[var(--green-700)] text-white font-body font-semibold text-[12px] rounded-[var(--r-sm)] shadow-[0_2px_10px_rgba(5, 150, 105, 0.25)] hover:-translate-y-px transition-all">Add to Cart</button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div variants={fadeUp} className="product-card" onClick={() => navigate(`/medicine/${product._id}`)}>
            <div className="product-card-img-area">
                <img src={imgUrl} alt={product.name} />
                
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
                    {discount > 0 && (
                        <div className="bg-brand-primary text-white font-body font-black text-[9px] uppercase px-2 py-[3.5px] rounded-lg shadow-lg shadow-brand-primary/20 tracking-widest">- {discount}% OFF</div>
                    )}
                    <div className="flex gap-1">
                        {product.regulatoryCategory === 'POM' ? (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 font-body font-black text-[9px] uppercase px-2 py-[2.5px] rounded-md backdrop-blur-md">Rx</div>
                        ) : (
                            <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-body font-black text-[9px] uppercase px-2 py-[2.5px] rounded-md backdrop-blur-md">OTC</div>
                        )}
                        <div className="bg-neutral-900/10 border border-neutral-900/10 text-neutral-900 font-body font-black text-[9px] uppercase px-2 py-[2.5px] rounded-md backdrop-blur-md flex items-center gap-1">
                            <ShieldCheck size={10} strokeWidth={2.5} />
                            Verified
                        </div>
                    </div>
                </div>

                <motion.button whileTap={{ scale: 1.35 }} onClick={toggleWishlist} className="product-wishlist-btn">
                    <Heart size={16} className={isWishlisted ? 'text-[var(--red-500)] fill-[var(--red-500)]' : 'text-[var(--gray-300)]'} />
                </motion.button>

                <div className="absolute bottom-2 left-2 bg-[rgba(15,23,42,0.7)] backdrop-blur-md rounded-[var(--r-sm)] px-2.5 py-[3px] flex items-center gap-1.5 z-10">
                    <Truck size={10} className="text-white" />
                    <span className="font-body font-medium text-[10px] text-white">Today by 6 PM</span>
                </div>
            </div>

            <div className="product-card-content">
                <p className="font-body text-[11px] font-semibold text-[var(--green-700)] uppercase tracking-widest mb-1 truncate">{product.brand || 'MediCheap'}</p>
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-[15px] font-black text-neutral-900 leading-[1.3] line-clamp-2 min-h-[38px] uppercase tracking-tight group-hover:text-brand-primary transition-colors">{product.name}</h3>
                    {product.isPremium && <Sparkles size={14} className="text-amber-500 shrink-0 animate-pulse" />}
                </div>
                
                <div className="flex items-center gap-[6px] mb-2">
                    <div className="flex items-center">
                        <Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" /><Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                    </div>
                    <span className="font-body text-[12px] font-semibold text-[var(--gray-700)]">4.8</span>
                    <span className="font-body text-[11px] text-[var(--gray-400)]">(120)</span>
                </div>

                <div className="flex items-baseline flex-wrap gap-[7px] mb-3">
                    <span className="font-mono text-[19px] font-extrabold text-[var(--gray-900)]">₹{product.sellingPrice}</span>
                    {discount > 0 && <span className="font-mono text-[13px] text-[var(--gray-400)] line-through">₹{product.mrp}</span>}
                    {savings > 10 && <span className="bg-[var(--green-100)] text-[var(--green-700)] font-body font-bold text-[10px] px-[7px] py-[2px] rounded-full">Save ₹{savings}</span>}
                </div>

                {product.stock <= 0 ? (
                    <div className="mt-auto">
                        <button disabled className="w-full h-[39px] bg-[var(--gray-100)] text-[var(--gray-400)] font-body font-semibold text-[13px] rounded-[var(--r-sm)] cursor-not-allowed mb-2">Out of Stock</button>
                        <div className="flex justify-center items-center gap-1 cursor-pointer hover:underline text-[var(--blue-500)]"><Bell size={12} /><span className="font-body text-[12px]">Notify when available</span></div>
                    </div>
                ) : quantity > 0 ? (
                    <motion.div transition={{ type: "spring", stiffness: 400, damping: 28 }} className="qty-control mt-auto">
                        <button onClick={(e) => handleQty(e, -1)} className="qty-btn">
                            {quantity === 1 ? <Trash2 size={16} className="text-[var(--red-500)]" /> : <Minus size={16} />}
                        </button>
                        <motion.span key={quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="qty-num">{quantity}</motion.span>
                        <button onClick={(e) => handleQty(e, 1)} className="qty-btn"><Plus size={16} /></button>
                    </motion.div>
                ) : (
                    <button onClick={handleAdd} className={`product-add-btn ${product.requiresPrescription ? 'rx' : ''}`}>
                        {isAdding ? <><Loader2 size={14} className="animate-spin text-[var(--green-700)]" /><span className="text-[var(--green-700)]">Adding...</span></> : 
                         product.requiresPrescription ? <><FileText size={14} />Upload Rx to Buy</> : <><ShoppingBag size={14} />Add to Cart</>}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// ━━━ MAIN SHOP COMPONENT ━━━
export default function Shop() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // State
    const [medicines, setMedicines] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    
    // Filters from URL
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'All';
    const minPrice = parseInt(searchParams.get('minPrice')) || 0;
    const maxPrice = parseInt(searchParams.get('maxPrice')) || 5000;
    const sort = searchParams.get('sort') || 'relevance';
    const view = searchParams.get('view') || 'grid';
    const page = parseInt(searchParams.get('page')) || 1;
    const type = searchParams.get('type') ? searchParams.get('type').split(',') : [];

    // Local UI State
    const [searchInput, setSearchInput] = useState(q);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openSections, setOpenSections] = useState({ cats: true, price: true, avail: true });

    // Fetch Categories
    useEffect(() => {
        categoryService.getAll({ isActive: true }).then(res => setCategories(res.data?.data?.categories || [])).catch(console.error);
    }, []);

    // Fetch Medicines
    useEffect(() => {
        setLoading(true);
        const params = { q, category: category !== 'All' ? category : undefined, minPrice, maxPrice, sort, page, limit: 24, type: type.join(',') };
        medicineService.getAll(params).then(res => {
            setMedicines(res.data?.data?.medicines || []);
            setTotal(res.data?.data?.total || 0);
        }).catch(() => notify.error("Failed to load products")).finally(() => setLoading(false));
    }, [q, category, minPrice, maxPrice, sort, page, type.join(',')]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === null || value === '' || value === 'All') newParams.delete(key);
        else newParams.set(key, value);
        if (key !== 'page') newParams.set('page', '1'); // reset page on filter change
        setSearchParams(newParams);
    };

    const clearAllFilters = () => setSearchParams(new URLSearchParams());

    const activeFilterCount = (category!=='All'?1:0) + (maxPrice!==5000?1:0) + type.length + (q?1:0);

    return (
        <div className="shop-page">
            <Helmet>
                <title>{category !== 'All' ? `${category} | Clinical Pharma Registry` : 'Clinical Pharma Registry | MediCheap'}</title>
                <meta name="description" content={`Explore our clinical pharma registry for ${category !== 'All' ? category : 'genuine medicines'}. Order online for same-day delivery.`} />
            </Helmet>
            
            {/* 1. SHOP BANNER */}
            <section className="shop-banner">
                <div className="shop-banner-glows" />
                <div className="shop-banner-grid" />
                <div className="shop-banner-inner">
                    <div className="flex-1">
                        <div className="shop-banner-eyebrow">
                            <div className="eyebrow-dot" />
                            <span className="font-body text-[12px] font-medium text-white/70 tracking-[0.02em]">Verified Medicines · Fast Delivery</span>
                        </div>
                        <h1 className="shop-banner-heading uppercase tracking-tighter">Clinical <br/><span className="text-shimmer">Pharma Registry.</span></h1>
                        <p className="font-body text-[15px] text-white/60 leading-[1.7] max-w-[420px] mb-6">
                            Secure acquisition of board-certified medical units, vitamins & clinical supplies. Real-time node inventory sync active.
                        </p>
                        
                        <div className="shop-search-bar">
                            <Search className="text-[var(--gray-400)] ml-2 flex-shrink-0" size={17} />
                            <input 
                                type="text" placeholder="Search medicines, brands, vitamins..." 
                                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && updateFilter('q', searchInput)}
                                className="shop-search-input"
                            />
                            {searchInput && <button onClick={() => { setSearchInput(''); updateFilter('q', null); }} className="w-7 h-7 rounded-full bg-[var(--gray-100)] hover:bg-[var(--gray-200)] flex items-center justify-center mr-1.5"><X size={14}/></button>}
                            <button onClick={() => updateFilter('q', searchInput)} className="shop-search-btn">Search</button>
                        </div>
                        
                        <div className="flex gap-2 mt-[14px] flex-wrap">
                            {['🔖 OTC Medicines', '💊 Generics', '🌿 Ayurvedic', '💪 Supplements'].map(chip => (
                                <button key={chip} className="quick-filter-chip">{chip}</button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="hidden lg:grid grid-cols-2 gap-2.5 w-[260px] flex-shrink-0">
                        <AnimatedCounter value="50,000+" label="Orders Delivered" />
                        <AnimatedCounter value="5,000+" label="Verified Products" />
                        <AnimatedCounter value="4.8 ★" label="App Rating" />
                        <AnimatedCounter value="30 min" label="Rx Verification" />
                    </div>
                </div>
            </section>

            {/* 2. TRUST STRIP */}
            <div className="trust-strip">
                <div className="trust-strip-inner scrollbar-hide">
                    {TRUST_ITEMS.map((item, i) => (
                        <div key={i} className="trust-strip-item">
                            <div className="w-9 h-9 rounded-[var(--r-sm)] bg-[var(--green-50)] flex items-center justify-center">
                                <item.icon size={17} className="text-[var(--green-600)]" />
                            </div>
                            <div>
                                <div className="font-body text-[13px] font-semibold text-[var(--gray-800)]">{item.title}</div>
                                <div className="font-body text-[11px] text-[var(--gray-400)]">{item.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. CATEGORY PILLS (STICKY) */}
            <div className="category-pills-container">
                <div className="category-pills-inner scrollbar-hide">
                    {[{name: 'All', icon: <LayoutGrid size={16}/>}, ...categories.map(c=>({name: c.name, icon: <Pill size={16}/>}))].map(cat => (
                        <button key={cat.name} onClick={() => updateFilter('category', cat.name)} className={`category-chip ${category === cat.name ? 'active' : ''}`}>
                            {cat.icon} {cat.name}
                            {category === cat.name && <motion.div layoutId="activeCat" className="category-chip-active-bg" transition={{ type: "spring", stiffness: 500, damping: 42 }} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. ACTIVE FILTERS BAR */}
            <AnimatePresence>
                {activeFilterCount > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="active-filters-bar overflow-hidden">
                        <div className="active-filters-inner">
                            <span className="font-body font-semibold text-[12px] text-[var(--green-700)]">Filters:</span>
                            {category !== 'All' && <div className="bg-white border border-[var(--green-200)] rounded-full px-3 py-1 font-body font-medium text-[12px] text-[var(--green-700)] flex items-center gap-1.5">{category} <X size={12} className="cursor-pointer" onClick={()=>updateFilter('category', 'All')}/></div>}
                            {maxPrice !== 5000 && <div className="bg-white border border-[var(--green-200)] rounded-full px-3 py-1 font-body font-medium text-[12px] text-[var(--green-700)] flex items-center gap-1.5">Up to ₹{maxPrice} <X size={12} className="cursor-pointer" onClick={()=>updateFilter('maxPrice', 5000)}/></div>}
                            <button onClick={clearAllFilters} className="font-body font-medium text-[12px] text-[var(--red-500)] ml-auto hover:underline cursor-pointer bg-transparent border-none">Clear All</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ━━━ MAIN CONTENT ━━━ */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-7 pb-[60px] flex flex-col gap-6 items-stretch relative">
                
                {/* 5. HORIZONTAL REFINEMENT BAR (Desktop) */}
                <div className="shop-refinement-bar hidden lg:flex items-center gap-4 bg-white border border-[var(--gray-200)] rounded-[var(--r-xl)] p-3 px-5 shadow-[var(--shadow-sm)]">
                    <div className="flex items-center gap-2 pr-4 border-r border-[var(--gray-100)]">
                        <SlidersHorizontal size={16} className="text-[var(--green-600)]" />
                        <span className="font-display font-bold text-[14px] text-[var(--gray-900)] whitespace-nowrap">Filter By:</span>
                    </div>

                    <div className="flex flex-1 items-center gap-3">
                        {/* Price Dropdown */}
                        <div className="relative group/dropdown">
                            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--gray-50)] hover:bg-[var(--gray-100)] border border-[var(--gray-200)] rounded-[var(--r-md)] transition-all">
                                <span className="font-body font-semibold text-[13px] text-[var(--gray-700)]">Price Range</span>
                                <ChevronDown size={14} className="text-[var(--gray-400)] transition-transform group-hover/dropdown:rotate-180" />
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-[280px] bg-white border border-[var(--gray-200)] rounded-[var(--r-lg)] shadow-[var(--shadow-lg)] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-50 p-4">
                                <PriceSlider value={maxPrice} onChange={val => updateFilter('maxPrice', val)} />
                            </div>
                        </div>

                        {/* Availability Dropdown */}
                        <div className="relative group/dropdown">
                            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--gray-50)] hover:bg-[var(--gray-100)] border border-[var(--gray-200)] rounded-[var(--r-md)] transition-all">
                                <span className="font-body font-semibold text-[13px] text-[var(--gray-700)]">Refinement</span>
                                <ChevronDown size={14} className="text-[var(--gray-400)] transition-transform group-hover/dropdown:rotate-180" />
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-[240px] bg-white border border-[var(--gray-200)] rounded-[var(--r-lg)] shadow-[var(--shadow-lg)] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-50 p-4 space-y-1">
                                <CustomToggle label="In Stock Only" checked={true} onChange={()=>{}} />
                                <CustomToggle label="Has Discount" checked={false} onChange={()=>{}} />
                                <CustomToggle label="Rx Required" checked={type.includes('POM')} onChange={()=>{
                                    const newTypes = type.includes('POM') ? type.filter(t=>t!=='POM') : [...type, 'POM'];
                                    updateFilter('type', newTypes.join(','));
                                }} />
                            </div>
                        </div>
                        
                        {/* Active Filter Chips (Inline) */}
                        <div className="flex items-center gap-2 ml-4">
                            {activeFilterCount > 0 && <div className="w-[1px] h-6 bg-[var(--gray-100)] mr-2" />}
                            <AnimatePresence>
                                {category !== 'All' && (
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--green-50)] border border-[var(--green-200)] rounded-full font-body text-[12px] font-semibold text-[var(--green-700)]">
                                        {category} <X size={12} className="cursor-pointer" onClick={()=>updateFilter('category', 'All')}/>
                                    </motion.div>
                                )}
                                {maxPrice !== 5000 && (
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--blue-50)] border border-[var(--blue-200)] rounded-full font-body text-[12px] font-semibold text-[var(--blue-700)]">
                                        ≤ ₹{maxPrice} <X size={12} className="cursor-pointer" onClick={()=>updateFilter('maxPrice', 5000)}/>
                                    </motion.div>
                                )}
                                {type.includes('POM') && (
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--red-50)] border border-[var(--red-200)] rounded-full font-body text-[12px] font-semibold text-[var(--red-700)]">
                                        Rx Only <X size={12} className="cursor-pointer" onClick={()=>{
                                            updateFilter('type', type.filter(t=>t!=='POM').join(','));
                                        }}/>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select value={sort} onChange={e => updateFilter('sort', e.target.value)} className="appearance-none bg-white border border-[var(--gray-200)] rounded-[var(--r-md)] py-[8px] pl-3 pr-8 font-body font-semibold text-[13px] text-[var(--gray-800)] cursor-pointer outline-none focus:border-[var(--green-600)] min-w-[150px]">
                                <option value="relevance">Sort: Relevance</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                                <option value="-createdAt">Newest First</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--gray-400)] pointer-events-none" />
                        </div>

                        <div className="bg-[var(--gray-100)] rounded-[var(--r-md)] p-[3px] flex gap-[2px]">
                            <button onClick={()=>updateFilter('view','grid')} className={`w-[34px] h-[30px] flex items-center justify-center rounded-[var(--r-sm)] ${view==='grid'?'bg-white shadow-sm text-[var(--gray-900)]':'text-[var(--gray-400)]'}`}><LayoutGrid size={15}/></button>
                            <button onClick={()=>updateFilter('view','list')} className={`w-[34px] h-[30px] flex items-center justify-center rounded-[var(--r-sm)] ${view==='list'?'bg-white shadow-sm text-[var(--gray-900)]':'text-[var(--gray-400)]'}`}><List size={15}/></button>
                        </div>
                    </div>
                </div>

                {/* 6. PRODUCT GRID AREA */}
                <main className="shop-main">
                    
                    {/* Controls Bar (Mobile Only) */}
                    <div className="lg:hidden flex items-center justify-between flex-wrap gap-3 pb-4 mb-5 border-b border-[var(--gray-100)]">
                        <div className="font-body text-[13px] text-[var(--gray-400)]">Showing {(page-1)*24 + 1}–{Math.min(page*24, total)} of {total.toLocaleString()} products</div>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <select value={sort} onChange={e => updateFilter('sort', e.target.value)} className="appearance-none bg-white border-[1.5px] border-[var(--gray-200)] rounded-[var(--r-md)] py-[7px] pl-3 pr-8 font-body font-medium text-[13px] text-[var(--gray-800)] cursor-pointer outline-none focus:border-[var(--green-600)] min-w-[160px]">
                                    <option value="relevance">Relevance</option>
                                    <option value="price">Price Low to High</option>
                                    <option value="-price">Price High to Low</option>
                                    <option value="-createdAt">Newest First</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--gray-400)] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Loading / Empty / Grid */}
                    {loading ? (
                        <div className={`product-grid ${view==='list'?'!grid-cols-1':''}`}>
                            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] skeleton-shimmer rounded-[var(--r-xl)]" />)}
                        </div>
                    ) : medicines.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <SearchX size={56} className="text-[var(--gray-300)] mx-auto mb-4" />
                            <h3 className="font-display font-bold text-[20px] text-[var(--gray-700)] mb-2">No products found</h3>
                            <p className="font-body text-[14px] text-[var(--gray-400)] mb-5">Try adjusting your filters or search terms.</p>
                            <button onClick={clearAllFilters} className="border border-[var(--green-600)] text-[var(--green-600)] rounded-[var(--r-md)] px-6 py-2 font-body font-semibold hover:bg-[var(--green-50)] transition-colors">Clear All Filters</button>
                        </div>
                    ) : (
                        <motion.div variants={stagger()} initial="hidden" animate="visible" className={`product-grid ${view==='list'?'!grid-cols-1':''}`}>
                            <AnimatePresence>
                                {medicines.map(med => <ProductCard key={med._id} product={med} viewMode={view} />)}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {total > 24 && (
                        <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
                            <span className="font-body text-[13px] text-[var(--gray-400)]">Page {page} of {Math.ceil(total/24)}</span>
                            <div className="flex gap-1.5">
                                <button disabled={page===1} onClick={()=>updateFilter('page', page-1)} className={`w-10 h-10 rounded-[var(--r-md)] border-[1.5px] border-[var(--gray-200)] flex items-center justify-center bg-white transition-colors ${page===1 ? 'opacity-35 cursor-not-allowed' : 'hover:border-[var(--green-600)] hover:bg-[var(--green-50)] hover:text-[var(--green-600)]'}`}><ChevronLeft size={15}/></button>
                                {[...Array(Math.min(5, Math.ceil(total/24)))].map((_, i) => {
                                    const p = i + 1;
                                    return (
                                        <button key={p} onClick={()=>updateFilter('page', p)} className={`relative w-10 h-10 rounded-[var(--r-md)] border-[1.5px] font-body font-medium text-[13px] transition-colors ${p===page ? 'bg-[var(--green-600)] border-[var(--green-600)] text-white font-bold shadow-[var(--shadow-green)]' : 'border-[var(--gray-200)] bg-white hover:border-[var(--green-600)] hover:bg-[var(--green-50)]'}`}>
                                            {p}
                                        </button>
                                    );
                                })}
                                <button disabled={page===Math.ceil(total/24)} onClick={()=>updateFilter('page', page+1)} className={`w-10 h-10 rounded-[var(--r-md)] border-[1.5px] border-[var(--gray-200)] flex items-center justify-center bg-white transition-colors ${page===Math.ceil(total/24) ? 'opacity-35 cursor-not-allowed' : 'hover:border-[var(--green-600)] hover:bg-[var(--green-50)] hover:text-[var(--green-600)]'}`}><ChevronRight size={15}/></button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* 7. HEALTH SPOTLIGHTS */}
            <section className="bg-white border-t border-[var(--gray-100)] py-[52px]">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <h2 className="font-display font-extrabold text-[26px] text-[var(--gray-900)] mb-2">Shop by Health Concern</h2>
                    <p className="font-body text-[15px] text-[var(--gray-400)] mb-8">Find exactly what you need</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                        {SPOTLIGHTS.map((s, i) => (
                            <motion.div key={s.id} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i*0.1 }} whileHover={{ y: -4, boxShadow: 'var(--shadow-xl)' }} className="spotlight-card" style={{ background: s.bg }} onClick={() => updateFilter('category', s.name)}>
                                <div className="w-12 h-12 rounded-[var(--r-md)] flex items-center justify-center mb-3" style={{ background: `${s.accent}25` }}><s.icon size={24} color={s.accent} /></div>
                                <h3 className="font-display font-bold text-[17px] text-[var(--gray-900)]">{s.name}</h3>
                                <p className="font-body text-[13px] text-[var(--gray-500)] leading-[1.6] mb-3">{s.sub}</p>
                                <button className="font-body font-semibold text-[13px] bg-white border border-opacity-20 px-3 py-1.5 rounded-full hover:bg-opacity-80 transition-colors" style={{ color: s.accent, borderColor: s.accent }}>Shop →</button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile Filter FAB */}
            <button className="mobile-filter-fab lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                <SlidersHorizontal size={22} color="white" />
                {activeFilterCount > 0 && <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[var(--red-600)] border-2 border-white rounded-full font-body font-bold text-[10px] text-white flex items-center justify-center">{activeFilterCount}</div>}
            </button>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div variants={backdropAnim} initial="initial" animate="animate" exit="exit" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[199] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                        <motion.div variants={drawerAnim} initial="initial" animate="animate" exit="exit" className="fixed top-0 bottom-0 right-0 w-[min(340px,88vw)] bg-white z-[200] flex flex-col lg:hidden overflow-hidden">
                            <div className="p-4 border-b border-[var(--gray-100)] flex items-center justify-between bg-white">
                                <span className="font-body font-bold text-[17px]">Filters</span>
                                <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 rounded-full bg-[var(--gray-100)] flex items-center justify-center"><X size={18}/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 pb-20">
                                {/* Mobile filters content (reused structure) */}
                                <div className="mb-6">
                                    <h4 className="font-body font-semibold text-[14px] mb-3">Price Range</h4>
                                    <PriceSlider value={maxPrice} onChange={val => updateFilter('maxPrice', val)} />
                                </div>
                                <div className="mb-6">
                                    <h4 className="font-body font-semibold text-[14px] mb-3">Availability</h4>
                                    <CustomToggle label="In Stock Only" checked={true} onChange={()=>{}} />
                                    <CustomToggle label="Rx Required" checked={type.includes('POM')} onChange={()=>{
                                        const newTypes = type.includes('POM') ? type.filter(t=>t!=='POM') : [...type, 'POM'];
                                        updateFilter('type', newTypes.join(','));
                                    }} />
                                </div>
                            </div>
                            <div className="p-3 border-t border-[var(--gray-100)] grid grid-cols-3 gap-2 bg-white">
                                <button onClick={clearAllFilters} className="font-body font-semibold text-[13px] text-[var(--gray-600)]">Reset</button>
                                <button onClick={() => setIsSidebarOpen(false)} className="col-span-2 bg-[var(--green-600)] text-white font-body font-semibold text-[13px] rounded-[var(--r-md)] h-10 shadow-[var(--shadow-green)]">Show {total} Results</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
