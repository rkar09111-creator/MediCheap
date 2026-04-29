import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const socket = io(socketUrl);
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to socket server');
        
        // Join appropriate rooms
        if (user.role === 'admin') {
          socket.emit('join:admin');
        }
        socket.emit('join:user', { userId: user._id });
      });

      // Listen for order updates
      socket.on('order:status-updated', (data) => {
        toast.success(`Order ${data.orderId} is now ${data.status.replace(/_/g, ' ')}`);
        addNotification({
          id: Date.now(),
          type: 'order',
          title: 'Order Update',
          message: `Your order #${data.orderId} status has changed to ${data.status.replace(/_/g, ' ')}`,
          createdAt: new Date()
        });
      });

      // Listen for admin notifications (e.g., new order)
      socket.on('admin:new-order', (data) => {
        if (user.role === 'admin') {
          toast.success(`New order received: #${data.orderId}`);
          addNotification({
            id: Date.now(),
            type: 'admin',
            title: 'New Order',
            message: `A new order #${data.orderId} has been placed for ₹${data.amount}`,
            createdAt: new Date()
          });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user, addNotification]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
