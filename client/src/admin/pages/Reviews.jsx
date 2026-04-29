import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ThumbsUp, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  MoreVertical,
  Flag,
  ChevronDown,
  User,
  Package,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReviewStatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-600 border-amber-200',
    approved: 'bg-green-100 text-green-600 border-green-200',
    flagged: 'bg-red-100 text-red-600 border-red-200',
    featured: 'bg-primary-100 text-primary-600 border-primary-200',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${styles[status] || styles.pending}`}>
      {status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
      {status === 'flagged' && <Flag className="w-3.5 h-3.5" />}
      {status === 'featured' && <Star className="w-3.5 h-3.5 fill-current" />}
      {status}
    </span>
  );
};

const Reviews = () => {
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const reviews = [
    { 
      id: 'REV-901', 
      user: 'Rahul Sharma', 
      rating: 5, 
      comment: 'Excellent service and genuine medicine. The prescription verification was very fast.',
      product: 'Paracetamol 500mg',
      date: '2h ago',
      status: 'pending',
      avatar: 'RS'
    },
    { 
      id: 'REV-902', 
      user: 'Priya Mehta', 
      rating: 4, 
      comment: 'Packaging was good, but delivery was delayed by 30 minutes. Overall happy.',
      product: 'Vitamin C 1000mg',
      date: '5h ago',
      status: 'approved',
      avatar: 'PM'
    },
    { 
      id: 'REV-903', 
      user: 'Anonymous', 
      rating: 1, 
      comment: 'I suspect the medicine is not original. Packaging looks different.',
      product: 'Amoxicillin 250mg',
      date: '1d ago',
      status: 'flagged',
      avatar: '?'
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            Reviews & Trust Audit
            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-full">12 Pending Approval</span>
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Moderate clinical feedback and manage product reputation scores.</p>
        </div>
        <div className="flex gap-4">
           <div className="admin-card px-6 py-2 flex items-center gap-4 bg-slate-50/50">
             <div><p className="text-[10px] font-bold text-admin-text-secondary uppercase">Global Rating</p><p className="text-lg font-bold text-admin-text-primary">4.82/5.0</p></div>
             <div className="flex items-center gap-0.5 text-amber-500">
               {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-current' : 'fill-none'}`} />)}
             </div>
           </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1 p-1 bg-white border border-admin-border rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
        {['all', 'pending', 'approved', 'flagged', 'featured'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap uppercase tracking-widest ${filter === f ? 'bg-primary-500 text-white shadow-lg shadow-brand-500/20' : 'text-admin-text-secondary hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* REVIEWS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <motion.div 
            key={rev.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="admin-card p-8 space-y-6 relative group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-lg shadow-sm">{rev.avatar}</div>
                <div>
                  <h4 className="text-base font-bold text-admin-text-primary">{rev.user}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= rev.rating ? 'fill-current' : 'fill-none'}`} />)}
                    </div>
                    <span className="text-[10px] text-admin-text-secondary font-bold uppercase tracking-widest">• {rev.date}</span>
                  </div>
                </div>
              </div>
              <ReviewStatusBadge status={rev.status} />
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-admin-text-primary leading-relaxed relative">
               <span className="absolute -top-3 left-6 text-4xl text-slate-200 font-serif">"</span>
               {rev.comment}
               <span className="absolute -bottom-6 right-6 text-4xl text-slate-200 font-serif">"</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Package className="w-4 h-4" /></div>
                 <div><p className="text-[10px] font-bold text-admin-text-secondary uppercase">Reviewed Product</p><p className="text-xs font-bold text-admin-text-primary uppercase tracking-wider">{rev.product}</p></div>
               </div>
               <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="px-4 py-2 bg-success text-white text-[10px] font-bold rounded-xl shadow-lg shadow-green-500/20 hover:scale-105 transition-all">APPROVE</button>
                  <button className="px-4 py-2 bg-white border border-admin-border text-slate-600 text-[10px] font-bold rounded-xl hover:bg-slate-50 transition-all">REJECT</button>
                  <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* STATS SECTION */}
      <div className="admin-card p-8">
        <h3 className="text-lg font-display font-bold text-admin-text-primary mb-8">Rating Distribution</h3>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-6">
              <div className="flex items-center gap-2 w-12"><span className="text-sm font-bold text-admin-text-primary">{star}</span> <Star className="w-4 h-4 fill-amber-500 text-amber-500" /></div>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${star === 5 ? 85 : star === 4 ? 12 : 3}%` }}
                  className={`h-full ${star >= 4 ? 'bg-amber-400' : 'bg-slate-300'}`}
                />
              </div>
              <span className="text-xs font-bold text-admin-text-secondary w-10">{star === 5 ? '85%' : star === 4 ? '12%' : '3%'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
