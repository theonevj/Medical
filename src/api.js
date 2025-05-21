import axios from 'axios';
import { store } from './redux/store';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState(); // Get the current Redux state
    const token = state.auth.api_token; // Access the token from authReducer

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
