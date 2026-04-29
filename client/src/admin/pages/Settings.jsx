import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  Users, 
  Mail, 
  Lock, 
  Save, 
  Info, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Monitor,
  Smartphone,
  Layout,
  Database,
  Building,
  Video,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    trustVideoUrl: '',
    support_phone: '',
    support_email: '',
    license_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/api/settings');
      setSettings(data.data.settings);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key, value) => {
    try {
      setSaving(true);
      await api.post('/api/settings', { key, value });
      toast.success('Configuration updated');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="p-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Institutional Config...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-primary-500" />
            Global System Configuration
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Manage core platform behavior, clinical compliance, and financial integrations.</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-8 border-b border-admin-border overflow-x-auto no-scrollbar">
        {[
          { id: 'general', label: 'General', icon: Globe },
          { id: 'trust', label: 'Trust Assets', icon: ShieldCheck },
          { id: 'profile', label: 'Store Profile', icon: Building },
          { id: 'logistics', label: 'Logistics & Shipping', icon: Truck },
          { id: 'payment', label: 'Payments & Gateway', icon: CreditCard },
          { id: 'compliance', label: 'Tax & Compliance', icon: ShieldCheck },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security & Access', icon: Lock },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 pb-4 px-2 text-[11px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' && (
          <motion.div 
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-10 gap-10"
          >
            {/* ... (existing general tab content) */}
          </motion.div>
        )}

        {activeTab === 'trust' && (
          <motion.div 
            key="trust"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-10 gap-10"
          >
            <div className="lg:col-span-6 space-y-8">
              <div className="admin-card p-8 space-y-8">
                <div className="flex items-center gap-4 border-b border-admin-border pb-6">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                    <Video size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-admin-text-primary">Purity Assurance Feed</h3>
                    <p className="text-xs text-admin-text-secondary font-medium">Configure the trust-building video for the shop header.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.2em] ml-1">Video Source URL (Direct MP4)</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        className="admin-input flex-1 h-12" 
                        placeholder="https://assets.mixkit.co/..."
                        value={settings.trustVideoUrl}
                        onChange={(e) => setSettings({...settings, trustVideoUrl: e.target.value})}
                      />
                      <button 
                        onClick={() => handleSave('trustVideoUrl', settings.trustVideoUrl)}
                        disabled={saving}
                        className="admin-btn-primary px-6 h-12 flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Sync</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                    <Info className="text-amber-500 w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-tight">Portrait Optimization Required</p>
                      <p className="text-[10px] text-amber-700 font-medium leading-relaxed mt-1">
                        To maintain institutional visual standards, use a vertical (9:16) video. The storefront automatically applies clinical pixelation and grayscale filters to ensure brand consistency.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="admin-card p-8 space-y-4">
                <h4 className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.2em] mb-4">Storefront Preview</h4>
                <div className="relative aspect-[9/16] bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-admin-border shadow-inner group">
                   <video 
                    key={settings.trustVideoUrl}
                    src={settings.trustVideoUrl}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover grayscale brightness-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/80">Institutional Feed</span>
                      </div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest">Purity Assurance Scan</p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-10 gap-10"
          >
            <div className="lg:col-span-6 space-y-8">
              <div className="admin-card p-8 space-y-8">
                <div className="flex items-center gap-4 border-b border-admin-border pb-6">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-admin-text-primary">Clinical Identity</h3>
                    <p className="text-xs text-admin-text-secondary font-medium">Manage your pharmacy's public contact information and regulatory licenses.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.2em] ml-1">Support Helpline (Visible in Footer)</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        className="admin-input flex-1 h-12" 
                        placeholder="+91 1800-000-0000"
                        value={settings.support_phone}
                        onChange={(e) => setSettings({...settings, support_phone: e.target.value})}
                      />
                      <button 
                        onClick={() => handleSave('support_phone', settings.support_phone)}
                        disabled={saving}
                        className="admin-btn-primary px-6 h-12"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sync'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.2em] ml-1">Support Email Address</label>
                    <div className="flex gap-3">
                      <input 
                        type="email" 
                        className="admin-input flex-1 h-12" 
                        placeholder="care@medicheap.in"
                        value={settings.support_email}
                        onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                      />
                      <button 
                        onClick={() => handleSave('support_email', settings.support_email)}
                        disabled={saving}
                        className="admin-btn-primary px-6 h-12"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sync'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.2em] ml-1">Drug License / Registration Number</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        className="admin-input flex-1 h-12" 
                        placeholder="DL-XXXX/B-XXXXX"
                        value={settings.license_number}
                        onChange={(e) => setSettings({...settings, license_number: e.target.value})}
                      />
                      <button 
                        onClick={() => handleSave('license_number', settings.license_number)}
                        disabled={saving}
                        className="admin-btn-primary px-6 h-12"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sync'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
               <div className="admin-card p-8 bg-slate-900 text-white space-y-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-primary-400" size={20} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-400">Compliance Audit</h4>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Updating clinical identity parameters will reflect immediately on all legal disclosures, footer contacts, and invoice headers across the platform.
                  </p>
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                      <span className="text-white/40">Helpline Status</span>
                      <span className="text-success">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                      <span className="text-white/40">Email Protocol</span>
                      <span className="text-success">Verified</span>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'payment' && (
          <motion.div 
            key="payment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'Razorpay', status: 'Active', icon: 'RP', logoColor: 'bg-blue-600', active: true },
                { name: 'Stripe', status: 'Config Required', icon: 'S', logoColor: 'bg-indigo-600', active: false },
                { name: 'Cash on Delivery', status: 'Active', icon: 'COD', logoColor: 'bg-slate-900', active: true },
              ].map((gateway, i) => (
                <div key={i} className="admin-card p-8 group hover:border-primary-300 transition-all relative">
                   <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${gateway.logoColor} text-white flex items-center justify-center font-bold text-xl shadow-lg`}>{gateway.icon}</div>
                        <div><h3 className="text-xl font-display font-bold text-admin-text-primary">{gateway.name}</h3><span className={`text-[10px] font-bold uppercase tracking-widest ${gateway.active ? 'text-success' : 'text-amber-500'}`}>{gateway.status}</span></div>
                     </div>
                     <button className="w-12 h-6 bg-slate-200 rounded-full relative"><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${gateway.active ? 'right-1 bg-primary-500' : 'left-1'}`} /></button>
                   </div>
                   <div className="space-y-4">
                     <div className="space-y-1.5"><label className="text-[10px] font-bold text-admin-text-secondary uppercase">API Key</label><input type="password" value="••••••••••••••••" readOnly className="admin-input h-10" /></div>
                     <button className="w-full py-3 border border-admin-border rounded-xl text-xs font-bold text-admin-text-secondary hover:bg-slate-50 transition-all">Configure Gateway</button>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
