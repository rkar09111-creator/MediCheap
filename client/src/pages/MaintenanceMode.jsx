import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, Phone, Mail, ShieldCheck } from 'lucide-react';

const MaintenanceMode = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-2xl w-full text-center relative z-10 space-y-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-brand-primary rounded-[2rem] flex items-center justify-center rotate-[-10deg] shadow-2xl shadow-brand-600/20">
              <Pill className="text-white" size={48} strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-4 border-neutral-950 shadow-xl">
              <Clock className="text-brand-primary" size={20} strokeWidth={3} />
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-tight"
          >
            Store Under <br />
            <span className="text-brand-primary">Clinical Maintenance</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-neutral-400 font-medium max-w-md mx-auto leading-relaxed"
          >
            We're currently optimizing our pharmacy logistics for a better experience. We'll be back online in a moment.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-brand-600/10 rounded-2xl flex items-center justify-center text-brand-primary">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Urgent Support</p>
              <p className="text-white font-bold">+91 1800-123-4567</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-brand-600/10 rounded-2xl flex items-center justify-center text-brand-primary">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Email Assistance</p>
              <p className="text-white font-bold">care@medicheap.in</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-neutral-600 font-bold text-xs uppercase tracking-widest"
        >
          <ShieldCheck size={16} />
          Your Health Vault & Data are Secure
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
