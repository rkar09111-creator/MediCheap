import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  FileUp,
  X,
  FileSpreadsheet,
  Download,
  Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminService, medicineService } from '../../services/api';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const InventoryManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await medicineService.getAll();
      setMedicines(data.data.medicines);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await adminService.updateMedicine(id, { stock: Number(newStock) });
      toast.success('Stock updated');
      fetchInventory();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImportLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);

        // Filter only Serial Number and Stock for inventory update
        const updates = jsonData.map(row => ({
          serialNumber: row['Serial Number'] || row['serial number'],
          stock: Number(row['Stock'] || row['stock'] || 0)
        })).filter(u => u.serialNumber);

        const response = await adminService.bulkImport(updates);
        toast.success(`Updated ${response.data.data.updated} items!`);
        setShowImportModal(false);
        fetchInventory();
      } catch (err) {
        toast.error('Failed to process Excel file');
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-2">
            <Package className="w-6 h-6 text-primary-500" />
            Inventory & Stock
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium">Real-time tracking of medicine stock levels and replenishment needs.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowImportModal(true)} className="admin-btn-ghost flex items-center gap-2 border border-admin-border">
            <FileUp className="w-4 h-4" />
            <span>Sync Stock via Excel</span>
          </button>
          <button onClick={fetchInventory} className="admin-btn-primary flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'In Stock Items', value: medicines.filter(m => m.stock > 0).length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Low Stock Alert', value: medicines.filter(m => m.stock > 0 && m.stock < 20).length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: medicines.filter(m => m.stock === 0).length, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Critical Items', value: medicines.filter(m => m.stock < 10).length, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}><stat.icon className="w-5 h-5" /></div>
            <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* INVENTORY TABLE */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-admin-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
            <input 
              type="text" 
              placeholder="Search by SN or Name..." 
              className="admin-input pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="admin-btn-ghost flex items-center gap-2 border border-admin-border"><Filter className="w-4 h-4" /><span>Status</span></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                <th className="px-6 py-4">Medicine & SN</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Quick Update</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.serialNumber?.includes(searchTerm)).map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                        {item.images?.length > 0 ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-slate-300" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-admin-text-primary">{item.name}</span>
                        <span className="text-[10px] font-mono text-primary-600 font-bold">{item.serialNumber || 'NO-SN'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${item.stock < 20 ? 'text-red-600' : 'text-admin-text-primary'}`}>{item.stock} units</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue={item.stock}
                        className="w-20 px-2 py-1 text-xs font-bold border border-admin-border rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20"
                        onBlur={(e) => handleStockUpdate(item._id, e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.stock > 20 ? 'bg-green-100 text-green-600' : item.stock > 0 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                      {item.stock > 20 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right"><button className="p-2 hover:bg-slate-100 rounded-lg"><MoreVertical className="w-4 h-4 text-admin-text-secondary" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IMPORT MODAL */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-admin-border flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-display font-bold text-admin-text-primary">Bulk Stock Sync</h3>
                <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 space-y-6">
                <div {...getRootProps()} className={`border-3 border-dashed rounded-2xl p-10 flex flex-col items-center text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-300'}`}>
                  <input {...getInputProps()} />
                  {importLoading ? <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" /> : <FileSpreadsheet className="w-8 h-8 text-primary-500 mb-2" />}
                  <p className="text-sm font-bold text-admin-text-primary">Drag Excel file here</p>
                  <p className="text-[10px] text-admin-text-secondary mt-1">Excel must have "Serial Number" and "Stock" columns.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-[11px] text-blue-800 leading-relaxed font-medium">This will only update the stock levels based on the Serial Number. Other item details will remain unchanged.</p>
                </div>
                <button onClick={() => setShowImportModal(false)} className="w-full py-3 border border-admin-border rounded-xl text-sm font-bold text-admin-text-secondary hover:bg-slate-50 transition-all">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InventoryManagement;
