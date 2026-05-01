import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ArrowLeft, 
  Edit, 
  ExternalLink, 
  LayoutGrid, 
  Package, 
  FolderTree, 
  BarChart3,
  Globe,
  Mail,
  Phone,
  FileText,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  MoreVertical,
  X,
  ChevronRight,
  GripVertical,
  Trash2,
  Trash
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { companyService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Drawer from '../../components/ui/Drawer';

const CategoryRow = ({ category, onEdit, onDelete, onToggle }) => (
  <motion.div
    layout
    className="bg-white border border-admin-border rounded-3xl p-6 flex items-center gap-6 group hover:border-brand-green/30 hover:shadow-lg transition-all"
  >
    <div className="w-10 h-10 bg-neutral-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
      {category.icon || '📦'}
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3">
        <h4 className="text-base font-black text-neutral-900 truncate">{category.name}</h4>
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{category.slug}</span>
      </div>
      <div className="flex items-center gap-4 mt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
          <Package size={12} />
          {category.productCount || 0} Products
        </div>
        <div className="w-1 h-1 rounded-full bg-neutral-200" />
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Priority: {category.displayOrder}</span>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button 
        onClick={() => onToggle(category._id)}
        className={`w-9 h-5 rounded-full relative transition-all ${category.isActive ? 'bg-brand-green' : 'bg-neutral-300'}`}
      >
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${category.isActive ? 'right-1' : 'left-1'}`} />
      </button>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(category)} className="p-2 text-neutral-400 hover:text-brand-green hover:bg-neutral-50 rounded-xl transition-all">
          <Edit size={16} />
        </button>
        <button onClick={() => onDelete(category)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </motion.div>
);

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await companyService.getById(id);
      setCompany(data.data.company);
      
      const { data: catData } = await companyService.getCategories(id);
      setCategories(catData.data.categories);
      
      const { data: prodData } = await companyService.getProducts(id);
      setProducts(prodData.data.products);
    } catch (error) {
      toast.error('Failed to sync company intelligence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleToggleActive = async () => {
    try {
      await companyService.toggle(id);
      toast.success('Company status modified');
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (window.confirm(`Are you sure you want to delete "${cat.name}"? This will also delete all products in this category.`)) {
      try {
        await companyService.deleteCategory(id, cat._id);
        toast.success('Category purged from registry');
        fetchData();
      } catch (error) {
        toast.error('Purge failed');
      }
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center font-black text-neutral-300 animate-pulse uppercase tracking-[0.3em]">Establishing Uplink...</div>;

  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
      <div className="relative h-[240px] rounded-[3rem] overflow-hidden group">
        {company.coverImage ? (
          <img src={company.coverImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full" 
            style={{ 
              background: `linear-gradient(135deg, ${company.primaryColor}20, ${company.primaryColor}05)`,
              backgroundImage: `radial-gradient(circle at 2px 2px, ${company.primaryColor}10 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Banner Content */}
        <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-[2rem] bg-white border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center p-3">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
              ) : (
                <div 
                  className="w-full h-full rounded-2xl flex items-center justify-center text-white text-3xl font-black"
                  style={{ background: `linear-gradient(135deg, ${company.primaryColor}, ${company.primaryColor}dd)` }}
                >
                  {company.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="mb-2">
              <h1 className="text-4xl font-black text-white tracking-tighter">{company.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                 <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">{company.slug}</span>
                 <div className="w-1 h-1 rounded-full bg-white/30" />
                 <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${company.isActive ? 'bg-brand-green/20 text-brand-green border-brand-green/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                   {company.isActive ? 'Live Registry' : 'Entity Suspended'}
                 </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2">
             <button onClick={() => navigate(`/admin/companies/${id}/edit`)} className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2">
                <Edit size={16} /> Edit Identity
             </button>
             <button 
                onClick={handleToggleActive}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${company.isActive ? 'bg-red-500 text-white' : 'bg-brand-green text-white shadow-lg shadow-brand-green/20'}`}
             >
                {company.isActive ? 'Suspend' : 'Activate'}
             </button>
          </div>
        </div>

        {/* Back Button */}
        <button onClick={() => navigate('/admin/companies')} className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all">
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Tabs Selection */}
      <div className="flex items-center justify-between border-b border-neutral-100">
        <div className="flex gap-10">
          {[
            { id: 'overview', label: 'Identity Overview', icon: Building2 },
            { id: 'categories', label: 'Categorical Map', icon: FolderTree, count: categories.length },
            { id: 'products', label: 'Product Inventory', icon: Package, count: products.length },
            { id: 'analytics', label: 'Clinical Stats', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] relative flex items-center gap-2.5 transition-all ${activeTab === tab.id ? 'text-brand-green' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.count !== undefined && <span className="text-[9px] opacity-40">[{tab.count}]</span>}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-green rounded-full shadow-[0_-4px_12px_rgba(0,200,83,0.5)]" />
              )}
            </button>
          ))}
        </div>
        
        <Link 
          to={`/companies/${company.slug}`} 
          target="_blank"
          className="flex items-center gap-2 text-[10px] font-black text-brand-green uppercase tracking-widest hover:translate-x-1 transition-transform"
        >
          View Public Profile <ExternalLink size={14} />
        </Link>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Detailed Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="admin-card p-10 space-y-10">
                 <div className="space-y-4">
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">Mission & Objectives</h3>
                    <p className="text-neutral-600 leading-relaxed font-medium">
                      {company.description || "No detailed description provided for this pharmaceutical entity."}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-neutral-50 pt-10">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Contact Grid</h4>
                       <div className="space-y-4">
                          <div className="flex items-center gap-4 group cursor-pointer">
                             <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-brand-green group-hover:text-white transition-all"><Globe size={18} /></div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-neutral-400 uppercase">Website</span>
                                <span className="text-sm font-bold text-neutral-900">{company.website || 'N/A'}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 group cursor-pointer">
                             <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-brand-green group-hover:text-white transition-all"><Mail size={18} /></div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-neutral-400 uppercase">Email</span>
                                <span className="text-sm font-bold text-neutral-900">{company.email || 'N/A'}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 group cursor-pointer">
                             <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-brand-green group-hover:text-white transition-all"><Phone size={18} /></div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-neutral-400 uppercase">Phone</span>
                                <span className="text-sm font-bold text-neutral-900">{company.phone || 'N/A'}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Legal & Regulatory</h4>
                       <div className="space-y-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400"><ShieldCheck size={18} /></div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-neutral-400 uppercase">Drug License</span>
                                <span className="text-sm font-bold text-neutral-900">{company.licenseNumber || 'PENDING'}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400"><FileText size={18} /></div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-neutral-400 uppercase">GST Registration</span>
                                <span className="text-sm font-bold text-neutral-900">{company.gstNumber || 'PENDING'}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400"><MapPin size={18} /></div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-neutral-400 uppercase">Headquarters</span>
                                <span className="text-sm font-bold text-neutral-900">{company.country || 'India'}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="border-t border-neutral-50 pt-10">
                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6">Registered Address</h4>
                    <p className="text-sm font-bold text-neutral-900 bg-neutral-50 p-6 rounded-3xl border border-neutral-100">{company.address || 'No address registered.'}</p>
                 </div>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="space-y-6">
               <div className="admin-card p-8 space-y-6 bg-neutral-900 text-white overflow-hidden relative">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl" />
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest relative z-10">Inventory Density</h4>
                  <div className="space-y-6 relative z-10">
                     <div className="flex items-center justify-between">
                        <span className="text-3xl font-black">{company.totalProducts || 0}</span>
                        <Package className="text-brand-green opacity-40" size={32} />
                     </div>
                     <p className="text-[10px] font-bold text-white/60">Total units mapped across {company.totalCategories || 0} categorical groups.</p>
                  </div>
               </div>

               <div className="admin-card p-8 space-y-6">
                  <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Brand Profile</h4>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-500">Established</span>
                        <span className="text-sm font-black text-neutral-900">{company.established || '2024'}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-500">Brand Color</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-mono font-bold uppercase">{company.primaryColor}</span>
                           <div className="w-4 h-4 rounded-full border border-neutral-100" style={{ backgroundColor: company.primaryColor }} />
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-500">Featured Level</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${company.isFeatured ? 'text-amber-500' : 'text-neutral-400'}`}>
                           {company.isFeatured ? 'Premium Tier' : 'Standard Tier'}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="admin-card p-8 space-y-6 border-dashed border-2">
                  <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Administrative Audit</h4>
                  <div className="space-y-4">
                     <p className="text-[10px] font-bold text-neutral-500">Created At: <span className="text-neutral-900">{new Date(company.createdAt).toLocaleDateString()}</span></p>
                     <p className="text-[10px] font-bold text-neutral-500">Last Modified: <span className="text-neutral-900">{new Date(company.updatedAt).toLocaleDateString()}</span></p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between bg-neutral-50 p-6 rounded-[2.5rem] border border-neutral-100">
               <div>
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight">Product Categorization</h3>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Manage how products are grouped for this brand.</p>
               </div>
               <button 
                onClick={() => { setSelectedCategory(null); setIsCategoryDrawerOpen(true); }}
                className="px-6 py-3 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-800 transition-all flex items-center gap-2"
               >
                  <Plus size={16} /> New Category
               </button>
            </div>

            <div className="space-y-4">
               {categories.length > 0 ? (
                 categories.map(cat => (
                   <CategoryRow 
                    key={cat._id} 
                    category={cat} 
                    onEdit={(c) => { setSelectedCategory(c); setIsCategoryDrawerOpen(true); }}
                    onDelete={handleDeleteCategory}
                    onToggle={async (cid) => {
                      try {
                        await companyService.updateCategory(id, cid, { isActive: !cat.isActive });
                        toast.success('Category visibility updated');
                        fetchData();
                      } catch (e) { toast.error('Update failed'); }
                    }}
                   />
                 ))
               ) : (
                 <div className="py-20 text-center space-y-4 bg-neutral-25 rounded-[3rem] border border-dashed border-neutral-200">
                    <FolderTree size={48} className="mx-auto text-neutral-200" />
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">No Categorical Mappings Found</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100">
               <div>
                  <h3 className="text-xl font-black text-neutral-900 tracking-tight">Active Inventory Pipeline</h3>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Managing {products.length} pharmaceutical units for {company.name}.</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="text" placeholder="Search inventory..." className="admin-input pl-12 h-12 w-64 bg-white" />
                  </div>
                  <button 
                    onClick={() => navigate(`/admin/companies/${id}/products/add`)}
                    className="px-8 py-3 bg-brand-green text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-brand-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus size={18} /> Initialize Product
                  </button>
               </div>
            </div>

            <div className="admin-card overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-neutral-25 text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
                        <th className="px-8 py-5">Product Details</th>
                        <th className="px-8 py-5">Category</th>
                        <th className="px-8 py-5 text-right">Pricing (₹)</th>
                        <th className="px-8 py-5 text-center">Stock</th>
                        <th className="px-8 py-5">Visibility</th>
                        <th className="px-8 py-5 text-right">Registry</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                     {products.map(prod => (
                        <tr key={prod._id} className="hover:bg-neutral-25 transition-all group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center shrink-0">
                                    {prod.images?.[0] ? <img src={prod.images[0]} alt="" className="w-full h-full object-contain p-1" /> : <Package className="text-neutral-200" size={24} />}
                                 </div>
                                 <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-black text-neutral-900 truncate">{prod.name}</span>
                                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{prod.sku || 'NO-SKU'}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                                 {prod.category?.name || 'Unmapped'}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex flex-col items-end">
                                 <span className="text-sm font-black text-neutral-900">₹{prod.sellingPrice}</span>
                                 <span className="text-[10px] font-bold text-neutral-400 line-through">₹{prod.mrp}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex flex-col items-center">
                                 <span className={`text-sm font-black ${prod.stock < (prod.minStockAlert || 10) ? 'text-red-500' : 'text-neutral-900'}`}>{prod.stock}</span>
                                 <div className="w-12 h-1 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                                    <div className={`h-full ${prod.stock < 10 ? 'bg-red-500' : 'bg-brand-green'}`} style={{ width: `${Math.min(100, (prod.stock / 100) * 100)}%` }} />
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <button 
                                onClick={async () => {
                                  try {
                                    await companyService.toggleProduct(id, prod._id);
                                    toast.success('Product availability modified');
                                    fetchData();
                                  } catch (e) { toast.error('Toggle failed'); }
                                }}
                                className={`w-9 h-5 rounded-full relative transition-all ${prod.isAvailable ? 'bg-brand-green' : 'bg-neutral-300'}`}
                              >
                                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${prod.isAvailable ? 'right-1' : 'left-1'}`} />
                              </button>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                 <button onClick={() => navigate(`/admin/companies/${id}/products/${prod._id}/edit`)} className="p-2 text-neutral-400 hover:text-brand-green hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-neutral-100"><Edit size={16} /></button>
                                 <button className="p-2 text-neutral-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-neutral-100"><Trash2 size={16} /></button>
                              </div>
                              <MoreVertical size={16} className="text-neutral-200 group-hover:hidden inline-block" />
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               {products.length === 0 && (
                 <div className="py-20 text-center font-bold text-neutral-300 uppercase tracking-widest text-sm">No Active Inventory Mapped</div>
               )}
            </div>
          </div>
        )}
      </div>

      {/* Category Drawer Component (Internal) */}
      <CategoryDrawer 
        isOpen={isCategoryDrawerOpen} 
        onClose={() => setIsCategoryDrawerOpen(false)} 
        companyId={id}
        category={selectedCategory}
        onSuccess={fetchData}
      />
    </div>
  );
};

const CategoryDrawer = ({ isOpen, onClose, companyId, category, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '💊',
    displayOrder: 0,
    showOnWebsite: true
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({ name: '', description: '', icon: '💊', displayOrder: 0, showOnWebsite: true });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (category) {
        await companyService.updateCategory(companyId, category._id, formData);
        toast.success('Category architecture updated');
      } else {
        await companyService.addCategory(companyId, formData);
        toast.success('New categorical node established');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={category ? 'Edit Categorical Unit' : 'New Categorical Unit'}>
      <form onSubmit={handleSubmit} className="space-y-8 p-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Category Designation*</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="admin-input h-14 text-lg font-bold"
            placeholder="e.g. Clinical Tablets"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Visual Marker (Emoji)</label>
          <div className="grid grid-cols-6 gap-3">
             {['💊', '💉', '🧪', '🧬', '🛡️', '🌿', '🧴', '🩹', '🩻', '🩺', '🏥', '🌡️'].map(emoji => (
               <button
                key={emoji}
                type="button"
                onClick={() => setFormData({ ...formData, icon: emoji })}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${formData.icon === emoji ? 'bg-neutral-900 border-neutral-900 scale-110 shadow-lg' : 'bg-neutral-50 border border-neutral-100 hover:bg-neutral-100'}`}
               >
                 {emoji}
               </button>
             ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Functional Description</label>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="admin-input py-4 resize-none"
            placeholder="Define the scope of this category..."
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Sequence Order</label>
              <input 
                type="number" 
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                className="admin-input"
              />
           </div>
           <div className="flex flex-col justify-end">
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
                <span className="text-[10px] font-black text-neutral-900 uppercase">Public Visibility</span>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, showOnWebsite: !formData.showOnWebsite })}
                  className={`w-9 h-5 rounded-full relative transition-all ${formData.showOnWebsite ? 'bg-brand-green' : 'bg-neutral-300'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.showOnWebsite ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
           </div>
        </div>

        <div className="pt-10 flex gap-4">
           <button type="button" onClick={onClose} className="flex-1 admin-btn-ghost py-4 border border-neutral-200 uppercase tracking-widest font-black text-[10px]">Abort</button>
           <button type="submit" disabled={loading} className="flex-[2] admin-btn-primary py-4 bg-neutral-900 text-white uppercase tracking-widest font-black text-[10px] shadow-xl shadow-neutral-900/20">
              {loading ? 'Processing...' : (category ? 'Update Unit' : 'Commit to Registry')}
           </button>
        </div>
      </form>
    </Drawer>
  );
};

export default CompanyDetail;
