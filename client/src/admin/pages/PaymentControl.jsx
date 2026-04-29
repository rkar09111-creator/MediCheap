import React, { useState, useEffect } from 'react';
import { 
  DollarSign, QrCode, ShieldCheck, Clock, 
  CheckCircle2, XCircle, Eye, Download, 
  Settings, Zap, AlertCircle, Search,
  Filter, MoreHorizontal, ArrowUpRight, Banknote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, cn } from '../../components/ui';
import { paymentService } from '../../services/api';
import toast from 'react-hot-toast';

const PaymentControl = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const [loading, setLoading] = useState(true);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [upiSettings, setUpiSettings] = useState({
    upiId: '',
    payeeName: '',
    instructions: '',
    qrImageUrl: ''
  });
  const [codSettings, setCodSettings] = useState({
    isActive: true,
    maxAmount: 5000,
    instructions: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'verification') {
        const { data } = await paymentService.getPending();
        setPendingPayments(data.data || []);
      } else {
        const { data } = await paymentService.getSettings();
        setUpiSettings(data.upi);
        setCodSettings(data.cod);
      }
    } catch (error) {
      toast.error('Clinical Registry access failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUpi = async (e) => {
    e.preventDefault();
    try {
      await paymentService.updateUpi(upiSettings);
      toast.success('UPI Telemetry Updated Successfully');
    } catch (error) {
      toast.error('Update Protocol Failed');
    }
  };

  const handleUpdateCod = async (e) => {
    e.preventDefault();
    try {
      await paymentService.updateCod(codSettings);
      toast.success('COD Parameters Synchronized');
    } catch (error) {
      toast.error('Synchronization Failure');
    }
  };

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('qr', file);
    try {
      const { data } = await paymentService.uploadQr(formData);
      setUpiSettings({ ...upiSettings, qrImageUrl: data.url });
      toast.success('QR Matrix Deployed');
    } catch (error) {
      toast.error('QR Deployment Failed');
    }
  };

  const handleVerify = async (orderId) => {
    try {
      await paymentService.verify(orderId, 'Verified by Admin Command');
      toast.success('Payment Verified. Order Dispatch Authorized.');
      setPendingPayments(prev => prev.filter(p => p._id !== orderId));
    } catch (error) {
      toast.error('Verification Protocol Error');
    }
  };

  const handleReject = async (orderId) => {
    try {
      await paymentService.reject(orderId, 'Falsified or Invalid Evidence detected.');
      toast.error('Payment Rejected. Order Decommissioned.');
      setPendingPayments(prev => prev.filter(p => p._id !== orderId));
    } catch (error) {
      toast.error('Rejection Protocol Error');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Silo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <DollarSign className="text-emerald-500" size={36} />
            Financial Command
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage institutional clearance and payment nodes.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('verification')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
              activeTab === 'verification' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Verification Queue
            {pendingPayments.length > 0 && (
              <span className="ml-2 bg-rose-500 text-white px-1.5 py-0.5 rounded-md text-[10px]">{pendingPayments.length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
              activeTab === 'settings' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Gateway Config
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'verification' ? (
          <motion.div 
            key="verification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="admin-card p-20 flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Scanning Financial Ledger...</p>
              </div>
            ) : pendingPayments.length === 0 ? (
              <div className="admin-card p-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Ledger Balanced</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">All payment screenshots have been verified or rejected. No pending telemetry detected.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingPayments.map(order => (
                  <motion.div 
                    layout
                    key={order._id}
                    className="admin-card p-0 overflow-hidden group hover:border-emerald-500/50 transition-all duration-500"
                  >
                    <div className="relative h-64 bg-slate-900 overflow-hidden">
                      <img 
                        src={order.paymentScreenshot} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 cursor-zoom-in" 
                        alt="Payment Evidence"
                        onClick={() => setSelectedImage(order.paymentScreenshot)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Order Ref</p>
                          <h4 className="text-white font-bold text-sm">#{order.orderId || order._id.slice(-8).toUpperCase()}</h4>
                        </div>
                        <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20">₹{order.totalAmount}</Badge>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Identity</p>
                          <p className="text-sm font-bold text-slate-900">{order.user?.name || 'Anonymous Patient'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                          <p className="text-[11px] font-medium text-slate-600">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          onClick={() => handleReject(order._id)}
                          className="h-11 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2"
                        >
                          <XCircle size={14} /> Reject
                        </Button>
                        <Button 
                          onClick={() => handleVerify(order._id)}
                          className="h-11 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2"
                        >
                          <ShieldCheck size={14} /> Verify
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* UPI Config */}
            <div className="admin-card p-10 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10" />
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                    <QrCode size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">UPI Protocol</h3>
                    <p className="text-xs text-slate-500 font-medium">Configure digital settlement uplink.</p>
                  </div>
               </div>

               <form onSubmit={handleUpdateUpi} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payee Registry Name</label>
                       <input 
                          type="text" 
                          value={upiSettings.payeeName}
                          onChange={e => setUpiSettings({...upiSettings, payeeName: e.target.value})}
                          className="admin-input h-14 px-5 text-sm font-bold" 
                          placeholder="e.g. MediCheap Health"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UPI Alias ID</label>
                       <input 
                          type="text" 
                          value={upiSettings.upiId}
                          onChange={e => setUpiSettings({...upiSettings, upiId: e.target.value})}
                          className="admin-input h-14 px-5 text-sm font-bold" 
                          placeholder="e.g. medicheap@upi"
                       />
                    </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dispatch Instructions</label>
                     <textarea 
                        rows={4}
                        value={upiSettings.instructions}
                        onChange={e => setUpiSettings({...upiSettings, instructions: e.target.value})}
                        className="admin-input py-4 px-5 text-sm font-medium leading-relaxed" 
                        placeholder="Step-by-step guidance for patients..."
                     />
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center gap-10">
                     <div className="shrink-0 w-40 h-40 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-2 relative group overflow-hidden">
                        {upiSettings.qrImageUrl ? (
                          <img src={upiSettings.qrImageUrl} className="w-full h-full object-contain" alt="QR" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                             <QrCode size={48} />
                             <p className="text-[8px] font-black uppercase tracking-widest mt-2">No QR Matrix</p>
                          </div>
                        )}
                        <input type="file" id="qr-upload" className="hidden" onChange={handleQrUpload} />
                        <label htmlFor="qr-upload" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                           <Badge className="bg-white text-slate-900 border-none text-[9px]">Swap QR</Badge>
                        </label>
                     </div>
                     <div className="space-y-4">
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight leading-none">QR Static Manifest</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                          Deploy a static QR image for instant patient scanning. This bypasses dynamic API calls for maximum reliability.
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-10 px-6 border-slate-200 text-slate-600 rounded-xl font-bold text-[9px] uppercase tracking-widest"
                          onClick={() => document.getElementById('qr-upload').click()}
                        >
                          Select Image Artifact
                        </Button>
                     </div>
                  </div>

                  <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 active:scale-[0.98] transition-all">
                    Update UPI Parameters
                  </Button>
               </form>
            </div>

            {/* COD Config */}
            <div className="space-y-8">
               <div className="admin-card p-10 space-y-10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                          <Banknote size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">COD Gateway</h3>
                          <p className="text-xs text-slate-500 font-medium">Manage cash-on-delivery logistics.</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setCodSettings({...codSettings, isActive: !codSettings.isActive})}
                        className={cn(
                          "w-16 h-8 rounded-full transition-all relative p-1",
                          codSettings.isActive ? "bg-emerald-500" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 bg-white rounded-full shadow-sm transition-all",
                          codSettings.isActive ? "translate-x-8" : "translate-x-0"
                        )} />
                      </button>
                  </div>

                  <form onSubmit={handleUpdateCod} className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Order Cap (₹)</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                          <input 
                             type="number" 
                             value={codSettings.maxAmount}
                             onChange={e => setCodSettings({...codSettings, maxAmount: e.target.value})}
                             className="admin-input h-14 pl-10 pr-5 text-sm font-bold" 
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium ml-1 flex items-center gap-2">
                           <AlertCircle size={10} /> Orders exceeding this amount will force UPI/Wallet settlement.
                        </p>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Courier Protocols</label>
                        <textarea 
                           rows={4}
                           value={codSettings.instructions}
                           onChange={e => setCodSettings({...codSettings, instructions: e.target.value})}
                           className="admin-input py-4 px-5 text-sm font-medium leading-relaxed" 
                           placeholder="Terms and conditions for cash handling..."
                        />
                     </div>

                     <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 active:scale-[0.98] transition-all">
                       Save COD Logistics
                     </Button>
                  </form>
               </div>

               <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                     <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1">
                     <h5 className="font-black text-blue-900 text-sm uppercase tracking-tight">Audit Trail Active</h5>
                     <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                        Every configuration change is logged in the system registry with admin ID and timestamp. Ensure parameters comply with regional clinical delivery laws.
                     </p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-10 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImage} 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl" 
            />
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-all">
              <XCircle size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PaymentControl;
