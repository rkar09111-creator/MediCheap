import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  History, 
  ShieldCheck, 
  ShieldAlert,
  ArrowUpDown,
  Download,
  UserPlus,
  ChevronRight
} from 'lucide-react';

const Users = () => {
  const users = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', orders: 12, spent: '₹14,240', status: 'Active', joined: 'Jan 12, 2025' },
    { id: 2, name: 'Anjali Desai', email: 'anjali@example.com', orders: 8, spent: '₹8,450', status: 'Active', joined: 'Feb 04, 2025' },
    { id: 3, name: 'Vikram Mehta', email: 'vikram@example.com', orders: 3, spent: '₹3,100', status: 'Suspended', joined: 'Mar 15, 2025' },
    { id: 4, name: 'Sonia Gandhi', email: 'sonia@example.com', orders: 24, spent: '₹42,890', status: 'Active', joined: 'Dec 20, 2024' },
    { id: 5, name: 'Amit Verma', email: 'amit@example.com', orders: 0, spent: '₹0', status: 'Inactive', joined: 'Apr 18, 2025' },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-primary-500" />
            Customer Management
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium">View and manage customer profiles, orders, and account status.</p>
        </div>
        <div className="flex gap-3">
          <button className="admin-btn-ghost flex items-center gap-2 border border-admin-border">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className="admin-btn-primary flex items-center gap-2 shadow-lg shadow-brand-500/20">
            <UserPlus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card p-6 border-l-4 border-primary-500">
          <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">Total Customers</p>
          <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">3,847</h3>
          <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +124 this month
          </p>
        </div>
        <div className="admin-card p-6 border-l-4 border-blue-500">
          <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">Active Accounts</p>
          <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">3,420</h3>
          <p className="text-xs text-blue-600 font-bold mt-2">89% engagement rate</p>
        </div>
        <div className="admin-card p-6 border-l-4 border-pink-500">
          <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">New Registrations</p>
          <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">12</h3>
          <p className="text-xs text-pink-600 font-bold mt-2">Today so far</p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="admin-card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
          <input type="text" placeholder="Search by name, email, or phone..." className="admin-input pl-10" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="admin-btn-ghost flex items-center gap-2 border border-admin-border px-4 py-2">
            <Filter className="w-4 h-4" />
            <span>Filter By</span>
          </button>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-primary-600 text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-admin-text-primary">{user.name}</span>
                        <span className="text-[10px] text-admin-text-secondary font-medium uppercase tracking-widest">Joined {user.joined}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-admin-text-primary font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-admin-text-primary font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        +91 98765 43210
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-admin-text-primary">{user.orders} Orders</span>
                      <span className="text-xs font-bold text-green-600">Spent {user.spent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full w-fit ${
                      user.status === 'Active' ? 'bg-green-100 text-green-600' : 
                      user.status === 'Suspended' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.status === 'Active' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                      {user.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors shadow-sm border border-transparent hover:border-primary-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-admin-text-primary rounded-lg transition-colors shadow-sm border border-transparent hover:border-admin-border">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simple TrendingUp component since it was used in code
const TrendingUp = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default Users;
