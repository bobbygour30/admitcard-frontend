import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fallback for local dev

const instance = axios.create({
  baseURL: `${API_URL}/api`, // E.g., http://localhost:5000/api or https://your-backend.vercel.app/api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable if your backend requires credentials (e.g., cookies)
});

instance.interceptors.request.use(
  (config) => {
    // Add auth token if needed
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