import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Pill, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Button, Card, cn } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const passwordStrength = () => {
        if (!formData.password) return 0;
        let score = 0;
        if (formData.password.length > 6) score += 25;
        if (/[A-Z]/.test(formData.password)) score += 25;
        if (/[0-9]/.test(formData.password)) score += 25;
        if (/[^A-Za-z0-9]/.test(formData.password)) score += 25;
        return score;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        
        setIsLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
        });

        if (result.success) {
            toast.success('Account created! Welcome to MediCheap');
            navigate('/');
        } else {
            toast.error(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto px-4 min-h-screen flex items-center justify-center py-20 font-sans">
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-accent/5 to-transparent -z-10 rotate-180"></div>
            
            <Card className="w-full max-w-xl p-10 lg:p-14 shadow-premium border-0 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col items-center text-center mb-10 space-y-4">
                    <div className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-lg -rotate-12">
                        <User size={32} />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-sora font-black text-text-primary tracking-tighter leading-none">Create Account</h1>
                        <p className="text-text-secondary font-medium text-lg pt-1">Join MediCheap for fast doorstep medicine delivery</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="text" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-4 h-16 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-base transition-all outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="tel" required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-12 pr-4 h-16 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-base transition-all outline-none"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="email" required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-12 pr-4 h-16 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-base transition-all outline-none"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type={showPassword ? 'text' : 'password'} required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 h-16 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-base transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input 
                                    type="password" required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-12 pr-4 h-16 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-base transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Strength */}
                    <div className="space-y-2 px-1">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-secondary">
                            <span>Password Strength</span>
                            <span>{passwordStrength() === 100 ? 'Strong' : 'Weak'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full transition-all duration-500",
                                    passwordStrength() < 50 ? "bg-danger" : passwordStrength() < 100 ? "bg-warning" : "bg-primary"
                                )}
                                style={{ width: `${passwordStrength()}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 px-1 pt-2">
                        <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-200 text-primary focus:ring-primary" />
                        <span className="text-xs font-bold text-text-secondary leading-relaxed">
                            I agree to the <Link className="text-primary hover:underline">Terms of Service</Link> and <Link className="text-primary hover:underline">Privacy Policy</Link>.
                        </span>
                    </div>

                    <Button type="submit" loading={isLoading} className="w-full h-16 text-lg rounded-2xl shadow-premium hover:shadow-[0_20px_40px_-15px_rgba(5,150,105,0.3)] transition-all btn-primary">
                        Create Account <ArrowRight size={20} className="ml-2" />
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-sm font-medium text-text-secondary">
                        Already have an account? <Link to="/login" className="text-primary font-black hover:underline underline-offset-4">Log in here</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;
