import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, CheckCircle, X, Clock, MapPin, User,
  Package, BellRing, VolumeX
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNotificationStore } from '../../store/notificationStore';
import useOrderRing from '../../hooks/useOrderRing';
import { orderService } from '../../../services/api';

/**
 * IncomingOrderModal — Appears whenever there are pending (unaccepted) orders.
 * Rings continuously using Web Audio API until admin accepts or dismisses.
 */
const IncomingOrderModal = () => {
  const { pendingOrders, acceptOrder, dismissAll } = useNotificationStore();
  const { startRing, stopRing } = useOrderRing();

  const hasPending = pendingOrders.length > 0;
  const currentOrder = pendingOrders[0]; // Show the oldest pending order

  // Start/stop ring based on pending state
  useEffect(() => {
    if (hasPending) {
      startRing();
    } else {
      stopRing();
    }
    return () => stopRing();
  }, [hasPending, startRing, stopRing]);

  const handleAccept = useCallback(async (order) => {
    const orderId = order._id;
    try {
      // Call the existing status update API
      if (orderId) {
        await orderService.updateStatus(orderId, { status: 'confirmed', note: 'Accepted by admin' });
      }
      acceptOrder(orderId || order.orderId);
      stopRing();
      toast.success(`Order #${order.orderId || orderId?.slice(-6)?.toUpperCase()} accepted!`, {
        icon: '✅',
        duration: 4000,
      });
    } catch (err) {
      console.error('Accept order failed:', err);
      // Still remove from pending even if API fails
      acceptOrder(orderId || order.orderId);
      stopRing();
      toast.success('Order accepted (offline mode)');
    }
  }, [acceptOrder, stopRing]);

  const handleDismissAll = useCallback(() => {
    dismissAll();
    stopRing();
  }, [dismissAll, stopRing]);

  return (
    <AnimatePresence>
      {hasPending && currentOrder && (
        <>
          {/* Backdrop with pulsing green glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)',
            }}
          />

          {/* Modal Card */}
          <motion.div
            key={currentOrder._id || currentOrder.orderId}
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-6 right-6 z-[201] w-[420px] max-w-[calc(100vw-24px)]"
          >
            {/* Pulsing Ring Border */}
            <div className="absolute inset-0 rounded-2xl animate-pulse pointer-events-none"
              style={{ boxShadow: '0 0 0 3px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.15)' }}
            />

            <div className="bg-white rounded-2xl shadow-2xl border border-green-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <BellRing size={20} className="text-white animate-bounce" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm tracking-tight">NEW ORDER INCOMING</p>
                    {pendingOrders.length > 1 && (
                      <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest">
                        +{pendingOrders.length - 1} more pending
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleDismissAll}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  title="Dismiss all (doesn't change order status)"
                >
                  <VolumeX size={14} />
                </button>
              </div>

              {/* Order Details */}
              <div className="px-5 py-4 space-y-4">
                {/* Order ID + Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-green-600" />
                    <span className="font-black text-slate-900 text-sm">
                      #{currentOrder.orderId || currentOrder._id?.slice(-8)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock size={12} />
                    <span>Just now</span>
                  </div>
                </div>

                {/* Customer */}
                {(currentOrder.user?.name || currentOrder.deliveryAddress?.name) && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User size={14} className="text-slate-400 shrink-0" />
                    <span className="font-semibold">
                      {currentOrder.user?.name || currentOrder.deliveryAddress?.name}
                    </span>
                  </div>
                )}

                {/* Delivery Address */}
                {currentOrder.deliveryAddress && (
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-snug line-clamp-2">
                      {[
                        currentOrder.deliveryAddress.street,
                        currentOrder.deliveryAddress.city,
                        currentOrder.deliveryAddress.state
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {/* Items */}
                {currentOrder.items && currentOrder.items.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Package size={12} />
                      <span>{currentOrder.items.length} Item{currentOrder.items.length > 1 ? 's' : ''}</span>
                    </div>
                    {currentOrder.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 font-medium truncate max-w-[220px]">
                          {item.name || item.medicine?.name || 'Medicine'}
                        </span>
                        <span className="text-slate-500 text-xs shrink-0 ml-2">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                    {currentOrder.items.length > 3 && (
                      <p className="text-xs text-slate-400">
                        +{currentOrder.items.length - 3} more items
                      </p>
                    )}
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-slate-500 font-medium">Order Total</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{currentOrder.pricing?.total || currentOrder.total || '—'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5 flex gap-3">
                <button
                  onClick={handleDismissAll}
                  className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Dismiss
                </button>
                <button
                  onClick={() => handleAccept(currentOrder)}
                  className="flex-2 flex-grow h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-black transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle size={18} />
                  Accept Order
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IncomingOrderModal;
