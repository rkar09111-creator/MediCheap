import axios from 'axios';
import { API_URL } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor for responses to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Potentially trigger a logout or refresh here
      console.log('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export default api;
