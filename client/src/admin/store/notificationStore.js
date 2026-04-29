import { create } from 'zustand';

/**
 * Global Notification Store for the Admin Panel.
 * Tracks pending (unaccepted) orders and a full notification history.
 */
export const useNotificationStore = create((set, get) => ({
  // Orders that have arrived but haven't been accepted/dismissed yet
  pendingOrders: [],

  // Full notification history for the bell dropdown (max 50)
  notifications: [],

  // Unread count for the bell badge
  unreadCount: 0,

  /**
   * Called when a new order socket event fires.
   * Adds to both pendingOrders and the notification history.
   */
  addOrder: (order) => {
    const notification = {
      id: order._id || order.orderId || Date.now().toString(),
      type: 'order',
      title: `New Order #${order.orderId || order._id?.slice(-6)?.toUpperCase()}`,
      subtitle: `₹${order.pricing?.total || order.total || '—'} • ${order.items?.length || 0} item(s)`,
      data: order,
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      pendingOrders: [...state.pendingOrders, { ...order, _notifId: notification.id }],
      notifications: [notification, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }));
  },

  /**
   * Called when admin clicks "Accept Order".
   * Removes from pending queue.
   */
  acceptOrder: (orderId) => {
    set((state) => ({
      pendingOrders: state.pendingOrders.filter(
        (o) => o._id !== orderId && o.orderId !== orderId
      ),
    }));
  },

  /**
   * Dismiss all pending orders (silences ring without accepting).
   */
  dismissAll: () => {
    set({ pendingOrders: [] });
  },

  /**
   * Mark all notifications as read (clears badge).
   */
  markAllRead: () => {
    set((state) => ({
      unreadCount: 0,
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  /**
   * Add a generic notification (prescription, chat, etc.)
   */
  addNotification: (notification) => {
    const n = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification,
    };
    set((state) => ({
      notifications: [n, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
