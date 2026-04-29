import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  FolderOpen,
  Boxes,
  ImageIcon,
  Tag,
  ShoppingCart,
  Clock,
  Truck,
  FileText,
  CreditCard,
  Star,
  MessageSquare,
  Users,
  UserX,
  Map,
  Bike,
  UserPlus,
  Home,
  Megaphone,
  Search,
  TrendingUp,
  Settings,
  ShieldCheck,
  Lock,
  Database,
  ChevronDown,
  LogOut,
  ChevronLeft,
  MoreVertical,
  Bell,
  Mail,
  ChevronRight,
  Building2,
  FolderTree,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { adminService } from '../../../services/api';
import AdminSidebarStats from './AdminSidebarStats';

const NavItem = ({ to, icon: Icon, label, badge, isCollapsed, tooltip }) => (
  <NavLink
    to={to}
    end={to === '/admin'}
    className={({ isActive }) =>
      `relative flex items-center gap-2.5 py-2 mx-2 rounded-lg transition-all duration-150 group
       ${isActive
         ? 'bg-sidebar-active text-sidebar-text-active'
         : 'text-sidebar-text hover:text-sidebar-text-hover hover:bg-sidebar-hover'
       }
       ${isCollapsed ? 'justify-center px-0' : 'px-3'}`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && !isCollapsed && (
          <span className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-brand-green rounded-r-full" />
        )}
        <Icon
          size={18}
          className={`shrink-0 transition-colors ${isActive ? 'text-sidebar-icon-active' : 'text-sidebar-icon group-hover:text-sidebar-text-hover'}`}
        />
        {!isCollapsed && (
          <span className="flex-1 text-[13px] font-medium truncate">{label}</span>
        )}
        {badge !== undefined && (
          <span className={`flex items-center justify-center font-bold text-[10px] ${
            isCollapsed 
              ? 'absolute top-1 right-1 w-3.5 h-3.5 bg-danger text-white rounded-full'
              : 'min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white'
          }`}>
            {isCollapsed ? '' : badge}
          </span>
        )}
        
        {isCollapsed && (
          <div className="absolute left-[calc(100%+12px)] bg-admin-text-primary text-white text-[10px] font-bold py-1 px-2.5 rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-x-[-4px] group-hover:translate-x-0 transition-all z-50 pointer-events-none">
            {label}
            {badge !== undefined && ` (${badge})`}
          </div>
        )}
      </>
    )}
  </NavLink>
);

const SectionLabel = ({ children, isCollapsed }) =>
  isCollapsed ? (
    <div className="h-px bg-sidebar-border mx-4 my-4" />
  ) : (
    <p className="px-5 pt-5 pb-1.5 text-[10px] font-bold tracking-[0.1em] uppercase text-sidebar-icon select-none opacity-60">
      {children}
    </p>
  );

const CollapsibleNav = ({ icon: Icon, label, items, badge, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isChildActive = items.some(i => window.location.pathname === i.to);

  if (isCollapsed) return <NavItem to={items[0].to} icon={Icon} label={label} badge={badge} isCollapsed={true} />;

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[calc(100%-16px)] flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg transition-all duration-150 group
          ${isChildActive || isOpen ? 'text-sidebar-text-active bg-sidebar-hover/50' : 'text-sidebar-text hover:text-sidebar-text-hover hover:bg-sidebar-hover'}`}
      >
        <Icon size={18} className={`shrink-0 ${isChildActive ? 'text-sidebar-icon-active' : 'text-sidebar-icon'}`} />
        <span className="flex-1 text-[13px] font-medium text-left truncate">{label}</span>
        {badge !== undefined && (
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
            {badge}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-1 space-y-0.5">
              {items.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 pl-10 pr-3 py-1.5 mx-2 rounded-lg text-[12px] font-medium transition-all
                     ${isActive ? 'text-brand-green-lt bg-brand-green/5' : 'text-sidebar-text hover:text-sidebar-text-hover hover:bg-sidebar-hover'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-brand-green-lt scale-125' : 'bg-sidebar-icon opacity-40'}`} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ pendingOrders: 0, pendingPrescriptions: 0, rejectedPayments: 0, lowStock: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await adminService.getCounts();
        setCounts(data.data);
      } catch (err) {
        console.error('Failed to fetch counts');
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 240 }}
      className="fixed left-0 top-0 bottom-0 flex flex-col z-[100] bg-sidebar-bg border-r border-sidebar-border transition-all duration-300 ease-in-out border-t-2 border-brand-green"
    >
      {/* LOGO SECTION */}
      <div className="h-[60px] px-4 flex items-center gap-3 border-b border-sidebar-border shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-green to-green-400 flex items-center justify-center shrink-0">
          <ShieldCheck size={16} className="text-white" strokeWidth={3} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-0.5">
              <span className="text-white font-bold text-sm tracking-tight">Medi</span>
              <span className="text-brand-green-lt font-bold text-sm tracking-tight">Cheap</span>
            </div>
            <span className="text-[9px] font-bold text-sidebar-text uppercase tracking-widest leading-none">Admin Portal</span>
          </div>
        )}
      </div>

      {/* COLLAPSE TOGGLE */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-5 w-6 h-6 bg-white border border-admin-border rounded-full flex items-center justify-center shadow-md hover:border-brand-green transition-colors z-10"
      >
        <ChevronLeft size={12} className={`text-sidebar-text transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto admin-scrollbar py-2">
        <SectionLabel isCollapsed={isCollapsed}>Overview</SectionLabel>
        <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
        <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" isCollapsed={isCollapsed} />

        <SectionLabel isCollapsed={isCollapsed}>Store</SectionLabel>
        <CollapsibleNav
          icon={Package}
          label="Medicines"
          isCollapsed={isCollapsed}
          items={[
            { label: 'All Medicines', to: '/admin/medicines' },
            { label: 'Add Medicine', to: '/admin/medicines/add' },
            { label: 'Import Excel', to: '/admin/medicines/import' },
            { label: 'Low Stock', to: '/admin/medicines?stock=low', badge: counts.lowStock || undefined },
          ]}
        />
        <NavItem to="/admin/categories" icon={FolderOpen} label="Categories" isCollapsed={isCollapsed} />
        <CollapsibleNav
          icon={Boxes}
          label="Inventory"
          isCollapsed={isCollapsed}
          items={[
            { label: 'Stock Overview', to: '/admin/inventory' },
            { label: 'Stock History', to: '/admin/inventory/history' },
            { label: 'Expiry Tracker', to: '/admin/inventory/expiry' },
          ]}
        />
        <NavItem to="/admin/media" icon={ImageIcon} label="Media Library" isCollapsed={isCollapsed} />
        <CollapsibleNav
          icon={Tag}
          label="Offers & Pricing"
          isCollapsed={isCollapsed}
          items={[
            { label: 'Discount Rules', to: '/admin/offers' },
            { label: 'Coupon Codes', to: '/admin/coupons' },
          ]}
        />

        <SectionLabel isCollapsed={isCollapsed}>Ecosystem</SectionLabel>
        <NavItem to="/admin/company-hub" icon={Building2} label="Company Hub" isCollapsed={isCollapsed} />

        <SectionLabel isCollapsed={isCollapsed}>Orders</SectionLabel>
        <NavItem to="/admin/orders" icon={ShoppingCart} label="All Orders" isCollapsed={isCollapsed} badge={counts.pendingOrders || undefined} />
        <NavItem to="/admin/prescriptions" icon={FileText} label="Prescriptions" isCollapsed={isCollapsed} badge={counts.pendingPrescriptions || undefined} />
        <NavItem to="/admin/payments" icon={CreditCard} label="Payments" isCollapsed={isCollapsed} badge={counts.rejectedPayments || undefined} />

        <SectionLabel isCollapsed={isCollapsed}>Customers</SectionLabel>
        <NavItem to="/admin/reviews" icon={Star} label="Reviews" isCollapsed={isCollapsed} badge={4} />
        <NavItem to="/admin/chat" icon={MessageSquare} label="Live Chat" isCollapsed={isCollapsed} badge={1} />
        <NavItem to="/admin/customers" icon={Users} label="All Customers" isCollapsed={isCollapsed} />

        <SectionLabel isCollapsed={isCollapsed}>Website</SectionLabel>
        <NavItem to="/admin/website" icon={Home} label="Homepage Control" isCollapsed={isCollapsed} />
        <NavItem to="/admin/seo" icon={Search} label="SEO Settings" isCollapsed={isCollapsed} />

        {/* Real-time Stats Widget */}
        <AdminSidebarStats isCollapsed={isCollapsed} />
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-2 border-t border-sidebar-border shrink-0">
        <div className="mb-2 p-2 bg-brand-green/5 border border-brand-green/10 rounded-lg flex items-center gap-2.5">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
          </div>
          {!isCollapsed && <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Store Online</span>}
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-hover transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-green to-green-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs truncate leading-tight">{user?.name || 'Admin'}</p>
              <p className="text-sidebar-text text-[9px] uppercase font-bold tracking-wider leading-none mt-1">Super Admin</p>
            </div>
          )}
          {!isCollapsed && <MoreVertical size={14} className="text-sidebar-icon" />}
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
