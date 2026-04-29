import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search as SearchIcon, 
    X, 
    Pill, 
    TrendingUp, 
    History, 
    ArrowRight, 
    Activity,
    Clock,
    Command
} from 'lucide-react';
import { medicineService } from '../../services/api';
import { cn } from '../ui';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const trendingSearches = [
        'Paracetamol 500mg',
        'Vitamin C Zinc',
        'Amoxicillin',
        'Azithromycin',
        'Insulin Pen'
    ];

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) setRecentSearches(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleSearch = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const { data } = await medicineService.getAll({ search: query, limit: 5 });
                setResults(data.data.medicines);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(handleSearch, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (medicine) => {
        const newRecent = [medicine.name, ...recentSearches.filter(s => s !== medicine.name)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('recentSearches', JSON.stringify(newRecent));
        navigate(`/medicine/${medicine._id}`);
        onClose();
    };

    const handleRecentClick = (term) => {
        setQuery(term);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-2xl flex flex-col pt-24 px-6 md:px-12"
                >
                    <div className="max-w-4xl mx-auto w-full space-y-12">
                        {/* Search Input Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-[2.5rem] blur opacity-75 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200" />
                            <div className="relative flex items-center bg-white border border-neutral-100 rounded-[2rem] shadow-2xl overflow-hidden">
                                <div className="pl-8 text-neutral-400">
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <SearchIcon size={28} />
                                    )}
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search clinical formulations, brands, or categories..."
                                    className="w-full h-20 pl-6 pr-12 text-2xl font-display font-bold text-neutral-900 placeholder:text-neutral-300 outline-none"
                                />
                                <button 
                                    onClick={onClose}
                                    className="mr-6 p-3 hover:bg-neutral-50 rounded-2xl text-neutral-400 hover:text-neutral-900 transition-all flex items-center gap-2 group/close"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest group-hover/close:text-primary-500 hidden md:block">Esc</span>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Search Body */}
                        <div className="grid md:grid-cols-12 gap-16 overflow-y-auto max-h-[60vh] no-scrollbar pb-12">
                            {/* Results Area */}
                            <div className="md:col-span-7 space-y-10">
                                {results.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[11px] font-black uppercase tracking-[3px] text-primary-500">Clinical Results</h4>
                                            <span className="text-[10px] font-bold text-neutral-400">Matching Formulations</span>
                                        </div>
                                        <div className="space-y-3">
                                            {results.map((med) => (
                                                <button
                                                    key={med._id}
                                                    onClick={() => handleSelect(med)}
                                                    className="w-full group/result bg-white hover:bg-primary-500 p-5 rounded-3xl border border-neutral-50 hover:border-primary-500 transition-all duration-500 flex items-center gap-6 text-left shadow-sm hover:shadow-xl hover:shadow-brand-500/20"
                                                >
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 shrink-0 group-hover/result:border-white/20 transition-colors">
                                                        <img src={med.images?.[0]} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <h5 className="text-lg font-bold text-neutral-900 group-hover/result:text-white transition-colors">{med.name}</h5>
                                                        <p className="text-xs font-bold text-neutral-400 group-hover/result:text-primary-100 transition-colors uppercase tracking-widest">{med.category}</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-neutral-50 group-hover/result:bg-white/10 flex items-center justify-center text-neutral-400 group-hover/result:text-white transition-all">
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : query.length > 1 && !loading ? (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-20 h-20 bg-neutral-50 rounded-[2rem] flex items-center justify-center mx-auto text-neutral-300">
                                            <Activity size={40} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-display font-bold text-neutral-900">Zero Matches in Database</p>
                                            <p className="text-sm text-neutral-400 font-medium">Try checking the spelling or using a generic name.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 text-neutral-900">
                                                <TrendingUp size={18} className="text-primary-500" />
                                                <h4 className="text-[11px] font-black uppercase tracking-[3px]">Trending Now</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {trendingSearches.map(term => (
                                                    <button 
                                                        key={term}
                                                        onClick={() => handleRecentClick(term)}
                                                        className="px-6 py-3 bg-white border border-neutral-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-primary-500 hover:border-primary-500 hover:shadow-lg transition-all active:scale-95"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Area */}
                            <div className="md:col-span-5 space-y-12">
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-neutral-900">
                                            <History size={18} className="text-primary-500" />
                                            <h4 className="text-[11px] font-black uppercase tracking-[3px]">Recent History</h4>
                                        </div>
                                        <div className="space-y-1">
                                            {recentSearches.map((term, i) => (
                                                <button 
                                                    key={i}
                                                    onClick={() => handleRecentClick(term)}
                                                    className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 rounded-2xl transition-all group/hist"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <Clock size={14} className="text-neutral-300 group-hover/hist:text-primary-500" />
                                                        <span className="text-sm font-bold text-neutral-600 group-hover/hist:text-neutral-900">{term}</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-neutral-200 group-hover/hist:text-primary-500 opacity-0 group-hover/hist:opacity-100 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Search Tips Card */}
                                <div className="p-8 bg-neutral-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-elite">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-2 text-primary-400">
                                            <Command size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Search Protocol</span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Generic Search</p>
                                                <p className="text-sm font-medium text-neutral-100">Try searching for ingredients like <span className="text-primary-400 font-bold">"Ibuprofen"</span>.</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Category Search</p>
                                                <p className="text-sm font-medium text-neutral-100">Browse <span className="text-primary-400 font-bold">"Tablets"</span> or <span className="text-primary-400 font-bold">"Wellness"</span> directly.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
