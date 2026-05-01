import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Search, 
  Filter, 
  User, 
  Clock, 
  Database, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  ShieldAlert, 
  Download, 
  Calendar,
  ArrowRight,
  RefreshCw,
  Eye,
  Info,
  Smartphone,
  Globe,
  Lock,
  ChevronDown
} from 'lucide-react';

const ActionBadge = ({ action }) => {
  const styles = {
    create: 'bg-brand-50 text-brand-primary border-brand-100',
    update: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    delete: 'bg-rose-100 text-rose-600 border-rose-200 animate-pulse font-black shadow-sm', // High Severity
    login: 'bg-green-50 text-green-600 border-green-100',
    security: 'bg-amber-100 text-amber-700 border-amber-200 font-black', // Security Concern
  };
  
  return (
    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit ${styles[action.toLowerCase()] || styles.update}`}>
      {action === 'delete' && <Trash2 size={10} />}
      {action === 'security' && <ShieldAlert size={10} />}
      {action}
    </span>
  );
};

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  // In a real production environment, we would fetch logs from a dedicated audit endpoint.
  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminService.getAuditLogs({ page, action: filter });
      setLogs(data.data.logs);
    } catch (error) {
      console.error('Audit trail transmission failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-admin-text-primary flex items-center gap-3">
            <Activity className="w-6 h-6 text-brand-primary" />
            Global Audit Trail.
          </h2>
          <p className="text-sm text-brand-primary font-bold mt-1">Immutable forensic log of all administrative actions and system events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-btn-ghost border border-admin-border flex items-center gap-2 h-11 hover:text-brand-primary hover:border-brand-primary transition-all"><Calendar className="w-4 h-4" /> <span>Last 24 Hours</span> <ChevronDown className="w-4 h-4" /></button>
          <button className="admin-btn-primary flex items-center gap-2 h-11 shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"><Download className="w-4 h-4" /> <span>Export Audit Log</span></button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Events', value: '4,284', icon: Database, color: 'text-neutral-400', bg: 'bg-neutral-50' },
          { label: 'Critical Changes', value: '18', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'Admin Logins', value: '142', icon: Lock, color: 'text-brand-primary', bg: 'bg-brand-50' },
          { label: 'System Tasks', value: '842', icon: RefreshCw, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="admin-card p-5 group hover:border-brand-primary transition-all">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-all`}><stat.icon className="w-5 h-5" /></div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest group-hover:text-brand-primary transition-colors">{stat.label}</p>
            <h3 className="text-2xl font-black text-neutral-900 mt-1 group-hover:text-brand-primary transition-colors tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1 p-1 bg-white border border-admin-border rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
        {['All', 'Creation', 'Updates', 'Deletions', 'Security', 'Login'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-[11px] font-black rounded-xl transition-all whitespace-nowrap uppercase tracking-widest ${filter === f ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-neutral-400 hover:text-brand-primary'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ACTIVITY TABLE */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-admin-border bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="relative flex-1 w-full md:max-w-sm group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-brand-primary transition-colors" />
             <input type="text" placeholder="Search by admin, target or detail..." className="admin-input pl-10 h-10 text-[10px] font-black uppercase tracking-widest focus:ring-brand-primary/20 transition-all" />
           </div>
           <div className="flex items-center gap-3">
             <button className="admin-btn-ghost text-[10px] font-black uppercase tracking-widest border border-admin-border h-10 hover:text-brand-primary hover:border-brand-primary transition-all"><Filter className="w-3.5 h-3.5 mr-2" /> Admin Role</button>
             <button className="admin-btn-ghost text-[10px] font-black uppercase tracking-widest border border-admin-border h-10 hover:text-brand-primary hover:border-brand-primary transition-all"><RefreshCw className="w-3.5 h-3.5" /></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-admin-border">
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity & Target</th>
                <th className="px-6 py-4">Event Context</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log._id} className="hover:bg-brand-50/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center font-black text-[10px]">{log.admin?.name?.split(' ').map(n=>n[0]).join('') || 'A'}</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-neutral-900 group-hover:text-brand-primary transition-colors tracking-tight">{log.admin?.name || 'Unknown'}</span>
                        <span className="text-[9px] text-brand-primary font-black uppercase tracking-widest">{log.admin?.role || 'Admin'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-neutral-900 group-hover:text-brand-primary transition-colors tracking-tight">{log.target}</span>
                      <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{log.entity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 group-hover:text-brand-primary transition-colors" /> <span className="text-[10px] font-black font-mono">{log.ip}</span></div>
                      <div className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 group-hover:text-brand-primary transition-colors" /> <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[100px]">{log.device?.split(' ')[0]}</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-brand-primary" /> {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-brand-primary text-neutral-300 hover:text-brand-primary transition-all" title="View Payload" onClick={() => console.log(log.details)}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
 : !loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-primary/20">
                        <Database size={32} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-neutral-900 tracking-tight">System Ledger Clear.</h4>
                        <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">No forensic records detected in the current mission window.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYLOAD PREVIEW (MOCK) */}
      <div className="admin-card p-6 bg-slate-900 border-none shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Database className="w-32 h-32 text-white" /></div>
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
          <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Detailed Event Payload: LOG-401</h4>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">JSON View</span>
        </div>
        <pre className="text-[11px] font-mono text-white/80 leading-relaxed overflow-x-auto no-scrollbar">
          {JSON.stringify({
            event_id: "LOG-401",
            timestamp: "2024-04-22T10:30:00Z",
            actor: { id: "ADM-001", name: "Arjun Admin", role: "Super_Admin" },
            action: "PATCH_MEDICINE_PRICE",
            target: { id: "MED-552", name: "Paracetamol 500mg" },
            changes: { old_price: 40, new_price: 45, diff: "+12.5%" },
            metadata: { ip: "192.168.1.1", origin: "Admin_Dashboard_v2.4" }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ActivityLog;
