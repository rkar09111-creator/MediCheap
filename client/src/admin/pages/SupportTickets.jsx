import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  MoreVertical, 
  Tag, 
  Flag,
  X,
  Send,
  Paperclip,
  ChevronRight,
  ShieldAlert,
  Info,
  MoreHorizontal,
  History
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    Open: 'bg-primary-100 text-primary-600 border-primary-200',
    Resolved: 'bg-green-100 text-green-600 border-green-200',
    Pending: 'bg-amber-100 text-amber-600 border-amber-200',
    Critical: 'bg-red-100 text-red-600 border-red-200',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${styles[status] || styles.Open}`}>
      <div className={`w-1 h-1 rounded-full ${status === 'Open' ? 'bg-primary-600 animate-pulse' : 'bg-current'}`} />
      {status}
    </span>
  );
};

const SupportTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('All');

  const tickets = [
    { id: 'TKT-1024', subject: 'Prescription rejection query', user: 'Rahul Sharma', priority: 'High', status: 'Open', lastUpdate: '12 mins ago', assigned: 'Dr. Sameer' },
    { id: 'TKT-1025', subject: 'Refund for order #MED-902', user: 'Priya Mehta', priority: 'Medium', status: 'Pending', lastUpdate: '1h ago', assigned: 'Arjun Admin' },
    { id: 'TKT-1026', subject: 'Side effects reporting', user: 'Suman K.', priority: 'Critical', status: 'Open', lastUpdate: '5m ago', assigned: 'Dr. Sameer' },
    { id: 'TKT-1027', subject: 'Change delivery address', user: 'Amit S.', priority: 'Low', status: 'Resolved', lastUpdate: '1d ago', assigned: 'Logistics Team' },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary-500" />
            Support Ticket Terminal
          </h2>
          <p className="text-sm text-admin-text-secondary font-medium mt-1">Manage customer inquiries, order disputes, and clinical clarifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-btn-ghost border border-admin-border h-11 px-6 flex items-center gap-2"><History className="w-4 h-4" /> <span>SLA Reports</span></button>
          <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-500/20 px-8"><Plus className="w-4 h-4" /> <span>Create Ticket</span></button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Unresolved', value: '18', icon: AlertCircle, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Critical Priority', value: '3', icon: Flag, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Avg Resolution', value: '4.2h', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'CSAT Score', value: '4.8', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}><stat.icon className="w-5 h-5" /></div>
            <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-admin-text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1 p-1 bg-white border border-admin-border rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
        {['All', 'Open', 'Pending', 'Critical', 'Resolved'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap uppercase tracking-widest ${filter === f ? 'bg-primary-500 text-white shadow-lg shadow-brand-500/20' : 'text-admin-text-secondary hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TICKET TABLE */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-admin-border bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="relative flex-1 w-full md:max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-secondary" />
             <input type="text" placeholder="Search by ticket ID, subject or user..." className="admin-input pl-10 h-10 text-xs" />
           </div>
           <button className="admin-btn-ghost text-xs border border-admin-border h-10"><Filter className="w-3.5 h-3.5 mr-2" /> Assigned To Me</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border">
                <th className="px-6 py-4">Ticket Info</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-admin-text-primary truncate max-w-[200px]">{ticket.subject}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-primary-600 font-bold uppercase">{ticket.id}</span>
                        <span className="text-[10px] text-admin-text-secondary font-medium">• {ticket.user}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${ticket.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : ticket.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{ticket.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500"><User className="w-3 h-3" /></div>
                       <span className="text-[11px] font-bold text-admin-text-primary">{ticket.assigned}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-admin-text-secondary">
                    {ticket.lastUpdate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-admin-border text-slate-600 shadow-sm"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-primary-500 hover:text-white rounded-xl transition-colors shadow-sm"><MessageSquare className="w-4 h-4" /></button>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-300 group-hover:hidden" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TICKET DETAIL DRAWER */}
      <AnimatePresence>
        {selectedTicket && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTicket(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[110] flex flex-col"
            >
              <div className="p-8 border-b border-admin-border flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-admin-border text-primary-500 rounded-2xl flex items-center justify-center shadow-sm"><FileText className="w-6 h-6" /></div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-admin-text-primary">{selectedTicket.subject}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <StatusBadge status={selectedTicket.status} />
                      <span className="text-[10px] text-admin-text-secondary font-bold uppercase">{selectedTicket.id}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/30">
                 {/* CONVERSATION FLOW */}
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 shrink-0">RS</div>
                       <div className="p-4 bg-white border border-admin-border rounded-2xl rounded-tl-none shadow-sm space-y-2 max-w-[80%]">
                          <p className="text-sm text-admin-text-primary leading-relaxed">My prescription for Order #MED-1024 was rejected. The reason mentioned was 'Incomplete Signature'. I have uploaded a new copy from my doctor. Can you please verify it urgently?</p>
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                             <FileText className="w-4 h-4 text-primary-500" />
                             <span className="text-[10px] font-bold text-admin-text-secondary uppercase">prescription_new_signed.pdf</span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-right">Today, 10:24 AM</p>
                       </div>
                    </div>

                    <div className="flex gap-4 justify-end">
                       <div className="p-4 bg-primary-600 text-white rounded-2xl rounded-tr-none shadow-lg space-y-2 max-w-[80%]">
                          <p className="text-sm leading-relaxed">Hello Rahul, I am Dr. Sameer. I've received the new document. I'm reviewing the signature against the medical council database right now. Will update you in 15 minutes.</p>
                          <p className="text-[9px] text-white/60 font-bold uppercase tracking-widest text-right">Today, 10:35 AM</p>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shrink-0">SK</div>
                    </div>
                 </div>

                 {/* INTERNAL NOTES AREA */}
                 <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
                    <h4 className="text-[10px] font-bold text-amber-900 uppercase tracking-widest flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Internal Administrative Note</h4>
                    <p className="text-[11px] text-amber-800 font-medium">"Note: Customer is a VIP member. High priority resolution required for clinical document verification." — Arjun Gupta</p>
                 </div>
              </div>

              {/* REPLY FOOTER */}
              <div className="p-8 border-t border-admin-border bg-white space-y-4">
                 <div className="relative">
                    <textarea placeholder="Type your clinical response or internal note..." className="admin-input min-h-[120px] p-4 text-sm pb-12 bg-slate-50/50"></textarea>
                    <div className="absolute bottom-4 left-4 flex gap-4">
                       <button className="text-slate-400 hover:text-primary-600"><Paperclip className="w-5 h-5" /></button>
                       <button className="text-slate-400 hover:text-primary-600"><Tag className="w-5 h-5" /></button>
                    </div>
                 </div>
                 <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-3">
                       <button className="px-6 py-3 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all">Internal Note</button>
                       <button className="px-6 py-3 bg-green-50 text-green-600 text-xs font-bold rounded-xl border border-green-100 hover:bg-green-100 transition-all">Mark Resolved</button>
                    </div>
                    <button className="px-10 py-3 bg-primary-500 text-white text-sm font-bold rounded-xl shadow-xl shadow-brand-500/30 hover:bg-primary-600 transition-all flex items-center gap-2">
                       <Send className="w-4 h-4" /> Send Reply
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportTickets;
