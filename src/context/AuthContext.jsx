import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('jwtToken'));
	const [isAuthenticated, setIsAuthenticated] = useState(!!token);
	const [loadingAuth, setLoadingAuth] = useState(true);

	// Set up Axios interceptor to automatically add JWT to requests
	useEffect(() => {
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

			// ***Optional: Decode token to get basic user info, or fetch from a /me endpoint
			try {
				//fetch user details
				// You might have a /api/User/me endpoint that returns current user's profile
				// api.get('/User/me').then(res => setUser(res.data)).catch(() => logout());
				setUser({ username: "Logged In User" }); // Placeholder
			} catch (e) {
					console.error("Failed to decode token or fetch user data:", e);
					logout(); // If token is invalid, log out
			}
		} else {
			delete axios.defaults.headers.common['Authorization'];
			setUser(null);
		}
		setLoadingAuth(false); // Auth check complete
	}, [token]);

	const login = async (username, password) => {
		setLoadingAuth(true); // Indicate that login is in progress
		try {
			const data = await authService.login(username, password); // <--- Use authService
			const newToken = data.token;
			localStorage.setItem('jwtToken', newToken);
			setToken(newToken);
			setIsAuthenticated(true);
			// setUser based on token or another API call
			// For now, we'll rely on the useEffect above to set `user`
			return true;
		} catch (error) {
			console.error("Login process failed:", error);
			setIsAuthenticated(false);
			setToken(null);
			setUser(null);
			localStorage.removeItem('jwtToken');
			return false;
		} finally {
			setLoadingAuth(false);
		}
	};

	const register = async ({ email, username, password }) => {
		setLoadingAuth(true);
		try {
			await authService.register(email, username, password);
			return true;
		} catch (error) {
			console.error("Registration process failed:", error);
			return false;
		} finally {
			setLoadingAuth(false);
		}
	};


	const logout = () => {
		localStorage.removeItem('jwtToken');
		setToken(null);
		setIsAuthenticated(false);
		setUser(null);
		// Redirect to login page or home after logout, typically handled in a component
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, register, loadingAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };