/**
 * Global Configuration Constants
 */

// Base API URL - prioritize environment variable, fallback to localhost for development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: '/api/auth',
    MEDICINES: '/api/medicines',
    ORDERS: '/api/orders',
    PRESCRIPTIONS: '/api/prescriptions',
    CATEGORIES: '/api/categories',
    SETTINGS: '/api/settings',
    CHAT: '/api/chat',
    PAYMENTS: '/api/payments',
    REVIEWS: '/api/reviews',
    USERS: '/api/users',
    ANALYTICS: '/api/analytics',
    COMPANIES: '/api/companies'
};

// UI Constants
export const UI_CONSTANTS = {
    NAVBAR_HEIGHT_DEFAULT: 72,
    NAVBAR_HEIGHT_SCROLLED: 60,
    ANNOUNCEMENT_HEIGHT: 32
};
