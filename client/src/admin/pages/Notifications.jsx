import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Filter, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Plus, 
  Edit2, 
  Trash2, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  Settings as SettingsIcon,
  ChevronRight,
  RefreshCw,
  X,
  History,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('sent');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    { id: 'T-01', name: 'Order Confirmation', channel: 'Email', status: 'Active', lastEdit: '2d ago' },
    { id: 'T-02', name: 'Prescription Verified', channel: 'SMS', status: 'Active', lastEdit: '5d ago' },
    { id: 'T-03', name: 'Medicine Back in Stock', channel: 'Push', status: 'Draft', lastEdit: '1h ago' },
  ];

  const sentLogs = [
    { id: 'N-401', recipient: 'Rahul Sharma', channel: 'Email', type: 'Transactional', status: 'delivered', time: '12 mins ago' },
    { id: 'N-402', recipient: 'Priya Mehta', channel: 'SMS', type: 'Transactional', status: 'delivered', time: '45 mins ago' },
    { id: 'N-403', recipient: 'Broadcast', channel: 'Push', type: 'Marketing', status: 'sending', time: 'Just now' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary-500" />
            Communication & Alerts
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Manage transactional triggers, marketing broadcasts, and clinical alert templates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-btn-ghost border border-admin-border flex items-center gap-2 h-11 px-6"><History className="w-4 h-4" /> <span>Audit Log</span></button>
          <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-500/20 px-8"><Plus className="w-4 h-4" /> <span>Create Campaign</span></button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Emails Sent', value: '14,284', trend: '+12%', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'SMS Alerts', value: '8,421', trend: '+5%', icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Push Broadcasts', value: '42,900', trend: '+18%', icon: Smartphone, color: 'text-primary-600', bg: 'bg-primary-50' },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-6 relative overflow-hidden group hover:border-primary-300 transition-all">
             <div className="flex justify-between items-start">
               <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} mb-4 group-hover:scale-110 transition-transform`}><stat.icon className="w-6 h-6" /></div>
               <span className="text-[10px] font-bold text-success bg-green-50 px-2 py-1 rounded-lg uppercase">{stat.trend}</span>
             </div>
             <p className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-widest">{stat.label}</p>
             <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex items-center gap-8 border-b border-admin-border overflow-x-auto no-scrollbar">
        {[
          { id: 'sent', label: 'Recent Activity', icon: Send },
          { id: 'templates', label: 'Message Templates', icon: FileText },
          { id: 'scheduled', label: 'Scheduled Tasks', icon: Clock },
          { id: 'rules', label: 'Automation Rules', icon: Zap },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 pb-4 px-2 text-[11px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'sent' && (
          <motion.div 
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="admin-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase border-b border-admin-border">
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Channel</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Sent At</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4"><span className="text-xs font-bold text-admin-text-primary">{log.recipient}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-admin-text-secondary">
                          {log.channel === 'Email' ? <Mail className="w-3.5 h-3.5" /> : log.channel === 'SMS' ? <MessageSquare className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                          {log.channel}
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold uppercase">{log.type}</span></td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${log.status === 'delivered' ? 'text-success' : 'text-primary-600 animate-pulse'}`}>
                          {log.status === 'delivered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-admin-text-secondary">{log.time}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-all"><Eye className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div 
            key="templates"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {templates.map((template) => (
              <div key={template.id} className="admin-card p-6 flex flex-col justify-between group hover:border-primary-400 transition-all cursor-pointer" onClick={() => setSelectedTemplate(template)}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-all"><FileText className="w-6 h-6" /></div>
                  <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${template.status === 'Active' ? 'bg-success text-white' : 'bg-slate-100 text-slate-500'}`}>{template.status}</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-admin-text-primary">{template.name}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">{template.channel}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-admin-text-secondary font-medium">Updated {template.lastEdit}</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                  <button className="text-[10px] font-bold text-primary-600 flex items-center gap-1 uppercase tracking-widest">Edit Template <ChevronRight className="w-3.5 h-3.5" /></button>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><Send className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-danger/5 text-danger rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-10 group hover:border-primary-300 hover:bg-slate-50 transition-all cursor-pointer">
               <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-500 flex items-center justify-center mb-4 transition-all"><Plus className="w-8 h-8" /></div>
               <p className="text-sm font-bold text-admin-text-secondary group-hover:text-primary-600">New Template</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TEMPLATE EDITOR MODAL */}
      <AnimatePresence>
        {selectedTemplate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTemplate(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-3xl shadow-2xl z-[110] flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-admin-border flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20"><FileText className="w-6 h-6" /></div>
                  <div><h3 className="text-xl font-display font-bold text-admin-text-primary">{selectedTemplate.name}</h3><p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest mt-1">Template Engine • {selectedTemplate.channel} Core</p></div>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* EDITOR PANEL */}
                <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-white">
                  <div className="space-y-6">
                    <div className="space-y-2"><label className="text-[10px] font-bold text-admin-text-secondary uppercase">Subject / Header</label><input type="text" defaultValue="Your order #{order_id} is confirmed!" className="admin-input h-12 font-bold" /></div>
                    <div className="space-y-2">
                       <div className="flex items-center justify-between mb-2">
                         <label className="text-[10px] font-bold text-admin-text-secondary uppercase">Message Body</label>
                         <div className="flex gap-2">
                           {['{customer_name}', '{order_id}', '{total_amount}', '{delivery_date}'].map(v => <button key={v} className="px-2 py-1 bg-slate-100 rounded text-[9px] font-mono font-bold text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">{v}</button>)}
                         </div>
                       </div>
                       <textarea className="admin-input min-h-[300px] p-6 text-sm font-medium leading-relaxed" defaultValue={`Hello {customer_name},\n\nGreat news! Your order #{order_id} has been confirmed and is being prepared for fulfillment.\n\nSummary:\nTotal Amount: {total_amount}\nEstimated Delivery: {delivery_date}\n\nYou can track your order status in the app.\n\nRegards,\nMediCheap Team`}></textarea>
                    </div>
                  </div>
                </div>

                {/* PREVIEW PANEL */}
                <div className="w-[450px] bg-slate-50 border-l border-admin-border p-10 hidden lg:block overflow-y-auto">
                   <h4 className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.2em] mb-8">Live Mobile Preview</h4>
                   <div className="bg-slate-900 p-3 rounded-[32px] shadow-2xl border-[6px] border-slate-800 relative max-w-[300px] mx-auto aspect-[9/19]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-b-xl z-20" />
                      <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex flex-col p-4 pt-8">
                         <div className="w-full h-8 bg-slate-50 rounded flex items-center px-3 mb-6"><div className="w-12 h-3 bg-primary-100 rounded" /></div>
                         <div className="space-y-3">
                            <h5 className="text-[13px] font-bold text-admin-text-primary leading-tight">Your order #MED-1024 is confirmed!</h5>
                            <div className="w-full h-px bg-slate-100 my-4" />
                            <p className="text-[11px] text-admin-text-secondary leading-relaxed">Hello Rahul Sharma,<br/><br/>Great news! Your order #MED-1024 has been confirmed and is being prepared for fulfillment...</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-8 bg-slate-900 flex items-center justify-between">
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2"><Send className="w-4 h-4" /> Send Test</button>
                  <button className="px-6 py-3 bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2"><Zap className="w-4 h-4" /> Save as Draft</button>
                </div>
                <button className="px-10 py-3 bg-primary-500 text-white text-sm font-bold rounded-xl shadow-xl shadow-brand-500/30 hover:bg-primary-600 transition-all flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Publish Template</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
