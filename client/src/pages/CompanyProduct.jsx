import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Info, 
  Star, 
  CheckCircle2, 
  Package, 
  Truck, 
  Clock, 
  Minus, 
  Plus,
  Share2,
  Building2,
  ChevronRight,
  ChevronLeft,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { companyService } from '../services/api';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const CompanyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await companyService.getProductById(id);
        setProduct(data.data.product);
      } catch (error) {
        toast.error('Product not found in registry');
        navigate('/companies');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const discount = product ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) : 0;
  const savings = product ? product.mrp - product.sellingPrice : 0;

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-6">
       <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
       <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.3em]">Synchronizing Product Data...</p>
    </div>
  );

  return (
    <div className="pb-32 bg-white">
      <Helmet>
        <title>{product.name} | {product.company?.name} | MediCheap</title>
        <meta name="description" content={product.shortDescription || product.description} />
      </Helmet>

      {/* Header Info */}
      <div className="container mx-auto px-6 py-8">
         <div className="flex items-center gap-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            <span className="text-neutral-900">Medical Registry</span>
            <ChevronRight size={10} />
            <span className="text-neutral-900">{product.company?.name}</span>
            <ChevronRight size={10} />
            <span className="text-neutral-500">{product.name}</span>
         </div>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
         
         {/* Left: Product Visuals */}
         <div className="space-y-8">
            <div className="relative aspect-square rounded-[3rem] bg-neutral-25 border border-neutral-100 overflow-hidden flex items-center justify-center p-12 group">
               <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={product.images?.[activeImage] || 'https://via.placeholder.com/600'} 
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700"
               />
               
               {/* Badges */}
               <div className="absolute top-8 left-8 flex flex-col gap-3">
                  {discount > 0 && (
                    <div className="px-6 py-2 bg-emerald-500 text-white text-xs font-black rounded-full shadow-2xl shadow-emerald-500/30">
                       {discount}% OFF
                    </div>
                  )}
                  {product.isFeatured && (
                    <div className="w-12 h-12 bg-amber-400 text-white rounded-full flex items-center justify-center shadow-2xl shadow-amber-400/20">
                       <Star size={20} fill="currentColor" />
                    </div>
                  )}
               </div>

               {/* Navigation Arrows */}
               {product.images?.length > 1 && (
                 <>
                   <button 
                     onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                     className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all scale-0 group-hover:scale-100"
                   >
                     <ChevronLeft size={24} />
                   </button>
                   <button 
                     onClick={() => setActiveImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                     className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all scale-0 group-hover:scale-100"
                   >
                     <ChevronRight size={24} />
                   </button>
                 </>
               )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                 {product.images.map((img, i) => (
                   <button 
                     key={i}
                     onClick={() => setActiveImage(i)}
                     className={`w-24 h-24 rounded-2xl bg-neutral-25 border-2 transition-all p-2 flex items-center justify-center shrink-0 ${activeImage === i ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-transparent hover:border-neutral-200'}`}
                   >
                      <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                   </button>
                 ))}
              </div>
            )}
         </div>

         {/* Right: Product Data */}
         <div className="space-y-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center p-2 overflow-hidden shadow-lg">
                     {product.company?.logo ? <img src={product.company.logo} className="w-full h-full object-contain" /> : <Building2 size={20} />}
                  </div>
                  <span className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em]">{product.company?.name}</span>
               </div>
               
               <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter leading-none">{product.name}</h1>
               
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-50 rounded-lg border border-neutral-100">
                     <Package size={14} className="text-neutral-400" />
                     <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{product.packSize || '10 Tablets'} / {product.unit}</span>
                  </div>
                  {product.requiresPrescription && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-lg border border-red-100">
                       <ShieldCheck size={14} className="text-red-500" />
                       <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Rx Required</span>
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-neutral-900 tracking-tighter">₹{product.sellingPrice}</span>
                  <span className="text-xl font-bold text-neutral-400 line-through tracking-tight">₹{product.mrp}</span>
                  <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg">SAVE ₹{savings}</span>
               </div>
               <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Price inclusive of all taxes ({product.gst || 5}% GST)</p>
            </div>

            {/* Action Card */}
            <div className="bg-neutral-50 rounded-[2.5rem] border border-neutral-100 p-8 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Select Quantity</span>
                     <div className="flex items-center gap-6 bg-white border border-neutral-100 p-2 rounded-2xl shadow-sm">
                        <button 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-xl hover:bg-neutral-50 flex items-center justify-center transition-colors"
                        >
                          <Minus size={18} className="text-neutral-400" />
                        </button>
                        <span className="text-lg font-black text-neutral-900 w-8 text-center">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-10 h-10 rounded-xl hover:bg-neutral-50 flex items-center justify-center transition-colors"
                        >
                          <Plus size={18} className="text-emerald-600" />
                        </button>
                     </div>
                  </div>
                  
                  <div className="text-right">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Stock Availability</p>
                     <div className="flex items-center gap-2 justify-end">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`text-sm font-black ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                           {product.stock > 0 ? 'In Stock (Direct)' : 'Sold Out'}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button className="flex-[2] h-16 bg-neutral-900 text-white rounded-3xl flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all shadow-2xl shadow-neutral-900/20 active:scale-95">
                     <ShoppingCart size={24} />
                     <span className="text-sm font-black uppercase tracking-widest">Establish Order Pipeline</span>
                  </button>
                  <button className="w-16 h-16 bg-white border border-neutral-200 rounded-3xl flex items-center justify-center text-neutral-300 hover:text-red-500 hover:border-red-500 transition-all active:scale-95">
                     <Heart size={24} />
                  </button>
               </div>
            </div>

            {/* Delivery Trust */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-neutral-50">
               <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto text-neutral-400"><Truck size={24} /></div>
                  <p className="text-[9px] font-black text-neutral-900 uppercase tracking-widest">Fast Logistics</p>
                  <p className="text-[8px] font-bold text-neutral-400 uppercase leading-none">2-4 Hours</p>
               </div>
               <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto text-neutral-400"><ShieldCheck size={24} /></div>
                  <p className="text-[9px] font-black text-neutral-900 uppercase tracking-widest">Brand Sealed</p>
                  <p className="text-[8px] font-bold text-neutral-400 uppercase leading-none">Medical SKU</p>
               </div>
               <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto text-neutral-400"><Clock size={24} /></div>
                  <p className="text-[9px] font-black text-neutral-900 uppercase tracking-widest">Extended Date</p>
                  <p className="text-[8px] font-bold text-neutral-400 uppercase leading-none">Fresh Stock</p>
               </div>
            </div>
         </div>
      </div>

      {/* Tabs / Detailed Info */}
      <section className="container mx-auto px-6 mt-32">
         <div className="bg-neutral-50 rounded-[3rem] p-12 md:p-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
               <div className="lg:col-span-2 space-y-12">
                  <div className="space-y-6">
                     <h3 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                        Clinical Abstract
                     </h3>
                     <p className="text-lg text-neutral-600 font-medium leading-relaxed">
                        {product.description || "Comprehensive pharmaceutical documentation is being established for this clinical unit. Please refer to the manufacturer's provided leaflets for detailed administration protocols."}
                     </p>
                  </div>

                  <div className="space-y-8">
                     <h3 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                        Specifications
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {product.specifications?.length > 0 ? product.specifications.map((spec, i) => (
                          <div key={i} className="flex items-center justify-between py-4 border-b border-neutral-100">
                             <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{spec.key}</span>
                             <span className="text-sm font-black text-neutral-900">{spec.value}</span>
                          </div>
                        )) : (
                          <>
                            <div className="flex items-center justify-between py-4 border-b border-neutral-100">
                               <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Manufacturer</span>
                               <span className="text-sm font-black text-neutral-900">{product.company?.name}</span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-neutral-100">
                               <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Regulatory Status</span>
                               <span className="text-sm font-black text-neutral-900">Verified by MediCheap</span>
                            </div>
                          </>
                        )}
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-1 space-y-8">
                  <div className="p-8 bg-neutral-900 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                     <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                     <div className="flex items-center gap-3">
                        <Zap size={20} className="text-emerald-500" fill="currentColor" />
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">MediCheap Shield</h4>
                     </div>
                     <p className="text-[10px] text-white/50 leading-relaxed font-bold uppercase tracking-wide">
                        Every product in our registry undergoes institutional verification. Direct sourcing ensures clinical integrity and 100% authenticity for every clinical unit dispensed.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   </div>
  );
};

export default CompanyProduct;
