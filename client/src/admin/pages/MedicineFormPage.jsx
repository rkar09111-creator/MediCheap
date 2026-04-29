import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  Plus, 
  X, 
  Pill, 
  DollarSign, 
  Package, 
  Search,
  Globe,
  Star,
  Zap,
  Info,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  ClipboardList,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { toast } from 'react-hot-toast';
import { adminService, medicineService, categoryService } from '../../services/api';

const SectionHeader = ({ icon: Icon, title, sub }) => (
  <div className="flex gap-4 mb-8">
    <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100 shrink-0">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-lg font-black text-neutral-900 tracking-tight">{title}</h3>
      <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mt-1">{sub}</p>
    </div>
  </div>
);

const MedicineFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    generic: '',
    brand: '',
    manufacturer: '',
    category: 'Tablets',
    type: 'Tablet',
    packSize: '',
    mrp: 0,
    sellingPrice: 0,
    discountValue: 0,
    stock: 0,
    minStockAlert: 10,
    sku: '',
    requiresPrescription: false,
    isLive: true,
    isFeatured: false,
    isRecommended: false,
    images: [],
    tags: []
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-6 bg-neutral-50 border-none rounded-2xl mt-4',
      },
    },
  });

  useEffect(() => {
    fetchCategories();
    if (id) fetchMedicine();
  }, [id, editor]);

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll();
      setCategories(data.data.categories);
    } catch (error) {
      console.error('Error fetching categories');
    }
  };

  const fetchMedicine = async () => {
    setLoading(true);
    try {
      const { data } = await medicineService.getById(id);
      const med = data.data.medicine;
      setFormData({
        ...med,
        type: med.medicineType || med.type || 'Tablet',
        generic: med.genericName || med.generic || '',
        mrp: med.mrp || med.price || 0,
        sellingPrice: med.sellingPrice || med.price || 0,
      });
      if (editor) {
        editor.commands.setContent(med.fullDescription || med.description || '');
      }
    } catch (error) {
      toast.error('Failed to load medicine data');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (field, value) => {
    const num = parseFloat(value) || 0;
    const newData = { ...formData, [field]: num };
    
    if (field === 'mrp' || field === 'sellingPrice') {
      const mrp = field === 'mrp' ? num : formData.mrp;
      const selling = field === 'sellingPrice' ? num : formData.sellingPrice;
      if (mrp > 0) {
        newData.discountValue = Math.round(((mrp - selling) / mrp) * 100);
      }
    }
    setFormData(newData);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        medicineType: formData.type,
        genericName: formData.generic,
        fullDescription: editor?.getHTML(),
        price: formData.sellingPrice, // Backward compatibility
      };

      if (id) {
        await adminService.updateMedicine(id, payload);
        toast.success('Medicine record synchronized');
      } else {
        await adminService.addMedicine(payload);
        toast.success('New medicine deployed');
      }
      navigate('/admin/medicines');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-brand-primary" size={40} />
      <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Accessing Secure Records...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-32">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin/medicines')} className="p-4 bg-white border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-all shadow-sm">
            <ChevronLeft size={24} className="text-neutral-400" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">{id ? 'Edit Node.' : 'Deploy Node.'}</h2>
            <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider">Catalogue Management Protocol #HP-92</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSave} className="px-10 py-4 bg-brand-primary text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-600/20 hover:scale-105 transition-all flex items-center gap-2">
            <Save size={18} /> {id ? 'Synchronize Changes' : 'Deploy Medicine'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* MAIN FORM */}
        <div className="xl:col-span-8 space-y-10">
          {/* BASIC INFO */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm">
            <SectionHeader icon={Pill} title="Core Intelligence" sub="Scientific identification & nomenclature" />
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Medicine Name*</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  placeholder="e.g. Paracetamol 500mg" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Generic Formula</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold"
                    placeholder="e.g. Acetaminophen" 
                    value={formData.generic}
                    onChange={(e) => setFormData({...formData, generic: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Manufacturer / Brand</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-bold"
                    placeholder="e.g. GlaxoSmithKline" 
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Full Scientific Description</label>
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* PRICING & INVENTORY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm">
              <SectionHeader icon={DollarSign} title="Commercials" sub="Pricing, taxes & margins" />
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">MRP (Max Price)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 font-black">₹</span>
                      <input 
                        type="number" 
                        className="w-full pl-12 pr-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-black"
                        value={formData.mrp}
                        onChange={(e) => handlePriceChange('mrp', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Selling Price</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary font-black">₹</span>
                      <input 
                        type="number" 
                        className="w-full pl-12 pr-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-black text-brand-primary"
                        value={formData.sellingPrice}
                        onChange={(e) => handlePriceChange('sellingPrice', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-brand-600/10 rounded-2xl flex items-center justify-between">
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Auto-Discount Applied</span>
                  <span className="text-sm font-black text-brand-primary">{formData.discountValue}% OFF</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm">
              <SectionHeader icon={Package} title="Logistics" sub="Stock levels & identification" />
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Current Stock</label>
                    <input 
                      type="number" 
                      className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-black"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Min Alert Level</label>
                    <input 
                      type="number" 
                      className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-black text-rose-500"
                      value={formData.minStockAlert}
                      onChange={(e) => setFormData({...formData, minStockAlert: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Global SKU / Serial Number</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl text-sm font-mono font-black"
                    placeholder="e.g. MC-PH-12345"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR SETTINGS */}
        <div className="xl:col-span-4 space-y-10">
          {/* VISIBILITY TOGGLES */}
          <div className="bg-neutral-900 p-10 rounded-[2.5rem] text-white shadow-elite space-y-10">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-brand-primary">Operational Status</h3>
            
            <div className="space-y-4">
              {[
                { label: 'Live on Website', key: 'isLive', icon: Globe, color: 'text-blue-400' },
                { label: 'Featured Item', key: 'isFeatured', icon: Zap, color: 'text-amber-400' },
                { label: 'Requires Prescription', key: 'requiresPrescription', icon: ClipboardList, color: 'text-rose-400' },
                { label: 'Clinical Recommendation', key: 'isRecommended', icon: Star, color: 'text-brand-primary' },
              ].map((item) => (
                <div 
                  key={item.key} 
                  onClick={() => setFormData({...formData, [item.key]: !formData[item.key]})}
                  className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl bg-white/5 ${item.color}`}><item.icon size={18} /></div>
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-all ${formData[item.key] ? 'bg-brand-primary' : 'bg-white/20'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData[item.key] ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CLASSIFICATION */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Classification</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Primary Category</label>
                <select 
                  className="w-full px-6 py-4 bg-neutral-50 border-none rounded-2xl text-xs font-black uppercase"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Dosage Form</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormData({...formData, type: t})}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.type === t ? 'bg-neutral-900 text-white shadow-lg' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ASSETS */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Digital Assets</h3>
            
            <div className="space-y-4">
              <div className="aspect-video rounded-3xl bg-neutral-50 border-2 border-dashed border-neutral-100 flex flex-col items-center justify-center gap-3 text-neutral-400 hover:bg-neutral-100 transition-all cursor-pointer">
                <ImageIcon size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Upload Master Image</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-100 flex items-center justify-center text-neutral-200">
                    <Plus size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineFormPage;
