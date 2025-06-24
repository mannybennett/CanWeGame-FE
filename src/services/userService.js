import api from './api';

const userService = {
  getAllUsers: async () => {
    return await api.get('/User/all');
  },
  getUserById: async (userId) => {
    return await api.get(`/User/${userId}`);
  },
  addFriend: async (friendId) => {
    return await api.post('/User/friends/add', { friendId });
  },
  removeFriend: async (friendId) => {
    return await api.delete('/User/friends/remove', { data: { friendId } });
  },
  getMyFriends: async () => {
    return await api.get('/User/friends');
  },
};

export default userService;