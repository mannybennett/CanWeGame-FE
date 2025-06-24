// src/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import userService from '../services/userService';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wrap fetchUsers in useCallback to memoize it.
  // This prevents it from being recreated on every render if its dependencies don't change.
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data); // Assuming response.data is the array of users
    } catch (err) {
      console.error("Failed to fetch users:", err); // Log the error for debugging
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is stable and won't change

  // useEffect will run fetchUsers once when the component mounts.
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Add fetchUsers to the dependency array. ESLint will often recommend this,
                    // and because it's wrapped in useCallback, it won't cause infinite loops.

  return {
    users,
    loading,
    error,
    fetchUsers // Expose fetchUsers in case a component needs to manually re-fetch (e.g., after a filter)
  };
};

export default useUsers;