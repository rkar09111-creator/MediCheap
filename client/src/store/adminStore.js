import { create } from 'zustand';

export const useAdminStore = create((set, get) => ({
  dashboardStats: null,
  pendingOrders: 0,
  pendingPrescriptions: 0,
  pendingPayments: 0,

  updateStats: (stats) => set({ dashboardStats: stats }),
  
  incrementPendingOrder: () => set(state => ({ pendingOrders: state.pendingOrders + 1 })),
  incrementPendingPrescription: () => set(state => ({ pendingPrescriptions: state.pendingPrescriptions + 1 })),
  incrementPendingPayment: () => set(state => ({ pendingPayments: state.pendingPayments + 1 })),

  resetCounts: () => set({ pendingOrders: 0, pendingPrescriptions: 0, pendingPayments: 0 })
}));
