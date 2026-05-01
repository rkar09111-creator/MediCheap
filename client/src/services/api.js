import axios from 'axios';
import { API_URL } from '../constants';
import { toast } from 'react-hot-toast';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    
    if (status === 401) {
      localStorage.removeItem('token');
      // No toast needed for 401 as it usually redirects to login
    } else if (status === 403) {
      toast.error("Access Denied: Your security clearance is insufficient.");
    } else if (status >= 500) {
      toast.error("System Malfunction: Central node encountered an internal logic error.");
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post(`${API_BASE}/auth/login`, credentials),
  register: (data) => api.post(`${API_BASE}/auth/register`, data),
  logout: () => api.post(`${API_BASE}/auth/logout`),
  getMe: () => api.get(`${API_BASE}/auth/me`),
  getProfileStats: () => api.get(`${API_BASE}/auth/profile-stats`),
  updateMe: (data) => api.put(`${API_BASE}/auth/update-profile`, data),
  updatePassword: (data) => api.patch(`${API_BASE}/auth/update-password`, data),
  topUpWallet: (amount) => api.post(`${API_BASE}/auth/top-up-wallet`, { amount })
};

export const medicineService = {
  getAll: (params) => api.get(`${API_BASE}/medicines`, { params }),
  getById: (id) => api.get(`${API_BASE}/medicines/${id}`),
  search: (q) => api.get(`${API_BASE}/medicines/search`, { params: { q } }),
  add: (data) => api.post(`${API_BASE}/medicines`, data),
  update: (id, data) => api.put(`${API_BASE}/medicines/${id}`, data),
  delete: (id) => api.delete(`${API_BASE}/medicines/${id}`),
  toggleAvailability: (id) => api.patch(`${API_BASE}/medicines/${id}/toggle-availability`),
  updateStock: (id, data) => api.patch(`${API_BASE}/medicines/${id}/update-stock`, data)
};

export const categoryService = {
  getAll: (params) => api.get(`${API_BASE}/categories`, { params }),
  getById: (id) => api.get(`${API_BASE}/categories/${id}`),
  add: (data) => api.post(`${API_BASE}/categories`, data),
  update: (id, data) => api.put(`${API_BASE}/categories/${id}`, data),
  delete: (id) => api.delete(`${API_BASE}/categories/${id}`),
  toggle: (id) => api.patch(`${API_BASE}/categories/${id}/toggle`),
  reorder: (categoryIds) => api.put(`${API_BASE}/categories/reorder`, { categoryIds })
};

export const orderService = {
  placeOrder: (data) => api.post(`${API_BASE}/orders`, data),
  getMyOrders: (params) => api.get(`${API_BASE}/orders`, { params }),
  getById: (id) => api.get(`${API_BASE}/orders/${id}`),
  getAll: (params) => api.get(`${API_BASE}/orders/all`, { params }),
  updateStatus: (id, data) => api.patch(`${API_BASE}/orders/${id}/status`, data)
};

export const addressService = {
  getAll: () => api.get(`${API_BASE}/addresses`),
  add: (data) => api.post(`${API_BASE}/addresses`, data),
  setDefault: (id) => api.patch(`${API_BASE}/addresses/${id}/set-default`),
  geocode: (address) => api.post(`${API_BASE}/addresses/geocode`, { address }),
  reverseGeocode: (lat, lng) => api.post(`${API_BASE}/addresses/reverse-geocode`, { lat, lng })
};

export const settingService = {
  getAll: () => api.get(`${API_BASE}/settings`),
  getHomepage: () => api.get(`${API_BASE}/settings/homepage`),
  updateHomepage: (data) => api.put(`${API_BASE}/settings/homepage`, data),
  updateStore: (data) => api.put(`${API_BASE}/settings/store`, data),
  updateDelivery: (data) => api.put(`${API_BASE}/settings/delivery`, data),
  update: (data) => api.put(`${API_BASE}/settings`, data)
};

export const bannerService = {
  getAll: () => api.get(`${API_BASE}/banners`),
  add: (data) => api.post(`${API_BASE}/banners`, data),
  update: (id, data) => api.put(`${API_BASE}/banners/${id}`, data),
  delete: (id) => api.delete(`${API_BASE}/banners/${id}`)
};

export const adminService = {
  getStats: () => api.get(`${API_BASE}/reports/stats`),
  getUsers: () => api.get(`${API_BASE}/users`),
  getOrders: () => api.get(`${API_BASE}/orders/all`),
  getPrescriptions: () => api.get(`${API_BASE}/prescriptions/all`),
  getRiders: () => api.get(`${API_BASE}/rider/available`),
  updatePrescriptionStatus: (id, status) => api.patch(`${API_BASE}/prescriptions/${id}/status`, { status }),
  updateOrderStatus: (id, status) => api.patch(`${API_BASE}/orders/${id}/status`, { status }),
  verifyPrescription: (id) => api.patch(`${API_BASE}/prescriptions/${id}/verify`),
  assignRider: (orderId, riderId) => api.patch(`${API_BASE}/orders/${orderId}/assign-rider`, { riderId }),
  deleteMedicine: (id) => api.delete(`${API_BASE}/medicines/${id}`),
  updateMedicine: (id, data) => api.put(`${API_BASE}/medicines/${id}`, data),
  addMedicine: (data) => api.post(`${API_BASE}/medicines`, data),
  bulkImport: (data) => api.post(`${API_BASE}/medicines/bulk-import`, data),
  getAuditLogs: (params) => api.get(`${API_BASE}/audit/all`, { params }),
  getCounts: () => api.get(`${API_BASE}/reports/counts`)
};

export const paymentService = {
  getSettings: () => api.get(`${API_BASE}/payments/settings`),
  updateUpi: (data) => api.put(`${API_BASE}/payments/settings/upi`, data),
  updateCod: (data) => api.put(`${API_BASE}/payments/settings/cod`, data),
  uploadScreenshot: (orderId, data) => api.post(`${API_BASE}/payments/screenshot/${orderId}`, data),
  uploadQr: (data) => api.post(`${API_BASE}/payments/settings/qr`, data),
  getPending: () => api.get(`${API_BASE}/payments/pending`),
  verify: (orderId, notes) => api.patch(`${API_BASE}/payments/verify/${orderId}`, { notes }),
  reject: (orderId, notes) => api.patch(`${API_BASE}/payments/reject/${orderId}`, { notes })
};

export const chatService = {
  getAll: () => api.get(`${API_BASE}/chat/sessions`),
  getById: (sessionId) => api.get(`${API_BASE}/chat/sessions/${sessionId}`),
  getMessages: (sessionId) => api.get(`${API_BASE}/chat/sessions/${sessionId}/messages`),
  sendMessage: (sessionId, data) => api.post(`${API_BASE}/chat/sessions/${sessionId}/messages`, data)
};

export const prescriptionService = {
  upload: (data) => api.post(`${API_BASE}/prescriptions/upload`, data),
  getMyPrescriptions: (params) => api.get(`${API_BASE}/prescriptions/mine`, { params }),
  getById: (id) => api.get(`${API_BASE}/prescriptions/${id}`),
  delete: (id) => api.delete(`${API_BASE}/prescriptions/${id}`),
  reupload: (id, data) => api.post(`${API_BASE}/prescriptions/${id}/reupload`, data)
};

export const couponService = {
  validate: (data) => api.post(`${API_BASE}/coupons/validate`, data),
  getAll: () => api.get(`${API_BASE}/coupons/all`),
  add: (data) => api.post(`${API_BASE}/coupons`, data),
  update: (id, data) => api.patch(`${API_BASE}/coupons/${id}`, data),
  delete: (id) => api.delete(`${API_BASE}/coupons/${id}`)
};

export const reviewService = {
  submit: (data) => api.post(`${API_BASE}/reviews`, data),
  getForMedicine: (medicineId) => api.get(`${API_BASE}/reviews/medicine/${medicineId}`),
  getAll: (params) => api.get(`${API_BASE}/reviews/all`, { params }),
  updateStatus: (id, data) => api.patch(`${API_BASE}/reviews/${id}/status`, data),
  delete: (id) => api.delete(`${API_BASE}/reviews/${id}`)
};

export const userService = {
  getAll: (params) => api.get(`${API_BASE}/users`, { params }),
  getById: (id) => api.get(`${API_BASE}/users/${id}`),
  block: (id) => api.patch(`${API_BASE}/users/${id}/block`),
  delete: (id) => api.delete(`${API_BASE}/users/${id}`)
};

export const analyticsService = {
  trackVisit: (sessionId) => api.post(`${API_BASE}/analytics/visit`, { sessionId }),
  getSummary: () => api.get(`${API_BASE}/analytics/summary`),
  getHourly: () => api.get(`${API_BASE}/analytics/hourly`)
};

export const companyService = {
  getAll: (params) => api.get(`${API_BASE}/companies`, { params }),
  getBySlug: (slug) => api.get(`${API_BASE}/companies/slug/${slug}`),
  getById: (id) => api.get(`${API_BASE}/companies/${id}`),
  add: (data) => api.post(`${API_BASE}/companies`, data),
  update: (id, data) => api.put(`${API_BASE}/companies/${id}`, data),
  delete: (id) => api.delete(`${API_BASE}/companies/${id}`),
  toggle: (id) => api.patch(`${API_BASE}/companies/${id}/toggle`),
  getCategories: (companyId) => api.get(`${API_BASE}/companies/${companyId}/categories`),
  addCategory: (companyId, data) => api.post(`${API_BASE}/companies/${companyId}/categories`, data),
  updateCategory: (companyId, catId, data) => api.put(`${API_BASE}/companies/${companyId}/categories/${catId}`, data),
  deleteCategory: (companyId, catId) => api.delete(`${API_BASE}/companies/${companyId}/categories/${catId}`),
  getProducts: (companyId, params) => api.get(`${API_BASE}/companies/${companyId}/products`, { params }),
  getProductById: (productId) => api.get(`${API_BASE}/companies/products/detail/${productId}`),
  addProduct: (companyId, data) => api.post(`${API_BASE}/companies/${companyId}/products`, data),
  updateProduct: (companyId, productId, data) => api.put(`${API_BASE}/companies/${companyId}/products/${productId}`, data),
  deleteProduct: (companyId, productId) => api.delete(`${API_BASE}/companies/${companyId}/products/${productId}`),
  toggleProduct: (companyId, productId) => api.patch(`${API_BASE}/companies/${companyId}/products/${productId}/toggle`),
  searchProducts: (q) => api.get(`${API_BASE}/companies/search/products`, { params: { q } })
};

export const searchService = {
  global: (q) => api.get(`${API_BASE}/search/global`, { params: { q } })
};

export default api;
