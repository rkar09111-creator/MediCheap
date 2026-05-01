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
            name: 'Dashboard', 
            path: '/profile', 
            icon: 'LayoutDashboard', 
            desc: 'Overview',
            subItems: [
                { id: 'dashboard', name: 'Profile Home', icon: 'Home' },
                { id: 'identity', name: 'Personal Info', icon: 'User' },
                { id: 'addresses', name: 'Saved Addresses', icon: 'MapPin' },
                { id: 'security', name: 'Account Security', icon: 'ShieldCheck' },
            ]
        },
        { name: 'My Orders', path: '/orders', icon: 'ShoppingBag', desc: 'Order History' },
        { name: 'Health Vault', path: '/health-vault', icon: 'FileText', desc: 'Prescriptions' },
        { name: 'Subscriptions', path: '/subscriptions', icon: 'RefreshCw', desc: 'Auto-Refills' },
    ];

    const isProfileActive = location.pathname === '/profile';
    const activeTab = new URLSearchParams(location.search).get('tab') || 'dashboard';

    return (
        <aside className="w-80 h-[calc(100vh-80px)] bg-white border-r border-neutral-100 flex flex-col sticky top-[80px] overflow-hidden">
            {/* User Profile Summary */}
            <div className="p-8 border-b border-neutral-50 bg-neutral-25/30">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center text-white text-xl font-black">
                        {user?.name ? user.name[0] : '?'}
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-bold text-neutral-900 text-base truncate">{user?.name}</h2>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Verified Member</span>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar">
                {menuItems.map((item) => {
                    const IconComponent = Icons[item.icon] || Icons.HelpCircle;
                    const isActive = location.pathname === item.path;

                    return (
                        <div key={item.path} className="space-y-1">
                            <NavLink
                                to={item.path}
                                className={({ isActive: linkActive }) => `
                                    flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
                                    ${linkActive ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-900/10' : 'text-neutral-500 hover:bg-neutral-50'}
                                `}
                            >
                                <IconComponent size={20} className={isActive ? "text-emerald-500" : "text-neutral-400"} />
                                <div className="flex-1">
                                    <p className="text-[13px] font-bold tracking-tight">{item.name}</p>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-white/40' : 'text-neutral-400'}`}>{item.desc}</p>
                                </div>
                            </NavLink>

                            <AnimatePresence>
                                {item.subItems && isActive && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="ml-8 pl-4 border-l border-neutral-100 space-y-1 py-2"
                                    >
                                        {item.subItems.map((sub) => {
                                            const SubIcon = Icons[sub.icon] || Icons.Circle;
                                            const isSubActive = activeTab === sub.id;
                                            return (
                                                <NavLink
                                                    key={sub.id}
                                                    to={`${item.path}?tab=${sub.id}`}
                                                    className={`
                                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                                        ${isSubActive ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-neutral-400 hover:bg-neutral-50'}
                                                    `}
                                                >
                                                    <SubIcon size={14} className={isSubActive ? "text-emerald-500" : "text-neutral-300"} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{sub.name}</span>
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

            {/* Logout Footer */}
            <div className="p-6 border-t border-neutral-50">
                <button 
                    onClick={logout} 
                    className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-rose-500 font-bold text-xs hover:bg-rose-50 transition-all group"
                >
                    <Icons.LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;
