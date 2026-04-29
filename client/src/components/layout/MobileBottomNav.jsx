import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    Home, 
    ShoppingBag, 
    FileText, 
    Package, 
    User,
    Pill
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../ui';

const MobileBottomNav = () => {
    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Shop', path: '/shop', icon: ShoppingBag },
        { name: 'Upload Rx', path: '/upload-prescription', icon: Pill },
        { name: 'Orders', path: '/orders', icon: Package },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-neutral-200 z-[90] pb-safe">
            <nav className="h-full flex items-center justify-around px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "relative flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-all duration-300",
                            isActive ? "text-primary-500" : "text-neutral-400"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={cn(
                                    "text-[10px] font-bold transition-all",
                                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 h-0 overflow-hidden"
                                )}>
                                    {item.name}
                                </span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="bottomNav"
                                        className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-full"
                                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default MobileBottomNav;
