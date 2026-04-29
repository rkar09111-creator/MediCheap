import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, ArrowRight, ChevronRight, Globe, Star, ShieldCheck } from 'lucide-react';
import { companyService } from '../services/api';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const CompanyCard = ({ company, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group relative bg-white rounded-[2.5rem] border border-neutral-100 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden"
  >
    {/* Abstract Background Decor */}
    <div 
      className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"
      style={{ backgroundColor: `${company.primaryColor}10` }}
    />

    <div className="p-8 space-y-6">
      {/* Brand Header */}
      <div className="flex items-start justify-between">
        <div className="w-20 h-20 rounded-2xl bg-neutral-50 border border-neutral-100 p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm overflow-hidden">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
          ) : (
            <Building2 className="text-neutral-200" size={32} />
          )}
        </div>
        {company.isFeatured && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Featured Brand</span>
          </div>
        )}
      </div>

      {/* Brand Content */}
      <div className="space-y-2">
        <h3 className="text-xl font-black text-neutral-900 tracking-tight group-hover:text-emerald-600 transition-colors">{company.name}</h3>
        <p className="text-xs text-neutral-500 font-medium leading-relaxed line-clamp-2">
          {company.shortDescription || company.description || "Leading pharmaceutical manufacturer delivering high-quality clinical solutions."}
        </p>
      </div>

      {/* Stats & Trust */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-50">
        <div className="flex -space-x-2">
           {[1,2,3].map(i => (
             <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-[8px] font-black text-neutral-400">
                {i}
             </div>
           ))}
        </div>
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{company.totalProducts || 0} Products Mapped</span>
      </div>

      {/* Action */}
      <Link 
        to={`/companies/${company.slug}`}
        className="flex items-center justify-between w-full p-4 bg-neutral-50 group-hover:bg-emerald-600 rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
      >
        <span className="text-[10px] font-black text-neutral-900 group-hover:text-white uppercase tracking-[0.2em] ml-2">Open Brand Portal</span>
        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-neutral-400 group-hover:text-emerald-600 transition-colors">
          <ArrowRight size={16} />
        </div>
      </Link>
    </div>
  </motion.div>
);

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await companyService.getAll({ active: true });
        setCompanies(data.data.companies);
      } catch (error) {
        console.error('Failed to load brands');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filtered = companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="pb-20">
      <Helmet>
        <title>Our Partner Brands | MediCheap</title>
        <meta name="description" content="Explore our directory of trusted pharmaceutical brands and manufacturers. Premium quality medicines from IGMA and more." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto px-6 text-center space-y-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-4"
           >
              <ShieldCheck size={16} className="text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Manufacturers Only</span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter"
           >
             The Brand <span className="text-emerald-600">Registry.</span>
           </motion.h1>
           
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="max-w-2xl mx-auto text-lg text-neutral-500 font-medium leading-relaxed"
           >
             We partner directly with India's leading pharmaceutical innovators to ensure 100% authenticity and clinical-grade excellence.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="max-w-xl mx-auto relative group mt-12"
           >
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center p-2 bg-white rounded-3xl border border-neutral-100 shadow-xl">
                 <div className="pl-6 pr-4"><Search size={20} className="text-neutral-300" /></div>
                 <input 
                   type="text" 
                   placeholder="Search for a trusted brand..." 
                   className="flex-1 bg-transparent border-0 focus:ring-0 text-sm font-bold placeholder:text-neutral-300"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <button className="px-8 py-4 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all">Find Brand</button>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="h-80 bg-neutral-50 rounded-[2.5rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((company, index) => (
                <CompanyCard key={company._id} company={company} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-40 text-center space-y-6">
            <div className="w-20 h-20 bg-neutral-50 rounded-3xl flex items-center justify-center mx-auto text-neutral-300"><Building2 size={40} /></div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">No brands matched your search</h3>
              <p className="text-neutral-500 font-medium">Try searching for generic names or other partners.</p>
            </div>
          </div>
        )}
      </section>

      {/* Trust Banner */}
      <section className="container mx-auto px-6 mt-32">
        <div className="bg-neutral-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center md:text-left">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 skew-x-12 -mr-32" />
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
              <div className="space-y-8">
                 <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">Direct-to-Patient <br/><span className="text-emerald-500">Institutional Supply.</span></h2>
                 <p className="text-white/60 text-lg font-medium leading-relaxed">By eliminating middle-layers and working directly with brands like IGMA Ltd, we deliver fresh stock with the longest expiry dates and the most honest prices.</p>
                 <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={24} className="text-emerald-500" />
                       <span className="text-white font-black text-xs uppercase tracking-widest">Brand Warranty</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={24} className="text-emerald-500" />
                       <span className="text-white font-black text-xs uppercase tracking-widest">Cold Chain Logic</span>
                    </div>
                 </div>
              </div>
              <div className="hidden lg:block relative">
                 <div className="w-full aspect-square bg-emerald-500/10 rounded-[3rem] border-2 border-white/5 flex items-center justify-center backdrop-blur-xl">
                    <Building2 size={120} className="text-emerald-500/30" />
                 </div>
                 <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-3xl shadow-2xl space-y-2">
                    <div className="flex items-center gap-2">
                       {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                    </div>
                    <p className="text-neutral-900 font-black text-sm leading-tight">"Authentic stock, <br/>exceptional delivery."</p>
                    <p className="text-neutral-400 font-bold text-[10px] uppercase">Clinic Verified User</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

const CheckCircle2 = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Companies;
