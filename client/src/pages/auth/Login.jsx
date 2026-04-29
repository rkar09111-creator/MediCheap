import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Pill, Tag } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui';

const Logo = () => (
  <div className="flex items-center gap-2 group cursor-pointer justify-center">
    <div className="relative">
        <Pill className="text-primary-500 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" size={32} strokeWidth={2.5} />
        <Tag className="absolute -bottom-1 -right-1 text-accent-500 bg-white rounded-full p-0.5 shadow-sm" size={16} strokeWidth={3} />
    </div>
    <div className="flex items-baseline font-display text-3xl tracking-tighter">
        <span className="font-extrabold text-neutral-900">Medi</span>
        <span className="font-extrabold text-primary-500">Cheap</span>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      toast.success(`Welcome back!`);
      
      const user = useAuthStore.getState().user;
      const role = user?.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'rider') navigate('/rider');
      else navigate('/');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10 space-y-6">
          <Link to="/">
            <Logo />
          </Link>
          <div className="space-y-2">
              <h1 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">Access Your Vault</h1>
              <p className="text-neutral-500 font-medium">Manage your clinical orders and health profile</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 shadow-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all font-medium text-neutral-900" 
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400">Password</label>
                  <a href="#" className="text-[11px] font-bold text-primary-500 uppercase tracking-widest hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all font-medium text-neutral-900" 
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-primary-500 hover:bg-primary-700 text-white rounded-xl font-bold text-base shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? (
                  <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                  </div>
              ) : (
                <>
                  <span>Sign In to Vault</span>
                  <ArrowRight size={20} />
                </>
              )}
            </Button>

            <div className="pt-6 border-t border-neutral-50 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-success">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[2px]">E2E Clinical Encryption Enabled</span>
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                Don't have an account? {' '}
                <Link to="/register" className="text-primary-500 font-bold hover:underline">
                  Join Now
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-8 flex justify-center gap-8 opacity-40">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">ISO 27001 Certified</span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">HIPAA Compliant</span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Govt. Verified</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
