import axios from 'axios';
import { getErrorMessage } from '../utils/errorMessages';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = new Error(getErrorMessage(error));
    customError.originalError = error;
    customError.status = error?.response?.status;
    customError.data = error?.response?.data;

    console.error('API Error:', error);
    return Promise.reject(customError);
  }
);

export default apiClient;
