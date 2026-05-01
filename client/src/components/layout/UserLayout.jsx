import React from 'react';
import { Outlet, Navigate, useLocation, NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FileText, RefreshCw } from 'lucide-react';
import UserSidebar from './UserSidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../ui';

const UserLayout = () => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

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
            <div className="flex" style={{ paddingTop: 'var(--navbar-height)' }}>
                <div className="hidden lg:block transition-all duration-300 ease-in-out">
                    <UserSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                </div>
                <main className="flex-1 bg-neutral-50/50 min-h-[calc(100vh-var(--navbar-height))] overflow-hidden">
                    {/* 📱 Mobile Sub-Nav */}
                    <div className="lg:hidden bg-white border-b border-neutral-100 sticky top-0 z-30 px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
                        {[
                            { name: 'Dashboard', path: '/profile', icon: LayoutDashboard },
                            { name: 'Orders', path: '/orders', icon: ShoppingBag },
                            { name: 'Health', path: '/health-vault', icon: FileText },
                            { name: 'Refills', path: '/subscriptions', icon: RefreshCw },
                        ].map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                                    isActive ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-400 hover:bg-neutral-50"
                                )}
                            >
                                <item.icon size={14} />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

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
