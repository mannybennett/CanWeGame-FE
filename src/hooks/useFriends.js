import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService'; // Import the user service

const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingFriend, setAddingFriend] = useState(false);
  const [removingFriend, setRemovingFriend] = useState(false);

  // useCallback to memoize the fetchFriends function
  // This prevents unnecessary re-renders in components that use it
  const fetchFriends = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await userService.getMyFriends();
      setFriends(response.data); // Assuming response.data is the array of friends
    } catch (err) {
      console.error("Failed to fetch friends:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means it's created once

  // Fetch friends when the component mounts
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]); // Dependency on fetchFriends to satisfy ESLint, though it's stable due to useCallback

  const addFriend = async (friendId) => {
    setAddingFriend(true);
    setError(null);
    try {
      await userService.addFriend(friendId);
      // After successful addition, refetch the list to get the updated state from the server
      await fetchFriends();
      return true; // Indicate success
    } catch (err) {
      console.error("Failed to add friend:", err);
      setError(err);
      return false; // Indicate failure
    } finally {
      setAddingFriend(false);
    }
  };

  const removeFriend = async (friendId) => {
    setRemovingFriend(true);
    setError(null);
    try {
      await userService.removeFriend(friendId);
      // After successful removal, refetch the list
      await fetchFriends();
      return true; // Indicate success
    } catch (err) {
      console.error("Failed to remove friend:", err);
      setError(err);
      return false; // Indicate failure
    } finally {
      setRemovingFriend(false);
    }
  };

  return {
    friends,
    loading,
    error,
    addingFriend,
    removingFriend,
    fetchFriends, // Expose fetchFriends for manual refresh if needed
    addFriend,
    removeFriend,
  };
};

export default useFriends;