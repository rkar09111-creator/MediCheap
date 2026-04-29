import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyProductCard = ({ product, companyColor }) => {
  const discount = Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100);

  return (
    <motion.div
      layout
      className="group bg-white rounded-[2rem] border border-neutral-100 hover:border-neutral-200 transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Media Area */}
      <div className="relative aspect-square overflow-hidden bg-neutral-25 p-6 group-hover:p-4 transition-all duration-500">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discount > 0 && (
            <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-emerald-500/20">
              {discount}% OFF
            </div>
          )}
          {product.isFeatured && (
            <div className="w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Star size={14} fill="currentColor" />
            </div>
          )}
        </div>

        {/* Prescription Badge */}
        {product.requiresPrescription && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg border border-neutral-100">
             <ShieldCheck size={10} className="text-red-500" />
             <span className="text-[8px] font-black text-neutral-900 uppercase tracking-tighter">Rx Required</span>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
           <div className="w-12 h-12 rounded-2xl bg-white shadow-2xl flex items-center justify-center text-neutral-900 scale-90 group-hover:scale-100 transition-transform duration-500">
              <Zap size={20} fill={companyColor} stroke={companyColor} />
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-1 mb-4 flex-1">
          <Link to={`/company-product/${product._id}`} className="block">
            <h3 className="text-sm font-black text-neutral-900 leading-tight line-clamp-2 hover:text-emerald-600 transition-colors uppercase tracking-tight">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.1em]">{product.packSize || '10 Tablets'}</span>
             <div className="w-1 h-1 rounded-full bg-neutral-200" />
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.1em]">{product.category?.name}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
           <div className="flex flex-col">
              <span className="text-lg font-black text-neutral-900">₹{product.sellingPrice}</span>
              <span className="text-[10px] font-bold text-neutral-400 line-through">MRP ₹{product.mrp}</span>
           </div>
           <button className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95">
              <ShoppingCart size={18} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyProductCard;
