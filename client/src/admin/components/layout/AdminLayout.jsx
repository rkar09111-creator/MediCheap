import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminMobileNav from './AdminMobileNav';
import CommandPalette from '../ui/CommandPalette';
import IncomingOrderModal from '../ui/IncomingOrderModal';
import useAdminSocket from '../../hooks/useAdminSocket';
import '../../admin.css';

const AdminLayout = () => {
  useAdminSocket();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('admin_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  return (
    <div className="admin-layout">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-admin-text-primary text-white rounded-xl shadow-xl border border-white/10 text-sm font-medium px-4 py-3',
        }}
      />
      
      {/* Global incoming order modal — fires on any admin page */}
      <IncomingOrderModal />
      
      <CommandPalette />

      <div className="hidden lg:block">
        <AdminSidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      </div>

      <div 
        className="admin-main"
        style={{ paddingLeft: isCollapsed ? 64 : 240, transition: 'padding-left 0.3s ease-in-out' }}
      >
        <div className="hidden lg:block">
          <AdminTopbar isCollapsed={isCollapsed} />
        </div>

        <div className="lg:hidden">
          <AdminMobileNav />
        </div>
        
        <div className="admin-content admin-scrollbar pt-[56px]">
          <main className="max-w-[1400px] mx-auto w-full pt-8 pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
