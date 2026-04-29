import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, ChevronRight, ExternalLink, User, Settings, LogOut, ShoppingBag, FileText, MessageSquare, Check, X } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import AdminSearchOverlay from './AdminSearchOverlay';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

const NotifIcon = ({ type }) => {
  if (type === 'order') return <ShoppingBag size={14} className="text-green-600" />;
  if (type === 'prescription') return <FileText size={14} className="text-pink-500" />;
  return <MessageSquare size={14} className="text-blue-500" />;
};

const AdminTopbar = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAllRead } = useNotificationStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'admin');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) markAllRead();
  };

  return (
    <header
      className="fixed top-0 right-0 h-[56px] bg-admin-surface border-b border-admin-border flex items-center justify-between px-6 z-30 shadow-sm"
      style={{ left: isCollapsed ? 64 : 240, transition: 'left 0.3s ease-in-out' }}
    >
      {/* LEFT: Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Link to="/admin" className="text-admin-text-tertiary hover:text-admin-text-primary transition-colors">Admin</Link>
          {pathnames.length > 0 && <ChevronRight size={14} className="text-admin-text-tertiary" />}
          {pathnames.map((name, index) => {
            const isLast = index === pathnames.length - 1;
            const to = `/admin/${pathnames.slice(0, index + 1).join('/')}`;
            return (
              <React.Fragment key={to}>
                {isLast ? (
                  <span className="text-admin-text-primary font-semibold capitalize">{name.replace(/-/g, ' ')}</span>
                ) : (
                  <>
                    <Link to={to} className="text-admin-text-tertiary hover:text-admin-text-primary transition-colors capitalize">{name.replace(/-/g, ' ')}</Link>
                    <ChevronRight size={14} className="text-admin-text-tertiary" />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* CENTER: Global Search Trigger */}
      <div className="flex-1 max-w-md px-8 hidden md:block">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between bg-admin-bg border border-admin-border rounded-lg px-3 py-1.5 text-admin-text-tertiary hover:border-brand-green hover:bg-white transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="group-hover:text-brand-green transition-colors" />
            <span className="text-sm">Search global registry...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="bg-admin-surface border border-admin-border rounded px-1.5 py-0.5 text-[9px] font-mono shadow-sm">⌘</kbd>
            <kbd className="bg-admin-surface border border-admin-border rounded px-1.5 py-0.5 text-[9px] font-mono shadow-sm">K</kbd>
          </div>
        </button>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3">
        {/* Live Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-green-50 border border-brand-green-200 mr-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
          </div>
          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Live System</span>
        </div>

        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-admin-border text-admin-text-secondary hover:text-brand-green hover:border-brand-green hover:bg-brand-green-50 transition-all text-sm font-medium"
        >
          <ExternalLink size={14} />
          <span className="hidden sm:inline">View Store</span>
        </a>

        {/* ─── LIVE NOTIFICATION BELL ─── */}
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="w-9 h-9 rounded-lg border border-admin-border flex items-center justify-center text-admin-text-secondary hover:bg-admin-bg transition-colors relative"
          >
            <Bell size={18} className={unreadCount > 0 ? 'animate-[wiggle_0.5s_ease-in-out_infinite]' : ''} />
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black text-white"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-admin-surface border border-admin-border rounded-xl shadow-dropdown z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-admin-border-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-admin-text-primary">Notifications</p>
                      <p className="text-[10px] text-admin-text-tertiary font-medium">
                        {notifications.length} total this session
                      </p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-bold text-brand-green hover:underline uppercase tracking-wider"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[380px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <Bell size={32} className="text-admin-text-tertiary mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium text-admin-text-tertiary">No notifications yet</p>
                        <p className="text-xs text-admin-text-tertiary opacity-70 mt-1">
                          New orders will appear here
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-admin-border-2 last:border-0 hover:bg-admin-bg transition-colors ${!notif.read ? 'bg-green-50/50' : ''}`}
                        >
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            notif.type === 'order' ? 'bg-green-100' :
                            notif.type === 'prescription' ? 'bg-pink-100' : 'bg-blue-100'
                          }`}>
                            <NotifIcon type={notif.type} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[12px] font-bold text-admin-text-primary leading-snug">
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-brand-green shrink-0 mt-1" />
                              )}
                            </div>
                            {notif.subtitle && (
                              <p className="text-[11px] text-admin-text-tertiary mt-0.5 truncate">
                                {notif.subtitle}
                              </p>
                            )}
                            <p className="text-[10px] text-admin-text-tertiary mt-1 font-medium">
                              {timeAgo(notif.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-admin-border-2">
                      <Link
                        to="/admin/orders"
                        onClick={() => setShowNotifications(false)}
                        className="text-[11px] font-bold text-brand-green hover:underline uppercase tracking-wider"
                      >
                        View All Orders →
                      </Link>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-admin-border-2 mx-1" />

        {/* Admin Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full border border-admin-border hover:bg-admin-bg transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-green to-green-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <ChevronDown size={14} className={`text-admin-text-tertiary transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-admin-surface border border-admin-border rounded-xl shadow-dropdown z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-admin-border-2">
                    <p className="text-sm font-bold text-admin-text-primary truncate">{user?.name || 'Administrator'}</p>
                    <p className="text-xs text-admin-text-tertiary truncate">{user?.email || 'admin@medicheap.in'}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-brand-green-100 text-brand-green text-[10px] font-bold uppercase tracking-wider">
                      Super Admin
                    </div>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-admin-text-secondary hover:bg-admin-bg hover:text-admin-text-primary transition-colors">
                      <User size={16} />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-admin-text-secondary hover:bg-admin-bg hover:text-admin-text-primary transition-colors">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-red-50 transition-colors">
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Wiggle animation style */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
      `}</style>
      <AdminSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default AdminTopbar;
