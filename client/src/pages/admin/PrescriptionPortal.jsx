import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Search, 
    Maximize2, 
    MoreVertical,
    AlertCircle,
    User,
    Calendar,
    ArrowRight,
    Plus
} from 'lucide-react';
import { Button, Card, Badge, cn } from '../../components/ui';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PrescriptionPortal = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRx, setSelectedRx] = useState(null);
    const [filter, setFilter] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const { data } = await api.get('/api/prescriptions');
            setPrescriptions(data.data.prescriptions);
        } catch (error) {
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, status) => {
        try {
            await api.patch(`/api/prescriptions/${id}/review`, { status });
            toast.success(`Prescription ${status} successfully`);
            setSelectedRx(null);
            fetchPrescriptions();
        } catch (error) {
            toast.error('Review submission failed');
        }
    };

    const filteredRx = prescriptions.filter(rx => {
        const matchesFilter = filter === 'all' || rx.status === filter;
        const matchesSearch = rx.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             rx._id.includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Header Terminal */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-neutral-100 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                            <ShieldCheck size={20} className="text-brand-primary animate-pulse" />
                        </div>
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Clinical Compliance Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter leading-none">Prescription <br/><span className="text-neutral-400">Audit.</span></h1>
                    <p className="text-sm text-neutral-400 font-medium tracking-tight">Authenticating institutional pharmaceutical documentation & Rx protocols.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-brand-primary transition-colors" size={24} />
                        <input 
                            type="text" 
                            placeholder="Trace Patient or Document ID..."
                            className="pl-16 pr-8 h-20 bg-neutral-25 border-none rounded-[2rem] text-sm font-black w-96 focus:ring-8 focus:ring-brand-600/10 focus:bg-white transition-all shadow-inner placeholder:text-neutral-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchPrescriptions}
                        className="h-20 w-20 bg-white border-2 border-neutral-100 rounded-[2rem] text-neutral-300 hover:text-brand-primary hover:border-brand-600/30 transition-all shadow-xl shadow-neutral-900/5 flex items-center justify-center group"
                    >
                        <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                </div>
            </div>

            {/* Workflow Pipeline Selector */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-[2.5rem] w-fit border border-neutral-100 shadow-inner">
                {['pending', 'approved', 'rejected', 'all'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={cn(
                            "px-10 h-14 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                            filter === t ? "bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20" : "text-neutral-400 hover:text-neutral-900 hover:bg-white"
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Split Screen Operation */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Verification Queue */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between ml-2 mb-2">
                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Pending Authentication Queue</h4>
                        <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest bg-brand-600/5 px-4 py-1.5 rounded-full border border-brand-600/10">{filteredRx.length} Active Traces</span>
                    </div>
                    
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-52 bg-white rounded-[3.5rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 gap-8">
                            <Loader2 size={48} className="animate-spin text-brand-primary" />
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Synchronizing Compliance Nodes...</p>
                        </div>
                    ) : filteredRx.length > 0 ? (
                        <div className="space-y-4">
                            {filteredRx.map((rx, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.8 }}
                                    key={rx._id}
                                    onClick={() => setSelectedRx(rx)}
                                    className={cn(
                                        "group p-10 bg-white border-2 rounded-[3rem] flex items-center justify-between cursor-pointer transition-all duration-700 shadow-2xl shadow-neutral-900/5",
                                        selectedRx?._id === rx._id ? "border-brand-primary ring-12 ring-brand-600/5" : "border-transparent hover:border-neutral-100"
                                    )}
                                >
                                    <div className="flex items-center gap-10">
                                        <div className="w-24 h-24 bg-neutral-50 rounded-[2rem] overflow-hidden border border-neutral-100 relative shadow-inner group-hover:scale-105 transition-transform duration-700">
                                            <img src={rx.imageUrl} alt="Prescription" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                                            <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                                <Maximize2 className="text-white" size={28} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4">
                                                <p className="font-display font-black text-neutral-900 tracking-tighter text-2xl group-hover:text-brand-primary transition-colors">{rx.user?.name || 'Anonymous Patient'}</p>
                                                <span className={cn(
                                                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                                                    rx.status === 'approved' ? "bg-brand-600/5 text-brand-primary border-brand-600/10" : 
                                                    rx.status === 'rejected' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {rx.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.3em]">Token: MC-RX-{rx._id.slice(-8)}</p>
                                                <div className="w-1 h-1 bg-neutral-200 rounded-full" />
                                                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.3em]">{new Date(rx.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[9px] font-black text-neutral-300 uppercase tracking-[0.4em] mb-1">Audit Pipeline</p>
                                            <p className="text-base font-black text-neutral-700 uppercase tracking-tighter">{rx.status === 'pending' ? 'Review Protocol' : 'Archived Trace'}</p>
                                        </div>
                                        <div className={cn(
                                            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700",
                                            selectedRx?._id === rx._id ? "bg-brand-primary text-white shadow-2xl shadow-brand-600/30" : "bg-neutral-50 text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white"
                                        )}>
                                            <ChevronRight size={32} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-48 text-center bg-white rounded-[4rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 space-y-8 flex flex-col items-center justify-center">
                            <div className="w-28 h-28 bg-neutral-25 rounded-[2.5rem] flex items-center justify-center text-neutral-200 shadow-inner">
                                <FileText size={56} strokeWidth={1} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-neutral-900 font-display font-black text-3xl tracking-tighter uppercase">Queue Synchronized</p>
                                <p className="text-[11px] text-neutral-400 font-black uppercase tracking-[0.4em]">No clinical documents awaiting trace.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Analysis Terminal */}
                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        {selectedRx ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 40 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="sticky top-12"
                            >
                                <div className="p-12 bg-neutral-900 rounded-[4rem] border border-white/5 shadow-elite space-y-12 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                                    
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-display font-black tracking-tighter">Audit Terminal</h3>
                                            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">Prescription SKU Deep Scan</p>
                                        </div>
                                        <button onClick={() => setSelectedRx(null)} className="w-14 h-14 bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white rounded-2xl transition-all flex items-center justify-center border border-white/5 group">
                                            <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                                        </button>
                                    </div>

                                    {/* High Fidelity Preview */}
                                    <div className="aspect-[3/4] bg-neutral-950 rounded-[3rem] overflow-hidden relative group shadow-2xl border border-white/5 ring-1 ring-white/10">
                                        <img 
                                            src={selectedRx.imageUrl} 
                                            alt="Clinical Document" 
                                            className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-neutral-950 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700">
                                            <a 
                                                href={selectedRx.imageUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full h-18 bg-white/10 backdrop-blur-2xl text-white rounded-[1.5rem] flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] border border-white/10 hover:bg-brand-primary transition-all duration-500 group"
                                            >
                                                <Maximize2 size={22} className="group-hover:scale-125 transition-transform" /> Scrutinize Evidence
                                            </a>
                                        </div>
                                    </div>

                                    {/* Identity Block */}
                                    <div className="space-y-10 relative z-10">
                                        <div className="flex items-center gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner group hover:bg-white/10 transition-all duration-500">
                                            <div className="w-16 h-16 bg-brand-primary rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-brand-600/30 group-hover:rotate-6 transition-transform">
                                                <User size={32} strokeWidth={2.5} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Patient Link</p>
                                                <p className="text-xl font-display font-black tracking-tighter uppercase">{selectedRx.user?.name || 'Trace Unknown'}</p>
                                                <p className="text-[11px] font-black text-brand-primary tracking-widest">{selectedRx.phone || 'NO SECURE CONTACT'}</p>
                                            </div>
                                        </div>

                                        {/* Clinical Context */}
                                        {selectedRx.patientInstructions && (
                                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 border-dashed">
                                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                                                    <Activity size={12} className="text-brand-primary" /> Patient Statement
                                                </p>
                                                <p className="text-sm font-medium text-neutral-300 leading-relaxed">"{selectedRx.patientInstructions}"</p>
                                            </div>
                                        )}

                                        {/* Action Node */}
                                        {selectedRx.status === 'pending' ? (
                                            <div className="grid grid-cols-1 gap-4">
                                                <button 
                                                    className="h-20 bg-brand-primary text-white rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-brand-primary-dark transition-all shadow-2xl shadow-brand-600/20 flex items-center justify-center gap-4 group active:scale-95"
                                                    onClick={() => handleReview(selectedRx._id, 'approved')}
                                                >
                                                    <CheckCircle2 size={24} className="group-hover:scale-125 transition-transform" /> Authenticate Rx
                                                </button>
                                                <button 
                                                    className="h-20 bg-white/5 border border-white/10 text-rose-500 rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-rose-500/10 hover:border-rose-500/20 transition-all flex items-center justify-center gap-4 group active:scale-95"
                                                    onClick={() => handleReview(selectedRx._id, 'rejected')}
                                                >
                                                    <XCircle size={24} className="group-hover:scale-125 transition-transform" /> Abort Verification
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "p-10 rounded-[3rem] border-2 flex flex-col items-center gap-6 text-center shadow-2xl transition-all duration-1000",
                                                selectedRx.status === 'approved' ? "bg-brand-600/10 border-brand-600/20 text-brand-primary" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                            )}>
                                                <div className={cn(
                                                    "w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-inner",
                                                    selectedRx.status === 'approved' ? "bg-brand-primary text-white" : "bg-rose-500 text-white"
                                                )}>
                                                    {selectedRx.status === 'approved' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-black uppercase text-[10px] tracking-[0.4em] opacity-60">Compliance Protocol Finalized</p>
                                                    <p className="font-display font-black text-3xl tracking-tighter uppercase">{selectedRx.status} Protocol</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="p-20 text-center bg-white rounded-[4rem] border-2 border-dashed border-neutral-100 space-y-10 flex flex-col items-center justify-center h-[700px] shadow-2xl shadow-neutral-900/5">
                                <div className="w-28 h-28 bg-neutral-25 rounded-[2.5rem] shadow-inner flex items-center justify-center text-neutral-200">
                                    <Activity size={48} strokeWidth={1} className="animate-pulse" />
                                </div>
                                <div className="space-y-4 max-w-[240px]">
                                    <h4 className="text-2xl font-display font-black text-neutral-900 tracking-tighter uppercase">Initialize Scan</h4>
                                    <p className="text-xs text-neutral-400 font-bold leading-relaxed uppercase tracking-[0.1em]">Select a clinical document from the queue to start verification sequence.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionPortal;
