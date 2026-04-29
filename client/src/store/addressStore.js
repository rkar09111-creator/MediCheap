import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/addresses';

export const useAddressStore = create((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      set({ addresses: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch addresses', loading: false });
    }
  },

  addAddress: async (addressData) => {
    set({ loading: true });
    try {
      const response = await axios.post(API_URL, addressData, { withCredentials: true });
      set((state) => ({ 
        addresses: [response.data, ...state.addresses.map(a => addressData.isDefault ? {...a, isDefault: false} : a)],
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add address', loading: false });
      throw error;
    }
  },

  updateAddress: async (id, addressData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/${id}`, addressData, { withCredentials: true });
      set((state) => ({
        addresses: state.addresses.map((a) => (a._id === id ? response.data : (addressData.isDefault ? {...a, isDefault: false} : a))),
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update address', loading: false });
      throw error;
    }
  },

  deleteAddress: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      set((state) => ({
        addresses: state.addresses.filter((a) => a._id !== id)
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete address' });
    }
  },

  setDefault: async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/default`, {}, { withCredentials: true });
      set((state) => ({
        addresses: state.addresses.map((a) => (a._id === id ? {...a, isDefault: true} : {...a, isDefault: false}))
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to set default address' });
    }
  }
}));
