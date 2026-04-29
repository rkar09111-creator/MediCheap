import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Map as MapIcon, 
  Truck, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Navigation, 
  Search,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../services/api';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RiderManagement = () => {
  const [riders, setRiders] = useState([]);
  const [onlineRiders, setOnlineRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      // Fetch all users with role 'rider' (via users API)
      const { data } = await api.get('/api/users');
      const allRiders = data.data.users.filter(u => u.role === 'rider');
      setRiders(allRiders);

      // Fetch online riders locations
      const onlineRes = await api.get('/api/rider/available');
      setOnlineRiders(onlineRes.data.data.riders);
    } catch (error) {
      console.error('Error fetching riders', error);
    } finally {
      setLoading(false);
    }
  };

  const storeLocation = [20.2961, 85.8245];

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
            {/* Header Terminal */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-neutral-100 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                            <Truck size={20} className="text-brand-primary animate-pulse" />
                        </div>
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Fleet Operations Command</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter leading-none">Logistics <br/><span className="text-neutral-400">Fleet.</span></h1>
                    <p className="text-sm text-neutral-400 font-medium tracking-tight">Real-time unit tracking and institutional manifest management.</p>
                </div>
                <div className="flex bg-neutral-50 p-2.5 rounded-[2rem] border border-neutral-100 shadow-inner">
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`h-14 px-10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-4 ${viewMode === 'table' ? 'bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20' : 'text-neutral-400 hover:text-neutral-900 hover:bg-white'}`}
                    >
                        <Users size={20} /> Logistics Manifest
                    </button>
                    <button 
                        onClick={() => setViewMode('map')}
                        className={`h-14 px-10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-4 ${viewMode === 'map' ? 'bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20' : 'text-neutral-400 hover:text-neutral-900 hover:bg-white'}`}
                    >
                        <MapIcon size={20} /> Command Map
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-52 flex flex-col items-center justify-center gap-8 bg-white rounded-[4rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5">
                    <Loader2 size={48} className="animate-spin text-brand-primary" />
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Scanning Operational Units...</p>
                </div>
            ) : viewMode === 'table' ? (
                <div className="bg-white rounded-[3.5rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Unit Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Comm Channel</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Operational Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Fulfillment Count</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] text-right">Terminal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {riders.map((r) => {
                                    const isOnline = onlineRiders.some(or => or.rider._id === r._id);
                                    return (
                                        <tr key={r._id} className="hover:bg-neutral-25/50 transition-all duration-500 group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-50 flex items-center justify-center text-brand-primary border border-neutral-100 shadow-inner group-hover:bg-white transition-all duration-700">
                                                        <span className="font-display font-black text-xl">{r.name.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-display font-black text-neutral-900 text-lg uppercase tracking-tighter">{r.name}</p>
                                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{r.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4 text-neutral-600 font-black text-sm uppercase tracking-tight">
                                                    <div className="p-3 bg-neutral-50 rounded-xl text-neutral-400 group-hover:text-brand-primary transition-colors">
                                                        <Phone size={18} />
                                                    </div>
                                                    {r.phone || 'NO CHANNEL'}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`flex items-center w-fit gap-3 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-700 shadow-sm ${isOnline ? 'text-brand-primary bg-brand-600/5 border-brand-600/10' : 'text-neutral-300 bg-neutral-50 border-neutral-200'}`}>
                                                    <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-brand-primary animate-pulse' : 'bg-neutral-300'}`}></div>
                                                    {isOnline ? 'Sector Online' : 'Unit Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                        <span className="font-display font-black text-neutral-900 text-3xl tracking-tighter leading-none">124</span>
                                                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">Institutional Fulfillments</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                        <button className="w-12 h-12 text-neutral-400 hover:text-brand-primary hover:bg-brand-600/5 rounded-2xl transition-all flex items-center justify-center">
                                                                <Navigation size={22} />
                                                        </button>
                                                        <button className="w-12 h-12 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl transition-all flex items-center justify-center">
                                                                <MoreVertical size={22} />
                                                        </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-in zoom-in-95 duration-700">
                    <div className="bg-white rounded-[4rem] h-[750px] border border-neutral-100 shadow-2xl shadow-neutral-900/10 overflow-hidden relative group">
                        <MapContainer center={storeLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                            
                            {/* Institutional Hub Marker */}
                            <Marker position={storeLocation}>
                                <Popup>
                                    <div className="p-4 space-y-2">
                                        <p className="font-black text-brand-primary uppercase text-[10px] tracking-[0.3em]">Central Hub</p>
                                        <p className="font-display font-black text-neutral-900 text-lg uppercase tracking-tighter">MediCheap HQ</p>
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Unit Markers */}
                            {onlineRiders.map((or) => (
                                <Marker key={or._id} position={[or.currentLocation.lat, or.currentLocation.lng]}>
                                    <Popup>
                                        <div className="p-4 space-y-3">
                                            <p className="font-display font-black text-neutral-900 text-base uppercase tracking-tight">{or.rider.name}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-brand-primary rounded-full animate-ping" />
                                                <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest">Telemetry Stream Active</p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        
                        {/* Command Interface Overlay */}
                        <div className="absolute bottom-12 left-12 z-[1000] space-y-8 pointer-events-none w-full max-w-sm">
                            <motion.div 
                                initial={{ x: -40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className="bg-neutral-900 p-10 rounded-[3.5rem] text-white shadow-elite pointer-events-auto border border-white/5 ring-[12px] ring-neutral-900/20 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="flex items-center gap-6 mb-10 relative z-10">
                                        <div className="w-20 h-20 bg-brand-primary rounded-[1.75rem] flex items-center justify-center shadow-2xl shadow-brand-600/30 group-hover:scale-110 transition-transform duration-700">
                                                <Truck size={40} className="text-white" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                                <h4 className="font-display font-black text-2xl tracking-tighter uppercase leading-none">Fleet Hub</h4>
                                                <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.3em] mt-3 animate-pulse">{onlineRiders.length} Active Unit Traces</p>
                                        </div>
                                </div>
                                
                                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-3 relative z-10">
                                        {onlineRiders.map(or => (
                                                <div key={or._id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-brand-600/30 hover:bg-white/10 transition-all duration-500 cursor-pointer group/item">
                                                        <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[11px] font-black text-neutral-400 group-hover/item:bg-brand-primary group-hover/item:text-white transition-all">
                                                                        {or.rider.name.charAt(0)}
                                                                </div>
                                                                <span className="text-sm font-black uppercase tracking-tight text-neutral-300 group-hover/item:text-white transition-colors">{or.rider.name.split(' ')[0]}</span>
                                                        </div>
                                                        <div className="w-2 h-2 bg-brand-primary rounded-full group-hover/item:animate-ping" />
                                                </div>
                                        ))}
                                        {onlineRiders.length === 0 && (
                                                <div className="py-12 text-center space-y-4">
                                                        <AlertCircle size={48} strokeWidth={1} className="mx-auto text-neutral-700 animate-pulse" />
                                                        <p className="text-[11px] text-neutral-500 font-black uppercase tracking-[0.4em]">Queue Synchronized. No Active Traces.</p>
                                                </div>
                                        )}
                                </div>
                                
                                <button className="w-full mt-10 h-18 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-primary transition-all duration-700 group active:scale-95">
                                        Refresh Operations Hub
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiderManagement;
