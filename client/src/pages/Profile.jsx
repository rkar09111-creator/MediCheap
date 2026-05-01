import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    User, Mail, Phone, MapPin, Wallet, ShieldCheck, 
    Plus, Trash2, Box, LogOut, CheckCircle2, 
    Lock, Key, TrendingUp, ShoppingCart, 
    ArrowRight, Fingerprint, ShieldEllipsis, 
    Settings, Bell, CreditCard, ChevronRight
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
    const activeTab = searchParams.get('tab') || 'dashboard';
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState(null);

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

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

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

    if (authLoading || !user) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-neutral-100 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Loading Profile...</p>
            </div>
        );
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await authService.updateMe(profileData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('New passwords do not match');
        }
        try {
            await authService.updatePassword(passwordData);
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Failed to update password');
        }
    };

    const handleTopUp = async () => {
        const amount = window.prompt("Enter amount to add to wallet (₹):");
        if (amount && !isNaN(amount)) {
            try {
                await authService.topUpWallet(Number(amount));
                toast.success(`₹${amount} added to wallet`);
                window.location.reload();
            } catch (error) {
                toast.error('Top-up failed');
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-10"
                    >
                        {/* ━━ Simplified Header ━━ */}
                        <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 lg:p-12 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative z-10">
                                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                    <div className="w-24 h-24 rounded-3xl bg-neutral-900 flex items-center justify-center text-3xl font-black text-emerald-500 shadow-2xl">
                                        {user?.name?.[0]}
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">{user?.name}</h1>
                                        <p className="text-sm text-neutral-400 font-medium">{user?.email}</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Verified Member</Badge>
                                            <Badge className="bg-neutral-50 text-neutral-400 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">L-9 Tier</Badge>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-neutral-50 rounded-3xl p-6 px-8 flex flex-col items-center md:items-end justify-center min-w-[200px] border border-neutral-100">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Wallet Balance</p>
                                    <h2 className="text-4xl font-black text-neutral-900 tracking-tight">₹{user?.walletBalance || 0}</h2>
                                    <button onClick={handleTopUp} className="mt-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                        <Plus size={14} /> Add Funds
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ━━ Essential Grid ━━ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Recent Orders Summary */}
                            <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-neutral-900 tracking-tight uppercase">Recent Orders</h3>
                                    <Link to="/orders" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View All</Link>
                                </div>
                                
                                <div className="space-y-3">
                                    {stats?.recentActivity?.length > 0 ? (
                                        stats.recentActivity.slice(0, 3).map((log, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-neutral-25 rounded-2xl border border-neutral-50">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400">
                                                    <Box size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-neutral-900 text-sm truncate">{log.title}</p>
                                                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">{log.status}</p>
                                                </div>
                                                <ChevronRight size={14} className="text-neutral-300" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-neutral-400 font-medium py-4 text-center italic">No orders found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats / Info */}
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: 'Total Orders', value: stats?.orderCount || 0, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { label: 'Active Rx', value: stats?.rxCount || 0, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                    { label: 'Saved Addresses', value: stats?.addressCount || 0, icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
                                    { label: 'Account Safety', value: '100%', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white rounded-[2rem] border border-neutral-100 p-6 flex flex-col items-center text-center justify-center shadow-sm space-y-3">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.bg)}>
                                            <item.icon size={20} className={item.color} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{item.label}</p>
                                            <p className="text-2xl font-black text-neutral-900 tracking-tight">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'identity' && (
                    <motion.div
                        key="identity"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl mx-auto space-y-8"
                    >
                        <div className="text-center space-y-1">
                            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Personal Information</h2>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Update your account registry</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 lg:p-12 shadow-sm space-y-8">
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                        <input 
                                            value={profileData.name} 
                                            onChange={e => setProfileData({...profileData, name: e.target.value})} 
                                            className="w-full h-14 pl-12 pr-6 bg-neutral-50 border border-neutral-100 rounded-2xl font-bold text-neutral-900 focus:border-emerald-500 focus:bg-white outline-none transition-all" 
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                        <input 
                                            value={profileData.email} 
                                            onChange={e => setProfileData({...profileData, email: e.target.value})} 
                                            className="w-full h-14 pl-12 pr-6 bg-neutral-50 border border-neutral-100 rounded-2xl font-bold text-neutral-900 focus:border-emerald-500 focus:bg-white outline-none transition-all" 
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                        <input 
                                            value={profileData.phone} 
                                            onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                                            className="w-full h-14 pl-12 pr-6 bg-neutral-50 border border-neutral-100 rounded-2xl font-bold text-neutral-900 focus:border-emerald-500 focus:bg-white outline-none transition-all" 
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-neutral-900/10">Save Changes</Button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'addresses' && (
                    <motion.div
                        key="addresses"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <AddressManagement />
                    </motion.div>
                )}

                {activeTab === 'security' && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-2xl mx-auto space-y-8"
                    >
                        <div className="text-center space-y-1">
                            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Security Settings</h2>
                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Protect your account access</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 lg:p-12 shadow-sm space-y-8">
                            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
                                <ShieldCheck className="text-emerald-600" size={24} />
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">End-to-End Encryption Active</p>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">Current Password</label>
                                    <div className="relative">
                                        <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                        <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full h-14 pl-12 pr-6 bg-neutral-50 border border-neutral-100 rounded-2xl font-bold text-neutral-900 focus:border-emerald-500 focus:bg-white outline-none transition-all" placeholder="••••••••" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                        <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full h-14 pl-12 pr-6 bg-neutral-50 border border-neutral-100 rounded-2xl font-bold text-neutral-900 focus:border-emerald-500 focus:bg-white outline-none transition-all" placeholder="••••••••" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-2">Confirm New Password</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                        <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full h-14 pl-12 pr-6 bg-neutral-50 border border-neutral-100 rounded-2xl font-bold text-neutral-900 focus:border-emerald-500 focus:bg-white outline-none transition-all" placeholder="••••••••" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 bg-neutral-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-neutral-900/10">Update Password</Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
