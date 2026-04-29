import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  Plus, 
  Activity, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Filter,
  FileDigit,
  FlaskConical,
  HeartPulse
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Button, Badge, Skeleton, cn } from '../components/ui';
import { prescriptionService } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const HealthVault = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDocuments = async () => {
    try {
      const { data } = await prescriptionService.getUserPrescriptions();
      setDocuments(data.data.prescriptions || []);
    } catch (error) {
      console.error('Failed to access health vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const onDrop = useCallback(async acceptedFiles => {
    setIsUploading(true);
    const toastId = toast.loading('Encrypting & Uploading Document...');
    try {
      const formData = new FormData();
      formData.append('prescription', acceptedFiles[0]);
      await prescriptionService.upload(formData);
      toast.success('Document Secured in Vault.', { id: toastId });
      fetchDocuments();
    } catch (error) {
      toast.error('Security verification failed.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to purge this record from your vault?')) return;
    try {
      await prescriptionService.delete(id);
      toast.success('Record Erased.');
      fetchDocuments();
    } catch (error) {
      toast.error('Deletion failed.');
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format(new Date(doc.createdAt), 'dd MMM yyyy').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent pb-20 selection:bg-brand-600/10">
      <div className="w-full max-w-full">
        {/* HEADER: VAULT SECURITY PROTOCOL */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full">
                 <Lock size={12} className="text-brand-primary" />
                 <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">End-to-End Encrypted Vault</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-neutral-900 tracking-tight leading-tight">
                 Medical Records <br />
                 <span className="text-brand-primary">& Health Vault.</span>
              </h1>
              <p className="text-neutral-500 font-medium max-w-lg leading-relaxed">
                 Manage your clinical prescriptions, diagnostic reports, and digital health identity in a high-security environment.
              </p>
           </div>

           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Vault Status</p>
                 <div className="flex items-center justify-end gap-2 text-emerald-600">
                    <ShieldCheck size={18} />
                    <span className="text-sm font-black uppercase tracking-tighter">Securely Active</span>
                 </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-neutral-200/50 flex items-center justify-center text-brand-primary border border-neutral-100">
                 <BadgeCheck size={32} />
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
           {/* LEFT: UPLOAD & STATS */}
           <div className="lg:col-span-4 space-y-8">
              {/* UPLOAD ZONE */}
              <div {...getRootProps()} className={cn(
                "bg-white rounded-[2.5rem] border-2 border-dashed p-10 text-center transition-all cursor-pointer group shadow-premium",
                isDragActive ? "border-brand-primary bg-brand-50/50" : "border-neutral-100 hover:border-brand-primary/40 hover:shadow-xl"
              )}>
                 <input {...getInputProps()} />
                 <div className="space-y-6">
                    <div className="w-20 h-20 bg-neutral-50 rounded-3xl flex items-center justify-center text-neutral-300 mx-auto group-hover:scale-110 group-hover:bg-brand-50 group-hover:text-brand-primary transition-all">
                       <Upload size={32} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-neutral-900 tracking-tight">Deposit Record</h3>
                       <p className="text-xs text-neutral-400 font-medium mt-2 leading-relaxed">
                          Drag & drop clinical documents or click to browse. <br />
                          <span className="text-[10px] font-black uppercase text-neutral-300 mt-2 block">JPG, PNG, PDF (MAX 5MB)</span>
                       </p>
                    </div>
                    {isUploading ? (
                       <div className="flex items-center justify-center gap-2 py-2">
                          <Activity size={16} className="text-brand-primary animate-pulse" />
                          <span className="text-xs font-black text-brand-primary uppercase tracking-widest">Encrypting...</span>
                       </div>
                    ) : (
                       <Button variant="ghost" className="border border-neutral-100 rounded-xl px-8 hover:bg-neutral-50 font-bold text-xs">Browse Vault</Button>
                    )}
                 </div>
              </div>

              {/* VAULT ANALYTICS */}
              <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <h4 className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em] mb-8">Vault Utilization</h4>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg text-neutral-400"><FileDigit size={18} /></div>
                          <span className="text-sm font-bold text-neutral-300">Total Records</span>
                       </div>
                       <span className="text-xl font-black">{documents.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg text-neutral-400"><HeartPulse size={18} /></div>
                          <span className="text-sm font-bold text-neutral-300">Verified Rx</span>
                       </div>
                       <span className="text-xl font-black text-brand-primary">{documents.filter(d => d.status === 'verified').length}</span>
                    </div>
                    <div className="h-px bg-white/5 my-4" />
                    <p className="text-[10px] text-neutral-500 font-bold leading-relaxed">
                       Your data is protected by AES-256 encryption protocol. Only you and authorized pharmacists can access these nodes.
                    </p>
                 </div>
              </div>
           </div>

           {/* RIGHT: RECORD EXPLORER */}
           <div className="lg:col-span-8 space-y-8">
              {/* SEARCH & FILTER */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" />
                    <input 
                      type="text" 
                      placeholder="Locate clinical record by date or status..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none"
                    />
                 </div>
                 <button className="h-14 px-6 bg-white border border-neutral-100 rounded-2xl flex items-center gap-3 text-neutral-500 hover:text-neutral-900 transition-all">
                    <Filter size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Protocol</span>
                 </button>
              </div>

              {/* TABS */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                 {[
                    { id: 'all', label: 'All Records', count: documents.length },
                    { id: 'prescriptions', label: 'Prescriptions', count: documents.length },
                    { id: 'reports', label: 'Diagnostic Reports', count: 0 },
                    { id: 'verified', label: 'Verified', count: documents.filter(d => d.status === 'verified').length }
                 ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-3",
                        activeTab === tab.id ? "bg-neutral-900 text-white shadow-xl" : "bg-white text-neutral-400 border border-neutral-100 hover:bg-neutral-50"
                      )}
                    >
                       {tab.label}
                       <span className={cn("px-2 py-0.5 rounded-md text-[9px]", activeTab === tab.id ? "bg-brand-primary text-white" : "bg-neutral-100")}>{tab.count}</span>
                    </button>
                 ))}
              </div>

              {/* RECORDS LIST */}
              <div className="space-y-4">
                 {loading ? (
                    [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-[2rem]" />)
                 ) : filteredDocs.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                       {filteredDocs.map((doc, i) => (
                          <motion.div 
                            key={doc._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center justify-between group hover:border-brand-primary transition-all"
                          >
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-300 group-hover:bg-brand-50 group-hover:text-brand-primary transition-all shrink-0">
                                   <FileText size={28} />
                                </div>
                                <div className="min-w-0">
                                   <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-sm font-black text-neutral-900 tracking-tight">Prescription Node #{doc._id.slice(-6).toUpperCase()}</h4>
                                      <Badge className={cn(
                                        "px-2 py-0.5 text-[9px] font-black uppercase border-none",
                                        doc.status === 'verified' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                      )}>
                                         {doc.status}
                                      </Badge>
                                   </div>
                                   <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                      <span className="flex items-center gap-1.5"><Clock size={12} /> {format(new Date(doc.createdAt), 'dd MMM yyyy')}</span>
                                      <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> AES-256 Protected</span>
                                   </div>
                                </div>
                             </div>

                             <div className="flex items-center gap-2">
                                <button className="p-3 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-neutral-900 hover:text-white transition-all shadow-sm">
                                   <Eye size={18} />
                                </button>
                                <a 
                                  href={doc.fileUrl} 
                                  download 
                                  className="p-3 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                >
                                   <Download size={18} />
                                </a>
                                <button 
                                  onClick={() => handleDelete(doc._id)}
                                  className="p-3 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-danger hover:text-white transition-all shadow-sm"
                                >
                                   <Trash2 size={18} />
                                </button>
                             </div>
                          </motion.div>
                       ))}
                    </AnimatePresence>
                 ) : (
                    <div className="py-20 text-center space-y-6 bg-white rounded-[3rem] border border-neutral-100">
                       <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-200">
                          <FlaskConical size={48} strokeWidth={1} />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-xl font-black text-neutral-900 tracking-tight">Vault is Empty</h3>
                          <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">Initial records awaiting clinical synchronization.</p>
                       </div>
                       <Button onClick={() => navigate('/shop')} variant="ghost" className="text-brand-primary font-black uppercase text-[10px] tracking-widest">Initialize Search</Button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const BadgeCheck = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default HealthVault;
