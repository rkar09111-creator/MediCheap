import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const UserSidebar = () => {
    const { logout, user } = useAuthStore();
    const location = useLocation();

    const menuItems = [
        { 
            name: 'Identity Hub', 
            path: '/profile', 
            icon: 'User', 
            desc: 'Profile & Bio',
            subItems: [
                { id: 'dashboard', name: 'Clinical Dashboard', icon: 'LayoutDashboard' },
                { id: 'identity', name: 'Identity Registry', icon: 'Fingerprint' },
                { id: 'addresses', name: 'Logistics Registry', icon: 'MapPin' },
                { id: 'matrix', name: 'Health Matrix', icon: 'Microscope' },
                { id: 'wallet', name: 'MediWallet Terminal', icon: 'Wallet' },
                { id: 'security', name: 'Security Protocol', icon: 'ShieldCheck' },
            ]
        },
        { name: 'Order Registry', path: '/orders', icon: 'ShoppingBag', desc: 'Fulfillment Tracking' },
        { name: 'Health Matrix', path: '/health-vault', icon: 'Activity', desc: 'Clinical Telemetry' },
        { name: 'Subscription Hub', path: '/subscriptions', icon: 'Star', desc: 'Automated Refills' },
        { name: 'Prescription Vault', path: '/upload-prescription', icon: 'FileText', desc: 'Document Archival' },
    ];

    const isProfileActive = location.pathname === '/profile';
    const activeTab = new URLSearchParams(location.search).get('tab') || 'dashboard';

    return (
        <aside className="w-80 h-screen bg-white border-r border-neutral-100 flex flex-col sticky top-0 overflow-hidden">
            <div className="p-8 pb-10 border-b border-neutral-50 bg-gradient-to-br from-neutral-25 to-white relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center text-white text-2xl font-black">
                        {user?.name ? user.name[0] : '?'}
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-neutral-900 text-lg leading-tight truncate">{user?.name || 'User'}</h2>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Verified Patient</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 space-y-1">
                {menuItems.map((item) => {
                    const IconComponent = Icons[item.icon] || Icons.HelpCircle;
                    const isActive = location.pathname === item.path;
                    const hasSubItems = item.subItems && (isActive || isProfileActive);

                    return (
                        <div key={item.path} className="space-y-1">
                            <NavLink
                                to={item.path}
                                className={({ isActive: linkActive }) => `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${linkActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-neutral-500 hover:bg-neutral-50'}`}
                            >
                                <IconComponent size={20} />
                                <div>
                                    <p className="text-[13px] font-bold tracking-tight">{item.name}</p>
                                    <p className={`text-[9px] uppercase tracking-widest ${isActive ? 'text-white/60' : 'text-neutral-400'}`}>{item.desc}</p>
                                </div>
                            </NavLink>

                            <AnimatePresence>
                                {item.subItems && isActive && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="ml-6 pl-4 border-l-2 border-emerald-100 space-y-1 py-2"
                                    >
                                        {item.subItems.map((sub) => {
                                            const SubIcon = Icons[sub.icon] || Icons.Circle;
                                            const isSubActive = activeTab === sub.id;
                                            return (
                                                <NavLink
                                                    key={sub.id}
                                                    to={`${item.path}?tab=${sub.id}`}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isSubActive ? 'bg-emerald-50 text-emerald-600' : 'text-neutral-400 hover:bg-neutral-50'}`}
                                                >
                                                    <SubIcon size={14} />
                                                    <span className="text-[11px] font-bold uppercase tracking-wider">{sub.name}</span>
                                                </NavLink>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-neutral-50">
                <button onClick={logout} className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-rose-500 font-bold text-sm hover:bg-rose-50 transition-all">
                    <Icons.LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;
