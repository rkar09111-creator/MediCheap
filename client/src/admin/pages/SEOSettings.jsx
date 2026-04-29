import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Search, 
  Image as ImageIcon, 
  Share2, 
  FileCode, 
  Save, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  ChevronRight,
  Eye,
  Smartphone,
  Monitor,
  Layout,
  RefreshCw,
  Clock
} from 'lucide-react';
import { settingService } from '../../services/api';
import { toast } from 'react-hot-toast';

const SEOSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seo, setSeo] = useState({
    titleSuffix: '| MediCheap - Genuine Medicines. Honest Prices.',
    description: 'Order genuine medicines at honest prices with MediCheap. Same-day delivery from licensed pharmacies in Noida and NCR. Genuine prescriptions verified by experts.',
    keywords: 'online pharmacy, medicine delivery noida, medicheap, cheap medicines',
    ogTitle: 'MediCheap | Best Pharmacy in Noida',
    twitterHandle: '@medicheap_india'
  });

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const fetchSeoSettings = async () => {
    try {
      const { data } = await settingService.getAll();
      const settings = data.data.settings;
      if (settings.seo) {
        setSeo(prev => ({ ...prev, ...settings.seo }));
      }
    } catch (error) {
      console.error('Failed to fetch SEO protocols');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(false);
    try {
      await settingService.update({ key: 'seo', value: seo });
      toast.success('SEO Protocols Synchronized.');
    } catch (error) {
      toast.error('Sync failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Search className="w-6 h-6 text-brand-primary" />
            Global SEO & Metadata
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Optimize MediCheap search engine rankings and social media visibility.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-500/20 px-10 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>Save Indexing Rules</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
        <div className="lg:col-span-6 space-y-8">
          {/* CORE METADATA */}
          <div className="admin-card p-8 space-y-6">
            <h3 className="text-lg font-display font-bold text-admin-text-primary border-b border-admin-border pb-4 flex items-center gap-2">
               <Globe className="w-5 h-5 text-slate-400" /> Default Metadata
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-admin-text-secondary uppercase">Site Title Suffix</label>
                <input 
                  type="text" 
                  value={seo.titleSuffix}
                  onChange={(e) => setSeo({ ...seo, titleSuffix: e.target.value })}
                  className="admin-input h-11 font-medium" 
                />
                <p className="text-[10px] text-admin-text-secondary font-medium">Appended to every page title (e.g., "Paracetamol 500mg {suffix}")</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-admin-text-secondary uppercase">Global Meta Description</label>
                <textarea 
                  className="admin-input min-h-[100px] p-4 text-sm" 
                  value={seo.description}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-admin-text-secondary uppercase">Focus Keywords</label>
                <input 
                  type="text" 
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  className="admin-input h-11" 
                />
              </div>
            </div>
          </div>

          {/* SOCIAL SHARING (OG TAGS) */}
          <div className="admin-card p-8 space-y-6">
            <h3 className="text-lg font-display font-bold text-admin-text-primary border-b border-admin-border pb-4 flex items-center gap-2">
               <Share2 className="w-5 h-5 text-slate-400" /> Social Graph (OG Tags)
            </h3>
            <div className="space-y-6">
              <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary-300 transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-300 flex items-center justify-center mb-4 shadow-sm group-hover:text-primary-500 transition-all"><ImageIcon className="w-6 h-6" /></div>
                 <p className="text-xs font-bold text-admin-text-primary">Upload Default Share Image</p>
                 <p className="text-[10px] text-admin-text-secondary mt-1 uppercase font-bold tracking-widest">Recommended: 1200x630px</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-admin-text-secondary uppercase">OG Title Override</label>
                    <input 
                      type="text" 
                      value={seo.ogTitle}
                      onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                      className="admin-input h-11" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-admin-text-secondary uppercase">Twitter Username</label>
                    <input 
                      type="text" 
                      value={seo.twitterHandle}
                      onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
                      className="admin-input h-11" 
                    />
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           {/* GOOGLE PREVIEW */}
           <div className="admin-card p-8 space-y-6 bg-slate-50 border-dashed border-2">
              <h4 className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.2em] mb-4">Google Search Preview</h4>
              <div className="p-6 bg-white rounded-2xl shadow-xl space-y-2 border border-slate-100">
                 <p className="text-[11px] text-slate-500 font-medium truncate">https://medcheap.co.in › product › paracetamol</p>
                 <h5 className="text-xl text-[#1a0dab] font-normal hover:underline cursor-pointer leading-tight">Paracetamol 500mg {seo.titleSuffix}</h5>
                 <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-3">{seo.description}</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                 <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: '85%' }} /></div>
                 <span className="text-[10px] font-bold text-success uppercase">SEO Score: 85/100</span>
              </div>
           </div>

           {/* SITEMAP & INDEXING */}
           <div className="admin-card p-8 space-y-6">
              <h4 className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest">Indexing Tools</h4>
              <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-primary-50 transition-all border border-slate-100">
                    <div className="flex items-center gap-3"><FileCode className="w-5 h-5 text-slate-400 group-hover:text-primary-500" /> <div className="text-left"><p className="text-xs font-bold text-admin-text-primary">sitemap.xml</p><p className="text-[9px] text-admin-text-secondary font-bold uppercase mt-0.5">Last updated 2h ago</p></div></div>
                    <RefreshCw className="w-4 h-4 text-slate-300 group-hover:rotate-180 transition-transform duration-500" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-primary-50 transition-all border border-slate-100">
                    <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-slate-400 group-hover:text-primary-500" /> <div className="text-left"><p className="text-xs font-bold text-admin-text-primary">Robots.txt Editor</p><p className="text-[9px] text-admin-text-secondary font-bold uppercase mt-0.5">Control bot indexing</p></div></div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                 </button>
              </div>
              <div className="p-4 bg-primary-600 rounded-2xl text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Globe className="w-16 h-16" /></div>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Search Console</p>
                 <h5 className="text-sm font-bold mt-1">Live indexing status</h5>
                 <button className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-all"><ExternalLink className="w-3 h-3" /> Connect Google Console</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SEOSettings;
