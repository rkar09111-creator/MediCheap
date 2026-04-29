import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { couponService } from '../services/api';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      prescriptionId: null,
      coupon: null,
      deliveryFee: 49,
      discount: 0,

      addItem: (medicine, qty = 1) => {
        const { items } = get();
        const existing = items.find(i => i.medicine === medicine._id);
        
        if (existing) {
          set({
            items: items.map(i => 
              i.medicine === medicine._id 
                ? { ...i, quantity: i.quantity + qty } 
                : i
            )
          });
        } else {
          set({
            items: [...items, {
              medicine: medicine._id,
              name: medicine.name,
              image: medicine.images?.[0],
              quantity: qty,
              mrp: medicine.mrp,
              sellingPrice: medicine.sellingPrice,
              requiresPrescription: medicine.requiresPrescription
            }]
          });
        }
      },

      removeItem: (medicineId) => {
        set({ items: get().items.filter(i => i.medicine !== medicineId) });
      },

      updateQty: (medicineId, qty) => {
        if (qty < 1) return get().removeItem(medicineId);
        set({
          items: get().items.map(i => 
            i.medicine === medicineId ? { ...i, quantity: qty } : i
          )
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null, discount: 0, prescriptionId: null });
      },

      applyCoupon: async (code) => {
        try {
          const subtotal = get().calculateSubtotal();
          const { data } = await couponService.validate({ code, orderAmount: subtotal });
          set({ coupon: data.coupon, discount: data.discountAmount });
          return { success: true };
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Invalid coupon' };
        }
      },

      removeCoupon: () => set({ coupon: null, discount: 0 }),

      calculateSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0);
      },

      calculateTotal: () => {
        const subtotal = get().calculateSubtotal();
        const { discount, deliveryFee } = get();
        return subtotal - discount + deliveryFee;
      },

      hasRxItems: () => {
        return get().items.some(i => i.requiresPrescription);
      },
      
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
