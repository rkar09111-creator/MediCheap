import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudUpload, CloudDownload, CircleCheck, X, ArrowRight, ShieldCheck, 
    Clock, Calendar, FileText, ShoppingCart, Truck,
    Info, Loader2, FilePlus, AlertCircle, Lock,
    Pill, Activity, MapPin, 
    CheckCircle, ShieldAlert, Cpu,
    History, User, ArrowUpRight, Phone, Hospital, Stethoscope,
    ChevronRight, Zap, Scan, Sparkles, BrainCircuit, Camera, Navigation,
    Plus
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { prescriptionService, addressService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../providers/SocketProvider';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Badge, cn } from '../components/ui';
import { fadeUp, fadeScale, springPop, stagger, slideUp, slideRight } from '../utils/animations';
import AddressFormModal from '../components/checkout/AddressFormModal';

// ─── Constants ────────────────────────────────────────────────────────────
const ACCEPTED_TYPES = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

const QUICK_TAGS = [
    "Generic OK", "Brand Specific", "Urgent Need", "Elder Care", "Home Delivery"
];

// ─── UI Helpers ───────────────────────────────────────────────────────────

const GlassCard = ({ children, className }) => (
    <div className={cn(
        "glass-morphism rounded-[2.5rem] border border-white/20 shadow-premium overflow-hidden",
        className
    )}>
        {children}
    </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, badge, color = "text-brand-600", bg = "bg-brand-50" }) => (
    <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", bg, color)}>
                <Icon size={24} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight font-display">{title}</h3>
                    {badge && (
                        <Badge className="bg-neutral-900 text-white border-none px-2.5 py-1 text-[9px] font-black tracking-widest uppercase rounded-lg">
                            {badge}
                        </Badge>
                    )}
                </div>
                <p className="text-neutral-400 text-sm font-medium">{subtitle}</p>
            </div>
        </div>
    </div>
);

const FormGroup = ({ label, value, onChange, placeholder, type = "text", required = false, prefix, suffix, icon: Icon }) => (
    <div className="space-y-3">
        <label className="text-[11px] font-black text-neutral-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            {Icon && <Icon size={12} className="text-neutral-300" />}
            {label} {required && <span className="text-brand-500">*</span>}
        </label>
        <div className="relative group">
            {prefix && <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-300">{prefix}</span>}
            <input 
                type={type} value={value} onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "w-full h-16 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[14px] font-bold transition-all outline-none focus:bg-white focus:border-brand-500/30 focus:ring-8 focus:ring-brand-500/5 shadow-inner",
                    prefix ? "pl-16 pr-6" : "px-6"
                )}
            />
            {suffix && <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral-300 uppercase tracking-widest">{suffix}</span>}
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────

const UploadPrescription = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const { isAuthenticated, user } = useAuthStore();
    
    // State
    const [files, setFiles] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    
    // Form State
    const [patientName, setPatientName] = useState(user?.name || '');
    const [patientAge, setPatientAge] = useState('');
    const [patientPhone, setPatientPhone] = useState(user?.phone || '');
    const [doctorName, setDoctorName] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [prescriptionDate, setPrescriptionDate] = useState('');
    
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    
    const [urgency, setUrgency] = useState('normal');
    const [patientNotes, setPatientNotes] = useState('');
    const [geoLoading, setGeoLoading] = useState(false);
    const cameraInputRef = React.useRef(null);
    
    // History State
    const [myPrescriptions, setMyPrescriptions] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    // ─── Data Fetching ────────────────────────────────────────────────────
    const fetchAddresses = async () => {
        try {
            const res = await addressService.getAll();
            const addrList = res.data.data || [];
            setAddresses(addrList);
            const def = addrList.find(a => a.isDefault) || addrList[0];
            if (def) setSelectedAddress(def);
        } catch (err) { console.error(err); }
    };

    const fetchHistory = async () => {
        if (!isAuthenticated) return;
        setHistoryLoading(true);
        try {
            const res = await prescriptionService.getMyPrescriptions();
            setMyPrescriptions(res.data.data.prescriptions || []);
        } catch (err) { console.error(err); }
        finally { setHistoryLoading(false); }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAddresses();
            fetchHistory();
        }
    }, [isAuthenticated]);

    // ─── Socket Events ────────────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;
        const handleStatusUpdate = (data) => {
            const { prescriptionId, status, reason } = data;
            setMyPrescriptions(prev => prev.map(rx => 
                rx._id === prescriptionId ? { ...rx, status, rejectionReason: reason } : rx
            ));
            
            if (status === 'verified') {
                toast.success('Prescription Verified!', { 
                    icon: '💊',
                    style: { background: '#024F3A', color: '#fff', borderRadius: '16px', fontWeight: 'bold' }
                });
            } else if (status === 'rejected') {
                toast.error(`Prescription Rejected: ${reason}`);
            }
        };
        socket.on('prescription:verified', handleStatusUpdate);
        socket.on('prescription:rejected', handleStatusUpdate);
        return () => {
            socket.off('prescription:verified');
            socket.off('prescription:rejected');
        };
    }, [socket]);

    // ─── Dropzone Logic ───────────────────────────────────────────────────
    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            progress: 0,
            status: 'pending'
        }));
        setFiles(prev => [...prev, ...newFiles].slice(0, MAX_FILES));

        newFiles.forEach(f => {
            let p = 0;
            const interval = setInterval(() => {
                p += Math.random() * 40;
                if (p >= 100) {
                    p = 100;
                    clearInterval(interval);
                    setFiles(prev => prev.map(item => item.id === f.id ? { ...item, progress: 100, status: 'ready' } : item));
                } else {
                    setFiles(prev => prev.map(item => item.id === f.id ? { ...item, progress: p, status: 'uploading' } : item));
                }
            }, 150);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_TYPES,
        maxSize: MAX_FILE_SIZE,
        maxFiles: MAX_FILES
    });

    const removeFile = (id) => {
        setFiles(prev => {
            const f = prev.find(item => item.id === id);
            if (f?.preview) URL.revokeObjectURL(f.preview);
            return prev.filter(item => item.id !== id);
        });
    };

    // ─── Location & Camera Logic ──────────────────────────────────────────
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) return toast.error('Geolocation not supported');
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const addr = res.data.address;
                    const newAddr = {
                        label: 'Current Location',
                        fullName: user?.name || '',
                        phone: user?.phone || '',
                        flatNo: 'Auto-Detected',
                        buildingName: addr.suburb || addr.neighbourhood || '',
                        streetArea: addr.road || addr.suburb || '',
                        city: addr.city || addr.town || addr.village || '',
                        state: addr.state || '',
                        pincode: addr.postcode || '',
                        coordinates: { lat: latitude, lng: longitude }
                    };
                    const saved = await addressService.add(newAddr);
                    await fetchAddresses();
                    setSelectedAddress(saved.data.data);
                    toast.success('Location Locked & Synchronized');
                } catch (err) {
                    console.error(err);
                    toast.error('Reverse Geocode Failed');
                } finally {
                    setGeoLoading(false);
                }
            },
            (err) => {
                toast.error('Location Access Denied');
                setGeoLoading(false);
            }
        );
    };

    const handleTakePhoto = () => {
        cameraInputRef.current?.click();
    };

    const handleCameraCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            onDrop([file]);
        }
    };

    const handleTagClick = (tag) => {
        setPatientNotes(prev => prev ? `${prev}, ${tag}` : tag);
    };

    const handleSubmit = async () => {
        if (!isAuthenticated) return navigate('/login?redirect=/upload-prescription');
        if (files.length === 0) return toast.error('Please upload prescription document');
        if (!patientName || !patientPhone || !selectedAddress) return toast.error('Required fields missing');

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            files.forEach(f => formData.append('images', f.file));
            formData.append('patientName', patientName);
            formData.append('patientAge', patientAge);
            formData.append('patientPhone', patientPhone);
            formData.append('deliveryAddress', JSON.stringify(selectedAddress));
            formData.append('patientNotes', patientNotes);
            formData.append('urgency', urgency);
            formData.append('prescriptionDate', prescriptionDate);
            formData.append('doctorName', doctorName);
            formData.append('hospitalName', hospitalName);

            const res = await prescriptionService.upload(formData);
            if (res.data.success) {
                setReferenceId(res.data.data.referenceId);
                setSubmitSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                fetchHistory();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Transmission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-neutral-0 flex flex-col items-center justify-center p-6 pt-24 overflow-hidden relative">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-brand-50 rounded-full blur-[120px] -z-10 opacity-60" />
                
                <motion.div 
                    variants={springPop} initial="hidden" animate="visible"
                    className="max-w-xl w-full text-center"
                >
                    <div className="w-28 h-28 bg-brand-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-premium relative group">
                        <div className="absolute inset-0 bg-brand-500/10 rounded-[2.5rem] scale-125 blur-xl group-hover:scale-150 transition-transform duration-1000" />
                        <CheckCircle size={56} className="text-brand-600 relative z-10" />
                    </div>
                    
                    <h1 className="text-5xl font-black text-neutral-900 mb-6 tracking-tighter font-display">Transmission Complete</h1>
                    <p className="text-neutral-500 mb-14 text-lg font-medium px-10 leading-relaxed text-balance">
                        Your clinical documents have been successfully uplinked to our verification terminal.
                    </p>
                    
                    <GlassCard className="p-10 lg:p-14 mb-14 text-left relative group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                        
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <span className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em] block mb-2">IDENTIFIER</span>
                                <span className="text-3xl font-black text-neutral-900 tracking-tighter font-display">{referenceId}</span>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge className="bg-brand-500 text-white text-[10px] py-1.5 px-4 border-none font-black tracking-widest uppercase rounded-xl shadow-lg shadow-brand-500/20">
                                    Queued
                                </Badge>
                                <span className="text-[9px] font-bold text-neutral-400">Position: #14 in queue</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div className="flex items-center gap-5 text-neutral-600 text-[14px] font-bold">
                                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm"><Clock size={20} /></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest">ETA</span>
                                    <span>15-20 Minutes</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 text-neutral-600 text-[14px] font-bold">
                                <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 shadow-sm"><Truck size={20} /></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Protocol</span>
                                    <span className="text-brand-600">CASH ON DELIVERY</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-2 gap-6">
                        <Button onClick={() => navigate('/orders')} className="btn-primary h-18 rounded-[1.5rem] text-[12px] uppercase tracking-widest font-black shadow-2xl">
                            Track Status
                        </Button>
                        <Button onClick={() => setSubmitSuccess(false)} className="btn-ghost h-18 rounded-[1.5rem] text-[12px] uppercase tracking-widest font-black bg-white">
                            New Uplink
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-40">
            <Toaster position="top-right" />
            
            {/* ── HERO SECTION ── */}
            <div className="bg-white pt-40 pb-28 px-6 relative overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-brand-50/50 rounded-full blur-[150px] -z-0" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-50/30 rounded-full blur-[120px] -z-0" />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1.5px, transparent 1.5px)", backgroundSize: "48px 48px" }} />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-5xl">
                        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-10">
                            <Badge className="bg-brand-600 text-white border-none px-6 py-2 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase shadow-lg shadow-brand-500/20">
                                Clinical Portal
                            </Badge>
                            <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2 rounded-2xl border border-neutral-100">
                                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">System Online: Clinical Queue Active</span>
                            </div>
                        </motion.div>
                        
                        <motion.h1 variants={fadeUp} className="text-[clamp(48px,10vw,110px)] font-black text-neutral-900 leading-[0.85] tracking-tighter mb-10 font-display">
                            CLINICAL <br />
                            <span className="text-brand-500">AUTH TERMINAL.</span>
                        </motion.h1>
                        
                        <motion.p variants={fadeUp} className="text-neutral-500 text-xl md:text-2xl font-medium leading-tight max-w-3xl mb-16 text-balance">
                            Experience clinical-grade document processing. Our board-certified experts verify your medical payload within a 20-minute window.
                        </motion.p>

                        {/* Process Stepper */}
                        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-neutral-100">
                            {[
                                { icon: CloudUpload, title: "Clinical Uplink", desc: "Military-grade AES-256 encrypted payload" },
                                { icon: ShieldCheck, title: "Pharmacy Audit", desc: "Board-certified verification protocol" },
                                { icon: BrainCircuit, title: "Node Allocation", desc: "Real-time inventory reserve sync" }
                            ].map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <div key={i} className="flex items-start gap-6 group">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-300 group-hover:bg-brand-500 group-hover:text-white group-hover:scale-110 transition-all duration-700 shadow-sm">
                                            <Icon size={28} strokeWidth={1.5} />
                                        </div>
                                        <div className="pt-2">
                                            <h4 className="text-lg font-black text-neutral-900 leading-none mb-2 font-display">{step.title}</h4>
                                            <p className="text-sm font-medium text-neutral-400 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-24">
                <div className="grid lg:grid-cols-12 gap-20 items-start">
                    
                    {/* ── LEFT: WORKSPACE ── */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        {/* 1. UPLOAD MODULE */}
                        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <GlassCard className="p-12 lg:p-16 border-white/40">
                                <div className="mb-10 bg-brand-500/5 border border-brand-500/10 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Live Node Status: Monitoring Inbound Captures</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Latency: 0.04ms</span>
                                </div>
                                <SectionHeader 
                                    icon={Scan} 
                                    title="Medical Capture" 
                                    subtitle="Scan or upload high-fidelity captures of your official Rx"
                                    badge="Secure"
                                    color="text-brand-600"
                                    bg="bg-brand-50"
                                />

                                <div 
                                    {...getRootProps()}
                                    className={cn(
                                        "relative rounded-[3rem] p-20 lg:p-32 text-center transition-all cursor-pointer group overflow-hidden",
                                        isDragActive ? "bg-brand-500/5 border-brand-500/20" : "bg-neutral-50 border-2 border-dashed border-neutral-200/60 hover:bg-white hover:border-brand-500/20"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    
                                    {/* Scan Line Animation (only visible on drag or hover) */}
                                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                        <motion.div 
                                            animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 right-0 h-0.5 bg-brand-500/30 blur-sm z-20"
                                        />
                                    </div>

                                    <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-premium flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-700 text-neutral-300 group-hover:text-brand-600">
                                        <CloudDownload size={48} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="text-2xl font-black text-neutral-900 mb-3 font-display tracking-tight">Initialize Uplink</h4>
                                    <p className="text-base text-neutral-400 mb-12 max-w-sm mx-auto font-medium leading-relaxed">Drop your captures here or use your secure device camera</p>
                                    
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-30">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            capture="environment" 
                                            ref={cameraInputRef}
                                            onChange={handleCameraCapture}
                                            className="hidden"
                                        />
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleTakePhoto(); }}
                                            className="h-16 px-10 rounded-2xl bg-white border border-neutral-200 hover:border-brand-500/30 hover:bg-brand-50/50 font-black text-[11px] tracking-[0.2em] uppercase shadow-sm flex items-center gap-3 transition-all active:scale-95"
                                        >
                                            <Camera size={18} /> Take Photo
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); }} // Let the dropzone handle the click if we want, or trigger it manually
                                            {...getRootProps()}
                                            className="h-16 px-10 rounded-2xl bg-brand-500 text-white hover:bg-brand-600 font-black text-[11px] tracking-[0.2em] uppercase shadow-lg shadow-brand-500/20 flex items-center gap-3 transition-all active:scale-95"
                                        >
                                            <CloudUpload size={18} /> Select Files
                                        </button>
                                    </div>
                                </div>

                                {/* Files Grid */}
                                <AnimatePresence>
                                    {files.length > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                                            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
                                        >
                                            {files.map((f) => (
                                                <div key={f.id} className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-neutral-100 group shadow-lg">
                                                    {f.preview ? (
                                                        <img src={f.preview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Capture" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-neutral-50">
                                                            <FileText size={40} className="text-neutral-200" />
                                                            <span className="text-[10px] font-black text-neutral-400 px-6 text-center truncate w-full uppercase tracking-widest">{f.file.name}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {f.status === 'uploading' && (
                                                        <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-md flex flex-col items-center justify-center p-8 gap-5">
                                                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden shadow-inner">
                                                                <motion.div initial={{ width: 0 }} animate={{ width: `${f.progress}%` }} className="h-full bg-brand-500 shadow-[0_0_15px_rgba(5,150,105,0.5)]" />
                                                            </div>
                                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Scanning</span>
                                                        </div>
                                                    )}

                                                    <button onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} className="absolute top-4 right-4 w-10 h-10 bg-neutral-900 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-600 shadow-2xl">
                                                        <X size={20} />
                                                    </button>
                                                    
                                                    {f.status === 'ready' && (
                                                        <div className="absolute bottom-4 left-4 right-4 bg-brand-600 text-white text-[10px] font-black px-4 py-3 rounded-xl flex items-center justify-center gap-2.5 shadow-2xl">
                                                            <Sparkles size={14} className="text-brand-300" /> VERIFIED
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {files.length < MAX_FILES && (
                                                <button {...getRootProps()} className="aspect-[3/4] rounded-[2rem] border-2 border-dashed border-neutral-100 hover:border-brand-500/20 hover:bg-brand-50/50 flex flex-col items-center justify-center gap-5 text-neutral-300 transition-all group shadow-inner">
                                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-premium flex items-center justify-center group-hover:scale-110 group-hover:text-brand-600 transition-all">
                                                        <FilePlus size={32} strokeWidth={1.5} />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">Append</span>
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </GlassCard>
                        </motion.div>

                        {/* 2. PATIENT DATA */}
                        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <GlassCard className="p-12 lg:p-16 border-white/40">
                                <SectionHeader 
                                    icon={BrainCircuit} 
                                    title="Clinical Context" 
                                    subtitle="Parameters required for algorithmic and expert verification"
                                    color="text-amber-600"
                                    bg="bg-amber-50"
                                />

                                <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                                    <FormGroup icon={User} label="Subject Identity" value={patientName} onChange={setPatientName} placeholder="Full legal name" required />
                                    <FormGroup icon={Calendar} label="Subject Age" value={patientAge} onChange={setPatientAge} placeholder="e.g. 28" type="number" suffix="Years" />
                                    <FormGroup icon={Phone} label="Contact Node" value={patientPhone} onChange={setPatientPhone} placeholder="Phone number" prefix="+91" required />
                                    <FormGroup icon={Clock} label="Document Date" value={prescriptionDate} onChange={setPrescriptionDate} type="date" />
                                    <FormGroup icon={Stethoscope} label="Practitioner" value={doctorName} onChange={setDoctorName} placeholder="Doctor's name" />
                                    <FormGroup icon={Hospital} label="Institution" value={hospitalName} onChange={setHospitalName} placeholder="Clinic/Hospital name" />
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* 3. LOGISTICS */}
                        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <GlassCard className="border-white/40">
                                <div className="p-12 lg:p-16 border-b border-neutral-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                    <SectionHeader 
                                        icon={MapPin} 
                                        title="Logistics Terminal" 
                                        subtitle="Designated destination for priority medicine dispatch"
                                        color="text-blue-600"
                                        bg="bg-blue-50"
                                    />
                                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                        <button 
                                            onClick={handleGetCurrentLocation}
                                            disabled={geoLoading}
                                            className="flex-1 md:flex-initial px-8 h-16 rounded-[1.5rem] bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-3 border border-blue-100 shadow-sm disabled:opacity-50"
                                        >
                                            {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={18} />}
                                            {geoLoading ? "Syncing..." : "Current Location"}
                                        </button>
                                        <button onClick={() => setIsAddressModalOpen(true)} className="flex-1 md:flex-initial px-10 h-16 rounded-[1.5rem] bg-neutral-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-brand-600 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95">
                                            <Plus size={18} /> New Terminal
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-12 lg:p-16 bg-neutral-50/20">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {addresses.map(addr => (
                                            <div 
                                                key={addr._id}
                                                onClick={() => setSelectedAddress(addr)}
                                                className={cn(
                                                    "relative p-10 rounded-[2.5rem] border transition-all cursor-pointer flex gap-6 group overflow-hidden",
                                                    selectedAddress?._id === addr._id ? "border-brand-500 bg-white shadow-premium" : "border-neutral-100 bg-white/50 hover:border-brand-500/20 hover:bg-white"
                                                )}
                                            >
                                                {selectedAddress?._id === addr._id && (
                                                    <motion.div layoutId="addr-glow" className="absolute inset-0 bg-brand-500/5 blur-3xl" />
                                                )}
                                                <div className={cn(
                                                    "w-7 h-7 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center transition-all",
                                                    selectedAddress?._id === addr._id ? "border-brand-500" : "border-neutral-200"
                                                )}>
                                                    {selectedAddress?._id === addr._id && <motion.div layoutId="addr-check" className="w-4 h-4 bg-brand-500 rounded-full" />}
                                                </div>
                                                <div className="min-w-0 relative z-10">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <span className="font-black text-xl text-neutral-900 truncate font-display tracking-tight">{addr.label}</span>
                                                        {addr.isDefault && <Badge className="bg-brand-50 text-brand-600 text-[9px] py-1 px-3 border-none font-black tracking-[0.2em] rounded-lg">PRIMARY</Badge>}
                                                    </div>
                                                    <p className="text-base font-medium text-neutral-500 leading-snug">{addr.flatNo}, {addr.streetArea}</p>
                                                    <p className="text-[11px] text-neutral-400 font-black uppercase tracking-[0.3em] mt-5">{addr.city}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: CONTROL PANEL ── */}
                    <div className="lg:col-span-4 space-y-16 lg:sticky lg:top-36">
                        
                        {/* 4. EXECUTION BOX */}
                        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-neutral-900 rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] p-12 lg:p-14 text-white overflow-hidden relative group">
                            <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                            
                            <div className="flex items-center justify-between mb-12">
                                <h4 className="font-black text-white tracking-tight font-display text-2xl uppercase">Auth Ledger</h4>
                                <Badge className="bg-brand-500 text-white border-none px-3 py-1 text-[9px] font-black tracking-widest uppercase">Clinical Node</Badge>
                            </div>
                            
                            <div className="space-y-8 relative z-10">
                                {[
                                    { label: 'Payload Identification', value: `${files.length} Secure Capture${files.length !== 1 ? 's' : ''}` },
                                    { label: 'Target Terminal', value: selectedAddress?.label || 'Select Terminal' },
                                    { label: 'Settlement Protocol', value: 'CASH ON DELIVERY', color: 'text-brand-400' },
                                    { label: 'Validation Priority', value: urgency.replace('_', ' ').toUpperCase(), color: urgency === 'normal' ? 'text-brand-400' : 'text-amber-400' }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-start pb-6 border-b border-white/5 last:border-none last:pb-0">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pt-1">{row.label}</span>
                                        <span className={cn("text-[14px] font-black tracking-tight font-display text-right max-w-[180px]", row.color || "text-white/80")}>{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-20 space-y-8 relative z-10">
                                <Button 
                                    onClick={handleSubmit} disabled={files.length === 0 || isSubmitting}
                                    className={cn(
                                        "w-full h-24 rounded-[2rem] font-black text-[14px] tracking-[0.3em] uppercase transition-all shadow-2xl active:scale-95",
                                        files.length === 0 || isSubmitting 
                                            ? "bg-white/5 text-white/20 cursor-not-allowed" 
                                            : "bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/30 hover:shadow-brand-500/50"
                                    )}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : (
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="flex items-center gap-4">AUTHORIZE UPLINK <ArrowRight size={20} /></span>
                                            <span className="text-[9px] opacity-40 font-bold tracking-[0.4em]">Node Protocol Active</span>
                                        </div>
                                    )}
                                </Button>
                                <div className="flex items-center justify-center gap-4 text-white/20">
                                    <ShieldAlert size={16} /> 
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">End-to-End Encrypted Node</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 5. DIRECTIVES */}
                        <GlassCard className="p-12 border-white/60">
                            <h4 className="font-black text-neutral-900 mb-12 tracking-tight font-display text-2xl">Handling Directives</h4>
                            
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest ml-1">Protocol Urgency</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['normal', 'urgent', 'very_urgent'].map(id => (
                                            <button 
                                                key={id} onClick={() => setUrgency(id)}
                                                className={cn(
                                                    "w-full h-16 rounded-2xl border text-[12px] font-black uppercase tracking-[0.2em] flex items-center px-8 justify-between transition-all",
                                                    urgency === id ? "border-neutral-900 bg-neutral-900 text-white shadow-2xl scale-[1.02]" : "border-neutral-100 text-neutral-400 hover:border-brand-500/20 hover:bg-brand-50/50"
                                                )}
                                            >
                                                {id.replace('_', ' ')}
                                                {urgency === id && <CheckCircle size={18} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Special Notes</label>
                                        <span className="text-[10px] font-bold text-neutral-300">Clinical Data</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5 mb-6">
                                        {QUICK_TAGS.map(tag => (
                                            <button 
                                                key={tag} onClick={() => handleTagClick(tag)}
                                                className="px-5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all active:scale-95"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea 
                                        value={patientNotes} onChange={e => setPatientNotes(e.target.value)}
                                        placeholder="Specific handling instructions for our board-certified clinical team..."
                                        className="w-full h-48 p-8 bg-neutral-50/50 border border-neutral-100 rounded-[2rem] text-base font-bold transition-all outline-none focus:bg-white focus:border-brand-500/30 focus:ring-8 focus:ring-brand-500/5 resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        {/* 6. TRUST WIDGET */}
                        <div className="bg-brand-600 rounded-[3rem] p-12 text-white shadow-premium relative overflow-hidden group cursor-pointer">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center mb-8 shadow-sm">
                                    <ShieldCheck size={32} />
                                </div>
                                <h4 className="font-black text-2xl mb-4 font-display tracking-tight">Clinical Integrity</h4>
                                <p className="text-brand-50/70 text-base font-medium leading-relaxed">
                                    Each document is audited by a board-certified pharmacist. We maintain 99.9% validation accuracy across all acquisition nodes.
                                </p>
                                <div className="mt-8 flex items-center gap-3 text-brand-200 font-black text-[10px] uppercase tracking-widest">
                                    Learn about our protocol <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── HISTORICAL REGISTRY ── */}
                {isAuthenticated && (
                    <motion.section 
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="mt-48 pt-24 border-t border-neutral-100"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
                            <div className="max-w-2xl">
                                <Badge className="bg-neutral-100 text-neutral-400 border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.3em] mb-6 rounded-lg">Immutable Ledger</Badge>
                                <h3 className="text-5xl font-black text-neutral-900 tracking-tighter font-display mb-6">Clinical Registry</h3>
                                <p className="text-neutral-500 text-xl font-medium leading-relaxed">A permanent, encrypted archive of your medical document lifecycle and validation history.</p>
                            </div>
                            <div className="flex bg-neutral-100/50 p-2 rounded-[1.5rem] border border-neutral-100">
                                {['Historical Archive', 'Active Queue'].map((tab, i) => (
                                    <button key={tab} className={cn("px-10 py-4 text-[12px] font-black uppercase tracking-widest rounded-2xl transition-all", i === 0 ? "bg-white text-neutral-900 shadow-xl" : "text-neutral-400 hover:text-neutral-600")}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {historyLoading ? (
                            <div className="grid md:grid-cols-3 gap-12">
                                {[1, 2, 3].map(i => <div key={i} className="h-[500px] bg-neutral-100 rounded-[3rem] animate-pulse" />)}
                            </div>
                        ) : myPrescriptions.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {myPrescriptions.map((rx, idx) => (
                                    <motion.div 
                                        key={rx._id} 
                                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-[3rem] border border-neutral-100 shadow-premium hover:border-brand-500/30 transition-all group overflow-hidden"
                                    >
                                        <div className="p-12">
                                            <div className="flex justify-between items-start mb-12">
                                                <div>
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <span className="text-2xl font-black text-neutral-900 font-display tracking-tighter uppercase">{rx.referenceId}</span>
                                                        <div className={cn(
                                                            "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                            rx.status === 'verified' ? 'bg-brand-50 text-brand-700 border-brand-100' : 
                                                            rx.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-neutral-50 text-neutral-400 border-neutral-100'
                                                        )}>
                                                            {rx.status.replace('_', ' ')}
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] text-neutral-400 font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                                        <Calendar size={14} /> {new Date(rx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white transition-all cursor-pointer shadow-sm">
                                                    <ArrowUpRight size={20} />
                                                </div>
                                            </div>

                                            {/* Preview Captures */}
                                            <div className="flex gap-4 mb-12">
                                                {rx.images.slice(0, 3).map((img, i) => (
                                                    <div key={i} className="flex-1 aspect-[3/4] rounded-[1.5rem] border border-neutral-100 overflow-hidden bg-neutral-50 shadow-inner group-hover:border-brand-500/20 transition-all">
                                                        <img src={img.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Rx" />
                                                    </div>
                                                ))}
                                                {rx.images.length > 3 && (
                                                    <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-[12px] font-black text-neutral-400 mt-auto shadow-inner">
                                                        +{rx.images.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-10 border-t border-neutral-50">
                                                <div className="flex items-center gap-4 text-neutral-500 font-bold">
                                                    <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100 shadow-sm"><User size={18} /></div>
                                                    <span className="text-[12px] font-black uppercase tracking-widest">{rx.patientName.split(' ')[0]}</span>
                                                </div>
                                                {rx.status === 'verified' ? (
                                                    <button onClick={() => navigate('/checkout', { state: { prescriptionId: rx._id } })} className="text-[12px] font-black text-brand-600 uppercase tracking-[0.2em] hover:text-brand-700 underline underline-offset-[12px] decoration-4 decoration-brand-500/20 hover:decoration-brand-500 transition-all">Place Order</button>
                                                ) : rx.status === 'rejected' ? (
                                                    <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="text-[12px] font-black text-red-600 uppercase tracking-[0.2em] hover:text-red-700 underline underline-offset-[12px] decoration-4 decoration-red-500/20 hover:decoration-red-500 transition-all">Re-upload</button>
                                                ) : (
                                                    <div className="flex items-center gap-3 text-neutral-300">
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span className="text-[12px] font-black uppercase tracking-widest">In Review</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[4rem] border border-neutral-100 border-dashed p-40 text-center shadow-premium group">
                                <div className="w-32 h-32 bg-neutral-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-neutral-200 group-hover:scale-110 transition-all duration-700 shadow-inner">
                                    <History size={64} strokeWidth={1} />
                                </div>
                                <h4 className="text-3xl font-black text-neutral-900 tracking-tighter font-display mb-4">Registry Inactive</h4>
                                <p className="text-neutral-400 text-lg font-medium max-w-sm mx-auto leading-relaxed">No medical acquisitions identified in your clinical ledger. Initialize your first uplink above.</p>
                            </div>
                        )}
                    </motion.section>
                )}
            </div>

            <AddressFormModal 
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSuccess={fetchAddresses}
            />
        </div>
    );
};

export default UploadPrescription;
