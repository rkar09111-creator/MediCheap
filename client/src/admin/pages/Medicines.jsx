import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  CheckCircle2,
  AlertCircle,
  Pill,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  RefreshCw,
  Tag,
  Star,
  FileDown,
  FileUp,
  LayoutGrid,
  List,
  Maximize2,
  X,
  Zap,
  MoreHorizontal,
  ClipboardList,
  Globe,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService, medicineService, categoryService } from '../../services/api';
import { toast } from 'react-hot-toast';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';

const Medicines = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    stock: '',
    prescription: ''
  });

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await medicineService.getAll({ ...filters, search: searchTerm });
      setMedicines(data?.data?.medicines || []);
    } catch (error) {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll();
      setCategories(data?.data?.categories || []);
    } catch (error) {
      console.error('Error loading categories');
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this medicine permanently?')) {
      try {
        await adminService.deleteMedicine(id);
        toast.success('Medicine removed');
        fetchMedicines();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const toggleBoolean = async (id, field, currentVal) => {
    try {
      await adminService.updateMedicine(id, { [field]: !currentVal });
      toast.success('Updated successfully');
      setMedicines(prev => prev.map(m => m._id === id ? { ...m, [field]: !currentVal } : m));
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const columns = [
    { 
      label: 'Medicine', 
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-admin-bg border border-admin-border overflow-hidden shrink-0">
            {row.images?.[0] ? <img src={typeof row.images[0] === 'string' ? row.images[0] : (row.images[0].url || '')} className="w-full h-full object-cover" /> : <Pill className="m-auto mt-2 text-admin-text-tertiary" size={20} />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-admin-text-primary truncate max-w-[200px]">{val}</span>
            <span className="text-[10px] text-admin-text-tertiary uppercase font-medium">{row.generic || 'Generic'}</span>
          </div>
        </div>
      )
    },
    { 
      label: 'Category', 
      key: 'category',
      render: (val) => (
        <span className="px-2 py-0.5 bg-admin-bg border border-admin-border rounded text-[10px] font-bold text-admin-text-secondary uppercase tracking-wider">
          {val}
        </span>
      )
    },
    { 
      label: 'Stock', 
      key: 'stock',
      render: (val) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className={`text-xs font-bold ${val <= 10 ? 'text-danger' : 'text-admin-text-primary'}`}>{val} units</span>
            {val <= 10 && <AlertCircle size={12} className="text-danger animate-pulse" />}
          </div>
          <div className="h-1 w-16 bg-admin-bg rounded-full overflow-hidden">
            <div className={`h-full ${val <= 10 ? 'bg-danger' : 'bg-brand-green'}`} style={{ width: `${Math.min(100, (val/100)*100)}%` }} />
          </div>
        </div>
      )
    },
    { 
      label: 'Price', 
      key: 'sellingPrice',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-admin-text-primary">₹{val}</span>
          <span className="text-[10px] text-admin-text-tertiary line-through">₹{row.mrp}</span>
        </div>
      )
    },
    { 
      label: 'Controls', 
      key: 'isLive',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleBoolean(row._id, 'isLive', row.isLive); }}
            className={`p-1.5 rounded-lg border transition-all ${row.isLive ? 'bg-brand-green/10 border-brand-green/20 text-brand-green' : 'bg-admin-bg border-admin-border text-admin-text-tertiary'}`}
            title="Live Status"
          >
            <Globe size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleBoolean(row._id, 'isFeatured', row.isFeatured); }}
            className={`p-1.5 rounded-lg border transition-all ${row.isFeatured ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-admin-bg border-admin-border text-admin-text-tertiary'}`}
            title="Featured"
          >
            <Star size={14} fill={row.isFeatured ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleBoolean(row._id, 'requiresPrescription', row.requiresPrescription); }}
            className={`p-1.5 rounded-lg border transition-all ${row.requiresPrescription ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-admin-bg border-admin-border text-admin-text-tertiary'}`}
            title="Prescription Required"
          >
            <ClipboardList size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text-primary tracking-tight">Medicine Registry</h1>
          <p className="text-xs text-admin-text-tertiary font-medium mt-0.5">Manage pharmacopoeia and inventory levels</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/admin/medicines/import')} className="btn-admin btn-admin-secondary h-9 px-4">
            <FileUp size={14} />
            <span className="text-xs">Import Excel</span>
          </button>
          <button onClick={() => navigate('/admin/medicines/add')} className="btn-admin btn-admin-primary h-9 px-4">
            <Plus size={14} />
            <span className="text-xs">Add Medicine</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="page-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
            <Pill size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-admin-text-primary">{medicines.length}</p>
            <p className="text-xs text-admin-text-tertiary font-medium">Total Active Nodes</p>
          </div>
        </div>
        <div className="page-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-admin-text-primary">{medicines.filter(m => m.stock <= 10).length}</p>
            <p className="text-xs text-admin-text-tertiary font-medium">Critical Stock Alerts</p>
          </div>
        </div>
        <div className="page-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-admin-text-primary">{medicines.filter(m => m.isLive).length}</p>
            <p className="text-xs text-admin-text-tertiary font-medium">Nodes Live on Store</p>
          </div>
        </div>
      </div>

      <DataTable 
        title="Pharmacopoeia"
        count={medicines.length}
        columns={columns}
        data={medicines}
        isLoading={loading}
        onSearch={setSearchTerm}
        actions={
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/admin/medicines/add')}
              className="w-8 h-8 rounded-lg bg-brand-green text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-admin-bg border border-admin-border flex items-center justify-center text-admin-text-tertiary hover:text-admin-text-primary transition-colors">
              <RefreshCw size={14} onClick={fetchMedicines} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        }
      />
    </div>
  );
};

export default Medicines;
