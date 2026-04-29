import React, { useState, useEffect } from 'react';
import { 
    Save, 
    Video, 
    Globe, 
    Shield, 
    Info,
    Check,
    Loader2,
    Activity
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SettingsManagement = () => {
    const [settings, setSettings] = useState({
        trustVideoUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/settings');
            setSettings(data.data.settings);
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key, value) => {
        try {
            setSaving(true);
            await api.post('/api/settings', { key, value });
            setSettings(prev => ({ ...prev, [key]: value }));
            toast.success('Setting updated successfully');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-64 flex flex-col items-center justify-center gap-8 bg-white rounded-[4rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5">
                <Loader2 className="w-16 h-16 text-brand-primary animate-spin" strokeWidth={1} />
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Establishing Institutional Link...</p>
            </div>
        );
    }

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
            {/* Header Terminal */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-neutral-100 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
                            <Shield size={20} className="text-brand-primary animate-pulse" />
                        </div>
                        <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em]">Global Node Config</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-neutral-900 tracking-tighter leading-none">System <br/><span className="text-neutral-400">Control.</span></h1>
                    <p className="text-sm text-neutral-400 font-medium tracking-tight">Configure clinical assets, security protocols, and storefront parameters.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Shop Trust Video Configuration */}
                <div className="bg-white p-12 rounded-[4rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 space-y-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-20 h-20 bg-brand-600/10 rounded-[1.75rem] flex items-center justify-center text-brand-primary border border-brand-600/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                            <Video size={36} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-display font-black text-neutral-900 tracking-tighter leading-none uppercase">Purity Feed</h3>
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Shop Institutional Asset</p>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-2">Secure Asset Link (MP4)</label>
                            <div className="relative group/input">
                                <input 
                                    type="text" 
                                    className="w-full h-20 rounded-[2rem] bg-neutral-25 border-none focus:ring-[12px] focus:ring-brand-600/10 focus:bg-white font-black text-sm transition-all px-10 outline-none pr-24 shadow-inner placeholder:text-neutral-300"
                                    placeholder="https://institutional-cdn.net/assets/purity-feed.mp4"
                                    value={settings.trustVideoUrl}
                                    onChange={(e) => setSettings({...settings, trustVideoUrl: e.target.value})}
                                />
                                <button 
                                    onClick={() => handleUpdate('trustVideoUrl', settings.trustVideoUrl)}
                                    disabled={saving}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 px-6 bg-neutral-900 text-white rounded-2xl flex items-center justify-center hover:bg-brand-primary transition-all duration-500 disabled:opacity-50 shadow-xl active:scale-95 group/btn"
                                >
                                    {saving ? <Loader2 size={24} className="animate-spin" /> : <div className="flex items-center gap-3"><Save size={18} /><span className="text-[10px] font-black uppercase tracking-widest">Lock</span></div>}
                                </button>
                            </div>
                        </div>

                        <div className="p-8 bg-brand-600/5 rounded-[2.5rem] border border-brand-600/10 flex items-start gap-5 group/note">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-brand-600/10 group-hover/note:scale-110 transition-transform">
                                <Info size={24} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[11px] text-brand-primary font-black uppercase tracking-[0.2em]">Protocol Optimization</p>
                                <p className="text-[10px] text-neutral-500 font-bold leading-relaxed uppercase tracking-tight">
                                    Recommended: 9:16 aspect ratio vertical video for the Portrait Purity Feed. Use direct MP4 links from professional CDNs for zero-latency authentication.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Window */}
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center justify-between ml-2">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Clinical Preview Node</p>
                            <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest animate-pulse flex items-center gap-2">
                                <Activity size={12} /> Live Render Link
                            </span>
                        </div>
                        <div className="w-full aspect-[9/16] bg-neutral-950 rounded-[3rem] overflow-hidden border-[12px] border-neutral-50 shadow-inner group/video relative">
                            <video 
                                key={settings.trustVideoUrl}
                                src={settings.trustVideoUrl}
                                autoPlay loop muted playsInline
                                className="w-full h-full object-cover grayscale opacity-40 group-hover/video:grayscale-0 group-hover/video:opacity-100 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Security Protocol Node */}
                    <div className="bg-neutral-900 p-12 rounded-[4rem] text-white shadow-elite relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-white/5 rounded-[1.75rem] flex items-center justify-center text-brand-primary border border-white/10 group-hover:scale-110 transition-transform duration-700">
                                    <Shield size={36} strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-display font-black tracking-tighter uppercase">Security OS</h3>
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Encryption Node Active</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { label: 'Cloudflare Firewall', status: 'Optimal', icon: <Globe size={18} /> },
                                    { label: 'RSA-4096 Encryption', status: 'Locked', icon: <Shield size={18} /> },
                                    { label: 'Patient Data Node', status: 'Isolated', icon: <Check size={18} /> },
                                ].map((node, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all duration-500">
                                        <div className="flex items-center gap-4 text-neutral-400 font-black text-[10px] uppercase tracking-widest">
                                            {node.icon}
                                            {node.label}
                                        </div>
                                        <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest bg-brand-600/10 px-4 py-1.5 rounded-full border border-brand-600/10">{node.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* System Information Node */}
                    <div className="bg-white p-12 rounded-[4rem] border border-neutral-100 shadow-2xl shadow-neutral-900/5 space-y-8">
                        <div className="flex items-center gap-4 ml-2">
                            <div className="w-2 h-2 bg-brand-primary rounded-full animate-ping" />
                            <h3 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.5em]">Environment State</h3>
                        </div>
                        <div className="p-8 bg-neutral-25 rounded-[3rem] border border-neutral-100 shadow-inner flex items-center gap-8 group">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-neutral-300 group-hover:text-brand-primary transition-all duration-700 shadow-sm border border-neutral-100 group-hover:rotate-12">
                                <Info size={32} strokeWidth={1} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-lg font-black text-neutral-900 tracking-tighter uppercase leading-none">Institutional Node V2.4</p>
                                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                                    All system updates are synchronized with the Central Pharmacopeia Registry.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsManagement;
