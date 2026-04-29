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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-4xl font-black text-neutral-900 tracking-tighter">Logistics Grid.</h3>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Managed destination hubs for clinical dispatch</p>
        </div>
        <Button 
          onClick={() => { setEditingAddress(null); setIsModalOpen(true); }}
          className="h-16 px-10 bg-emerald-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 flex items-center gap-4 group"
        >
          Deploy New Hub <Plus size={20} className="group-hover:rotate-90 transition-transform" />
        </Button>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-6">
          <div className="w-12 h-12 border-4 border-neutral-100 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Synchronizing Logistics Matrix...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-neutral-50 rounded-[4rem] border-4 border-dashed border-neutral-100 p-20 text-center space-y-6">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-neutral-200 mx-auto shadow-inner">
            <MapPin size={48} />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-black text-neutral-900 tracking-tight">Grid Offline.</h4>
            <p className="text-sm text-neutral-400 font-medium max-w-xs mx-auto">No verified logistics hubs found in your registry. Deploy your first node to enable clinical delivery.</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="h-14 px-8 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
          >
            Initiate Deployment
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {addresses.map((addr) => (
            <motion.div 
              layout
              key={addr._id}
              className={cn(
                "group relative bg-white p-10 rounded-[3.5rem] border-2 transition-all duration-500 overflow-hidden",
                addr.isDefault ? "border-emerald-500 shadow-2xl shadow-emerald-500/10" : "border-neutral-100 hover:border-emerald-200"
              )}
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10" />
              
              <div className="relative z-10 flex items-start justify-between mb-8">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner transition-colors",
                  addr.isDefault ? "bg-emerald-500 text-white" : "bg-neutral-50 text-neutral-400 group-hover:text-emerald-500"
                )}>
                  {getIcon(addr.addressType)}
                </div>
                <div className="flex gap-2">
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
                    <Navigation size={20} />
                  </button>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">{addr.addressType || 'Hub'}</h4>
                  {addr.isDefault && (
                    <Badge className="bg-emerald-500 text-white border-none py-1 px-3 text-[8px] font-black uppercase tracking-widest">Primary Node</Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-bold text-neutral-800 leading-relaxed">
                    {addr.flatNo}, {addr.buildingName}
                  </p>
                  <p className="text-xs font-medium text-neutral-500 leading-relaxed">
                    {addr.streetArea}, {addr.city}
                  </p>
                  <p className="text-xs font-medium text-neutral-500">
                    {addr.state} — {addr.pincode}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <MapIcon size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {addr.coordinates?.lat.toFixed(4)}, {addr.coordinates?.lng.toFixed(4)}
                    </span>
                  </div>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(addr._id)}
                      className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
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
