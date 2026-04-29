import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Pill, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Card, cn } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(formData);
        if (result.success) {
            toast.success('Welcome back to MediCheap!');
            const user = useAuthStore.getState().user;
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'rider') navigate('/rider');
            else navigate('/');
        } else {
            toast.error(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto px-4 min-h-[calc(100vh-100px)] flex items-center justify-center py-20 font-sans">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
            
            <Card className="w-full max-w-md p-10 shadow-premium border-0 animate-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center mb-10 space-y-4">
                    <div className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-lg transform rotate-12">
                        <Pill size={32} />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-sora font-black text-text-primary tracking-tighter leading-none">Welcome Back</h1>
                        <p className="text-text-secondary font-medium text-lg pt-1">Log in to manage your health & orders</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 h-16 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-base transition-all outline-none"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-12 h-16 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-base transition-all outline-none"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-primary focus:ring-primary cursor-pointer" />
                           <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
                        </label>
                        <Link className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                    </div>

                    <Button type="submit" loading={isLoading} className="w-full h-16 text-lg rounded-2xl shadow-premium hover:shadow-[0_20px_40px_-15px_rgba(5,150,105,0.3)] transition-all">
                        Login to Account <ArrowRight size={20} className="ml-2" />
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-sm font-medium text-text-secondary">
                        Don't have an account? <Link to="/register" className="text-primary font-black hover:underline underline-offset-4">Sign up for free</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
