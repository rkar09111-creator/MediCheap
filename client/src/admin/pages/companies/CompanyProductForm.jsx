import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ArrowLeft, 
  Save, 
  Trash2, 
  ChevronRight, 
  AlertCircle, 
  ShieldCheck,
  Tag,
  Boxes,
  Activity,
  Calculator,
  Search,
  X
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { companyService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import ProductImageManager from '../../components/companies/ProductImageManager';
import SpecificationsEditor from '../../components/companies/SpecificationsEditor';

const CompanyProductForm = () => {
  const { companyId, id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: searchParams.get('category') || '',
    shortDescription: '',
    description: '',
    specifications: [],
    images: [],
    mrp: 0,
    sellingPrice: 0,
    gst: 5,
    stock: 0,
    minStockAlert: 10,
    unit: 'strip',
    packSize: '',
    requiresPrescription: false,
    isAvailable: true,
    isFeatured: false,
    displayOrder: 0,
    searchTags: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const { data: compData } = await companyService.getById(companyId);
        setCompany(compData.data.company);
        
        const { data: catData } = await companyService.getCategories(companyId);
        setCategories(catData.data.categories);

        if (isEdit) {
          const { data: prodData } = await companyService.getProductById(id);
          setFormData(prodData.data.product);
        } else if (catData.data.categories.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: catData.data.categories[0]._id }));
        }
      } catch (error) {
        toast.error('Failed to sync entity data');
        navigate(`/admin/companies/${companyId}`);
      } finally {
        setFetching(false);
      }
    };
    init();
  }, [companyId, id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.searchTags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, searchTags: [...prev.searchTags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({ ...prev, searchTags: prev.searchTags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error('Category designation required');
    
    setLoading(true);
    try {
      if (isEdit) {
        await companyService.updateProduct(companyId, id, formData);
        toast.success('Inventory registry updated');
      } else {
        await companyService.addProduct(companyId, formData);
        toast.success('New product initialized in pipeline');
      }
      navigate(`/admin/companies/${companyId}?tab=products`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const discountValue = formData.mrp > 0 ? Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100) : 0;
  const savings = formData.mrp - formData.sellingPrice;

  if (fetching) return <div className="h-96 flex items-center justify-center font-black text-neutral-300 animate-pulse uppercase tracking-[0.3em]">Calibrating Pipeline...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Sticky Header */}
      <div className="flex items-center justify-between sticky top-0 z-40 bg-admin-bg/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/admin/companies/${companyId}?tab=products`)}
            className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              <span>{company?.name}</span>
              <ChevronRight size={10} />
              <span>Products</span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{isEdit ? `Modify: ${formData.name}` : 'Initialize New Product'}</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/admin/companies/${companyId}`)} className="admin-btn-ghost text-xs border border-neutral-200">Discard</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="admin-btn-primary h-12 px-8 flex items-center gap-2 shadow-lg shadow-brand-green/20"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            <span>{isEdit ? 'Update Pipeline' : 'Initialize & Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Product Logic */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Section: Basic Intelligence */}
           <div className="admin-card p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                 <div className="w-12 h-12 bg-neutral-900 text-brand-green rounded-2xl flex items-center justify-center"><Package size={24} /></div>
                 <h3 className="text-xl font-black text-neutral-900 tracking-tight">Product Intelligence</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Formal Product Designation*</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required
                      placeholder="e.g. Paracetamol 500mg Advanced"
                      className="admin-input h-14 text-lg font-bold"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Inventory SKU</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. MED-TAB-102" className="admin-input" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Target Category*</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="admin-input font-bold">
                       {categories.map(cat => (
                         <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                       ))}
                    </select>
                 </div>

                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Clinical Abstract (Short Desc)</label>
                    <textarea 
                      name="shortDescription" 
                      value={formData.shortDescription} 
                      onChange={handleChange} 
                      rows={2} 
                      placeholder="Brief overview for search and cards..."
                      className="admin-input py-4 resize-none"
                    />
                 </div>

                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Full Product Dossier</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      rows={6} 
                      placeholder="Detailed clinical info, composition, and usage guidelines..."
                      className="admin-input py-4"
                    />
                 </div>
              </div>
           </div>

           {/* Section: Specifications */}
           <div className="admin-card p-10">
              <SpecificationsEditor 
                specs={formData.specifications} 
                onChange={(specs) => setFormData(prev => ({ ...prev, specifications: specs }))} 
              />
           </div>

           {/* Section: Pricing Architecture */}
           <div className="admin-card p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                 <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center"><Calculator size={24} /></div>
                 <h3 className="text-xl font-black text-neutral-900 tracking-tight">Pricing Architecture</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Maximum Retail Price (₹)</label>
                    <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className="admin-input h-14 text-xl font-black" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Institutional Selling Price (₹)</label>
                    <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} className="admin-input h-14 text-xl font-black text-brand-green" />
                 </div>

                 <div className="md:col-span-2 p-6 bg-brand-green/5 border border-brand-green/10 rounded-[2rem] flex items-center justify-around text-center">
                    <div>
                       <p className="text-[9px] font-black text-brand-green uppercase tracking-widest">Margin Benefit</p>
                       <p className="text-2xl font-black text-brand-green">{discountValue}% OFF</p>
                    </div>
                    <div className="w-px h-10 bg-brand-green/20" />
                    <div>
                       <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Customer Savings</p>
                       <p className="text-2xl font-black text-neutral-900">₹{savings}</p>
                    </div>
                    <div className="w-px h-10 bg-brand-green/20" />
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">GST Rate</label>
                       <select name="gst" value={formData.gst} onChange={handleChange} className="bg-white border-0 text-sm font-black rounded-lg px-2">
                          {[0, 5, 12, 18].map(rate => <option key={rate} value={rate}>{rate}%</option>)}
                       </select>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section: Inventory Logistics */}
           <div className="admin-card p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                 <div className="w-12 h-12 bg-neutral-900 text-blue-400 rounded-2xl flex items-center justify-center"><Boxes size={24} /></div>
                 <h3 className="text-xl font-black text-neutral-900 tracking-tight">Inventory Logistics</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Current Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="admin-input font-black" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Low Stock Alert</label>
                    <input type="number" name="minStockAlert" value={formData.minStockAlert} onChange={handleChange} className="admin-input font-bold text-red-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Unit Type</label>
                    <select name="unit" value={formData.unit} onChange={handleChange} className="admin-input font-bold">
                       {['strip', 'box', 'bottle', 'vial', 'sachet', 'tube'].map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Pack Definition</label>
                    <input type="text" name="packSize" value={formData.packSize} onChange={handleChange} placeholder="e.g. 10 Tablets" className="admin-input font-bold" />
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Media & Visibility */}
        <div className="space-y-8">
           
           {/* Section: Visuals */}
           <div className="admin-card p-8">
              <ProductImageManager 
                images={formData.images} 
                onChange={(imgs) => setFormData(prev => ({ ...prev, images: imgs }))} 
              />
           </div>

           {/* Section: Display Control */}
           <div className="admin-card p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                 <div className="w-10 h-10 bg-neutral-900 text-brand-green rounded-xl flex items-center justify-center"><Activity size={20} /></div>
                 <h3 className="text-lg font-black text-neutral-900 tracking-tight">Display Control</h3>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <span className="text-[10px] font-black text-neutral-900 uppercase">Public Available</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                      className={`w-10 h-6 rounded-full relative transition-all ${formData.isAvailable ? 'bg-brand-green' : 'bg-neutral-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isAvailable ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <span className="text-[10px] font-black text-neutral-900 uppercase">Featured Unit</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                      className={`w-10 h-6 rounded-full relative transition-all ${formData.isFeatured ? 'bg-amber-400' : 'bg-neutral-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFeatured ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={14} className={formData.requiresPrescription ? 'text-red-500' : 'text-neutral-300'} />
                       <span className="text-[10px] font-black text-neutral-900 uppercase">Requires Rx</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, requiresPrescription: !prev.requiresPrescription }))}
                      className={`w-10 h-6 rounded-full relative transition-all ${formData.requiresPrescription ? 'bg-red-500' : 'bg-neutral-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.requiresPrescription ? 'right-1' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Section: Search Optimization */}
           <div className="admin-card p-8 space-y-6">
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                 <div className="w-10 h-10 bg-neutral-900 text-blue-400 rounded-xl flex items-center justify-center"><Tag size={20} /></div>
                 <h3 className="text-lg font-black text-neutral-900 tracking-tight">Search & SEO</h3>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Search Tags</label>
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                       <input 
                         type="text" 
                         value={tagInput}
                         onChange={(e) => setTagInput(e.target.value)}
                         onKeyDown={handleAddTag}
                         placeholder="Type and press Enter..." 
                         className="admin-input pl-10" 
                       />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                       {formData.searchTags.map(tag => (
                         <span key={tag} className="px-2.5 py-1 bg-neutral-100 rounded-lg text-[10px] font-bold text-neutral-600 flex items-center gap-1">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProductForm;
