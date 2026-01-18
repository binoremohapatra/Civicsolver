import axios from 'axios';

// ✅ LIVE BACKEND (Hugging Face)
const BASE_URL = 'https://mrbaddy-civicsolver-backend.hf.space/api/v1';

// 🛠️ LOCALHOST (Uncomment this if you need to test locally)
// const BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches the Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Don't attach token to login requests to prevent conflicts
    if (token && !config.url.includes('/auth/officer-login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles Session Expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Only warn if the error is NOT from the login page itself
    if ((status === 401 || status === 403) && !url.includes('/auth/officer-login')) {
      console.warn('🔒 Session expired or Access Denied.');
      // Optional: Redirect to login if needed
      // window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;