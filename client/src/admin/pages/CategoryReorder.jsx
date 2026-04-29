import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { categoryService, adminService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  GripVertical, 
  Layers, 
  Save, 
  RotateCcw, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  Pill,
  Smartphone,
  Monitor,
  Layout,
  X
} from 'lucide-react';

const CategoryReorder = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.getAll();
        const sorted = data.data.categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setCategories(sorted);
      } catch (error) {
        toast.error('Failed to load category hierarchy');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [hasChanges, setHasChanges] = useState(false);

  const handleReorder = (newOrder) => {
    setCategories(newOrder);
    setHasChanges(true);
  };

  const handlePublish = async () => {
    try {
      const updates = categories.map((cat, index) => ({
        id: cat._id,
        displayOrder: index
      }));
      await adminService.reorderCategories(updates);
      toast.success('Category Hierarchy Published.');
      setHasChanges(false);
    } catch (error) {
      toast.error('Sync failed');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Layers className="w-6 h-6 text-primary-500" />
            Category Hierarchy Engine
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Define the display order of categories on the MediCheap customer storefront.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setHasChanges(false)} className={`admin-btn-ghost border border-admin-border h-11 px-6 flex items-center gap-2 ${!hasChanges && 'opacity-50 cursor-not-allowed'}`}><RotateCcw className="w-4 h-4" /> <span>Reset Order</span></button>
          <button 
            onClick={handlePublish}
            className={`admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-500/20 px-10 transition-all ${!hasChanges && 'opacity-50 grayscale'}`}
          >
            <Save className="w-4 h-4" /> <span>Publish Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
        {/* DRAGGABLE LIST */}
        <div className="lg:col-span-6 space-y-6">
          <div className="admin-card p-4 bg-slate-900 border-none flex items-center justify-between">
             <div className="flex items-center gap-3 text-white">
               <Info className="w-5 h-5 text-primary-400" />
               <span className="text-xs font-bold uppercase tracking-widest">Tip: Drag items using the handle to reorder</span>
             </div>
             <span className="text-[10px] font-mono text-white/40 uppercase">LIVE PREVIEW ENABLED</span>
          </div>

          <Reorder.Group axis="y" values={categories} onReorder={handleReorder} className="space-y-3">
            {categories.map((category) => (
              <Reorder.Item 
                key={category._id} 
                value={category}
                className="admin-card p-5 cursor-grab active:cursor-grabbing hover:border-primary-300 transition-all group flex items-center gap-6"
              >
                <div className="text-slate-300 group-hover:text-primary-500 transition-colors"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-1 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Layers className="w-5 h-5" /></div>
                      <div>
                        <h4 className="text-sm font-bold text-admin-text-primary">{category.name}</h4>
                        <p className="text-[10px] text-admin-text-secondary font-bold uppercase tracking-widest mt-0.5">{category.itemCount || 0} Medicines Linked</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="flex flex-col text-right">
                         <span className="text-[9px] font-bold text-admin-text-secondary uppercase">Position</span>
                         <span className="text-xs font-mono font-bold text-primary-600">#{categories.indexOf(category) + 1}</span>
                      </div>
                                             <span className={`px-2 py-1 text-[9px] font-bold rounded uppercase border ${category.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-neutral-50 text-neutral-400 border-neutral-100'}`}>
                         {category.isActive ? 'Active' : 'Hidden'}
                       </span>

                   </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {/* PREVIEW PANEL */}
        <div className="lg:col-span-4 space-y-8">
           <div className="admin-card p-8 bg-slate-50 border-dashed border-2 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><Layout className="w-32 h-32" /></div>
              <h3 className="text-sm font-bold text-admin-text-secondary uppercase tracking-[0.2em] mb-4">Mobile App Preview</h3>
              
              <div className="w-full max-w-[280px] mx-auto bg-white rounded-[32px] shadow-2xl border-[6px] border-slate-900 aspect-[9/19] overflow-hidden p-4 pt-10 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-b-xl z-20" />
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between"><div className="w-20 h-3 bg-slate-100 rounded" /> <div className="w-4 h-4 bg-slate-100 rounded-full" /></div>
                    <div className="grid grid-cols-2 gap-3">
                       {categories.slice(0, 4).map((cat, i) => (
                         <div key={i} className="p-3 bg-slate-50 rounded-xl flex flex-col items-center text-center gap-2 border border-slate-100 scale-95 origin-top">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"><Pill className="w-4 h-4 text-primary-500" /></div>
                            <span className="text-[9px] font-bold text-slate-800 leading-tight">{cat.name}</span>
                         </div>
                       ))}
                    </div>
                    <div className="w-full h-20 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100 mt-4"><span className="text-[10px] font-bold text-primary-600 uppercase">Interactive Banner Area</span></div>
                 </div>
              </div>

              <div className="text-center">
                 <p className="text-xs font-bold text-admin-text-secondary leading-relaxed px-10">This preview shows the order of categories in the top navigation and home grid of the customer app.</p>
              </div>
           </div>

           <div className="admin-card p-6 bg-slate-900 text-white space-y-4">
              <h4 className="text-xs font-bold text-primary-400 uppercase tracking-widest">Structural Audit</h4>
              <p className="text-xs text-white/60 leading-relaxed">Rearranging categories updates the **Search Index** and **Navigation Cache** site-wide. It is recommended to perform this during low-traffic periods.</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-success" /></div>
                 <span className="text-[10px] font-bold uppercase">Ready to sync changes</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryReorder;
