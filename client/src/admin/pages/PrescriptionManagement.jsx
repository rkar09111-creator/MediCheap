import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ZoomIn, 
  Download, 
  FileText,
  User,
  Calendar,
  MoreVertical,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  X,
  MessageSquare,
  Shield,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminService } from '../../services/api';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';

const PrescriptionManagement = () => {
  const [selectedRx, setSelectedRx] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getPrescriptions();
      // In a real scenario, filtering might happen on backend, but here we do it locally based on the 'filter' state
      const allRx = data.data.prescriptions || [];
      setPrescriptions(allRx.filter(rx => filter === 'all' || rx.status === filter));
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [filter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updatePrescriptionStatus(id, status);
      toast.success(`Protocol updated: ${status.toUpperCase()}`);
      setSelectedRx(null);
      fetchPrescriptions();
    } catch (error) {
      toast.error('Clinical update failed');
    }
  };

  const columns = [
    {
      label: 'Prescription ID',
      key: 'prescriptionId',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-admin-text-primary">#{val || row._id.slice(-6).toUpperCase()}</span>
          <span className="text-[10px] text-admin-text-tertiary uppercase font-medium">{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      label: 'Customer',
      key: 'user',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-admin-bg flex items-center justify-center text-[10px] font-bold text-admin-text-secondary border border-admin-border">
            {val?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-admin-text-primary truncate max-w-[120px]">{val?.name}</span>
        </div>
      )
    },
    {
      label: 'Linked Order',
      key: 'order',
      render: (val) => (
        <span className="text-[10px] font-mono font-bold text-brand-green uppercase bg-brand-green/5 px-2 py-0.5 rounded border border-brand-green/10">
          {val?.orderId || 'Direct'}
        </span>
      )
    },
    {
      label: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text-primary tracking-tight">Clinical Verification</h1>
          <p className="text-xs text-admin-text-tertiary font-medium mt-0.5">Audit medical documentation for regulatory compliance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-admin-bg p-1 rounded-lg border border-admin-border">
            {['pending', 'verified', 'rejected'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setFilter(tab)}
                className={`px-4 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${tab === filter ? 'bg-white text-admin-text-primary shadow-sm' : 'text-admin-text-tertiary hover:text-admin-text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button onClick={fetchPrescriptions} className="w-9 h-9 flex items-center justify-center rounded-lg border border-admin-border bg-white text-admin-text-tertiary hover:text-admin-text-primary transition-colors shadow-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {prescriptions.length > 0 ? (
          prescriptions.map((rx) => (
            <motion.div 
              key={rx._id}
              whileHover={{ y: -4 }}
              className="page-card group cursor-pointer border-t-2 border-brand-green overflow-hidden"
              onClick={() => setSelectedRx(rx)}
            >
              <div className="aspect-[4/5] bg-admin-bg relative overflow-hidden">
                <img src={rx.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-admin-text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-admin-text-primary shadow-xl">
                      <Maximize2 size={18} />
                   </div>
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded text-[9px] font-bold text-admin-text-primary uppercase tracking-wider shadow-sm border border-admin-border">
                   {rx.prescriptionId || rx._id.slice(-6).toUpperCase()}
                </div>
              </div>
              <div className="p-4 space-y-3">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-admin-text-tertiary uppercase tracking-widest">{new Date(rx.createdAt).toLocaleDateString()}</p>
                    <StatusBadge status={rx.status} />
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center text-[10px] font-bold text-brand-green">
                      {rx.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-admin-text-primary truncate">{rx.user?.name}</span>
                 </div>
              </div>
            </motion.div>
          ))
        ) : !loading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 bg-admin-bg/50 border-2 border-dashed border-admin-border rounded-[2rem]">
             <div className="w-16 h-16 rounded-full bg-admin-bg flex items-center justify-center text-admin-text-tertiary/20">
                <ClipboardCheck size={32} />
             </div>
             <div className="text-center">
                <p className="text-sm font-bold text-admin-text-primary">Gallery Neutralized</p>
                <p className="text-xs text-admin-text-tertiary mt-1">All {filter} prescriptions have been processed.</p>
             </div>
          </div>
        )}
      </div>

      {/* INSPECTION MODAL */}
      <AnimatePresence>
        {selectedRx && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRx(null)} className="fixed inset-0 bg-admin-text-primary/20 backdrop-blur-sm z-[110]" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-6 md:inset-10 lg:inset-16 bg-white rounded-[2rem] shadow-modal z-[120] overflow-hidden flex flex-col md:flex-row"
            >
              {/* IMAGE VIEWER */}
              <div className="flex-1 bg-admin-bg relative overflow-hidden flex items-center justify-center p-8 group">
                 <img 
                   src={selectedRx.imageUrl} 
                   className={`max-h-full max-w-full shadow-2xl rounded-lg transition-transform duration-300 ${isZoomed ? 'scale-[2.5] cursor-move' : 'scale-100 cursor-zoom-in'}`} 
                   onClick={() => setIsZoomed(!isZoomed)}
                 />
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur rounded-xl shadow-lg border border-admin-border">
                    <button onClick={() => setIsZoomed(!isZoomed)} className="p-2 hover:bg-admin-bg rounded-lg text-admin-text-secondary transition-colors"><ZoomIn size={18} /></button>
                    <div className="w-px h-4 bg-admin-border mx-1" />
                    <button className="p-2 hover:bg-admin-bg rounded-lg text-admin-text-secondary transition-colors"><Download size={18} /></button>
                 </div>
                 <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-rose-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-rose-500/20">
                    <ShieldAlert size={14} /> Validate Signature
                 </div>
              </div>

              {/* ACTION PANEL */}
              <div className="w-full md:w-[400px] border-l border-admin-border flex flex-col bg-white">
                 <div className="p-6 border-b border-admin-border flex items-center justify-between bg-admin-bg/30">
                    <div>
                       <h3 className="text-lg font-bold text-admin-text-primary">Verification Hub</h3>
                       <p className="text-[10px] text-admin-text-tertiary font-mono uppercase tracking-wider mt-0.5">ID: {selectedRx.prescriptionId || selectedRx._id}</p>
                    </div>
                    <button onClick={() => setSelectedRx(null)} className="w-8 h-8 rounded-lg hover:bg-admin-bg flex items-center justify-center text-admin-text-tertiary">
                       <X size={20} />
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="space-y-4">
                       <h4 className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-widest">Metadata Cluster</h4>
                       <div className="p-4 bg-admin-bg rounded-xl border border-admin-border-2 space-y-3">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-admin-text-tertiary uppercase">Subject</span>
                             <span className="text-xs font-bold text-admin-text-primary">{selectedRx.user?.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-admin-text-tertiary uppercase">Order Node</span>
                             <span className="text-xs font-mono font-bold text-brand-green">#{selectedRx.order?.orderId || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-admin-text-tertiary uppercase">Timestamp</span>
                             <span className="text-xs font-bold text-admin-text-primary">{new Date(selectedRx.createdAt).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-widest">Audit Checklist</h4>
                       <div className="space-y-2">
                          {[
                            "Licensed Practitioner's Signature",
                            "Registration / Seal Presence",
                            "Date Validity (Within 6mo)",
                            "Patient Identity Alignment"
                          ].map((check, i) => (
                            <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-admin-bg cursor-pointer transition-colors group">
                               <input type="checkbox" className="w-4 h-4 border-admin-border rounded text-brand-green focus:ring-brand-green/20" />
                               <span className="text-xs font-medium text-admin-text-secondary group-hover:text-admin-text-primary transition-colors">{check}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="p-6 border-t border-admin-border bg-admin-bg/30 space-y-3">
                    <button 
                      onClick={() => handleStatusUpdate(selectedRx._id, 'verified')}
                      className="btn-admin btn-admin-primary w-full h-11 shadow-lg shadow-green-500/10"
                    >
                       <CheckCircle2 size={16} />
                       <span>Authorize Document</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                       <button className="btn-admin btn-admin-secondary h-10 px-0 flex items-center justify-center gap-2">
                          <MessageSquare size={14} />
                          <span className="text-[10px] uppercase">Query</span>
                       </button>
                       <button 
                         onClick={() => handleStatusUpdate(selectedRx._id, 'rejected')}
                         className="btn-admin btn-admin-danger h-10 px-0 flex items-center justify-center gap-2"
                       >
                          <XCircle size={14} />
                          <span className="text-[10px] uppercase">Reject</span>
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrescriptionManagement;
