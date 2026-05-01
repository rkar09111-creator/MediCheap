import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    FileText, 
    RefreshCw, 
    Home, 
    User, 
    MapPin, 
    ShieldCheck, 
    LogOut, 
    HelpCircle,
    Circle,
    Menu,
    ChevronLeft
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
    LayoutDashboard,
    ShoppingBag,
    FileText,
    RefreshCw,
    Home,
    User,
    MapPin,
    ShieldCheck,
    HelpCircle,
    Circle
};

const UserSidebar = ({ isCollapsed, setIsCollapsed }) => {
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
        <motion.aside 
            initial={false}
            animate={{ width: isCollapsed ? 80 : 320 }}
            className="bg-white border-r border-neutral-100 flex flex-col sticky z-40 overflow-hidden transition-all duration-300"
            style={{ 
                height: 'calc(100vh - var(--navbar-height))',
                top: 'var(--navbar-height)'
            }}
        >
            {/* ━━ Toggle Header ━━ */}
            <div className={`p-6 border-b border-neutral-50 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white text-xs font-black">
                            {user?.name ? user.name[0] : '?'}
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-widest text-neutral-400">Account Nerve</span>
                    </div>
                )}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-neutral-50 rounded-xl text-neutral-400 hover:text-neutral-900 transition-all"
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* User Profile Summary (Hidden when collapsed) */}
            {!isCollapsed && (
                <div className="p-8 border-b border-neutral-50 bg-neutral-25/30">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center text-white text-xl font-black shadow-lg">
                            {user?.name ? user.name[0] : '?'}
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-neutral-900 text-base truncate">{user?.name}</h2>
                            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-1">
                                <ShieldCheck size={10} /> Verified
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {menuItems.map((item) => {
                    const IconComponent = iconMap[item.icon] || HelpCircle;
                    const isActive = location.pathname === item.path;

                    return (
                        <div key={item.path} className="space-y-1">
                            <NavLink
                                to={item.path}
                                className={({ isActive: linkActive }) => `
                                    flex items-center gap-4 px-4 py-3 rounded-2xl transition-all
                                    ${linkActive ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-900/10' : 'text-neutral-500 hover:bg-neutral-50'}
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                            >
                                <IconComponent size={20} className={isActive ? "text-brand-500" : "text-neutral-400"} />
                                {!isCollapsed && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold tracking-tight truncate">{item.name}</p>
                                        <p className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-white/40' : 'text-neutral-400'}`}>{item.desc}</p>
                                    </div>
                                )}
                            </NavLink>

                            <AnimatePresence>
                                {!isCollapsed && item.subItems && isActive && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="ml-6 pl-4 border-l border-neutral-100 space-y-1 py-2"
                                    >
                                        {item.subItems.map((sub) => {
                                            const SubIcon = iconMap[sub.icon] || Circle;
                                            const isSubActive = activeTab === sub.id;
                                            return (
                                                <NavLink
                                                    key={sub.id}
                                                    to={`${item.path}?tab=${sub.id}`}
                                                    className={`
                                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                                        ${isSubActive ? 'bg-brand-50 text-brand-600 font-bold' : 'text-neutral-400 hover:bg-neutral-50'}
                                                    `}
                                                >
                                                    <SubIcon size={14} className={isSubActive ? "text-brand-500" : "text-neutral-300"} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{sub.name}</span>
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
            <div className="p-4 border-t border-neutral-50">
                <button 
                    onClick={logout} 
                    className={`flex items-center gap-4 px-4 py-4 w-full rounded-2xl text-rose-500 font-bold text-xs hover:bg-rose-50 transition-all group ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                    {!isCollapsed && <span>Logout Registry</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export default UserSidebar;
