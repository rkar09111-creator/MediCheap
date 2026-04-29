import React, { useState } from 'react';
import { Search, SlidersHorizontal, Download, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataTable = ({ 
  title, 
  count, 
  columns, 
  data, 
  isLoading,
  onSearch,
  onFilter,
  onExport,
  actions 
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleAll = () => {
    if (selectedRows.length === data.length) setSelectedRows([]);
    else setSelectedRows(data.map((_, i) => i));
  };

  const toggleRow = (index) => {
    if (selectedRows.includes(index)) setSelectedRows(selectedRows.filter(i => i !== index));
    else setSelectedRows([...selectedRows, index]);
  };

  return (
    <div className="page-card">
      {/* Header Bar */}
      <div className="page-card-header flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-md font-semibold text-admin-text-primary">{title}</h2>
          <span className="bg-admin-bg border border-admin-border rounded-full px-2 py-0.5 text-[10px] font-bold text-admin-text-secondary font-mono">
            {count}
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary group-focus-within:text-brand-green transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="admin-input pl-9 w-[180px] focus:w-[260px]"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>

          <button onClick={onFilter} className="btn-admin btn-admin-secondary h-9 px-3">
            <SlidersHorizontal size={14} />
            <span className="text-xs">Filter</span>
          </button>

          <button onClick={onExport} className="btn-admin btn-admin-secondary h-9 px-3">
            <Download size={14} />
            <span className="text-xs">Export</span>
          </button>

          {actions}
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto admin-scrollbar">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-admin-bg/50 border-b border-admin-border">
              <th className="w-10 pl-5 pr-2 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="rounded border-admin-border text-brand-green focus:ring-brand-green"
                  checked={selectedRows.length === data?.length && data?.length > 0}
                  onChange={toggleAll}
                />
              </th>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-admin-text-tertiary uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="relative">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="border-b border-admin-border-2">
                  <td className="pl-5 pr-2 py-4"><div className="w-4 h-4 bg-admin-border-2 rounded animate-pulse" /></td>
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-admin-border-2 rounded-full animate-pulse" style={{ width: `${Math.random() * 50 + 30}%` }} />
                    </td>
                  ))}
                  <td className="px-4 py-4"><div className="w-4 h-4 bg-admin-border-2 rounded animate-pulse" /></td>
                </tr>
              ))
            ) : data?.length > 0 ? (
              data.map((row, i) => (
                <tr 
                  key={i} 
                  className={`border-b border-admin-border-2 hover:bg-admin-bg/30 transition-colors ${selectedRows.includes(i) ? 'bg-brand-green-50/30' : ''}`}
                >
                  <td className="pl-5 pr-2 py-3.5">
                    <input 
                      type="checkbox" 
                      className="rounded border-admin-border text-brand-green focus:ring-brand-green"
                      checked={selectedRows.includes(i)}
                      onChange={() => toggleRow(i)}
                    />
                  </td>
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-3.5 text-admin-text-primary font-medium">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3.5">
                    <button className="text-admin-text-tertiary hover:text-admin-text-primary transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 2} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-admin-bg flex items-center justify-center text-admin-text-tertiary">
                      <Search size={24} />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-admin-text-primary">No results found</h3>
                      <p className="text-xs text-admin-text-tertiary">Try adjusting your filters or search term</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="page-card-footer flex justify-between items-center bg-white">
        <span className="text-[11px] font-medium text-admin-text-tertiary uppercase tracking-wider">
          Showing 1-{data?.length || 0} of {count || 0} results
        </span>
        <div className="flex gap-1.5">
          <button className="w-8 h-8 rounded-lg border border-admin-border flex items-center justify-center hover:bg-admin-bg text-admin-text-secondary disabled:opacity-30" disabled>
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg border border-admin-border flex items-center justify-center bg-brand-green text-white font-bold text-xs">1</button>
          <button className="w-8 h-8 rounded-lg border border-admin-border flex items-center justify-center hover:bg-admin-bg text-admin-text-secondary text-xs font-bold">2</button>
          <button className="w-8 h-8 rounded-lg border border-admin-border flex items-center justify-center hover:bg-admin-bg text-admin-text-secondary">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-admin-text-primary text-white rounded-2xl shadow-2xl px-6 py-3.5 flex items-center gap-6 z-[100] border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="bg-brand-green text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">{selectedRows.length}</span>
              <span className="text-sm font-semibold">Selected items</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors">Export selected</button>
              <button className="px-3 py-1.5 rounded-lg bg-danger/20 hover:bg-danger text-danger hover:text-white text-xs font-bold transition-colors">Delete selected</button>
            </div>
            <button onClick={() => setSelectedRows([])} className="text-white/40 hover:text-white transition-colors ml-4">
              <ChevronRight size={20} className="rotate-90" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataTable;
