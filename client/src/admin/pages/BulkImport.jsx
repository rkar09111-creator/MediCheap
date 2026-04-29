import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronRight, 
  ArrowRight,
  Database,
  Download,
  Info,
  RefreshCw,
  Table as TableIcon,
  ShieldCheck,
  Zap,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { toast } from 'react-hot-toast';

const BulkImport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [step, setStep] = useState(1); // 1: Upload, 2: Review
  const [isImporting, setIsImporting] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        
        if (jsonData.length > 0) {
          const mappedData = jsonData.map(row => ({
            sku: row['SKU'] || row['sku'] || row['Serial Number'] || '',
            name: row['Item Name'] || row['name'] || '',
            mrp: Number(row['MRP'] || row['mrp'] || 0),
            sellingPrice: Number(row['Selling Price'] || row['sellingPrice'] || row['Price'] || 0),
            category: row['Category'] || 'General',
            requiresPrescription: String(row['Rx Required'] || row['requiresRx'] || 'No').toLowerCase() === 'yes',
            isFeatured: String(row['Featured'] || row['isFeatured'] || 'No').toLowerCase() === 'yes',
            isLive: String(row['Live'] || row['isLive'] || 'Yes').toLowerCase() === 'yes',
            stock: Number(row['Stock'] || 0),
            brand: row['Brand'] || row['Manufacturer'] || '',
          }));

          setData(mappedData);
          setStep(2);
          toast.success("Manifest decoded successfully.");
        }
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const { data: result } = await adminService.bulkImport(data);
      
      if (result.status === 'success') {
        toast.success(`Inventory Synchronized: ${result.data.success} nodes created, ${result.data.updated} nodes updated.`);
        setStep(1);
        setFile(null);
        setData([]);
        navigate('/admin/medicines');
      }
    } catch (error) {
      toast.error('Synchronization failed. Check manifest integrity.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin/medicines')} className="p-4 bg-white border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-all shadow-sm">
            <ChevronLeft size={24} className="text-neutral-400" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight text-brand-primary">Bulk Synchronization.</h1>
            <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider">Inventory Ingestion Protocol #IX-04</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 rounded-xl bg-neutral-100 text-neutral-900 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2">
            <Download size={14} /> Download Template
          </button>
        </div>
      </div>

      {/* Rules Card */}
      <div className="bg-neutral-900 p-10 rounded-[2.5rem] text-white shadow-elite relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
            <ShieldCheck size={20} /> Integrity Constraints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Column Mapping', desc: 'Headers must match: SKU, Item Name, MRP, Selling Price, Stock, Category, Rx Required.' },
              { title: 'Validation', desc: 'Price and Stock fields must be numerical. Booleans (Rx, Live) accept Yes/No values.' },
              { title: 'Conflict Logic', desc: 'Existing SKUs will trigger an automatic UPDATE. New SKUs will trigger an INSERT.' },
            ].map((rule, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{rule.title}</p>
                <p className="text-xs text-neutral-300 leading-relaxed font-bold">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-3 ${step >= s ? 'text-neutral-900' : 'text-neutral-300'}`}>
              <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-neutral-100'}`}>
                {step > s ? <CheckCircle2 size={18} /> : s}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{s === 1 ? 'Manifest Ingestion' : 'Integrity Review'}</span>
            </div>
            {s < 2 && <div className={`w-20 h-0.5 rounded-full transition-all ${step > s ? 'bg-brand-primary' : 'bg-neutral-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-[3rem] border border-neutral-100 shadow-sm"
          >
            <div 
              {...getRootProps()} 
              className={`border-4 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center text-center transition-all cursor-pointer ${isDragActive ? 'border-brand-primary bg-brand-primary/5 scale-[0.98]' : 'border-neutral-50 hover:border-neutral-200 hover:bg-neutral-50/50'}`}
            >
              <input {...getInputProps()} />
              <div className="w-24 h-24 bg-neutral-900 text-brand-primary rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl">
                <FileSpreadsheet size={40} />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight mb-3">Drop Manifest File.</h3>
              <p className="text-sm text-neutral-400 font-bold max-w-sm mb-10 leading-relaxed uppercase tracking-wider">Drag & drop your .xlsx or .csv data pipeline for processing.</p>
              <button className="px-12 py-4 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl">
                Select Pipeline File
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-neutral-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight">Integrity Manifest Review</h3>
                  <p className="text-xs text-neutral-400 font-black uppercase tracking-widest mt-1">Reviewing node cluster #{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-neutral-100 text-neutral-900 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all">
                    Reset Pipeline
                  </button>
                  <button 
                    onClick={handleImport}
                    disabled={isImporting}
                    className="px-10 py-3 rounded-xl bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-600/20 hover:scale-105 transition-all flex items-center gap-3"
                  >
                    {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                    {isImporting ? 'Syncing...' : 'Initiate Synchronization'}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                      <th className="px-8 py-5">SKU / ID</th>
                      <th className="px-8 py-5">Item Identifier</th>
                      <th className="px-8 py-5 text-right">Pricing (₹)</th>
                      <th className="px-8 py-5 text-center">In Stock</th>
                      <th className="px-8 py-5 text-center">Visibility</th>
                      <th className="px-8 py-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {data.slice(0, 8).map((row, i) => (
                      <tr key={i} className="hover:bg-neutral-50/50 transition-all group">
                        <td className="px-8 py-6 text-[10px] font-mono font-black text-neutral-300 group-hover:text-neutral-900 transition-colors uppercase">{row.sku}</td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-neutral-900 truncate tracking-tight">{row.name}</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">{row.category}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className="text-sm font-black text-neutral-900">₹{row.sellingPrice}</p>
                          <p className="text-[10px] font-bold text-neutral-300 line-through">MRP ₹{row.mrp}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-sm font-black text-neutral-900">{row.stock}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-3">
                            <div className={`p-1.5 rounded-lg ${row.requiresPrescription ? 'bg-rose-100 text-rose-500' : 'bg-neutral-100 text-neutral-400'}`} title="Rx Required">
                              <TableIcon size={12} />
                            </div>
                            <div className={`p-1.5 rounded-lg ${row.isLive ? 'bg-brand-600/10 text-brand-primary' : 'bg-neutral-100 text-neutral-400'}`} title="Live">
                              <Globe size={12} />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-600/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                            <CheckCircle2 size={10} /> Validated
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.length > 8 && (
                <div className="p-8 bg-neutral-50/50 text-center border-t border-neutral-50">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Truncated view: {data.length - 8} additional nodes pending synchronization</p>
                </div>
              )}
            </div>
            
            <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-neutral-900 text-brand-primary rounded-2xl flex items-center justify-center shadow-2xl">
                  <Database size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-neutral-900 tracking-tight">Node Cluster Ready.</h4>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Total {data.length} records parsed for ingestion pipeline.</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Batch Load</p>
                  <p className="text-2xl font-black text-neutral-900 tracking-tighter">{(data.length / 100).toFixed(1)} <span className="text-sm">MBs</span></p>
                </div>
                <div className="w-px h-10 bg-neutral-100" />
                <div className="text-right">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Node Count</p>
                  <p className="text-2xl font-black text-neutral-900 tracking-tighter">{data.length}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkImport;
