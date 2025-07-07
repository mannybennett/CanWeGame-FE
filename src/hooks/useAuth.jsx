import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx'; // Import the AuthContext

/**
 * Custom hook to access authentication data and actions from the AuthContext.
 * This hook simplifies consuming the AuthContext, making components cleaner.
 *
 * @returns {object} An object containing authentication status, user data, token,
 * and functions for login, logout, and registration.
 */
const useAuth = () => {
    // Use useContext to get the value provided by the AuthContext.Provider
    const context = useContext(AuthContext);

    // Optional: Add a check to ensure the hook is used within a Provider
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    // Return all the values that the AuthContext.Provider makes available
    return context;
};

export default useAuth;