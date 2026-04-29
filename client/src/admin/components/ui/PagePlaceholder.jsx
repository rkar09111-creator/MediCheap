import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PagePlaceholder = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = title || location.pathname.split('/').pop().replace(/-/g, ' ').toUpperCase();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-admin-border shadow-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mb-6"
      >
        <Construction className="w-10 h-10" />
      </motion.div>
      <h2 className="text-2xl font-display font-bold text-admin-text-primary mb-2">
        {pageName} Module
      </h2>
      <p className="text-admin-text-secondary max-w-md mx-auto mb-8">
        This high-fidelity management module is currently under development. 
        It will feature comprehensive controls for <strong>{pageName.toLowerCase()}</strong>.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/admin')}
          className="admin-btn-primary px-8 py-3 flex items-center gap-2"
        >
          Return to Dashboard
        </button>
        <button className="admin-btn-ghost border border-admin-border px-8 py-3">
          View Technical Docs
        </button>
      </div>
    </div>
  );
};

export default PagePlaceholder;
