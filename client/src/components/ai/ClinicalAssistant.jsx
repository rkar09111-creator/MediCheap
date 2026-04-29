import React, { useState, useEffect, useRef } from 'react';
import { 
    MessageSquare, 
    X, 
    Send, 
    Bot, 
    Sparkles, 
    ShieldCheck, 
    Stethoscope, 
    Zap,
    AlertTriangle,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge, cn } from '../ui';
import { medicineService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClinicalAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            type: 'bot', 
            content: "Hello! I am MediBot, your Clinical AI Assistant. I can help you find the most effective medications within your budget. Please note: I am an AI, not a doctor. Always consult a professional.",
            isDisclaimer: true
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [budget, setBudget] = useState(1000);
    const [recommendations, setRecommendations] = useState([]);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await medicineService.getAIRecommendations({ 
                symptoms: input, 
                maxBudget: budget 
            });

            const botMsg = { 
                id: Date.now() + 1, 
                type: 'bot', 
                content: data.data.recommendations.length > 0 
                    ? `Based on your symptoms and ₹${budget} budget, I found these top matches for you:`
                    : "I couldn't find a direct match within your budget. Try adjusting your symptoms or increasing the budget threshold.",
                results: data.data.recommendations
            };

            setMessages(prev => [...prev, botMsg]);
            setRecommendations(data.data.recommendations);
        } catch (error) {
            toast.error('Clinical lookup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-3xl flex items-center justify-center shadow-premium transition-all duration-500",
                    isOpen ? "bg-slate-900 text-white rotate-90" : "bg-primary text-white"
                )}
            >
                {isOpen ? <X size={28} /> : <div className="relative"><Bot size={32} /><Sparkles size={16} className="absolute -top-2 -right-2 text-secondary animate-pulse" /></div>}
            </motion.button>

            {/* Chat Terminal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-2rem)] h-[650px] bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/20 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 bg-slate-900 text-white relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                    <Stethoscope size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black tracking-tight">MediBot v2.0</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Clinical AI Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn("flex flex-col", msg.type === 'user' ? "items-end" : "items-start")}>
                                    <div className={cn(
                                        "max-w-[85%] p-5 rounded-[2rem]",
                                        msg.type === 'user' 
                                            ? "bg-primary text-white rounded-tr-md shadow-lg" 
                                            : "bg-slate-50 text-slate-800 rounded-tl-md border border-slate-100"
                                    )}>
                                        {msg.isDisclaimer && (
                                            <div className="flex items-center gap-2 mb-3 text-amber-600">
                                                <AlertTriangle size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Medical Disclaimer</span>
                                            </div>
                                        )}
                                        <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                                    </div>

                                    {/* Bot Results Grid */}
                                    {msg.results && (
                                        <div className="grid grid-cols-1 gap-3 mt-4 w-full">
                                            {msg.results.map((med) => (
                                                <Card key={med._id} className="p-4 border-slate-100 shadow-soft hover:border-primary/30 transition-all group">
                                                    <div className="flex gap-4">
                                                        <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                                                            <img src={med.images?.[0]} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex justify-between items-start">
                                                                <h5 className="font-black text-slate-900 text-sm">{med.name}</h5>
                                                                <Badge variant="success" className="text-[8px] px-2">Match {med.matchScore}%</Badge>
                                                            </div>
                                                            <p className="text-[10px] font-bold text-slate-400 line-clamp-1">{med.indications.join(', ')}</p>
                                                            <div className="flex items-center justify-between pt-2">
                                                                <span className="font-black text-primary text-sm">₹{med.price}</span>
                                                                <button 
                                                                    onClick={() => navigate('/shop')} 
                                                                    className="text-[9px] font-black uppercase text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
                                                                >
                                                                    View <ChevronRight size={10} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-center gap-3 text-slate-300">
                                    <div className="w-8 h-8 rounded-full border-2 border-t-primary animate-spin"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Analyzing Clinical Data...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 border-t border-slate-50 bg-slate-50/30 shrink-0">
                            <div className="mb-4 space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Max Budget Threshold</span>
                                    <span className="text-primary">₹{budget}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="100" 
                                    max="5000" 
                                    step="100"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Describe symptoms (e.g. Headache, fever)"
                                    className="w-full h-14 pl-6 pr-20 rounded-2xl bg-white border border-slate-100 shadow-soft focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none font-bold text-sm"
                                />
                                <button 
                                    onClick={handleSend}
                                    className="absolute right-2 top-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-lg"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                                <ShieldCheck size={10} className="text-emerald-500" /> Secure Clinical Command Terminal
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClinicalAssistant;
