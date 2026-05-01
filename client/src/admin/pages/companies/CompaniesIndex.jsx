import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  ExternalLink, 
  Eye, 
  Trash2,
  Star,
  Globe,
  Mail,
  Phone,
  LayoutGrid,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

const CompanyCard = ({ company, onToggle, onDelete }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-admin-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-green/30 transition-all group"
    >
      {/* Banner Area */}
      <div className="h-24 relative overflow-hidden bg-neutral-100">
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
        
        {!company.isActive && (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Inactive</span>
          </div>
        )}
        
        {company.isFeatured && (
          <div className="absolute top-3 right-3 bg-amber-400 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={10} fill="currentColor" /> FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-6 relative">
        {/* Logo */}
        <div className="relative -mt-8 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-xl overflow-hidden flex items-center justify-center p-2">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
            ) : (
              <div 
                className="w-full h-full rounded-xl flex items-center justify-center text-white text-xl font-black"
                style={{ background: `linear-gradient(135deg, ${company.primaryColor}, ${company.primaryColor}dd)` }}
              >
                {company.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black text-neutral-900 tracking-tight leading-none truncate">{company.name}</h3>
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{company.slug}</p>
        </div>

        <p className="mt-3 text-xs text-neutral-500 font-medium line-clamp-2 min-h-[32px]">
          {company.shortDescription || company.description || "No description provided."}
        </p>

        {/* Stats Row */}
        <div className="mt-6 pt-4 border-t border-neutral-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Categories</span>
            <span className="text-sm font-black text-neutral-900">{company.totalCategories || 0}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Products</span>
            <span className="text-sm font-black text-neutral-900">{company.totalProducts || 0}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Visibility</span>
            <div className={`w-2 h-2 rounded-full ${company.showOnWebsite ? 'bg-green-500 shadow-[0_0_8px_rgba(0,200,83,0.5)]' : 'bg-neutral-300'}`} title={company.showOnWebsite ? 'Visible on Website' : 'Hidden from Website'} />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onToggle(company._id)}
            className={`w-9 h-5 rounded-full relative transition-all ${company.isActive ? 'bg-brand-green' : 'bg-neutral-300'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${company.isActive ? 'right-1' : 'left-1'}`} />
          </button>
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{company.isActive ? 'Active' : 'Paused'}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate(`/admin/companies/${company._id}/edit`)}
            className="p-2 text-neutral-400 hover:text-brand-green hover:bg-white rounded-xl transition-all"
            title="Edit Company"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => navigate(`/admin/companies/${company._id}`)}
            className="px-4 py-2 bg-white border border-neutral-200 text-neutral-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-brand-green hover:text-brand-green transition-all shadow-sm"
          >
            Manage
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CompaniesIndex = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, active: 0, products: 0, outOfStock: 0 });
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      const { data } = await companyService.getAll();
      setCompanies(data.data.companies);
      
      // Calculate basic stats
      const active = data.data.companies.filter(c => c.isActive).length;
      const totalProds = data.data.companies.reduce((acc, c) => acc + (c.totalProducts || 0), 0);
      setStats({
        total: data.data.companies.length,
        active,
        products: totalProds,
        outOfStock: 0 // Would need product level data for real value
      });
    } catch (error) {
      toast.error('Failed to load companies registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggle = async (id) => {
    try {
      await companyService.toggle(id);
      toast.success('Company status updated');
      fetchCompanies();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.shortName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && c.isActive) || 
                         (filter === 'inactive' && !c.isActive) ||
                         (filter === 'featured' && c.isFeatured);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-brand-green" />
            Companies & Brands
          </h2>
          <p className="text-sm text-neutral-500 font-bold mt-1">Manage pharmaceutical manufacturers, brand identities, and specialized inventory.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/companies/add')}
          className="admin-btn-primary h-12 px-8 flex items-center gap-2 shadow-lg shadow-brand-green/20"
        >
          <Plus size={18} />
          <span>Add New Company</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Companies" value={stats.total} icon={Building2} color="green" />
        <StatCard label="Active Entities" value={stats.active} icon={Globe} color="blue" />
        <StatCard label="Total Products" value={stats.products} icon={Plus} color="purple" />
        <StatCard label="Market Featured" value={companies.filter(c => c.isFeatured).length} icon={Star} color="amber" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-admin-border rounded-3xl flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search by company name, slug or brand..." 
            className="admin-input pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 p-1 bg-neutral-50 rounded-2xl border border-neutral-100">
            {['all', 'active', 'inactive', 'featured'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === f ? 'bg-white text-brand-green shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-neutral-100 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCompanies.map((company) => (
              <CompanyCard 
                key={company._id} 
                company={company} 
                onToggle={handleToggle}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCompanies.length === 0 && (
        <div className="bg-neutral-50 rounded-[3rem] border-2 border-dashed border-neutral-200 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-neutral-300">
            <Building2 size={40} />
          </div>
          <div>
            <h3 className="text-xl font-black text-neutral-900 tracking-tight">No companies found</h3>
            <p className="text-sm text-neutral-500 font-bold mt-1">Start by adding your first pharmaceutical partner.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/companies/add')}
            className="px-8 py-3 bg-neutral-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-800 transition-all"
          >
            Initialize First Brand
          </button>
        </div>
      )}
    </div>
  );
};

export default CompaniesIndex;
