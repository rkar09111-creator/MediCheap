import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Search, 
  Filter, 
  ArrowLeft, 
  Globe, 
  Mail, 
  Phone, 
  ChevronRight, 
  Star, 
  ShieldCheck,
  CheckCircle2,
  Package,
  ArrowUpRight
} from 'lucide-react';
import { companyService } from '../services/api';
import CompanyProductCard from '../components/company/CompanyProductCard';
import { Helmet } from 'react-helmet-async';

const CompanyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const { data } = await companyService.getBySlug(slug);
        setCompany(data.data.company);
        setCategories(data.data.categories);
        
        const { data: prodData } = await companyService.getProducts(data.data.company._id);
        setProducts(prodData.data.products);
      } catch (error) {
        navigate('/companies');
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [slug]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category?._id === selectedCategory || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-6">
       <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
       <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em]">Initializing Brand Portal...</p>
    </div>
  );

  return (
    <div className="pb-32">
      <Helmet>
        <title>{company.name} | MediCheap Brand Portal</title>
        <meta name="description" content={`Explore high-quality pharmaceutical products from ${company.name}. Direct institutional supply with guaranteed authenticity.`} />
      </Helmet>

      {/* Brand Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Decor */}
        <div 
           className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] -mr-96 -mt-96 opacity-20"
           style={{ backgroundColor: company.primaryColor }}
        />
        
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                 <Link to="/companies" className="inline-flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] hover:text-neutral-900 transition-colors">
                    <ArrowLeft size={14} /> Back to Registry
                 </Link>
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-24 h-24 rounded-[2rem] bg-white border border-neutral-100 shadow-xl p-4 flex items-center justify-center overflow-hidden">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 size={40} className="text-neutral-200" />
                          )}
                       </div>
                       <div className="space-y-1">
                          <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tighter">{company.name}</h1>
                          <p className="text-lg font-bold text-emerald-600" style={{ color: company.primaryColor }}>{company.tagline || 'Leading Pharmaceutical Excellence'}</p>
                       </div>
                    </div>
                    
                    <p className="text-lg text-neutral-500 font-medium leading-relaxed max-w-xl">
                       {company.description || "Committed to delivering high-quality, authentic pharmaceutical solutions directly to your doorstep."}
                    </p>
                 </div>

                 <div className="flex flex-wrap gap-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-emerald-600 shadow-sm" style={{ color: company.primaryColor }}><CheckCircle2 size={20} /></div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Supply Type</span>
                          <span className="text-sm font-black text-neutral-900">Direct Institutional</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-emerald-600 shadow-sm" style={{ color: company.primaryColor }}><ShieldCheck size={20} /></div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Quality Seal</span>
                          <span className="text-sm font-black text-neutral-900">Verified Protocols</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="relative">
                 <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative">
                    {company.coverImage ? (
                      <img src={company.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                         <Building2 size={120} className="text-neutral-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                 </div>
                 
                 {/* Floating Stats */}
                 <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[2rem] shadow-2xl space-y-4 border border-neutral-50">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center" style={{ backgroundColor: company.primaryColor + '10', color: company.primaryColor }}>
                          <Package size={24} />
                       </div>
                       <div>
                          <p className="text-2xl font-black text-neutral-900">{company.totalProducts || 0}</p>
                          <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Active Medicines</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-y border-neutral-50 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === 'all' ? 'bg-neutral-900 text-white shadow-lg' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
              >
                 All Units
              </button>
              {categories.map(cat => (
                <button 
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${selectedCategory === cat._id ? 'bg-neutral-900 text-white shadow-lg' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
                >
                   <span className="opacity-60">{cat.icon}</span> {cat.name}
                </button>
              ))}
           </div>

           <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
              <input 
                type="text" 
                placeholder={`Search ${company.name} products...`}
                className="w-full bg-neutral-50 border-0 rounded-2xl pl-12 h-12 text-sm font-bold placeholder:text-neutral-300 focus:ring-2 focus:ring-neutral-900/5 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-6 mt-16">
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
               {filteredProducts.map(product => (
                 <CompanyProductCard 
                    key={product._id} 
                    product={product} 
                    companyColor={company.primaryColor} 
                 />
               ))}
            </AnimatePresence>
         </div>

         {filteredProducts.length === 0 && (
           <div className="py-32 text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto text-neutral-200"><Package size={32} /></div>
              <h3 className="text-lg font-black text-neutral-900 tracking-tight uppercase">No inventory items found</h3>
              <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">Try adjusting your filters or search terms.</p>
           </div>
         )}
      </section>

      {/* Corporate Info Footer */}
      <section className="container mx-auto px-6 mt-40">
         <div className="bg-neutral-50 rounded-[3rem] p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
               <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Institutional Registry</h2>
               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <MapPin className="text-neutral-300 mt-1" size={20} />
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Registered HQ</p>
                        <p className="text-sm font-bold text-neutral-600 leading-relaxed">{company.address || company.country || 'India'}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <Globe className="text-neutral-300 mt-1" size={20} />
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Digital Presence</p>
                        <a href={company.website} target="_blank" className="text-sm font-black text-neutral-900 hover:text-emerald-600 transition-colors flex items-center gap-1">
                           {company.website || 'Direct Institutional Supply'} <ArrowUpRight size={14} />
                        </a>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Clinical Standards</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-6 bg-white rounded-[2rem] border border-neutral-100 shadow-sm space-y-3">
                     <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Supply Integrity</p>
                     <p className="text-xs font-bold text-neutral-600">All inventory is sourced directly from {company.name} facilities.</p>
                  </div>
                  <div className="p-6 bg-white rounded-[2rem] border border-neutral-100 shadow-sm space-y-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><ShieldCheck size={20} /></div>
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Licensed Logistics</p>
                     <p className="text-xs font-bold text-neutral-600">Temperature-controlled clinical logistics handled by professionals.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

const MapPin = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default CompanyDetail;
