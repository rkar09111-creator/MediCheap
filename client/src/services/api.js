import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optional: redirect to login if not on public pages
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (data) => api.post('/api/auth/register', data),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/update-profile', data),
  getProfileStats: () => api.get('/api/auth/profile-stats'),
  updateMe: (data) => api.put('/api/auth/update-profile', data),
  updatePassword: (data) => api.patch('/api/auth/update-password', data),
  topUpWallet: (amount) => api.post('/api/auth/top-up-wallet', { amount })
};

export const medicineService = {
  getAll: (params) => api.get('/api/medicines', { params }),
  getById: (id) => api.get(`/api/medicines/${id}`),
  search: (q) => api.get('/api/medicines/search', { params: { q } }),
  // Admin
  add: (data) => api.post('/api/medicines', data),
  update: (id, data) => api.put(`/api/medicines/${id}`, data),
  delete: (id) => api.delete(`/api/medicines/${id}`),
  toggleAvailability: (id) => api.patch(`/api/medicines/${id}/toggle-availability`),
  updateStock: (id, data) => api.patch(`/api/medicines/${id}/update-stock`, data)
};

export const categoryService = {
  getAll: (params) => api.get('/api/categories', { params }),
  getById: (id) => api.get(`/api/categories/${id}`),
  // Admin
  add: (data) => api.post('/api/categories', data),
  create: (data) => api.post('/api/categories', data), // Alias
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
  toggle: (id) => api.patch(`/api/categories/${id}/toggle`),
  reorder: (categoryIds) => api.put('/api/categories/reorder', { categoryIds })
};

export const orderService = {
  placeOrder: (data) => api.post('/api/orders', data),
  getMyOrders: (params) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  // Admin
  getAll: (params) => api.get('/api/orders/all', { params }),
  updateStatus: (id, data) => api.patch(`/api/orders/${id}/status`, data)
};

export const addressService = {
  getAll: () => api.get('/api/addresses'),
  add: (data) => api.post('/api/addresses', data),
  setDefault: (id) => api.patch(`/api/addresses/${id}/set-default`),
  geocode: (address) => api.post('/api/addresses/geocode', { address }),
  reverseGeocode: (lat, lng) => api.post('/api/addresses/reverse-geocode', { lat, lng })
};

export const settingService = {
  getAll: () => api.get('/api/settings'),
  getSettings: () => api.get('/api/settings'),
  getHomepage: () => api.get('/api/settings/homepage'),
  // Admin
  updateHomepage: (data) => api.put('/api/settings/homepage', data),
  updateStore: (data) => api.put('/api/settings/store', data),
  updateDelivery: (data) => api.put('/api/settings/delivery', data),
  update: (data) => api.put('/api/settings', data)
};

export const bannerService = {
  getAll: () => api.get('/api/banners'),
  add: (data) => api.post('/api/banners', data),
  update: (id, data) => api.put(`/api/banners/${id}`, data),
  delete: (id) => api.delete(`/api/banners/${id}`)
};

export const adminService = {
  getStats: () => api.get('/api/reports/stats'),
  getUsers: () => api.get('/api/users'),
  getOrders: () => api.get('/api/orders/all'),
  getPrescriptions: () => api.get('/api/prescriptions/all'),
  getRiders: () => api.get('/api/rider/available'),
  updatePrescriptionStatus: (id, status) => api.patch(`/api/prescriptions/${id}/status`, { status }),
  updateOrderStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  verifyPrescription: (id) => api.patch(`/api/prescriptions/${id}/verify`),
  assignRider: (orderId, riderId) => api.patch(`/api/orders/${orderId}/assign-rider`, { riderId }),
  deleteMedicine: (id) => api.delete(`/api/medicines/${id}`),
  updateMedicine: (id, data) => api.put(`/api/medicines/${id}`, data),
  addMedicine: (data) => api.post('/api/medicines', data),
  bulkImport: (data) => api.post('/api/medicines/bulk-import', data),
  getAuditLogs: (params) => api.get('/api/audit/all', { params }),
  getCounts: () => api.get('/api/reports/counts')
};

export const paymentService = {
  getSettings: () => api.get('/api/payments/settings'),
  updateUpi: (data) => api.put('/api/payments/settings/upi', data),
  updateCod: (data) => api.put('/api/payments/settings/cod', data),
  uploadScreenshot: (orderId, data) => api.post(`/api/payments/screenshot/${orderId}`, data),
  uploadQr: (data) => api.post('/api/payments/settings/qr', data),
  getPending: () => api.get('/api/payments/pending'),
  verify: (orderId, notes) => api.patch(`/api/payments/verify/${orderId}`, { notes }),
  reject: (orderId, notes) => api.patch(`/api/payments/reject/${orderId}`, { notes })
};

export const chatService = {
  getAll: () => api.get('/api/chat/sessions'),
  getChats: () => api.get('/api/chat/sessions'),
  getById: (sessionId) => api.get(`/api/chat/sessions/${sessionId}`),
  getMessages: (sessionId) => api.get(`/api/chat/sessions/${sessionId}/messages`),
  sendMessage: (sessionId, data) => api.post(`/api/chat/sessions/${sessionId}/messages`, data)
};

export const prescriptionService = {
  upload: (data) => api.post('/api/prescriptions/upload', data),
  getMyPrescriptions: () => api.get('/api/prescriptions/my'),
  getById: (id) => api.get(`/api/prescriptions/${id}`)
};

export const couponService = {
  validate: (data) => api.post('/api/coupons/validate', data),
  // Admin
  getAll: () => api.get('/api/coupons/all'),
  create: (data) => api.post('/api/coupons', data),
  update: (id, data) => api.patch(`/api/coupons/${id}`, data),
  delete: (id) => api.delete(`/api/coupons/${id}`)
};

export const reviewService = {
  submit: (data) => api.post('/api/reviews', data),
  getForMedicine: (medicineId) => api.get(`/api/reviews/medicine/${medicineId}`),
  // Admin
  getAll: (params) => api.get('/api/reviews/all', { params }),
  updateStatus: (id, data) => api.patch(`/api/reviews/${id}/status`, data),
  delete: (id) => api.delete(`/api/reviews/${id}`)
};

export const userService = {
  getAll: (params) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
  block: (id) => api.patch(`/api/users/${id}/block`),
  delete: (id) => api.delete(`/api/users/${id}`)
};

export const analyticsService = {
  trackVisit: (sessionId) => api.post('/api/analytics/visit', { sessionId }),
  getSummary: () => api.get('/api/analytics/summary'),
  getHourly: () => api.get('/api/analytics/hourly')
};

export const companyService = {
  // Companies
  getAll: (params) => api.get('/api/companies', { params }),
  getBySlug: (slug) => api.get(`/api/companies/slug/${slug}`),
  getById: (id) => api.get(`/api/companies/${id}`),
  add: (data) => api.post('/api/companies', data),
  update: (id, data) => api.put(`/api/companies/${id}`, data),
  delete: (id) => api.delete(`/api/companies/${id}`),
  toggle: (id) => api.patch(`/api/companies/${id}/toggle`),
  
  // Categories
  getCategories: (companyId) => api.get(`/api/companies/${companyId}/categories`),
  addCategory: (companyId, data) => api.post(`/api/companies/${companyId}/categories`, data),
  updateCategory: (companyId, catId, data) => api.put(`/api/companies/${companyId}/categories/${catId}`, data),
  deleteCategory: (companyId, catId) => api.delete(`/api/companies/${companyId}/categories/${catId}`),
  
  // Products
  getProducts: (companyId, params) => api.get(`/api/companies/${companyId}/products`, { params }),
  getProductById: (productId) => api.get(`/api/companies/products/detail/${productId}`),
  addProduct: (companyId, data) => api.post(`/api/companies/${companyId}/products`, data),
  updateProduct: (companyId, productId, data) => api.put(`/api/companies/${companyId}/products/${productId}`, data),
  deleteProduct: (companyId, productId) => api.delete(`/api/companies/${companyId}/products/${productId}`),
  toggleProduct: (companyId, productId) => api.patch(`/api/companies/${companyId}/products/${productId}/toggle`),
  
  // Search
  searchProducts: (q) => api.get('/api/companies/search/products', { params: { q } })
};

export const searchService = {
  global: (q) => api.get('/api/search/global', { params: { q } })
};

export default api;
