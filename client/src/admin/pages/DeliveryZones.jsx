import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Navigation, 
  DollarSign, 
  Clock,
  X,
  Save,
  Globe,
  Activity,
  MoreHorizontal
} from 'lucide-react';

const DeliveryZones = () => {
  const [activeZone, setActiveZone] = useState(null);

  const zones = [
    { id: 'ZN-01', name: 'Noida Core (Sector 62)', pincodes: ['201301', '201309'], baseFee: '₹20', minFree: '₹499', status: 'Active', riders: 12 },
    { id: 'ZN-02', name: 'Indirapuram Hyper-local', pincodes: ['201014'], baseFee: '₹35', minFree: '₹599', status: 'Active', riders: 8 },
    { id: 'ZN-03', name: 'Greater Noida West', pincodes: ['201306', '201318'], baseFee: '₹60', minFree: '₹999', status: 'Limited', riders: 4 },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary-500" />
            Delivery Zones & Logistics
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Configure operational boundaries, hyper-local fees, and fulfillment rules.</p>
        </div>
        <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-500/20 px-8">
          <Plus className="w-4 h-4" />
          <span>Add New Zone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {zones.map((zone) => (
          <motion.div 
            key={zone.id}
            whileHover={{ y: -4 }}
            className="admin-card overflow-hidden group border-t-4 border-primary-500"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-admin-text-primary">{zone.name}</h3>
                  <p className="text-[10px] text-admin-text-secondary font-bold uppercase tracking-widest mt-1">Zone ID: {zone.id}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${zone.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{zone.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-admin-text-secondary uppercase">Base Fee</p>
                   <p className="text-base font-display font-bold text-admin-text-primary">{zone.baseFee}</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[10px] font-bold text-admin-text-secondary uppercase">Free Above</p>
                   <p className="text-base font-display font-bold text-admin-text-primary">{zone.minFree}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">Serviced Pincodes:</p>
                <div className="flex flex-wrap gap-2">
                  {zone.pincodes.map(pc => <span key={pc} className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-600 border border-slate-200">{pc}</span>)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-bold text-admin-text-secondary uppercase">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> {zone.riders} Riders Active</span>
                <button className="text-primary-600 hover:underline flex items-center gap-1" onClick={() => setActiveZone(zone)}>Manage Zone <ChevronRight className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-end gap-2">
              <button className="p-2 hover:bg-white rounded-lg text-slate-600 border border-transparent hover:border-admin-border"><Edit2 className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-danger/5 text-danger rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
        <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 group hover:border-primary-300 hover:bg-slate-50 transition-all cursor-pointer">
           <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-500 flex items-center justify-center mb-6 transition-all shadow-sm"><Plus className="w-8 h-8" /></div>
           <p className="text-sm font-bold text-admin-text-secondary group-hover:text-primary-600">Onboard New Region</p>
        </div>
      </div>

      {/* ZONE EDITOR DRAWER */}
      <AnimatePresence>
        {activeZone && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveZone(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-8 border-b border-admin-border flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><MapPin className="w-6 h-6" /></div>
                  <div><h3 className="text-xl font-display font-bold text-admin-text-primary">Zone: {activeZone.name}</h3><p className="text-[10px] text-admin-text-secondary font-bold uppercase tracking-widest mt-1">Configuring regional logistics parameters</p></div>
                </div>
                <button onClick={() => setActiveZone(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                <div className="space-y-6">
                   <h4 className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-widest border-b border-admin-border pb-2">Fee Configuration</h4>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[10px] font-bold text-admin-text-secondary uppercase">Base Delivery Fee</label><div className="relative"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" defaultValue={activeZone.baseFee} className="admin-input pl-12 h-12 font-bold" /></div></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-admin-text-secondary uppercase">Free Delivery Min.</label><div className="relative"><CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" defaultValue={activeZone.minFree} className="admin-input pl-12 h-12 font-bold" /></div></div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-widest border-b border-admin-border pb-2">Pincode Management</h4>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {activeZone.pincodes.map(pc => (
                          <div key={pc} className="px-4 py-2 bg-white border border-admin-border rounded-xl flex items-center gap-3 text-sm font-bold text-admin-text-primary">
                             {pc}
                             <button className="text-slate-300 hover:text-danger"><X className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button className="px-4 py-2 border-2 border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-primary-500 hover:text-primary-600 transition-all">+ Add Pincode</button>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-widest border-b border-admin-border pb-2">Operational Health</h4>
                   <div className="grid grid-cols-3 gap-6">
                      <div className="text-center p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[9px] font-bold text-admin-text-secondary uppercase mb-1">Riders</p><p className="text-xl font-display font-bold text-admin-text-primary">{activeZone.riders}</p></div>
                      <div className="text-center p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[9px] font-bold text-admin-text-secondary uppercase mb-1">Avg. Time</p><p className="text-xl font-display font-bold text-admin-text-primary">32m</p></div>
                      <div className="text-center p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[9px] font-bold text-admin-text-secondary uppercase mb-1">Live Trips</p><p className="text-xl font-display font-bold text-admin-text-primary">6</p></div>
                   </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-10 border-t border-admin-border bg-white flex items-center gap-4">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 shadow-xl flex items-center justify-center gap-2 transition-all">
                   <Save className="w-4 h-4" /> Save Region Config
                </button>
                <button className="flex-1 py-4 border border-danger text-danger rounded-2xl text-xs font-bold hover:bg-danger/5 transition-all flex items-center justify-center gap-2">
                   <AlertCircle className="w-4 h-4" /> Suspend Zone
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryZones;
