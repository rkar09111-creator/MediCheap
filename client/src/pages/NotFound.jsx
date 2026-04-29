import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto px-4 min-h-[80vh] flex flex-center flex-col items-center justify-center text-center space-y-8 font-sans">
            <div className="relative">
                <div className="text-[10rem] font-sora font-black text-slate-100 leading-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center shadow-premium rotate-12 animate-bounce">
                        <Pill size={40} />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-sora font-black text-text-primary tracking-tighter">Oops! Prescription Lost.</h2>
                <p className="text-text-secondary max-w-sm mx-auto font-medium">We couldn't find the page you're looking for. Maybe it expired or the dose was wrong?</p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" className="h-14 px-8" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} className="mr-2" /> Go Back
                </Button>
                <Button className="h-14 px-8 shadow-premium" onClick={() => navigate('/')}>
                    <Home size={18} className="mr-2" /> Back to Home
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
