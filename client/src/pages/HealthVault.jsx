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
  HeartPulse,
  BadgeCheck
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
      console.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const onDrop = useCallback(async acceptedFiles => {
    setIsUploading(true);
    const toastId = toast.loading('Uploading your document...');
    try {
      const formData = new FormData();
      formData.append('prescription', acceptedFiles[0]);
      await prescriptionService.upload(formData);
      toast.success('Document uploaded successfully.', { id: toastId });
      fetchDocuments();
    } catch (error) {
      toast.error('Upload failed. Please try again.', { id: toastId });
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
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    try {
      await prescriptionService.delete(id);
      toast.success('Document deleted.');
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
    <div className="bg-transparent selection:bg-brand-600/10">
      <div className="w-full max-w-full">
        {/* HEADER: SIMPLE & CLEAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full">
                 <ShieldCheck size={12} className="text-brand-600" />
                 <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Secure Storage</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                 Prescriptions <br />
                 <span className="text-brand-500">& Records.</span>
              </h1>
              <p className="text-neutral-500 font-medium max-w-lg leading-relaxed">
                 Keep your medical prescriptions and health records in one safe place for easy access and faster orders.
              </p>
           </div>

           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Protection Status</p>
                 <div className="flex items-center justify-end gap-2 text-brand-600">
                    <Lock size={18} />
                    <span className="text-sm font-black uppercase tracking-widest">Fully Secure</span>
                 </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-neutral-200/50 flex items-center justify-center text-brand-500 border border-neutral-100">
                 <ShieldCheck size={32} />
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
           {/* LEFT: UPLOAD */}
           <div className="lg:col-span-4 space-y-8">
              <div {...getRootProps()} className={cn(
                "bg-white rounded-[2.5rem] border-2 border-dashed p-10 text-center transition-all cursor-pointer group shadow-sm",
                isDragActive ? "border-brand-500 bg-brand-50/50" : "border-neutral-100 hover:border-brand-500/40 hover:shadow-xl"
              )}>
                 <input {...getInputProps()} />
                 <div className="space-y-6">
                    <div className="w-20 h-20 bg-neutral-50 rounded-3xl flex items-center justify-center text-neutral-300 mx-auto group-hover:scale-110 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all">
                       <Upload size={32} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-neutral-900 tracking-tight">Upload Prescription</h3>
                       <p className="text-xs text-neutral-400 font-medium mt-2 leading-relaxed">
                          Drag & drop your documents or click to browse. <br />
                          <span className="text-[10px] font-black uppercase text-neutral-300 mt-2 block">JPG, PNG, PDF (MAX 5MB)</span>
                       </p>
                    </div>
                    {isUploading ? (
                       <div className="flex items-center justify-center gap-2 py-2">
                          <Activity size={16} className="text-brand-500 animate-pulse" />
                          <span className="text-xs font-black text-brand-500 uppercase tracking-widest">Uploading...</span>
                       </div>
                    ) : (
                       <Button variant="ghost" className="border border-neutral-100 rounded-xl px-8 hover:bg-neutral-50 font-bold text-xs">Browse Files</Button>
                    )}
                 </div>
              </div>

              {/* STORAGE SUMMARY */}
              <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <h4 className="text-[11px] font-black text-brand-500 uppercase tracking-widest mb-8">Storage Summary</h4>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg text-neutral-400"><FileText size={18} /></div>
                          <span className="text-sm font-bold text-neutral-300">Total Files</span>
                       </div>
                       <span className="text-xl font-black">{documents.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg text-neutral-400"><CheckCircle2 size={18} /></div>
                          <span className="text-sm font-bold text-neutral-300">Approved</span>
                       </div>
                       <span className="text-xl font-black text-brand-500">{documents.filter(d => d.status === 'verified').length}</span>
                    </div>
                    <div className="h-px bg-white/5 my-4" />
                    <p className="text-[10px] text-neutral-500 font-bold leading-relaxed">
                       Your health data is private and encrypted. Only you can view or delete these records.
                    </p>
                 </div>
              </div>
           </div>

           {/* RIGHT: LIST */}
           <div className="lg:col-span-8 space-y-8">
              {/* SEARCH */}
              <div className="relative flex-1 w-full">
                 <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" />
                 <input 
                   type="text" 
                   placeholder="Search your records..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-14 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500/20 transition-all outline-none"
                 />
              </div>

              {/* TABS */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                 {[
                    { id: 'all', label: 'All Files', count: documents.length },
                    { id: 'prescriptions', label: 'Prescriptions', count: documents.length },
                    { id: 'verified', label: 'Approved', count: documents.filter(d => d.status === 'verified').length }
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
                       <span className={cn("px-2 py-0.5 rounded-md text-[9px]", activeTab === tab.id ? "bg-brand-500 text-white" : "bg-neutral-100")}>{tab.count}</span>
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
                            className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center justify-between group hover:border-brand-500 transition-all"
                          >
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-300 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all shrink-0">
                                   <FileText size={28} />
                                </div>
                                <div className="min-w-0">
                                   <div className="flex items-center gap-3 mb-1">
                                      <h4 className="text-sm font-black text-neutral-900 tracking-tight">Document #{doc._id.slice(-6).toUpperCase()}</h4>
                                      <Badge className={cn(
                                        "px-2 py-0.5 text-[9px] font-black uppercase border-none",
                                        doc.status === 'verified' ? "bg-brand-100 text-brand-600" : "bg-amber-100 text-amber-600"
                                      )}>
                                         {doc.status}
                                      </Badge>
                                   </div>
                                   <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                      <span className="flex items-center gap-1.5"><Clock size={12} /> {format(new Date(doc.createdAt), 'dd MMM yyyy')}</span>
                                      <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-brand-500" /> Secure Storage</span>
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
                                  className="p-3 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                >
                                   <Download size={18} />
                                </a>
                                <button 
                                  onClick={() => handleDelete(doc._id)}
                                  className="p-3 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
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
                          <FileText size={48} strokeWidth={1} />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-xl font-black text-neutral-900 tracking-tight">No records found</h3>
                          <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">You haven't uploaded any documents yet.</p>
                       </div>
                       <Button onClick={() => navigate('/shop')} className="bg-neutral-900 text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl">Start Shopping</Button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HealthVault;
