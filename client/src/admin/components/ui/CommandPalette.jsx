import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Pill, 
  Users, 
  Clock, 
  ArrowRight,
  Command,
  Plus,
  ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const results = [
    { category: 'Quick Actions', items: [
      { id: 'add-med', icon: Plus, label: 'Add New Medicine', shortcut: 'A', action: () => navigate('/admin/medicines') },
      { id: 'view-rx', icon: ClipboardList, label: 'Review Pending Rx', shortcut: 'R', action: () => navigate('/admin/prescriptions') },
    ]},
    { category: 'Orders', items: [
      { id: 'order-1024', icon: ShoppingCart, label: 'Order #MED-1024 — Priya S.', detail: 'Pending • ₹340', action: () => navigate('/admin/orders') },
      { id: 'order-1023', icon: ShoppingCart, label: 'Order #MED-1023 — Rahul M.', detail: 'Confirmed • ₹1,240', action: () => navigate('/admin/orders') },
    ]},
    { category: 'Medicines', items: [
      { id: 'med-1', icon: Pill, label: 'Paracetamol 500mg', detail: 'Crocin • 124 in stock', action: () => navigate('/admin/medicines') },
      { id: 'med-2', icon: Pill, label: 'Amoxicillin 250mg', detail: 'Mox • 42 in stock', action: () => navigate('/admin/medicines') },
    ]},
    { category: 'Recent Pages', items: [
      { id: 'nav-dash', icon: Clock, label: 'Dashboard', action: () => navigate('/admin') },
      { id: 'nav-analytics', icon: Clock, label: 'Analytics', action: () => navigate('/admin/analytics') },
    ]},
  ];

  const filteredResults = search 
    ? results.map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.label.toLowerCase().includes(search.toLowerCase()) || 
          item.category?.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(group => group.items.length > 0)
    : results;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
          />

          {/* Palette container */}
          <div className="fixed inset-0 z-[201] pointer-events-none flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-admin-modal overflow-hidden pointer-events-auto border border-admin-border"
            >
              {/* Search input */}
              <div className="relative p-6 border-b border-admin-border">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Type a command or search for orders, medicines, users..."
                  className="w-full bg-transparent pl-12 pr-6 text-xl font-display font-medium text-admin-text-primary focus:outline-none placeholder:text-slate-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto admin-scrollbar p-3">
                {filteredResults.length > 0 ? (
                  filteredResults.map((group) => (
                    <div key={group.category} className="mb-4 last:mb-0">
                      <h4 className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.category}</h4>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              item.action();
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-all text-left group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-admin-text-primary">{item.label}</p>
                              {item.detail && <p className="text-xs text-admin-text-secondary font-medium">{item.detail}</p>}
                            </div>
                            {item.shortcut ? (
                              <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase">
                                <Command className="w-2.5 h-2.5" />
                                <span>{item.shortcut}</span>
                              </div>
                            ) : (
                              <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-2">
                    <div className="text-4xl">🔍</div>
                    <p className="text-sm font-bold text-admin-text-primary">No results found for "{search}"</p>
                    <p className="text-xs text-admin-text-secondary">Try searching for something else or browse categories.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-admin-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-white border border-admin-border rounded text-[10px] font-bold text-slate-500 shadow-sm">ESC</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Close</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-white border border-admin-border rounded text-[10px] font-bold text-slate-500 shadow-sm">↑↓</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-white border border-admin-border rounded text-[10px] font-bold text-slate-500 shadow-sm">↵</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  MediCheap Command v1.2
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
