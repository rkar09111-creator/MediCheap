import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import { useAuthStore } from '../../store/authStore';

const UserLayout = () => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-[80px] flex">
                <div className="hidden lg:block">
                    <UserSidebar />
                </div>
                <main className="flex-1 bg-neutral-50/50 min-h-[calc(100vh-80px)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <Outlet />
                    </div>
                </main>
            </div>
            <MobileBottomNav />
            <Footer />
        </div>
    );
};

export default UserLayout;
