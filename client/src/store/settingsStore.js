import { create } from 'zustand';
import { settingService } from '../services/api';

export const useSettingsStore = create((set, get) => ({
  settings: null,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const { data } = await settingService.getSettings();
      set({ settings: data.settings, isLoading: false });
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ isLoading: false });
    }
  },

  updateLocalSettings: (newSettings) => {
    set({ settings: newSettings });
  }
}));
