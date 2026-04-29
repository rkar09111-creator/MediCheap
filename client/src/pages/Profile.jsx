import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Wallet, 
    ShieldCheck, 
    Settings, 
    ChevronRight, 
    Plus, 
    Trash2, 
    History, 
    FileText, 
    Activity, 
    CreditCard, 
    ArrowUpRight, 
    LogOut,
    CheckCircle2,
    Clock,
    Lock,
    Key,
    Smartphone,
    Bell,
    Shield,
    ShieldAlert,
    RefreshCcw,
    Award,
    HeartPulse,
    Microscope,
    FlaskConical,
    Stethoscope,
    Calendar,
    ArrowRight,
    Search,
    LayoutDashboard,
    Dna,
    ShoppingCart,
    BadgeCheck,
    ShoppingBag,
    Fingerprint,
    Minus,
    ArrowUpCircle,
    Zap,
    Download,
    TrendingUp,
    Radar,
    Cpu,
    Radio,
    Sparkles,
    Gem,
    Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/api';
import toast from 'react-hot-toast';
import { Button, Badge, cn } from '../components/ui';

import AddressManagement from '../components/profile/AddressManagement';

const Profile = () => {
    const { user, logout, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Sync activeTab with URL params
    const activeTab = searchParams.get('tab') || 'dashboard';
    const [isEditing, setIsEditing] = useState(false);

    if (authLoading || !user) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-4 border-neutral-100 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Synchronizing Bio-Data...</p>
            </div>
        );
    }
    
    // Form States
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await authService.updateMe(profileData);
            toast.success('DNA Registry Updated', { icon: '🧬' });
            setIsEditing(false);
        } catch (error) {
            toast.error('Identity Conflict Detected');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Security Mismatch: Keys do not align');
        }
        try {
            await authService.updatePassword(passwordData);
            toast.success('Master Key Rotated', { icon: '🛡️' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Protocol Rejection');
        }
    };

    const handleTopUp = async () => {
        const amount = window.prompt("Input Deployment Amount (₹):");
        if (amount && !isNaN(amount)) {
            try {
                await authService.topUpWallet(Number(amount));
                toast.success(`₹${amount} Deployed to Financial Core`, { icon: '💰' });
                window.location.reload();
            } catch (error) {
                toast.error('Deployment Failed');
            }
        }
    };

    const setActiveTab = (id) => {
        setSearchParams({ tab: id });
    };

    const [stats, setStats] = useState(null);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await authService.getProfileStats();
                setStats(data.data);
            } catch (err) {
                console.error('Failed to fetch profile stats');
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 pb-32">
            
            {/* ━━━ CLINICAL HEADER HUB ━━━ */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-16 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Cpu size={20} className="animate-pulse" />
                        </div>
                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em]">Node: {user?.role?.toUpperCase()} CORE</span>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black text-neutral-900 tracking-tighter leading-none">
                        {activeTab === 'dashboard' && 'Command.'}
                        {activeTab === 'identity' && 'Identity.'}
                        {activeTab === 'matrix' && 'Biology.'}
                        {activeTab === 'addresses' && 'Logistics.'}
                        {activeTab === 'wallet' && 'Ledger.'}
                        {activeTab === 'security' && 'Protocol.'}
                    </h1>
                    <div className="flex items-center gap-6 text-neutral-400 font-bold text-sm uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Radio size={14} className="text-emerald-500" /> Live Telemetry
                        </div>
                        <span>·</span>
                        <div>Registry: #MC-{user?._id?.slice(-8).toUpperCase()}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-neutral-100 shadow-sm">
                    <button onClick={() => setActiveTab('dashboard')} className={cn("px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'dashboard' ? "bg-neutral-900 text-white shadow-xl" : "text-neutral-400 hover:bg-neutral-50")}>Overview</button>
                    <button onClick={() => setActiveTab('identity')} className={cn("px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'identity' ? "bg-neutral-900 text-white shadow-xl" : "text-neutral-400 hover:bg-neutral-50")}>Registry</button>
                    <button onClick={() => setActiveTab('addresses')} className={cn("px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'addresses' ? "bg-neutral-900 text-white shadow-xl" : "text-neutral-400 hover:bg-neutral-50")}>Logistics</button>
                    <button onClick={() => setActiveTab('matrix')} className={cn("px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'matrix' ? "bg-neutral-900 text-white shadow-xl" : "text-neutral-400 hover:bg-neutral-50")}>Matrix</button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                
                {/* ━━━ TAB 1: BENTO COMMAND CENTER ━━━ */}
                {activeTab === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="grid grid-cols-12 gap-8">
                        
                        {/* Box 1: The Bio-Identity Shard (Large) */}
                        <div className="col-span-12 lg:col-span-8 bg-neutral-900 rounded-[4rem] p-12 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/20 transition-all duration-1000" />
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                                <div className="relative">
                                    <div className="w-56 h-56 rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-8xl font-black text-emerald-500 shadow-inner">
                                        {user?.name?.[0]}
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white border-[10px] border-neutral-900 shadow-2xl shadow-emerald-500/20">
                                        <Fingerprint size={32} />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-8 text-center md:text-left">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                            <h2 className="text-6xl font-black tracking-tighter leading-none">{user?.name}</h2>
                                            <div className="px-4 py-1.5 bg-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest text-neutral-900">Verified Identity</div>
                                        </div>
                                        <p className="text-2xl text-neutral-500 font-medium tracking-tight">{user?.email}</p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Uplink Date', value: new Date(user?.createdAt).toLocaleDateString(), icon: Calendar },
                                            { label: 'Total Missions', value: stats?.orderCount || 0, icon: ShoppingBag },
                                            { label: 'Node Status', value: 'Operational', icon: Zap },
                                            { label: 'Encryption', value: 'AES-256', icon: ShieldCheck },
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="flex items-center gap-2 text-[8px] font-black text-neutral-600 uppercase tracking-widest">
                                                    <item.icon size={10} /> {item.label}
                                                </div>
                                                <p className="text-sm font-bold text-neutral-300">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Box 2: The Financial Core (Medium) */}
                        <div className="col-span-12 lg:col-span-4 bg-white rounded-[4rem] border border-neutral-100 p-12 flex flex-col justify-between group hover:border-emerald-200 transition-all shadow-xl shadow-neutral-200/40">
                            <div className="flex items-center justify-between">
                                <div className="w-16 h-16 bg-neutral-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
                                    <Wallet size={28} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">MediWallet Balance</p>
                                    <h4 className="text-4xl font-black text-neutral-900 tracking-tighter">₹{user?.walletBalance || 0}</h4>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-6 bg-neutral-25 rounded-[2rem] border border-neutral-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                                            <TrendingUp size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-neutral-900 uppercase">Growth Index</p>
                                            <p className="text-[10px] text-neutral-400 font-bold">+12% vs last month</p>
                                        </div>
                                    </div>
                                    <button onClick={handleTopUp} className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-all">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <Button onClick={() => setActiveTab('wallet')} className="w-full h-16 bg-neutral-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest">
                                    Deploy Assets
                                </Button>
                            </div>
                        </div>

                        {/* Box 3: Biometric Radar (Medium) */}
                        <div className="col-span-12 lg:col-span-4 bg-white rounded-[4rem] border border-neutral-100 p-12 space-y-10 shadow-lg">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Bio-Radar.</h3>
                                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 animate-pulse">
                                    <HeartPulse size={20} />
                                </div>
                            </div>

                            <div className="relative aspect-square bg-neutral-25 rounded-full flex items-center justify-center overflow-hidden border border-neutral-50">
                                <div className="absolute inset-0 border-4 border-emerald-500/5 rounded-full animate-ping" />
                                <div className="absolute inset-10 border border-emerald-500/10 rounded-full" />
                                <div className="absolute inset-20 border border-emerald-500/20 rounded-full" />
                                <div className="relative z-10 text-center">
                                    <p className="text-[40px] font-black text-neutral-900 leading-none">72</p>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">BPM Core</p>
                                </div>
                                <Radar className="absolute text-emerald-500/10 animate-[spin_4s_linear_infinite]" size={200} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-neutral-25 rounded-3xl border border-neutral-50 text-center">
                                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">O2 Sat</p>
                                    <p className="text-xl font-black text-neutral-900">98%</p>
                                </div>
                                <div className="p-6 bg-neutral-25 rounded-3xl border border-neutral-50 text-center">
                                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Mass Index</p>
                                    <p className="text-xl font-black text-neutral-900">22.4</p>
                                </div>
                            </div>
                        </div>

                        {/* Box 4: The Archive Stream (Large) */}
                        <div className="col-span-12 lg:col-span-8 bg-white rounded-[4rem] border border-neutral-100 p-12 space-y-10 shadow-lg overflow-hidden relative">
                            <div className="absolute top-[-50px] right-[-50px] text-neutral-50 opacity-50 rotate-12">
                                <FileText size={300} />
                            </div>
                            <div className="relative z-10 flex items-center justify-between">
                                <h3 className="text-3xl font-black text-neutral-900 tracking-tighter">Event Archive.</h3>
                                <button className="px-6 py-2 bg-neutral-50 rounded-full text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] hover:bg-neutral-900 hover:text-white transition-all">Stream Logs</button>
                            </div>

                            <div className="relative z-10 grid gap-4">
                                {stats?.recentActivity?.length > 0 ? (
                                    stats.recentActivity.map((log, i) => (
                                        <div key={i} className="group p-8 bg-neutral-25 rounded-[2.5rem] border border-neutral-50 flex items-center justify-between hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer" onClick={() => navigate('/orders')}>
                                            <div className="flex items-center gap-8">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-inner bg-emerald-50 text-emerald-500">
                                                    <Zap size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-neutral-900 text-lg tracking-tight">{log.title}</p>
                                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">{new Date(log.time).toLocaleString()} · Protocol: Secure</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className="bg-white border-neutral-100 text-[8px] font-black px-4 py-2 uppercase tracking-widest text-neutral-500">{log.status}</Badge>
                                                <div className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-300 group-hover:text-emerald-500 group-hover:border-emerald-500 transition-all">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-neutral-400 font-bold uppercase tracking-widest text-xs">No Recent Activity Detected</div>
                                )}
                            </div>
                        </div>

                        {/* Box 5: The Security Obelisk (Full Width) */}
                        <div className="col-span-12 bg-emerald-600 rounded-[5rem] p-16 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <div className="absolute top-0 right-0 w-[400px] h-full bg-white/5 skew-x-12 translate-x-20" />
                            
                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-2xl">
                                        <ShieldCheck size={48} />
                                    </div>
                                    <div className="space-y-2 text-center lg:text-left">
                                        <h3 className="text-4xl font-black tracking-tighter">Maximum Protocol Guard.</h3>
                                        <p className="text-emerald-100 font-medium max-w-lg">Your biometric telemetry and financial assets are protected by quantum-grade AES-256 rotation cycles.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-8 bg-white/10 backdrop-blur-md rounded-[3rem] text-center border border-white/10 min-w-[180px]">
                                        <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Auth Level</p>
                                        <p className="text-2xl font-black">L-9 PRIME</p>
                                    </div>
                                    <div className="p-8 bg-white/10 backdrop-blur-md rounded-[3rem] text-center border border-white/10 min-w-[180px]">
                                        <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Threat Level</p>
                                        <p className="text-2xl font-black">ZERO-NULL</p>
                                    </div>
                                </div>
                                <Button onClick={() => setActiveTab('security')} className="h-20 px-12 bg-white text-emerald-600 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
                                    Security Vault
                                </Button>
                            </div>
                        </div>

                    </motion.div>
                )}

                {/* ━━━ TAB 2: IDENTITY REGISTRY ━━━ */}
                {activeTab === 'identity' && (
                    <motion.div key="identity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-12 gap-10">
                        {/* Shard: Form Node */}
                        <div className="lg:col-span-8 bg-white p-16 rounded-[5rem] border border-neutral-100 shadow-2xl space-y-16">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-4xl font-black text-neutral-900 tracking-tighter">Master Registry.</h3>
                                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Biological & Legal identification nodes</p>
                                </div>
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} className="h-16 px-10 bg-neutral-900 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em]">Open Parameters</Button>
                                ) : (
                                    <div className="flex gap-4">
                                        <Button onClick={() => setIsEditing(false)} variant="ghost" className="h-16 px-6 font-black text-[11px] uppercase tracking-widest text-neutral-400">Lock</Button>
                                        <Button onClick={handleProfileUpdate} className="h-16 px-10 bg-emerald-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/20">Sync DNA</Button>
                                    </div>
                                )}
                            </div>

                            <form className="grid gap-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-6">Registry Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-10 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-emerald-500 transition-all" size={28} />
                                            <input disabled={!isEditing} value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full h-24 pl-24 pr-10 bg-neutral-25 border-none rounded-[3rem] font-bold text-2xl text-neutral-900 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-6">Digital Node (Email)</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-10 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-emerald-500 transition-all" size={28} />
                                            <input disabled={!isEditing} value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full h-24 pl-24 pr-10 bg-neutral-25 border-none rounded-[3rem] font-bold text-2xl text-neutral-900 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] ml-6">Mobile Frequency (Phone)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-10 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-emerald-500 transition-all" size={28} />
                                        <input disabled={!isEditing} value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full h-24 pl-24 pr-10 bg-neutral-25 border-none rounded-[3rem] font-bold text-2xl text-neutral-900 focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Shard: Verification Obelisk */}
                        <div className="lg:col-span-4 bg-neutral-900 rounded-[5rem] p-16 text-white space-y-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                            <div className="relative z-10 w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                                <ShieldCheck size={48} />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <h4 className="text-3xl font-black tracking-tight">Identity Compliance.</h4>
                                <p className="text-neutral-400 font-medium leading-relaxed">Your digital identity is matched against a global healthcare database to ensure authentic medical service delivery.</p>
                            </div>
                            <div className="relative z-10 pt-10 space-y-6">
                                {[
                                    { l: 'KYC Verification', v: 'L-1 Verified', s: 'success' },
                                    { l: 'Biometric Sync', v: 'Active', s: 'success' },
                                    { l: 'DNA Token', v: 'Secure', s: 'success' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{item.l}</span>
                                        <span className="text-xs font-black text-emerald-400">{item.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* ━━━ TAB 4: LOGISTICS GRID ━━━ */}
                {activeTab === 'addresses' && (
                    <motion.div key="addresses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <AddressManagement />
                    </motion.div>
                )}

                {/* ━━━ TAB 3: MATRIX ━━━ */}
                {activeTab === 'matrix' && (
                    <motion.div key="matrix" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-12 gap-10">
                        {/* Box: Vitals Terminal */}
                        <div className="col-span-12 lg:col-span-12 bg-white p-20 rounded-[6rem] border border-neutral-100 shadow-2xl space-y-20 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-20 text-neutral-50 opacity-20 pointer-events-none">
                                <Microscope size={500} />
                            </div>
                            
                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                                <div className="space-y-4 text-center lg:text-left">
                                    <h3 className="text-6xl font-black text-neutral-900 tracking-tighter">Bio-Telemetry Matrix.</h3>
                                    <div className="flex items-center justify-center lg:justify-start gap-4">
                                        <Badge className="bg-emerald-500 text-white border-none py-2 px-4">Live Stream</Badge>
                                        <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Protocol: Medical-Grade encryption active</span>
                                    </div>
                                </div>
                                <Button className="h-20 px-16 bg-neutral-900 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] flex items-center gap-6 shadow-2xl">
                                    Synchronize Bio-Link <RefreshCcw size={24} />
                                </Button>
                            </div>

                            <div className="relative z-10 grid md:grid-cols-3 lg:grid-cols-4 gap-10">
                                {[
                                    { label: 'Blood Architecture', value: stats?.vitals?.bloodGroup || 'O+', icon: FlaskConical, color: 'text-rose-500', bg: 'bg-rose-50' },
                                    { label: 'Mass Metric', value: stats?.vitals?.weight || '70kg', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
                                    { label: 'Core V-Stability', value: stats?.vitals?.o2Saturation || '98%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { label: 'Pulse Frequency', value: stats?.vitals?.pulse || '72 BPM', icon: HeartPulse, color: 'text-blue-600', bg: 'bg-blue-50' },
                                    { label: 'O2 Saturation', value: stats?.vitals?.o2Saturation || '99%', icon: Waves, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                                    { label: 'Sleep Hygiene', value: stats?.vitals?.sleep || '8.2h', icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { label: 'Body Mass Index', value: stats?.vitals?.bmi || '22.8', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
                                    { label: 'Bio-Tier', value: 'Optimal', icon: Gem, color: 'text-purple-600', bg: 'bg-purple-50' },
                                ].map((stat, i) => (
                                    <div key={i} className="group p-12 bg-neutral-25 rounded-[4rem] border border-neutral-50 flex flex-col items-center text-center space-y-8 hover:bg-white hover:shadow-2xl hover:border-emerald-200 transition-all cursor-pointer">
                                        <div className={cn("w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-all", stat.bg)}>
                                            <stat.icon size={44} className={stat.color} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                                            <p className="text-4xl font-black text-neutral-900 leading-none">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default Profile;
