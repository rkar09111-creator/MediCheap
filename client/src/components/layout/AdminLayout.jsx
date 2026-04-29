import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (!isAuthenticated || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden font-body">
      <Sidebar role="admin" />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
