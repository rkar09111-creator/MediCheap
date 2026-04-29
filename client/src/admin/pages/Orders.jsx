import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Package,
  Calendar,
  IndianRupee,
  ChevronRight,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { adminService, orderService } from '../../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = ['All', 'Pending', 'Confirmed', 'Packed', 'Out_for_delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        orderService.getAll({ status: activeTab === 'All' ? undefined : activeTab.toLowerCase() }),
        adminService.getStats()
      ]);
      setOrders(ordersRes.data.data.orders);
      setStats(statsRes.data.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'packed': return 'bg-purple-100 text-purple-600';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-600';
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.orderId || o._id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary-500" />
            Order Management
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium">Track and process customer orders in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="admin-btn-ghost flex items-center gap-2 border border-admin-border">
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Fleet</span>
          </button>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="admin-card p-4 space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-primary-500 text-white shadow-md shadow-brand-500/20' : 'text-admin-text-secondary hover:bg-slate-50'}`}
            >
              {tab.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
            <input 
              type="text" 
              placeholder="Search by Order ID, customer, or phone..." 
              className="admin-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="admin-card overflow-hidden min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
             <div className="flex flex-col items-center gap-2">
               <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
               <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Polling Fleet Data...</p>
             </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-admin-text-primary">#{(order.orderId || order._id).slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] font-mono text-admin-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${getStatusStyle(order.status)} bg-opacity-20`}>
                        {order.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-admin-text-primary">{order.user?.name || 'Unknown User'}</span>
                        <span className="text-[10px] text-admin-text-secondary">{order.user?.phone || 'No Phone'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-admin-text-primary">{order.items?.length || 0} Items</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${order.items?.some(i => i.medicine?.requiresPrescription) ? 'text-pink-600 border-pink-200 bg-pink-50' : 'text-blue-600 border-blue-200 bg-blue-50'} w-fit`}>
                        {order.items?.some(i => i.medicine?.requiresPrescription) ? 'Prescription' : 'OTC'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-admin-text-primary">₹{order.pricing?.total || order.totalAmount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${getStatusStyle(order.status)} px-2.5 py-1 rounded-full w-fit`}>
                      {order.status.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 text-admin-text-primary rounded-lg transition-colors border border-transparent hover:border-admin-border shadow-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <Package size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No matching deployments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/30 border-t border-admin-border flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-admin-text-secondary uppercase">Total Managed</p>
              <p className="text-xl font-bold text-admin-text-primary">{stats?.totalOrders || 0}</p>
            </div>
            <div className="flex flex-col border-l border-admin-border pl-4">
              <p className="text-[10px] font-bold text-admin-text-secondary uppercase">Pending</p>
              <p className="text-xl font-bold text-amber-600">{stats?.pendingOrders || 0}</p>
            </div>
            <div className="flex flex-col border-l border-admin-border pl-4">
              <p className="text-[10px] font-bold text-admin-text-secondary uppercase">Gross Volume</p>
              <p className="text-xl font-bold text-green-600">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

export default Orders;
