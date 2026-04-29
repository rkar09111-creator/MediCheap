import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Search, 
  Package, 
  Percent, 
  Gift, 
  Crown, 
  Zap,
  Layout,
  MousePointer2,
  ChevronRight,
  ArrowRight,
  Clock,
  ShieldCheck,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { medicineService, settingService } from '../../services/api';

const OfferManagement = () => {
  const [activeTab, setActiveTab] = useState('home-floating');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data State
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Offers Config State
  const [offersConfig, setOffersConfig] = useState({
    floatingProducts: [], // Array of 3 IDs
    coupons: [],
    membershipPlans: [
      { tier: 'FREE', price: '₹0 / month', features: [{text: 'Standard Discounts', included: true}, {text: 'Order Tracking', included: true}, {text: 'Free Delivery', included: false}, {text: 'Priority Support', included: false}] },
      { tier: 'SILVER', price: '₹99 / month', features: [{text: 'Extra 5% Discount', included: true}, {text: 'Free Delivery', included: true}, {text: 'Priority Support', included: true}, {text: 'Special Coupons', included: false}] },
      { tier: 'GOLD', price: '₹199 / month', features: [{text: 'Extra 10% Discount', included: true}, {text: 'Free Delivery', included: true}, {text: 'Priority Support', included: true}, {text: 'VIP Coupons', included: true}] }
    ]
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [medRes, settingRes] = await Promise.all([
        medicineService.getAll({ limit: 100 }), // Simplified for product picker
        settingService.getAll()
      ]);
      
      setMedicines(medRes.data.data.medicines || []);
      
      const config = settingRes.data.data.settings?.offers;
      if (config) setOffersConfig(prev => ({ ...prev, ...config }));
    } catch (error) {
      console.error('Initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingService.update({ key: 'offers_config', value: offersConfig });
      toast.success('Offer Parameters Synchronized.');
    } catch (error) {
      toast.error('Sync failed.');
    } finally {
      setSaving(false);
    }
  };

  const toggleFloatingProduct = (id) => {
    let newFloating = [...offersConfig.floatingProducts];
    if (newFloating.includes(id)) {
      newFloating = newFloating.filter(pid => pid !== id);
    } else {
      if (newFloating.length >= 3) {
        toast.error('Maximum 3 nodes can be allocated to the Home Floating Section.');
        return;
      }
      newFloating.push(id);
    }
    setOffersConfig({ ...offersConfig, floatingProducts: newFloating });
  };

  const addCoupon = () => {
    const newCoupon = { 
      id: Date.now(), 
      discount: '20% OFF', 
      title: 'New Promo', 
      minOrder: 'Above ₹0', 
      expiry: '31 Dec', 
      code: 'NEWOFFER', 
      popular: false 
    };
    setOffersConfig({ ...offersConfig, coupons: [...offersConfig.coupons, newCoupon] });
  };

  const updateCoupon = (id, field, value) => {
    const newCoupons = offersConfig.coupons.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    setOffersConfig({ ...offersConfig, coupons: newCoupons });
  };

  const deleteCoupon = (id) => {
    setOffersConfig({ ...offersConfig, coupons: offersConfig.coupons.filter(c => c.id !== id) });
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <Loader2 size={48} className="text-emerald-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Offer Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Offer Management.</h1>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">Institutional Promotion Engine • Dynamic Yield Control</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-elite flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
          Sync Offer Intelligence
        </button>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-4 p-2 bg-white border border-slate-100 rounded-[2rem] shadow-sm w-fit overflow-x-auto no-scrollbar">
        {[
          { id: 'home-floating', label: 'Floating Showcase', icon: MousePointer2 },
          { id: 'coupons', label: 'Coupon Registry', icon: Tag },
          { id: 'memberships', label: 'Membership Plans', icon: Crown },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 text-[10px] font-black rounded-[1.5rem] transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'home-floating' && (
          <motion.div 
            key="floating" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-elite relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700"><MousePointer2 size={160} /></div>
               <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                     <Zap size={24} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Home Floating Node Allocation.</h3>
                  <p className="text-slate-400 max-w-lg text-sm font-medium">Select exactly 3 medicine nodes to rotate in the Home Hero floating section. These are your high-visibility operational priorities.</p>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex -space-x-4">
                      {offersConfig.floatingProducts.map(id => {
                        const med = medicines.find(m => m._id === id);
                        return (
                          <div key={id} className="w-12 h-12 rounded-2xl bg-white border-4 border-slate-900 overflow-hidden shadow-xl ring-2 ring-emerald-500/50">
                            <img src={med?.images?.[0]?.url || '/med-placeholder.png'} className="w-full h-full object-contain" />
                          </div>
                        )
                      })}
                      {[...Array(Math.max(0, 3 - offersConfig.floatingProducts.length))].map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-2xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-slate-600">
                          <Plus size={16} />
                        </div>
                      ))}
                    </div>
                    <span className="text-institutional text-emerald-400">{offersConfig.floatingProducts.length}/3 Nodes Allocated</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center gap-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input 
                          type="text" 
                          placeholder="Identify medicine node..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-16 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-black focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="max-h-[600px] overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 no-scrollbar">
                    {filteredMedicines.map((med) => {
                      const isSelected = offersConfig.floatingProducts.includes(med._id);
                      return (
                        <div 
                          key={med._id} 
                          onClick={() => toggleFloatingProduct(med._id)}
                          className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative ${isSelected ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                        >
                          <div className="aspect-square rounded-2xl bg-slate-50 mb-4 p-4 flex items-center justify-center relative overflow-hidden">
                             <img src={med.images?.[0]?.url || '/med-placeholder.png'} className="w-full h-full object-contain group-hover:scale-110 transition-all" />
                             {isSelected && (
                                <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                   <CheckCircle2 size={40} className="text-emerald-500" />
                                </div>
                             )}
                          </div>
                          <h4 className="text-xs font-black text-slate-900 truncate tracking-tight">{med.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{med.brand}</p>
                          <div className="mt-4 flex items-center justify-between">
                             <span className="text-sm font-black text-slate-900">₹{med.sellingPrice}</span>
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                {isSelected ? <Trash2 size={14} /> : <Plus size={14} />}
                             </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'coupons' && (
          <motion.div 
            key="coupons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Voucher Registry</h3>
                <button onClick={addCoupon} className="px-6 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all flex items-center gap-2">
                   <Plus size={16} /> Deploy New Voucher
                </button>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {offersConfig.coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-premium group hover:border-emerald-500/20 transition-all">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-institutional text-slate-400">Yield Percentage</label>
                          <input 
                            type="text" 
                            value={coupon.discount} 
                            onChange={(e) => updateCoupon(coupon.id, 'discount', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-black text-emerald-600 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-institutional text-slate-400">Access Code</label>
                          <input 
                            type="text" 
                            value={coupon.code} 
                            onChange={(e) => updateCoupon(coupon.id, 'code', e.target.value)}
                            className="w-full bg-slate-900 text-white border-none rounded-xl p-4 text-xs font-black tracking-widest focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none"
                          />
                       </div>
                       <div className="space-y-4 col-span-2">
                          <label className="text-institutional text-slate-400">Descriptor</label>
                          <input 
                            type="text" 
                            value={coupon.title} 
                            onChange={(e) => updateCoupon(coupon.id, 'title', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-black text-slate-900 transition-all outline-none"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-institutional text-slate-400">Minimum Threshold</label>
                          <input 
                            type="text" 
                            value={coupon.minOrder} 
                            onChange={(e) => updateCoupon(coupon.id, 'minOrder', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-black text-slate-900 transition-all outline-none"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-institutional text-slate-400">Expiration Node</label>
                          <input 
                            type="text" 
                            value={coupon.expiry} 
                            onChange={(e) => updateCoupon(coupon.id, 'expiry', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-black text-slate-900 transition-all outline-none"
                          />
                       </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                       <button 
                         onClick={() => updateCoupon(coupon.id, 'popular', !coupon.popular)}
                         className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${coupon.popular ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 text-slate-400'}`}
                       >
                          Popularity Flag
                       </button>
                       <button onClick={() => deleteCoupon(coupon.id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'memberships' && (
           <motion.div 
            key="memberships" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
             {offersConfig.membershipPlans.map((plan, i) => (
                <div key={plan.tier} className={`bg-white p-10 rounded-[3rem] border shadow-premium relative group transition-all hover:shadow-elite ${plan.tier === 'GOLD' ? 'border-amber-500/30 ring-4 ring-amber-500/5' : 'border-slate-100'}`}>
                   <div className="mb-8 flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${plan.tier === 'GOLD' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'}`}>
                         {plan.tier === 'FREE' ? <Star size={24} /> : plan.tier === 'SILVER' ? <ShieldCheck size={24} /> : <Crown size={24} />}
                      </div>
                      <span className="text-institutional text-slate-300">Phase 0{i+1}</span>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-institutional text-slate-400">Tier Designation</label>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{plan.tier}</h4>
                      </div>
                      <div className="space-y-2">
                        <label className="text-institutional text-slate-400">Commercial Value</label>
                        <input 
                          type="text" 
                          value={plan.price} 
                          onChange={(e) => {
                            const newPlans = [...offersConfig.membershipPlans];
                            newPlans[i].price = e.target.value;
                            setOffersConfig({...offersConfig, membershipPlans: newPlans});
                          }}
                          className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-black text-slate-900 outline-none"
                        />
                      </div>
                      <div className="space-y-4 pt-6">
                        <label className="text-institutional text-slate-400">Entitlements Registry</label>
                        <div className="space-y-3">
                           {plan.features.map((f, fi) => (
                              <div key={fi} className="flex items-center gap-3">
                                 <button 
                                   onClick={() => {
                                      const newPlans = [...offersConfig.membershipPlans];
                                      newPlans[i].features[fi].included = !newPlans[i].features[fi].included;
                                      setOffersConfig({...offersConfig, membershipPlans: newPlans});
                                   }}
                                   className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${f.included ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}
                                 >
                                    {f.included ? <CheckCircle2 size={12} /> : <X size={12} />}
                                 </button>
                                 <input 
                                    type="text" 
                                    value={f.text} 
                                    onChange={(e) => {
                                      const newPlans = [...offersConfig.membershipPlans];
                                      newPlans[i].features[fi].text = e.target.value;
                                      setOffersConfig({...offersConfig, membershipPlans: newPlans});
                                    }}
                                    className="flex-1 bg-transparent border-none p-0 text-[11px] font-black text-slate-700 outline-none"
                                 />
                              </div>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default OfferManagement;
