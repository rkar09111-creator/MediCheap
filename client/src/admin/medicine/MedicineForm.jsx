import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Info, 
  DollarSign, 
  AlertCircle, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Tag,
  Star,
  UploadCloud,
  X
} from 'lucide-react';

const FormSection = ({ title, children }) => (
  <div className="mb-8 last:mb-0">
    <h3 className="text-xs font-bold text-admin-text-secondary uppercase tracking-[0.2em] mb-4 border-b border-admin-border pb-2">
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const MedicineForm = ({ initialData, onDataChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: 'General',
    categoryNumber: '',
    description: '',
    price: '',
    discountType: 'none', // none, percentage, amount
    discountValue: 0,
    stock: '',
    threshold: 10,
    requiresPrescription: false,
    isAvailable: true,
    isRecommended: false,
    images: []
  });

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.images) setPreviewImages(initialData.images);
    }
  }, [initialData]);

  // Sync with parent
  useEffect(() => {
    if (onDataChange) onDataChange(formData);
  }, [formData]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result]);
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const calculateDiscountedPrice = () => {
    const price = Number(formData.price) || 0;
    const disc = Number(formData.discountValue) || 0;
    if (formData.discountType === 'percentage') {
      return price - (price * (disc / 100));
    } else if (formData.discountType === 'amount') {
      return Math.max(0, price - disc);
    }
    return price;
  };

  return (
    <div className="space-y-2">
      <FormSection title="Catalog Identification">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">Serial Number (SN)</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="e.g. SN-48293"
              value={formData.serialNumber}
              onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">Category Number</label>
            <input 
              type="number" 
              className="admin-input" 
              placeholder="e.g. 101"
              value={formData.categoryNumber}
              onChange={(e) => setFormData({...formData, categoryNumber: e.target.value})}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-admin-text-primary">Item Name*</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="e.g. Paracetamol 500mg"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-admin-text-primary">Category Display Name*</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="e.g. Tablets"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-admin-text-primary">Description</label>
            <textarea 
              className="admin-input min-h-[100px] py-3" 
              placeholder="Describe the item, dosage, etc..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Pricing & Offers">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-admin-text-primary">Base Price (MRP)*</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary">₹</span>
              <input 
                type="number" 
                className="admin-input pl-7" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-admin-text-primary">Discount Type</label>
            <select 
              className="admin-input"
              value={formData.discountType}
              onChange={(e) => setFormData({...formData, discountType: e.target.value})}
            >
              <option value="none">No Discount</option>
              <option value="percentage">Percentage (%)</option>
              <option value="amount">Fixed Amount (₹)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-admin-text-primary">Discount Value</label>
            <input 
              type="number" 
              className="admin-input" 
              value={formData.discountValue}
              onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
              disabled={formData.discountType === 'none'}
            />
          </div>
        </div>
        {formData.discountType !== 'none' && formData.price > 0 && (
          <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
            <Tag className="w-4 h-4 text-green-600" />
            <p className="text-xs font-bold text-green-700">
              Final Selling Price: <span className="text-lg">₹{calculateDiscountedPrice()}</span>
            </p>
          </div>
        )}
      </FormSection>

      <FormSection title="Inventory & Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-admin-text-primary">Stock Quantity*</label>
            <input 
              type="number" 
              className="admin-input" 
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-3 pt-6">
            <label className="flex items-center justify-between p-3 bg-slate-50 border border-admin-border rounded-xl cursor-pointer group hover:bg-white transition-all">
              <div className="flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-bold text-admin-text-primary">Requires Rx?</span>
              </div>
              <button 
                onClick={() => setFormData({...formData, requiresPrescription: !formData.requiresPrescription})}
                className={`w-9 h-4.5 rounded-full relative transition-colors ${formData.requiresPrescription ? 'bg-pink-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${formData.requiresPrescription ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 border border-admin-border rounded-xl cursor-pointer group hover:bg-white transition-all">
              <div className="flex gap-2 items-center">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-admin-text-primary">Recommended?</span>
              </div>
              <button 
                onClick={() => setFormData({...formData, isRecommended: !formData.isRecommended})}
                className={`w-9 h-4.5 rounded-full relative transition-colors ${formData.isRecommended ? 'bg-amber-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${formData.isRecommended ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </label>
          </div>
        </div>
      </FormSection>

      <FormSection title="Item Images">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <label className="aspect-square border-2 border-dashed border-admin-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer group">
            <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
            <UploadCloud className="w-6 h-6 text-admin-text-secondary group-hover:text-primary-600" />
            <span className="text-[10px] font-bold text-admin-text-secondary uppercase group-hover:text-primary-600">Add Image</span>
          </label>
          {previewImages.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group border border-admin-border shadow-sm">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => removeImage(idx)} className="p-1.5 bg-white text-red-500 rounded-lg shadow-lg hover:scale-110 transition-transform">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {idx === 0 && <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary-500 text-white text-[8px] font-bold uppercase rounded shadow-md">Main</div>}
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
};

export default MedicineForm;
