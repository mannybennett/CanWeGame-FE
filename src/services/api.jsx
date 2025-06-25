import axios from 'axios';

const API_BASE_URL = 'http://localhost:5110/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401/403
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Handle unauthorized/forbidden, e.g., redirect to login
            console.error("Unauthorized or Forbidden request. Redirecting to login.");
            // You might dispatch a logout action from AuthContext here
            // but be careful to avoid circular dependencies if AuthContext uses api.js
        }
        return Promise.reject(error);
    }
);

export default api;