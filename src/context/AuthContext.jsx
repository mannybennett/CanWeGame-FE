import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('jwtToken'));
	const [isAuthenticated, setIsAuthenticated] = useState(!!token);
	const [loadingAuth, setLoadingAuth] = useState(true);

	// Set up Axios interceptor to automatically add JWT to requests
	useEffect(() => {
		const initializeAuth = async () => {
			if (token) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
				try {
					const payload = JSON.parse(atob(token.split('.')[1]));

					// Use the full URI for the nameidentifier claim
					const userIdClaimName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
					const userIdFromToken = payload[userIdClaimName]; // Access using bracket notation for string key

					// Optional: You also have 'sub' claim with the username, which might be useful for 'user.username'
					// const usernameFromToken = payload.sub;


					if (userIdFromToken) {
						// Ensure userIdFromToken is parsed as an integer if your backend expects int
						const parsedUserId = parseInt(userIdFromToken, 10);

						// Use the parsedUserId to fetch the user's full profile
						const response = await userService.getUserById(parsedUserId);
						setUser(response.data); // Set the user state with the fetched data
						setIsAuthenticated(true);
					} else {
						console.error("User ID claim (nameidentifier) not found in JWT payload.");
						logout();
					}

				} catch (e) {
					console.error("Failed to decode token, fetch user data, or token invalid:", e);
					logout();
				}
			} else {
				delete axios.defaults.headers.common['Authorization'];
				setUser(null);
				setIsAuthenticated(false);
			}
			setLoadingAuth(false);
		};

		initializeAuth();
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