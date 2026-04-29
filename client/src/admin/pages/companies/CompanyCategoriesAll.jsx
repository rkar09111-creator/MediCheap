import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderTree, Search, Building2, Plus, ArrowRight } from 'lucide-react';
import { companyService } from '../../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CompanyCategoriesAll = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await companyService.getAll();
        setCompanies(data.data.companies);
      } catch (error) {
        toast.error('Failed to load categorical hierarchy');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
          <FolderTree className="w-8 h-8 text-brand-green" />
          Categorical Hierarchy
        </h2>
        <p className="text-sm text-neutral-500 font-bold mt-1">Global management of pharmaceutical product groups organized by brand.</p>
      </div>

      <div className="bg-white p-4 border border-admin-border rounded-3xl flex items-center gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search by company name..." 
            className="admin-input pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? [1,2,3].map(i => <div key={i} className="h-32 bg-neutral-100 rounded-[2rem] animate-pulse" />) : 
          filtered.map(company => (
            <motion.div
              key={company._id}
              whileHover={{ scale: 1.02 }}
              className="admin-card p-8 group cursor-pointer border hover:border-brand-green/30 transition-all"
              onClick={() => navigate(`/admin/companies/${company._id}?tab=categories`)}
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center p-2">
                     {company.logo ? <img src={company.logo} className="w-full h-full object-contain" /> : <Building2 className="text-neutral-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-base font-black text-neutral-900 truncate">{company.name}</h4>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{company.totalCategories || 0} Categories Mapped</p>
                  </div>
                  <ArrowRight size={16} className="text-neutral-200 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
               </div>
            </motion.div>
          ))
        }
      </div>
    </div>
  );
};

export default CompanyCategoriesAll;
