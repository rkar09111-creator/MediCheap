import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, Smartphone, Copy, CheckCircle2, 
  Upload, Loader2, ShieldCheck, ArrowLeft,
  Info, AlertCircle, IndianRupee, Zap, Timer,
  Microscope, Truck, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, cn } from '../components/ui';
import { paymentService, orderService } from '../services/api';
import toast from 'react-hot-toast';

const UpiPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [timeLeft, setTimeLeft] = useState(900); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          orderService.getById(orderId),
          paymentService.getSettings()
        ]);
        setOrder(orderRes.data);
        setSettings(settingsRes.data.upi);
        
        if (orderRes.data.paymentStatus === 'verified' || orderRes.data.paymentStatus === 'screenshot_uploaded') {
          navigate('/orders');
        }
      } catch (error) {
        toast.error('Initialization Error: Gateway Offline');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Registry Alias Copied', {
      style: { background: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) return toast.error('Evidence Artifact Required');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      await paymentService.uploadScreenshot(orderId, formData);
      toast.success('Settlement Logged. Awaiting Auditor Approval.');
      navigate('/orders');
    } catch (error) {
      toast.error('Uplink Interrupted: Verification Protocol Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing Settlement Node...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-12">
           <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Abort Settlement</span>
           </button>
           <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Protocol</span>
                <span className="text-[11px] font-bold text-emerald-600 uppercase">AES-256 Active</span>
              </div>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                <ShieldCheck size={20} />
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Panel: The Receipt & QR */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
              {/* Header Accent */}
              <div className="h-2 bg-emerald-500 w-full" />
              
              <div className="p-10 space-y-10">
                <div className="space-y-1 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Secure Settlement</p>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Order Clearance.</h2>
                </div>

                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable</span>
                    <span className="text-3xl font-black text-slate-900">₹{order.totalAmount}</span>
                  </div>
                  <div className="h-px bg-slate-200/60" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry ID</span>
                    <span className="text-sm font-bold text-slate-600">#{order.orderId || 'ORD-HUB'}</span>
                  </div>
                  <div className={cn(
                    "flex justify-between items-center p-3 rounded-xl border",
                    timeLeft < 60 ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-white border-slate-200 text-slate-900"
                  )}>
                    <span className="text-[9px] font-black uppercase tracking-widest">Link Expiry</span>
                    <div className="flex items-center gap-2">
                       <Timer size={14} />
                       <span className="text-sm font-black font-mono">{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="p-4 bg-white rounded-3xl border-2 border-slate-100 shadow-inner group relative">
                    <img 
                      src={settings.qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${settings.upiId}&pn=${settings.payeeName}&am=${order.totalAmount}&cu=INR`} 
                      className="w-48 h-48 object-contain rounded-xl" 
                      alt="Payment QR" 
                    />
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-2xl cursor-zoom-in">
                       <Badge className="bg-slate-900 text-white border-none">Secure QR Node</Badge>
                    </div>
                  </div>
                  <div className="w-full space-y-3">
                    <button 
                      onClick={() => handleCopy(settings.upiId)}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between px-6 group hover:border-emerald-500 transition-all"
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UPI ID: {settings.upiId}</span>
                      <Copy size={16} className="text-slate-300 group-hover:text-emerald-500" />
                    </button>
                    <div className="flex items-center justify-center gap-4 py-2 opacity-40">
                       <Smartphone size={16} />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Hub Pay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10" />
               <div className="flex gap-4 items-start relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                    <Info size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-tight">Settlement Protocol</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {settings.instructions || 'Scan the QR, execute the transaction, and upload the evidence artifact. All settlements are audited by clinical staff.'}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Panel: The Submission Terminal */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-12 relative overflow-hidden">
               {/* Background Accent */}
               <div className="absolute top-[-100px] right-[-100px] text-slate-50 opacity-20 rotate-12 pointer-events-none">
                  <Upload size={400} />
               </div>

               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Evidence Hub.</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Security Verification Pipeline</p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Awaiting Artifact</span>
                 </div>
               </div>

               <div className="relative group z-10">
                 <input type="file" id="screenshot" accept="image/*" onChange={handleFileChange} className="hidden" />
                 <label 
                   htmlFor="screenshot"
                   className={cn(
                     "flex flex-col items-center justify-center w-full min-h-[350px] border-4 border-dashed rounded-[3rem] transition-all cursor-pointer relative overflow-hidden group",
                     preview ? "border-emerald-500 bg-emerald-50/10" : "border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200"
                   )}
                 >
                   {preview ? (
                     <div className="absolute inset-0 p-8 flex items-center justify-center">
                        <img src={preview} className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl" alt="Preview" />
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center rounded-[3rem]">
                           <div className="bg-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                             <RefreshCcw size={14} /> Replace Artifact
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-6 text-center">
                        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 shadow-inner group-hover:scale-110 group-hover:text-emerald-500 transition-all">
                           <Upload size={32} />
                        </div>
                        <div className="space-y-2">
                           <p className="text-xl font-black text-slate-900">Drop Evidence Here.</p>
                           <p className="text-xs text-slate-400 font-medium">Capture your transaction confirmation screen</p>
                        </div>
                        <div className="px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest group-hover:scale-105 transition-all shadow-xl shadow-slate-900/20">
                           Browse File System
                        </div>
                     </div>
                   )}
                 </label>
               </div>

               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button 
                    onClick={() => navigate('/orders')}
                    variant="ghost" 
                    className="h-20 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Postpone Settlement
                  </Button>
                  <Button 
                    disabled={!screenshot || submitting}
                    onClick={handleSubmit}
                    className="h-20 bg-emerald-500 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : (
                      <>
                        Commit Settlement <Zap size={18} className="fill-white group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </Button>
               </div>

               {/* Verification Timeline */}
               <div className="pt-12 border-t border-slate-50 grid grid-cols-3 gap-4">
                  {[
                    { label: 'Artifact Upload', desc: 'Secure Uplink', icon: Upload, active: !!screenshot },
                    { label: 'Clinical Audit', desc: 'Registry Verification', icon: Microscope, active: false },
                    { label: 'Order Dispatch', desc: 'Logistics Release', icon: Truck, active: false }
                  ].map((step, i) => (
                    <div key={i} className={cn("space-y-3 transition-opacity", step.active ? "opacity-100" : "opacity-30")}>
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", step.active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>
                         <step.icon size={18} />
                       </div>
                       <div className="space-y-0.5">
                         <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">{step.label}</p>
                         <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{step.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100 flex gap-6 items-start">
               <AlertCircle size={24} className="text-rose-500 shrink-0 mt-1" />
               <div className="space-y-1">
                 <h5 className="font-black text-rose-900 text-xs uppercase tracking-[0.2em]">Compliance Alert</h5>
                 <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                   Providing falsified settlement artifacts constitutes a clinical registry violation. Our auditors cross-reference transaction IDs with institutional banking telemetry.
                 </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpiPayment;
