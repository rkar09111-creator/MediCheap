import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../constants';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = API_URL;

const useUserSocket = (onOrderUpdate) => {
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const socket = io(SOCKET_URL, {
            query: { userId: user._id }
        });

        socket.on('connect', () => {
            console.log('Connected to User Socket Hub');
            socket.emit('join:user', user._id);
        });

        socket.on('order:status-update', (data) => {
            // data: { orderId, status, message }
            toast((t) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-900">Order Update</p>
                        <p className="text-[10px] text-neutral-500 font-medium">{data.message || `Order #${data.orderId.slice(-6).toUpperCase()} is now ${data.status}`}</p>
                    </div>
                </div>
            ), { duration: 6000 });
            
            if (onOrderUpdate) onOrderUpdate(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [user, isAuthenticated, onOrderUpdate]);
};

export default useUserSocket;
