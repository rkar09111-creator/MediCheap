import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import Logo from '../../../components/common/Logo';

const AdminMobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-[56px] bg-admin-surface border-b border-admin-border flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-1.5 hover:bg-admin-bg rounded-lg text-admin-text-secondary transition-colors"
          >
            <Menu size={20} />
          </button>
          <Logo variant="admin" size="sm" isScrolled={false} className="!gap-1.5" />
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-admin-text-primary/20 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[240px] z-[110]"
            >
              <div className="relative h-full">
                <AdminSidebar isCollapsed={false} setIsCollapsed={() => {}} />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 -right-10 w-8 h-8 bg-admin-surface border border-admin-border rounded-lg shadow-lg flex items-center justify-center text-admin-text-secondary"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMobileNav;
