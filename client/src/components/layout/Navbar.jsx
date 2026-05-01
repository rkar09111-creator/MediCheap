import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Pill,
  ChevronRight,
  Package,
  Tag,
  User,
  LogOut,
  Plus,
  ArrowRight,
  Heart,
  LayoutGrid
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useCartStore } from '../../store/cartStore';
import { medicineService, settingService } from '../../services/api';
import { UI_CONSTANTS } from '../../constants';
import { Button, cn } from '../ui';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';



const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { settings } = useSettingsStore();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const cartCount = totalItems();

  // Search Logic
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data } = await medicineService.getAll({ search: searchQuery, limit: 5 });
        setSearchResults(data.data.medicines);
        setShowDropdown(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
    setShowSearchOverlay(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Dynamic Layout Coupling Fix
  useEffect(() => {
    const currentHeight = isScrolled ? 54 : 60;
    document.documentElement.style.setProperty('--navbar-height', `${currentHeight}px`);
  }, [isScrolled]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Upload Rx', path: '/upload-prescription' },
    { name: 'My Orders', path: '/orders' },
    { name: 'Offers', path: '/offers' }
  ];

  const textColor = (isHome && !isScrolled) ? "text-white" : "text-neutral-900";

  return (
    <header className="fixed top-0 w-full z-[100] font-display">
      {/* 🔝 Main Navbar: ULTRA-CLEAR GLASS (NO ANNOUNCEMENT) */}
      <nav className={cn(
        "w-full transition-all duration-500 ease-in-out border-b",
        isMobileMenuOpen ? "bg-neutral-950" : "bg-white/5 backdrop-blur-[40px] saturate-[200%]",
        isScrolled ? "h-[54px] border-white/10 shadow-lg" : "h-[60px] border-white/5 shadow-none",
        textColor
      )}>
        <div className="container-custom h-full flex items-center justify-between">
          <Logo isScrolled={isScrolled} isHome={isHome} className="shrink-0 scale-90 origin-left" />

          {/* CENTER: HIGH-CONVERSION LINKS */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => cn(
                  "text-[13px] font-medium transition-all px-2 py-1 relative",
                  isActive 
                    ? "text-brand-primary font-black" 
                    : "hover:text-brand-primary"
                )}
              >
                {link.name}
                {/* Underline indicator for active state */}
                {({ isActive }) => isActive && (
                  <motion.div 
                    layoutId="navUnderline"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 bg-brand-primary rounded-full"
                  />
                )}
              </NavLink>
            ))}
          </div>

          {/* RIGHT: ACTION CLUSTER */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearchOverlay(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10"
            >
              <Search size={18} strokeWidth={2.5} />
            </button>

            {/* Cart with Spring Notification */}
            <Link to="/cart" className="relative group">
              <div className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10">
                <ShoppingCart size={20} strokeWidth={2.5} />
              </div>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 400 }}
                    className="absolute -top-1 -right-1 w-[16px] h-[16px] bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2 ml-1">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-2.5 px-2 py-1 transition-all group">
                    <span className="text-[12px] font-bold group-hover:text-brand-primary transition-colors">{user?.name ? user.name.split(' ')[0] : 'Account'}</span>
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      {user?.name ? user.name.charAt(0) : <User size={14} />}
                    </div>
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className={cn(
                      "h-8 px-4 rounded-full text-[12px] font-semibold transition-all border",
                      (isHome && !isScrolled) ? "border-white/20 text-white hover:bg-white/10" : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="h-8 px-4 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-full text-[12px] font-semibold transition-all shadow-green transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-1.5 transition-colors rounded-full hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE NAV: SLIDE-IN OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-neutral-950 z-[110] lg:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-white/10">
              <Logo isScrolled={true} isHome={false} />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                <X size={28} />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  key={link.name}
                >
                  <Link
                    to={link.path}
                    className="flex items-center justify-between p-4 text-white hover:bg-white/5 rounded-2xl transition-colors group"
                  >
                    <span className="text-xl font-bold tracking-tight">{link.name}</span>
                    <ChevronRight size={20} className="text-neutral-600 group-hover:text-brand-primary transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Bottom Actions */}
            <div className="p-8 space-y-4 border-t border-white/10 bg-neutral-950/50 backdrop-blur-xl">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={logout}
                    className="w-full h-14 bg-white/5 text-danger font-bold rounded-2xl flex items-center justify-center gap-3 border border-danger/20"
                  >
                    <LogOut size={20} /> Logout Account
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button onClick={() => navigate('/login')} className="w-full h-14 bg-white/5 text-white rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all">
                    Login
                  </button>
                  <button onClick={() => navigate('/register')} className="w-full h-14 bg-brand-primary text-white rounded-2xl font-bold shadow-green">
                    Get Started
                  </button>
                </div>
              )}
              <p className="text-center text-neutral-500 text-xs font-medium">Licensed Pharmacy · Mumbai, India</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 🔍 SEARCH OVERLAY */}
      <AnimatePresence>
        {showSearchOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/95 backdrop-blur-xl z-[200] flex flex-col items-center pt-24 px-6"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-3xl relative"
            >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500" size={28} />
              <input 
                autoFocus
                type="text"
                placeholder="Search Medicine, Brands or Categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setShowSearchOverlay(false)}
                className="w-full bg-white/5 border-b-2 border-white/10 py-8 pl-20 pr-32 text-3xl font-display font-black text-white focus:border-brand-primary outline-none transition-all placeholder:text-neutral-700"
              />
              <button 
                onClick={() => setShowSearchOverlay(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/10 rounded-lg text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                ESC to close
              </button>

              {/* Suggestions Overlay */}
              <div className="mt-8 space-y-6 overflow-y-auto max-h-[60vh] no-scrollbar">
                {isSearching ? (
                  <div className="flex items-center gap-4 text-brand-primary">
                    <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Searching Clinical Database...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid gap-4">
                    {searchResults.map((med, i) => (
                      <motion.div
                        key={med._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate(`/medicine/${med._id}`)}
                        className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 hover:border-brand-primary/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center shrink-0">
                              <img src={med.images?.[0]?.url || med.images?.[0]} className="w-full h-full object-contain" />
                           </div>
                           <div>
                              <h4 className="text-xl font-black text-white tracking-tight">{med.name}</h4>
                              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{med.brand} · {med.category}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right">
                              <p className="text-2xl font-black text-white tracking-tighter">₹{med.sellingPrice || med.price}</p>
                              {med.discountPercentage > 0 && <span className="text-[10px] font-bold text-brand-primary">-{med.discountPercentage}% OFF</span>}
                           </div>
                           <ArrowRight className="text-neutral-700 group-hover:text-brand-primary group-hover:translate-x-2 transition-all" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest text-center py-10">No products found.</p>
                ) : (
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Trending Searches</p>
                     <div className="flex flex-wrap gap-3">
                        {['Paracetamol', 'Vitamin D3', 'Shelcal', 'Allegra', 'Dolo 650'].map(term => (
                          <button 
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-sm font-bold text-neutral-400 hover:text-white hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all"
                          >
                            {term}
                          </button>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
