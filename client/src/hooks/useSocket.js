import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../constants';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAdminStore } from '../store/adminStore';
import { toast } from 'react-hot-toast';

let socket = null;

export const useSocket = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { fetchSettings } = useSettingsStore();
  const { addNotification } = useNotificationStore();
  const { incrementPendingOrder, incrementPendingPrescription } = useAdminStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!socket) {
        socket = io(API_URL, {
          withCredentials: true
        });

        socket.on('connect', () => {
          console.log('Connected to socket server');
          
          if (user.role === 'admin') {
            socket.emit('join:admin');
          }
          socket.emit('join:user', user._id);
          if (user.role === 'rider') {
            socket.emit('join:rider', user._id);
          }
        });

        // GLOBAL LISTENERS
        socket.on('settings:updated', () => {
          fetchSettings();
          toast.success('Site settings updated live');
        });

        // USER LISTENERS
        socket.on('order:status_changed', (data) => {
          toast.info(`Order status changed to ${data.status}`);
          addNotification({ title: 'Order Update', body: `Your order status is now ${data.status}` });
        });

        // ADMIN LISTENERS
        if (user.role === 'admin') {
          socket.on('order:new', (data) => {
            toast.success('New order received!');
            incrementPendingOrder();
          });

          socket.on('prescription:new', () => {
            toast.success('New prescription uploaded!');
            incrementPendingPrescription();
          });
        }
      }
    } else {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }

    return () => {
      // Don't disconnect on every render, only on auth change
    };
  }, [isAuthenticated, user]);

  return socket;
};

export const getSocket = () => socket;
