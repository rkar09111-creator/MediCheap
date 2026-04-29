import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search as SearchIcon, 
    X, 
    Pill, 
    ShoppingCart, 
    Users, 
    ArrowRight, 
    Loader2,
    Command,
    Search
} from 'lucide-react';
import { searchService } from '../../../services/api';

const AdminSearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
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
                const { data } = await searchService.global(query);
                setResults(data.results || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(handleSearch, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (result) => {
        navigate(result.link);
        onClose();
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.metaKey && e.key === 'k') {
                e.preventDefault();
                // Already open? Logic depends on how it's called
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const ResultIcon = ({ type }) => {
        switch (type) {
            case 'medicine': return <Pill size={16} className="text-brand-green" />;
            case 'order': return <ShoppingCart size={16} className="text-blue-500" />;
            case 'user': return <Users size={16} className="text-purple-500" />;
            default: return <Search size={16} />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
                    />

                    {/* Content Container */}
                    <div className="absolute inset-0 overflow-y-auto py-24 px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200"
                        >
                            {/* Search Header */}
                            <div className="relative border-b border-neutral-100 flex items-center p-4">
                                <div className="pl-2 text-neutral-400">
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin text-brand-green" />
                                    ) : (
                                        <SearchIcon size={20} />
                                    )}
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search medicines, orders, customers..."
                                    className="w-full h-12 pl-4 pr-12 text-lg font-medium text-neutral-900 placeholder:text-neutral-400 outline-none"
                                />
                                <div className="flex items-center gap-2 pr-2">
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-neutral-200 bg-neutral-50 text-[10px] font-mono text-neutral-500">Esc</kbd>
                                    <button 
                                        onClick={onClose}
                                        className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Search Results */}
                            <div className="max-h-[400px] overflow-y-auto admin-scrollbar">
                                {query.length < 2 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                            <Command size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-neutral-600">Start typing to search global registry</p>
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">Search medicines, orders, IDs, or contact details</p>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="py-2">
                                        {results.map((result) => (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                onClick={() => handleSelect(result)}
                                                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 transition-colors text-left group"
                                            >
                                                <div className={`w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0 group-hover:bg-white border border-transparent group-hover:border-neutral-100 transition-all`}>
                                                    {result.image ? (
                                                        <img src={result.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <ResultIcon type={result.type} />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="text-sm font-bold text-neutral-900 truncate">{result.title}</h5>
                                                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                                                            result.type === 'medicine' ? 'bg-green-100 text-green-700' :
                                                            result.type === 'order' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-purple-100 text-purple-700'
                                                        }`}>
                                                            {result.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-neutral-500 truncate mt-0.5">{result.subtitle}</p>
                                                    <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{result.meta}</p>
                                                </div>
                                                <ArrowRight size={14} className="text-neutral-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                ) : !loading && (
                                    <div className="p-12 text-center">
                                        <p className="text-sm font-bold text-neutral-900">No results found for "{query}"</p>
                                        <p className="text-xs text-neutral-500 mt-1">Try searching with a different term</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                                        <kbd className="px-1 py-0.5 rounded border border-neutral-200 bg-white font-mono">↑↓</kbd>
                                        <span>Navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                                        <kbd className="px-1 py-0.5 rounded border border-neutral-200 bg-white font-mono">Enter</kbd>
                                        <span>Select</span>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-brand-green uppercase tracking-widest">
                                    MediCheap Admin Registry
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdminSearchOverlay;
