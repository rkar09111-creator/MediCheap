import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingBag, 
  FileText, 
  Truck, 
  Users, 
  Settings, 
  LogOut,
  Map,
  ChevronRight,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ role }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Command Deck', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Pharma Inventory', icon: <Pill size={20} />, path: '/admin/medicines' },
    { name: 'Clinical Queue', icon: <FileText size={20} />, path: '/admin/prescriptions' },
    { name: 'Active Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Fleet Management', icon: <Truck size={20} />, path: '/admin/riders' },
    { name: 'Patient Registry', icon: <Users size={20} />, path: '/admin/users' },
  ];

  const riderLinks = [
    { name: 'Mission Control', icon: <LayoutDashboard size={20} />, path: '/rider' },
    { name: 'My Deliveries', icon: <Truck size={20} />, path: '/rider/history' },
    { name: 'Clinical Map', icon: <Map size={20} />, path: '/rider/map' },
  ];

  const links = role === 'admin' ? adminLinks : riderLinks;

  return (
    <div className="w-72 bg-neutral-950 h-screen flex flex-col text-neutral-400 border-r border-white/5 relative z-50">
      {/* Brand */}
      <div className="p-10 flex items-center gap-4">
        <div className="relative group">
            <div className="absolute -inset-2 bg-brand-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative bg-brand-primary p-3 rounded-2xl shadow-2xl shadow-brand-600/20">
                <Pill className="text-white transform -rotate-45" size={26} strokeWidth={2.5} />
            </div>
        </div>
        <div className="flex flex-col">
            <span className="font-display font-black text-2xl text-white tracking-tighter leading-none">MediCheap</span>
        </div>
      </div>

      {/* User Terminal */}
      <div className="mx-6 mb-10 p-5 rounded-[2rem] bg-white/5 border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-all duration-500">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center text-white font-black shadow-2xl shadow-brand-600/20 group-hover:scale-110 transition-transform duration-500">
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-black text-white truncate uppercase tracking-tight">{user?.name || 'Administrator'}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">{role} Terminal</p>
          </div>
        </div>
      </div>

      {/* Navigation Terminal */}
      <nav className="flex-1 px-6 space-y-2">
        <p className="px-4 text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-6">Core Pipeline Modules</p>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/admin' || link.path === '/rider'}
            className={({ isActive }) => 
              `flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden border ${
                isActive 
                  ? 'text-white font-bold bg-white/5 border-white/10 shadow-2xl shadow-brand-600/5' 
                  : 'hover:bg-white/5 text-neutral-500 hover:text-neutral-200 border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1.5 h-8 bg-brand-primary rounded-r-full"
                  />
                )}
                <div className="flex items-center gap-4 relative z-10">
                  <span className={cn(
                    "transition-all duration-500 group-hover:scale-110",
                    isActive ? "text-brand-primary" : "group-hover:text-white"
                  )}>
                    {link.icon}
                  </span>
                  <span className="text-[14px] font-medium tracking-tight">{link.name}</span>
                </div>
                {isActive && <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_12px_rgba(0,200,83,0.6)] animate-pulse" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Footer */}
      <div className="p-8 border-t border-white/5 space-y-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em] group border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform duration-500" />
          <span>Sync Shutdown</span>
        </button>
        <div className="px-6 flex items-center justify-between opacity-30">
          <p className="text-[9px] text-neutral-500 font-black uppercase tracking-[0.3em]">Node v2.4.0</p>
          <Shield size={12} />
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
