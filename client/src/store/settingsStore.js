import { create } from 'zustand';
import { settingService } from '../services/api';

export const useSettingsStore = create((set) => ({
  settings: {
    announcement: 'FREE delivery on orders above ₹499 | Same-day delivery before 6 PM',
    is_active: true,
    maintenance_message: 'MediCheap is currently undergoing clinical maintenance.'
  },
  isLoading: false,
  isLoaded: false,
  error: null,

  fetchSettings: async () => {
    // Only fetch if not already loaded or if explicitly called
    set({ isLoading: true });
    try {
      const { data } = await settingService.getSettings();
      // API returns { success, data: { settings } }
      const newSettings = data.data?.settings || data.settings;
      if (newSettings) {
        set({ settings: { ...newSettings }, isLoaded: true });
      }
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      console.error('Failed to fetch global settings', error);
      set({ isLoading: false, error: 'Failed to sync clinical protocols' });
      return { success: false };
    }
  },

  // Helper to check maintenance mode
  isMaintenanceActive: () => {
    const state = useSettingsStore.getState();
    return state.settings.is_active === false;
  }
}));
