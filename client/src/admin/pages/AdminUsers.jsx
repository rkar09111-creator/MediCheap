import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  User, 
  Key, 
  Mail, 
  Phone, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Edit2, 
  Trash2,
  X,
  Lock,
  ChevronRight,
  Monitor,
  Smartphone,
  Shield,
  Activity,
  MoreHorizontal
} from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';

const AdminUsers = () => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const admins = [
    { 
      id: 'ADM-001', 
      name: 'Arjun Gupta', 
      role: 'Super Admin', 
      email: 'arjun@medcheap.in',
      status: 'active',
      lastLogin: '10 mins ago',
      mfa: true,
      avatar: 'AG'
    },
    { 
      id: 'ADM-002', 
      name: 'Dr. Sameer Khan', 
      role: 'Pharmacist', 
      email: 'sameer.k@medcheap.in',
      status: 'active',
      lastLogin: '2h ago',
      mfa: true,
      avatar: 'SK'
    },
    { 
      id: 'ADM-003', 
      name: 'Priya Verma', 
      role: 'Moderator', 
      email: 'priya.v@medcheap.in',
      status: 'offline',
      lastLogin: '1d ago',
      mfa: false,
      avatar: 'PV'
    }
  ];

  const columns = [
    {
      label: 'Administrator',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-admin-bg flex items-center justify-center text-xs font-bold text-admin-text-secondary border border-admin-border-2">
            {row.avatar}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-admin-text-primary">{val}</span>
            <span className="text-[10px] text-admin-text-tertiary font-medium">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      label: 'Role',
      key: 'role',
      render: (val) => (
        <span className="px-2 py-0.5 bg-admin-text-primary text-white text-[9px] font-bold uppercase tracking-wider rounded">
          {val}
        </span>
      )
    },
    {
      label: 'Security',
      key: 'mfa',
      render: (val) => (
        <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${val ? 'text-success' : 'text-amber-500'}`}>
          <Lock size={12} />
          {val ? 'MFA Enabled' : 'MFA Required'}
        </div>
      )
    },
    {
      label: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val === 'active' ? 'online' : 'offline'} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text-primary tracking-tight">Access Control (RBAC)</h1>
          <p className="text-xs text-admin-text-tertiary font-medium mt-0.5">Manage administrative personnel and clinical permissions</p>
        </div>
        <button className="btn-admin btn-admin-primary h-9 px-4">
          <Plus size={14} />
          <span className="text-xs">Onboard Admin</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="page-card p-4">
          <p className="text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">Total Admins</p>
          <p className="text-2xl font-bold text-admin-text-primary mt-1">12</p>
        </div>
        <div className="page-card p-4">
          <p className="text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">Active Sessions</p>
          <p className="text-2xl font-bold text-brand-green mt-1">5</p>
        </div>
        <div className="page-card p-4">
          <p className="text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">Security Alerts</p>
          <p className="text-2xl font-bold text-admin-text-primary mt-1">0</p>
        </div>
        <div className="page-card p-4">
          <p className="text-[10px] font-bold text-admin-text-tertiary uppercase tracking-wider">MFA Coverage</p>
          <p className="text-2xl font-bold text-brand-green mt-1">92%</p>
        </div>
      </div>

      <DataTable 
        title="Admin Personnel"
        count={admins.length}
        columns={columns}
        data={admins}
        isLoading={false}
        onSearch={setSearchTerm}
      />

      {/* DETAIL DRAWER */}
      <AnimatePresence>
        {selectedAdmin && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAdmin(null)} className="fixed inset-0 bg-admin-text-primary/20 backdrop-blur-sm z-[110]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-modal z-[120] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-admin-border flex items-center justify-between">
                <h2 className="text-lg font-bold text-admin-text-primary">Admin Profile</h2>
                <button onClick={() => setSelectedAdmin(null)} className="w-8 h-8 rounded-lg hover:bg-admin-bg flex items-center justify-center text-admin-text-tertiary">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex items-center gap-4 p-4 bg-admin-bg rounded-xl border border-admin-border-2">
                   <div className="w-14 h-14 rounded-xl bg-admin-text-primary text-white flex items-center justify-center text-xl font-bold shadow-lg">
                      {selectedAdmin.avatar}
                   </div>
                   <div>
                      <h3 className="text-md font-bold text-admin-text-primary">{selectedAdmin.name}</h3>
                      <p className="text-xs text-admin-text-tertiary">{selectedAdmin.email}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green text-[9px] font-bold uppercase rounded">{selectedAdmin.role}</span>
                        <span className="px-2 py-0.5 bg-admin-border-2 text-admin-text-tertiary text-[9px] font-bold uppercase rounded">{selectedAdmin.id}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-widest">Permissions Matrix</h4>
                   <div className="grid grid-cols-1 gap-2">
                      {[
                        { label: 'Verify Clinical Prescriptions', enabled: true },
                        { label: 'Manage Medicine Registry', enabled: true },
                        { label: 'Access Financial Audits', enabled: false },
                        { label: 'Modify System Settings', enabled: false }
                      ].map((perm, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white border border-admin-border-2">
                           <span className={`text-xs font-medium ${perm.enabled ? 'text-admin-text-primary' : 'text-admin-text-tertiary'}`}>{perm.label}</span>
                           {perm.enabled ? <CheckCircle2 size={16} className="text-brand-green" /> : <XCircle size={16} className="text-admin-text-tertiary opacity-40" />}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-widest">Recent Activity</h4>
                   <div className="space-y-3">
                      {[
                        { action: 'Updated Medicine Stock', time: '12 mins ago', icon: Activity },
                        { action: 'MFA Auth Success', time: '1 hour ago', icon: Lock },
                        { action: 'Downloaded Sales Report', time: '1 day ago', icon: Activity }
                      ].map((act, i) => (
                        <div key={i} className="flex gap-3">
                           <div className="w-8 h-8 rounded-lg bg-admin-bg flex items-center justify-center text-admin-text-tertiary shrink-0">
                              <act.icon size={14} />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-admin-text-primary">{act.action}</p>
                              <p className="text-[10px] text-admin-text-tertiary font-medium">{act.time}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="p-6 border-t border-admin-border bg-admin-bg/30 grid grid-cols-2 gap-3">
                 <button className="btn-admin btn-admin-secondary h-11">
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                 </button>
                 <button className="btn-admin btn-admin-danger h-11">
                    <ShieldAlert size={16} />
                    <span>Revoke Access</span>
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
