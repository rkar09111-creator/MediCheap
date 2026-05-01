import React, { useState, useEffect } from 'react';
import { settingService } from '../../services/api';
import { Link } from 'react-router-dom';
import { 
    Pill, 
    Send,
    Phone,
    Mail,
    ArrowRight,
    Tag,
    ShieldCheck,
    Truck,
    Clock,
    Plus,
    Activity,
    Heart,
    Shield,
    Globe
} from 'lucide-react';
import Logo from '../common/Logo';
import { useSettingsStore } from '../../store/settingsStore';
import { cn } from '../ui';



const Footer = () => {
    const { settings } = useSettingsStore();


    return (
        <footer className="relative bg-neutral-950 text-neutral-400 font-body overflow-hidden">
            {/* 🔝 Design Signal: Forest Green Accent Bar */}
            <div className="h-1.5 w-full bg-brand-primary" />

            {/* 📩 Newsletter Strip */}
            <div className="border-b border-white/5">
                <div className="container-custom py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-bold text-white mb-2">Join the Wellness Circle</h3>
                            <p className="text-neutral-500 text-sm">Get exclusive offers, clinical updates, and health tips delivered to your inbox weekly.</p>
                        </div>
                        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    className="w-full sm:w-80 h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-600/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                            <button className="h-14 px-8 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-brand-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🏛️ Main Footer Grid */}
            <div className="container-custom py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
                    {/* Column 1 — Brand Hub */}
                    <div className="space-y-8">
                        <Logo light />
                        <p className="text-[15px] leading-relaxed text-neutral-500">
                            Transforming healthcare accessibility with genuine clinical solutions. Licensed, trusted, and delivered across India.
                        </p>
                        
                        {/* Trust Badges */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                                <ShieldCheck className="text-brand-primary" size={16} />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">ISO 9001:2015</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                                <ShieldCheck className="text-brand-primary" size={16} />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">FDA Approved</span>
                            </div>
                        </div>

                        {/* Social Row */}
                        <div className="flex gap-3">
                            {[Globe, Activity, Heart, Shield].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-white/5 hover:bg-brand-primary border border-white/10 rounded-xl flex items-center justify-center text-white transition-all duration-300 transform hover:-translate-y-1">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 — Shop Selection */}
                    <div className="space-y-8">
                        <h4 className="text-white font-display font-bold text-lg">Shop Categories</h4>
                        <ul className="space-y-4">
                            {['Chronic Care', 'Fever & Pain', 'Digestive Health', 'Vitamins & Supps', 'Personal Care', 'Homeopathy'].map((link) => (
                                <li key={link}>
                                    <Link to="/shop" className="text-[14px] hover:text-brand-primary transition-colors flex items-center group">
                                        <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full mr-3 group-hover:bg-brand-primary transition-colors" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 — Patient Support */}
                    <div className="space-y-8">
                        <h4 className="text-white font-display font-bold text-lg">Help & Support</h4>
                        <ul className="space-y-4">
                            {['Track Your Order', 'Return Policy', 'Pharmacist Help', 'Shipping Guide', 'Privacy Policy', 'Terms of Use'].map((link) => (
                                <li key={link}>
                                    <Link to="#" className="text-[14px] hover:text-brand-primary transition-colors flex items-center group">
                                        <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full mr-3 group-hover:bg-brand-primary transition-colors" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 — Contact & Emergency */}
                    <div className="space-y-8">
                        <h4 className="text-white font-display font-bold text-lg">Quick Contact</h4>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 bg-brand-600/10 border border-brand-600/20 rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.1em] font-black text-neutral-600 mb-0.5">24/7 Helpline</p>
                                    <p className="text-[15px] text-white font-bold">{settings.support_phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 bg-brand-600/10 border border-brand-600/20 rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.1em] font-black text-neutral-600 mb-0.5">Support Email</p>
                                    <p className="text-[15px] text-white font-bold">{settings.support_email}</p>
                                </div>
                            </div>
                                <div className="pt-2">
                                    <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Support Hours: 24/7</p>
                                </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🏁 Footer Bottom Bar */}
            <div className="bg-neutral-950 border-t border-white/5 py-10">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <p className="text-[13px] text-neutral-600 font-medium">© 2025 MediCheap Healthcare Pvt. Ltd. All rights reserved.</p>
                            <p className="text-[11px] text-neutral-700 mt-1 uppercase tracking-widest font-black">License: {settings.license_number}</p>
                        </div>
                        
                        {/* Payment Hub */}
                        <div className="flex flex-col items-center md:items-end gap-3">
                            <div className="flex items-center gap-5 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="Paypal" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-5" alt="UPI" />
                            </div>
                            <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-[0.2em]">Secure 256-bit SSL Encrypted Payments</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
