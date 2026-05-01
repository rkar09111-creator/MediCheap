import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, Zap, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import '../admin.css';

const FloatCard = ({ icon: Icon, title, subtitle, delay, floatY, color }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0, y: [0, floatY, 0] }}
    transition={{
      opacity: { duration: 0.8, delay },
      x: { duration: 0.8, delay },
      y: { duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }
    }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 w-[240px] shadow-2xl"
  >
    <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400 shrink-0 border border-${color}-500/30`}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <div className="text-white font-bold text-[13px] truncate">{title}</div>
      <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider mt-0.5 truncate">{subtitle}</div>
    </div>
  </motion.div>
);

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email: formData.email, password: formData.password });
    if (result.success) {
      const user = useAuthStore.getState().user;
      if (user?.role !== 'admin') {
        toast.error('Authorized Access Only: Admin credentials required');
        useAuthStore.getState().logout();
        return;
      }
      toast.success('Control Center Initialized', { 
        className: 'bg-brand-green text-white font-bold text-xs rounded-xl shadow-2xl'
      });
      navigate('/admin');
    } else {
      toast.error(result.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex bg-admin-bg selection:bg-brand-green/30">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[45%] bg-[#0C1117] relative overflow-hidden flex-col justify-between p-12 border-r border-white/5">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-brand-green/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/5 blur-[120px] rounded-full" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,200,83,0.4)]">
            <ShieldCheck className="text-white w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-white font-bold text-lg tracking-tight">Medi</span>
              <span className="text-brand-green-lt font-bold text-lg tracking-tight">Cheap</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm">
          <h2 className="text-4xl font-display font-bold text-white leading-tight tracking-tight">
            The future of <span className="text-brand-green-lt">clinical logistics</span> starts here.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed font-medium">
            Access the MediCheap Nerve Center to manage global pharmacy nodes, inventory velocity, and real-time order pipelines.
          </p>
          
          <div className="pt-8 space-y-4">
            <FloatCard icon={Zap} title="0.2ms Sync Latency" subtitle="Real-time Node Status" delay={0.2} floatY={-8} color="green" />
            <FloatCard icon={Shield} title="End-to-End Security" subtitle="AES-256 Data Encryption" delay={0.4} floatY={-12} color="blue" />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span>Build v2.4.0-Stable</span>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span>© {new Date().getFullYear()} MediCheap Neural</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 bg-admin-surface relative">
         {/* Subtle pattern or grid could go here */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }} />

         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] space-y-8 relative z-10"
         >
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl font-display font-bold text-admin-text-primary tracking-tight">Initialize Terminal</h2>
              <p className="text-xs text-admin-text-tertiary font-bold uppercase tracking-widest">Admin Portal • Authorized Personnel Only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider ml-1">Admin Identity</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary group-focus-within:text-brand-green transition-colors">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="admin@medicheap.in"
                    className="admin-input pl-10 h-12 text-sm font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-admin-text-secondary uppercase tracking-wider ml-1">Access Key</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary group-focus-within:text-brand-green transition-colors">
                    <Lock size={16} />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    placeholder="••••••••••••"
                    className="admin-input pl-10 pr-10 h-12 text-sm font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-tertiary hover:text-admin-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                    />
                    <div className="w-4 h-4 border border-admin-border rounded bg-admin-bg peer-checked:bg-brand-green peer-checked:border-brand-green transition-all" />
                    <CheckCircle2 size={10} className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[11px] font-bold text-admin-text-tertiary uppercase tracking-wider group-hover:text-admin-text-secondary transition-colors">Trust Node</span>
                </label>
                <button type="button" className="text-[11px] font-bold text-brand-green hover:underline uppercase tracking-wider">Pass-key Reset?</button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-admin btn-admin-primary w-full h-12 text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-500/20"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Initialize Portal</span>
                    <ArrowRight size={16} />
                  </div>
                )}
              </button>
            </form>

            <div className="p-4 rounded-xl bg-admin-bg border border-admin-border-2 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-white border border-admin-border flex items-center justify-center text-admin-text-tertiary shrink-0">
                <Shield size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-admin-text-primary uppercase tracking-widest">Protocol Notice</p>
                <p className="text-[11px] text-admin-text-tertiary font-medium leading-relaxed mt-1">This terminal is restricted. All telemetry and input logs are archived for audit.</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => {
                // Manual state injection for bypass
                useAuthStore.setState({
                  user: { name: 'Dev Admin', email: 'admin@medicheap.in', role: 'admin' },
                  token: 'dev-bypass-token',
                  isAuthenticated: true
                });
                localStorage.setItem('token', 'dev-bypass-token');
                toast.success('Bypass Protocol Engaged');
                navigate('/admin');
              }}
              className="w-full py-3 border border-dashed border-admin-border hover:border-brand-green/50 hover:bg-brand-green/5 text-[10px] font-black uppercase tracking-[0.2em] text-admin-text-tertiary hover:text-brand-green rounded-xl transition-all"
            >
              Developer Access (Bypass)
            </button>
          </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
