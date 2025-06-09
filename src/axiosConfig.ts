import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://admit-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ message: 'Network error' });
  }
);

export default instance;