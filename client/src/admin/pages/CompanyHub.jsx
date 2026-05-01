import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  FolderTree, 
  Package, 
  Plus, 
  ArrowLeft, 
  ChevronRight, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Upload,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Layers,
  Palette
} from 'lucide-react';
import { companyService } from '../../services/api';
import { toast } from 'react-hot-toast';

const CompanyHub = () => {
  // Navigation State
  const [view, setView] = useState('companies'); // companies | categories | products | form-company | form-category | form-product
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Data State
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({});

  // Initial Fetch
  useEffect(() => {
    fetchCompanies();
    setView('companies');
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data } = await companyService.getAll();
      setCompanies(data.data.companies);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (companyId) => {
    setLoading(true);
    try {
      const { data } = await companyService.getCategories(companyId);
      setCategories(data.data.categories);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (companyId, categoryId) => {
    setLoading(true);
    try {
      const { data } = await companyService.getProducts(companyId, { categoryId });
      setProducts(data.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Navigation Handlers
  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    fetchCategories(company._id);
    setView('categories');
    setSearchTerm('');
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    fetchProducts(selectedCompany._id, category._id);
    setView('products');
    setSearchTerm('');
  };

  const goBack = () => {
    setSearchTerm('');
    if (view === 'categories') {
      setView('companies');
      setSelectedCompany(null);
    } else if (view === 'products') {
      setView('categories');
      setSelectedCategory(null);
    } else if (view.startsWith('form-')) {
      if (view === 'form-company') setView('companies');
      if (view === 'form-category') setView('categories');
      if (view === 'form-product') setView('products');
      setEditItem(null);
      setFormData({});
    }
  };

  // CRUD Handlers
  const handleToggleActive = async (type, item) => {
    try {
      if (type === 'company') {
        await companyService.toggle(item._id);
        fetchCompanies();
      } else if (type === 'category') {
        await companyService.updateCategory(selectedCompany._id, item._id, { isActive: !item.isActive });
        fetchCategories(selectedCompany._id);
      } else if (type === 'product') {
        await companyService.toggleProduct(selectedCompany._id, item._id);
        fetchProducts(selectedCompany._id, selectedCategory._id);
      }
      toast.success('Status updated');
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (type, item) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === 'company') {
        await companyService.delete(item._id);
        fetchCompanies();
      } else if (type === 'category') {
        await companyService.deleteCategory(selectedCompany._id, item._id);
        fetchCategories(selectedCompany._id);
      } else if (type === 'product') {
        await companyService.deleteProduct(selectedCompany._id, item._id);
        fetchProducts(selectedCompany._id, selectedCategory._id);
      }
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const openForm = (type, item = null) => {
    setEditItem(item);
    if (type === 'company') {
      setFormData(item || { name: '', shortName: '', primaryColor: '#024F3A', isActive: true });
      setView('form-company');
    } else if (type === 'category') {
      setFormData(item || { name: '', icon: '💊', isActive: true, displayOrder: 0 });
      setView('form-category');
    } else if (type === 'product') {
      setFormData(item || { name: '', sellingPrice: 0, mrp: 0, stock: 0, isAvailable: true });
      setView('form-product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'form-company') {
        if (editItem) await companyService.update(editItem._id, formData);
        else await companyService.add(formData);
        fetchCompanies();
        setView('companies');
      } else if (view === 'form-category') {
        if (editItem) await companyService.updateCategory(selectedCompany._id, editItem._id, formData);
        else await companyService.addCategory(selectedCompany._id, formData);
        fetchCategories(selectedCompany._id);
        setView('categories');
      } else if (view === 'form-product') {
        const payload = { ...formData, category: selectedCategory._id };
        if (editItem) await companyService.updateProduct(selectedCompany._id, editItem._id, payload);
        else await companyService.addProduct(selectedCompany._id, payload);
        fetchProducts(selectedCompany._id, selectedCategory._id);
        setView('products');
      }
      toast.success('Saved successfully');
      setFormData({});
      setEditItem(null);
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'images') {
          setFormData({ ...formData, [field]: [reader.result] });
        } else {
          setFormData({ ...formData, [field]: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Render Helpers
  const renderList = (items, type, onSelect) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <div 
          key={item._id}
          className="group bg-white border border-admin-border rounded-2xl p-6 hover:border-brand-green/30 hover:shadow-xl transition-all flex flex-col"
        >
          <div className="flex items-start justify-between mb-6">
            <div 
              className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center overflow-hidden border border-neutral-100 cursor-pointer group-hover:scale-105 transition-transform"
              onClick={() => onSelect && onSelect(item)}
            >
              {type === 'company' && (item.logo ? <img src={item.logo} className="w-full h-full object-contain" /> : <Building2 size={32} className="text-neutral-300" />)}
              {type === 'category' && (item.image ? <img src={item.image} className="w-full h-full object-contain" /> : <div className="text-3xl">{item.icon || '📦'}</div>)}
              {type === 'product' && (item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-contain" /> : <Package size={32} className="text-neutral-300" />)}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleToggleActive(type, item)}
                className={`p-2 rounded-xl transition-all ${
                  (type === 'product' ? item.isAvailable : item.isActive) 
                  ? 'text-brand-green bg-brand-green/10 hover:bg-brand-green/20' 
                  : 'text-neutral-400 bg-neutral-100 hover:bg-neutral-200'
                }`}
                title="Toggle Visibility"
              >
                {(type === 'product' ? item.isAvailable : item.isActive) ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className="flex-1 cursor-pointer" onClick={() => onSelect && onSelect(item)}>
            <h4 className="text-lg font-black text-neutral-900 truncate mb-1">{item.name}</h4>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              {type === 'company' && `${item.totalCategories || 0} Categories`}
              {type === 'category' && `${item.productCount || 0} Products`}
              {type === 'product' && `₹${item.sellingPrice} | Stock: ${item.stock}`}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-admin-border">
            {onSelect && (
              <button onClick={() => onSelect(item)} className="flex-1 px-4 py-2 bg-neutral-50 hover:bg-brand-green hover:text-white text-neutral-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                Manage <ChevronRight size={14} />
              </button>
            )}
            <button 
              onClick={() => openForm(type, item)}
              className="p-2 text-neutral-400 hover:text-brand-green hover:bg-brand-green/10 rounded-xl transition-all"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => handleDelete(type, item)}
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-black text-admin-text-secondary uppercase tracking-widest mb-3">
            <span className="cursor-pointer hover:text-brand-green transition-colors" onClick={() => { setView('companies'); setSelectedCompany(null); setSelectedCategory(null); }}>Ecosystem</span>
            {(selectedCompany || view.startsWith('form-company')) && (
              <>
                <ChevronRight size={10} />
                <span className="cursor-pointer hover:text-brand-green transition-colors" onClick={() => { setView('categories'); setSelectedCategory(null); }}>
                  {selectedCompany?.name || 'New Company'}
                </span>
              </>
            )}
            {(selectedCategory || view.startsWith('form-category')) && (
              <>
                <ChevronRight size={10} />
                <span className="cursor-pointer hover:text-brand-green transition-colors" onClick={() => setView('products')}>
                  {selectedCategory?.name || 'New Category'}
                </span>
              </>
            )}
            {view.startsWith('form-product') && (
              <>
                <ChevronRight size={10} />
                <span className="text-admin-text-primary">New Product</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-display font-black text-admin-text-primary tracking-tight flex items-center gap-4">
            {view !== 'companies' && (
              <button onClick={goBack} className="p-2 bg-white hover:bg-neutral-50 rounded-2xl border border-admin-border transition-all">
                <ArrowLeft size={20} />
              </button>
            )}
            <span>
              {view === 'companies' && 'Company Registry'}
              {view === 'categories' && `Categories: ${selectedCompany?.name}`}
              {view === 'products' && `Products: ${selectedCategory?.name}`}
              {view.startsWith('form-') && (editItem ? 'Edit Entity' : 'New Entity')}
            </span>
          </h1>
        </div>

        {/* Search & Action Bar (Lists only) */}
        {!view.startsWith('form-') && (
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="admin-input pl-12 h-12 w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => openForm(view === 'companies' ? 'company' : view === 'categories' ? 'category' : 'product')}
              className="h-12 px-6 bg-admin-text-primary hover:bg-admin-text-hover text-white rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-admin-text-primary/20 shrink-0"
            >
              <Plus size={16} /> Add New
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-6">
            <div className="w-12 h-12 border-4 border-admin-border border-t-brand-green rounded-full animate-spin" />
            <p className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Accessing Registry...</p>
          </div>
        ) : (
          <>
            {view === 'companies' && renderList(companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())), 'company', handleSelectCompany)}
            {view === 'categories' && renderList(categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())), 'category', handleSelectCategory)}
            {view === 'products' && renderList(products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), 'product')}
            
            {/* Form Views */}
            {view.startsWith('form-') && (
              <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-admin-border shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-admin-text-primary">
                    {view === 'form-company' && 'Company Details'}
                    {view === 'form-category' && 'Category Details'}
                    {view === 'form-product' && 'Product Details'}
                  </h3>
                  <p className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest">Configure the registry entity parameters</p>
                </div>

                {/* Common Name Field */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Display Name*</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input h-14 text-lg font-bold w-full"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Company Specific Fields */}
                {view === 'form-company' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Brand Color</label>
                      <div className="flex items-center gap-4 bg-neutral-50 p-3 rounded-2xl border border-admin-border">
                         <input type="color" value={formData.primaryColor || '#024F3A'} onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })} className="w-10 h-10 rounded-xl cursor-pointer" />
                         <span className="text-sm font-mono font-bold uppercase text-admin-text-primary">{formData.primaryColor || '#024F3A'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Entity Logo</label>
                      <div className="relative h-16 bg-neutral-50 rounded-2xl border border-admin-border flex items-center px-4 gap-4 overflow-hidden group hover:border-brand-green/50 transition-colors">
                         {formData.logo ? <img src={formData.logo} className="w-10 h-10 object-contain" /> : <Building2 size={24} className="text-admin-text-secondary" />}
                         <span className="text-[11px] font-bold text-admin-text-primary uppercase tracking-wide">Click to Upload Image</span>
                         <input type="file" onChange={(e) => handleImageChange('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Specific Fields */}
                {view === 'form-category' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Visual Marker (Emoji)</label>
                      <input type="text" value={formData.icon || '💊'} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="admin-input h-14 text-center text-2xl w-full" maxLength={2} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Category Logo</label>
                      <div className="relative h-14 bg-neutral-50 rounded-2xl border border-admin-border flex items-center px-4 gap-4 overflow-hidden group hover:border-brand-green/50 transition-colors">
                         {formData.image ? <img src={formData.image} className="w-8 h-8 object-contain" /> : <Layers size={20} className="text-admin-text-secondary" />}
                         <span className="text-[11px] font-bold text-admin-text-primary uppercase tracking-wide">Image Logo</span>
                         <input type="file" onChange={(e) => handleImageChange('image', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Specific Fields */}
                {view === 'form-product' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Selling Price (₹)</label>
                        <input type="number" required value={formData.sellingPrice || 0} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} className="admin-input w-full" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">MRP (₹)</label>
                        <input type="number" required value={formData.mrp || 0} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })} className="admin-input w-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Current Stock</label>
                        <input type="number" required value={formData.stock || 0} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="admin-input w-full" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-admin-text-secondary uppercase tracking-widest">Product Images</label>
                        <div className="relative h-12 bg-neutral-50 rounded-2xl border border-admin-border flex items-center px-4 gap-4 overflow-hidden group hover:border-brand-green/50 transition-colors">
                           {formData.images?.[0] ? <img src={formData.images[0]} className="w-6 h-6 object-contain" /> : <Package size={18} className="text-admin-text-secondary" />}
                           <span className="text-[10px] font-bold text-admin-text-primary uppercase tracking-wide">Gallery Upload</span>
                           <input type="file" onChange={(e) => handleImageChange('images', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <hr className="border-admin-border" />

                {/* Universal Toggle */}
                <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-2xl border border-admin-border">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-admin-text-primary uppercase tracking-tight">Active Visibility</p>
                    <p className="text-[10px] text-admin-text-secondary font-bold uppercase tracking-widest">Toggle this entity on the user website</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (view === 'form-product') setFormData({ ...formData, isAvailable: !formData.isAvailable });
                      else setFormData({ ...formData, isActive: !formData.isActive });
                    }}
                    className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${
                      (view === 'form-product' ? formData.isAvailable : formData.isActive) ? 'bg-brand-green' : 'bg-neutral-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${
                      (view === 'form-product' ? formData.isAvailable : formData.isActive) ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={goBack} className="flex-1 admin-btn-ghost h-16 border border-admin-border">Discard Changes</button>
                  <button type="submit" disabled={loading} className="flex-[2] admin-btn-primary h-16 bg-admin-text-primary hover:bg-admin-text-hover text-white shadow-xl shadow-admin-text-primary/20">
                    {loading ? 'Processing...' : (editItem ? 'Save Updates' : 'Commit to Registry')}
                  </button>
                </div>
              </form>
            )}

            {/* Empty State */}
            {((view === 'companies' && companies.length === 0) || 
              (view === 'categories' && categories.length === 0) || 
              (view === 'products' && products.length === 0)) && !loading && (
              <div className="py-32 text-center space-y-6 max-w-md mx-auto">
                 <div className="w-24 h-24 bg-white border border-admin-border rounded-[2rem] flex items-center justify-center mx-auto text-admin-text-secondary shadow-sm">
                    {view === 'companies' ? <Building2 size={48} /> : view === 'categories' ? <FolderTree size={48} /> : <Package size={48} />}
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-admin-text-primary mb-2">Registry Empty</h3>
                   <p className="text-xs font-bold text-admin-text-secondary uppercase tracking-widest leading-relaxed">
                     There are no {view} configured for this level. Click "Add New" to populate the ecosystem.
                   </p>
                 </div>
                 <button 
                   onClick={() => openForm(view === 'companies' ? 'company' : view === 'categories' ? 'category' : 'product')}
                   className="h-12 px-8 bg-brand-green hover:bg-brand-green-hover text-white rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-green/20 mx-auto"
                 >
                   <Plus size={16} /> Initialize First Entity
                 </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyHub;
