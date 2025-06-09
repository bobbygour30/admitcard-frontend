import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fallback for local dev only

const instance = axios.create({
  baseURL: `${API_URL}/api`, // E.g., https://your-backend.vercel.app/api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable if backend requires credentials
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      return Promise.reject({ status, message: data?.message || `Error ${status}`, data });
    }
    return Promise.reject({
      message: 'Network error',
      error: error.message || 'Unknown error',
    });
  }
);

export default instance;