import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  UserPlus, 
  History, 
  Package, 
  Star, 
  ShieldCheck, 
  X,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  DollarSign,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { adminService } from '../../services/api';
import { Loader2 } from 'lucide-react';

const Customers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle direct link to specific user
  useEffect(() => {
    const userId = searchParams.get('id');
    if (userId && customers.length > 0) {
      const customer = customers.find(c => c._id === userId);
      if (customer) setSelectedUser(customer);
    }
  }, [searchParams, customers]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getUsers();
      // Transform backend users to match UI expectations if necessary
      const transformed = data.data.users.map(u => ({
        ...u,
        id: `USR-${u._id.slice(-4).toUpperCase()}`,
        ltv: `₹${u.walletBalance || 0}`, // Placeholder for real LTV
        lastActive: 'Active Now', // Placeholder
        joined: new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        avatar: u.name.split(' ').map(n => n[0]).join(''),
        pass: '••••••••'
      }));
      setCustomers(transformed);
    } catch (error) {
      toast.error('Failed to access user registry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Users className="w-6 h-6 text-brand-primary" />
            Customer Relationship.
            <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-brand-primary/20">{customers.length} total</span>
          </h2>
          <p className="text-sm text-brand-primary font-bold mt-1">Manage user profiles, verification status, and clinical history.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-btn-ghost border border-admin-border flex items-center gap-2 h-11 hover:text-brand-primary hover:border-brand-primary transition-all"><Download className="w-4 h-4" /> <span>Export CRM</span></button>
          <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"><UserPlus className="w-4 h-4" /> <span>Add Customer</span></button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1 p-1 bg-white border border-admin-border rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
        {['all', 'verified', 'pending', 'VIP', 'blocked'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-[11px] font-black rounded-xl transition-all whitespace-nowrap uppercase tracking-widest ${filter === f ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-neutral-400 hover:text-brand-primary'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="admin-card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-brand-primary transition-colors" />
          <input type="text" placeholder="Search customers by name, ID, phone or email..." className="admin-input pl-12 h-11 bg-slate-50/50 focus:ring-brand-primary/20 transition-all" />
        </div>
        <button className="admin-btn-ghost border border-admin-border h-11 hover:text-brand-primary hover:border-brand-primary transition-all"><Filter className="w-4 h-4 mr-2" /> Segmentation</button>
      </div>

      {/* CUSTOMER LIST */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-admin-border">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Primary Address</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((user) => (
                <tr key={user.id} className="hover:bg-brand-50/30 transition-all group cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-brand-primary/20">{user.avatar}</div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-black text-neutral-900 truncate tracking-tight group-hover:text-brand-primary transition-colors">{user.name}</span>
                        <span className="text-[10px] text-brand-primary font-black uppercase tracking-widest">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${user.status === 'verified' ? 'text-brand-primary' : 'text-amber-500'}`}>
                      {user.status === 'verified' ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {user.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col max-w-[180px]">
                      <span className="text-[11px] font-black text-neutral-900 group-hover:text-brand-primary transition-colors truncate">{user.address}</span>
                      <span className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">{user.orders} Orders</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-neutral-900 group-hover:text-brand-primary transition-colors">{user.lastActive}</span>
                      <span className="text-[9px] text-neutral-400 font-black uppercase tracking-[0.2em]">Joined: {user.joined}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-brand-primary text-brand-primary shadow-sm"><Mail className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-brand-primary hover:text-white rounded-xl transition-colors shadow-sm"><Eye className="w-4 h-4" /></button>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-300 group-hover:hidden" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DRAWER */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-6 border-b border-admin-border flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-brand-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-brand-primary/20 border-4 border-white">{selectedUser.avatar}</div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">{selectedUser.name}</h3>
                    <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest mt-1">ID: {selectedUser.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* CORE IDENTITY DATA */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-admin-border pb-2">Institutional Identity</h4>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Full Legal Name</p>
                            <p className="text-sm font-black text-neutral-900 tracking-tight">{selectedUser.name}</p>
                        </div>
                        <Settings className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Primary Contact</p>
                            <p className="text-sm font-black text-neutral-900 tracking-tight">{selectedUser.phone}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Digital Uplink (Mail)</p>
                            <p className="text-sm font-black text-neutral-900 tracking-tight truncate">{selectedUser.email}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Shipping & Billing Address</p>
                        <p className="text-sm font-black text-neutral-900 leading-relaxed mt-1">{selectedUser.address}</p>
                    </div>
                    <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Security Credentials (Pass)</p>
                            <p className="text-sm font-black text-neutral-900 tracking-[0.4em]">{selectedUser.pass}</p>
                        </div>
                        <button className="px-3 py-1.5 bg-brand-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md shadow-brand-primary/20">Reset</button>
                    </div>
                  </div>
                </div>



                {/* KPI STATS */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-brand-50 rounded-3xl border border-brand-100 group hover:bg-brand-primary transition-all">
                    <p className="text-[10px] font-black text-brand-primary group-hover:text-white/70 uppercase tracking-widest mb-1">Total LTV</p>
                    <p className="text-xl font-black text-neutral-900 group-hover:text-white tracking-tight">{selectedUser.ltv}</p>
                  </div>
                  <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-brand-primary transition-all">
                    <p className="text-[10px] font-black text-neutral-400 group-hover:text-white/70 uppercase tracking-widest mb-1">Total Orders</p>
                    <p className="text-xl font-black text-neutral-900 group-hover:text-white tracking-tight">{selectedUser.orders}</p>
                  </div>
                  <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-brand-primary transition-all">
                    <p className="text-[10px] font-black text-neutral-400 group-hover:text-white/70 uppercase tracking-widest mb-1">Reviews</p>
                    <p className="text-xl font-black text-neutral-900 group-hover:text-white tracking-tight">4</p>
                  </div>
                </div>

                {/* CLINICAL HISTORY */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-admin-border pb-2">Medical Profile</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-admin-border rounded-2xl group hover:border-brand-primary transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all flex items-center justify-center text-slate-400"><History className="w-5 h-5" /></div>
                        <div><p className="text-sm font-black text-neutral-900 group-hover:text-brand-primary transition-colors tracking-tight">Order History</p><p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Last: #MED-1024</p></div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white border border-admin-border rounded-2xl group hover:border-brand-primary transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all flex items-center justify-center text-slate-400"><ShieldCheck className="w-5 h-5" /></div>
                        <div><p className="text-sm font-black text-neutral-900 group-hover:text-brand-primary transition-colors tracking-tight">Medical Vault</p><p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">6 Saved Prescriptions</p></div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-8 border-t border-admin-border bg-white flex items-center gap-4">
                <button className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary shadow-xl flex items-center justify-center gap-2 transition-all">
                   <Mail className="w-4 h-4" /> Send Direct Email
                </button>
                <button className="flex-1 py-4 border border-rose-500 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
                   <ShieldAlert className="w-4 h-4" /> Block Account
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;
