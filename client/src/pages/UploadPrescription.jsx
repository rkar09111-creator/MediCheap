import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, CircleCheck, X, ArrowRight, Phone, MessageSquare,
    Clock, Calendar, Eye, ChevronRight, FileText, ShoppingCart, Truck,
    ShieldCheck, Info, Loader2, FilePlus, AlertCircle, Lock,
    RefreshCw, Pill, Shield, Activity, Fingerprint, Search,
    History, ExternalLink, UserCheck, Zap, Smartphone, Check, 
    HelpCircle, Download, User, Package, ChevronDown, Send, 
    Trash2, UploadCloud, PenLine, Sun, MapPin
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { prescriptionService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Badge, cn } from '../components/ui';
import { fadeUp, fadeScale, springPop, stagger, slideUp } from '../utils/animations';

// ─── Step Card Component ──────────────────────────────────────────────────
const StepCard = ({ number, icon: Icon, title, desc, index }) => (
    <motion.div
        variants={fadeUp}
        whileHover={{ y: -5, boxShadow: '0 10px 32px rgba(0,0,0,0.10)', borderColor: '#BBF7D0' }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="bg-white border border-gray-200 rounded-xl p-7 text-center relative group"
    >
        <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-br from-green-600 to-green-500 text-white font-num font-bold text-lg flex items-center justify-center shadow-[0_4px_14px_rgba(22,163,74,0.35)] mx-auto mb-3.5 absolute -top-6 left-1/2 -translate-x-1/2">
            {number}
        </div>
        <div className="text-green-600 mb-3 flex justify-center mt-2">
            <Icon size={30} strokeWidth={1.5} />
        </div>
        <h4 className="font-head font-bold text-gray-900 text-[16px] mb-2">{title}</h4>
        <p className="font-body text-[13px] text-gray-500 leading-relaxed">{desc}</p>
    </motion.div>
);

// ─── Tip Card Component ───────────────────────────────────────────────────
const TipCard = ({ icon: Icon, title, desc, index }) => (
    <motion.div
        variants={fadeUp}
        whileHover={{ borderColor: '#BBF7D0', y: -3 }}
        className="bg-white border border-gray-200 rounded-md p-4.5 flex gap-3.5 items-start shadow-sm transition-all"
    >
        <div className="w-10 h-10 bg-green-50 rounded-sm flex-shrink-0 flex items-center justify-center text-green-600">
            <Icon size={18} />
        </div>
        <div>
            <h5 className="font-body font-semibold text-[14px] text-gray-900 leading-tight mb-1">{title}</h5>
            <p className="font-body text-[12px] text-gray-500 leading-normal">{desc}</p>
        </div>
    </motion.div>
);

const UploadPrescription = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const { items, setPrescription } = useCartStore();
    
    // Logic States
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [notes, setNotes] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
    const [success, setSuccess] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refId, setRefId] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        if (!isAuthenticated) {
            toast.error('Authentication required.');
            navigate('/login');
            return;
        }
        const f = acceptedFiles[0];
        if (!f) return;
        
        setFile(f);
        setSuccess(false);
        setUploadProgress(0);
        
        // Simulate uploading progress
        setIsUploading(true);
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setUploadProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setIsUploading(false);
            }
        }, 50);

        if (f.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(f);
        } else {
            setPreview(null);
        }
    }, [isAuthenticated, navigate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'], 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024,
    });

    const handleRemove = (e) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        setUploadProgress(0);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!file) return; // Handled by button state
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('prescription', file);
            fd.append('patientInstructions', notes);
            fd.append('phone', phoneNumber);
            const res = await prescriptionService.upload(fd);
            
            if (res.data?.prescription) {
                setPrescription({ 
                    imageUrl: res.data.prescription.imageUrl, 
                    _id: res.data.prescription._id 
                });
                setRefId(`RX-${new Date().getFullYear()}-${res.data.prescription._id.slice(-4).toUpperCase()}`);
            }

            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            toast.error('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen font-body relative overflow-x-hidden" style={{ background: 'linear-gradient(168deg, #F0FDF4 0%, #FAFAFA 45%, #F0FDF4 100%)' }}>
            <Toaster position="top-right" toastOptions={{
                style: { background: 'white', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '14px 18px', fontSize: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
            }} />

            {/* ── HERO HEADER ── */}
            <header className="pt-16 pb-0 px-6 text-center max-w-[640px] mx-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger(0.1)}
                    className="space-y-6"
                >
                    <motion.div 
                        variants={springPop}
                        animate={{ y: [0, -7, 0] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-green-100 to-green-200 shadow-[0_8px_32_rgba(22,163,74,0.22)] flex items-center justify-center mx-auto mb-6"
                    >
                        <FileText size={38} className="text-green-600" />
                    </motion.div>
                    
                    <motion.span variants={fadeUp} className="text-[11px] font-semibold text-green-600 tracking-[0.12em] uppercase">
                        Prescription Upload
                    </motion.span>
                    
                    <motion.h1 variants={fadeUp} className="font-head font-extrabold text-[clamp(26px,4vw,40px)] text-gray-900 leading-tight">
                        Upload Your Prescription
                    </motion.h1>
                    
                    <motion.p variants={fadeUp} className="text-gray-500 text-[16px] leading-[1.7] max-w-[480px] mx-auto">
                        Our licensed pharmacist reviews your prescription within 30 minutes and delivers your medicines same day.
                    </motion.p>
                </motion.div>
            </header>

            {/* ── HOW IT WORKS ── */}
            <section className="py-12 px-6 max-w-[860px] mx-auto">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger(0.13)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 relative"
                >
                    {/* Desktop Connector Arrows */}
                    <div className="hidden md:block absolute top-12 left-1/3 w-1/6 pointer-events-none">
                        <svg className="w-full" height="20" viewBox="0 0 100 20">
                            <path d="M0,10 L100,10" fill="none" stroke="#BBF7D0" strokeWidth="2" strokeDasharray="6 4">
                                <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.5s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>
                    <div className="hidden md:block absolute top-12 right-1/3 w-1/6 pointer-events-none">
                        <svg className="w-full" height="20" viewBox="0 0 100 20">
                            <path d="M0,10 L100,10" fill="none" stroke="#BBF7D0" strokeWidth="2" strokeDasharray="6 4">
                                <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.5s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>

                    <StepCard number="1" icon={Upload} title="Upload Prescription" desc="Take a clear photo or scan your doctor's prescription" />
                    <StepCard number="2" icon={ShieldCheck} title="Pharmacist Reviews" desc="Licensed pharmacist verifies in under 30 minutes" />
                    <StepCard number="3" icon={Truck} title="Medicines Delivered" desc="Same-day doorstep delivery after verification" />
                </motion.div>
            </section>

            {/* ── MAIN INTERACTION CARD ── */}
            <main className="max-w-[660px] mx-auto px-6 pb-12">
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success-state"
                            initial="hidden"
                            animate="visible"
                            variants={fadeScale}
                            className="bg-white rounded-xl overflow-hidden shadow-lg p-10 text-center relative"
                        >
                            {/* Confetti simulation (simplified) */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="absolute w-2 h-2 rounded-full" 
                                        style={{ 
                                            backgroundColor: ['#22C55E', '#FBBF24', '#3B82F6', '#white'][i % 4],
                                            left: `${Math.random() * 100}%`,
                                            top: '-10px',
                                            animation: `confettiFall ${2 + Math.random() * 1.5}s linear forwards`,
                                            animationDelay: `${Math.random() * 0.5}s`
                                        }} 
                                    />
                                ))}
                            </div>

                            <motion.div 
                                variants={springPop}
                                className="w-[100px] h-[100px] bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                            >
                                <svg className="w-12 h-12" viewBox="0 0 24 24">
                                    <motion.path 
                                        d="M20 6L9 17L4 12" 
                                        fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.7, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-green-500" style={{ animationDuration: '1.8s' }} />
                            </motion.div>

                            <h2 className="font-head font-extrabold text-[28px] text-gray-900 mb-2.5">Prescription Received! 🎉</h2>
                            <p className="text-gray-500 text-[16px] mb-6">Our pharmacist will review within 30 minutes.</p>
                            
                            <div className="bg-green-50 border border-green-200 rounded-md p-5 py-6 mb-8 text-center">
                                <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-1">Reference ID</p>
                                <p className="font-num font-bold text-[22px] text-gray-900 mb-3">{refId || 'RX-2024-8821'}</p>
                                <span className="bg-amber-100 text-amber-600 text-[13px] font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                                    ⏳ Status: Under Review
                                </span>
                            </div>

                            <div className="space-y-3">
                                <Button onClick={() => navigate('/orders')} className="w-full h-[54px] bg-gradient-to-br from-green-600 to-green-700 text-white font-bold rounded-md shadow-green">
                                    View My Orders
                                </Button>
                                <Button onClick={() => navigate('/shop')} variant="ghost" className="w-full h-[54px] border border-gray-200 text-gray-700 rounded-md">
                                    Continue Shopping
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-form"
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            className="bg-white rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)]"
                        >
                            {/* TOP ACCENT BAR */}
                            <div 
                                className="h-[5px] bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-[length:200%_100%] animate-[gradientSlide_3s_linear_infinite]"
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #16A34A 0%, #22C55E 50%, #16A34A 100%)'
                                }}
                            />

                            {/* CARD HEADER */}
                            <div className="bg-gradient-to-br from-green-600 to-green-700 p-5 px-7 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={22} className="text-white" />
                                    <span className="font-body font-semibold text-[14px] text-white">Secure & Confidential</span>
                                </div>
                                <div className="bg-white/18 px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1.5 backdrop-blur-sm">
                                    <Lock size={10} /> Encrypted
                                </div>
                            </div>

                            {/* CARD BODY */}
                            <div className="p-8 px-7">
                                <AnimatePresence mode="wait">
                                    {isUploading ? (
                                        <motion.div
                                            key="uploading-state"
                                            initial="hidden" animate="visible" exit="hidden"
                                            variants={fadeScale}
                                            className="text-center py-8"
                                        >
                                            <div className="w-[90px] h-[90px] relative mx-auto mb-5">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="45" cy="45" r="38" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                                                    <motion.circle 
                                                        cx="45" cy="45" r="38" 
                                                        stroke="url(#greenGrad)" strokeWidth="6" fill="none"
                                                        strokeDasharray={238.76}
                                                        strokeDashoffset={238.76 * (1 - uploadProgress / 100)}
                                                        strokeLinecap="round"
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                    <defs>
                                                        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#22C55E" />
                                                            <stop offset="100%" stopColor="#16A34A" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <FileText size={28} className="text-green-600" />
                                                </div>
                                                <motion.div 
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    className="absolute -inset-1.5 rounded-full border-[3px] border-transparent border-t-green-500"
                                                />
                                            </div>
                                            <h3 className="font-head font-semibold text-[17px] text-gray-900">Uploading your prescription...</h3>
                                            <div className="w-full h-2 bg-gray-200 rounded-full mt-4.5 overflow-hidden relative">
                                                <motion.div 
                                                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${uploadProgress}%` }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent bg-[length:200%_100%] animate-[gradientSlide_2s_linear_infinite]" />
                                            </div>
                                            <p className="text-gray-500 text-[13px] mt-2.5">Checking file quality...</p>
                                        </motion.div>
                                    ) : file ? (
                                        <motion.div
                                            key="uploaded-state"
                                            initial="hidden" animate="visible"
                                            variants={springPop}
                                            className="bg-green-50 border border-green-200 rounded-md p-4.5 flex gap-3.5 items-start relative group"
                                        >
                                            <div 
                                                className="w-[88px] h-[88px] rounded-sm overflow-hidden border-2 border-green-200 shadow-md bg-white flex-shrink-0 cursor-pointer group-hover:scale-[1.06] transition-transform duration-300"
                                                onClick={() => setShowLightbox(true)}
                                            >
                                                {preview ? (
                                                    <img src={preview} alt="Prescription" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-green-600">
                                                        <FileText size={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-body font-semibold text-[15px] text-gray-900 truncate max-w-[200px]">{file.name}</p>
                                                <p className="text-gray-500 text-[12px] font-normal">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                <p className="text-green-600 text-[12px] font-medium mt-0.5">✅ Uploaded successfully</p>
                                                
                                                <div className="flex gap-4 mt-2.5">
                                                    <button onClick={() => setShowLightbox(true)} className="text-blue-500 font-semibold text-[13px] hover:underline">🔍 View Full Image</button>
                                                    <button onClick={handleRemove} className="text-red-500 font-semibold text-[13px] hover:underline">🗑️ Remove</button>
                                                </div>
                                            </div>
                                            <motion.div 
                                                initial={{ scale: 0 }} animate={{ scale: 1.2 }}
                                                transition={{ type: 'spring', delay: 0.3 }}
                                                className="w-[30px] h-[30px] bg-green-600 rounded-full flex items-center justify-center flex-shrink-0"
                                            >
                                                <Check size={16} className="text-white" />
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <div 
                                            {...getRootProps()}
                                            className={cn(
                                                "relative rounded-lg border-[2.5px] border-dashed border-green-200 bg-green-50 p-13 text-center cursor-pointer transition-all duration-300 group overflow-hidden",
                                                isDragActive && "border-green-600 bg-green-100"
                                            )}
                                        >
                                            {/* Animated SVG Border for Hover/Drag */}
                                            {(isDragActive) && (
                                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                    <motion.rect 
                                                        x="1.25" y="1.25" width="calc(100% - 2.5px)" height="calc(100% - 2.5px)"
                                                        rx="14" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeDasharray="8 6"
                                                        animate={{ strokeDashoffset: [0, -28] }}
                                                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                                    />
                                                </svg>
                                            )}

                                            <motion.div
                                                animate={{ y: [0, -7, 0] }}
                                                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                                                className="text-green-600 flex justify-center"
                                            >
                                                <UploadCloud size={58} strokeWidth={1.2} />
                                            </motion.div>
                                            
                                            <h3 className="font-head font-bold text-[19px] text-gray-900 mt-4.5 mb-1.5">Drop your prescription here</h3>
                                            <p className="text-gray-400 text-[13px]">— or —</p>
                                            <motion.button 
                                                whileHover={{ scale: 1.04, y: -1 }}
                                                whileTap={{ scale: 0.96 }}
                                                className="mt-2.5 bg-gradient-to-br from-green-600 to-green-700 text-white font-semibold text-[15px] px-7 py-2.5 rounded-full shadow-green"
                                            >
                                                Browse Files
                                            </motion.button>
                                            <p className="text-gray-400 text-[12px] mt-4.5">JPG, PNG, PDF accepted  •  Max size 10MB</p>
                                        </div>
                                    )}
                                </AnimatePresence>

                                {/* NOTES AREA */}
                                <div className="mt-6">
                                    <label className="block font-body font-semibold text-[14px] text-gray-700 mb-2">Notes for Pharmacist (optional)</label>
                                    <textarea 
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="E.g. please check for generic alternative, need urgently by evening, patient is elderly..."
                                        className="w-full min-h-[88px] border-[1.5px] border-gray-200 rounded-md p-3.5 px-4 font-body text-[15px] text-gray-900 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 outline-none transition-all resize-y"
                                    />
                                </div>

                                {/* CONTACT FIELDS */}
                                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    <div className="relative">
                                        <Smartphone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="Your Phone Number"
                                            className="w-full h-12 pl-10.5 pr-4 border-[1.5px] border-gray-200 rounded-md font-body text-[15px] focus:border-green-600 focus:ring-4 focus:ring-green-600/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select 
                                            className="w-full h-12 pl-10.5 pr-4 border-[1.5px] border-gray-200 rounded-md font-body text-[15px] focus:border-green-600 focus:ring-4 focus:ring-green-600/10 outline-none transition-all appearance-none"
                                        >
                                            <option>Current Location</option>
                                            <option>Add New Address</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="mt-6.5">
                                    {!file ? (
                                        <motion.button 
                                            whileTap={{ x: [0, -9, 9, -5, 5, 0] }}
                                            className="w-full h-[54px] rounded-md bg-gray-200 text-gray-400 font-head font-semibold text-[16px] flex items-center justify-center gap-2.5 cursor-not-allowed"
                                        >
                                            <Upload size={18} /> Upload Prescription First
                                        </motion.button>
                                    ) : (
                                        <motion.button 
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02, y: -2, boxShadow: '0 10px 36px rgba(22,163,74,0.40)' }}
                                            whileTap={{ scale: 0.97, y: 0 }}
                                            className={cn(
                                                "w-full h-[54px] rounded-md bg-gradient-to-br from-green-600 to-green-700 text-white font-head font-semibold text-[16px] flex items-center justify-center gap-2.5 shadow-green transition-all",
                                                isSubmitting && "bg-green-700 cursor-wait"
                                            )}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={18} /> Submit Prescription & Place Order
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── PRESCRIPTION TIPS ── */}
            <section className="max-w-[660px] mx-auto px-6 pb-20">
                <h3 className="font-head font-bold text-[20px] text-gray-900 text-center mb-6">Tips for a Valid Prescription</h3>
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger(0.1)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3.5"
                >
                    <TipCard icon={PenLine} title="Doctor's Signature" desc="Name, signature, and registration number must be clearly visible" />
                    <TipCard icon={Calendar} title="Valid Prescription" desc="Must not be older than 6 months from prescription date" />
                    <TipCard icon={Sun} title="Clear & Readable" desc="Good lighting, all text visible, no blur or shadows on image" />
                    <TipCard icon={User} title="Patient Name Matches" desc="Name on prescription must match your MediCheap account name" />
                </motion.div>
            </section>

            {/* ── LIGHTBOX ── */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/88 backdrop-blur-md flex items-center justify-center p-6"
                        onClick={() => setShowLightbox(false)}
                    >
                        <motion.button 
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.20)' }} whileTap={{ scale: 0.92 }}
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/12 backdrop-blur-sm flex items-center justify-center text-white"
                        >
                            <X size={20} />
                        </motion.button>
                        <motion.div 
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                            className="max-w-[min(90vw,700px)] max-h-[88vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={preview} alt="Full Prescription" className="w-full h-full object-contain rounded-md" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Extra Styles for Animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes confettiFall {
                    0%   { transform: translateY(-10px) rotate(0deg); opacity:1 }
                    100% { transform: translateY(100vh) rotate(720deg); opacity:0 }
                }
                @keyframes gradientSlide {
                    0%   { background-position: 0% 0% }
                    100% { background-position: 200% 0% }
                }
            `}} />
        </div>
    );
};

export default UploadPrescription;
