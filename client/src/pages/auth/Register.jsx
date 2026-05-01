import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Mail, 
    Lock, 
    User, 
    Phone, 
    Pill, 
    ArrowRight, 
    CheckCircle2, 
    ShieldCheck, 
    Tag,
    Star
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui';

const Logo = ({ light }) => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="relative">
        <Pill className={light ? "text-white" : "text-primary-500"} size={32} strokeWidth={2.5} />
        <Tag className="absolute -bottom-1 -right-1 text-accent-500 bg-white rounded-full p-0.5 shadow-sm" size={16} strokeWidth={3} />
    </div>
    <div className="flex items-baseline font-display text-3xl tracking-tighter">
        <span className={light ? "font-extrabold text-white" : "font-extrabold text-neutral-900"}>Medi</span>
        <span className="font-extrabold text-primary-500">Cheap</span>
    </div>
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user'
  });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clinical Validation Layer
    if (formData.name.trim().length < 3) {
      return toast.error('Name must be at least 3 characters for clinical identification.');
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return toast.error('Please enter a valid 10-digit mobile number.');
    }

    if (formData.password.length < 8) {
      return toast.error('Security Protocol: Password must be at least 8 characters.');
    }

    const result = await register({ ...formData, phone: cleanPhone });
    if (result.success) {
      toast.success('Clinical Access Granted: Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-body">
      <div className="flex w-full min-h-screen">
        {/* Left Side: Institutional Trust & Branding */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-neutral-950 p-16 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10">
                <Link to="/">
                    <Logo light />
                </Link>
                
                <div className="mt-24 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-5xl font-display font-extrabold text-white leading-tight tracking-tight">
                            Your health, <br />
                            <span className="text-primary-500">Our priority.</span>
                        </h2>
                        <p className="text-neutral-400 text-lg mt-6 max-w-md leading-relaxed">
                            Join over 50,000 patients who trust MediCheap for genuine medicines at honest prices.
                        </p>
                    </motion.div>

                    <div className="space-y-6 pt-10">
                        {[
                            { title: "WHO-GMP Verified", desc: "Every product is sourced from certified manufacturers." },
                            { title: "E2E Encryption", desc: "Your clinical data is protected with military-grade security." },
                            { title: "Same Day Delivery", desc: "Speed and care, delivered to your doorstep." }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center text-primary-500 shrink-0">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide uppercase">{item.title}</h4>
                                    <p className="text-neutral-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-neutral-950 bg-neutral-800 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="" />
                        </div>
                    ))}
                </div>
                <div>
                    <div className="flex text-accent-500 gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                    </div>
                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mt-1">4.8/5 Rating by Customers</p>
                </div>
            </div>
        </div>

        {/* Right Side: Clinical Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-10"
            >
                <div className="lg:hidden text-center mb-10">
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>

                <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-4xl font-display font-extrabold text-neutral-900 tracking-tight">Create Account</h1>
                    <p className="text-neutral-500 font-medium">Join our clinical network for honest medicine prices.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-12 pr-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all font-medium text-neutral-900" 
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input 
                                    type="tel" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-12 pr-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all font-medium text-neutral-900" 
                                    placeholder="+91 00000 00000"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 ml-1">Clinical Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-14 pl-12 pr-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all font-medium text-neutral-900" 
                                placeholder="name@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[2px] text-neutral-400 ml-1">Secure Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full h-14 pl-12 pr-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all font-medium text-neutral-900" 
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-14 bg-primary-500 hover:bg-primary-700 text-white rounded-xl font-bold text-base shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        {isLoading ? 'Initializing Account...' : (
                            <>
                                <span>Create My Account</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </Button>

                    <div className="pt-6 border-t border-neutral-50 flex flex-col items-center gap-4">
                        <p className="text-sm text-neutral-500 font-medium">
                            Already have an account? {' '}
                            <Link to="/login" className="text-primary-500 font-bold hover:underline">
                                Login Access
                            </Link>
                        </p>
                    </div>
                </form>

                <p className="text-[10px] text-neutral-400 text-center leading-relaxed max-w-xs mx-auto">
                    By clicking "Create My Account", you agree to our Terms of Service and Privacy Policy. All your data is securely encrypted.
                </p>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
