import React, { useState, useEffect } from 'react';
import { 
  Plus, MapPin, Home, Building2, 
  Hotel, Star, Edit3, Trash2, 
  CheckCircle2, Loader2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddressStore } from '../../store/addressStore';
import AddressFormModal from './AddressFormModal';
import { Button, Badge, cn } from '../ui';
import toast from 'react-hot-toast';

const AddressSelector = ({ selectedAddressId, onSelect }) => {
  const { addresses, fetchAddresses, deleteAddress, loading } = useAddressStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEdit = (e, addr) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Terminate this registry node?')) {
      await deleteAddress(id);
      toast.success('Node Decommissioned');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-neutral-900 tracking-tight">Delivery Hub.</h3>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Select authorized fulfillment destination</p>
        </div>
        <Button 
          onClick={() => { setEditingAddress(null); setIsModalOpen(true); }}
          variant="outline" 
          className="h-12 px-6 rounded-full border-emerald-500 text-emerald-600 font-black text-[10px] uppercase tracking-widest gap-2 bg-emerald-50 hover:bg-emerald-100"
        >
          <Plus size={16} /> Add Registry Node
        </Button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {addresses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-12 bg-neutral-25 border-2 border-dashed border-neutral-100 rounded-[2.5rem] text-center space-y-4"
            >
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-neutral-300 mx-auto shadow-inner">
                <MapPin size={32} />
              </div>
              <div>
                <p className="text-lg font-black text-neutral-900">No Authorized Nodes Found.</p>
                <p className="text-sm text-neutral-400 font-medium">Please register a fulfillment destination to continue</p>
              </div>
            </motion.div>
          ) : (
            addresses.map((addr) => (
              <motion.div
                key={addr._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onSelect(addr)}
                className={cn(
                  "relative group cursor-pointer p-8 rounded-[2rem] border-2 transition-all duration-300",
                  selectedAddressId === addr._id 
                    ? "bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-500/10" 
                    : "bg-white border-neutral-100 hover:border-emerald-200"
                )}
              >
                {selectedAddressId === addr._id && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 rounded-l-full" />
                )}

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex gap-6 items-start">
                    <div className={cn(
                      "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all",
                      selectedAddressId === addr._id ? "bg-emerald-500 text-white" : "bg-neutral-50 text-neutral-400"
                    )}>
                      {addr.label === 'Home' && <Home size={28} />}
                      {addr.label === 'Work' && <Building2 size={28} />}
                      {addr.label === 'Hotel' && <Hotel size={28} />}
                      {addr.label === 'Other' && <MapPin size={28} />}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{addr.label}</span>
                        {addr.isDefault && (
                          <Badge className="bg-amber-500 text-white border-none py-0.5 px-2 text-[8px] font-black uppercase tracking-widest">Primary</Badge>
                        )}
                        {selectedAddressId === addr._id && (
                          <Badge className="bg-neutral-900 text-white border-none py-0.5 px-2 text-[8px] font-black uppercase tracking-widest">Target Node</Badge>
                        )}
                      </div>
                      <p className="text-xl font-black text-neutral-900 tracking-tight">{addr.fullName} • {addr.phone}</p>
                      <p className="text-sm text-neutral-400 font-medium leading-relaxed max-w-md">
                        {addr.flatNo}, {addr.buildingName && `${addr.buildingName}, `}{addr.streetArea}, {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      {addr.landmark && (
                        <p className="text-[11px] text-neutral-300 font-bold flex items-center gap-2">
                          <MapPin size={10} /> {addr.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button 
                      onClick={(e) => handleEdit(e, addr)}
                      className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, addr._id)}
                      className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AddressFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editAddress={editingAddress} 
      />
    </div>
  );
};

export default AddressSelector;
