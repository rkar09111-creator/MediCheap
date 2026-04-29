import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Database,
  X,
  CheckCircle2,
  ChevronRight,
  Info,
  Pill,
  Layers,
  Users,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const TrashCenter = () => {
  const [activeType, setActiveType] = useState('Medicines');

  const items = [
    { id: 'DEL-101', name: 'Old Amoxicillin Batch', type: 'Medicines', deletedAt: '2 days ago', deletedBy: 'Admin Arjun', size: '4.2 KB' },
    { id: 'DEL-102', name: 'Obsolete Vitamin Category', type: 'Categories', deletedAt: '5 days ago', deletedBy: 'Admin Priya', size: '1.8 KB' },
    { id: 'DEL-103', name: 'Test User Account', type: 'Users', deletedAt: '1 week ago', deletedBy: 'System', size: '12 KB' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Trash2 className="w-6 h-6 text-danger" />
            Trash & Recovery Center
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Safely restore deleted items or permanently purge obsolete data.</p>
        </div>
        <button className="admin-btn-ghost border border-danger text-danger hover:bg-danger hover:text-white px-8 flex items-center gap-2 h-11">
          <Trash2 className="w-4 h-4" />
          <span>Empty Trash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR: TYPES */}
        <div className="lg:col-span-3 space-y-6">
          <div className="admin-card p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest mb-2">Deleted Entities</h3>
            <div className="space-y-1">
              {[
                { label: 'Medicines', icon: Pill, count: 12 },
                { label: 'Categories', icon: Layers, count: 4 },
                { label: 'Users', icon: Users, count: 8 },
                { label: 'Media', icon: Database, count: 42 },
              ].map((type) => (
                <button 
                  key={type.label}
                  onClick={() => setActiveType(type.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeType === type.label ? 'bg-danger text-white shadow-lg shadow-danger/20' : 'text-admin-text-secondary hover:bg-slate-50'}`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                  <span className={`ml-auto text-[9px] font-bold ${activeType === type.label ? 'text-white/60' : 'text-slate-300'}`}>{type.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-card p-6 border-l-4 border-amber-500 bg-amber-50/30">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              Auto-Purge Policy
            </h4>
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">Items in the trash will be permanently deleted after 30 days of inactivity.</p>
          </div>
        </div>

        {/* MAIN: DELETED LIST */}
        <div className="lg:col-span-9 space-y-6">
          <div className="admin-card p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
              <input type="text" placeholder="Search deleted items..." className="admin-input pl-12 h-11 bg-slate-50/50" />
            </div>
            <button className="admin-btn-ghost border border-admin-border h-11 px-6"><Filter className="w-4 h-4 mr-2" /> All Time</button>
          </div>

          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Deleted By</th>
                    <th className="px-6 py-4">Deleted Date</th>
                    <th className="px-6 py-4">Data Size</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.filter(i => i.type === activeType).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-admin-text-primary">{item.name}</span>
                          <span className="text-[10px] text-admin-text-secondary font-mono uppercase mt-0.5">{item.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-admin-text-secondary">{item.deletedBy}</td>
                      <td className="px-6 py-4 text-xs font-bold text-admin-text-secondary">{item.deletedAt}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">{item.size}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-sm" title="Restore Item"><RotateCcw className="w-4 h-4" /></button>
                          <button className="p-2 bg-danger/5 text-danger rounded-xl hover:bg-danger hover:text-white transition-all shadow-sm" title="Delete Permanently"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <MoreVertical className="w-4 h-4 text-slate-300 group-hover:hidden" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {items.filter(i => i.type === activeType).length === 0 && (
              <div className="p-20 text-center flex flex-col items-center justify-center opacity-40">
                <CheckCircle2 className="w-16 h-16 text-success mb-4" />
                <h3 className="text-xl font-display font-bold text-admin-text-primary">Trash is Empty</h3>
                <p className="text-sm text-admin-text-secondary mt-2">Everything is clean for {activeType}!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashCenter;
