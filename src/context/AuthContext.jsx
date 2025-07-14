import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import userService from '../services/userService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // This will now include friends
	const [token, setToken] = useState(localStorage.getItem('jwtToken'));
	const [isAuthenticated, setIsAuthenticated] = useState(!!token);
	const [loadingAuth, setLoadingAuth] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			if (token) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
				try {
					const payload = JSON.parse(atob(token.split('.')[1]));
					const userIdClaimName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
					const userIdFromToken = payload[userIdClaimName];

					if (userIdFromToken) {
						const parsedUserId = parseInt(userIdFromToken, 10);

						// --- Fetch current user's profile ---
						const userProfileResponse = await userService.getUserById(parsedUserId);
						const currentUserProfile = userProfileResponse.data;

						// --- Fetch current user's friends list ---
						const friendsResponse = await userService.getMyFriends();
						const currentUserFriends = friendsResponse.data;

						// Combine user profile and friends into a single user object for context
						setUser({
								...currentUserProfile, // Spread existing user data (id, username, email, etc.)
								friends: currentUserFriends // Add the friends list
						});
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
		setLoadingAuth(true);
		try {
			const data = await authService.login(username, password);
			const newToken = data.token;
			localStorage.setItem('jwtToken', newToken);
			setToken(newToken); // This will trigger the useEffect above to fetch user data and friends
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
};

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, register, loadingAuth }}>
				{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };