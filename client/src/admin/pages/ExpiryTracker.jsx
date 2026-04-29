import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Archive, 
  Tag, 
  RotateCcw, 
  Calendar, 
  MoreVertical, 
  TrendingDown, 
  Pill, 
  Info,
  ChevronRight,
  ArrowRight,
  Download,
  ShieldAlert,
  MoreHorizontal
} from 'lucide-react';

const ExpiryStatusBadge = ({ daysLeft }) => {
  if (daysLeft <= 0) return (
    <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-600 border border-red-200 flex items-center gap-1.5">
      <XCircle className="w-3 h-3" /> Expired
    </span>
  );
  if (daysLeft <= 30) return (
    <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 border border-orange-200 flex items-center gap-1.5">
      <AlertTriangle className="w-3 h-3" /> Critical ({daysLeft}d)
    </span>
  );
  if (daysLeft <= 90) return (
    <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-600 border border-amber-200 flex items-center gap-1.5">
      <Clock className="w-3 h-3" /> Warning ({daysLeft}d)
    </span>
  );
  return (
    <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-600 border border-green-200 flex items-center gap-1.5">
      <CheckCircle2 className="w-3 h-3" /> Safe ({daysLeft}d)
    </span>
  );
};

const ExpiryTracker = () => {
  const [filter, setFilter] = useState('Critical');

  const batches = [
    { id: 'BAT-9001', name: 'Amoxicillin 250mg', batchNo: 'AX-2024-01', expiry: '2024-04-15', daysLeft: -7, stock: 120, supplier: 'Sun Pharma' },
    { id: 'BAT-9002', name: 'Paracetamol 500mg', batchNo: 'PC-2024-04', expiry: '2024-05-12', daysLeft: 20, stock: 450, supplier: 'Cipla Ltd' },
    { id: 'BAT-9003', name: 'Vitamin C 1000mg', batchNo: 'VC-2024-08', expiry: '2024-07-22', daysLeft: 91, stock: 280, supplier: 'Abbott' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary-500" />
            Clinical Expiry Audit
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Audit batch-specific medicine shelf-life and manage waste reduction workflows.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-btn-ghost border border-admin-border h-11 px-6 flex items-center gap-2"><Download className="w-4 h-4" /> <span>Export Report</span></button>
          <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-500/20 px-8"><ShieldAlert className="w-4 h-4" /> <span>Audit All Batches</span></button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Expired Items', value: '42', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Critical (< 30d)', value: '18', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Total Value at Risk', value: '₹14,250', icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Returns Pending', value: '6', icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}><stat.icon className="w-5 h-5" /></div>
            <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1 p-1 bg-white border border-admin-border rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
        {['All', 'Expired', 'Critical', 'Warning', 'Safe'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap uppercase tracking-widest ${filter === f ? 'bg-primary-500 text-white shadow-lg shadow-brand-500/20' : 'text-admin-text-secondary hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* BATCH TABLE */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-admin-border bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="relative flex-1 w-full md:max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
             <input type="text" placeholder="Search by batch, medicine or supplier..." className="admin-input pl-10 h-10 text-xs" />
           </div>
           <button className="admin-btn-ghost text-xs border border-admin-border h-10"><Filter className="w-3.5 h-3.5 mr-2" /> Supplier Group</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                <th className="px-6 py-4">Medicine & Batch</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Current Risk</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Supplier Source</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shadow-sm"><Pill className="w-5 h-5" /></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-admin-text-primary">{batch.name}</span>
                        <span className="text-[10px] font-mono text-primary-600 font-bold uppercase">{batch.batchNo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-admin-text-primary">{new Date(batch.expiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="text-[9px] text-admin-text-secondary font-bold uppercase tracking-widest mt-0.5">Physical Audit Pending</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ExpiryStatusBadge daysLeft={batch.daysLeft} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-admin-text-primary">{batch.stock} Units</span>
                      <span className="text-[10px] text-admin-text-secondary font-medium">Value: ₹{batch.stock * 45}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-admin-text-secondary">{batch.supplier}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-admin-border text-slate-600 shadow-sm" title="Clearance Sale"><Tag className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-danger/5 text-danger rounded-xl hover:bg-danger hover:text-white transition-all shadow-sm" title="Mark as Waste"><Archive className="w-4 h-4" /></button>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-300 group-hover:hidden" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WASTE REDUCTION TIP */}
      <div className="admin-card p-6 border-l-4 border-primary-500 bg-primary-50/30 flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-white border border-primary-100 text-primary-500 flex items-center justify-center shadow-sm shrink-0"><Info className="w-8 h-8" /></div>
        <div className="flex-1">
           <h4 className="text-sm font-bold text-admin-text-primary">Proactive Waste Management</h4>
           <p className="text-[11px] text-admin-text-secondary font-medium leading-relaxed mt-1">You have 4 batches entering the 'Critical' window next week. Consider triggering an automated **"Flash Clearance Sale"** for these items to recover cost before expiry.</p>
        </div>
        <button className="px-6 py-2.5 bg-primary-500 text-white text-[10px] font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:bg-primary-600 transition-all flex items-center gap-2 whitespace-nowrap">
           <Tag className="w-3.5 h-3.5" /> Start Clearance
        </button>
      </div>
    </div>
  );
};

export default ExpiryTracker;
