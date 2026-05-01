import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Pill, 
    Filter, 
    MoreVertical, 
    Loader2,
    Eye,
    EyeOff,
    Check,
    AlertCircle,
    Shield,
    Activity,
    ChevronDown,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MedicineManagement = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMedicine, setCurrentMedicine] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'Tablet',
        price: '',
        stock: '',
        requiresPrescription: false,
        manufacturer: '',
        description: '',
        sku: '',
        dosage: '',
        sideEffects: '',
        indications: '',
        images: ['']
    });

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/medicines');
            setMedicines(data.data.medicines);
        } catch (error) {
            toast.error('Failed to load medicines');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this medicine?')) return;
        try {
            await api.delete(`/api/medicines/${id}`);
            toast.success('Medicine deleted');
            fetchMedicines();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleToggle = async (id) => {
        try {
            await api.patch(`/api/medicines/${id}/toggle`);
            fetchMedicines();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const processedData = {
            ...formData,
            indications: typeof formData.indications === 'string' ? formData.indications.split(',').map(s => s.trim()) : formData.indications,
            sideEffects: typeof formData.sideEffects === 'string' ? formData.sideEffects.split(',').map(s => s.trim()) : formData.sideEffects
        };
        try {
            if (currentMedicine) {
                await api.put(`/api/medicines/${currentMedicine._id}`, processedData);
                toast.success('Medicine updated');
            } else {
                await api.post('/api/medicines', processedData);
                toast.success('Medicine added');
            }
            setIsModalOpen(false);
            fetchMedicines();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const openModal = (med = null) => {
        if (med) {
            setFormData({
                ...med,
                indications: Array.isArray(med.indications) ? med.indications.join(', ') : med.indications || '',
                sideEffects: Array.isArray(med.sideEffects) ? med.sideEffects.join(', ') : med.sideEffects || '',
                images: Array.isArray(med.images) ? med.images : ['']
            });
            setCurrentMedicine(med);
        } else {
            setFormData({ name: '', category: 'Tablet', price: '', stock: '', requiresPrescription: false, manufacturer: '', description: '', sku: '', dosage: '', sideEffects: '', indications: '', images: [''] });
            setCurrentMedicine(null);
        }
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Header Terminal */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-100 pb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                            <Activity size={20} className="text-brand-primary animate-pulse" />
                        </div>
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Inventory Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter leading-none">Pharma <br/><span className="text-neutral-400">Registry.</span></h1>
                </div>
                <button 
                  onClick={() => openModal()}
                  className="bg-neutral-900 text-white h-20 px-12 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-brand-primary transition-all shadow-2xl shadow-neutral-900/10 flex items-center gap-4 group active:scale-95"
                >
                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" /> Register Clinical SKU
                </button>
            </div>

            {/* Advanced Search Terminal */}
            <div className="bg-white p-8 rounded-[3rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <input 
                      type="text" 
                      placeholder="Search by SKU, Formal Name, or Therapeutic Class..." 
                      className="w-full pl-16 pr-8 h-20 rounded-[2rem] bg-neutral-25 border-none focus:ring-8 focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all shadow-inner placeholder:text-neutral-300"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-brand-primary transition-colors" size={24} />
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none h-20 px-10 bg-white border-2 border-neutral-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 hover:border-brand-600/30 transition-all flex items-center justify-center gap-4 shadow-xl shadow-neutral-900/5 group">
                        <Filter size={18} className="group-hover:scale-110 transition-transform" /> Advanced
                    </button>
                    <div className="relative flex-1 lg:flex-none">
                        <select className="w-full h-20 pl-10 pr-16 bg-neutral-25 border-none rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 outline-none appearance-none cursor-pointer shadow-inner">
                            <option>Sort: Recently Cached</option>
                            <option>Sort: Critical Stock</option>
                            <option>Sort: Alpha-Numeric</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Inventory Terminal Table */}
            <div className="bg-white rounded-[3.5rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 overflow-hidden">
                {loading ? (
                    <div className="p-40 flex flex-col items-center justify-center gap-6">
                        <Loader2 size={48} className="animate-spin text-brand-primary" />
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Synchronizing Inventory Nodes...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Clinical Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Therapeutic Class</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Clinical Value</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Stock Manifest</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] text-center">Active</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] text-right">Terminal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((med) => (
                                    <tr key={med._id} className="hover:bg-neutral-25/50 transition-all duration-700 group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-50 flex items-center justify-center text-neutral-300 border border-neutral-100 shadow-inner group-hover:text-brand-primary transition-all duration-700">
                                                    <Pill size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-display font-black text-neutral-900 text-lg uppercase tracking-tight group-hover:text-brand-primary transition-colors">{med.name}</p>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{med.manufacturer || 'General Pharma'}</p>
                                                        {med.requiresPrescription && (
                                                            <span className="text-[8px] font-black bg-brand-600/10 text-brand-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-brand-600/20">Rx Protocol</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="bg-brand-600/5 text-brand-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-brand-600/10">{med.category}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="font-price font-black text-neutral-900 text-xl tracking-tighter group-hover:scale-110 transition-transform duration-700 inline-block">₹{med.price}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                                    <span className={med.stock < 10 ? 'text-rose-500 animate-pulse' : 'text-neutral-400'}>{med.stock} Units Buffered</span>
                                                    <span className="text-neutral-300">{Math.min(med.stock, 100)}% Capacity</span>
                                                </div>
                                                <div className="w-40 h-2 bg-neutral-50 rounded-full overflow-hidden border border-neutral-100 shadow-inner">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(med.stock, 100)}%` }}
                                                        transition={{ duration: 1.5, ease: "circOut" }}
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            med.stock < 10 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-brand-primary shadow-[0_0_8px_rgba(0,200,83,0.4)]'
                                                        )} 
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <button 
                                              onClick={() => handleToggle(med._id)}
                                              className={cn(
                                                  "w-14 h-7 rounded-full relative transition-all duration-700 shadow-inner",
                                                  med.isAvailable ? 'bg-brand-primary' : 'bg-neutral-200'
                                              )}
                                            >
                                                <div className={cn(
                                                    "absolute top-1 w-5 h-5 bg-white rounded-full shadow-2xl transition-all duration-500",
                                                    med.isAvailable ? 'left-8' : 'left-1'
                                                )} />
                                            </button>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openModal(med)} className="w-12 h-12 bg-neutral-50 text-neutral-400 hover:bg-brand-primary hover:text-white rounded-[1.25rem] transition-all duration-500 flex items-center justify-center shadow-inner group/edit">
                                                    <Edit size={20} className="group-hover/edit:rotate-12 transition-transform" />
                                                </button>
                                                <button onClick={() => handleDelete(med._id)} className="w-12 h-12 bg-neutral-50 text-neutral-400 hover:bg-rose-500 hover:text-white rounded-[1.25rem] transition-all duration-500 flex items-center justify-center shadow-inner group/delete">
                                                    <Trash2 size={20} className="group-hover/delete:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Medical SKU Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white rounded-[3.5rem] w-full max-w-4xl overflow-hidden shadow-elite relative z-10 flex flex-col max-h-[90vh]"
                        >
                            <div className="bg-neutral-900 p-12 text-white flex justify-between items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="space-y-2 relative z-10">
                                    <h2 className="text-4xl font-display font-black tracking-tighter">{currentMedicine ? 'Modify Clinical SKU' : 'Register Clinical SKU'}</h2>
                                    <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.4em]">Inventory Management Hub</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 border border-white/10 group">
                                    <X size={32} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleFormSubmit} className="p-12 space-y-12 overflow-y-auto custom-scrollbar">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Medical Name</label>
                                        <input type="text" className="w-full h-16 rounded-[1.5rem] bg-neutral-25 border-none focus:ring-8 focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all px-8 outline-none shadow-inner" placeholder="e.g. AMX-CLAV 625 DUO" required
                                          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Global SKU Tracer</label>
                                        <input type="text" className="w-full h-16 rounded-[1.5rem] bg-neutral-25 border-none focus:ring-8 focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all px-8 outline-none shadow-inner" placeholder="MC-RX-TRACE-001" 
                                          value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Therapeutic Class</label>
                                        <div className="relative">
                                            <select className="w-full h-16 rounded-[1.5rem] bg-neutral-25 border-none focus:ring-8 focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all px-8 outline-none shadow-inner appearance-none cursor-pointer" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                                <option>Tablet</option>
                                                <option>Syrup</option>
                                                <option>Capsule</option>
                                                <option>Injection</option>
                                                <option>Ointment</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Unit Value (₹)</label>
                                        <input type="number" className="w-full h-16 rounded-[1.5rem] bg-neutral-25 border-none focus:ring-8 focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all px-8 outline-none shadow-inner" placeholder="0.00" required
                                          value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Current Manifest Level</label>
                                        <input type="number" className="w-full h-16 rounded-[1.5rem] bg-neutral-25 border-none focus:ring-8 focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all px-8 outline-none shadow-inner" placeholder="0" required
                                          value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Digital Asset (Image URL)</label>
                                    <input type="text" className="w-full h-16 rounded-[1.5rem] bg-neutral-25 border-none focus:ring-8 focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all px-8 outline-none shadow-inner" placeholder="https://cloud.pharmacy.com/..." 
                                      value={formData.images?.[0] || ''} onChange={(e) => setFormData({...formData, images: [e.target.value]})} />
                                </div>

                                <div className="p-8 bg-brand-600/5 rounded-[2.5rem] border border-brand-600/10 flex items-center justify-between shadow-soft">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl text-brand-primary shadow-xl shadow-brand-600/10 flex items-center justify-center border border-brand-600/5">
                                            <Shield size={28} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-neutral-900 uppercase tracking-tight">Rx Protocol Enforcement</p>
                                            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">Regulatory Prescription Verification Required</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, requiresPrescription: !formData.requiresPrescription})}
                                        className={cn(
                                            "w-16 h-8 rounded-full relative transition-all duration-700 shadow-inner",
                                            formData.requiresPrescription ? 'bg-brand-primary' : 'bg-neutral-200'
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-6 h-6 bg-white rounded-full shadow-2xl transition-all duration-500",
                                            formData.requiresPrescription ? 'left-9' : 'left-1'
                                        )} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] ml-2">Clinical Brief</label>
                                    <textarea className="w-full p-8 rounded-[2rem] bg-neutral-25 border-none focus:ring-8 focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all outline-none h-48 resize-none shadow-inner leading-relaxed" placeholder="Institutional usage guidelines, composition data, and contraindications..."
                                      value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                                </div>

                                <div className="flex gap-6 pt-6">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-20 rounded-[1.5rem] bg-neutral-50 text-neutral-400 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-neutral-100 transition-all active:scale-95">Discard Changes</button>
                                    <button type="submit" className="flex-[2] h-20 rounded-[1.5rem] bg-neutral-900 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-brand-primary transition-all shadow-2xl shadow-neutral-900/10 flex items-center justify-center gap-4 group active:scale-95">
                                        <Check size={24} strokeWidth={3} className="group-hover:scale-125 transition-transform" /> {currentMedicine ? 'Confirm Modifications' : 'Register Clinical SKU'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );

};

export default MedicineManagement;
