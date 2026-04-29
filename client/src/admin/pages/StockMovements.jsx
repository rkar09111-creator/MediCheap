import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  History, 
  Package, 
  User, 
  Clock, 
  Download, 
  Calendar,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  MoreVertical,
  Activity,
  MoreHorizontal
} from 'lucide-react';

const MovementTypeBadge = ({ type }) => {
  const styles = {
    Addition: 'bg-green-100 text-green-600 border-green-200',
    Removal: 'bg-blue-100 text-blue-600 border-blue-200',
    Adjustment: 'bg-amber-100 text-amber-600 border-amber-200',
    Waste: 'bg-red-100 text-red-600 border-red-200',
  };
  
  return (
    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${styles[type] || styles.Adjustment}`}>
      {type === 'Addition' ? <PlusCircle className="w-3 h-3" /> : type === 'Removal' ? <MinusCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
      {type}
    </span>
  );
};

const StockMovements = () => {
  const [filter, setFilter] = useState('All');

  const movements = [
    { 
      id: 'MOV-2001', 
      medicine: 'Paracetamol 500mg', 
      type: 'Addition', 
      qty: '+500', 
      reason: 'Procurement (Sun Pharma)', 
      admin: 'Arjun Gupta',
      time: '12 mins ago'
    },
    { 
      id: 'MOV-2002', 
      medicine: 'Amoxicillin 250mg', 
      type: 'Removal', 
      qty: '-2', 
      reason: 'Order Fulfillment (#MED-1024)', 
      admin: 'System',
      time: '45 mins ago'
    },
    { 
      id: 'MOV-2003', 
      medicine: 'Vitamin C 1000mg', 
      type: 'Adjustment', 
      qty: '-10', 
      reason: 'Stock Audit Correction', 
      admin: 'Priya Verma',
      time: '2h ago'
    },
    { 
      id: 'MOV-2004', 
      medicine: 'Metformin 500mg', 
      type: 'Waste', 
      qty: '-50', 
      reason: 'Expired Batch Purge', 
      admin: 'Dr. Sameer',
      time: '1d ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <History className="w-6 h-6 text-primary-500" />
            Inventory Movement Ledger
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Audit log of all physical stock additions, removals, and adjustments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-btn-ghost border border-admin-border h-11 px-6 flex items-center gap-2"><Calendar className="w-4 h-4" /> <span>Last 7 Days</span></button>
          <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-500/20 px-8"><Download className="w-4 h-4" /> <span>Export Ledger</span></button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Additions', value: '4,280 Units', icon: PlusCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Sales', value: '1,842 Units', icon: MinusCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Stock Accuracy', value: '99.4%', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-6">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 shadow-sm`}><stat.icon className="w-6 h-6" /></div>
            <p className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1 p-1 bg-white border border-admin-border rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
        {['All', 'Additions', 'Sales', 'Adjustments', 'Waste'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap uppercase tracking-widest ${filter === f ? 'bg-primary-500 text-white shadow-lg shadow-brand-500/20' : 'text-admin-text-secondary hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LEDGER TABLE */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-admin-border bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="relative flex-1 w-full md:max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
             <input type="text" placeholder="Search by medicine, admin or reason..." className="admin-input pl-10 h-10 text-xs" />
           </div>
           <button className="admin-btn-ghost text-xs border border-admin-border h-10"><RefreshCw className="w-3.5 h-3.5 mr-2" /> Sync Records</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Movement Type</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Reason / Source</th>
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center"><Package className="w-4 h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-admin-text-primary">{mov.medicine}</span>
                        <span className="text-[10px] text-admin-text-secondary font-mono uppercase">{mov.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <MovementTypeBadge type={mov.type} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${mov.qty.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{mov.qty}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-admin-text-secondary">
                    {mov.reason}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">{mov.admin.split(' ').map(n=>n[0]).join('')}</div>
                      <span className="text-[11px] font-bold text-admin-text-primary">{mov.admin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-admin-text-secondary uppercase">
                    {mov.time}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-admin-border text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <MoreVertical className="w-4 h-4 text-slate-300 group-hover:hidden" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockMovements;
