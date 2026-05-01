import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudUpload, X, ArrowRight, ShieldCheck, 
    Clock, Calendar, FileText, ShoppingCart, Truck,
    Info, Loader2, FilePlus, AlertCircle, Lock,
    Pill, Activity, MapPin, 
    CheckCircle, ShieldAlert, Cpu,
    History, User, ArrowUpRight, Phone, Hospital, Stethoscope,
    ChevronRight, Zap, Scan, Sparkles, BrainCircuit, Camera, Navigation,
    Plus, FolderOpen, Trash2, Eye, ShieldCheck as ShieldIcon,
    Lightbulb, Check
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { prescriptionService, addressService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../providers/SocketProvider';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Card, CardHeader, CardBody, Input, Badge, cn } from '../components/ui';
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
    const cameraInputRef = useRef(null);
    
    // History State
    const [myPrescriptions, setMyPrescriptions] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const [lightboxImage, setLightboxImage] = useState(null);

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
                    style: { background: '#050E17', color: '#fff', borderRadius: '14px', fontWeight: 'bold' }
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
                    toast.success('Location Locked');
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

    const handleSubmit = async () => {
        if (!isAuthenticated) return navigate('/login?redirect=/upload-prescription');
        if (files.length === 0) return toast.error('Please upload prescription document');
        if (!patientName || !patientPhone || !selectedAddress) return toast.error('Required fields missing');

        setIsSubmitting(true);
        const toastId = toast.loading('Synchronizing with medical registry...');

        try {
            const formData = new FormData();
            files.forEach(f => {
                formData.append('images', f.file);
            });
            
            formData.append('patientName', patientName);
            formData.append('patientAge', patientAge);
            formData.append('patientPhone', patientPhone);
            formData.append('doctorName', doctorName);
            formData.append('hospitalName', hospitalName);
            formData.append('prescriptionDate', prescriptionDate);
            formData.append('addressId', selectedAddress._id);
            formData.append('urgency', urgency);
            formData.append('notes', patientNotes);

            const res = await prescriptionService.upload(formData);
            const rx = res.data.data;

            toast.success('Upload Successful', { id: toastId });
            setReferenceId(rx.referenceId);
            
            // Success state replacement
            setSubmitSuccess(true);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-[520px] text-center"
                    >
                        {/* SUCCESS ICON */}
                        <div className="w-[88px] h-[88px] rounded-full bg-conic-to-tr from-[#E5FFF2] to-[#C2FFE0] border-[1.5px] border-[#85FFC1] shadow-[0_0_0_8px_rgba(0,200,83,0.08),0_0_0_16px_rgba(0,200,83,0.04)] mx-auto mb-7 flex items-center justify-center">
                            <motion.svg 
                                width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </motion.svg>
                        </div>

                        <h1 className="font-display font-extrabold text-[30px] text-[#050E17] tracking-[-0.03em] mb-2.5">
                            Prescription Submitted!
                        </h1>
                        <p className="font-body font-normal text-[16px] text-[#6B849D] mb-8">
                            Our clinical pharmacist will review your document and finalize the medicine list shortly.
                        </p>

                        <div className="bg-[#050E17] rounded-[18px] p-6 mb-6">
                            <p className="font-body font-medium text-[11px] text-white/45 uppercase tracking-[0.07em] mb-1.5">Reference ID</p>
                            <h2 className="font-num font-extrabold text-[28px] text-white tracking-[0.06em]">#{referenceId || 'RX-2025-K8M4Q2'}</h2>
                            
                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                                <span className="font-body font-medium text-[13px] text-white/65">Pharmacist will review shortly</span>
                            </div>
                        </div>

                        <div className="bg-[#F4F8FA] border border-[#E4ECF2] rounded-[18px] p-5 mb-8 text-left space-y-4">
                            <div className="flex gap-3">
                                <div className="w-5.5 h-5.5 rounded-full bg-[#00C853] text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</div>
                                <p className="font-body font-normal text-[13px] text-[#344E65]">Verification by licensed pharmacist (15-20 min)</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-5.5 h-5.5 rounded-full bg-[#00C853] text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</div>
                                <p className="font-body font-normal text-[13px] text-[#344E65]">Medicine selection & price confirmation via call/app</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-5.5 h-5.5 rounded-full bg-[#00C853] text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</div>
                                <p className="font-body font-normal text-[13px] text-[#344E65]">Swift doorstep delivery within same day</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <Button size="xl" onClick={() => navigate('/orders')} className="w-full">Track Prescription</Button>
                            <Button size="xl" variant="secondary" onClick={() => navigate('/shop')} className="w-full">Continue Shopping</Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFB] pb-[100px]">
            <Toaster />
            
            <div className="max-w-[1100px] mx-auto px-6 py-8">
                {/* BREADCRUMB */}
                <div className="flex items-center gap-1.5 font-body font-normal text-[12px] text-[#6B849D] mb-5">
                    <Link to="/" className="hover:text-[#344E65] transition-colors">Home</Link>
                    <ChevronRight size={12} className="text-[#96ADBF]" />
                    <span className="text-[#344E65]">Upload Prescription</span>
                </div>

                <div className="grid lg:grid-cols-[1fr_420px] gap-7 items-start">
                    
                    {/* LEFT COLUMN */}
                    <div className="space-y-7">
                        
                        {/* INTRO */}
                        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                            <h1 className="font-display font-extrabold text-[clamp(28px,4vw,40px)] leading-[1.1] text-[#050E17] tracking-[-0.04em] mb-2.5">
                                Upload Your <br /> Prescription
                            </h1>
                            <p className="font-body font-normal text-[15px] text-[#6B849D] leading-[1.68] mb-6">
                                Our licensed pharmacist reviews within 30 minutes and dispatches same day.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {[
                                    { icon: ShieldCheck, label: 'Licensed Pharmacy', color: '#00C853', bg: '#E5FFF2' },
                                    { icon: Lock, label: '256-bit Encrypted', color: '#2563EB', bg: '#EFF6FF' },
                                    { icon: Clock, label: '30 Min Review', color: '#D97706', bg: '#FFFBEB' }
                                ].map((pill, i) => (
                                    <div key={i} className="bg-white border border-[#E4ECF2] rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-[0_1px_2px_rgba(5,14,23,0.04)]">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: pill.bg, color: pill.color }}>
                                            <pill.icon size={12} />
                                        </div>
                                        <span className="font-body font-medium text-[12px] text-[#344E65]">{pill.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* UPLOAD ZONE */}
                        <Card className="rounded-[22px]">
                            <div className="bg-linear-to-br from-[#050E17] to-[#1A2E42] px-[22px] py-[18px] flex items-center justify-between">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-[10px] bg-[#00C853]/15 border border-[#00C853]/20 flex items-center justify-center text-[#00C853]">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-[16px] text-white">Prescription Upload</h3>
                                        <p className="font-body font-normal text-[11px] text-white/45 mt-0.5">Accepted: JPG · PNG · PDF · WEBP · Max 10MB</p>
                                    </div>
                                </div>
                                <div className="bg-[#00C853]/15 border border-[#00C853]/20 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                                    <Lock size={10} className="text-[#00C853]" />
                                    <span className="font-body font-semibold text-[10px] text-[#00C853]">SECURE</span>
                                </div>
                            </div>

                            <CardBody className="p-6">
                                <div 
                                    {...getRootProps()}
                                    className={cn(
                                        "relative rounded-[18px] bg-[#FAFCFD] border-2 border-dashed border-[#E4ECF2] min-h-[220px] transition-all duration-220 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-10 gap-3.5",
                                        isDragActive && "bg-[#E5FFF2] border-[#00C853] scale-[1.01]"
                                    )}
                                >
                                    <input {...getInputProps()} />
                                    
                                    {/* ANIMATED DASHED BORDER */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                        <rect 
                                            x="0" y="0" width="100%" height="100%" rx="18" fill="none" 
                                            stroke={isDragActive ? "#00C853" : "#C4D3DE"} strokeWidth="2" strokeDasharray="8 8"
                                            className={cn(isDragActive || "hover:animate-dash-scroll")}
                                        />
                                    </svg>

                                    <motion.div 
                                        animate={isDragActive ? { y: [0, -12, 0], scale: 1.1 } : { y: [0, -8, 0] }}
                                        transition={{ duration: isDragActive ? 0.4 : 3.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-[60px] h-[60px] flex items-center justify-center"
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-12 bg-white rounded-sm border border-[#E4ECF2] shadow-sm flex flex-col p-1 gap-1">
                                                <div className="h-0.5 w-full bg-[#E4ECF2]" />
                                                <div className="h-0.5 w-2/3 bg-[#E4ECF2]" />
                                                <div className="h-0.5 w-full bg-[#E4ECF2]" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00C853] flex items-center justify-center text-white border-2 border-white">
                                                <CloudUpload size={12} />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <h4 className="font-display font-bold text-[17px] text-[#243B53] text-center">
                                        {isDragActive ? "Drop to sync document" : "Drop files here to upload"}
                                    </h4>
                                    <p className="font-body font-normal text-[13px] text-[#6B849D]">or</p>
                                    
                                    <Button variant="secondary" size="md" fullRadius onClick={(e) => { e.stopPropagation(); }} {...getRootProps()}>
                                        <FolderOpen size={15} className="text-[#00C853] mr-2" />
                                        Choose Files
                                    </Button>

                                    <p className="font-body font-normal text-[11px] text-[#96ADBF] text-center mt-1">Up to 5 files at once</p>
                                </div>

                                {/* UPLOADING LIST */}
                                {files.filter(f => f.status === 'uploading').length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        {files.filter(f => f.status === 'uploading').map(f => (
                                            <div key={f.id} className="flex items-center gap-3 py-3 border-b border-[#F4F8FA] last:border-0">
                                                <div className="w-[38px] h-[38px] rounded-[6px] bg-[#E5FFF2] flex items-center justify-center text-[#00C853]">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-body font-medium text-[13px] text-[#1A2E42] truncate">{f.file.name}</p>
                                                    <p className="font-body font-normal text-[11px] text-[#6B849D]">{(f.file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <div className="w-[100px] text-right">
                                                    <div className="h-1 bg-[#E4ECF2] rounded-full overflow-hidden">
                                                        <motion.div 
                                                            className="h-full bg-[#00C853]"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${f.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-body font-normal text-[11px] text-[#344E65] mt-1 block">{Math.round(f.progress)}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* READY FILES GRID */}
                                {files.filter(f => f.status === 'ready').length > 0 && (
                                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                        {files.filter(f => f.status === 'ready').map((f) => (
                                            <motion.div 
                                                key={f.id} layoutId={f.id}
                                                className="relative aspect-[4/3] rounded-[14px] overflow-hidden shadow-[0_2px_6px_rgba(5,14,23,0.06)] cursor-pointer group"
                                            >
                                                {f.preview ? (
                                                    <img src={f.preview} className="w-full h-full object-cover transition-transform duration-380 group-hover:scale-[1.04]" alt="" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#FFF1F1] flex items-center justify-center">
                                                        <FileText size={32} className="text-[#EF4444]" />
                                                    </div>
                                                )}
                                                
                                                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-220 flex items-end p-2 gap-1.5">
                                                    <div className="w-full flex gap-1.5 backdrop-blur-[8px] bg-white/15 p-1.5 rounded-[6px]">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setLightboxImage(f.preview); }}
                                                            className="flex-1 h-7 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] rounded-sm flex items-center justify-center gap-1"
                                                        >
                                                            <Eye size={10} /> View
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                                                            className="flex-1 h-7 bg-red-500/20 hover:bg-red-500/40 text-red-200 font-bold text-[10px] rounded-sm flex items-center justify-center gap-1"
                                                        >
                                                            <Trash2 size={10} /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="absolute top-2.5 left-2.5 bg-[#00C853] text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                            </motion.div>
                                        ))}
                                        {files.length < MAX_FILES && (
                                            <div 
                                                {...getRootProps()}
                                                className="aspect-[4/3] rounded-[14px] border-2 border-dashed border-[#85FFC1] bg-[#E5FFF2] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#00F57A] transition-colors"
                                            >
                                                <Plus size={24} className="text-[#00F57A]" />
                                                <span className="font-body font-semibold text-[12px] text-[#00C853]">Add More</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* PATIENT DETAILS */}
                        <Card>
                            <CardHeader title="Patient Details" sub="Required for medical records">
                                <Link to="/profile" className="font-body font-normal text-[12px] text-[#00C853] hover:underline">Pre-filled from profile</Link>
                            </CardHeader>
                            <CardBody className="p-5">
                                <div className="grid sm:grid-cols-2 gap-[14px]">
                                    <Input label="Patient Name*" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Enter name" />
                                    <Input label="Age" value={patientAge} onChange={e => setPatientAge(e.target.value)} placeholder="e.g. 28" type="number" />
                                    <Input label="Phone Number*" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} placeholder="98765 43210" prefix="+91" />
                                    <Input label="Prescription Date" value={prescriptionDate} onChange={e => setPrescriptionDate(e.target.value)} type="date" />
                                    <Input label="Doctor Name" value={doctorName} onChange={e => setDoctorName(e.target.value)} placeholder="Dr. Sharma" />
                                    <Input label="Hospital/Clinic" value={hospitalName} onChange={e => setHospitalName(e.target.value)} placeholder="City Hospital" />
                                </div>
                            </CardBody>
                        </Card>

                        {/* DELIVERY ADDRESS */}
                        <Card>
                            <CardHeader title="Deliver To" sub=" medicines will be dispatched here" />
                            <CardBody className="p-5">
                                <div className="space-y-2.5 mb-4">
                                    {addresses.map(addr => (
                                        <div 
                                            key={addr._id} 
                                            onClick={() => setSelectedAddress(addr)}
                                            className={cn(
                                                "border-[1.5px] rounded-[14px] p-3.5 flex gap-3 cursor-pointer transition-all",
                                                selectedAddress?._id === addr._id ? "border-[#00C853] bg-[#E5FFF2]" : "border-[#E4ECF2]"
                                            )}
                                        >
                                            <div className="shrink-0 pt-0.5">
                                                <div className={cn(
                                                    "w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all",
                                                    selectedAddress?._id === addr._id ? "border-[#00C853]" : "border-[#C4D3DE]"
                                                )}>
                                                    {selectedAddress?._id === addr._id && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 rounded-full bg-[#00C853]" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-body font-semibold text-[13px] text-[#0D1B2A]">{addr.label}</span>
                                                    {addr.isDefault && <Badge variant="success" className="text-[8px] h-4">Default</Badge>}
                                                </div>
                                                <p className="font-body font-normal text-[12px] text-[#6B849D] line-clamp-1">{addr.flatNo}, {addr.streetArea}, {addr.city}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="w-full h-11 border-[1.5px] border-dashed border-[#E4ECF2] rounded-full font-body font-semibold text-[13px] text-[#4A6580] hover:border-[#C4D3DE] hover:bg-[#F4F8FA] transition-all"
                                >
                                    + Add New Address
                                </button>
                            </CardBody>
                        </Card>

                        {/* ADDITIONAL INFO */}
                        <Card>
                            <CardHeader title="More Details" sub="Specify medicine urgency and notes" />
                            <CardBody className="p-5">
                                <label className="font-body font-semibold text-[11px] text-[#4A6580] uppercase tracking-[0.07em] mb-2.5 block">Urgency</label>
                                <div className="bg-[#F4F8FA] border border-[#E4ECF2] rounded-full p-[3px] flex gap-1">
                                    {['normal', 'urgent', 'very_urgent'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setUrgency(type)}
                                            className={cn(
                                                "relative flex-1 py-2 text-center rounded-full font-body font-semibold text-[12px] transition-all",
                                                urgency === type ? "bg-white text-[#00C853] shadow-[0_2px_6px_rgba(5,14,23,0.06)]" : "text-[#6B849D] hover:text-[#344E65]"
                                            )}
                                        >
                                            {urgency === type && <motion.div layoutId="urgency-bg" className="absolute inset-0 bg-white rounded-full -z-10" />}
                                            {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-5 space-y-3.5">
                                    <div>
                                        <label className="font-body font-semibold text-[11px] text-[#4A6580] uppercase tracking-[0.07em] mb-1.5 block">Pharmacist Note</label>
                                        <textarea 
                                            value={patientNotes} onChange={e => setPatientNotes(e.target.value)}
                                            placeholder="Example: Only deliver Syrup, skip tablets..."
                                            className="w-full h-[100px] p-3.5 bg-[#F8FAFB] border-[1.5px] border-[#E4ECF2] rounded-[10px] font-body font-normal text-[14px] text-[#0D1B2A] focus:border-[#00C853] focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* SUBMISSION ACTION */}
                        <div className="mt-10">
                            <Button 
                                size="xl" 
                                fullRadius 
                                className={cn(
                                    "w-full h-20 font-display font-black text-xl relative overflow-hidden",
                                    files.length > 0 ? "bg-neutral-900 text-white shadow-elite" : "bg-[#E4ECF2] text-[#96ADBF] border-none shadow-none grayscale"
                                )}
                                disabled={files.length === 0 || isSubmitting}
                                onClick={handleSubmit}
                                loading={isSubmitting}
                            >
                                {files.length === 0 ? "Upload prescription first" : "SUBMIT FOR REVIEW"}
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - STICKY SIDEBAR */}
                    <div className="space-y-3.5 lg:sticky lg:top-[130px]">
                        
                        {/* Sidebar Action Removed */}

                        {/* HOW IT WORKS */}
                        <Card className="p-5 shadow-[0_1px_2px_rgba(5,14,23,0.04)]">
                            <h4 className="font-display font-bold text-[14px] text-[#0D1B2A] mb-4">How it works</h4>
                            <div className="space-y-0.5">
                                {[
                                    { title: 'Upload', desc: 'Upload clear photo of prescription', status: 'active' },
                                    { title: 'Verified', desc: 'Pharmacist reviews in 30 min', status: 'future' },
                                    { title: 'Delivered', desc: 'Medicines delivered same day', status: 'future' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-3.5">
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-7 h-7 rounded-full flex items-center justify-center font-body font-bold text-[11px] border",
                                                step.status === 'done' ? "bg-[#00C853] text-white border-[#00C853]" :
                                                step.status === 'active' ? "bg-white text-[#00C853] border-[#00C853]" :
                                                "bg-white text-[#96ADBF] border-[#E4ECF2]"
                                            )}>
                                                {i + 1}
                                            </div>
                                            {i < 2 && <div className="w-[1.5px] h-8 bg-[#E4ECF2] my-1" />}
                                        </div>
                                        <div className="pt-0.5">
                                            <p className="font-body font-semibold text-[13px] text-[#344E65]">{step.title}</p>
                                            <p className="font-body font-normal text-[12px] text-[#6B849D] mt-0.5">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* TIPS */}
                        <div className="bg-[#F4F8FA] border border-[#E4ECF2] rounded-[18px] p-4.5">
                            <div className="flex items-center gap-2.5 mb-3">
                                <Lightbulb size={16} className="text-[#FFB800]" />
                                <h4 className="font-display font-bold text-[13px] text-[#344E65]">Quick Tips</h4>
                            </div>
                            <ul className="space-y-2.5">
                                {[
                                    "Ensure prescription is clear and legible",
                                    "Include doctor's name and signature",
                                    "Date should not be older than 6 months"
                                ].map((tip, i) => (
                                    <li key={i} className="flex gap-2.5">
                                        <div className="w-4 h-4 rounded-full bg-[#00C853]/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check size={10} className="text-[#00C853]" />
                                        </div>
                                        <span className="font-body font-normal text-[12px] text-[#4A6580]">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* PREVIOUS PRESCRIPTIONS */}
                {isAuthenticated && (
                    <div className="mt-16 border-t border-[#E4ECF2] pt-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-bold text-[20px] text-[#0D1B2A]">Previous Prescriptions</h3>
                            <div className="flex gap-1.5">
                                {['All', 'Pending', 'Verified'].map((tab) => (
                                    <button key={tab} className="px-3 py-1.5 rounded-full font-body font-semibold text-[11px] text-[#4A6580] bg-[#E4ECF2] hover:bg-[#C4D3DE] transition-colors">{tab}</button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3.5">
                            {myPrescriptions.map((rx) => (
                                <Card key={rx._id} className="flex flex-col md:flex-row border-none shadow-[0_1px_4px_rgba(5,14,23,0.06)] hover:shadow-[0_4px_12px_rgba(5,14,23,0.08)] transition-all">
                                    <div className="w-full md:w-[200px] bg-[#FAFCFD] border-r border-[#F4F8FA] p-4 flex items-center justify-center">
                                        <div className="relative h-20 w-16">
                                            <div className="absolute inset-0 bg-white border border-[#E4ECF2] rounded-md shadow-sm rotate-[4deg]" />
                                            <div className="absolute inset-0 bg-white border border-[#E4ECF2] rounded-md shadow-sm -rotate-[2deg] overflow-hidden">
                                                <img src={rx.images?.[0]?.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="" />
                                            </div>
                                            {rx.images.length > 1 && (
                                                <div className="absolute -bottom-1 -right-1 bg-[#00C853] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                                    +{rx.images.length - 1}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 px-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="font-num font-bold text-[14px] text-[#0D1B2A] tracking-wider uppercase">{rx.referenceId}</span>
                                                <p className="font-body font-normal text-[11px] text-[#96ADBF] mt-0.5">{new Date(rx.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <Badge variant={rx.status === 'verified' ? 'success' : rx.status === 'rejected' ? 'danger' : 'info'}>
                                                {rx.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <div className="px-2 py-1 bg-[#F4F8FA] rounded-sm text-[10px] font-medium text-[#6B849D]">Dr. {rx.doctorName || 'General'}</div>
                                            <div className="px-2 py-1 bg-[#F4F8FA] rounded-sm text-[10px] font-medium text-[#6B849D] uppercase">{rx.urgency}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            {rx.status === 'verified' ? (
                                                <Button size="sm" onClick={() => navigate('/checkout', { state: { prescriptionId: rx._id } })}>Place Order</Button>
                                            ) : rx.status === 'rejected' ? (
                                                <Button size="sm" variant="secondary">View Reason</Button>
                                            ) : null}
                                            <Button size="sm" variant="ghost">View Details</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* LIGHTBOX */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-[12px] flex items-center justify-center p-6"
                        onClick={() => setLightboxImage(null)}
                    >
                        <motion.button 
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                            onClick={() => setLightboxImage(null)}
                        >
                            <X size={24} />
                        </motion.button>
                        <motion.img 
                            initial={{ scale: 0.84, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.84, opacity: 0 }}
                            src={lightboxImage} className="max-w-full max-h-full rounded-[14px] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE STICKY SUBMIT */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E4ECF2] p-4 px-6 z-40 pb-safe shadow-[0_-8px_24px_rgba(5,14,23,0.06)]">
                <Button 
                    size="xl" 
                    fullRadius 
                    className={cn(
                        "w-full font-display font-bold text-[16px]",
                        files.length > 0 ? "shimmer-sweep" : "bg-[#E4ECF2] text-[#96ADBF]"
                    )}
                    disabled={files.length === 0 || isSubmitting}
                    onClick={handleSubmit}
                    loading={isSubmitting}
                >
                    {files.length === 0 ? "Upload first" : "Submit Prescription"}
                </Button>
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
