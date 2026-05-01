import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  ClipboardCheck, 
  User, 
  MapPin, 
  CreditCard,
  ArrowRight,
  Download,
  Printer,
  ChevronRight,
  Package,
  Bike,
  AlertCircle,
  MoreHorizontal,
  X,
  ShieldCheck,
  Zap,
  Loader2,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  Globe,
  RefreshCw,
  MoreVertical as MoreIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminService } from '../../services/api';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableRiders, setAvailableRiders] = useState([]);
  const [showRxModal, setShowRxModal] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.getOrders();
      setOrders(data.data.orders);
    } catch (error) {
      toast.error('Secure records inaccessible.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const { data } = await adminService.getRiders();
      setAvailableRiders(data.data.riders);
    } catch (error) {
      console.error('Failed to fetch node fleet');
    }
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  // Handle direct link to specific order
  useEffect(() => {
    const orderId = searchParams.get('id');
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o._id === orderId);
      if (order) setSelectedOrder(order);
    }
  }, [searchParams, orders]);

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status);
      toast.success(`Protocol Updated: ${status.toUpperCase()}`);
      fetchOrders();
      if (selectedOrder?._id === id) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error('Transaction failed.');
    }
  };

  const handleVerifyRx = async () => {
    try {
      await adminService.verifyPrescription(selectedOrder._id);
      toast.success('Clinical Rx Validated.');
      fetchOrders();
      setSelectedOrder(prev => ({ ...prev, prescription: { ...prev.prescription, isVerified: true }, status: 'prescription_verified' }));
    } catch (error) {
      toast.error('Validation failed.');
    }
  };

  const handleAssignRider = async (riderId) => {
    try {
      await adminService.assignRider(selectedOrder._id, riderId);
      toast.success('Rider Dispatched.');
      fetchOrders();
      setSelectedOrder(prev => ({ ...prev, status: 'assigned_to_rider' }));
    } catch (error) {
      toast.error('Fleet assignment failed.');
    }
  };

  const columns = [
    { 
      label: 'Order ID', 
      key: 'orderId',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-admin-text-primary">#{val}</span>
          <span className="text-[10px] text-admin-text-tertiary uppercase font-medium">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        </div>
      )
    },
    { 
      label: 'Customer', 
      key: 'user',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-xs">
            {val?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-admin-text-primary truncate max-w-[120px]">{val?.name}</span>
            <span className="text-[10px] text-admin-text-tertiary">{val?.phone}</span>
          </div>
        </div>
      )
    },
    { 
      label: 'Status', 
      key: 'status',
      render: (val) => <StatusBadge status={val} />
    },
    { 
      label: 'Payment', 
      key: 'paymentMethod',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-admin-text-primary uppercase tracking-wider">{val}</span>
          <span className={`text-[10px] font-medium ${row.paymentStatus === 'paid' ? 'text-success' : 'text-amber-500'}`}>
            {row.paymentStatus.toUpperCase()}
          </span>
        </div>
      )
    },
    { 
      label: 'Total', 
      key: 'totalAmount',
      render: (val) => <span className="font-mono font-bold">₹{val.toLocaleString()}</span>
    }
  ];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.orderId?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                         (o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text-primary tracking-tight">Order Management</h1>
          <p className="text-xs text-admin-text-tertiary font-medium mt-0.5">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchOrders} className="btn-admin btn-admin-secondary h-9 px-4">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="text-xs">Refresh Records</span>
          </button>
          <button className="btn-admin btn-admin-primary h-9 px-4">
            <Download size={14} />
            <span className="text-xs">Export Records</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="page-card p-4 bg-amber-50/30 border-amber-100">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="page-card p-4 bg-blue-50/30 border-blue-100">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Confirmed</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{orders.filter(o => o.status === 'confirmed').length}</p>
        </div>
        <div className="page-card p-4 bg-brand-green-50/30 border-brand-green-100">
          <p className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Dispatched</p>
          <p className="text-2xl font-bold text-brand-green mt-1">{orders.filter(o => ['out_for_delivery', 'delivered'].includes(o.status)).length}</p>
        </div>
        <div className="page-card p-4 bg-rose-50/30 border-rose-100">
          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Alerts (Rx)</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{orders.filter(o => o.items.some(i => i.medicine?.requiresPrescription) && !o.prescription?.isVerified).length}</p>
        </div>
      </div>

      <DataTable 
        title="Order Records"
        count={filteredOrders.length}
        columns={columns}
        data={filteredOrders}
        isLoading={loading}
        onSearch={setSearchTerm}
        onFilter={() => {}}
        actions={
          <div className="flex items-center gap-2">
             <div className="flex bg-admin-bg p-1 rounded-lg border border-admin-border">
                {['all', 'pending', 'confirmed', 'delivered'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-white text-admin-text-primary shadow-sm' : 'text-admin-text-tertiary hover:text-admin-text-primary'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
          </div>
        }
      />

      {/* ORDER DETAILS SIDEBAR/DRAWER */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-admin-text-primary/20 backdrop-blur-sm z-[110]" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-white shadow-modal z-[120] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-admin-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-admin-text-primary">Order Details</h2>
                  <p className="text-xs text-admin-text-tertiary font-mono">#{selectedOrder.orderId}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-lg hover:bg-admin-bg flex items-center justify-center text-admin-text-tertiary transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto admin-scrollbar p-6 space-y-8">
                {/* STATUS FLOW */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-widest">Order Status</h4>
                      <StatusBadge status={selectedOrder.status} />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'confirmed')}
                        disabled={selectedOrder.status !== 'pending'}
                        className="btn-admin btn-admin-secondary h-10 px-4 disabled:opacity-40"
                      >
                        Confirm Order
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedOrder._id, 'packed')}
                        disabled={selectedOrder.status !== 'confirmed' && selectedOrder.status !== 'prescription_verified'}
                        className="btn-admin btn-admin-secondary h-10 px-4 disabled:opacity-40"
                      >
                        Mark Packed
                      </button>
                   </div>
                </div>

                {/* CUSTOMER INFO */}
                <div className="space-y-4">
                   <h4 className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-widest">Customer Details</h4>
                   <div className="p-4 bg-admin-bg rounded-xl border border-admin-border-2 flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-lg">
                        {selectedOrder.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-admin-text-primary">{selectedOrder.user?.name}</p>
                        <p className="text-xs text-admin-text-secondary mt-0.5">{selectedOrder.user?.email}</p>
                        <p className="text-xs text-admin-text-secondary">{selectedOrder.user?.phone}</p>
                      </div>
                   </div>
                </div>

                {/* DELIVERY */}
                <div className="space-y-4">
                   <h4 className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-widest">Shipping Information</h4>
                   <div className="space-y-3">
                      <div className="flex gap-3">
                        <MapPin size={16} className="text-admin-text-tertiary mt-0.5 shrink-0" />
                        <p className="text-sm font-medium text-admin-text-secondary">{selectedOrder.deliveryAddress}</p>
                      </div>
                      <div className="flex gap-3">
                        <Truck size={16} className="text-admin-text-tertiary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-admin-text-secondary">Standard Delivery</p>
                          <p className="text-[10px] text-admin-text-tertiary font-bold uppercase mt-1 tracking-wider">Est: Within 24 Hours</p>
                        </div>
                      </div>
                   </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-4">
                   <h4 className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-widest">Ordered Items</h4>
                   <div className="divide-y divide-admin-border-2 border border-admin-border rounded-xl overflow-hidden">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="p-4 flex items-center gap-4 bg-white hover:bg-admin-bg transition-colors">
                           <div className="w-10 h-10 rounded-lg bg-admin-bg flex items-center justify-center text-admin-text-tertiary">
                             <Package size={20} />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-sm font-bold text-admin-text-primary truncate">{item.medicine?.name}</p>
                             <p className="text-[10px] text-admin-text-tertiary font-bold uppercase tracking-wider">{item.quantity} Unit(s) • ₹{item.price}/ea</p>
                           </div>
                           <p className="text-sm font-bold text-admin-text-primary">₹{item.quantity * item.price}</p>
                        </div>
                      ))}
                      <div className="p-4 bg-admin-bg/50 space-y-2">
                        <div className="flex justify-between text-xs font-medium text-admin-text-secondary">
                          <span>Subtotal</span>
                          <span>₹{selectedOrder.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-admin-text-secondary">
                          <span>Delivery Fee</span>
                          <span>₹0</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-admin-text-primary pt-2 border-t border-admin-border-2">
                          <span>Total Amount</span>
                          <span>₹{selectedOrder.totalAmount}</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-6 border-t border-admin-border bg-admin-bg/30 grid grid-cols-2 gap-3">
                 <button className="btn-admin btn-admin-secondary h-11 px-4">
                   <Printer size={16} />
                   <span>Invoice</span>
                 </button>
                 <button 
                  onClick={() => updateStatus(selectedOrder._id, 'delivered')}
                  className="btn-admin btn-admin-primary h-11 px-4"
                 >
                   <CheckCircle2 size={16} />
                   <span>Dispatch Success</span>
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement;
