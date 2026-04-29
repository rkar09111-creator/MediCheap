import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Percent, 
  DollarSign, 
  Users, 
  Calendar, 
  Zap, 
  Star, 
  MousePointer2,
  X,
  Edit2,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Layout,
  FileText
} from 'lucide-react';

const PricingManager = () => {
  const [activeTab, setActiveTab] = useState('rules');

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Tag className="w-6 h-6 text-primary-500" />
            Pricing & Discount Engine
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Configure global pricing rules, medical coupons, and flash sales.</p>
        </div>
        <div className="flex gap-3">
          <button className="admin-btn-primary flex items-center gap-2 shadow-lg shadow-brand-500/20">
            <Plus className="w-4 h-4" />
            <span>Create New Rule</span>
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-6 border-b border-admin-border overflow-x-auto no-scrollbar">
        {[
          { id: 'rules', label: 'Discount Rules', icon: Zap },
          { id: 'coupons', label: 'Coupons & Promos', icon: FileText },
          { id: 'customers', label: 'Loyalty Pricing', icon: Users },
          { id: 'bulk', label: 'Bulk Price Update', icon: Layout },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 pb-4 px-2 text-[11px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'rules' && (
          <motion.div 
            key="rules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { title: 'Site-wide Flat Discount', value: '10% OFF', status: 'Active', color: 'bg-green-50 text-green-600', icon: Zap },
                { title: 'First Order Special', value: '₹100 OFF', status: 'Active', color: 'bg-blue-50 text-blue-600', icon: Star },
                { title: 'Wellness Week Sale', value: '15% OFF', status: 'Scheduled', color: 'bg-amber-50 text-amber-600', icon: Clock },
              ].map((card, i) => (
                <div key={i} className="admin-card p-6 flex flex-col justify-between group hover:border-primary-300 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${card.color}`}><card.icon className="w-6 h-6" /></div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${card.status === 'Active' ? 'bg-success text-white' : 'bg-slate-100 text-slate-500'}`}>{card.status}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-admin-text-primary">{card.title}</h4>
                    <p className="text-2xl font-display font-bold text-primary-600 mt-1">{card.value}</p>
                    <p className="text-[10px] text-admin-text-secondary font-medium mt-1 uppercase tracking-wider">Applied to 1,284 products</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(j => <div key={j} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />)}
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold">+12</div>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-all"><Edit2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-card overflow-hidden">
              <div className="p-6 border-b border-admin-border flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-display font-bold text-admin-text-primary">Advanced Pricing Logic</h3>
                <div className="flex gap-2">
                  <button className="admin-btn-ghost border border-admin-border px-4 py-2 text-xs"><History className="w-4 h-4 mr-2" /> Logs</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                      <th className="px-6 py-4">Rule Name</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Value</th>
                      <th className="px-6 py-4">Conditions</th>
                      <th className="px-6 py-4">Usage</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3, 4].map((id) => (
                      <tr key={id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-admin-text-primary">Weekend Wellness Bash</span>
                            <span className="text-[10px] text-admin-text-secondary font-medium">Ends in 2 days</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase">Categorical</span></td>
                        <td className="px-6 py-4 text-sm font-bold text-primary-600">15% OFF</td>
                        <td className="px-6 py-4 text-xs font-medium text-admin-text-secondary">Category: Tablets, Min Order: ₹499</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-primary-500" style={{ width: '65%' }} /></div>
                            <span className="text-[11px] font-bold text-admin-text-primary">842</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-admin-border text-slate-600"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-danger/10 text-danger rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-slate-300 group-hover:hidden" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'coupons' && (
          <motion.div 
            key="coupons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="admin-card p-12 text-center flex flex-col items-center justify-center border-dashed">
              <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-brand-500/10">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-display font-bold text-admin-text-primary mb-2">Create High-Conversion Coupons</h3>
              <p className="text-sm text-admin-text-secondary max-w-md mx-auto mb-8">Generate unique medical promo codes with usage limits, date expirations, and medicine-specific restrictions.</p>
              <button className="admin-btn-primary px-10 py-3 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Generate Coupon Code
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['MED20', 'HEALTH100', 'RXSAVE', 'NEWUSER'].map((code) => (
                <div key={code} className="admin-card p-6 relative overflow-hidden group hover:border-primary-400 transition-all cursor-pointer">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />
                  <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.2em] mb-4">Promo Code</p>
                  <h4 className="text-2xl font-mono font-bold text-primary-600 flex items-center gap-2">
                    {code}
                    <button className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-300"><MousePointer2 className="w-3 h-3" /></button>
                  </h4>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-admin-text-secondary uppercase">Redemptions</p>
                      <p className="text-sm font-bold text-admin-text-primary">124 Used</p>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-all"><Edit2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingManager;
