import React, { useState, useEffect } from 'react';
import { 
  MapPin, Plus, Trash2, Home, Briefcase, 
  Building2, CheckCircle2, MoreVertical, 
  Map as MapIcon, Navigation, Loader2, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge, cn } from '../ui';
import { useAddressStore } from '../../store/addressStore';
import AddressFormModal from '../checkout/AddressFormModal';
import toast from 'react-hot-toast';

const AddressManagement = () => {
  const { addresses, loading, fetchAddresses, deleteAddress, setDefaultAddress } = useAddressStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Decommission this logistics node?')) {
      await deleteAddress(id);
      toast.success('Node Decommissioned');
    }
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id);
    toast.success('Primary Hub Synchronized');
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'home': return <Home size={24} />;
      case 'work': return <Briefcase size={24} />;
      default: return <Building2 size={24} />;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="space-y-1">
          <h3 className="text-5xl font-black text-neutral-900 tracking-tighter uppercase">Logistics Matrix.</h3>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <Navigation size={14} className="text-emerald-500" /> Active Destination Hubs for Clinical Dispatch
          </p>
        </div>
        <Button 
          onClick={() => { setEditingAddress(null); setIsModalOpen(true); }}
          className="h-14 px-10 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-neutral-900/20 flex items-center gap-4 group transition-all hover:scale-[1.02]"
        >
          Deploy New Hub <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        </Button>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-6">
          <div className="w-12 h-12 border-4 border-neutral-100 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Synchronizing Logistics Matrix...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-neutral-100 p-20 text-center space-y-8 shadow-sm">
          <div className="w-24 h-24 bg-neutral-50 rounded-[2.5rem] flex items-center justify-center text-neutral-200 mx-auto shadow-inner">
            <MapPin size={48} />
          </div>
          <div className="space-y-3">
            <h4 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Registry Offline.</h4>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">No verified logistics hubs found in your registry. Deploy your first node to enable clinical delivery protocols.</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-14 px-10 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-primary/20"
          >
            Initiate Node Deployment
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          {addresses.map((addr) => (
            <motion.div 
              layout
              key={addr._id}
              className={cn(
                "group relative bg-white p-10 rounded-[3rem] border border-neutral-100 transition-all duration-700 overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-500/50",
                addr.isDefault && "border-emerald-500/30"
              )}
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-emerald-500/10 transition-colors" />
              
              <div className="relative z-10 flex items-start justify-between mb-10">
                <div className={cn(
                  "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110",
                  addr.isDefault ? "bg-neutral-900 text-brand-primary" : "bg-neutral-50 text-neutral-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                )}>
                  {getIcon(addr.addressType)}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDelete(addr._id)}
                    className="w-12 h-12 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-300 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={() => { setEditingAddress(addr); setIsModalOpen(true); }}
                    className="w-12 h-12 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-300 hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm"
                  >
                    <Icons.PenLine size={20} />
                  </button>
                </div>
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <h4 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">{addr.addressType || 'Hub'}</h4>
                  {addr.isDefault && (
                    <Badge className="bg-emerald-500 text-white border-none py-1.5 px-4 text-[9px] font-black uppercase tracking-widest rounded-lg">Primary Node</Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-lg font-black text-neutral-800 leading-tight tracking-tight">
                    {addr.flatNo}, {addr.buildingName}
                  </p>
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                    {addr.streetArea}, {addr.city}
                  </p>
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    {addr.state} — {addr.pincode}
                  </p>
                </div>

                <div className="pt-8 border-t border-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-300 group-hover:text-neutral-400 transition-colors">
                    <MapIcon size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {addr.coordinates?.lat.toFixed(4)}, {addr.coordinates?.lng.toFixed(4)}
                    </span>
                  </div>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(addr._id)}
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline hover:text-emerald-700"
                    >
                      Set as Primary
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddressFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingAddress}
      />
    </div>
  );
};

export default AddressManagement;
