import api from './api';

const authService = {
  login: async (username, password) => {
      try {
        // POST /api/Auth/login
        const response = await api.post('/Auth/login', { username, password });
        // The backend returns an object like { token: "..." }
        return response.data;
      } catch (error) {
        console.error("Error during login:", error.response?.data || error.message);
        throw error;
      }
  },
  
  register: async (email, username, password) => {
    try {
      // POST /api/Auth/register
      const response = await api.post('/Auth/register', { email, username, password });
      return response.data; // You might return a success message or user ID
    } catch (error) {
      console.error("Error during registration:", error.response?.data || error.message);
      throw error; // Re-throw to be handled by the calling component/context
    }
  }
};

export default authService;