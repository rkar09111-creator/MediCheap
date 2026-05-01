import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  MousePointer2, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Save, 
  ExternalLink, 
  Clock, 
  Zap, 
  Star, 
  Megaphone,
  X,
  ChevronRight,
  Monitor,
  Smartphone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Palette,
  Layers,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { bannerService, settingService } from '../../services/api';

const WebsiteCMS = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const [isStoreActive, setIsStoreActive] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await settingService.getAll();
      const s = data.data.settings;
      if (s) {
        setAnnouncement(s.announcement || '');
        setIsStoreActive(s.is_active !== false);
      }
    } catch (error) {
      console.error('Failed to load site settings');
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await settingService.update({ key: 'announcement', value: announcement });
      await settingService.update({ key: 'is_active', value: isStoreActive });
      toast.success('System Parameters Synchronized.');
    } catch (error) {
      toast.error('Sync failed.');
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const { data } = await bannerService.getAll();
      setBanners(data.data.banners);
    } catch (error) {
      console.error('Failed to load visual assets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Erase this asset from the live storefront?')) return;
    try {
      await bannerService.delete(id);
      toast.success('Asset Purged.');
      fetchBanners();
    } catch (error) {
      toast.error('Deletion failed.');
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-4">
            Storefront Control.
            <span className="px-4 py-1 bg-brand-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-brand-600/20">
              Live Environment
            </span>
          </h1>
          <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider mt-2">Manage visual identity and promotional hierarchy.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-elite flex items-center gap-3">
            <Eye size={16} /> View Production Site
          </button>
        </div>
      </div>

      {/* CMS NAV */}
      <div className="flex items-center gap-4 p-2 bg-white border border-neutral-100 rounded-[2rem] shadow-sm overflow-x-auto no-scrollbar w-fit">
        {[
          { id: 'homepage', label: 'Architecture', icon: Layout },
          { id: 'banners', label: 'Visual Banners', icon: ImageIcon },
          { id: 'announcement', label: 'Global Alerts', icon: Megaphone },
          { id: 'theme', label: 'Design System', icon: Palette },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 text-[10px] font-black rounded-[1.5rem] transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === tab.id ? 'bg-neutral-900 text-white shadow-xl' : 'text-neutral-400 hover:bg-neutral-50'}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'banners' && (
          <motion.div 
            key="banners" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">Active Promo Assets</h3>
              <button onClick={() => setShowBannerModal(true)} className="px-6 py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-600/20 hover:scale-105 transition-all flex items-center gap-2">
                <Plus size={16} /> Deploy New Asset
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {loading ? (
                <div className="col-span-2 py-20 text-center"><Loader2 className="animate-spin mx-auto text-brand-primary" /></div>
              ) : banners.map((banner) => (
                <div key={banner._id} className="bg-white rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden group">
                  <div className="aspect-[21/9] bg-neutral-50 relative overflow-hidden">
                    {banner.imageUrl ? (
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-200"><ImageIcon size={60} /></div>
                    )}
                    <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-sm">
                      <button className="p-4 bg-white text-neutral-900 rounded-2xl shadow-2xl hover:scale-110 transition-all"><Edit2 size={20} /></button>
                      <button onClick={() => handleDeleteBanner(banner._id)} className="p-4 bg-white text-rose-500 rounded-2xl shadow-2xl hover:scale-110 transition-all"><Trash2 size={20} /></button>
                    </div>
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl ${banner.isActive ? 'bg-green-500 text-white' : 'bg-neutral-400 text-white'}`}>
                        {banner.isActive ? 'Operational' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-black text-neutral-900 tracking-tight">{banner.title}</h4>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                          <ExternalLink size={10} /> {banner.link || 'Internal Route'}
                        </p>
                      </div>
                      <div className="p-3 bg-neutral-50 text-neutral-400 rounded-2xl"><Layers size={20} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'homepage' && (
          <motion.div 
            key="homepage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-7 space-y-8">
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">Homepage Module Hierarchy</h3>
              <div className="space-y-4">
                {[
                  { title: 'Hero Command Center', type: 'System Core', status: 'Locked' },
                  { title: 'Featured Therapeutics Grid', type: 'Dynamic Module', status: 'Live' },
                  { title: 'Popular Prescriptions', type: 'Data Collection', status: 'Live' },
                  { title: 'Mid-Page Promo Buffer', type: 'Static Asset', status: 'Live' },
                  { title: 'Wellness Tips Terminal', type: 'Blog Sync', status: 'Inactive' },
                ].map((mod, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center justify-between group hover:border-brand-primary transition-all cursor-move">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-neutral-50 text-neutral-300 rounded-2xl flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-brand-primary transition-all"><Layout size={20} /></div>
                      <div>
                        <h4 className="text-sm font-black text-neutral-900 tracking-tight">{mod.title}</h4>
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{mod.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${mod.status === 'Live' || mod.status === 'Locked' ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-neutral-200'}`} />
                      <button className="p-3 bg-neutral-50 text-neutral-300 rounded-xl hover:text-neutral-900 transition-colors opacity-0 group-hover:opacity-100"><Edit2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-6 border-4 border-dashed border-neutral-50 rounded-[2.5rem] text-neutral-300 text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-50 hover:text-neutral-400 hover:border-neutral-100 transition-all flex items-center justify-center gap-4">
                <Plus size={20} /> Inject New Module
              </button>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <h3 className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.4em] text-center">Visual Buffer Preview</h3>
              <div className="bg-neutral-900 p-6 rounded-[4rem] shadow-elite border-[10px] border-neutral-800 relative aspect-[9/18.5] max-w-[340px] mx-auto scale-95">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-neutral-800 rounded-b-[2rem] z-20" />
                <div className="w-full h-full bg-white rounded-[3rem] overflow-y-auto no-scrollbar pt-10">
                  <div className="p-6 flex items-center justify-between border-b border-neutral-50">
                    <div className="w-24 h-6 bg-neutral-900 rounded-lg" />
                    <div className="w-10 h-10 rounded-2xl bg-neutral-100" />
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="w-full aspect-[2/1.1] bg-neutral-900 rounded-[2rem] flex items-center justify-center p-6 text-center">
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest leading-relaxed">Visual Hero Node 01 Loaded</p>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-neutral-50 rounded-2xl border border-neutral-100" />)}
                    </div>
                    <div className="space-y-4 pt-4">
                      <div className="w-32 h-4 bg-neutral-900 rounded-full" />
                      <div className="flex gap-4 overflow-hidden">
                        {[1,2].map(i => (
                          <div key={i} className="min-w-[140px] aspect-[3/4.2] bg-white border border-neutral-100 rounded-[2rem] p-3 shadow-sm">
                            <div className="w-full aspect-square bg-neutral-50 rounded-2xl mb-3" />
                            <div className="w-full h-3 bg-neutral-100 rounded-full mb-1.5" />
                            <div className="w-1/2 h-3 bg-brand-primary/10 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'announcement' && (
          <motion.div 
            key="announcement" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-sm p-12 space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/10"><Megaphone size={40} /></div>
                <div>
                  <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Global Status Bar</h3>
                  <p className="text-sm text-neutral-400 font-bold mt-1">Universal notification broadcast across all client nodes.</p>
                </div>
              </div>

              <div className="space-y-8 pt-8 border-t border-neutral-50">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Broadcast Payload</label>
                  <input 
                    type="text" 
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="w-full px-8 py-5 bg-neutral-50 border-none rounded-[2rem] text-sm font-black focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none" 
                    placeholder="e.g. SYSTEM PROTOCOL: Free Logistics on all orders above ₹500" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Chrome Aesthetic</label>
                    <div className="flex items-center gap-4">
                      {['#024F3A', '#3B82F6', '#F59E0B', '#EF4444', '#0F172A'].map((c) => (
                        <button key={c} className="w-10 h-10 rounded-2xl shadow-xl border-4 border-white transition-transform hover:scale-125" style={{ backgroundColor: c }} />
                      ))}
                      <button className="w-10 h-10 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200 flex items-center justify-center text-neutral-300">+</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Mission Status</label>
                    <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-2xl w-fit">
                      <button 
                        onClick={() => setIsStoreActive(true)}
                        className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isStoreActive ? 'bg-neutral-900 text-white shadow-lg' : 'text-neutral-400'}`}
                      >
                        Active
                      </button>
                      <button 
                        onClick={() => setIsStoreActive(false)}
                        className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isStoreActive ? 'bg-neutral-900 text-white shadow-lg' : 'text-neutral-400'}`}
                      >
                        Offline
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="w-full py-6 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-brand-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {savingSettings ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
                  Update Global Broadcast
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebsiteCMS;
