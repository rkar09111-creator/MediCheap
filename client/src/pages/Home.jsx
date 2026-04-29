import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ArrowRight,
    ShieldCheck,
    Clock,
    Pill,
    CheckCircle2,
    Star,
    Upload,
    ChevronRight,
    ShoppingBag,
    Plus,
    Minus,
    Heart,
    ThumbsUp,
    Shield,
    Truck,
    Package
} from 'lucide-react';
import { Button, cn } from '../components/ui';
import { medicineService, categoryService, bannerService, settingService } from '../services/api';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

// --- Sub-components for Home Page ---

const TrustBadge = ({ icon: Icon, title, desc }) => (
    <div className="flex items-start gap-4 p-4 min-w-[240px] md:min-w-0">
        <div className="p-2 bg-primary-100 rounded-lg text-primary-500">
            <Icon size={32} strokeWidth={1.5} />
        </div>
        <div>
            <h4 className="font-display font-bold text-[15px] text-neutral-900 leading-tight">{title}</h4>
            <p className="text-xs text-neutral-500 mt-1">{desc}</p>
        </div>
    </div>
);

const CategoryCard = ({ name, icon, count, gradient, onClick }) => (
    <motion.div
        whileHover={{ y: -4 }}
        onClick={onClick}
        className={cn(
            "p-6 rounded-xl border border-transparent hover:border-primary-300 hover:shadow-hover transition-all duration-300 cursor-pointer group flex flex-col justify-between h-[180px]",
            gradient
        )}
    >
        <div className="text-5xl">{icon}</div>
        <div className="flex items-end justify-between">
            <div>
                <h3 className="font-display font-semibold text-lg text-neutral-900 leading-tight">{name}</h3>
                <p className="text-xs text-neutral-500 mt-1">{count} products</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                <ArrowRight size={16} className="text-primary-500" />
            </div>
        </div>
    </motion.div>
);

const MedicineCard = ({ product }) => {
    const [qty, setQty] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const addItem = useCartStore(state => state.addItem);
    const updateQty = useCartStore(state => state.updateQty);
    const cartItems = useCartStore(state => state.items);

    useEffect(() => {
        if (!product?._id) return;
        const item = cartItems.find(i => i.medicine === product._id);
        setQty(item ? item.quantity : 0);
    }, [cartItems, product?._id]);

    if (!product) return null;

    const handleAdd = () => {
        addItem(product);
        toast.success(`${product.name} added to vault`);
    };

    const handleUpdate = (newQty) => {
        if (newQty === 0) {
            // removeItem not directly used here to match existing UI logic of setting qty 0
            // but updateQty handles 0 if implemented, or we can just call store
        }
        updateQty(product._id, newQty);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-lg border border-neutral-100 shadow-card hover:shadow-hover hover:border-primary-300 transition-all duration-300 group overflow-hidden flex flex-col h-full"
        >
            <div className="h-48 bg-neutral-50 p-6 relative flex items-center justify-center overflow-hidden">
                <motion.img
                    whileHover={{ scale: 1.04 }}
                    src={product.images?.[0]?.url || '/med-placeholder.png'}
                    alt={product.name}
                    className="h-full object-contain transition-transform duration-500"
                />

                {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-danger text-white text-[11px] font-bold px-2 py-1 rounded-sm">
                        -{product.discountPercentage}% OFF
                    </div>
                )}

                {product.requiresPrescription && (
                    <div className="absolute top-3 right-3 bg-accent-100 text-accent-500 text-[11px] font-bold px-2 py-1 rounded-sm">
                        Rx
                    </div>
                )}

                <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-12 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Heart size={16} className={isWishlisted ? "fill-danger text-danger" : "text-neutral-400"} />
                </button>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">{product.brand}</span>
                <h3 className="font-display font-semibold text-[15px] text-neutral-900 line-clamp-2 mt-1 flex-1 leading-tight">{product.name}</h3>

                <div className="flex items-center gap-1 mt-3">
                    <div className="flex text-accent-500">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= product.averageRating ? "currentColor" : "none"} />)}
                    </div>
                    <span className="text-[12px] text-neutral-400">({product.ratings?.length || 0})</span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-price text-xl font-bold text-neutral-900 tracking-tight">₹{product.sellingPrice}</span>
                    {product.mrp > product.sellingPrice && (
                        <span className="text-sm text-neutral-400 line-through">₹{product.mrp}</span>
                    )}
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", product.stock > 0 ? "bg-success" : "bg-danger")} />
                    <span className={cn("text-[12px]", product.stock > 0 ? "text-success" : "text-danger")}>
                        {product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left` : "In Stock") : "Out of Stock"}
                    </span>
                    <span className="text-neutral-300 mx-1">•</span>
                    <span className="text-[12px] text-neutral-500">Delivered by Tomorrow</span>
                </div>

                <div className="mt-4">
                    <AnimatePresence mode="wait">
                        {qty === 0 ? (
                            <motion.button
                                key="add-btn"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleAdd}
                                className="w-full h-10 bg-primary-500 hover:bg-primary-700 text-white rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <ShoppingBag size={16} /> Add to Cart
                            </motion.button>
                        ) : (
                            <motion.div
                                key="qty-ctrl"
                                initial={{ opacity: 0, width: "80%" }}
                                animate={{ opacity: 1, width: "100%" }}
                                className="h-10 bg-primary-100 rounded-md flex items-center justify-between px-1"
                            >
                                <button onClick={() => handleUpdate(qty - 1)} className="w-8 h-8 rounded bg-white text-primary-500 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                                    <Minus size={14} />
                                </button>
                                <span className="font-bold text-primary-500">{qty}</span>
                                <button onClick={() => handleUpdate(qty + 1)} className="w-8 h-8 rounded bg-white text-primary-500 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                                    <Plus size={14} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

const ReviewCard = ({ review }) => (
    <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", review.avatarColor)}>
                    {review.initials}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{review.name}</span>
                        <CheckCircle2 size={14} className="text-primary-500" />
                    </div>
                    <span className="text-xs text-neutral-500">{review.city}</span>
                </div>
            </div>
            <div className="flex text-accent-500">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="currentColor" />)}
            </div>
        </div>
        <p className="text-[14px] text-neutral-700 leading-relaxed">"{review.text}"</p>
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-50">
            <span>{review.date}</span>
            <button className="flex items-center gap-1.5 hover:text-primary-500 transition-colors">
                <ThumbsUp size={12} /> {review.helpful} found helpful
            </button>
        </div>
    </div>
);

const FloatingProduct = ({ product, index }) => {
    if (!product) return null;
    
    // Different float variants for variety
    const variants = [
        { y: [0, -25, 0], x: [0, 10, 0], rotate: [-4, -8, -4] },
        { y: [0, 20, 0], x: [0, -15, 0], rotate: [2, 6, 2] },
        { y: [0, -15, 0], x: [0, 12, 0], rotate: [0, -4, 0] }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                ...variants[index % 3]
            }}
            transition={{ 
                opacity: { duration: 1, delay: index * 0.3 },
                scale: { duration: 1, delay: index * 0.3 },
                y: { duration: 6 + index, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 7 + index, repeat: Infinity, ease: "easeInOut" }
            }}
            className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 w-56 group cursor-pointer"
        >
            <div className="aspect-square bg-neutral-50 rounded-xl mb-3 overflow-hidden relative">
                <img 
                    src={product.images?.[0]?.url || product.images?.[0] || '/med-placeholder.png'} 
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>
            <div className="space-y-1">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{product.brand}</span>
                    <div className="flex items-center gap-1 bg-primary-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-primary-600">
                        <Star size={8} fill="currentColor" /> {product.averageRating || 4.8}
                    </div>
                </div>
                <h4 className="font-display font-bold text-[13px] text-neutral-900 leading-tight line-clamp-1">{product.name}</h4>
                <div className="flex items-center justify-between pt-1">
                    <span className="font-price font-extrabold text-sm text-neutral-900">₹{product.sellingPrice}</span>
                    <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                        <Plus size={14} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Home Component ---

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Best Sellers');

    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentBanner, setCurrentBanner] = useState(0);

    const [floatingProducts, setFloatingProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medRes, catRes, settingRes] = await Promise.all([
                    medicineService.getAll({ limit: 8, sort: '-createdAt' }),
                    categoryService.getAll(),
                    settingService.getSettings()
                ]);
                
                const medData = medRes.data?.data?.medicines || [];
                setProducts(medData);
                setCategories(catRes.data?.data?.categories || []);
                
                const settings = settingRes.data?.settings;
                const floatingIds = settings?.offers_config?.floatingProducts;
                
                let floatingProductsData = [];
                if (floatingIds && floatingIds.length > 0) {
                    const floatingRes = await medicineService.getAll({ ids: floatingIds.join(',') });
                    floatingProductsData = floatingRes.data?.data?.medicines || [];
                } else {
                    const featuredRes = await medicineService.getAll({ isFeatured: true, limit: 3 });
                    floatingProductsData = featuredRes.data?.data?.medicines || [];
                }

                // Fallback for demo if still empty
                if (floatingProductsData.length === 0) {
                    floatingProductsData = [
                        {
                            name: 'Crocin Advanced 500mg',
                            brand: 'GSK',
                            sellingPrice: 45,
                            images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600' }],
                            averageRating: 4.9
                        },
                        {
                            name: 'Augmentin Duo 625',
                            brand: 'Pfizer',
                            sellingPrice: 180,
                            images: [{ url: 'https://images.unsplash.com/photo-1576073719710-418242273944?auto=format&fit=crop&q=80&w=600' }],
                            averageRating: 4.7
                        },
                        {
                            name: 'Vitamin D3 60K',
                            brand: 'MediCheap',
                            sellingPrice: 165,
                            images: [{ url: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=600' }],
                            averageRating: 4.8
                        }
                    ];
                }
                setFloatingProducts(floatingProductsData);
            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (banners.length > 1) {
            const timer = setInterval(() => {
                setCurrentBanner(prev => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [banners]);

    const reviews = [
        { name: "Anish Sharma", city: "Mumbai", initials: "AS", avatarColor: "bg-blue-500", text: "Extremely fast delivery. I ordered my blood pressure meds at 4 PM and they were at my door by 7 PM. Impressive!", date: "2 days ago", helpful: 12 },
        { name: "Priya Gupta", city: "Delhi", initials: "PG", avatarColor: "bg-purple-500", text: "The medicine prices are actually much lower than local shops. Plus, the pharmacist consultation was very helpful.", date: "1 week ago", helpful: 8 },
        { name: "Rahul Verma", city: "Bangalore", initials: "RV", avatarColor: "bg-green-500", text: "Uploading my prescription was seamless. The app verified it quickly and I could track the rider live on the map.", date: "2 weeks ago", helpful: 24 },
    ];

    return (
        <div className="bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-neutral-950 pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#22C55E 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                <div className="absolute top-1/2 right-0 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

                <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column */}
                    <div className="space-y-8 max-w-2xl">


                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-[72px] font-display font-extrabold text-white leading-[1.05] tracking-tight"
                        >
                            Genuine Medicines <br />
                            <span className="text-primary-500 relative">
                                At Honest Prices
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 9C118.5 3 239.5 3 355 9" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
                                </svg>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-neutral-400 font-medium max-w-lg leading-relaxed"
                        >
                            Skip the queue. Order from our licensed pharmacy and get doorstep delivery — same day.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <form
                                onSubmit={(e) => { e.preventDefault(); if (searchQuery) navigate(`/shop?search=${searchQuery}`); }}
                                className="relative group max-w-xl"
                            >
                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search medicine name or brand..."
                                    className="w-full h-16 pl-16 pr-32 rounded-full bg-white border-2 border-transparent focus:border-primary-500 focus:ring-4 focus:ring-brand-500/10 text-neutral-900 font-medium transition-all shadow-lg"
                                />
                                <button className="absolute right-2 top-2 bottom-2 px-8 bg-primary-500 hover:bg-primary-700 text-white rounded-full font-bold transition-all">
                                    Search
                                </button>
                            </form>
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Popular:</span>
                                {["Paracetamol", "Vitamin D3", "Omeprazole", "Metformin"].map(chip => (
                                    <button
                                        key={chip}
                                        onClick={() => navigate(`/shop?search=${chip}`)}
                                        className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium text-neutral-400 transition-colors"
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4"
                        >
                            <span className="text-sm font-medium text-neutral-400">50,000+ Orders Delivered</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                            <span className="text-sm font-medium text-neutral-400 flex items-center gap-1.5">
                                <Star size={16} fill="#F59E0B" className="text-accent-500" /> 4.8★ Customer Rating
                            </span>
                        </motion.div>
                    </div>

                    {/* Right Column - PREMIUM FLOATING CLINICAL NODE */}
                    <div className="hidden lg:block relative h-[600px]">
                        {/* THE 3 FLOATING MEDICINES */}
                        
                        {/* 1. Top Left Floating Card */}
                        <div className="absolute top-0 left-0 z-30">
                            <FloatingProduct product={floatingProducts[0]} index={0} />
                        </div>

                        {/* 2. Middle Right Floating Card */}
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                            <FloatingProduct product={floatingProducts[1]} index={1} />
                        </div>

                        {/* 3. Bottom Center Floating Card */}
                        <div className="absolute -bottom-10 left-32 z-40">
                            <FloatingProduct product={floatingProducts[2]} index={2} />
                        </div>
                        
                        {/* Decorative Glows */}
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                </div>
            </section>



            {/* Categories Section */}
            <section className="py-24 container-custom">
                <div className="flex flex-col gap-2 mb-12">
                    <span className="text-primary-500 font-bold text-xs uppercase tracking-[3px]">Shop by Category</span>
                    <h2 className="text-4xl font-display font-extrabold text-neutral-900 tracking-tight">Find exactly what you need</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {categories.filter(c => c && c._id).map((cat, i) => (
                        <CategoryCard
                            key={cat._id}
                            name={cat.name}
                            icon={cat.icon || '💊'}
                            count={cat.itemCount || 0}
                            gradient={["bg-blue-50", "bg-orange-50", "bg-green-50", "bg-red-50", "bg-purple-50", "bg-yellow-50", "bg-sky-50", "bg-lime-50"][i % 8]}
                            onClick={() => navigate(`/shop?category=${cat.name}`)}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Grid */}
            <section className="py-24 bg-neutral-50">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
                        <div className="space-y-2">
                            <span className="text-primary-500 font-bold text-xs uppercase tracking-[3px]">Institutional Catalog</span>
                            <h2 className="text-4xl font-display font-extrabold text-neutral-900 tracking-tight">Essential Formulations</h2>
                        </div>
                        <div className="flex bg-neutral-200/50 p-1 rounded-full">
                            {["Best Sellers", "Today's Deals", "Newly Added"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                                        activeTab === tab ? "bg-white text-primary-500 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {activeTab === 'Best Sellers' ? (
                            (featuredProducts.length > 0 ? featuredProducts : products).slice(0, 4).map(product => (
                                <MedicineCard key={product._id} product={product} />
                            ))
                        ) : (
                            products.slice(0, 4).map(product => (
                                <MedicineCard key={product._id} product={product} />
                            ))
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Button
                            onClick={() => navigate('/shop')}
                            variant="ghost"
                            className="group font-bold text-neutral-600 hover:text-primary-500 h-12 px-8"
                        >
                            Explore Full Pharmacopeia <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Prescription Upload Section */}
            <section className="bg-neutral-950 py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-500/5" />
                <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div>
                            <span className="text-primary-500 font-bold text-[11px] uppercase tracking-[4px]">Prescription Medicines</span>
                            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight mt-4">
                                Have a Doctor's <br /> Prescription?
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 max-w-md leading-relaxed">
                                Upload your prescription and our licensed pharmacists will review it within 30 minutes and prepare your order.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { step: 1, title: "Upload document", desc: "Upload prescription image or PDF securely" },
                                { step: 2, title: "Pharmacist Review", desc: "Verified within 30 minutes of submission" },
                                { step: 3, title: "Swift Delivery", desc: "Doorstep delivery with complete tracking" }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-12 h-12 rounded-full border-2 border-brand-500/30 flex items-center justify-center text-white font-bold shrink-0">
                                        {s.step}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{s.title}</h4>
                                        <p className="text-neutral-500 text-sm mt-1">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button className="h-14 px-10 bg-white text-neutral-900 font-bold rounded-full shadow-xl shadow-white/5 hover:bg-neutral-100">
                            Upload Prescription Now <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </div>

                    <div className="bg-brand-500/5 border-2 border-dashed border-brand-500/30 rounded-3xl p-12 text-center group hover:border-brand-500/60 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center gap-6 py-12">
                            <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                                <Upload size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Drag & drop prescription here</h3>
                                <p className="text-neutral-500">or</p>
                                <Button variant="ghost" className="border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8">
                                    Browse Files
                                </Button>
                            </div>
                            <p className="text-xs text-neutral-600 uppercase tracking-widest font-bold">
                                Accepted: JPG, PNG, PDF • Max 5MB
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Order Tracking Showcase */}
            <section className="py-24 bg-neutral-50 overflow-hidden">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Copy */}
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <span className="text-primary-500 font-bold text-xs uppercase tracking-[3px]">Real-Time Order Tracking</span>
                                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-neutral-900 leading-tight tracking-tight">
                                    Every step of your order,<br />
                                    <span className="text-primary-500">right at your fingertips.</span>
                                </h2>
                                <p className="text-lg text-neutral-500 leading-relaxed max-w-md">
                                    From the moment you place an order to doorstep delivery — track it live. No anxiety, no guesswork.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {[
                                    { icon: "🕐", color: "bg-slate-100 text-slate-600 border-slate-200", label: "Pending", desc: "Order received, awaiting pharmacist confirmation." },
                                    { icon: "🔬", color: "bg-blue-50 text-blue-600 border-blue-200", label: "Processing", desc: "Pharmacist is reviewing & packing your medicines." },
                                    { icon: "🛵", color: "bg-amber-50 text-amber-600 border-amber-200", label: "Out for Delivery", desc: "Rider is on the way. Track live on the map." },
                                    { icon: "✅", color: "bg-green-50 text-green-600 border-green-200", label: "Delivered", desc: "Medicines delivered safely to your door." },
                                ].map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-xl shrink-0 ${step.color} group-hover:scale-110 transition-transform`}>
                                            {step.icon}
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900">{step.label}</p>
                                            <p className="text-sm text-neutral-500">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <Link to="/orders" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-700 text-white font-bold rounded-full transition-all shadow-lg shadow-brand-500/20">
                                View My Orders <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Right: Animated Order Card */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-blue-500/5 rounded-3xl" />

                            {/* Mock Order Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative bg-white rounded-3xl shadow-2xl shadow-neutral-900/10 overflow-hidden border border-neutral-100"
                            >
                                {/* Card Header */}
                                <div className="bg-neutral-950 p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                                            <Package size={20} className="text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">Order</p>
                                            <p className="text-white font-bold font-mono">#MC-29471</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Out for Delivery</span>
                                    </div>
                                </div>

                                {/* Progress Timeline */}
                                <div className="p-6 space-y-1">
                                    {[
                                        { label: "Order Placed", time: "10:15 AM", done: true, icon: CheckCircle2 },
                                        { label: "Pharmacist Confirmed", time: "10:28 AM", done: true, icon: CheckCircle2 },
                                        { label: "Packed & Ready", time: "11:00 AM", done: true, icon: CheckCircle2 },
                                        { label: "Out for Delivery", time: "11:30 AM", done: true, icon: Truck, active: true },
                                        { label: "Delivered", time: "ETA 12:15 PM", done: false, icon: Package },
                                    ].map((step, i, arr) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${step.active ? 'bg-amber-100 text-amber-600 ring-4 ring-amber-100' : step.done ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                                                    <step.icon size={14} />
                                                </div>
                                                {i < arr.length - 1 && (
                                                    <div className={`w-0.5 h-6 mt-1 ${step.done ? 'bg-primary-300' : 'bg-neutral-200'}`} />
                                                )}
                                            </div>
                                            <div className="pb-2 pt-1">
                                                <p className={`text-sm font-bold ${step.active ? 'text-amber-600' : step.done ? 'text-neutral-900' : 'text-neutral-400'}`}>{step.label}</p>
                                                <p className={`text-xs mt-0.5 ${step.done ? 'text-neutral-500' : 'text-neutral-300'}`}>{step.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Items */}
                                <div className="border-t border-neutral-100 px-6 py-4">
                                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Order Items</p>
                                    <div className="space-y-2">
                                        {[
                                            { name: "Paracetamol 500mg", qty: 2, price: 64 },
                                            { name: "Vitamin D3 60K", qty: 1, price: 180 },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-primary-50 text-primary-600 text-[10px] font-bold rounded flex items-center justify-center">{item.qty}×</span>
                                                    <span className="text-sm font-medium text-neutral-700">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-neutral-900">₹{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between border-t border-neutral-100">
                                    <div>
                                        <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Total Paid</p>
                                        <p className="text-xl font-bold text-neutral-900 font-price">₹244</p>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">✓ Payment Confirmed</span>
                                </div>
                            </motion.div>

                            {/* Floating Rider Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-neutral-100 px-4 py-3 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl">🛵</div>
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">Rajan Kumar</p>
                                    <p className="text-[10px] text-neutral-500">Rider · 1.2km away</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-24 container-custom">
                <div className="grid lg:grid-cols-12 gap-20 items-start">
                    <div className="lg:col-span-4 space-y-8">
                        <div className="space-y-4">
                            <span className="text-primary-500 font-bold text-xs uppercase tracking-[3px]">Social Proof</span>
                            <h2 className="text-4xl font-display font-extrabold text-neutral-900 tracking-tight">What our <br /> customers say</h2>
                        </div>

                        <div className="bg-neutral-50 p-8 rounded-2xl space-y-6">
                            <div className="space-y-1">
                                <div className="text-5xl font-price font-bold text-neutral-900">4.8</div>
                                <div className="flex text-accent-500">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill="currentColor" />)}
                                </div>
                                <p className="text-sm text-neutral-500 font-medium">Based on 12,400 reviews</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { s: 5, p: 78, c: "bg-primary-500" },
                                    { s: 4, p: 15, c: "bg-primary-300" },
                                    { s: 3, p: 5, c: "bg-neutral-300" },
                                    { s: 2, p: 1, c: "bg-neutral-200" },
                                    { s: 1, p: 1, c: "bg-neutral-100" },
                                ].map(r => (
                                    <div key={r.s} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-neutral-500 w-3">{r.s}</span>
                                        <Star size={10} fill="#D1D5DB" className="text-neutral-300" />
                                        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                            <div className={cn("h-full rounded-full", r.c)} style={{ width: `${r.p}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-neutral-400 w-8">{r.p}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <ReviewCard review={reviews[0]} />
                            <ReviewCard review={reviews[1]} />
                        </div>
                        <div className="space-y-6 pt-12 md:pt-24">
                            <ReviewCard review={reviews[2]} />
                            <div className="bg-primary-500 p-8 rounded-xl text-white space-y-6 relative overflow-hidden">
                                <div className="relative z-10 space-y-4">
                                    <h3 className="text-2xl font-bold leading-tight">Join 50,000+ satisfied patients today.</h3>
                                    <Button className="bg-white text-primary-500 font-bold rounded-full w-full h-12 shadow-lg">
                                        Start Your Order
                                    </Button>
                                </div>
                                <Pill size={120} className="absolute -bottom-8 -right-8 opacity-10 rotate-45" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
