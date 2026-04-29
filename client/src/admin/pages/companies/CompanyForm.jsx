import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ArrowLeft, 
  Save, 
  X, 
  Upload, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Palette,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { companyService } from '../../../services/api';
import { toast } from 'react-hot-toast';

const PRESET_COLORS = [
  '#16A34A', // MediCheap Green
  '#2563EB', // Pharma Blue
  '#DC2626', // Medical Red
  '#7C3AED', // Bio Purple
  '#EA580C', // Vitamin Orange
  '#0891B2', // Lab Cyan
  '#4F46E5', // Clinical Indigo
  '#111827', // Midnight Slate
];

const CompanyForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    tagline: '',
    shortDescription: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    country: 'India',
    established: '',
    licenseNumber: '',
    gstNumber: '',
    primaryColor: '#16A34A',
    showOnWebsite: true,
    showInMedicineDetail: true,
    isFeatured: false,
    displayOrder: 0,
    logo: '',
    coverImage: ''
  });

  useEffect(() => {
    if (isEdit) {
      const fetchCompany = async () => {
        try {
          const { data } = await companyService.getById(id);
          setFormData(data.data.company);
        } catch (error) {
          toast.error('Failed to load company data');
          navigate('/admin/companies');
        } finally {
          setFetching(false);
        }
      };
      fetchCompany();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (field, url) => {
    setFormData(prev => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await companyService.update(id, formData);
        toast.success('Company intelligence updated');
      } else {
        const { data } = await companyService.add(formData);
        toast.success('New company initialized');
        navigate(`/admin/companies/${data.data.company._id}`);
        return;
      }
      navigate('/admin/companies');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="h-96 flex items-center justify-center font-black text-neutral-300 animate-pulse uppercase tracking-[0.3em]">Decoding Registry...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between sticky top-0 z-40 bg-admin-bg/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/companies')}
            className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{isEdit ? `Edit: ${formData.name}` : 'Initialize New Company'}</h2>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{isEdit ? 'Updating Entity Registry' : 'Creating New Pharmaceutical Entity'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/companies')} className="admin-btn-ghost text-xs border border-neutral-200">Discard Changes</button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="admin-btn-primary h-12 px-8 flex items-center gap-2 shadow-lg shadow-brand-green/20"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            <span>{isEdit ? 'Save Changes' : 'Initialize Entity'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Information */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Identity Section */}
          <div className="admin-card p-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-12 h-12 bg-neutral-900 text-brand-green rounded-2xl flex items-center justify-center"><Building2 size={24} /></div>
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">Company Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Full Corporate Name*</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. IGMA Pharmaceuticals Ltd."
                  className="admin-input h-14 text-lg font-bold"
                />
                <p className="text-[10px] text-neutral-400 font-medium">URL: medicheap.in/companies/{formData.name.toLowerCase().replace(/\s+/g, '-') || '...'}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Short Name (Label)</label>
                <input 
                  type="text" 
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleChange}
                  placeholder="e.g. IGMA"
                  className="admin-input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Corporate Tagline</label>
                <input 
                  type="text" 
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Delivering clinical excellence"
                  className="admin-input"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Short Description</label>
                <textarea 
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  maxLength={200}
                  placeholder="Brief 1-2 sentence description for cards..."
                  className="admin-input resize-none py-4"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Full About Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Detailed company history, mission and clinical standards..."
                  className="admin-input py-4"
                />
              </div>
            </div>
          </div>

          {/* Contact & Legal Section */}
          <div className="admin-card p-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-12 h-12 bg-neutral-900 text-blue-400 rounded-2xl flex items-center justify-center"><Globe size={24} /></div>
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">Contact & Legal Registry</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Corporate Website</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="admin-input pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@company.com" className="admin-input pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Phone Support</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 ..." className="admin-input pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Country of Origin</label>
                <select name="country" value={formData.country} onChange={handleChange} className="admin-input">
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                  <option value="Switzerland">Switzerland</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Year Established</label>
                <input type="text" name="established" value={formData.established} onChange={handleChange} placeholder="e.g. 1984" className="admin-input" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Drug License Number</label>
                <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="e.g. DL-20455" className="admin-input" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Registered Office Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-neutral-300" />
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="Full physical office address..." className="admin-input pl-12 py-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Branding & Media */}
        <div className="space-y-8">
          
          {/* Brand Aesthetics */}
          <div className="admin-card p-8 space-y-8">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-10 h-10 bg-neutral-900 text-purple-400 rounded-xl flex items-center justify-center"><Palette size={20} /></div>
              <h3 className="text-lg font-black text-neutral-900 tracking-tight">Brand Aesthetics</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Primary Brand Color</label>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl shadow-inner border border-neutral-100 flex items-center justify-center cursor-pointer overflow-hidden"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    <input 
                      type="color" 
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="flex-1 admin-input h-12 text-sm font-mono uppercase"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, primaryColor: color }))}
                      className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 flex items-center justify-center ${formData.primaryColor === color ? 'ring-2 ring-neutral-900 ring-offset-2' : ''}`}
                      style={{ backgroundColor: color }}
                    >
                      {formData.primaryColor === color && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mini Preview */}
              <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 space-y-4">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] text-center">Live Interface Preview</p>
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                   <div className="h-12" style={{ backgroundColor: formData.primaryColor + '20' }} />
                   <div className="px-4 pb-4">
                      <div className="w-10 h-10 rounded-lg bg-white border-2 border-white shadow-md -mt-5 flex items-center justify-center text-white text-xs font-black overflow-hidden" style={{ background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.primaryColor}dd)` }}>
                        {formData.name.charAt(0) || 'B'}
                      </div>
                      <div className="mt-2 h-2 w-20 bg-neutral-200 rounded-full" />
                      <div className="mt-1 h-1.5 w-full bg-neutral-100 rounded-full" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="admin-card p-8 space-y-6">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Entity Logo</label>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-[2rem] bg-neutral-50 border-2 border-dashed border-neutral-200 flex items-center justify-center overflow-hidden group relative">
                {formData.logo ? (
                  <img src={formData.logo} alt="" className="w-full h-full object-contain p-2" />
                ) : (
                  <Building2 size={32} className="text-neutral-200" />
                )}
                <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload size={20} className="text-white" />
                </div>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // In a real app, upload to Cloudinary and get URL
                      // For now, using a placeholder or local preview
                      const reader = new FileReader();
                      reader.onloadend = () => handleImageUpload('logo', reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider text-center px-4">Square PNG or SVG with transparency recommended</p>
            </div>
          </div>

          {/* Cover Upload */}
          <div className="admin-card p-8 space-y-6">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Brand Banner</label>
            <div className="aspect-[3/1] rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200 flex items-center justify-center overflow-hidden group relative">
              {formData.coverImage ? (
                <img src={formData.coverImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <FileText size={32} className="text-neutral-200" />
              )}
              <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload size={24} className="text-white" />
              </div>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => handleImageUpload('coverImage', reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider text-center">Recommended: 1200x400px (3:1 Ratio)</p>
          </div>

          {/* Display Settings */}
          <div className="admin-card p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
              <div className="w-10 h-10 bg-neutral-900 text-brand-green rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div>
              <h3 className="text-lg font-black text-neutral-900 tracking-tight">Display & Logic</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-neutral-900 uppercase tracking-tight">Show on Website</p>
                  <p className="text-[9px] text-neutral-400 font-bold uppercase">Toggle public visibility</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showOnWebsite: !prev.showOnWebsite }))}
                  className={`w-10 h-6 rounded-full relative transition-all ${formData.showOnWebsite ? 'bg-brand-green' : 'bg-neutral-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.showOnWebsite ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-neutral-900 uppercase tracking-tight">Featured Brand</p>
                  <p className="text-[9px] text-neutral-400 font-bold uppercase">Show in "Top Brands"</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                  className={`w-10 h-6 rounded-full relative transition-all ${formData.isFeatured ? 'bg-amber-400' : 'bg-neutral-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFeatured ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Display Priority Order</label>
                <input 
                  type="number" 
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  className="admin-input h-12"
                />
                <p className="text-[9px] text-neutral-400 font-medium">Lower number = higher priority on website</p>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
