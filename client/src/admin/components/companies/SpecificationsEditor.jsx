import React from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const SpecificationsEditor = ({ specs, onChange }) => {
  const handleAdd = () => {
    onChange([...specs, { key: '', value: '' }]);
  };

  const handleRemove = (index) => {
    onChange(specs.filter((_, i) => i !== index));
  };

  const handleUpdate = (index, field, val) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    onChange(newSpecs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Product Specifications</h4>
        <button 
          type="button" 
          onClick={handleAdd}
          className="text-[10px] font-black text-brand-green uppercase tracking-widest flex items-center gap-1 hover:underline"
        >
          <Plus size={12} /> Add Field
        </button>
      </div>

      <div className="space-y-3">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="text-neutral-300 cursor-grab active:cursor-grabbing"><GripVertical size={16} /></div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <input 
                type="text" 
                placeholder="e.g. Pack Size" 
                value={spec.key}
                onChange={(e) => handleUpdate(index, 'key', e.target.value)}
                className="admin-input h-10 text-[11px] font-bold"
              />
              <input 
                type="text" 
                placeholder="e.g. 10 Tablets" 
                value={spec.value}
                onChange={(e) => handleUpdate(index, 'value', e.target.value)}
                className="admin-input h-10 text-[11px] font-bold border-brand-green/10"
              />
            </div>
            <button 
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {specs.length === 0 && (
          <div className="py-8 text-center border-2 border-dashed border-neutral-100 rounded-2xl">
            <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">No Specifications Added</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificationsEditor;
