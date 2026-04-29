import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Layers, 
  LayoutGrid, 
  List, 
  Filter,
  CheckCircle2,
  XCircle,
  X,
  RefreshCw,
  Power,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { categoryService } from '../../services/api';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', categoryNumber: '', description: '', icon: '💊' });
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await categoryService.getAll();
      setCategories(data.data.categories || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoryService.update(editingId, formData);
        toast.success('Category updated');
      } else {
        await categoryService.create(formData);
        toast.success('Category added');
      }
      setShowModal(false);
      setFormData({ name: '', categoryNumber: '', description: '', icon: '💊' });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleToggle = async (id) => {
    try {
      await categoryService.toggle(id);
      toast.success('Status updated');
      fetchCategories();
    } catch (error) {
      toast.error('Toggle failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will affect items in this category.')) return;
    try {
      await categoryService.delete(id);
      toast.success('Category removed');
      fetchCategories();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const columns = [
    { 
      label: 'Category', 
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-admin-bg flex items-center justify-center text-xl shadow-sm border border-admin-border-2">
            {row.icon || '💊'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-admin-text-primary">{val}</span>
            <span className="text-[10px] text-admin-text-tertiary font-mono">ID: #{row.categoryNumber}</span>
          </div>
        </div>
      )
    },
    { 
      label: 'Products', 
      key: 'itemCount',
      render: (val) => (
        <div className="flex items-center gap-2">
           <span className="font-bold text-admin-text-primary">{val || 0}</span>
           <span className="text-[10px] text-admin-text-tertiary uppercase font-medium">Items</span>
        </div>
      )
    },
    { 
      label: 'Description', 
      key: 'description',
      render: (val) => (
        <p className="text-xs text-admin-text-secondary truncate max-w-[300px] font-medium">
          {val || 'No description provided'}
        </p>
      )
    },
    { 
      label: 'Status', 
      key: 'status',
      render: (val, row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleToggle(row._id); }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
            val === 'active' 
              ? 'bg-brand-green/10 border-brand-green/20 text-brand-green' 
              : 'bg-admin-bg border-admin-border text-admin-text-tertiary'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${val === 'active' ? 'bg-brand-green animate-pulse' : 'bg-admin-text-tertiary'}`} />
          {val}
        </button>
      )
    }
  ];

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text-primary tracking-tight">Taxonomy Clusters</h1>
          <p className="text-xs text-admin-text-tertiary font-medium mt-0.5">Organize and segment your clinical inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCategories} className="btn-admin btn-admin-secondary h-9 px-4">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="text-xs">Sync Clusters</span>
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ name: '', categoryNumber: '', description: '', icon: '💊' }); setShowModal(true); }} className="btn-admin btn-admin-primary h-9 px-4">
            <Plus size={14} />
            <span className="text-xs">Create Cluster</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="page-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-admin-text-primary">{categories.length}</p>
            <p className="text-[10px] text-admin-text-tertiary font-bold uppercase">Total Clusters</p>
          </div>
        </div>
        <div className="page-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-admin-text-primary">{categories.filter(c => c.status === 'active').length}</p>
            <p className="text-[10px] text-admin-text-tertiary font-bold uppercase">Active Nodes</p>
          </div>
        </div>
      </div>

      <DataTable 
        title="Category Registry"
        count={filteredCategories.length}
        columns={columns}
        data={filteredCategories}
        isLoading={loading}
        onSearch={setSearchTerm}
        actions={
          <button 
            onClick={() => { setEditingId(null); setFormData({ name: '', categoryNumber: '', description: '', icon: '💊' }); setShowModal(true); }}
            className="w-8 h-8 rounded-lg bg-brand-green text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
          </button>
        }
      />

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-admin-text-primary/20 backdrop-blur-sm z-[110]" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-2xl shadow-modal z-[120] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-admin-border flex items-center justify-between bg-admin-bg/50">
                <h3 className="text-md font-bold text-admin-text-primary">{editingId ? 'Edit Cluster' : 'Initialize New Cluster'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-admin-bg flex items-center justify-center text-admin-text-tertiary transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="form-label text-[10px] uppercase tracking-wider">Cluster Name</label>
                    <input required type="text" className="admin-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Antibiotics" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="form-label text-[10px] uppercase tracking-wider">Icon</label>
                    <input type="text" className="admin-input text-center text-lg" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="💊" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="form-label text-[10px] uppercase tracking-wider">Node ID (Excel Map)</label>
                  <input required type="number" className="admin-input" value={formData.categoryNumber} onChange={(e) => setFormData({...formData, categoryNumber: e.target.value})} placeholder="e.g. 101" />
                </div>
                <div className="space-y-1.5">
                  <label className="form-label text-[10px] uppercase tracking-wider">Mission Intel (Description)</label>
                  <textarea className="admin-input h-24 py-2 resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe this category cluster..."></textarea>
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn-admin btn-admin-primary w-full h-11">
                    {editingId ? 'Update Protocol' : 'Deploy Cluster'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;
