import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, 
  FileUp, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Folder, 
  FolderPlus,
  Plus,
  X,
  ChevronRight,
  Info,
  Maximize2,
  FileVideo,
  FileText,
  File
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MediaLibrary = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeFolder, setActiveFolder] = useState('All Assets');

  const assets = [
    { id: 1, name: 'paracetamol_front.jpg', size: '1.2 MB', type: 'image', category: 'Medicines', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae' },
    { id: 2, name: 'vitamin_c_banner.png', size: '2.5 MB', type: 'image', category: 'Banners', url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc' },
    { id: 3, name: 'rider_onboarding.mp4', size: '12.4 MB', type: 'video', category: 'Logistics', url: '#' },
    { id: 4, name: 'compliance_v2.pdf', size: '4.2 MB', type: 'pdf', category: 'Compliance', url: '#' },
  ];

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-primary-500" />
            Media Assets Library
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Centralized management of all visual assets and clinical documentation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-admin-border rounded-xl">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><List className="w-4 h-4" /></button>
          </div>
          <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-500/20 px-8"><FileUp className="w-4 h-4" /> <span>Upload Assets</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR: FOLDERS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="admin-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">Library Folders</h3>
              <button className="p-1 hover:bg-slate-100 rounded text-primary-600"><FolderPlus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1">
              {['All Assets', 'Medicines', 'Banners', 'Logistics', 'Compliance', 'CMS Content'].map((folder) => (
                <button 
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeFolder === folder ? 'bg-primary-500 text-white shadow-lg shadow-brand-500/20' : 'text-admin-text-secondary hover:bg-slate-50'}`}
                >
                  <Folder className={`w-4 h-4 ${activeFolder === folder ? 'fill-current' : ''}`} />
                  {folder}
                  <span className={`ml-auto text-[9px] font-bold ${activeFolder === folder ? 'text-white/60' : 'text-slate-300'}`}>124</span>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-card p-6 bg-slate-900 border-none text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Info className="w-20 h-20" /></div>
             <h4 className="text-sm font-bold mb-4 relative z-10">Storage Usage</h4>
             <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-60"><span>2.4 GB of 10 GB</span> <span>24%</span></div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary-500" style={{ width: '24%' }} /></div>
             </div>
             <button className="w-full py-3 bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest mt-6 hover:bg-white/20 transition-all border border-white/10">Upgrade Storage</button>
          </div>
        </div>

        {/* MAIN CONTENT: ASSETS GRID */}
        <div className="lg:col-span-9 space-y-6">
          <div className="admin-card p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
              <input type="text" placeholder="Search by asset name or metadata..." className="admin-input pl-12 h-11 bg-slate-50/50" />
            </div>
            <button className="admin-btn-ghost border border-admin-border h-11 px-6"><Filter className="w-4 h-4 mr-2" /> Sort By: Newest</button>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {assets.map((asset) => (
                <motion.div 
                  key={asset.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedAsset(asset)}
                  className="admin-card group overflow-hidden cursor-pointer border-transparent hover:border-primary-300 transition-all"
                >
                  <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {asset.type === 'image' ? (
                      <img src={asset.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-300">
                        {asset.type === 'video' ? <FileVideo className="w-12 h-12" /> : asset.type === 'pdf' ? <FileText className="w-12 h-12" /> : <File className="w-12 h-12" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{asset.type}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button onClick={(e) => {e.stopPropagation(); copyUrl(asset.url)}} className="p-2 bg-white rounded-lg text-slate-900 shadow-xl hover:scale-110 transition-transform"><Copy className="w-4 h-4" /></button>
                       <button className="p-2 bg-white rounded-lg text-slate-900 shadow-xl hover:scale-110 transition-transform"><Maximize2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-xs font-bold text-admin-text-primary truncate">{asset.name}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">
                      <span>{asset.size}</span>
                      <span className="text-primary-600">{asset.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 group hover:border-primary-300 hover:bg-slate-50 transition-all cursor-pointer">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-500 flex items-center justify-center mb-4 transition-all"><Plus className="w-6 h-6" /></div>
                 <p className="text-xs font-bold text-admin-text-secondary group-hover:text-primary-600">Quick Upload</p>
              </div>
            </div>
          ) : (
            <div className="admin-card overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase border-b border-admin-border">
                      <th className="px-6 py-4">Asset</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedAsset(asset)}>
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">{asset.type === 'image' ? <ImageIcon className="w-4 h-4 text-slate-400" /> : <File className="w-4 h-4 text-slate-400" />}</div><span className="text-xs font-bold text-admin-text-primary">{asset.name}</span></div></td>
                        <td className="px-6 py-4"><span className="text-[10px] font-bold text-admin-text-secondary uppercase">{asset.category}</span></td>
                        <td className="px-6 py-4 text-xs font-medium text-admin-text-secondary">{asset.size}</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold uppercase">{asset.type}</span></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={(e) => {e.stopPropagation(); copyUrl(asset.url)}} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-admin-border text-slate-600"><Copy className="w-4 h-4" /></button>
                             <button className="p-2 hover:bg-danger/10 text-danger rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-slate-300 group-hover:hidden" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>

      {/* ASSET DETAIL DRAWER */}
      <AnimatePresence>
        {selectedAsset && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAsset(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-6 border-b border-admin-border flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-display font-bold text-admin-text-primary">Asset Details</h3>
                <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                  {selectedAsset.type === 'image' ? (
                    <img src={selectedAsset.url} className="w-full h-full object-contain" />
                  ) : (
                    <File className="w-20 h-20 text-slate-300" />
                  )}
                </div>

                <div className="space-y-6">
                   <div className="space-y-2"><label className="text-[10px] font-bold text-admin-text-secondary uppercase">File Name</label><input type="text" defaultValue={selectedAsset.name} className="admin-input h-11" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-bold text-admin-text-secondary uppercase">Alt Text (SEO)</label><input type="text" placeholder="Describe this asset..." className="admin-input h-11" /></div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2"><label className="text-[10px] font-bold text-admin-text-secondary uppercase">Folder</label><select className="admin-input h-11"><option>{selectedAsset.category}</option></select></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-admin-text-secondary uppercase">Size</label><div className="h-11 flex items-center px-4 bg-slate-50 border border-admin-border rounded-2xl text-sm font-bold text-admin-text-primary">{selectedAsset.size}</div></div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-admin-text-secondary uppercase">Dynamic CDN URL</label>
                      <div className="flex items-center gap-2">
                        <input type="text" value={selectedAsset.url} readOnly className="admin-input h-11 flex-1 text-[10px] font-mono" />
                        <button onClick={() => copyUrl(selectedAsset.url)} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800"><Copy className="w-5 h-5" /></button>
                      </div>
                   </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-8 border-t border-admin-border bg-white flex items-center gap-4">
                <button className="flex-1 py-4 bg-white border border-admin-border text-slate-900 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                   <ExternalLink className="w-4 h-4" /> View Original
                </button>
                <button className="flex-1 py-4 bg-danger text-white rounded-2xl text-xs font-bold hover:bg-danger/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-danger/20">
                   <Trash2 className="w-4 h-4" /> Delete Asset
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaLibrary;
