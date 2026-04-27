import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_KEY}`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    
    'SIPL': 'semantic',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle 401 and Token Refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          localStorage.clear();
          // window.location.href = '/login';
          console.log('No refresh token available');
          return Promise.reject(new Error('No refresh token available'));
        }
        
        // Try to get new tokens
        console.log('Refreshing tokens...');
        console.log('Refresh token: ', refreshToken);
        const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh: refreshToken });
        console.log(response.data)
        console.log('hit refresh api')
        if (!response.data.access) {
          console.log('Invalid token response')
          throw new Error('Invalid token response');
        }
        
        const { access, refresh } = response.data;
        console.log(access, refresh)
        localStorage.setItem('access', access);
        // localStorage.setItem('refresh', refresh);
        
        // Update auth header and retry request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Clear tokens and redirect on refresh failure
        // localStorage.clear();
        // window.location.href = '/login';
        console.log(refreshError)
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors just reject the promise
    return Promise.reject(error);
  }
);
export default api;
