import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Pill, ShoppingCart, ClipboardList } from 'lucide-react';
import React from 'react';

const useAdminSocket = () => {
  useEffect(() => {
    // In a real app, this would connect to a socket.io server
    // For now, we simulate real-time notifications for the admin
    
    const simulateNotification = () => {
      const types = ['order', 'prescription', 'stock'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      if (type === 'order') {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border-l-4 border-primary-500`}>
            <div className="flex-1 w-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5"><div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500"><ShoppingCart className="w-5 h-5" /></div></div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-gray-900">New Order Received! 🛒</p>
                  <p className="mt-1 text-xs text-gray-500">Order #MED-2048 just came in. Total: ₹1,240</p>
                </div>
              </div>
            </div>
          </div>
        ));
      } else if (type === 'prescription') {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border-l-4 border-status-rx`}>
            <div className="flex-1 w-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5"><div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-status-rx"><ClipboardList className="w-5 h-5" /></div></div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-gray-900">Prescription Awaiting Review 📋</p>
                  <p className="mt-1 text-xs text-gray-500">A new clinical document requires verification for Order #MED-2049.</p>
                </div>
              </div>
            </div>
          </div>
        ));
      } else if (type === 'stock') {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border-l-4 border-danger`}>
            <div className="flex-1 w-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5"><div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-danger"><Pill className="w-5 h-5" /></div></div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-gray-900">Low Stock Alert! 📦</p>
                  <p className="mt-1 text-xs text-gray-500">'Amoxicillin 250mg' is below threshold (Remaining: 4 units).</p>
                </div>
              </div>
            </div>
          </div>
        ));
      }
    };

    // Simulate occasional notifications every 2-5 minutes
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every check
        simulateNotification();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);
};

export default useAdminSocket;
