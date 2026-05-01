import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, 
  Map as MapIcon, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Navigation, 
  User, 
  Phone, 
  TrendingUp, 
  DollarSign, 
  Star,
  Plus,
  ArrowRight,
  ShieldCheck,
  X,
  Clock,
  Package,
  Activity,
  MoreHorizontal
} from 'lucide-react';
import { adminService } from '../../services/api';

const RiderStatusBadge = ({ status }) => {
  const styles = {
    online: 'bg-green-100 text-green-600 border-green-200',
    'on-delivery': 'bg-primary-100 text-primary-600 border-primary-200',
    away: 'bg-amber-100 text-amber-600 border-amber-200',
    offline: 'bg-slate-100 text-slate-400 border-slate-200',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${styles[status] || styles.offline}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' || status === 'on-delivery' ? 'bg-current animate-pulse' : 'bg-current opacity-50'}`} />
      {status.replace(/-/g, ' ')}
    </span>
  );
};

const RiderManagement = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'map'

  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getRiders();
      // Format riders to match the UI expectations
      const formattedRiders = data.data.riders.map(r => ({
        ...r.rider,
        _id: r._id,
        status: r.isOnline ? (r.currentOrder ? 'on-delivery' : 'online') : 'offline',
        currentOrder: r.currentOrder,
        id: `RD-${r._id.slice(-4).toUpperCase()}`,
        avatar: r.rider?.name?.split(' ').map(n => n?.[0] || '').join('') || 'R'
      }));
      setRiders(formattedRiders);
    } catch (error) {
      console.error('Failed to fetch node fleet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Bike className="w-6 h-6 text-primary-500" />
            Rider Fleet & Logistics
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Manage delivery personnel, track live movements, and audit performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-admin-border rounded-xl">
            <button onClick={() => setView('list')} className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest ${view === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>List View</button>
            <button onClick={() => setView('map')} className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest ${view === 'map' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Live Map</button>
          </div>
          <button className="admin-btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> <span>Onboard Rider</span></button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="admin-card h-[600px] relative overflow-hidden bg-slate-100 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-77.0365,38.8977,12,0/800x600?access_token=pk.xxx')] bg-cover opacity-60 grayscale-[0.5]" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center m-auto mb-4 animate-bounce">
                <Navigation className="w-8 h-8 text-primary-500 fill-brand-500/20" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Live Logistics Map Interface</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 font-medium">Tracking 14 riders across Noida, Sector 62. Integration with Mapbox/Google Maps API required for real-time coordinates.</p>
            </div>
            
            {/* FLOATING RIDERS PANEL */}
            <div className="absolute top-6 left-6 w-72 space-y-4">
              <div className="admin-card p-4 shadow-2xl border-none">
                <h4 className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest mb-4">Fleet Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-admin-text-secondary uppercase">Active</p>
                    <p className="text-xl font-bold text-success">{riders.filter(r => r.status === 'online').length}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-admin-text-secondary uppercase">On Trip</p>
                    <p className="text-xl font-bold text-primary-600">{riders.filter(r => r.status === 'on-delivery').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Fleet', value: riders.length, icon: Bike, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Trip', value: riders.filter(r => r.status === 'on-delivery').length, icon: Navigation, color: 'text-primary-600', bg: 'bg-primary-50' },
                { label: 'Online Now', value: riders.filter(r => r.status === 'online').length, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Offline Units', value: riders.filter(r => r.status === 'offline').length, icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-50' },
              ].map((stat, i) => (
                <div key={i} className="admin-card p-5">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}><stat.icon className="w-5 h-5" /></div>
                  <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* TOOLBAR */}
            <div className="admin-card p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
                <input type="text" placeholder="Search by name, ID or vehicle number..." className="admin-input pl-12 h-11 bg-slate-50/50" />
              </div>
              <button className="admin-btn-ghost border border-admin-border h-11"><Activity className="w-4 h-4 mr-2" /> Performance Audit</button>
            </div>

            {/* RIDERS TABLE */}
            <div className="admin-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                      <th className="px-6 py-4">Rider Details</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Current Order</th>
                      <th className="px-6 py-4">Performance</th>
                      <th className="px-6 py-4">Wallet</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {riders.map((rider) => (
                      <tr key={rider.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer" onClick={() => setSelectedRider(rider)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs uppercase shadow-sm">{rider.avatar}</div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-admin-text-primary">{rider.name}</span>
                              <span className="text-[10px] font-mono text-primary-600 font-bold uppercase">{rider.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <RiderStatusBadge status={rider.status} />
                        </td>
                        <td className="px-6 py-4">
                          {rider.currentOrder ? (
                            <div className="flex items-center gap-2 text-xs font-bold text-admin-text-primary">
                              <Package className="w-3.5 h-3.5 text-slate-400" /> {rider.currentOrder}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Idle</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              <span className="text-sm font-bold">{rider.rating}</span>
                            </div>
                            <span className="text-[10px] text-admin-text-secondary font-bold uppercase">{rider.totalOrders} Trips</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-admin-text-primary">{rider.earnings}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-admin-border text-slate-600 shadow-sm"><Eye className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-primary-500 hover:text-white rounded-xl transition-colors shadow-sm"><Phone className="w-4 h-4" /></button>
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-slate-300 group-hover:hidden" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIDER DETAIL DRAWER */}
      <AnimatePresence>
        {selectedRider && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRider(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-6 border-b border-admin-border flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">{selectedRider.avatar}</div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-admin-text-primary">{selectedRider.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <RiderStatusBadge status={selectedRider.status} />
                      <span className="text-[10px] text-admin-text-secondary font-bold uppercase">{selectedRider.id}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedRider(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* QUICK STATS */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-admin-text-secondary uppercase">Rating</p>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-amber-500"><Star className="w-5 h-5 fill-amber-500" /> {selectedRider.rating}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-admin-text-secondary uppercase">Balance</p>
                    <div className="text-xl font-bold text-admin-text-primary">{selectedRider.earnings}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-admin-text-secondary uppercase">Trips</p>
                    <div className="text-xl font-bold text-admin-text-primary">{selectedRider.totalOrders}</div>
                  </div>
                </div>

                {/* VEHICLE & DOCS */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-widest border-b border-admin-border pb-2">Vehicle & Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500"><Bike className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-admin-text-primary uppercase tracking-wider">Registered Vehicle</span>
                      </div>
                      <p className="text-sm font-bold text-admin-text-primary">{selectedRider.vehicle}</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white border border-slate-200 text-success"><ShieldCheck className="w-4 h-4" /></div>
                        <span className="text-xs font-bold text-admin-text-primary uppercase tracking-wider">KYC Status</span>
                      </div>
                      <p className="text-sm font-bold text-success uppercase">Verified & Approved</p>
                    </div>
                  </div>
                </div>

                {/* RECENT TRIPS */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-widest border-b border-admin-border pb-2">Recent Shipments</h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white border border-admin-border rounded-2xl hover:border-primary-300 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors"><Package className="w-5 h-5" /></div>
                          <div>
                            <p className="text-sm font-bold text-admin-text-primary">#MED-10{24-i}</p>
                            <p className="text-[10px] text-admin-text-secondary font-bold uppercase tracking-wider">Delivered • 2.4km • ₹35 Earned</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-8 border-t border-admin-border bg-white flex items-center justify-between gap-4">
                <button className="flex-1 py-3.5 border border-admin-border rounded-2xl text-xs font-bold text-admin-text-secondary hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" /> View Shift History
                </button>
                <button className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 shadow-xl flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" /> Audit Performance
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiderManagement;
