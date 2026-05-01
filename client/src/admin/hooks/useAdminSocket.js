import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../../constants';
import { useNotificationStore } from '../store/notificationStore';

const SOCKET_URL = API_URL;

let sharedSocket = null; // Singleton — prevent duplicate connections

const useAdminSocket = () => {
  const { addOrder, addNotification } = useNotificationStore();
  const socketRef = useRef(null);

  useEffect(() => {
    // Reuse existing socket or create new one
    if (!sharedSocket) {
      sharedSocket = io(SOCKET_URL, {
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        transports: ['websocket', 'polling'],
      });
    }
    socketRef.current = sharedSocket;
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log('[Admin Socket] Connected:', socket.id);
      // CRITICAL: Join the admin room so we receive admin events
      socket.emit('join:admin');
    };

    const handleNewOrder = (data) => {
      console.log('[Admin Socket] New order received:', data);
      // The server emits { order } — handle both shapes
      const order = data?.order || data;
      addOrder(order);
    };

    const handlePrescriptionUploaded = (data) => {
      addNotification({
        type: 'prescription',
        title: 'New Prescription Uploaded',
        subtitle: `From ${data?.customer || 'a customer'}`,
        data,
      });
    };

    const handleDisconnect = () => {
      console.log('[Admin Socket] Disconnected');
    };

    socket.on('connect', handleConnect);
    socket.on('order:new', handleNewOrder);
    socket.on('prescription:uploaded', handlePrescriptionUploaded);
    socket.on('disconnect', handleDisconnect);

    // If already connected, join admin room immediately
    if (socket.connected) {
      socket.emit('join:admin');
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('order:new', handleNewOrder);
      socket.off('prescription:uploaded', handlePrescriptionUploaded);
      socket.off('disconnect', handleDisconnect);
    };
  }, [addOrder, addNotification]);
};

export default useAdminSocket;
